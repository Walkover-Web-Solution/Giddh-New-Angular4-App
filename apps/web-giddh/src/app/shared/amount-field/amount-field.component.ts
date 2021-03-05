import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GeneralService } from '../../services/general.service';

@Component({
    selector: 'amount-field',
    templateUrl: './amount-field.component.html',
    styleUrls: ['./amount-field.component.scss']
})

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
    /** this will store direction */
    public direction: string = "ltr";

    constructor(private generalService: GeneralService) {

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
    public ngOnChanges(changes: SimpleChanges): void {
        this.detectDirection();
    }
    /**
     * this will detect direction of the text
     * @param {string} path
     * @returns {string}
     * @memberof AmountFieldComponent
     */
    public detectDirection(): void {
        if (this.currencyCode) {
            let isRtlCurrency = this.generalService.isRtlCurrency(this.currencyCode);
            if (isRtlCurrency) {
                this.direction = "rtl";
            } else {
                this.direction = "ltr";
            }
        }
    }
}
