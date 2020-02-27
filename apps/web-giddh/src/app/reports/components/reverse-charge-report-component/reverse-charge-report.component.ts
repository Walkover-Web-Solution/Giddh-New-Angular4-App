import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'reverse-charge-report',
    templateUrl: './reverse-charge-report.component.html',
    styleUrls: ['./reverse-charge-report.component.scss']
})
export class ReverseChargeReport implements OnInit {
    public showEntryDate = true;
    constructor() { }
    ngOnInit() { }
    reverseChargeTable = [
        {
            serialNo: "1",
            entryDate: "09-01-2020",
            suppliersName: "Dummy Name Party",
            voucherType: "Purchase",
            invoiceNo: "123456",
            suppliersInvoicDate: "09-01-2020",
            suppliersCountry: "India",
            taxableBalue: "3000",
            taxRate: "5%",
            taxAmount: "190"
        },
        {
            serialNo: "2",
            entryDate: "09-01-2020",
            suppliersName: "Dummy Name Party",
            voucherType: "Purchase",
            invoiceNo: "123456",
            suppliersInvoicDate: "09-01-2020",
            suppliersCountry: "India",
            taxableBalue: "3000",
            taxRate: "5%",
            taxAmount: "190"
        },
        {
            serialNo: "3",
            entryDate: "09-01-2020",
            suppliersName: "Dummy Name Party",
            voucherType: "Purchase",
            invoiceNo: "123456",
            suppliersInvoicDate: "09-01-2020",
            suppliersCountry: "India",
            taxableBalue: "3000",
            taxRate: "5%",
            taxAmount: "190"
        },
        {
            serialNo: "4",
            entryDate: "09-01-2020",
            suppliersName: "Dummy Name Party",
            voucherType: "Purchase",
            invoiceNo: "123456",
            suppliersInvoicDate: "09-01-2020",
            suppliersCountry: "India",
            taxableBalue: "3000",
            taxRate: "5%",
            taxAmount: "190"
        }

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
