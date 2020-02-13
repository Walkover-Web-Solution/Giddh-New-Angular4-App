import { Component, OnInit, ViewChild } from '@angular/core';
import { DaterangePickerComponent } from '../../../theme/ng2-daterangepicker/daterangepicker.component';


@Component({
    selector: 'advance-receipt-report',
    templateUrl: './advance-receipt-report.component.html',
    styleUrls: ['./advance-receipt-report.component.scss']
})
export class AdvanceReceiptReport implements OnInit {

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
