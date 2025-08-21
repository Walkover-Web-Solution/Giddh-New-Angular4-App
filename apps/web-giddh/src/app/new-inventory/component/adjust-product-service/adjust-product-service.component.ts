import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import * as dayjs from 'dayjs';
import { GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { InventoryAdjustmentReasonAside } from '../inventory-adjustment-aside/inventory-adjustment-aside.component';
import { MatDialog } from '@angular/material/dialog';
import { ServiceConfig } from '../../../services/service.config';
@Component({
    selector: 'adjust-product-service',
    templateUrl: './adjust-product-service.component.html',
    styleUrls: ['./adjust-product-service.component.scss'],

})

export class AdjustProductServiceComponent implements OnInit {
    /** MatMenuTrigger reference for the date picker */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
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
    /** The selected date range used in API requests */
    public selectedDateRange: any;
    /** The selected date range displayed on the user interface */
    public selectedDateRangeUi: any;
    /** The selected range label for the date picker */
    public selectedRangeLabel: string;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;

    constructor(
        @Inject(ServiceConfig) private serviceConfig,
        private dialog: MatDialog
    ) { }

    public ngOnInit() {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
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

    /**
     * Toggles the datepicker menu
     *
     * @param {boolean} isOpen
     * @memberof AdjustProductServiceComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        if (isOpen) {            
            this.universalDatepickerTrigger?.openMenu();
         } else {
            this.universalDatepickerTrigger?.closeMenu();
         }
    }

    /**
     * Callback function for date/range selection in the datepicker
     *
     * @param {any} [value] - Selected date/range value
     * @returns {void}
     * @memberof AdjustProductServiceComponent
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
        }
    }
}
