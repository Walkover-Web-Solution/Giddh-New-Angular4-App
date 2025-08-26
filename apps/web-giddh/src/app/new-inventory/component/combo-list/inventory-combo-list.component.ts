import { Component, Inject, OnInit } from '@angular/core';
import { ServiceConfig } from '../../../services/service.config';
import { GIDDH_DATE_RANGE_PICKER_RANGES, APP_FOLDER_WA } from '../../../app.constant';
declare var isElectron: any;
declare var AppUrl: any;
declare var APP_FOLDER: any;

@Component({
    selector: 'inventory-combo-list',
    templateUrl: './inventory-combo-list.component.html',
    styleUrls: ['./inventory-combo-list.component.scss'],

})

export class InventoryComboListComponent implements OnInit {
    /* this will store image path*/
    public imgPath: string = '';

    /**
     * Displayed columns for the inventory combo list mat-table
     * @memberof InventoryComboListComponent
     */
    public displayedColumns: string[] = ['select', 'stockName', 'unit', 'qty', 'sellingPrice', 'purchasePrice'];

    /**
     * Sample data source for the inventory combo list table
     * @memberof InventoryComboListComponent
     */
    public dataSource: any[] = [
        {
            id: 1,
            stockName: 'Product Name',
            itemCount: '34 Items',
            unit: 'KG',
            qty: '500',
            sellingPrice: '23124',
            purchasePrice: '12345',
            selected: false
        }
    ];
    constructor(@Inject(ServiceConfig) private serviceConfig ){}
    public ngOnInit() {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
    }
}
