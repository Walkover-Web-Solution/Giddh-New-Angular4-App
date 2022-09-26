import * as dayjs from 'dayjs';
import * as quarterOfYear from 'dayjs/plugin/quarterOfYear' // load on demand
dayjs.extend(quarterOfYear) // use plugin

export const Configuration = {
    AppUrl,
    ApiUrl,
    isElectron,
    APP_FOLDER
};

export const APP_DEFAULT_TITLE = '';

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

export const DEFAULT_TOASTER_OPTIONS_WITH_HTML = {
    closeButton: true, // show close button
    timeOut: 3000, // time to live
    enableHtml: true, // allow html in message. (UNSAFE)
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
/** API default count limit */
export const API_COUNT_LIMIT = 20;

/** SubVoucher type */
export enum SubVoucher {
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
        name: DatePickerDefaultRangeEnum.Today, value: [dayjs(), dayjs()]
    },
    {
        name: DatePickerDefaultRangeEnum.Yesterday, value: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')]
    },
    {
        name: DatePickerDefaultRangeEnum.Last7Days, value: [dayjs().subtract(6, 'day'), dayjs()]
    },
    {
        name: DatePickerDefaultRangeEnum.ThisMonth, value: [dayjs().startOf('month'), dayjs().endOf('month')]
    },
    {
        name: DatePickerDefaultRangeEnum.LastMonth, value: [
            dayjs().subtract(1, 'month').startOf('month'),
            dayjs().subtract(1, 'month').endOf('month')
        ]
    },
    {
        name: DatePickerDefaultRangeEnum.ThisWeek, ranges: [{
            name: DatePickerDefaultRangeEnum.SunToToday, value: [dayjs().startOf('week'), dayjs()]
        }, { name: DatePickerDefaultRangeEnum.MonToToday, value: [dayjs().startOf('week').add(1, 'day'), dayjs()] }]
    },
    {
        name: DatePickerDefaultRangeEnum.ThisQuarterToDate, value: [
            dayjs().quarter(dayjs().quarter()).startOf('quarter'),
            dayjs()
        ]
    },
    {
        name: DatePickerDefaultRangeEnum.ThisFinancialYearToDate, value: [
            dayjs().startOf('year').subtract(9, 'year'),
            dayjs()
        ]
    },
    {
        name: DatePickerDefaultRangeEnum.ThisYearToDate, value: [
            dayjs().startOf('year'),
            dayjs()
        ]
    },
    {
        name: DatePickerDefaultRangeEnum.LastQuarter, value: [
            dayjs().quarter(dayjs().quarter()).subtract(1, 'quarter').startOf('quarter'),
            dayjs().quarter(dayjs().quarter()).subtract(1, 'quarter').endOf('quarter')
        ]
    },
    {
        name: DatePickerDefaultRangeEnum.LastFinancialYear, value: [
            dayjs().startOf('year').subtract(10, 'year'),
            dayjs().endOf('year').subtract(10, 'year')
        ]
    },
    {
        name: DatePickerDefaultRangeEnum.LastYear, value: [
            dayjs().subtract(1, 'year').startOf('year'),
            dayjs().subtract(1, 'year').endOf('year')
        ]
    },
    {
        name: DatePickerDefaultRangeEnum.AllTime, value: [
            dayjs().startOf('year').subtract(10, 'year'),
            dayjs()
        ]
    }
];

