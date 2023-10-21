import { ChangeDetectionStrategy, Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Component({
    selector: 'bulk-stock-advance-filter',
    templateUrl: './bulk-stock-advance-filter.component.html',
    styleUrls: ['./bulk-stock-advance-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkStockAdvanceFilterComponent implements OnInit {
    /** Holds Common Locale Translate Data */
    @Input() public commonLocaleData: any = {};
    /** Holds Locale Translate Data */
    @Input() public localeData: any = {};
    /** Output Emitter to emit advance search Info */
    @Output() public applyAdvanceSearchEvent: EventEmitter<string> = new EventEmitter();
    /** Output Emitter to emit dailog close status */
    @Output() public closeDailog: EventEmitter<string> = new EventEmitter();

    /* Hold advance search SortBy   */
    public advanceSearchSortBy: any[] = [];
    /* Hold advance search SortBy options*/
    public advanceSearchSortByOptions: any[] = [];
    /* Hold Advance Search Expression*/
    public advanceSearchExpression: any[] = [];
    /** Instance of Advance Search Form*/
    public advanceSearchFormObj: any;

    /**
     * Initializes the Advance Serach Form*
     * @memberof BulkStockAdvanceFilterComponent
     */
    public ngOnInit(): void {
        this.initDropdownValues();
        this.initializeForm();
    }

    /**
     * Initialize Form fields Data to display
     * @memberof BulkStockAdvanceFilterComponent
     */
    public initDropdownValues(): void {
        this.advanceSearchSortBy = [
            {
                value: "purchase_rate",
                label: this.localeData?.purchase_rate,
            },
            {
                value: "sales_rate",
                label: this.localeData?.sales_rate,
            },
            {
                value: "fixed_asset_rate",
                label: this.localeData?.fixed_asset_rate,
            }
        ];
        this.advanceSearchSortByOptions = [
            {
                value: "rate",
                label: this.commonLocaleData?.app_rate,
            }
        ];
        this.advanceSearchExpression = [
            {
                value: "EQUAL",
                label: this.commonLocaleData?.app_comparision_filters?.equals,
            },
            {
                value: "NOT_EQUALS",
                label: this.commonLocaleData?.app_comparision_filters?.not_equals
            },
            {
                value: "GREATER_THAN",
                label: this.commonLocaleData?.app_comparision_filters?.greater_than,
            },
            {
                value: "GREATER_THAN_OR_EQUAL",
                label: this.commonLocaleData?.app_comparision_filters?.greater_than_equals,
            },
            {
                value: "LESS_THAN",
                label: this.commonLocaleData?.app_comparision_filters?.less_than,
            },
            {
                value: "LESS_THAN_OR_EQUAL",
                label: this.commonLocaleData?.app_comparision_filters?.less_than_equals,
            }
        ];
    }

    /**
     * Set Advance search form object to initial value 
     * @memberof BulkStockAdvanceFilterComponent
     */
    public initializeForm(): void {
        this.advanceSearchFormObj = {
            sortBy: '',
            type: { label: this.commonLocaleData?.app_rate, value: 'rate' },
            expression: '',
            amount: ''
        };
    }

    /**
     * Emit close event on dailog close *
     * @memberof BulkStockAdvanceFilterComponent
     */
    public advanceFilterClose(): void {
        this.closeDailog.emit();
    }

    /**
     * Set selected catergory to Advance search form object 
     * @param {*} event
     * @memberof BulkStockAdvanceFilterComponent
     */
    public selectCategory(event: any): void {
        this.advanceSearchFormObj.sortBy = event;
    }

    /**
     * Set selected Type to Advance search form object 
     * @param {*} event
     * @memberof BulkStockAdvanceFilterComponent
     */
    public selectCategoryType(event: any): void {
        this.advanceSearchFormObj.type = event;
    }

    /**
     * Set selected expression to Advance search form object 
     * @param {*} event
     * @memberof BulkStockAdvanceFilterComponent
     */
    public selectValueExpression(event: any): void {
        this.advanceSearchFormObj.expression = event;
    }

    /**
     * Set all the form fields value  to "advanceSearchFormObj" object and Emit the updated object*
     * @memberof BulkStockAdvanceFilterComponent
     */
    public advanceSearchAction(): void {
        this.advanceSearchFormObj.sortBy = this.advanceSearchFormObj.sortBy.value
        this.advanceSearchFormObj.type = this.advanceSearchFormObj.type.value
        this.advanceSearchFormObj.expression = this.advanceSearchFormObj.expression.value
        this.advanceSearchFormObj.amount = this.advanceSearchFormObj.amount
        this.applyAdvanceSearchEvent.emit(this.advanceSearchFormObj);
    }
}
