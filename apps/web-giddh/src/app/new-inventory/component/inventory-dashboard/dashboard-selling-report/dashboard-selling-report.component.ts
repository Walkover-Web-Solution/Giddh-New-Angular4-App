import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../../shared/helpers/defaultDateFormat';

@Component({
    selector: 'dashboard-selling-report',
    templateUrl: './dashboard-selling-report.component.html',
    styleUrls: ['./dashboard-selling-report.component.scss'],

})

// tslint:disable-next-line:component-class-suffix
export class DashboardSellingReport implements OnInit {
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
    @ViewChild('universalDatepickerTrigger') public universalDatepickerTrigger: MatMenuTrigger;

    constructor() {
    }
    /**
     * Shows or hides the datepicker
     *
     * @param {boolean} isOpen - Whether to open or close the datepicker
     * @memberof DashboardSellingReport
     */
    public toggleGiddhDatepicker(isOpen: boolean): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Callback function for date/range selection in datepicker
     *
     * @param {*} value - Selected date range object
     * @memberof DashboardSellingReport
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
        }
    }

    public ngOnInit() {

    }
}
