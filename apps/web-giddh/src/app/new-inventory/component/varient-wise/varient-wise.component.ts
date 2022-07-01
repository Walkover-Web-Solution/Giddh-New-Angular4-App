import { Component, OnInit, OnDestroy } from "@angular/core";

export interface PeriodicElement {
    varientName: any;
    unit: any;
    inventoryName: any;
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
    { varientName: '111 Stock', unit: 'nos', inventoryName: 'Inventory Name 1', openingStockQty: 0.00, openingStockValue: 0.00, inwardsQty: 0.00, inwardsValue: 0.00, outwardsQty: 0.00, outwardsValue: 0.00, closingStockQty: 0.00, closingStockValue: 0.00 },
    { varientName: '111 Stock', unit: 'nos', inventoryName: 'Inventory Name 2', openingStockQty: 0.00, openingStockValue: 0.00, inwardsQty: 0.00, inwardsValue: 0.00, outwardsQty: 0.00, outwardsValue: 0.00, closingStockQty: 0.00, closingStockValue: 0.00 },
    { varientName: '111 Stock', unit: 'nos', inventoryName: 'Inventory Name 3', openingStockQty: 0.00, openingStockValue: 0.00, inwardsQty: 0.00, inwardsValue: 0.00, outwardsQty: 0.00, outwardsValue: 0.00, closingStockQty: 0.00, closingStockValue: 0.00 },
    { varientName: '111 Stock', unit: 'nos', inventoryName: 'Inventory Name 4', openingStockQty: 0.00, openingStockValue: 0.00, inwardsQty: 0.00, inwardsValue: 0.00, outwardsQty: 0.00, outwardsValue: 0.00, closingStockQty: 0.00, closingStockValue: 0.00 },
    { varientName: '111 Stock', unit: 'nos', inventoryName: 'Inventory Name 5', openingStockQty: 0.00, openingStockValue: 0.00, inwardsQty: 0.00, inwardsValue: 0.00, outwardsQty: 0.00, outwardsValue: 0.00, closingStockQty: 0.00, closingStockValue: 0.00 }
];

@Component({
    selector: 'varient-wise',
    templateUrl: './varient-wise.component.html',
    styleUrls: ['./varient-wise.component.scss']
})

export class VarientWiseComponent implements OnInit, OnDestroy {

    constructor() { }

    displayedColumns: string[] = ['varientName', 'inventoryName', 'openingStockQty', 'openingStockValue', 'inwardsQty', 'inwardsValue', 'outwardsQty', 'outwardsValue', 'closingStockQty', 'closingStockValue'];
    dataSource = ELEMENT_DATA;

    /**
     * Initialized the component
     *
     * @memberof VarientWiseComponent
     */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('varient-wise-page');
    }
    /**
     * Lifecycle hook runs when component is destroyed
     *
     * @memberof VarientWiseComponent
     */
    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('varient-wise-page');
    }
}