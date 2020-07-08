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
export const PAGINATION_LIMIT = 50;

/** Subvoucher type */
export enum Subvoucher {
    ReverseCharge = 'REVERSE_CHARGE',
    AdvanceReceipt = 'ADVANCE_RECEIPT'
}

/**
 * enums for default date range picker
 */
export enum DatePickerDefaultRangeEnum {
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
    LastYear = 'Last Year',
    AllTime = 'All Time'
}

/**
 * default ranges for date range picker
 */
export const DEFAULT_DATE_RANGE_PICKER_RANGES = [
    {
        name: DatePickerDefaultRangeEnum.Today, value: [moment(), moment()]
    },
    {
        name: DatePickerDefaultRangeEnum.Yesterday, value: [moment().subtract(1, 'days'), moment().subtract(1, 'days')]
    },
    {
        name: DatePickerDefaultRangeEnum.Last7Days, value: [moment().subtract(6, 'days'), moment()]
    },
    {
        name: DatePickerDefaultRangeEnum.ThisMonth, value: [moment().startOf('month'), moment().endOf('month')]
    },
    {
        name: DatePickerDefaultRangeEnum.LastMonth, value: [
            moment().subtract(1, 'month').startOf('month'),
            moment().subtract(1, 'month').endOf('month')
        ]
    },
    {
        name: DatePickerDefaultRangeEnum.ThisWeek, ranges: [{
            name: DatePickerDefaultRangeEnum.SunToToday, value: [moment().startOf('week'), moment()]
        }, { name: DatePickerDefaultRangeEnum.MonToToday, value: [moment().startOf('week').add(1, 'd'), moment()] }]
    },
    {
        name: DatePickerDefaultRangeEnum.ThisQuarterToDate, value: [
            moment().quarter(moment().quarter()).startOf('quarter'),
            moment()
        ]
    },
    {
        name: DatePickerDefaultRangeEnum.ThisFinancialYearToDate, value: [
            moment().startOf('year').subtract(9, 'year'),
            moment()
        ]
    },
    {
        name: DatePickerDefaultRangeEnum.ThisYearToDate, value: [
            moment().startOf('year'),
            moment()
        ]
    },
    {
        name: DatePickerDefaultRangeEnum.LastQuarter, value: [
            moment().quarter(moment().quarter()).subtract(1, 'quarter').startOf('quarter'),
            moment().quarter(moment().quarter()).subtract(1, 'quarter').endOf('quarter')
        ]
    },
    {
        name: DatePickerDefaultRangeEnum.LastFinancialYear, value: [
            moment().startOf('year').subtract(10, 'year'),
            moment().endOf('year').subtract(10, 'year')
        ]
    },
    {
        name: DatePickerDefaultRangeEnum.LastYear, value: [
            moment().subtract(1, 'year').startOf('year'),
            moment().subtract(1, 'year').endOf('year')
        ]
    },
    {
        name: DatePickerDefaultRangeEnum.AllTime, value: [
            moment().startOf('year').subtract(10, 'year'),
            moment()
        ]
    }
];

/** File attachment types supported by Giddh */
export const FILE_ATTACHMENT_TYPE = {
    IMAGE: ['jpg', 'jpeg', 'gif', 'png'],
    PDF: ['pdf'],
    UNSUPPORTED: ['doc', 'docx', 'xls', 'xlsx']
};


/** Error message to display if the stock is invalid */
export const INVALID_STOCK_ERROR_MESSAGE = 'Both Unit and Rate fields are mandatory if you provide data for either of them.';

/** Vat supported country codes */
export const VAT_SUPPORTED_COUNTRIES = [
    'QA', 'BH', 'AE', 'SA', 'OM', 'KW'
];

export const API_POSTMAN_DOC_URL='https://documenter.getpostman.com/view/117343/S1Zw8WF1?version=latest';

/** Decimal point for rate field, irrespective of user profile preference
 * will be displayed up to 4 decimal places
 */
export const RATE_FIELD_PRECISION = 4;

/** High precision for rate value to avoid variation in rate */
export const HIGH_RATE_FIELD_PRECISION = 16;

/** Regex to remove trailing zeros from a string representation of number */
export const REMOVE_TRAILING_ZERO_REGEX = /^([\d,' ]*)$|^([\d,' ]*)\.0*$|^([\d,' ]+\.[0-9]*?)0*$/;

/* This plan unique name will be used as a default plan while creating new company/branch */
export let DEFAULT_SIGNUP_TRIAL_PLAN = "";

if (PRODUCTION_ENV || isElectron || isCordova) {
    DEFAULT_SIGNUP_TRIAL_PLAN = "e6v1566224240273";
} else {
    DEFAULT_SIGNUP_TRIAL_PLAN = "xoh1591185630174";
}

export let DEFAULT_POPULAR_PLAN = "";

if (PRODUCTION_ENV || isElectron || isCordova) {
    DEFAULT_POPULAR_PLAN = "Oak";
} else {
    DEFAULT_POPULAR_PLAN = "Popular Plan";
}
