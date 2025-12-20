import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { ToasterService } from '../../../services/toaster.service';
import { takeUntil } from 'rxjs/operators';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, ReplaySubject, Subscription } from 'rxjs';
import { ActionPettycashRequest, ExpenseResults, PettyCashReportResponse } from '../../../models/api-models/Expences';
import { CommonPaginatedRequest } from '../../../models/api-models/Invoice';
import { ExpenseService } from '../../../services/expences.service';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { PAGE_SIZE_OPTIONS } from '../../../app.constant';
import { Lightbox } from 'ngx-lightbox';
import { ServiceConfig } from '../../../services/service.config';
import { GeneralService } from '../../../services/general.service';
import { cloneDeep, forEach, isArray, map } from '../../../lodash-optimized';

@Component({
    selector: 'app-rejected-list',
    
      standalone: false,templateUrl: './rejected-list.component.html',
    styleUrls: ['./rejected-list.component.scss'],
})
export class RejectedListComponent implements OnInit, OnChanges {
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;
    /** Instance of delete entry modal */
    @ViewChild('deleteEntryModal') public deleteEntryModal;
    @Output() public isFilteredSelected: EventEmitter<boolean> = new EventEmitter();
    /** This will emit the from and to date returned by api */
    @Output() public reportDates: EventEmitter<any> = new EventEmitter();
    /** This will emit the filter object to reload the report */
    @Output() public reloadPendingReportList: EventEmitter<any> = new EventEmitter();
    /** This will emit the filter object to reload the report */
    @Output() public reloadReportList: EventEmitter<any> = new EventEmitter();
    @Input() public isClearFilter: boolean = false;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Taking report as input */
    @Input() public pettyCashRejectedReportResponse: PettyCashReportResponse = null;
    /** True if report loading in process */
    @Input() public isPettyCashRejectedReportLoading: boolean = false;
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public pettycashRequest: CommonPaginatedRequest = new CommonPaginatedRequest();
    public rejectedItems: ExpenseResults[] = [];
    public expensesItems$: Observable<ExpenseResults[]>;
    public universalDate$: Observable<any>;
    public todaySelected: boolean = false;
    public todaySelected$: Observable<boolean> = observableOf(false);
    public actionPettycashRequest: ActionPettycashRequest = new ActionPettycashRequest();
    /** Table columns for rejected report */
    public rejectedTableColumns: string[] = ['s_no', 'entry_date', 'submitted_by', 'account', 'amount', 'receipt', 'file', 'reason_rejection', 'action'];
    /** It will hold reference of delete modal */
    public deleteEntryModalRef: any;
    /** Holds company uniquename */
    public companyUniqueName: string;
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;

    constructor(
        private store: Store<AppState>,
        private toaster: ToasterService,
        private cdRef: ChangeDetectorRef,
        @Inject(ServiceConfig) private serviceConfig,
        private expenseService: ExpenseService,
        public dialog: MatDialog,
        private lightbox: Lightbox,
        private generalService: GeneralService
    ) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
        this.todaySelected$ = this.store.pipe(select(state => state.session.todaySelected), takeUntil(this.destroyed$));

