import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
	selector: 'adjust-invoice-modal',
	templateUrl: './adjust-invoice-modal.component.html',
	styleUrls: ['./adjust-invoice-modal.component.scss']
})

export class AdjustInvoiceModalComponent implements OnInit {

    adjustInvoiceReport = [
        {invoice: '20181030-6',invoiceDate: '15-12-2018',invoiceAmount: 12300,balanceDue: 2300,adjustAmount: 10000},
        {invoice: '20181030-6',invoiceDate: '15-12-2018',invoiceAmount: 12300,balanceDue: 2300,adjustAmount: 10000},
        {invoice: '20181030-6',invoiceDate: '15-12-2018',invoiceAmount: 12300,balanceDue: 2300,adjustAmount: 10000},
        {invoice: '20181030-6',invoiceDate: '15-12-2018',invoiceAmount: 12300,balanceDue: 2300,adjustAmount: 10000},
        {invoice: '20181030-6',invoiceDate: '15-12-2018',invoiceAmount: 12300,balanceDue: 2300,adjustAmount: 10000},
        {invoice: '20181030-6',invoiceDate: '15-12-2018',invoiceAmount: 12300,balanceDue: 2300,adjustAmount: 10000},
    ]
	constructor() {
	}

	ngOnInit() {
	}
}
