import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { ToasterService } from '../../../services/toaster.service';
import { takeUntil } from 'rxjs/operators';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { ActionPettycashRequest, ExpenseResults, PettyCashReportResponse } from '../../../models/api-models/Expences';
import { ExpenseService } from '../../../services/expences.service';
import { CommonPaginatedRequest } from '../../../models/api-models/Invoice';
import { FormControl } from '@angular/forms';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Lightbox } from 'ngx-lightbox';

@Component({
    selector: 'app-pending-list',
    templateUrl: './pending-list.component.html',
    styleUrls: ['./pending-list.component.scss'],
})
export class PendingListComponent implements OnInit, OnChanges {
    /** Instance of approve confirm dialog */
    @ViewChild("approveConfirm") public approveConfirm;
    /** Instance of approve confirm dialog */
    @ViewChild("rejectConfirm") public rejectConfirm;
    /** Instance of sort header */
    @ViewChild(MatSort) sortBy: MatSort;
    @Input() public isClearFilter: boolean = false;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Taking report as input */
    @Input() public pettyCashPendingReportResponse: PettyCashReportResponse = null;
    /** True if report loading in process */
    @Input() public isPettyCashPendingReportLoading: boolean = false;
    @Output() public selectedRowInput: EventEmitter<ExpenseResults> = new EventEmitter();
    @Output() public selectedRowToggle: EventEmitter<boolean> = new EventEmitter();
    @Output() public isFilteredSelected: EventEmitter<boolean> = new EventEmitter();
    /** This will emit the from and to date returned by api */
    @Output() public reportDates: EventEmitter<any> = new EventEmitter();
    /** This will emit the filter object to reload the report */
    @Output() public reloadReportList: EventEmitter<any> = new EventEmitter();
    @Output() public reloadRejectReportList: EventEmitter<any> = new EventEmitter();
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public expensesItems: ExpenseResults[] = [];
    public universalDate$: Observable<any>;
    /** This will hold if today is selected in universal */
    public todaySelected: boolean = false;
    public todaySelected$: Observable<boolean> = observableOf(false);
    public from: string;
    public to: string;
    public selectedEntryForApprove: ExpenseResults;
    public isRowExpand: boolean = false;
    public pettycashRequest: CommonPaginatedRequest = new CommonPaginatedRequest();
    public showSubmittedBySearch: boolean = false;
    public submittedBySearchInput: FormControl = new FormControl();
    public showAccountSearch: boolean = false;
    public accountSearchInput: FormControl = new FormControl();
    public showPaymentReceiveSearch: boolean = false;
    public paymentReceiveSearchInput: FormControl = new FormControl();
    public approveEntryModalRef: any;
    public approveEntryRequestInProcess: boolean = false;
    /** Entry against object */
    public entryAgainstObject = {
        base: '',
        against: '',
        dropDownOption: [],
        model: '',
        name: ''
    };
    /** Entry object */
    public accountEntryPettyCash: any = { particular: { name: "" } };
    /** Table columns for pending report */
    public pendingTableColumns: string[] = ['s_no', 'entry_date', 'submitted_by', 'account', 'amount', 'receipt', 'file', 'description', 'action'];
    /** Holds company uniquename */
    public companyUniqueName: string;

