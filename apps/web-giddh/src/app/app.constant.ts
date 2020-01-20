import * as moment from 'moment';

export const Configuration = {
    AppUrl,
    ApiUrl,
    isCordova,
    isElectron,
    OtpToken: '73k6G_GDzvhy4XE33EQCaKUnC0PHwEZBvf0qsZ3Q9S3ZBcXH-f_6JT_4fH-Qx1Y5LxIIwzqy7cFQVMoyUSXBfLL5WBX6oQWifweWIQlJQ8YkRZ1lAmu3oqwvNJXP1Y5ZTXDHO1IV5-Q63zwNbzxTFw==',
    APP_FOLDER
};

export const APP_DEFAULT_TITLE = 'Giddh -';

export const DEFAULT_TOASTER_OPTIONS = {
    closeButton: true, // show close button
    timeOut: 3000, // time to live
    enableHtml: false, // allow html in message. (UNSAFE)
    extendedTimeOut: 1000, // time to close after a user hovers over toast
    progressBar: true, // show progress bar
    toastClass: 'toast', // class on toast
    positionClass: 'toast-top-right', // class on toast
    titleClass: 'toast-title', // class inside toast on title
    messageClass: 'toast-message', // class inside toast on message
    tapToDismiss: true, // close on click
    onActivateTick: false
};

export const DEFAULT_SERVER_ERROR_MSG = 'Something went wrong! Please try again.';
export let IS_CORDOVA_WA = isCordova;
export let IS_ELECTRON_WA = isElectron;
export let APP_URL_WA = AppUrl;
export let APP_FOLDER_WA = APP_FOLDER;
if (typeof isElectron === 'undefined') {
    IS_ELECTRON_WA = true;
    APP_URL_WA = './';
    APP_FOLDER_WA = '';
}

/**
 * Enum for type of on boarding
 *
 * @export
 * @enum {string}
 */
export enum OnBoardingType {
    Warehouse = 'Warehouse',
    Company = 'Company',
    Branch = 'Branch'
}

/** Pagination limit for every module */
export const PAGINATION_LIMIT = 20;

/** Subvoucher type */
export enum Subvoucher {
    ReverseCharge = 'REVERSE_CHARGE',
    AdvanceReceipt = 'ADVANCE_RECEIPT'
}

/**
 * enums for default date range picker
 */
export enum DefaultDateRangePickerRangesEnum {
    Today = 'Today',
    Yesterday = 'Yesterday',
    Last7Days = 'Last 7 Days',
    ThisMonth = 'This Month',
    LastMonth = 'Last Month',
    ThisWeek = 'This Week',
    SunToToday = 'Sun - Today',
    MonToToday = 'Mon - Today',
    ThisQuarterToDate = 'This Quarter to Date',
    ThisFinancialYearToDate = 'This Financial Year to Date',
    ThisYearToDate = 'This Year to Date',
    LastQuarter = 'Last Quarter',
    LastFinancialYear = 'Last Financial Year',
    LastYear = 'Last Year'
}

/**
 * default ranges for date range picker
 */
export const DEFAULT_DATE_RANGE_PICKER_RANGES = [
    {
        name: DefaultDateRangePickerRangesEnum.Today, value: [moment(), moment()]
    },
    {
        name: DefaultDateRangePickerRangesEnum.Yesterday, value: [moment().subtract(1, 'days'), moment().subtract(1, 'days')]
    },
    {
        name: DefaultDateRangePickerRangesEnum.Last7Days, value: [moment().subtract(6, 'days'), moment()]
    },
    {
        name: DefaultDateRangePickerRangesEnum.ThisMonth, value: [moment().startOf('month'), moment().endOf('month')]
    },
    {
        name: DefaultDateRangePickerRangesEnum.LastMonth, value: [
            moment().subtract(1, 'month').startOf('month'),
            moment().subtract(1, 'month').endOf('month')
        ]
    },
    {
        name: DefaultDateRangePickerRangesEnum.ThisWeek, ranges: [{
            name: DefaultDateRangePickerRangesEnum.SunToToday, value: [moment().startOf('week'), moment()]
        }, {name: DefaultDateRangePickerRangesEnum.MonToToday, value: [moment().startOf('week').add(1, 'd'), moment()]}]
    },
    {
        name: DefaultDateRangePickerRangesEnum.ThisQuarterToDate, value: [
            moment().quarter(moment().quarter()).startOf('quarter'),
            moment()
        ]
    },
    {
        name: DefaultDateRangePickerRangesEnum.ThisFinancialYearToDate, value: [
            moment().startOf('year').subtract(9, 'year'),
            moment()
        ]
    },
    {
        name: DefaultDateRangePickerRangesEnum.ThisYearToDate, value: [
            moment().startOf('year'),
            moment()
        ]
    },
    {
        name: DefaultDateRangePickerRangesEnum.LastQuarter, value: [
            moment().quarter(moment().quarter()).subtract(1, 'quarter').startOf('quarter'),
            moment().quarter(moment().quarter()).subtract(1, 'quarter').endOf('quarter')
        ]
    },
    {
        name: DefaultDateRangePickerRangesEnum.LastFinancialYear, value: [
            moment().startOf('year').subtract(10, 'year'),
            moment().endOf('year').subtract(10, 'year')
        ]
    },
    {
        name: DefaultDateRangePickerRangesEnum.LastYear, value: [
            moment().subtract(1, 'year').startOf('year'),
            moment().subtract(1, 'year').endOf('year')
        ]
    }
];
