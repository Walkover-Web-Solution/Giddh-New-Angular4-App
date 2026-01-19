import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatepickerMethodsHelper } from '../../../shared/helpers/datepicker-methods.helper';
import { MatMenuTrigger } from '@angular/material/menu';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'stock-group-list',
    templateUrl: './stock-group-list.component.html',
    styleUrls: ['./stock-group-list.component.scss'],
    standalone: false
})

/**
 * StockGroupListComponent component
 * Handles stockgrouplist functionality and user interactions
 */
export class StockGroupListComponent implements OnInit {
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* dayjs object */
    public dayjs = dayjs;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /** Instance of universal datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;

    /**
     * Displayed columns for the stock group list mat-table
     * @memberof StockGroupListComponent
     */
    public displayedColumns: string[] = ['date', 'voucherType', 'accountName', 'inwards', 'outwards', 'rate', 'value', 'qty'];

    /**
     * Sample data source for the stock group list table
     * @memberof StockGroupListComponent
     */
    public dataSource: any[] = [
        {
            date: '09-10-2020',
            voucherType: 'SALES',
            accountName: 'USD Account',
            inwards: '-',
            outwards: '1.00 Box',
            rate: '1,02,378.60',
            value: '1,02,378.60',
            qty: '432.00box'
        }
    ];

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor() { }

    /**
     * Toggles the datepicker menu
     *
     * @param {boolean} isOpen - If true, opens the datepicker. If false, closes it.
     * @memberof StockGroupListComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean): void {
        /**
         * Handles if functionality
         */
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Handles dateSelectedCallback functionality
     */
    public dateSelectedCallback(value?: any): void {
        DatepickerMethodsHelper.dateSelectedCallback(value, this, this.universalDatepickerTrigger);
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {

    }
}
