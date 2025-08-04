import { Component, OnInit } from '@angular/core';
import { InventoryAdjustmentReasonAside } from '../inventory-adjustment-aside/inventory-adjustment-aside.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
    selector: 'adjust-product-service',
    templateUrl: './adjust-product-service.component.html',
    styleUrls: ['./adjust-product-service.component.scss'],

})

export class AdjustProductServiceComponent implements OnInit {
    /* this will store image path*/
    public imgPath: string = '';
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    public dummyOptions: any = [
        { label: 'Option 1', value: 1 },
        { label: 'Option 2', value: 2 },
        { label: 'Option 3', value: 3 }
    ]
    public mode: boolean = true;
    public closingQty: Number = 23;

    constructor(private dialog: MatDialog) { }

    public ngOnInit() {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }

    /**
     *
     *
     * @param {*} event
     * @memberof AdjustProductServiceComponent
     */
    public selectAccount(event: any): void {
        if (event?.value === 1) {
            this.openCreateReasonAsidepan();
        }
    }

    public openCreateReasonAsidepan(): void {
        this.dialog.open(InventoryAdjustmentReasonAside, {
            position: {
                top: '0',
                right: '0'
            },
            width: 'auto'
        })
    }
}
