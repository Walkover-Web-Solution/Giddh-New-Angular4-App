import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../../shared/helpers/defaultDateFormat';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../../app.constant';

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
    /** Holds Datepicker Menu Trigger Reference */
    @ViewChild('universalDatepickerTrigger') public universalDatepickerTrigger: MatMenuTrigger;
    /** True if datepicker menu is open */
    public isDatepickerMenuOpen: boolean = false;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any;
    /* Selected range label */
    public selectedRangeLabel: string = '';
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Item wise request object */
    public itemWiseRequest: any = {};
    displayedColumns: string[] = ['productName', 'groupName', 'openingStockQty', 'openingStockValue', 'inwardsQty', 'inwardsValue', 'outwardsQty', 'outwardsValue', 'closingStockQty', 'closingStockValue'];
    dataSource = ELEMENT_DATA;
    
    constructor() {}


    /**
     * Toggles the datepicker menu
     *
     * @param {boolean} isOpen - True to open the datepicker, false to close it
     * @memberof ItemWiseComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value - Selected date value
     * @memberof ItemWiseComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.itemWiseRequest.from = this.fromDate;
            this.itemWiseRequest.to = this.toDate;
        }
        this.getItemWiseReport(false);
    }

    /**
     * Get item wise report
     * 
     * @param {boolean} reset - True if need to reset pagination
     * @memberof ItemWiseComponent
     */
    public getItemWiseReport(reset: boolean): void {
        // Implementation will be added when API integration is required
        console.log('Getting item wise report with request:', this.itemWiseRequest);
    }

    /**
     * Initialized the component
     *
     * @memberof ItemWiseComponent
     */
    public ngOnInit(): void {
        this.imgPath = 'assets/images/';
        document.querySelector("body")?.classList?.add("item-wise-page");
        this.datePickerOptions = GIDDH_DATE_RANGE_PICKER_RANGES;
    }

    /**
     * Lifecycle hook runs when component is destroyed
     *
     * @memberof ItemWiseComponent
     */
    public ngOnDestroy(): void {
        document.querySelector("body")?.classList?.remove("item-wise-page");
    }
}
