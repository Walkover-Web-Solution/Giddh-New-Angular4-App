import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment/moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PAGINATION_LIMIT } from '../../../app.constant';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { GetAllAdvanceReceiptsRequest, AdvanceReceiptSummaryRequest } from '../../../models/api-models/Reports';
import { ReceiptService } from '../../../services/receipt.service';
import { ToasterService } from '../../../services/toaster.service';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { AppState } from '../../../store';
import { DaterangePickerComponent } from '../../../theme/ng2-daterangepicker/daterangepicker.component';

@Component({
    selector: 'advance-receipt-report',
    templateUrl: './advance-receipt-report.component.html',
    styleUrls: ['./advance-receipt-report.component.scss']
})
export class AdvanceReceiptReportComponent implements OnDestroy, OnInit {

    @ViewChild('customerNameField') public customerNameField;
    @ViewChild('ReceiptField') public ReceiptField;
    @ViewChild('paymentModeField') public paymentModeField;
    @ViewChild(DaterangePickerComponent) public dp: DaterangePickerComponent;

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
    public receiptType: Array<any> = [
        { label: 'Normal Receipts', value: 'normal receipt'},
        { label: 'Advance Receipts', value: 'advance receipt'}
    ];
    public modalRef: BsModalRef;
    public message: string;
    public advanceReceiptReport = [
        {
            receipt: "AD98834-3",
            date: "13-02-2020",
            type: "Advance Receipt",
            customerName: "Shubhendra",
            paymentMode: "ICIC",
            invoice: "2018-19/INV/256",
            totalAmount: "5000",
            unusedAmount: "3000"
        },
        {
            receipt: "AD98834-3",
            date: "13-02-2020",
            type: "Normal Receipt",
            customerName: "Alok",
            paymentMode: "Cash",
            invoice: "2018-19/INV/256",
            totalAmount: "213",
            unusedAmount: "3000"
        },
        {
            receipt: "AD98834-3",
            date: "13-02-2020",
            type: "Advance Receipt",
            customerName: "Sadik",
            paymentMode: "ICIC",
            invoice: "2018-19/INV/256",
            totalAmount: "423",
            unusedAmount: "2312"
        },
        {
            receipt: "AD98834-3",
            date: "13-02-2020",
            type: "Normal Receipt",
            customerName: "Meghna",
            paymentMode: "Cash",
            invoice: "2018-19/INV/256",
            totalAmount: "5000",
            unusedAmount: "3000"
        },
        {
            receipt: "AD98834-3",
            date: "13-02-2020",
            type: "Normal Receipt",
            customerName: "Shubhendra",
            paymentMode: "ICIC",
            invoice: "2018-19/INV/256",
            totalAmount: "5000",
            unusedAmount: "3000"
        },
    ]
    public showEntryDate = true;
    /** Stores the list of all receipts */
    public allReceipts: Array<any>;
    /** Stores summary data of all receipts based on filters applied */
    public receiptsSummaryData: any;

    /** Stores the current page number */
    private pageConfiguration: { currentPage: number, totalPages: number } = {
        currentPage: 1,
        totalPages: 1
    };
    /** Subject to unsubscribe all the observables when the component destroys */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /** @ignore */
    constructor(
        private modalService: BsModalService,
        private receiptService: ReceiptService,
        private store: Store<AppState>,
        private toastService: ToasterService
    ) { }

    ngOnInit(): void {
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((applicationDate) => {
            if (applicationDate) {
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

    private fetchReceiptsData() {
        this.fetchAllReceipts().subscribe((response) => this.handleFetchAllReceiptResponse(response));
        this.fetchSummary().subscribe((response) => this.handleSummaryResponse(response));
    }

    private fetchAllReceipts(additionalRequestParameters?: GetAllAdvanceReceiptsRequest): Observable<BaseResponse<any, GetAllAdvanceReceiptsRequest>> {
        let requestObject: GetAllAdvanceReceiptsRequest = {
            from: moment(this.datePickerOptions.startDate).format(GIDDH_DATE_FORMAT),
            to: moment(this.datePickerOptions.endDate).format(GIDDH_DATE_FORMAT),
            count: PAGINATION_LIMIT
        }
        if (additionalRequestParameters) {
            requestObject = { ...requestObject, ...additionalRequestParameters };
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
                this.allReceipts = response.body.results;
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

    // advance modal
    openModal(advanceSearch: TemplateRef<any>) {
        this.modalRef = this.modalService.show(advanceSearch, { class: 'modal-lg' });
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
     * This will put focus on selected search field
     *
     * @param {*} inlineSearch
     * @memberof ReverseChargeReport
     */
    public focusOnColumnSearch(inlineSearch) {
        this.inlineSearch = inlineSearch;

        setTimeout(() => {
            if (this.inlineSearch === 'Receipt') {
                this.ReceiptField.nativeElement.focus();
            } else if (this.inlineSearch === 'invoiceNumber') {
                this.customerNameField.nativeElement.focus();
            } else if (this.inlineSearch === 'paymentMode') {
                this.paymentModeField.nativeElement.focus();
            }
        }, 200);
    }

    public onReceiptTypeChanged(type: string) {

    }
}
