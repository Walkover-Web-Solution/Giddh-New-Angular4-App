import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import {
    TRIAL_BALANCE_VIEWPORT_LIMIT,
} from 'apps/web-giddh/src/app/financial-reports/constants/trial-balance-profit.constant';
import { FinancialReportsComponentStore } from 'apps/web-giddh/src/app/financial-reports/financial-reports.store';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';
import { ReportType } from 'apps/web-giddh/src/app/multi-currency-reports/multi-currency.const';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { TlPlService } from 'apps/web-giddh/src/app/services/tl-pl.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Configuration } from '../../../../../../../app.constant';

@Component({
selector: '[profit-loss-grid-row]',
    templateUrl: './profit-loss-grid-row.component.html',
    styleUrls: ['./profit-loss-grid-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FinancialReportsComponentStore],
    standalone: false
})
export class ProfitLossGridRowComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public groupDetail: ChildGroup;
    @Input() public search: string;
    @Input() public padding: string;
    @Input() public incomeStatement: any;
    @Input() public from: string = '';
    @Input() public to: string = '';
    /** Profit loss headers array */
    @Input() public plHeaders: any[];
    /** True, if all items are expanded  */
    @Input() public expandAll: boolean;
    /** Minimum limit on which Trial balance viewport enables */
    public minimumViewportLimit = TRIAL_BALANCE_VIEWPORT_LIMIT;
    /** True, when expand all button is toggled while search is enabled */
    @Input() public isExpandToggledDuringSearch: boolean;
    /** Hold current url */
    private currentUrl: string = "";
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private cd: ChangeDetectorRef, private router: Router, private financialReportsComponentStore: FinancialReportsComponentStore, private tlPlService: TlPlService, private generalService: GeneralService) {
        this.currentUrl = this.router.url;
    }

    /**
     * Component lifecycle hook
     *
     * @memberof ProfitLossGridRowComponent
     */
    public ngOnInit(): void {
        this.financialReportsComponentStore.tailedReportIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                this.tlPlService.isReportTailed$.next(true);
            }
        });
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.groupDetail && !changes.groupDetail.firstChange && changes.groupDetail.currentValue !== changes.groupDetail.previousValue) {
            this.cd.detectChanges();
        }
        if (changes.search && !changes.search.firstChange && changes.search.currentValue !== changes.search.previousValue) {
            this.cd.detectChanges();
        }
    }

    /**
     *  This will be redirect to ledger
     *
     * @param {*} acc
     * @return {*}  {void}
     * @memberof ProfitLossGridRowComponent
     */
    public entryClicked(acc: any): void {
        if (!acc?.uniqueName) return;

        // Construct direct ledger URL with redirectUrl parameter
        let url = `${location.origin}/pages/ledger/${acc.uniqueName}/${this.from}/${this.to}`;
        const separator = url.includes('?') ? '&' : '?';
        url = url + `${separator}redirectUrl=${encodeURIComponent(this.currentUrl)}`;

        if (Configuration.isElectron) {
            try {
                let electronIpcAvailable = false;

                // Try electronAPI first (secure context)
                if ((window as any).electronAPI && (window as any).electronAPI.send) {
                    try {
                        const electronUrl = `${location.origin}${location.pathname}#./pages/ledger/${acc.uniqueName}/${this.from}/${this.to}`;
                        (window as any).electronAPI.send('open-url', electronUrl);
                        electronIpcAvailable = true;
                    } catch (ipcError) {
                        console.warn('ElectronAPI send failed:', ipcError);
                    }
                }

                // Try legacy electron require (fallback)
                if (!electronIpcAvailable && (window as any).require) {
                    try {
                        const electron = (window as any).require('electron');
                        if (electron && electron.ipcRenderer && electron.ipcRenderer.send) {
                            const electronUrl = `${location.origin}${location.pathname}#./pages/ledger/${acc.uniqueName}/${this.from}/${this.to}`;
                            electron.ipcRenderer.send('open-url', electronUrl);
                            electronIpcAvailable = true;
                        }
                    } catch (requireError) {
                        console.warn('Electron require failed:', requireError);
                    }
                }

                // Fallback to regular window.open if IPC not available
                if (!electronIpcAvailable) {
                    console.warn('Electron IPC not available for page leave utility, opening in new tab');
                    (window as any).open(url, '_blank');
                }
            } catch (error) {
                console.warn('Electron navigation failed, opening in new tab:', error);
                (window as any).open(url, '_blank');
            }
        } else {
            (window as any).open(url, '_blank');
        }
    }

    /**
     * Track by function for profit loss item
     *
     * @param {*} index Index of the item
     * @param {Account} item Current item
     * @return {string} Item uniquename
     * @memberof ProfitLossGridRowComponent
     */
    public trackByFn(index, item: Account): string {
        return item?.uniqueName;
    }

    /**
     * Retrieves the keys of an object.
     *
     * @param obj The object whose keys are to be retrieved.
     * @returns An array of strings representing the keys of the object, or an empty array if the input is null or undefined.
     * @memberof ProfitLossGridRowComponent
     */
    public getKeys(obj: Record<string, any> | null | undefined): string[] | [] {
        if (obj) {
            return Object.keys(obj);
        } else {
            return [];
        }
    }

    /**
     * Call tailed report api with given account/group unique name
     *
     * @param event MatCheckboxChange event
     * @param accountGroupUniqueName Unique name of account/group
     * @param entityType Type of the entity, either 'account' or 'group'
     * @memberof ProfitLossGridRowComponent
     */
    public onItemChecked(event: MatCheckboxChange, accountGroupUniqueName: string, entityType: 'account' | 'group'): void {
        const model = {
            request: {
                reportType: ReportType.PROFIT_LOSS,
                from: this.from,
                to: this.to,
                branchUniqueName: this.generalService.currentBranchUniqueName
            },
            payload: [{ uniqueName: accountGroupUniqueName, entityType: entityType, checked: event.checked }]
        };
        this.financialReportsComponentStore.tailedReportAccountGroup(model);
    }

    /**
     * Releases memory
     *
     * @memberof ProfitLossGridRowComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
