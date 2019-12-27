import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { ExpencesAction } from '../../../actions/expences/expence.action';
import { ToasterService } from '../../../services/toaster.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { ActionPettycashRequest, ExpenseResults, PettyCashReportResponse } from '../../../models/api-models/Expences';
import { ExpenseService } from '../../../services/expences.service';
import { CommonPaginatedRequest } from '../../../models/api-models/Invoice';
import { FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
    selector: 'app-pending-list',
    templateUrl: './pending-list.component.html',
    styleUrls: ['./pending-list.component.scss'],
})

export class PendingListComponent implements OnInit, OnChanges {

    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public expensesItems: ExpenseResults[] = [];
    public pettyCashReportsResponse$: Observable<PettyCashReportResponse>;
    public pettyCashPendingReportResponse: PettyCashReportResponse = null;
    public getPettycashReportInprocess$: Observable<boolean>;
    public getPettycashReportSuccess$: Observable<boolean>;
    public universalDate$: Observable<any>;
    public todaySelected$: Observable<boolean> = observableOf(false);
    public from: string;
    public to: string;
    public key: string = 'entry_date';
    public order: string = 'asc';
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
        this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
        this.todaySelected$ = this.store.select(p => p.session.todaySelected).pipe(takeUntil(this.destroyed$));
        this.pettyCashReportsResponse$ = this.store.select(p => p.expense.pettycashReport).pipe(takeUntil(this.destroyed$));
        this.getPettycashReportInprocess$ = this.store.select(p => p.expense.getPettycashReportInprocess).pipe(takeUntil(this.destroyed$));
        this.getPettycashReportSuccess$ = this.store.select(p => p.expense.getPettycashReportSuccess).pipe(takeUntil(this.destroyed$));
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
            this._toasty.errorToast('Please Select Base Account First For Approving An Entry...');
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
        this.store.dispatch(this._expenceActions.GetPettycashReportRequest(SalesDetailedfilter));
    }

    public rowClicked(item: ExpenseResults) {
        this.isRowExpand = true;
        this.selectedRowInput.emit(item);
        this.selectedRowToggle.emit(true);
        // this.store.dispatch(this._expenceActions.getPettycashEntryRequest(item.uniqueName));
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
}
