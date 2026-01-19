import { Component, Input, OnInit } from '@angular/core';

/**
 * Handles Component functionality
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'transaction-summary',
    templateUrl: './transaction-summary.component.html',
    styleUrls: ['transaction-summary.component.css'],
    standalone: false
})
/**
 * TransactionSummaryComponent component
 * Handles transactionsummary functionality and user interactions
 */
export class TransactionSummaryComponent implements OnInit {

    @Input() public currentPeriod: string = null;
    @Input() public activeCompanyGstNumber: string = '';
    @Input() public selectedGst: string = '';
    @Input() public isTransactionSummary;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor() {

    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.isTransactionSummary = true;
    }
}
