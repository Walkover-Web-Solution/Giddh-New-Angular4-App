import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { GeneralService } from '../../../services/general.service';

@Component({
    selector: 'bulk-stock-advance-filter',
    templateUrl: './bulk-stock-edit.component.html',
    styleUrls: ['./bulk-stock-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkStockAdvanceFilterComponent implements OnInit {

    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /* Show on transaction report and hold advance search category*/
    public advanceSearchCategoryTransaction: any[] = [];
    /* Hold advance search category   */
    public advanceSearchCategory: any[] = [];
    /* Hold advance search category options*/
    public advanceSearchCategoryOptions: any[] = [];
    /* Hold advance search vslue*/
    public advanceSearchValue: any[] = [];
    /** Instance of advance search form*/
    public advanceSearchFormObj: any = {};
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds report type for modules */
    public reportType: string = '';
    constructor(
        private generalService: GeneralService,
    ) { }

    public ngOnInit(): void {
        this.formInit();
    }


    public formInit(): void {
        this.advanceSearchCategoryTransaction = [
            {
                value: "Inward",
                label: this.localeData?.reports?.inwards,
            },
            {
                value: "Outward",
                label: this.localeData?.reports?.outwards,
            }
        ];
        this.advanceSearchCategory = [
            {
                value: "Inward",
                label: this.localeData?.reports?.inwards,
            },
            {
                value: "Outward",
                label: this.localeData?.reports?.outwards,
            },
            {
                value: "Opening Stock",
                label: this.localeData?.reports?.opening_stock,
            },
            {
                value: "Closing Stock",
                label: this.localeData?.reports?.closing_stock,
            }
        ];
        this.advanceSearchCategoryOptions = [
            {
                value: "Amount",
                label: this.localeData?.advance_search_filter?.amount,
            },
            {
                value: "Quantity",
                label: this.localeData?.advance_search_filter?.quantity,
            }
        ];
        this.advanceSearchValue = [
            {
                value: "Equals",
                label: this.localeData?.advance_search_filter?.equals,
            },
            {
                value: "Greater than",
                label: this.localeData?.advance_search_filter?.greater_than,
            },
            {
                value: "Less than",
                label: this.localeData?.advance_search_filter?.less_than,
            },
            {
                value: "Excluded",
                label: this.localeData?.advance_search_filter?.excluded,
            }
        ];
    }

    public advanceFilterClose():void{
    console.log("AdvanceFilterClose clicked")
    }

    public selectCategory(e):void{
        console.log("selectCategory Event: ",e);
    }
    public selectValueType(e):void{
        console.log("selectValueType Event: ",e);
    }
    public advanceFilterClear(): void{
        console.log("advanceFilterClear ");
    }
}
