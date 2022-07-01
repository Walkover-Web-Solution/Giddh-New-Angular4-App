import { Component, OnInit, OnDestroy } from "@angular/core";

export interface PeriodicElement {
    variantName: any;
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
    { variantName: '111 Stock', unit: 'nos', inventoryName: 'Inventory Name 1', openingStockQty: 0.00, openingStockValue: 0.00, inwardsQty: 0.00, inwardsValue: 0.00, outwardsQty: 0.00, outwardsValue: 0.00, closingStockQty: 0.00, closingStockValue: 0.00 },
    { variantName: '111 Stock', unit: 'nos', inventoryName: 'Inventory Name 2', openingStockQty: 0.00, openingStockValue: 0.00, inwardsQty: 0.00, inwardsValue: 0.00, outwardsQty: 0.00, outwardsValue: 0.00, closingStockQty: 0.00, closingStockValue: 0.00 },
    { variantName: '111 Stock', unit: 'nos', inventoryName: 'Inventory Name 3', openingStockQty: 0.00, openingStockValue: 0.00, inwardsQty: 0.00, inwardsValue: 0.00, outwardsQty: 0.00, outwardsValue: 0.00, closingStockQty: 0.00, closingStockValue: 0.00 },
    { variantName: '111 Stock', unit: 'nos', inventoryName: 'Inventory Name 4', openingStockQty: 0.00, openingStockValue: 0.00, inwardsQty: 0.00, inwardsValue: 0.00, outwardsQty: 0.00, outwardsValue: 0.00, closingStockQty: 0.00, closingStockValue: 0.00 },
    { variantName: '111 Stock', unit: 'nos', inventoryName: 'Inventory Name 5', openingStockQty: 0.00, openingStockValue: 0.00, inwardsQty: 0.00, inwardsValue: 0.00, outwardsQty: 0.00, outwardsValue: 0.00, closingStockQty: 0.00, closingStockValue: 0.00 }
];

@Component({
    selector: 'variant-wise',
    templateUrl: './variant-wise.component.html',
    styleUrls: ['./variant-wise.component.scss']
})

export class VariantWiseComponent implements OnInit, OnDestroy {

    constructor() { }

    displayedColumns: string[] = ['variantName', 'inventoryName', 'openingStockQty', 'openingStockValue', 'inwardsQty', 'inwardsValue', 'outwardsQty', 'outwardsValue', 'closingStockQty', 'closingStockValue'];
    dataSource = ELEMENT_DATA;

    /**
     * Initialized the component
     *
     * @memberof VariantWiseComponent
     */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('variant-wise-page');
    }
    /**
     * Lifecycle hook runs when component is destroyed
     *
     * @memberof VariantWiseComponent
     */
    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('variant-wise-page');
    }
}