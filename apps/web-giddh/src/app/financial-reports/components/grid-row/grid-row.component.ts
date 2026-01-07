import { DOCUMENT } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
} from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Account, ChildGroup } from '../../../models/api-models/Search';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flatten-accounts-result-item.interface';
import { SearchService } from '../../../services/search.service';
import { TRIAL_BALANCE_VIEWPORT_LIMIT } from '../../constants/trial-balance-profit.constant';
import { Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ReportType } from '../../../multi-currency-reports/multi-currency.const';
import { FinancialReportsComponentStore } from '../../financial-reports.store';
import { TlPlService } from '../../../services/tl-pl.service';
import { GeneralService } from '../../../services/general.service';
import { Configuration } from '../../../app.constant';
import { includes, indexOf } from '../../../lodash-optimized';

@Component({
selector: '[grid-row]',
    styleUrls: ['./grid-row.component.scss'],
    templateUrl: './grid-row.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FinancialReportsComponentStore],
    standalone: false
})
export class GridRowComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public groupDetail: ChildGroup;
    @Input() public search: string;
    @Input() public from: string;
    @Input() public to: string;
    @Input() public padding: string;
    /** True, if all items are expanded  */
    @Input() public expandAll: boolean;
    public modalUniqueName: string = null;
    public accountDetails: IFlattenAccountsResultItem;
    /** Minimum limit on which Trial balance viewport enables */
    public minimumViewportLimit = TRIAL_BALANCE_VIEWPORT_LIMIT;
    /** True, when expand all button is toggled while search is enabled */
    @Input() public isExpandToggledDuringSearch: boolean;
    /**
     * Emits open account modal with account details
     *
     * @type {EventEmitter<any>}
     * @memberof GridRowComponent
     */
    @Output() public openAccountModal: EventEmitter<any> = new EventEmitter();
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Hold current url */
    private currentUrl: string = "";

    constructor(
        private cd: ChangeDetectorRef,
        private searchService: SearchService,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document,
        private router: Router,
        private financialReportsComponentStore: FinancialReportsComponentStore,
        private tlPlService: TlPlService,
        private generalService: GeneralService
    ) {
        this.currentUrl = this.router.url;
    }

    /**
     * Component lifecycle hook
     *
     * @memberof GridRowComponent
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
      * @memberof GridRowComponent
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

                    }
                }

                // Fallback to regular window.open if IPC not available
                if (!electronIpcAvailable) {

                    (window as any).open(url, '_blank');
                }
            } catch (error) {

                (window as any).open(url, '_blank');
            }
        } else {
            (window as any).open(url, '_blank');
        }
    }

    public accountInfo(acc, e: Event) {
        this.searchService.loadDetails(acc?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body) {
                this.accountDetails = response.body;
                const parentGroups = response.body?.parentGroups?.join(', ');
                const creditorsString = 'currentliabilities, sundrycreditors';
                const debtorsString = 'currentassets, sundrydebtors';
                if (parentGroups?.indexOf(creditorsString) > -1 || parentGroups?.indexOf(debtorsString) > -1) {
                    this.modalUniqueName = response.body?.uniqueName;
                } else {
                    this.modalUniqueName = '';
                    this.entryClicked(acc);
                }
                this.cd.detectChanges();
            }
        });
    }

    public hideModal() {
        this.modalUniqueName = null;
    }

    public trackByFn(index, item: Account) {
        return item?.uniqueName;
    }

    /**
     * Releases memory
     *
     * @memberof GridRowComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles when SMS/E-mail modal is opened from the account detail popover
     *
     * @param {*} modalInstance Modal instance to be opened
     * @memberof GridRowComponent
     */
    public handleModalOpened(modalInstance: any): void {
        const parentNode = this.document.querySelector('.financial-report-account-detail-container');
        /* Need to remove the element from the popover so that it could be attached to body as we show the account
         modal within a popover which can't display the modal within it */
        this.renderer.addClass(modalInstance._element.nativeElement, 'm-0')
        this.renderer.removeChild(parentNode, modalInstance._element.nativeElement);
    }

    /**
     * Call tailed report api with given account/group unique name
     *
     * @param event MatCheckboxChange event
     * @param accountGroupUniqueName Unique name of account/group
     * @param entityType Type of the entity, either 'account' or 'group'
     * @memberof GridRowComponent
     */
     public onItemChecked(event: MatCheckboxChange, accountGroupUniqueName: string, entityType: 'account' | 'group'): void {
        const model = {
            request: {
                reportType: ReportType.TRIAL_BALANCE,
                from: this.from,
                to: this.to,
                branchUniqueName: this.generalService.currentBranchUniqueName
            },
            payload: [{ uniqueName: accountGroupUniqueName, entityType: entityType, checked: event.checked }]
        };
        this.financialReportsComponentStore.tailedReportAccountGroup(model);
    }
}