        observableCombineLatest([this.universalDate$, this.todaySelected$]).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
            if (!Array.isArray(resp[0])) {
                return;
            }
            let dateObj = resp[0];
            this.todaySelected = resp[1];
            if (dateObj && !this.todaySelected) {
                let universalDate = cloneDeep(dateObj);
                let from = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                let to = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                if (from && to) {
                    this.pettycashRequest.from = from;
                    this.pettycashRequest.to = to;
                    this.pettycashRequest.page = 1;
                    this.pettycashRequest.status = 'rejected';
                }
            }
        });

        this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$)).subscribe(response => {
            this.companyUniqueName = response;
        });
    }

    /**
     * Initializes the component
     *
     * @memberof RejectedListComponent
     */
    public ngOnInit(): void {
        this.getReportResponse();
    }

    /**
     * Emits the filter to reload report
     *
     * @param {CommonPaginatedRequest} salesDetailedfilter
     * @memberof RejectedListComponent
     */
    public getPettyCashRejectedReports(salesDetailedfilter: CommonPaginatedRequest): void {
        salesDetailedfilter.status = 'rejected';
        salesDetailedfilter.sort = this.pettycashRequest.sort;
        salesDetailedfilter.sortBy = this.pettycashRequest.sortBy;
        this.reloadReportList.emit(salesDetailedfilter);
    }

    /**
     * Updates the variables if data updated from parent
     *
     * @param {SimpleChanges} changes
     * @memberof RejectedListComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['isClearFilter']) {
            if (changes['isClearFilter'].currentValue) {
                this.clearFilter();
            }
        }

        if (changes['pettyCashRejectedReportResponse'] && changes['pettyCashRejectedReportResponse'].currentValue) {
            this.getReportResponse();
        }
    }

    /**
     * It will clear filters
     *
     * @memberof RejectedListComponent
     */
    public clearFilter(): void {
        this.pettycashRequest.sort = '';
        this.pettycashRequest.sortBy = '';
        this.pettycashRequest.page = 1;
    }

    /**
     * It will revert the item from reject to pending
     *
     * @param {ExpenseResults} item
     * @memberof RejectedListComponent
     */
    public revertActionClicked(item: ExpenseResults): void {
        this.actionPettycashRequest.actionType = 'revert';
        this.actionPettycashRequest.uniqueName = item?.uniqueName;
        this.expenseService.actionPettycashReports(this.actionPettycashRequest, {}).pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res?.status === 'success') {
                this.toaster.showSnackBar("success", res?.body);
                this.pettycashRequest.page = this.generalService.adjustPageIndex(this.pettyCashRejectedReportResponse?.totalItems, this.pettyCashRejectedReportResponse?.page, this.pettyCashRejectedReportResponse?.count);
                this.getPettyCashRejectedReports(this.pettycashRequest);
                this.getPettyCashPendingReports(this.pettycashRequest);
            } else if(res?.message) {
                this.toaster.showSnackBar("error", res.message);
            }
        });
    }

    /**
     * Emits the filter to reload pending report
     *
     * @param {CommonPaginatedRequest} salesDetailedfilter
     * @memberof RejectedListComponent
     */
    public getPettyCashPendingReports(salesDetailedfilter: CommonPaginatedRequest): void {
        salesDetailedfilter.status = 'pending';
        this.reloadPendingReportList.emit(salesDetailedfilter);
    }

    /**
     * It opens the dialog to delete item
     *
     * @param {ExpenseResults} item
     * @param {TemplateRef<any>} ref
     * @memberof RejectedListComponent
     */
    public deleteActionClicked(item: ExpenseResults, ref: TemplateRef<any>): void {
        this.actionPettycashRequest.actionType = 'delete';
        this.actionPettycashRequest.uniqueName = item?.uniqueName;
        this.deleteEntryModalRef = this.dialog.open(ref, { disableClose: true });
    }

    /**
     * Callback for page change
     *
     * @param {*} event
     * @returns {void}
     * @memberof RejectedListComponent
     */
    /**
     * Handles pagination events for petty cash rejected reports
     *
     * @param {PageEvent} event - Contains pagination details
     * @memberof RejectedListComponent
     */
    public handlePageEvent(event: PageEvent): void {
        this.pettycashRequest.page = this.pettycashRequest.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.pettycashRequest.count = event.pageSize;
        this.getPettyCashRejectedReports(this.pettycashRequest);
    }

    /**
     * Calls detect changes method
     *
     * @memberof RejectedListComponent
     */
    public detectChanges(): void {
        if (!this.cdRef['destroyed']) {
            this.cdRef.detectChanges();
        }
    }

    /**
     * Releases memory
     *
     * @memberof RejectedListComponent
     */
    public ngOnDestroy(): void {
        this.isDestroying = true;

        // Clean up all tracked subscriptions first
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });
        this.subscriptions = [];

        // Safely complete the destroyed$ subject
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }
    }

    /**
     * Gets report response
     *
     * @private
     * @memberof RejectedListComponent
     */
    private getReportResponse(): void {
        if (this.pettyCashRejectedReportResponse) {
            this.rejectedItems = this.pettyCashRejectedReportResponse.results?.map((rejected, index) => {
                rejected.index = index;
                return rejected;
            });
            this.reportDates.emit([this.pettyCashRejectedReportResponse.fromDate, this.pettyCashRejectedReportResponse.toDate]);
            setTimeout(() => {
                this.detectChanges();
            }, 400);
        }
    }

    /**
     * Deleting the confirmed entry
     *
     * @memberof RejectedListComponent
     */
    public deleteEntry(): void {
        this.expenseService.actionPettycashReports(this.actionPettycashRequest, {}).pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res?.status === 'success') {
                this.toaster.showSnackBar("success", res?.body);
                this.pettycashRequest.page = this.generalService.adjustPageIndex(this.pettyCashRejectedReportResponse?.totalItems, this.pettyCashRejectedReportResponse?.page, this.pettyCashRejectedReportResponse?.count);
                this.getPettyCashRejectedReports(this.pettycashRequest);
            } else if(res?.message) {
                this.toaster.showSnackBar("error", res.message);
            }
        });
    }

    /**
     * Callback for sorting change
     *
     * @param {*} event
     * @memberof RejectedListComponent
     */
    public sortChange(event: any): void {
        this.pettycashRequest.sortBy = event?.active;
        this.pettycashRequest.sort = event?.direction;
        this.getPettyCashRejectedReports(this.pettycashRequest);
    }

    /**
     * This will open the images in lightbox
     *
     * @param {*} $event
     * @param {*} fileNames
     * @memberof RejectedListComponent
     */
     public openZoomImageView(fileNames: any): void {
        let images = [];
        fileNames?.forEach(file => {
            images.push({ src: (this.serviceConfig.ApiUrl || ApiUrl) + 'company/' + this.companyUniqueName + '/image/' + file });
        });
        this.lightbox.open(images, 0);
    }

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
