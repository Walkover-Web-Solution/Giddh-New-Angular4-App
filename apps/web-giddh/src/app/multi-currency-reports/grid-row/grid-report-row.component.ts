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
    Output,
    Renderer2,
    SimpleChanges,
} from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Account, ChildGroup } from '../../models/api-models/Search';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flatten-accounts-result-item.interface';
import { TRIAL_BALANCE_VIEWPORT_LIMIT } from '../../financial-reports/constants/trial-balance-profit.constant';
import { SearchService } from '../../services/search.service';

@Component({
    selector: '[grid-report-row]',
    styleUrls: ['./grid-report-row.component.scss'],
    templateUrl: './grid-report-row.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridReportRowComponent implements OnChanges, OnDestroy {
    /** Child group details */
    @Input() public groupDetail: ChildGroup;
    /** Search term for filtering results */
    @Input() public search: string;
    /** Padding applied to the component view */
    @Input() public padding: string;
    /** True, if all items are expanded */
    @Input() public expandAll: boolean;
    /** True, when expand all button is toggled while search is enabled */
    @Input() public isExpandToggledDuringSearch: boolean;
    /** Emits an event to open the account modal with the selected account details */
    @Output() public openAccountModal: EventEmitter<any> = new EventEmitter();
    /** Unique name for the modal */
    public modalUniqueName: string = null;
    /** Details of the selected account */
    public accountDetails: IFlattenAccountsResultItem;
    /** Minimum limit on which Trial balance viewport enables */
    public minimumViewportLimit = TRIAL_BALANCE_VIEWPORT_LIMIT;
    /** Subject to release memory when destroying subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private changeDetectionRef: ChangeDetectorRef,
        private searchService: SearchService,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document
    ) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes?.groupDetail && !changes.groupDetail.firstChange && changes.groupDetail.currentValue !== changes.groupDetail.previousValue) {
            this.changeDetectionRef.detectChanges();
        }
        if (changes?.search && !changes.search.firstChange && changes.search.currentValue !== changes.search.previousValue) {
            this.changeDetectionRef.detectChanges();
        }
    }

    /**
     * Load detailed account information and update the modal state.
     *
     * @param {any} account - Selected account details
     * @param {Event} event - Triggering event
     * @returns {void}
     * @memberof GridRowComponent
     */
    public accountInfo(account: any, event: Event): void {
        this.searchService.loadDetails(account?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body) {
                this.accountDetails = response.body;
                const parentGroups = response.body?.parentGroups?.join(', ');
                const creditorsString = 'currentliabilities, sundrycreditors';
                const debtorsString = 'currentassets, sundrydebtors';
                if (parentGroups?.indexOf(creditorsString) > -1 || parentGroups?.indexOf(debtorsString) > -1) {
                    this.modalUniqueName = response.body?.uniqueName;
                } else {
                    this.modalUniqueName = '';
                }
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    /**
     * Hide the currently open modal.
     *
     * @returns {void}
     * @memberof GridRowComponent
     */
    public hideModal(): void {
        this.modalUniqueName = null;
    }

    /**
     * Custom track-by function for rendering lists efficiently.
     *
     * @param {number} index - Index of the item
     * @param {Account} item - Current item in the list
     * @returns {string} - Unique identifier for the item
     * @memberof GridRowComponent
     */
    public trackByFn(index: number, item: Account): string {
        return item?.uniqueName;
    }

    /**
     * Releases memory
     *
     * @returns {void}
     * @memberof GridRowComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles when SMS/E-mail modal is opened from the account detail popover
     *
     * @param {any} modalInstance Modal instance to be opened
     * @memberof GridRowComponent
     */
    public handleModalOpened(modalInstance: any): void {
        const parentNode = this.document.querySelector('.financial-report-account-detail-container');
        /* Need to remove the element from the popover so that it could be attached to body as we show the account
         modal within a popover which can't display the modal within it */
        this.renderer.addClass(modalInstance._element.nativeElement, 'm-0');
        this.renderer.removeChild(parentNode, modalInstance._element.nativeElement);
    }
}
