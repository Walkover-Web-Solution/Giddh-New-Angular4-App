import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment/moment';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { fromEvent, merge, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { PAGINATION_LIMIT } from '../../../app.constant';
import { cloneDeep, isArray } from '../../../lodash-optimized';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { AdvanceReceiptSummaryRequest, GetAllAdvanceReceiptsRequest } from '../../../models/api-models/Reports';
import { ReceiptService } from '../../../services/receipt.service';
import { ToasterService } from '../../../services/toaster.service';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { ElementViewContainerRef } from '../../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { AppState } from '../../../store';
import {
    ADVANCE_RECEIPT_ADVANCE_SEARCH_AMOUNT_FILTERS,
    ADVANCE_RECEIPT_REPORT_FILTERS,
    RECEIPT_TYPES,
    ReceiptAdvanceSearchModel,
} from '../../constants/reports.constant';
import { ReceiptAdvanceSearchComponent } from '../receipt-advance-search/receipt-advance-search.component';

@Component({
    selector: 'advance-receipt-report',
    templateUrl: './advance-receipt-report.component.html',
    styleUrls: ['./advance-receipt-report.component.scss']
})
export class AdvanceReceiptReportComponent implements AfterViewInit, OnDestroy, OnInit {

    @ViewChild('customerName') public customerName: ElementRef;
    @ViewChild('receiptNumber') public receiptNumber: ElementRef;
    @ViewChild('paymentMode') public paymentMode: ElementRef;
    @ViewChild('invoiceNumber') public invoiceNumber: ElementRef;
    @ViewChild('customerNameParent') public customerNameParent: ElementRef;
    @ViewChild('receiptNumberParent') public receiptNumberParent: ElementRef;
    @ViewChild('paymentModeParent') public paymentModeParent: ElementRef;
    @ViewChild('invoiceNumberParent') public invoiceNumberParent: ElementRef;
    @ViewChild('receiptAdvanceSearchFilter') public receiptAdvanceSearchFilter: ElementViewContainerRef;
    @ViewChild('receiptAdvanceSearchModal') public receiptAdvanceSearchModal: ModalDirective;

