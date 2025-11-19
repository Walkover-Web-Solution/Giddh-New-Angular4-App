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

@Component({
    selector: '[balance-sheet-grid-row]',
    templateUrl: './balance-sheet-grid-row.component.html',
    styleUrls: [`./balance-sheet-grid-row.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FinancialReportsComponentStore]
})
export class BalanceSheetGridRowComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public groupDetail: ChildGroup;
    @Input() public search: string;
    @Input() public padding: string;
    @Input() public from: string = '';
    @Input() public to: string = '';
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
     * @memberof BalanceSheetGridRowComponent
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
     * @memberof BalanceSheetGridRowComponent
     */
    public entryClicked(acc: any): void {
        if (!acc?.uniqueName) return;

        // Construct direct ledger URL with redirectUrl parameter
        let url = `${location.origin}/pages/ledger/${acc.uniqueName}/${this.from}/${this.to}`;
        const separator = url.includes('?') ? '&' : '?';
        url = url + `${separator}redirectUrl=${encodeURIComponent(this.currentUrl)}`;

        if (isElectron) {
            const ipcRenderer = (window as any).require('electron').ipcRenderer;
            const electronUrl = `${location.origin}${location.pathname}#./pages/ledger/${acc.uniqueName}/${this.from}/${this.to}`;
            ipcRenderer.send('open-url', electronUrl);
        } else {
            (window as any).open(url, '_blank');
        }
    }

    /**
     * Track by function for balance sheet item
     *
     * @param {*} index Index of the item
     * @param {Account} item Current item
     * @return {string} Item uniquename
     * @memberof BalanceSheetGridRowComponent
     */
    public trackByFn(index, item: Account): string {
        return item?.uniqueName;
    }

    /**
     * Call tailed report api with given account/group unique name
     *
     * @param event MatCheckboxChange event
     * @param accountGroupUniqueName Unique name of account/group
     * @param entityType Type of the entity, either 'account' or 'group'
     * @memberof BalanceSheetGridRowComponent
     */
    public onItemChecked(event: MatCheckboxChange, accountGroupUniqueName: string, entityType: 'account' | 'group'): void {
        const model = {
            request: {
                reportType: ReportType.BalanceSheet,
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
     * @memberof BalanceSheetGridRowComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
