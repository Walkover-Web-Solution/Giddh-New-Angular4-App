import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from '@angular/material/paginator';
import { PAGE_SIZE_OPTIONS } from '../../../../app.constant';
import { ServiceConfig } from "apps/web-giddh/src/app/services/service.config";

export interface PeriodicElement {
    productName: any;
    unit: any;
    groupName: any;
    openingStockQty: any;
    openingStockValue: any;
    inwardsQty: any;
    inwardsValue: any;
    outwardsQty: any;
    outwardsValue: any;
    closingStockQty: any;
    closingStockValue: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { productName: '111 Stock', unit: 'nos', groupName: 'Group Name 1', openingStockQty: 0.00, openingStockValue: 0.00, inwardsQty: 0.00, inwardsValue: 0.00, outwardsQty: 0.00, outwardsValue: 0.00, closingStockQty: 0.00, closingStockValue: 0.00 },
    { productName: '111 Stock', unit: 'nos', groupName: 'Group Name 2', openingStockQty: 0.00, openingStockValue: 0.00, inwardsQty: 0.00, inwardsValue: 0.00, outwardsQty: 0.00, outwardsValue: 0.00, closingStockQty: 0.00, closingStockValue: 0.00 },
    { productName: '111 Stock', unit: 'nos', groupName: 'Group Name 3', openingStockQty: 0.00, openingStockValue: 0.00, inwardsQty: 0.00, inwardsValue: 0.00, outwardsQty: 0.00, outwardsValue: 0.00, closingStockQty: 0.00, closingStockValue: 0.00 },
    { productName: '111 Stock', unit: 'nos', groupName: 'Group Name 4', openingStockQty: 0.00, openingStockValue: 0.00, inwardsQty: 0.00, inwardsValue: 0.00, outwardsQty: 0.00, outwardsValue: 0.00, closingStockQty: 0.00, closingStockValue: 0.00 },
    { productName: '111 Stock', unit: 'nos', groupName: 'Group Name 5', openingStockQty: 0.00, openingStockValue: 0.00, inwardsQty: 0.00, inwardsValue: 0.00, outwardsQty: 0.00, outwardsValue: 0.00, closingStockQty: 0.00, closingStockValue: 0.00 }
];

@Component({
    selector: 'item-wise',
    templateUrl: './item-wise.component.html',
    styleUrls: ['./item-wise.component.scss']
})

export class ItemWiseComponent implements OnInit, OnDestroy {
    /* It will store image path */
    public imgPath: string = '';
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Holds total items count */
    public totalItems: number = 500;

    constructor(@Inject(ServiceConfig) private serviceConfig ) {}

    displayedColumns: string[] = ['productName', 'groupName', 'openingStockQty', 'openingStockValue', 'inwardsQty', 'inwardsValue', 'outwardsQty', 'outwardsValue', 'closingStockQty', 'closingStockValue'];
    dataSource = ELEMENT_DATA;

    /**
     * Initialized the component
     *
     * @memberof ItemWiseComponent
     */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
        document.querySelector("body")?.classList?.add("item-wise-page");
    }

    /**
     * Lifecycle hook runs when component is destroyed
     *
     * @memberof ItemWiseComponent
     */
    public ngOnDestroy(): void {
        document.querySelector("body")?.classList?.remove("item-wise-page");
    }

    /**
     * Handles pagination events for item-wise inventory
     *
     * @param {PageEvent} event - Contains pagination details
     * @memberof ItemWiseComponent
     */
    public handlePageEvent(event: PageEvent): void {
        // In a real implementation, this would update API request parameters
        // and fetch new data based on the page index and page size
        console.log('Page event', event);
    }
}
