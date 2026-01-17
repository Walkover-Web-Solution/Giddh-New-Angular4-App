import { Directive, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ReplaySubject } from 'rxjs';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';

/**
 * Base class for downloads components (imports/exports) with shared properties
 * Used by imports.component and exports.component
 */
@Directive()
export abstract class DownloadsBaseComponent {
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** it will store image path */
    public imgPath: string = '';
    /** True if api call in progress */
    public isLoading: boolean = true;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Selected from date */
    public selectedFromDate: Date;
    /** Selected to date */
    public selectedToDate: Date;
    /** Universal date observer */
    public universalDate$: any;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** Angular Material menu trigger for datepicker */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    /** This will store universalDate */
    public universalDate: any;
    /** To show clear filter */
    public showClearFilter: boolean = false;
}
