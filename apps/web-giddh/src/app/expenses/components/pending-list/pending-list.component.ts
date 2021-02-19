import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { ExpencesAction } from '../../../actions/expences/expence.action';
import { ToasterService } from '../../../services/toaster.service';
import { takeUntil } from 'rxjs/operators';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { ActionPettycashRequest, ExpenseResults, PettyCashReportResponse } from '../../../models/api-models/Expences';
import { ExpenseService } from '../../../services/expences.service';
import { CommonPaginatedRequest } from '../../../models/api-models/Invoice';
import { FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import * as moment from 'moment/moment';

@Component({
    selector: 'app-pending-list',
    templateUrl: './pending-list.component.html',
    styleUrls: ['./pending-list.component.scss'],
})

export class PendingListComponent implements OnInit, OnChanges {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public expensesItems: ExpenseResults[] = [];
    public pettyCashReportsResponse$: Observable<PettyCashReportResponse>;
    public pettyCashPendingReportResponse: PettyCashReportResponse = null;
    public getPettycashReportInprocess$: Observable<boolean>;
    public getPettycashReportSuccess$: Observable<boolean>;
    public universalDate$: Observable<any>;
    /** This will hold if today is selected in universal */
    public todaySelected: boolean = false;
    public todaySelected$: Observable<boolean> = observableOf(false);
    public from: string;
    public to: string;
    public selectedEntryForApprove: ExpenseResults;

    public isRowExpand: boolean = false;
    public pettycashRequest: CommonPaginatedRequest = new CommonPaginatedRequest();
    @Output() public selectedRowInput: EventEmitter<ExpenseResults> = new EventEmitter();
    @Output() public selectedRowToggle: EventEmitter<boolean> = new EventEmitter();
    @Output() public isFilteredSelected: EventEmitter<boolean> = new EventEmitter();
    @Input() public isClearFilter: boolean = false;

    public showSubmittedBySearch: boolean = false;
    public submittedBySearchInput: FormControl = new FormControl();

    public showAccountSearch: boolean = false;
    public accountSearchInput: FormControl = new FormControl();

    public showPaymentReceiveSearch: boolean = false;
    public paymentReceiveSearchInput: FormControl = new FormControl();

    public approveEntryModalRef: BsModalRef;
    public filterModalRef: BsModalRef;
    public approveEntryRequestInProcess: boolean = false;

    constructor(private store: Store<AppState>,
        private _expenceActions: ExpencesAction,
        private expenseService: ExpenseService,
        private _toasty: ToasterService,
        private _cdRf: ChangeDetectorRef, private _modalService: BsModalService) {
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
        this.todaySelected$ = this.store.pipe(select(p => p.session.todaySelected), takeUntil(this.destroyed$));
        this.pettyCashReportsResponse$ = this.store.pipe(select(p => p.expense.pettycashReport), takeUntil(this.destroyed$));
        this.getPettycashReportInprocess$ = this.store.pipe(select(p => p.expense.getPettycashReportInprocess), takeUntil(this.destroyed$));
        this.getPettycashReportSuccess$ = this.store.pipe(select(p => p.expense.getPettycashReportSuccess), takeUntil(this.destroyed$));

        observableCombineLatest([this.universalDate$, this.todaySelected$]).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
			if (!Array.isArray(resp[0])) {
				return;
			}
			let dateObj = resp[0];
			this.todaySelected = resp[1];
			if (dateObj && !this.todaySelected) {
				let universalDate = _.cloneDeep(dateObj);
				let from = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
				let to = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
				if (from && to) {
					this.pettycashRequest.from = from;
					this.pettycashRequest.to = to;
					this.pettycashRequest.page = 1;
					this.pettycashRequest.status = 'pending';
				}
			}
		});
    }

    public ngOnInit() {
        this.pettyCashReportsResponse$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.pettyCashPendingReportResponse = res;
                this.expensesItems = res.results;
                setTimeout(() => {
                    this.detectChanges();
                }, 500);
            }
        });
    }

    public showApproveConfirmPopup(ref: TemplateRef<any>, item: ExpenseResults) {
        this.approveEntryModalRef = this._modalService.show(ref, { class: 'modal-md', backdrop: true, ignoreBackdropClick: true });
        this.selectedEntryForApprove = item;
    }

    public hideApproveConfirmPopup(isApproved) {
        if (!isApproved) {
            this.approveEntryModalRef.hide();
            this.selectedEntryForApprove = null;
        } else {
            this.approveEntry();
        }
    }

    public showFilterModal(ref: TemplateRef<any>) {
        this.filterModalRef = this._modalService.show(ref, { class: 'modal-md' });
    }

    public hideFilterModal() {
        this.filterModalRef.hide();
    }

    public async approveEntry() {
        if (!this.selectedEntryForApprove.baseAccount.uniqueName) {
            this._toasty.errorToast(this.localeData.approve_entry_error);
            this.hideApproveConfirmPopup(false);
            return;
        }

        this.approveEntryRequestInProcess = true;
        let ledgerRequest;
        let actionType: ActionPettycashRequest = {
            actionType: 'approve',
            uniqueName: this.selectedEntryForApprove.uniqueName,
            accountUniqueName: this.selectedEntryForApprove.baseAccount.uniqueName
        };
        try {
            ledgerRequest = await this.expenseService.getPettycashEntry(this.selectedEntryForApprove.uniqueName).toPromise();
        } catch (e) {
            this.approveEntryRequestInProcess = false;
            this._toasty.errorToast(e);
            this.hideApproveConfirmPopup(false);
            return;
        }

        this.expenseService.actionPettycashReports(actionType, { ledgerRequest: ledgerRequest.body }).subscribe((res) => {
            this.approveEntryRequestInProcess = false;
            if (res.status === 'success') {
                this._toasty.successToast(res.body);
                // if entry approved successfully then re get all entries with already sated filter params
                this.getPettyCashPendingReports(this.pettycashRequest);
            } else {
                this._toasty.errorToast(res.message);
            }
            this.hideApproveConfirmPopup(false);
        });
    }

    public getPettyCashPendingReports(SalesDetailedfilter: CommonPaginatedRequest) {
        SalesDetailedfilter.status = 'pending';
        SalesDetailedfilter.sort = this.pettycashRequest.sort;
        SalesDetailedfilter.sortBy = this.pettycashRequest.sortBy;
        this.store.dispatch(this._expenceActions.GetPettycashReportRequest(SalesDetailedfilter));
    }

    public rowClicked(item: ExpenseResults) {
        this.isRowExpand = true;
        this.selectedRowInput.emit(item);
        this.selectedRowToggle.emit(true);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['isClearFilter']) {
            if (changes['isClearFilter'].currentValue) {
                this.clearFilter();
            }
        }
    }

    public sort(ord: 'asc' | 'desc' = 'asc', key: string) {
        this.pettycashRequest.sortBy = key;
        this.pettycashRequest.sort = ord;
        this.getPettyCashPendingReports(this.pettycashRequest);
    }

    public clearFilter() {
        this.pettycashRequest.sort = '';
        this.pettycashRequest.sortBy = '';
        this.pettycashRequest.page = 1;
    }

    public pageChanged(ev: any): void {
        if (ev.page === this.pettycashRequest.page) {
            return;
        }
        this.pettycashRequest.page = ev.page;
        this.getPettyCashPendingReports(this.pettycashRequest);
    }

    detectChanges() {
        if (!this._cdRf['destroyed']) {
            this._cdRf.detectChanges();
        }
    }

    public toggleSearch(fieldName: string, el: any) {
        if (fieldName === 'submittedBy') {
            this.showSubmittedBySearch = true;
            this.showPaymentReceiveSearch = false;
            this.showAccountSearch = false;
        } else if (fieldName === 'payment/receive') {
            this.showSubmittedBySearch = false;
            this.showPaymentReceiveSearch = true;
            this.showAccountSearch = false;
        } else if (fieldName === 'account') {
            this.showSubmittedBySearch = false;
            this.showPaymentReceiveSearch = false;
            this.showAccountSearch = true;
        }

        setTimeout(() => {
            el.focus();
        }, 200);
    }

    public clickedOutside(event, el, fieldName: string) {
        if (fieldName === 'submittedBy') {
            if (this.submittedBySearchInput.value !== null && this.submittedBySearchInput.value !== '') {
                return;
            }
        } else if (fieldName === 'payment/receive') {
            if (this.paymentReceiveSearchInput.value !== null && this.paymentReceiveSearchInput.value !== '') {
                return;
            }
        } else if (fieldName === 'account') {
            if (this.accountSearchInput.value !== null && this.accountSearchInput.value !== '') {
                return;
            }
        }

        if (this.childOf(event.target, el)) {
            return;
        } else {
            if (fieldName === 'submittedBy') {
                this.showSubmittedBySearch = false;
            } else if (fieldName === 'payment/receive') {
                this.showPaymentReceiveSearch = false;
            } else if (fieldName === 'account') {
                this.showAccountSearch = false;
            }
        }
    }

    /* tslint:disable */
    public childOf(c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    }

    /**
     * This will replace the search field title
     *
     * @param {string} title
     * @returns {string}
     * @memberof PendingListComponent
     */
    public replaceTitle(title: string): string {
        if(this.localeData && this.localeData.search_field) {
            return this.localeData.search_field.replace("[FIELD]", title);
        } else {
            return title;
        }
    }
}
