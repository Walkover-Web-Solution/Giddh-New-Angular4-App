import { Component, Input, OnInit } from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'transaction-summary',
    templateUrl: './transaction-summary.component.html',
    styleUrls: ['transaction-summary.component.css'],
})
export class TransactionSummaryComponent implements OnInit {

    @Input() public currentPeriod: string = null;
    @Input() public activeCompanyGstNumber: string = '';
    @Input() public selectedGst: string = '';
    @Input() public isTransactionSummary;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};

    constructor() {
        
    }

    public ngOnInit() {
        this.isTransactionSummary = true;
    }
}