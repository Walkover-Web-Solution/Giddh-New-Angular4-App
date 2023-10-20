import { ChangeDetectionStrategy, Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Component({
    selector: 'bulk-stock-advance-filter',
    templateUrl: './bulk-stock-advance-filter.component.html',
    styleUrls: ['./bulk-stock-advance-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkStockAdvanceFilterComponent implements OnInit {

    @Input() public commonLocaleData: any = {};
    @Input() public localeData: any = {};
    @Output() public applyAdvanceSearchEvent: EventEmitter<string> = new EventEmitter();
    @Output() public closeDailog: EventEmitter<string> = new EventEmitter();

    /* Hold advance search category   */
    public advanceSearchCategory: any[] = [];
    /* Hold advance search category options*/
    public advanceSearchCategoryOptions: any[] = [];
    /* Hold advance search value*/
    public advanceSearchValue: any[] = [];
    /** Instance of advance search form*/
    public advanceSearchFormObj: any;
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds report type for modules */
    public reportType: string = '';
    constructor() { }

    public ngOnInit(): void {
        this.formInit();
        this.formObjectIntialvalue();
    }
    /**
     * The formInit() is used to initialize advance search form data     * 
     */
    public formInit(): void {
        this.advanceSearchCategory = [
            {
                value: "purchase_rate",
                label: "Purchase Rate",
            },
            {
                value: "sales_rate",
                label: "Sales Rate",
            },
            {
                value: "fixed_asset_rate",
                label: "Fixed Asset Rate",
            }
        ];
        this.advanceSearchCategoryOptions = [
            {
                value: "rate",
                label: this.commonLocaleData?.app_rate,
            }
        ];
        this.advanceSearchValue = [
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
     */
    public formObjectIntialvalue():void{
        this.advanceSearchFormObj = {
            sortBy: '',
            type:  { label: 'Rate', value: 'rate'},
            expression: '',
            amount: ''
         };
    }
    /**
     *  Emit close event on dailog close 
     */
    public advanceFilterClose():void{       
        this.closeDailog.emit();
    }
    /**
     *  Set selected catergory to Advance search form object 
     */
    public selectCategory(e):void{
        this.advanceSearchFormObj.sortBy = e;
    }
    /**
     *  Set selected Type to Advance search form object 
     */
    public selectCategoryType(e):void{
        this.advanceSearchFormObj.type = e;
    }

    /**
     *  Set selected expression to Advance search form object 
     */
    public selectValueType(e):void{
        this.advanceSearchFormObj.expression = e;
    }

     /**
     *  Set all the form fields value  to "advanceSearchFormObj" object and Emit the updated object
     */
    public advanceSearchAction():void{        
        this.advanceSearchFormObj.sortBy =  this.advanceSearchFormObj.sortBy.value
        this.advanceSearchFormObj.type =   this.advanceSearchFormObj.type.value
        this.advanceSearchFormObj.expression =  this.advanceSearchFormObj.expression.value
        this.advanceSearchFormObj.amount =  this.advanceSearchFormObj.amount

        this.applyAdvanceSearchEvent.emit(this.advanceSearchFormObj);
    }
}
