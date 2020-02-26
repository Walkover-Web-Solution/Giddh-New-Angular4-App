import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';
import { DaterangePickerComponent } from '../../../theme/ng2-daterangepicker/daterangepicker.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
    selector: 'advance-receipt-report',
    templateUrl: './advance-receipt-report.component.html',
    styleUrls: ['./advance-receipt-report.component.scss']
})
export class AdvanceReceiptReport implements OnInit {

    modalRef: BsModalRef;
    message: string;
    constructor(private modalService: BsModalService) {}

    // advance modal
    openModal(advanceSearch: TemplateRef<any>) {
        this.modalRef = this.modalService.show(advanceSearch, {class: 'modal-lg'});
    }

    // advance modal
    adjustModal(adjustInvoiceModal: TemplateRef<any>) {
        this.modalRef = this.modalService.show(adjustInvoiceModal, {class: 'modal-lg'});
    }

    // refuns amount modal
    refundModalOpen(refundAmount: TemplateRef<any>) {
        this.modalRef = this.modalService.show(refundAmount, {class: 'modal-md'});
    }

    confirm(): void {
        this.message = 'Confirmed!';
        this.modalRef.hide();
    }

    decline(): void {
        this.message = 'Declined!';
        this.modalRef.hide();
    }

    public showEntryDate = true;
    @ViewChild(DaterangePickerComponent) public dp: DaterangePickerComponent;

    ngOnInit() { }

    advanceReceiptReport = [
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

    public toggleSearch(fieldName: string, el: any) {
        if (fieldName === 'invoiceNumber') {
            this.showEntryDate = true;
        }

        setTimeout(() => {
            el.focus();
        }, 200);
    }
}