    public inlineSearch: any = '';
    public moment = moment;
    public datePickerOptions: any = {
        hideOnEsc: true,
        // parentEl: '#dateRangePickerParent',
        locale: {
            applyClass: 'btn-green',
            applyLabel: 'Go',
            fromLabel: 'From',
            format: 'D-MMM-YY',
            toLabel: 'To',
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom range'
        },
        ranges: {
            'This Month to Date': [
                moment().startOf('month'),
                moment()
            ],
            'This Quarter to Date': [
                moment().quarter(moment().quarter()).startOf('quarter'),
                moment()
            ],
            'This Financial Year to Date': [
                moment().startOf('year').subtract(9, 'year'),
                moment()
            ],
            'This Year to Date': [
                moment().startOf('year'),
                moment()
            ],
            'Last Month': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month')
            ],
            'Last Quater': [
                moment().quarter(moment().quarter()).subtract(1, 'quarter').startOf('quarter'),
                moment().quarter(moment().quarter()).subtract(1, 'quarter').endOf('quarter')
            ],
            'Last Financial Year': [
                moment().startOf('year').subtract(10, 'year'),
                moment().endOf('year').subtract(10, 'year')
            ],
            'Last Year': [
                moment().startOf('year').subtract(1, 'year'),
                moment().endOf('year').subtract(1, 'year')
            ]
        },
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
    };
    public receiptType: Array<any> = RECEIPT_TYPES;
    public modalRef: BsModalRef;
    public message: string;
    public showEntryDate = true;
    /** Stores the list of all receipts */
    public allReceipts: Array<any>;
    /** Stores summary data of all receipts based on filters applied */
    public receiptsSummaryData: any;
    /** Stores the value of pagination limit for template use */
    public paginationLimit: number = PAGINATION_LIMIT;
    /** Stores the current page number */
    public pageConfiguration: { currentPage: number, totalPages: number, totalItems: number } = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1
    };
    public searchQueryParams: any = {
        receiptTypes: [],  // Receipt type
        receiptNumber: '',  // Receipt Number
        baseAccountName: '',  // Customer Name
        particularName: '', // Payment Mode
        invoiceNumber: '',  // Invoice Number
        sortBy: '',  // Sort by
        sort: '' // Sort value
    };
    /** True, if the user clicks to search Receipt */
    public showReceiptSearchBar: boolean = false;
    /** True, if the user clicks to search Customer */
    public showCustomerSearchBar: boolean = false;
    /** True, if the user clicks to search Payment */
    public showPaymentSearchBar: boolean = false;
    /** True, if the user clicks to search Invoice */
    public showInvoiceSearchBar: boolean = false;
    public showClearFilter: boolean = false;

	private advanceSearchModel: ReceiptAdvanceSearchModel = {
		adjustmentVoucherDetails: {
			vouchers: [...RECEIPT_TYPES],
			selectedValue: this.searchQueryParams.receiptTypes[0],
			isDisabled: !!this.searchQueryParams.receiptTypes.length
		},
		totalAmountFilter: {
			filterValues: [...ADVANCE_RECEIPT_ADVANCE_SEARCH_AMOUNT_FILTERS],
			selectedValue: '',
			amount: ''
		},
		unusedAmountFilter: {
			filterValues: [...ADVANCE_RECEIPT_ADVANCE_SEARCH_AMOUNT_FILTERS],
			selectedValue: '',
			amount: ''
		}
	};
    /** Stores universal date of Giddh */
    private universalDate: Array<Date>;
    /** Subject to unsubscribe all the observables when the component destroys */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /** @ignore */
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private modalService: BsModalService,
        private receiptService: ReceiptService,
        private store: Store<AppState>,
        private toastService: ToasterService
    ) { }

    ngOnInit(): void {
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((applicationDate) => {
            if (applicationDate) {
                this.universalDate = applicationDate;
                this.datePickerOptions = {
                    ...this.datePickerOptions,
                    startDate: moment(applicationDate[0], 'DD-MM-YYYY').toDate(),
                    endDate: moment(applicationDate[1], 'DD-MM-YYYY').toDate(),
                    chosenLabel: applicationDate[2]
                }
            }
            this.fetchReceiptsData();
        });
    }

    ngAfterViewInit(): void {
        this.subscribeToEvents();
    }

    private subscribeToEvents(): void {
        merge(
            fromEvent(this.customerName.nativeElement, 'input'),
            fromEvent(this.receiptNumber.nativeElement, 'input'),
            fromEvent(this.paymentMode.nativeElement, 'input'),
            fromEvent(this.invoiceNumber.nativeElement, 'input')).pipe(debounceTime(700), takeUntil(this.destroyed$)).subscribe((value) => {
                this.fetchAllReceipts(this.searchQueryParams).subscribe((response) => this.handleFetchAllReceiptResponse(response));
            });
    }

    private fetchReceiptsData() {
        this.fetchAllReceipts(this.searchQueryParams).subscribe((response) => this.handleFetchAllReceiptResponse(response));
        this.fetchSummary().subscribe((response) => this.handleSummaryResponse(response));
    }

    private fetchAllReceipts(additionalRequestParameters?: GetAllAdvanceReceiptsRequest): Observable<BaseResponse<any, GetAllAdvanceReceiptsRequest>> {
        let requestObject: GetAllAdvanceReceiptsRequest = {
            from: moment(this.datePickerOptions.startDate).format(GIDDH_DATE_FORMAT),
            to: moment(this.datePickerOptions.endDate).format(GIDDH_DATE_FORMAT),
            count: PAGINATION_LIMIT
        }
        const optionalParams = cloneDeep(additionalRequestParameters);
        if (optionalParams) {
            for (let key in optionalParams) {
                if (!optionalParams[key] || (optionalParams[key] && isArray(optionalParams[key]) && !optionalParams[key].length)) {
                    // Delete empty keys or keys with empty arrays as values
                    delete optionalParams[key]; // Delete falsy values
                }
            }
            requestObject = { ...requestObject, ...optionalParams };
        }
        return this.receiptService.getAllAdvanceReceipts(requestObject);
    }

    private fetchSummary(): Observable<BaseResponse<any, AdvanceReceiptSummaryRequest>> {
        const requestObject: AdvanceReceiptSummaryRequest = {
            from: moment(this.datePickerOptions.startDate).format(GIDDH_DATE_FORMAT),
            to: moment(this.datePickerOptions.endDate).format(GIDDH_DATE_FORMAT)
        };
        return this.receiptService.fetchSummary(requestObject);
    }

    private handleFetchAllReceiptResponse(response: any) {
        if (response) {
            if (response.status === 'success' && response.body) {
                this.pageConfiguration.currentPage = response.body.page;
                this.pageConfiguration.totalPages = response.body.totalPages;
                this.pageConfiguration.totalItems = response.body.totalItems;
                // let i = 0;
                // while (i <= 100) {
                // 	response.body.results[0].invoices = ['45457', '154211klk', '7777'];
                // 	response.body.results.push(response.body.results[0]);
                // 	i++;
                // }
                // this.pageConfiguration.totalItems = 101;
                this.allReceipts = response.body.results;
                this.changeDetectorRef.detectChanges();
                return response.body;
            } else {
                this.toastService.errorToast(response.message, response.code);
            }
        }
    }

    private handleSummaryResponse(response: any) {
        if (response) {
            if (response.status === 'success' && response.body) {
                this.receiptsSummaryData = response.body;
            } else {
                this.toastService.errorToast(response.message, response.code);
            }
        }
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    openModal() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ReceiptAdvanceSearchComponent);
        let viewContainerRef = this.receiptAdvanceSearchFilter.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);

		this.advanceSearchModel.adjustmentVoucherDetails.selectedValue = this.searchQueryParams.receiptTypes[0];
		this.advanceSearchModel.adjustmentVoucherDetails.isDisabled = !!this.searchQueryParams.receiptTypes.length;
        (componentRef.instance as ReceiptAdvanceSearchComponent).searchModel = cloneDeep(this.advanceSearchModel);
        merge(
            (componentRef.instance as ReceiptAdvanceSearchComponent).closeModal,
            (componentRef.instance as ReceiptAdvanceSearchComponent).cancel).subscribe(() => {
                this.receiptAdvanceSearchModal.hide();
            });
        (componentRef.instance as ReceiptAdvanceSearchComponent).confirm.subscribe((data: ReceiptAdvanceSearchModel) => {
			this.showClearFilter = true;
			this.advanceSearchModel = cloneDeep(data);
            if (data.adjustmentVoucherDetails.selectedValue) {
                this.searchQueryParams.receiptTypes = [data.adjustmentVoucherDetails.selectedValue];
            }
            this.fetchAllReceipts({
                receiptTypes: this.searchQueryParams.receiptTypes,
                totalAmount: data.totalAmountFilter.amount,
                totalAmountOperation: data.totalAmountFilter.selectedValue,
                unUsedAmount: data.unusedAmountFilter.amount,
                unUsedAmountOperation: data.unusedAmountFilter.selectedValue
            }).subscribe((response) => this.handleFetchAllReceiptResponse(response));
            this.receiptAdvanceSearchModal.hide();
        });
        this.receiptAdvanceSearchModal.show();
    }

    // advance modal
    adjustModal(adjustInvoiceModal: TemplateRef<any>) {
        this.modalRef = this.modalService.show(adjustInvoiceModal, { class: 'modal-lg' });
    }

    // refuns amount modal
    refundModalOpen(refundAmount: TemplateRef<any>) {
        this.modalRef = this.modalService.show(refundAmount, { class: 'modal-md' });
    }

    confirm(): void {
        this.message = 'Confirmed!';
        this.modalRef.hide();
    }

    decline(): void {
        this.message = 'Declined!';
        this.modalRef.hide();
    }

    /**
     * Opens/Closes the respective search bar based on parameters provided
     *
     * @param {string} filterName Name of the filter to open or close
     * @param {boolean} openFilter True, if filter needs to be opened
     * @memberof AdvanceReceiptReportComponent
     */
    public searchBy(event: any, filterName: string, openFilter: boolean): void {
        switch (filterName) {
            case ADVANCE_RECEIPT_REPORT_FILTERS.RECEIPT_FILTER:
                if (event && this.childOf(event.target, this.receiptNumberParent.nativeElement)) {
                    return;
                }
                this.showReceiptSearchBar = openFilter;
                break;
            case ADVANCE_RECEIPT_REPORT_FILTERS.CUSTOMER_FILTER:
                if (event && this.childOf(event.target, this.customerNameParent.nativeElement)) {
                    return;
                }
                this.showCustomerSearchBar = openFilter;
                break;
            case ADVANCE_RECEIPT_REPORT_FILTERS.PAYMENT_FILTER:
                if (event && this.childOf(event.target, this.paymentModeParent.nativeElement)) {
                    return;
                }
                this.showPaymentSearchBar = openFilter;
                break;
            case ADVANCE_RECEIPT_REPORT_FILTERS.INVOICE_FILTER:
                if (event && this.childOf(event.target, this.invoiceNumberParent.nativeElement)) {
                    return;
                }
                this.showInvoiceSearchBar = openFilter;
                break;
            default: break;
        }
    }

    public onReceiptTypeChanged(event: string): void {
        this.searchQueryParams.receiptTypes = [event];
        this.fetchAllReceipts({ ...this.searchQueryParams }).subscribe((response) => this.handleFetchAllReceiptResponse(response));
    }

    public onDateChange(event: any) {
        this.datePickerOptions.startDate = event.picker.startDate._d;
		this.datePickerOptions.endDate = event.picker.endDate._d;
		this.showClearFilter = true;
        this.fetchReceiptsData();
    }

    public onPageChanged(event: any) {
        this.fetchAllReceipts({ page: event.page, ...this.searchQueryParams }).subscribe((response) => this.handleFetchAllReceiptResponse(response));
    }

    public childOf(element, parent) {
        return parent.contains(element);
    }

    public resetAdvanceSearch(): void {
        this.showClearFilter = false;
        this.datePickerOptions = {
			...this.datePickerOptions,
			startDate: moment(this.universalDate[0], 'DD-MM-YYYY').toDate(),
			endDate: moment(this.universalDate[1], 'DD-MM-YYYY').toDate(),
			chosenLabel: this.universalDate[2]
        }
        this.searchQueryParams = {
            receiptTypes: [],
            receiptNumber: '',
            baseAccountName: '',
            particularName: '',
            invoiceNumber: '',
            sortBy: '',
            sort: ''
        };
        this.advanceSearchModel = {
            adjustmentVoucherDetails: {
                vouchers: [...RECEIPT_TYPES],
                selectedValue: this.searchQueryParams.receiptTypes[0],
                isDisabled: !!this.searchQueryParams.receiptTypes.length
            },
            totalAmountFilter: {
                filterValues: [...ADVANCE_RECEIPT_ADVANCE_SEARCH_AMOUNT_FILTERS],
                selectedValue: '',
                amount: ''
            },
            unusedAmountFilter: {
                filterValues: [...ADVANCE_RECEIPT_ADVANCE_SEARCH_AMOUNT_FILTERS],
                selectedValue: '',
                amount: ''
            }
        };
		this.fetchReceiptsData();
    }

    public handleSorting(sort: string, sortBy: string): void {
        this.showClearFilter = true;
        this.searchQueryParams.sort = sort;
        this.searchQueryParams.sortBy = sortBy;
        this.fetchAllReceipts({ ...this.searchQueryParams }).subscribe((response) => this.handleFetchAllReceiptResponse(response));
    }
}