    constructor(
        private store: Store<AppState>,
        private expenseService: ExpenseService,
        private toaster: ToasterService,
        private cdRef: ChangeDetectorRef,
        public dialog: MatDialog,
        private lightbox: Lightbox
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
                let universalDate = _.cloneDeep(dateObj);
                let from = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                let to = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                if (from && to) {
                    this.pettycashRequest.from = from;
                    this.pettycashRequest.to = to;
                    this.pettycashRequest.page = 1;
                    this.pettycashRequest.status = 'pending';
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
     * @memberof PendingListComponent
     */
    public ngOnInit(): void {
        this.getReportResponse();
    }

    /**
     * Shows approve confirm dialog
     *
     * @param {TemplateRef<any>} ref
     * @param {ExpenseResults} item
     * @memberof PendingListComponent
     */
    public showApproveConfirmPopup(ref: TemplateRef<any>, item: ExpenseResults): void {
        this.accountEntryPettyCash = { particular: { name: item?.baseAccount?.name } };
        this.prepareEntryAgainstObject(item);
        this.approveEntryModalRef = this.dialog.open(ref, {
            width: '500px',
            disableClose: true
        });
        this.selectedEntryForApprove = item;
    }

    /**
     * Hides approve confirm dialog
     *
     * @param {*} event
     * @memberof PendingListComponent
     */
    public hideApproveConfirmPopup(event: any): void {
        if (typeof event === "boolean") {
            this.getPettyCashPendingReports(this.pettycashRequest);
            this.approveEntryModalRef.close();
            this.selectedEntryForApprove = null;
        } else {
            this.approveEntry(event);
        }
    }

    /**
     * Approves the entry
     *
     * @param {*} event
     * @returns
     * @memberof PendingListComponent
     */
    public async approveEntry(event: any) {
        if (!event?.baseAccount?.uniqueName) {
            this.toaster.showSnackBar("error", this.localeData?.approve_entry_error);
            this.hideApproveConfirmPopup(false);
            return;
        }

        this.approveEntryRequestInProcess = true;
        let ledgerRequest;
        let actionType: ActionPettycashRequest = {
            actionType: 'approve',
            uniqueName: event?.uniqueName,
            accountUniqueName: event.baseAccount?.uniqueName
        };
        try {
            ledgerRequest = await this.expenseService.getPettycashEntry(event?.uniqueName).toPromise();
        } catch (e) {
            this.approveEntryRequestInProcess = false;
            this.toaster.showSnackBar("error", e);
            this.hideApproveConfirmPopup(false);
            return;
        }

        let model = ledgerRequest.body;
        if (model.attachedFileUniqueNames?.length > 0) {
            model.attachedFile = model.attachedFileUniqueNames[0];
        }

        this.expenseService.actionPettycashReports(actionType, { ledgerRequest: model }).subscribe((res) => {
            this.approveEntryRequestInProcess = false;
            if (res?.status === 'success') {
                this.toaster.showSnackBar("success", res?.body);
            } else {
                this.toaster.showSnackBar("error", res?.message);
            }
            this.selectedEntryForApprove = null;
            this.getPettyCashPendingReports(this.pettycashRequest);
            this.hideApproveConfirmPopup(false);
        });
    }

    /**
     * Emits the filter to reload report
     *
     * @param {CommonPaginatedRequest} salesDetailedfilter
     * @memberof PendingListComponent
     */
    public getPettyCashPendingReports(salesDetailedfilter: CommonPaginatedRequest): void {
        salesDetailedfilter.status = 'pending';
        salesDetailedfilter.sort = this.pettycashRequest.sort;
        salesDetailedfilter.sortBy = this.pettycashRequest.sortBy;
        this.reloadReportList.emit(salesDetailedfilter);
    }

    /**
     * Shows item's preview on click of item and opens in edit mode
     *
     * @param {ExpenseResults} item
     * @memberof PendingListComponent
     */
    public editExpense(item: ExpenseResults): void {
        this.isRowExpand = true;
        this.selectedRowInput.emit(item);
        this.selectedRowToggle.emit(true);
    }

    /**
     * Updates the variables if data updated from parent
     *
     * @param {SimpleChanges} changes
     * @memberof PendingListComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['isClearFilter']) {
            if (changes['isClearFilter'].currentValue) {
                this.clearFilter();
            }
        }

        if (changes['pettyCashPendingReportResponse'] && changes['pettyCashPendingReportResponse'].currentValue) {
            this.getReportResponse();
        }
    }

    /**
     * It will clear filters
     *
     * @memberof PendingListComponent
     */
    public clearFilter(): void {
        this.pettycashRequest.sort = '';
        this.pettycashRequest.sortBy = '';
        this.pettycashRequest.page = 1;
    }

    /**
     * Callback for page change event
     *
     * @param {*} event
     * @returns {void}
     * @memberof PendingListComponent
     */
    public pageChanged(event: any): void {
        if (event.page === this.pettycashRequest.page) {
            return;
        }
        this.pettycashRequest.page = event.page;
        this.getPettyCashPendingReports(this.pettycashRequest);
    }

    /**
     * Calls detect changes method
     *
     * @private
     * @memberof PendingListComponent
     */
    private detectChanges(): void {
        if (!this.cdRef['destroyed']) {
            this.cdRef.detectChanges();
        }
    }

    /**
     * Gets report response
     *
     * @private
     * @memberof PendingListComponent
     */
    private getReportResponse(): void {
        if (this.pettyCashPendingReportResponse) {
            this.expensesItems = this.pettyCashPendingReportResponse.results?.map((expense, index) => {
                expense.index = index;
                return expense;
            });
            this.reportDates.emit([this.pettyCashPendingReportResponse.fromDate, this.pettyCashPendingReportResponse.toDate]);

            setTimeout(() => {
                this.detectChanges();
            }, 500);
        }
    }

    /**
     * Prepares the entry
     *
     * @private
     * @param {PettyCashResonse} res Petty cash details
     * @memberof PendingListComponent
     */
    private prepareEntryAgainstObject(res: ExpenseResults): void {
        let cashOrBankEntry = res?.baseAccount ? this.isCashBankAccount(res.baseAccount) : false;
        if (res?.entryType === 'sales') {
            this.entryAgainstObject.base = cashOrBankEntry ? 'Receipt Mode' : 'Debtor Name';
            this.entryAgainstObject.against = cashOrBankEntry ? 'Entry against Debtor' : 'Cash Sales';
        } else if (res?.entryType === 'expense') {
            this.entryAgainstObject.base = cashOrBankEntry ? 'Payment Mode' : 'Creditor Name';
            this.entryAgainstObject.against = cashOrBankEntry ? 'Entry against Creditors' : 'Cash Expenses';
        } else {
            this.entryAgainstObject.base = 'Deposit To';
            this.entryAgainstObject.against = null;
        }

        this.entryAgainstObject.model = res?.baseAccount?.uniqueName;
        this.entryAgainstObject.name = res?.baseAccount?.name;
    }

    /**
     * Returns true, if the account belongs to cash or bank account
     *
     * @private
     * @param {*} particular
     * @returns {boolean}
     * @memberof PendingListComponent
     */
    private isCashBankAccount(particular: any): boolean {
        if (particular) {
            return particular.parentGroups.some(parent => parent?.uniqueName === 'bankaccounts' || parent?.uniqueName === 'cash' || parent?.uniqueName === 'loanandoverdraft');
        }
        return false;
    }

    /**
     * Callback for sorting change
     *
     * @param {*} event
     * @memberof PendingListComponent
     */
    public sortChange(event: any): void {
        this.pettycashRequest.sortBy = event?.active;
        this.pettycashRequest.sort = event?.direction;
        this.getPettyCashPendingReports(this.pettycashRequest);
    }

    /**
     * This will open the images in lightbox
     *
     * @param {*} event
     * @param {*} fileNames
     * @memberof PendingListComponent
     */
    public openZoomImageView(event, fileNames: any): void {
        event.preventDefault();
        event.stopPropagation();
        let images = [];
        fileNames?.forEach(file => {
            images.push({ src: ApiUrl + 'company/' + this.companyUniqueName + '/image/' + file });
        });
        this.lightbox.open(images, 0);
    }

    /**
     * Shows approve confirm dialog
     *
     * @param {TemplateRef<any>} ref
     * @param {ExpenseResults} item
     * @memberof PendingListComponent
     */
    public showRejectConfirmPopup(ref: TemplateRef<any>, item: ExpenseResults): void {
        this.selectedEntryForApprove = item;
        this.approveEntryModalRef = this.dialog.open(ref, {
            width: '500px',
            disableClose: true
        });
    }

    /**
     * Hides approve confirm dialog
     *
     * @param {boolean} isApproved
     * @memberof PendingListComponent
     */
    public hideRejectConfirmPopup(isRejected: boolean): void {
        this.approveEntryModalRef.close();

        if (isRejected) {
            this.getPettyCashPendingReports(this.pettycashRequest);
            this.getPettyCashRejectedReports(this.pettycashRequest);
        }
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
        this.reloadRejectReportList.emit(salesDetailedfilter);
    }
}