export const GIDDH_DATE_RANGE_PICKER_RANGES = [
    {
        name: DatePickerDefaultRangeEnum.ThisMonth,
        value: [dayjs().startOf('month'), dayjs().endOf('month')],
        key: "ThisMonth"
    },
    {
        name: DatePickerDefaultRangeEnum.LastMonth,
        value: [
            dayjs().subtract(1, 'month').startOf('month'),
            dayjs().subtract(1, 'month').endOf('month')
        ],
        key: "LastMonth"
    },
    {
        name: DatePickerDefaultRangeEnum.ThisQuarterToDate,
        value: [
            dayjs().quarter(dayjs().quarter()).startOf('quarter'),
            dayjs()
        ],
        key: "ThisQuarterToDate"
    },
    {
        name: DatePickerDefaultRangeEnum.ThisFinancialYearToDate,
        value: [
            dayjs().startOf('year').subtract(9, 'year'),
            dayjs()
        ],
        key: "ThisFinancialYearToDate"
    },
    {
        name: DatePickerDefaultRangeEnum.LastQuarter,
        value: [
            dayjs().quarter(dayjs().quarter()).subtract(1, 'quarter').startOf('quarter'),
            dayjs().quarter(dayjs().quarter()).subtract(1, 'quarter').endOf('quarter')
        ],
        key: "LastQuarter"
    },
    {
        name: DatePickerDefaultRangeEnum.AllTime,
        value: [
            dayjs().startOf('year').subtract(10, 'year'),
            dayjs()
        ],
        key: "AllTime"
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

export const API_POSTMAN_DOC_URL = 'https://apidoc.giddh.com/';

/** Decimal point for rate field, irrespective of user profile preference
 * will be displayed up to 4 decimal places
 */
export const RATE_FIELD_PRECISION = 4;

/** High precision for rate value to avoid variation in rate */
export const HIGH_RATE_FIELD_PRECISION = 16;

/** Regex to remove trailing zeros from a string representation of number */
export const REMOVE_TRAILING_ZERO_REGEX = /^([\d,' ]*)$|^([\d,' ]*)\.0*$|^([\d,' ]+\.[0-9]*?)0*$/;

/** Type of voucher that is adjusted */
export enum AdjustedVoucherType {
    Receipt = 'rcpt',
    AdvanceReceipt = 'advance-receipt',
    Sales = 'sal', // used in ledger
    SalesInvoice = 'sales', // used in invoice preview module
    Purchase = 'pur',
    PurchaseInvoice = 'purchase',
    CreditNote = 'credit note',
    DebitNote = 'debit note',
    Payment = 'pay',
    Journal = 'jr'
}

/** Collection of search field default text for empty results */
export enum SearchResultText {
    NewSearch = 'Type to search a/c',
    NotFound = 'No results found'
}

/** Types of tcs and tds taxes */
export const TCS_TDS_TAXES_TYPES = ['tdsrc', 'tdspay', 'tcspay', 'tcsrc'];

/** Routes for which header should display back button */
export const ROUTES_WITH_HEADER_BACK_BUTTON = [
    '/pages/settings/create-warehouse',
    '/pages/settings/create-branch'
];

/** Routes which are restricted when branch is switched  */
export const RESTRICTED_BRANCH_ROUTES = [
    '/pages/settings/branch',
    '/pages/settings/create-branch',
    '/pages/settings/financial-year',
    '/pages/user-details/subscription'
];

/** Settings integration tabs */
export const SETTING_INTEGRATION_TABS = {
    // SMS: { LABEL: 'sms', VALUE: 0 },
    EMAIL: { LABEL: 'email', VALUE: 0 },
    COLLECTION: { LABEL: 'collection', VALUE: 1 },
    E_COMMERCE: { LABEL: 'ecommerce', VALUE: 2 },
    PAYMENT: { LABEL: 'payment', VALUE: 3 }
};
/** Email Validation Regex */
export const EMAIL_VALIDATION_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/** E-invoice statuses */
export enum EInvoiceStatus {
    YetToBePushed = 'yet-to-be pushed',
    Pushed = 'pushed',
    PushInitiated = 'push initiated',
    Cancelled = 'cancelled',
    MarkedAsCancelled = 'marked as cancelled',
    Failed = 'failed',
    NA = 'na',
}

/** Length of entry description on vouchers */
export const ENTRY_DESCRIPTION_LENGTH = 300;
export const EMAIL_REGEX_PATTERN = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
/** This will hold error status code for permission error from API */
export const UNAUTHORISED = 401;
export const SELECT_ALL_RECORDS = "selectallrecords";
/** This will hide the filing feature of GST module  */
export const SHOW_GST_FILING = false;
/** Stores the voucher wise form values to toggle fields in voucher module */
export const GIDDH_VOUCHER_FORM = [
    {
        type: "sales",
        advanceReceiptAllowed: false,
        rcmAllowed: true,
        depositAllowed: true,
        taxesAllowed: true,
        quantityAllowed: true,
        rateAllowed: true,
        discountAllowed: true,
        addressAllowed: true,
        otherDetails: true,
        dueDate: true,
        attachmentAllowed: false
    },
    {
        type: "cash",
        advanceReceiptAllowed: false,
        rcmAllowed: false,
        depositAllowed: false,
        taxesAllowed: true,
        quantityAllowed: true,
        rateAllowed: true,
        discountAllowed: true,
        addressAllowed: true,
        otherDetails: true,
        dueDate: true,
        attachmentAllowed: false
    },
    {
        type: "estimate",
        advanceReceiptAllowed: false,
        rcmAllowed: false,
        depositAllowed: false,
        taxesAllowed: true,
        quantityAllowed: true,
        rateAllowed: true,
        discountAllowed: true,
        addressAllowed: true,
        otherDetails: true,
        dueDate: true,
        attachmentAllowed: false
    },
    {
        type: "proformas",
        advanceReceiptAllowed: false,
        rcmAllowed: false,
        depositAllowed: false,
        taxesAllowed: true,
        quantityAllowed: true,
        rateAllowed: true,
        discountAllowed: true,
        addressAllowed: true,
        otherDetails: true,
        dueDate: true,
        attachmentAllowed: false
    },
    {
        type: "purchase",
        advanceReceiptAllowed: false,
        rcmAllowed: true,
        depositAllowed: true,
        taxesAllowed: true,
        quantityAllowed: true,
        rateAllowed: true,
        discountAllowed: true,
        addressAllowed: true,
        otherDetails: true,
        dueDate: true,
        attachmentAllowed: true
    },
    {
        type: "credit note",
        advanceReceiptAllowed: false,
        rcmAllowed: true,
        depositAllowed: false,
        taxesAllowed: true,
        quantityAllowed: true,
        rateAllowed: true,
        discountAllowed: true,
        addressAllowed: true,
        otherDetails: true,
        dueDate: false,
        attachmentAllowed: false
    },
    {
        type: "debit note",
        advanceReceiptAllowed: false,
        rcmAllowed: true,
        depositAllowed: false,
        taxesAllowed: true,
        quantityAllowed: true,
        rateAllowed: true,
        discountAllowed: true,
        addressAllowed: true,
        otherDetails: true,
        dueDate: false,
        attachmentAllowed: false
    },
    {
        type: "payment",
        advanceReceiptAllowed: false,
        rcmAllowed: false,
        depositAllowed: false,
        taxesAllowed: false,
        quantityAllowed: false,
        rateAllowed: false,
        discountAllowed: false,
        addressAllowed: true,
        otherDetails: true,
        dueDate: false,
        attachmentAllowed: false
    },
    {
        type: "receipt",
        advanceReceiptAllowed: true,
        rcmAllowed: false,
        depositAllowed: false,
        taxesAllowed: false,
        quantityAllowed: false,
        rateAllowed: false,
        discountAllowed: false,
        addressAllowed: true,
        otherDetails: true,
        dueDate: false,
        attachmentAllowed: false
    }
];
export const CALENDLY_URL = "https://calendly.com/d/cg6-6kx-924/schedule-demo";
export const JOURNAL_VOUCHER_ALLOWED_DOMAINS = [
    'giddh.com',
    'walkover.in',
    'muneem.co',
    'whozzat.com',
];

/**
 * Enum for switching toggle button On and Off and changing its size
 *
 * @export
 * @enum {string}
 */
export enum BootstrapToggleSwitch {
    On = 'blue',
    Off = 'gray',
    Size = 'mini'
}

export const MOBILE_NUMBER_UTIL_URL = 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.17/js/utils.js';
