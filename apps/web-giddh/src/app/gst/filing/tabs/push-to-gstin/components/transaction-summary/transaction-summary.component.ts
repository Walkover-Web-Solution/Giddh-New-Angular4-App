import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'transaction-summary',
    templateUrl: './transaction-summary.component.html',
    styleUrls: ['transaction-summary.component.css'],
})
export class TransactionSummaryComponent implements OnInit, OnChanges {

    @Input() public currentPeriod: string = null;
    @Input() public activeCompanyGstNumber: string = '';
    @Input() public selectedGst: string = '';
    @Input() public isTransactionSummary;

    constructor() {
        //
    }

    public ngOnInit() {
        this.isTransactionSummary = true;
        //
    }

    /**
     * ngOnChnages
     */
    public ngOnChanges(s: SimpleChanges) {
        //
    }

}
