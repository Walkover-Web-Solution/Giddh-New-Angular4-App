import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { GeneralService } from '../../../services/general.service';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';

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
    /** Instance of datepicker trigger */
    @ViewChild('universalDatepickerTrigger', { static: false }) public universalDatepickerTrigger: MatMenuTrigger;
    /** True if datepicker menu is open */
    public isDatepickerMenuOpen: boolean = false;
    /** Selected date range */
    public selectedDateRange: any;
    /** Selected date range UI representation */
    public selectedDateRangeUi: any;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** Date picker options */
    public datePickerOptions: any;

    constructor(private generalService: GeneralService) {}

    displayedColumns: string[] = ['variantName', 'inventoryName', 'openingStockQty', 'openingStockValue', 'inwardsQty', 'inwardsValue', 'outwardsQty', 'outwardsValue', 'closingStockQty', 'closingStockValue'];
    dataSource = ELEMENT_DATA;

    /**
     * Initialized the component
     *
     * @memberof VariantWiseComponent
     */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('variant-wise-page');
        this.datePickerOptions = GIDDH_DATE_RANGE_PICKER_RANGES;
    }

    /**
     * Toggles the datepicker menu
     *
     * @param {boolean} isOpen - If true, opens the datepicker menu; if false, closes it
     * @memberof VariantWiseComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Callback when date is selected
     *
     * @param {*} event - Date selection event
     * @memberof VariantWiseComponent
     */
    public dateSelectedCallback(event: any): void {
        if (event) {
            this.selectedDateRange = { startDate: event.startDate, endDate: event.endDate };
            this.selectedDateRangeUi = dayjs(event.startDate).format(GIDDH_DATE_FORMAT) + ' - ' + dayjs(event.endDate).format(GIDDH_DATE_FORMAT);
            this.selectedRangeLabel = event.label;
        }
        this.toggleGiddhDatepicker(false);
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