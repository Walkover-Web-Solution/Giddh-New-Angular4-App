import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'bulk-stock',
    templateUrl: './bulk-stock-edit.component.html',
    styleUrls: ['./bulk-stock-edit.component.scss']
})
export class BulkStockEditComponent implements OnInit, OnDestroy {

    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    public dropdownData = [{
        label: 'Inventory 1',
        value: '1'
    },
    {
        label: 'Inventory 2',
        value: '2'
    },
    {
        label: 'Inventory 3',
        value: '3'
    }]

    constructor() {}

    public ngOnInit(): void{
        console.log("Welcome BulkStockEditComponent");
    }

     /**
     * Get select value from select field
     *
     * @memberof BulkStockEditComponent
     */
    public selectField(e):void{
        console.log("Event: ",e);
    }

       /**
     * Get Pagination page change event
     *
     * @memberof BulkStockEditComponent
     */
       public pageChanged(e):void{
        console.log("Page Changed Event: ",e);
    }

     /**
     * Lifcycle hook for destroy event
     *
     * @memberof BulkStockEditComponent
     */
        public ngOnDestroy(): void {
        }
}
