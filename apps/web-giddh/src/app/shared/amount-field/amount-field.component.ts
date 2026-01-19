import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { DecimalPipe } from '@angular/common';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'amount-field',
    templateUrl: './amount-field.component.html',
    styleUrls: ['./amount-field.component.scss'],
    standalone: false
})

/**
 * AmountFieldComponent component
 * Handles amountfield functionality and user interactions
 */
export class AmountFieldComponent implements OnInit, OnChanges {
    /* amount type will be any */
    @Input() public amount: any;
    /* currency symbol will be string */
    @Input() public currencySymbol: string;
    /* currency code will be string */
    @Input() public currencyCode: string;
    /* true, ratePrecision value */
    @Input() public ratePrecision: boolean = true;
    /** this will store giddhCurrency pipe value */
    @Input() public useGiddhCurrencyPipe: boolean = true;
    /** True to add space between currency symbol and amount */
    @Input() public spaceAfterCurrencySymbol: boolean = true;
    /** this will store direction */
    public direction: string = "ltr";

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private generalService: GeneralService, private decimalPipe: DecimalPipe) {

    }

    /**
    * detect direction method calling
    * @param {string} path
    * @returns {string}
    * @memberof AmountFieldComponent
    */
    public ngOnInit(): void {
        this.detectDirection();
    }

    /**
    * detect direction method calling
    * @param {string} path
    * @returns {string}
    * @memberof AmountFieldComponent
    */
    public ngOnChanges(): void {
        this.detectDirection();
    }
    /**
     * this will detect direction of the text
     * @param {string} path
     * @returns {string}
     * @memberof AmountFieldComponent
     */
    public detectDirection(): void {
        /**
         * Handles if functionality
         */
        if (this.currencyCode) {
            let isRtlCurrency = this.generalService.isRtlCurrency(this.currencyCode);
            /**
             * Handles if functionality
             */
            if (isRtlCurrency) {
                this.direction = "rtl";
            } else {
                this.direction = "ltr";
            }
        }
    }

    /**
     * Format number with comma separated
     *
     * @param {number} value
     * @returns {(string | null)}
     * @memberof AmountFieldComponent
     */
    public formatNumber(value: number): string {
        return this.decimalPipe.transform(value, '1.0-0');
    }
}
