import * as dayjs from 'dayjs';
import * as quarterOfYear from 'dayjs/plugin/quarterOfYear' // load on demand
dayjs.extend(quarterOfYear) // use plugin
import { MatDialogConfig } from '@angular/material/dialog';
import { environment } from '../environments/environment.generated';

// ENVIRONMENT AND CORE CONSTANTS - Now using webpack DefinePlugin and environment variables
// These are injected at build time via webpack.partial.js

/** Giddh UI domains */
export enum GiddhUiDomain {
    LOCAL = 'http://localhost:3000/',
    TEST = 'https://test.giddh.com/',
    PRODUCTION = 'https://books.giddh.com/',
    WEBSITE = 'https://giddh.com/'
}

export const GIDDH_API_DOC_URL = `${GiddhUiDomain.WEBSITE}/api`;
export const GIDDH_HELP_DOC_URL = `${GiddhUiDomain.WEBSITE}/help`;
export const GIDDH_SUPPORT_PHONE_NUMBER = '+918818888768';
export const GIDDH_SUPPORT_EMAIL = 'support@giddh.com';
export const GIDDH_ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.app.Giddh&hl=en_IN&gl=US';
export const GIDDH_IOS_APP_URL = 'https://apps.apple.com/in/app/giddh-books-that-make-sense/id1491003438';
export const GIDDH_CALENDLY_URL = "https://calendly.com/sales-accounting-software/talk-to-sale";
export const GIDDH_INTERNAL_DOMAINS = [
    'giddh.com',
    'walkover.in',
    'muneem.co',
    'msg91.com',
    'whozzat.com',
];
/** Maps locale placeholder tokens to their corresponding service config keys.
 * To add a new substitution, add an entry: { token: '[TOKEN]', configKey: 'CONFIG_KEY' } */
export const LOCALE_PLACEHOLDER_MAP: { token: string; configKey: string }[] = [
    { token: '[BRAND_NAME]', configKey: 'BRAND_NAME' },
    { token: '[SUPPORT_EMAIL]', configKey: 'SUPPORT_EMAIL' },
    { token: '[SUPPORT_PHONE]', configKey: 'SUPPORT_PHONE' }
];
/** Routes that are only available on the Giddh domain and must be hidden for white-label tenants. Add new Giddh-only routes here. */
export const GIDDH_ONLY_ROUTES: string[] = [
    '/pages/expenses-manager'
];

/** Add Company business type*/
export enum BusinessTypes {
    Registered = 'Registered',
    Unregistered = 'Unregistered'
};

/** Branch Hierarchy Type */
export enum BranchHierarchyType {
    Flatten = 'flatten',
    Tree = 'tree'
};

/** PDF Zoom Configuration Constants */
export const IFRAME_ZOOM_CONFIG = {
    FIT_PAGE: '#view=Fit',
    FIT_HORIZONTAL: '#view=FitH',
    FIT_VERTICAL: '#view=FitV',
    ZOOM_50: '#zoom=50&view=FitH',
    ZOOM_75: '#zoom=75&view=FitH',
    ZOOM_100: '#zoom=100&view=FitH',
    ZOOM_125: '#zoom=125&view=FitV'
};

/** Date Regex for 'MMM D, YYYY' */
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/** Regex for mobile number */
export const PHONE_NUMBER_REGEX = /^[0-9-+()\/\\ ]+$/;
export const MOBILE_NUMBER_SELF_URL = 'https://api.db-ip.com/v2/free/self';
export const MOBILE_NUMBER_IP_ADDRESS_URL = 'http://ip-api.com/json/';
export const MOBILE_NUMBER_ADDRESS_JSON_URL = 'https://ipinfo.io/';

/** Regex for IPv4 address validation */
export const IPV4_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;


export const APP_DEFAULT_TITLE = '';
export const SYNC_TALLY_HELP_DOC_URL = `${GIDDH_HELP_DOC_URL}/sync-with-tally-1591360375828781`;
export const BANK_STATEMENT_HELP_DOC_URL = `${GIDDH_HELP_DOC_URL}/how-to-integrate-icici-bank-account-with-giddh`;
export const SOCKET_FLOW_API = 'https://flow.sokt.io/func/CMEQnVPyk2a8';

/** Restricted modules */
export enum RestrictedModules {
    TaxFilling = 'Tax filing',
    EInvoice = 'E-invoice',
    Users = 'Users'
};

/** Enum for application theme class names applied on body element */
export enum AppThemeClassEnum {
    Default = 'default-theme',
    Dark = 'dark-theme'
}

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

// Use Angular 21 standard environment approach
export let IS_ELECTRON_WA = environment.isElectron;
export let APP_URL_WA = environment.AppUrl;
export let APP_FOLDER_WA = environment.APP_FOLDER;

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
/** Pagination limit for bulk stock */
export const PAGINATION_LIMIT_BULK_STOCK = 100;
/** Pagination count options */
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
/** API default count limit */
export const DROPDOWN_ITEMS_COUNT_LIMIT = 20;
/** Vouchers pagination limit  */
export const API_BULK_FETCH_LIMIT = 200;

/** SubVoucher type */
export enum SubVoucher {
    ReverseCharge = 'REVERSE_CHARGE',
    AdvanceReceipt = 'ADVANCE_RECEIPT'
}

/** Adjustment inventory */
export enum AdjustmentInventory {
    QuantityWise = 'QUANTITY_WISE',
    ValueWise = 'VALUE_WISE',
    Percentage = 'PERCENTAGE',
    Value = 'VALUE'
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

/** Tax supported country codes */
export const TAX_SUPPORTED_COUNTRIES = [
    'QA', 'BH', 'AE', 'SA', 'OM', 'KW', 'GB', 'ZW', 'KE', 'US'
];

/** VAT supported country codes */
export const VAT_SUPPORTED_COUNTRIES = [
    'GB', 'ZW', 'KE'
];

/** TRN supported country codes */
export const TRN_SUPPORTED_COUNTRIES = [
    'QA', 'BH', 'AE', 'SA', 'OM', 'KW'
];

/** Sales tax supported country codes */
export const SALES_TAX_SUPPORTED_COUNTRIES = ['US'];

/** ZIP Code supported country codes */
export const ZIP_CODE_SUPPORTED_COUNTRIES = ['US', 'GB'];

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
    Journal = 'jr',
    JournalVoucher = 'journal',
    OpeningBalance = 'opening balance'
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
    '/pages/settings/financial-year'
];

/** Settings integration tabs */
export const SETTING_INTEGRATION_TABS = {
    COMMUNICATION: { LABEL: 'communication', VALUE: 0 },
    EMAIL: { LABEL: 'email', VALUE: 1 },
    COLLECTION: { LABEL: 'collection', VALUE: 2 },
    E_COMMERCE: { LABEL: 'e-comm', VALUE: 3 },
    PAYMENT: { LABEL: 'payment', VALUE: 4 },
    TALLY: { LABEL: 'tally', VALUE: 5 }
};
export const SETTING_INTEGRATION_TABS_V1 = {
    EMAIL: { LABEL: 'email', VALUE: 0 },
    COLLECTION: { LABEL: 'collection', VALUE: 1 },
    E_COMMERCE: { LABEL: 'e-comm', VALUE: 2 },
    PAYMENT: { LABEL: 'payment', VALUE: 3 },
    TALLY: { LABEL: 'tally', VALUE: 4 }
};
/** Email Validation Regex - Electron compatible version */
export const EMAIL_VALIDATION_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/** Mobile  Validation Regex */
export const MOBILE_REGEX_PATTERN = /^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$/;

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
        type: "cash bill",
        advanceReceiptAllowed: false,
        rcmAllowed: false,
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
        type: "cash debit note",
        advanceReceiptAllowed: false,
        rcmAllowed: false,
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
        type: "cash credit note",
        advanceReceiptAllowed: false,
        rcmAllowed: false,
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
        type: "cash sales",
        advanceReceiptAllowed: false,
        rcmAllowed: false,
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
export const OTP_PROVIDER_URL = `https://verify.msg91.com/otp-provider.js?time=${new Date().getTime()}`;
export const ELECTRON_OTP_PROVIDER_URL = `https://control.msg91.com/app/assets/otp-provider/otp-provider.js?time=${new Date().getTime()}`;
export const RESTRICTED_VOUCHERS_FOR_DOWNLOAD = ['journal'];
export const SAMPLE_FILES_URL = 'https://giddh-import-sample-files.s3.ap-south-1.amazonaws.com/sample-file-';
export enum BROADCAST_CHANNELS {
    REAUTH_PLAID_SUCCESS = 'REAUTH_PLAID_SUCCESS'
};
export const QZ_CERTIFICATE = "https://giddh-plugin-resources.s3.ap-south-1.amazonaws.com/digital-certificate.txt";
export const QZ_PEM = "https://giddh-plugin-resources.s3.ap-south-1.amazonaws.com/private-key.pem";
export enum QZ_FILES {
    MacOS = 'https://giddh-plugin-resources.s3.ap-south-1.amazonaws.com/qz-tray.pkg',
    Windows = 'https://giddh-plugin-resources.s3.ap-south-1.amazonaws.com/qz-tray.exe'
};
export enum SUPPORTED_OPERATING_SYSTEMS {
    MacOS = 'MacOS',
    Windows = 'Windows'
};

export const ICICI_ALLOWED_COMPANIES = [
    'mitti2in16805084405400lx4s8',
    'walkovin164863366504908yve0',
    'iciciiin16929619553650svnjv',
    'aaaain16192663354510ja2o4'
];

/** Holds region Supported in www.giddh.com  */
export const COUNTRY_REGION_MAP: { [key: string]: string | null } = {
    'GB': 'uk',
    'IN': 'in',
    'AE': 'ae',
    'GL': 'gl'
};
/** Gst utility download portal link */
export const GST_UTILITY_DOWNLOAD_LINK = "https://www.gst.gov.in/download/returns";

/**
 * Responsive breakpoints for different screen sizes and device types
 * Used throughout the application for responsive design and layout adjustments
 */
export enum BREAKPOINT_SCREEN_SIZE {
    /** Mobile devices and small screens - Not optimally supported */
    UNSUPPORTED = '(max-width: 768px)',
    /** iPad and tablet users (768px - 1023px) */
    TABLET = '(min-width: 768px) and (max-width: 1023px)',
    /** Most common business laptops (1024px - 1279px) */
    SMALL_DESKTOP = '(min-width: 1024px) and (max-width: 1279px)',
    /** Modern laptops and smaller monitors (1280px - 1439px) */
    MEDIUM_DESKTOP = '(min-width: 1280px) and (max-width: 1439px)',
    /** External monitors and premium laptops (1440px - 1919px) */
    LARGE_DESKTOP = '(min-width: 1440px) and (max-width: 1919px)',
    /** High-resolution displays (1920px+) */
    XL_DESKTOP = '(min-width: 1920px)'
}

/**
 * Specialized breakpoints for accounting-specific UI layouts
 * These breakpoints are optimized for financial data presentation and form layouts
 */
export enum ACCOUNTING_BREAKPOINTS {
    /** Minimum width where sidebar and main content display comfortably together */
    SIDEBAR_COMFORTABLE = '(min-width: 1200px)',
    /** Minimum width where forms can be split into multiple columns effectively */
    MULTI_COLUMN_FORMS = '(min-width: 1100px)',
    /** Minimum width where all data table columns can be displayed without horizontal scrolling */
    FULL_DATA_VIEW = '(min-width: 1400px)'
}

/** HTML tag name  */
export enum HtmlElementEnum {
    Input = 'INPUT',
    Textarea = 'TEXTAREA',
    Button = 'BUTTON'
}

/** List of all the keyboard keys */
export const KeyCodesEnum = {
    ENTER: 'Enter',
    SPACE: 'Space',
    BACKSPACE: 'Backspace',
    ESC: 'Escape',
    ARROW_DOWN: 'ArrowDown',
    ARROW_UP: 'ArrowUp',
    ARROW_RIGHT: 'ArrowRight',
    ARROW_LEFT: 'ArrowLeft',
    TAB: 'Tab'
};

/** List of all the HTTP methods */
export enum HttpMethod {
    POST = 'post',
    GET = 'get',
    PUT = 'put',
    DELETE = 'delete',
    PATCH = 'patch'
}

/** Type of all HTTP methods */
export type HttpMethodType = 'post' | 'get' | 'put' | 'delete' | 'patch';

/** Config for aside pane */
export const ASIDE_PANE_CONFIG: MatDialogConfig = {
    height: 'calc(100vh - var(--top-distance, 0px))',
    width: 'var(--aside-pane-width)',
    maxWidth: 'var(--aside-pane-width)',
    position: {
        right: '0',
        bottom: '0',
        top: 'var(--top-distance, 0px)'
    },
    disableClose: true
};

/** Payment provider */
export const PaymentProvider = {
    RAZORPAY: 'RAZORPAY',
    GOCARDLESS: 'GOCARDLESS',
    PAYPAL: 'PAYPAL',
    PAYU: 'PAYU',
    STRIPE: 'STRIPE'
};

/** Plan duration */
export const PlanDuration = {
    MONTHLY: 'MONTHLY',
    YEARLY: 'YEARLY',
    DAILY: 'DAILY'
} as const;

/** Entity/region codes used in subscription and plan logic */
export const EntityCode = {
    IND: 'IND',
    GBR: 'GBR'
} as const;

/** Weekdays enum */
export enum WeekdaysEnum {
    DAILY = 'daily',
    SUNDAY = 'sunday',
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday'
}

/** Get Bifurcation Type */
export enum GetBifurcationType {
    MONTH = 'month',
    QUARTER = 'quarter'
}

/** Configuration */
export const Configuration = {
    'AppUrl': environment.AppUrl,
    'ApiUrl': environment.ApiUrl,
    'PORTAL_URL': environment.PORTAL_URL,
    'OTP_WIDGET_ID': environment.OTP_WIDGET_ID,
    'OTP_TOKEN_AUTH': environment.OTP_TOKEN_AUTH,
    'UkApiUrl': environment.UkApiUrl,
    'isElectron': (typeof window !== 'undefined' && (window as any).isElectron) || environment.isElectron,
    'GOOGLE_CLIENT_ID': environment.GOOGLE_CLIENT_ID,
    'GOOGLE_CLIENT_SECRET': environment.GOOGLE_CLIENT_SECRET,
    'RAZORPAY_KEY': environment.RAZORPAY_KEY
};

/** Holds Dropdown label value interface */
export interface IOption {
    value: string;
    label: string;
    disabled?: boolean;
    isHilighted?: boolean;
    additional?: any;
    subVoucher?: string;
    tooltip?: string;
}

/** Number Format Locale Mapping for GiddhNumberFormatPipe */
export const NUMBER_FORMAT_LOCALE_MAP: { [key: string]: string } = {
    'IND_COMMA_SEPARATED': 'en-IN',        // Indian format: 12,34,567.89 (India, Bangladesh, Pakistan, Sri Lanka, Nepal)
    'INT_COMMA_SEPARATED': 'en-US',        // International comma: 1,234,567.89 (US, UK, Canada, Australia, etc.)
    'EUR_SPACE_SEPARATED': 'fr-FR',        // European space: 1 234 567,89 (France, Germany, Nordic countries, Russia)
    'CHE_APOSTROPHE_SEPARATED': 'de-CH',   // Swiss apostrophe: 1'234'567.89 (Switzerland, Liechtenstein)
    'INT_SPACE_SEPARATED': 'fr-FR',        // Alternative space format
    'INT_APOSTROPHE_SEPARATED': 'de-CH',   // Alternative apostrophe format
    'GER_DOT_SEPARATED': 'de-DE',          // German dot: 1.234.567,89 (Germany, Austria)
    'FRA_SPACE_SEPARATED': 'fr-FR',        // French space: 1 234 567,89 (France, Belgium)
    'RUS_SPACE_SEPARATED': 'ru-RU',        // Russian space: 1 234 567,89 (Russia, Belarus, Ukraine)
    'NOR_SPACE_SEPARATED': 'nb-NO',        // Nordic space: 1 234 567,89 (Norway, Sweden, Denmark, Finland)
    'BRA_DOT_SEPARATED': 'pt-BR',          // Brazilian dot: 1.234.567,89 (Brazil)
    'ARG_DOT_SEPARATED': 'es-AR',          // Argentine dot: 1.234.567,89 (Argentina)
    'ESP_DOT_SEPARATED': 'es-ES',          // Spanish dot: 1.234.567,89 (Spain)
    'ITA_DOT_SEPARATED': 'it-IT',          // Italian dot: 1.234.567,89 (Italy)
    'POR_SPACE_SEPARATED': 'pt-PT',        // Portuguese space: 1 234 567,89 (Portugal)
    'POL_SPACE_SEPARATED': 'pl-PL',        // Polish space: 1 234 567,89 (Poland)
    'CZE_SPACE_SEPARATED': 'cs-CZ',        // Czech space: 1 234 567,89 (Czech Republic)
    'HUN_SPACE_SEPARATED': 'hu-HU',        // Hungarian space: 1 234 567,89 (Hungary)
    'ROM_DOT_SEPARATED': 'ro-RO',          // Romanian dot: 1.234.567,89 (Romania)
    'BUL_SPACE_SEPARATED': 'bg-BG',        // Bulgarian space: 1 234 567,89 (Bulgaria)
    'CRO_DOT_SEPARATED': 'hr-HR',          // Croatian dot: 1.234.567,89 (Croatia)
    'SLO_DOT_SEPARATED': 'sl-SI',          // Slovenian dot: 1.234.567,89 (Slovenia)
    'EST_SPACE_SEPARATED': 'et-EE',        // Estonian space: 1 234 567,89 (Estonia)
    'LAT_SPACE_SEPARATED': 'lv-LV',        // Latvian space: 1 234 567,89 (Latvia)
    'LIT_SPACE_SEPARATED': 'lt-LT',        // Lithuanian space: 1 234 567,89 (Lithuania)
    'UKR_SPACE_SEPARATED': 'uk-UA',        // Ukrainian space: 1 234 567,89 (Ukraine)
    'BEL_SPACE_SEPARATED': 'be-BY',        // Belarusian space: 1 234 567,89 (Belarus)
    'GRE_DOT_SEPARATED': 'el-GR',          // Greek dot: 1.234.567,89 (Greece)
    'NLD_DOT_SEPARATED': 'nl-NL',          // Dutch dot: 1.234.567,89 (Netherlands)
    'BEL_SPACE_SEPARATED_FR': 'fr-BE',     // Belgian French space: 1 234 567,89 (Belgium French)
    'AUT_DOT_SEPARATED': 'de-AT',          // Austrian dot: 1.234.567,89 (Austria)
    'JPN_COMMA_SEPARATED': 'ja-JP',        // Japanese comma: 1,234,567.89 (Japan)
    'KOR_COMMA_SEPARATED': 'ko-KR',        // Korean comma: 1,234,567.89 (South Korea)
    'CHN_COMMA_SEPARATED': 'zh-CN',        // Chinese comma: 1,234,567.89 (China)
    'TWN_COMMA_SEPARATED': 'zh-TW',        // Taiwanese comma: 1,234,567.89 (Taiwan)
    'THA_COMMA_SEPARATED': 'th-TH',        // Thai comma: 1,234,567.89 (Thailand)
    'VIE_COMMA_SEPARATED': 'vi-VN',        // Vietnamese comma: 1,234,567.89 (Vietnam)
    'IDN_COMMA_SEPARATED': 'id-ID',        // Indonesian comma: 1,234,567.89 (Indonesia)
    'MYS_COMMA_SEPARATED': 'ms-MY',        // Malaysian comma: 1,234,567.89 (Malaysia)
    'ARE_COMMA_SEPARATED': 'ar-AE',        // UAE comma: 1,234,567.89 (UAE)
    'SAU_COMMA_SEPARATED': 'ar-SA',        // Saudi comma: 1,234,567.89 (Saudi Arabia)
    'QAT_COMMA_SEPARATED': 'ar-QA',        // Qatari comma: 1,234,567.89 (Qatar)
    'KWT_COMMA_SEPARATED': 'ar-KW',        // Kuwaiti comma: 1,234,567.89 (Kuwait)
    'BHR_COMMA_SEPARATED': 'ar-BH',        // Bahraini comma: 1,234,567.89 (Bahrain)
    'OMN_COMMA_SEPARATED': 'ar-OM',        // Omani comma: 1,234,567.89 (Oman)
    'JOR_COMMA_SEPARATED': 'ar-JO',        // Jordanian comma: 1,234,567.89 (Jordan)
    'LBN_COMMA_SEPARATED': 'ar-LB',        // Lebanese comma: 1,234,567.89 (Lebanon)
    'EGY_COMMA_SEPARATED': 'ar-EG',        // Egyptian comma: 1,234,567.89 (Egypt)
    'MAR_COMMA_SEPARATED': 'ar-MA',        // Moroccan comma: 1,234,567.89 (Morocco)
    'TUN_COMMA_SEPARATED': 'ar-TN',        // Tunisian comma: 1,234,567.89 (Tunisia)
    'DZA_COMMA_SEPARATED': 'ar-DZ',        // Algerian comma: 1,234,567.89 (Algeria)
    'TUR_COMMA_SEPARATED': 'tr-TR',        // Turkish comma: 1,234,567.89 (Turkey)
    'ISR_COMMA_SEPARATED': 'he-IL',        // Israeli comma: 1,234,567.89 (Israel)
    'MEX_COMMA_SEPARATED': 'es-MX',        // Mexican comma: 1,234,567.89 (Mexico)
    'COL_COMMA_SEPARATED': 'es-CO',        // Colombian comma: 1,234,567.89 (Colombia)
    'PER_COMMA_SEPARATED': 'es-PE',        // Peruvian comma: 1,234,567.89 (Peru)
    'VEN_COMMA_SEPARATED': 'es-VE',        // Venezuelan comma: 1,234,567.89 (Venezuela)
    'ECU_COMMA_SEPARATED': 'es-EC',        // Ecuadorian comma: 1,234,567.89 (Ecuador)
    'URY_COMMA_SEPARATED': 'es-UY',        // Uruguayan comma: 1,234,567.89 (Uruguay)
    'PRY_COMMA_SEPARATED': 'es-PY',        // Paraguayan comma: 1,234,567.89 (Paraguay)
    'BOL_COMMA_SEPARATED': 'es-BO',        // Bolivian comma: 1,234,567.89 (Bolivia)
    'CHL_COMMA_SEPARATED': 'es-CL',        // Chilean comma: 1,234,567.89 (Chile)
    'CRI_COMMA_SEPARATED': 'es-CR',        // Costa Rican comma: 1,234,567.89 (Costa Rica)
    'PAN_COMMA_SEPARATED': 'es-PA',        // Panamanian comma: 1,234,567.89 (Panama)
    'GTM_COMMA_SEPARATED': 'es-GT',        // Guatemalan comma: 1,234,567.89 (Guatemala)
    'HND_COMMA_SEPARATED': 'es-HN',        // Honduran comma: 1,234,567.89 (Honduras)
    'SLV_COMMA_SEPARATED': 'es-SV',        // Salvadoran comma: 1,234,567.89 (El Salvador)
    'NIC_COMMA_SEPARATED': 'es-NI',        // Nicaraguan comma: 1,234,567.89 (Nicaragua)
    'DOM_COMMA_SEPARATED': 'es-DO',        // Dominican comma: 1,234,567.89 (Dominican Republic)
    'CUB_COMMA_SEPARATED': 'es-CU',        // Cuban comma: 1,234,567.89 (Cuba)
    'PRI_COMMA_SEPARATED': 'es-PR',        // Puerto Rican comma: 1,234,567.89 (Puerto Rico)
    'BGD_COMMA_SEPARATED': 'bn-BD',        // Bangladeshi comma: 12,34,567.89 (Bangladesh - Indian style)
    'PAK_COMMA_SEPARATED': 'ur-PK',        // Pakistani comma: 12,34,567.89 (Pakistan - Indian style)
    'LKA_COMMA_SEPARATED': 'si-LK',        // Sri Lankan comma: 12,34,567.89 (Sri Lanka - Indian style)
    'NPL_COMMA_SEPARATED': 'ne-NP',        // Nepalese comma: 12,34,567.89 (Nepal - Indian style)
    'USA_COMMA_SEPARATED': 'en-US',        // US comma: 1,234,567.89 (United States)
    'GBR_COMMA_SEPARATED': 'en-GB',        // UK comma: 1,234,567.89 (United Kingdom)
    'AUS_COMMA_SEPARATED': 'en-AU',        // Australian comma: 1,234,567.89 (Australia)
    'CAN_COMMA_SEPARATED': 'en-CA',        // Canadian comma: 1,234,567.89 (Canada)
    'NZL_COMMA_SEPARATED': 'en-NZ',        // New Zealand comma: 1,234,567.89 (New Zealand)
    'IRL_COMMA_SEPARATED': 'en-IE',        // Irish comma: 1,234,567.89 (Ireland)
    'ZAF_COMMA_SEPARATED': 'en-ZA',        // South African comma: 1,234,567.89 (South Africa)
    'SGP_COMMA_SEPARATED': 'en-SG',        // Singaporean comma: 1,234,567.89 (Singapore)
    'PHL_COMMA_SEPARATED': 'en-PH',        // Philippine comma: 1,234,567.89 (Philippines)
    'HKG_COMMA_SEPARATED': 'en-HK',        // Hong Kong comma: 1,234,567.89 (Hong Kong)
    'LIE_APOSTROPHE_SEPARATED': 'de-LI',   // Liechtenstein apostrophe: 1'234'567.89 (Liechtenstein)

    // Additional African Countries
    'ZAR_SPACE_SEPARATED': 'en-ZA',        // South African space: 1 234 567,89 (South Africa)
    'NGN_COMMA_SEPARATED': 'en-NG',        // Nigerian comma: 1,234,567.89 (Nigeria)
    'KES_COMMA_SEPARATED': 'en-KE',        // Kenyan comma: 1,234,567.89 (Kenya)
    'GHS_COMMA_SEPARATED': 'en-GH',        // Ghanaian comma: 1,234,567.89 (Ghana)
    'ETB_COMMA_SEPARATED': 'am-ET',        // Ethiopian comma: 1,234,567.89 (Ethiopia)

    // Additional Asian Countries
    'INR_LAKH_SEPARATED': 'hi-IN',         // Hindi lakh format: 12,34,567.89 (India - Hindi)
    'MMK_COMMA_SEPARATED': 'my-MM',        // Myanmar comma: 1,234,567.89 (Myanmar)
    'KHR_COMMA_SEPARATED': 'km-KH',        // Cambodian comma: 1,234,567.89 (Cambodia)
    'LAK_COMMA_SEPARATED': 'lo-LA',        // Laotian comma: 1,234,567.89 (Laos)

    // Currency-Specific European Formats
    'CHF_APOSTROPHE_SEPARATED': 'de-CH',   // Swiss Franc apostrophe: 1'234'567.89 (Switzerland)
    'EUR_DOT_SEPARATED': 'de-DE',          // Euro dot format: 1.234.567,89 (Germany, Austria)
    'GBP_COMMA_SEPARATED': 'en-GB',        // British Pound comma: 1,234,567.89 (UK)
    'SEK_SPACE_SEPARATED': 'sv-SE',        // Swedish Krona space: 1 234 567,89 (Sweden)
    'NOK_SPACE_SEPARATED': 'nb-NO',        // Norwegian Krone space: 1 234 567,89 (Norway)
    'DKK_DOT_SEPARATED': 'da-DK',          // Danish Krone dot: 1.234.567,89 (Denmark)

    // Major Currency Formats
    'USD_COMMA_SEPARATED': 'en-US',        // US Dollar comma: 1,234,567.89 (United States)
    'EUR_SPACE_SEPARATED_FR': 'fr-FR',     // Euro space format: 1 234 567,89 (France)
    'JPY_COMMA_SEPARATED': 'ja-JP',        // Japanese Yen comma: 1,234,567 (Japan - no decimals)
    'CNY_COMMA_SEPARATED': 'zh-CN',        // Chinese Yuan comma: 1,234,567.89 (China)
    'KRW_COMMA_SEPARATED': 'ko-KR',        // Korean Won comma: 1,234,567 (South Korea - no decimals)
    'RUB_SPACE_SEPARATED': 'ru-RU',        // Russian Ruble space: 1 234 567,89 (Russia)

    // Regional Script Formats
    'ARAB_RTL_SEPARATED': 'ar-SA',         // Arabic RTL format: ٨٩.٥٦٧,٢٣٤,١ (Arabic numerals)
    'PERSIAN_SEPARATED': 'fa-IR',          // Persian format: ۱,۲۳۴,۵۶۷.۸۹ (Persian numerals)
    'HINDI_DEVANAGARI': 'hi-IN',           // Hindi Devanagari: १,२३,४५,६७८.८९ (Devanagari numerals)
    'BENGALI_SEPARATED': 'bn-BD',          // Bengali format: ১,২৩,৪৫,৬৭৮.৮৯ (Bengali numerals)

    // Special Business Formats
    'ACCOUNTING_PARENTHESES': 'en-US',     // Accounting format: (1,234,567.89) for negatives
    'SCIENTIFIC_NOTATION': 'en-US',        // Scientific: 1.23E+06
    'PERCENTAGE_FORMAT': 'en-US',          // Percentage: 123,456.78%
    'CURRENCY_SYMBOL_PREFIX': 'en-US',     // With symbol: $1,234,567.89
    'CURRENCY_SYMBOL_SUFFIX': 'en-IN'      // With symbol: 12,34,567.89₹
};

/** Country to Locale Mapping for GiddhNumberFormatPipe */
export const COUNTRY_LOCALE_MAP: { [key: string]: string } = {
    // Indian subcontinent - uses Indian comma format
    'IN': 'en-IN',    // India
    'BD': 'bn-BD',    // Bangladesh
    'PK': 'ur-PK',    // Pakistan
    'LK': 'si-LK',    // Sri Lanka
    'NP': 'ne-NP',    // Nepal

    // English-speaking countries - uses international comma format
    'US': 'en-US',    // United States
    'GB': 'en-GB',    // United Kingdom
    'AU': 'en-AU',    // Australia
    'CA': 'en-CA',    // Canada
    'NZ': 'en-NZ',    // New Zealand
    'IE': 'en-IE',    // Ireland
    'ZA': 'en-ZA',    // South Africa
    'SG': 'en-SG',    // Singapore
    'PH': 'en-PH',    // Philippines
    'HK': 'en-HK',    // Hong Kong

    // European countries - uses space format
    'FR': 'fr-FR',    // France
    'DE': 'de-DE',    // Germany
    'ES': 'es-ES',    // Spain
    'IT': 'it-IT',    // Italy
    'SE': 'sv-SE',    // Sweden
    'NO': 'nb-NO',    // Norway
    'DK': 'da-DK',    // Denmark
    'FI': 'fi-FI',    // Finland
    'NL': 'nl-NL',    // Netherlands
    'BE': 'fr-BE',    // Belgium
    'AT': 'de-AT',    // Austria
    'PL': 'pl-PL',    // Poland
    'CZ': 'cs-CZ',    // Czech Republic
    'SK': 'sk-SK',    // Slovakia
    'HU': 'hu-HU',    // Hungary
    'RO': 'ro-RO',    // Romania
    'BG': 'bg-BG',    // Bulgaria
    'HR': 'hr-HR',    // Croatia
    'SI': 'sl-SI',    // Slovenia
    'EE': 'et-EE',    // Estonia
    'LV': 'lv-LV',    // Latvia
    'LT': 'lt-LT',    // Lithuania
    'RU': 'ru-RU',    // Russia
    'UA': 'uk-UA',    // Ukraine
    'BY': 'be-BY',    // Belarus
    'PT': 'pt-PT',    // Portugal
    'GR': 'el-GR',    // Greece

    // Swiss - uses apostrophe format
    'CH': 'de-CH',    // Switzerland
    'LI': 'de-LI',    // Liechtenstein

    // Asian countries - mixed formats
    'JP': 'ja-JP',    // Japan - comma format
    'KR': 'ko-KR',    // South Korea - comma format
    'CN': 'zh-CN',    // China - comma format
    'TW': 'zh-TW',    // Taiwan - comma format
    'TH': 'th-TH',    // Thailand - comma format
    'VN': 'vi-VN',    // Vietnam - comma format
    'ID': 'id-ID',    // Indonesia - comma format
    'MY': 'ms-MY',    // Malaysia - comma format
    'MM': 'my-MM',    // Myanmar - comma format
    'KH': 'km-KH',    // Cambodia - comma format
    'LA': 'lo-LA',    // Laos - comma format

    // Middle East & Africa
    'AE': 'ar-AE',    // UAE - comma format
    'SA': 'ar-SA',    // Saudi Arabia - comma format
    'QA': 'ar-QA',    // Qatar - comma format
    'KW': 'ar-KW',    // Kuwait - comma format
    'BH': 'ar-BH',    // Bahrain - comma format
    'OM': 'ar-OM',    // Oman - comma format
    'JO': 'ar-JO',    // Jordan - comma format
    'LB': 'ar-LB',    // Lebanon - comma format
    'EG': 'ar-EG',    // Egypt - comma format
    'MA': 'ar-MA',    // Morocco - comma format
    'TN': 'ar-TN',    // Tunisia - comma format
    'DZ': 'ar-DZ',    // Algeria - comma format
    'TR': 'tr-TR',    // Turkey - comma format
    'IL': 'he-IL',    // Israel - comma format
    'IR': 'fa-IR',    // Iran - comma format
    'NG': 'en-NG',    // Nigeria - comma format
    'KE': 'en-KE',    // Kenya - comma format
    'GH': 'en-GH',    // Ghana - comma format
    'ET': 'am-ET',    // Ethiopia - comma format

    // Latin America
    'BR': 'pt-BR',    // Brazil - comma format
    'MX': 'es-MX',    // Mexico - comma format
    'AR': 'es-AR',    // Argentina - comma format
    'CL': 'es-CL',    // Chile - comma format
    'CO': 'es-CO',    // Colombia - comma format
    'PE': 'es-PE',    // Peru - comma format
    'VE': 'es-VE',    // Venezuela - comma format
    'EC': 'es-EC',    // Ecuador - comma format
    'UY': 'es-UY',    // Uruguay - comma format
    'PY': 'es-PY',    // Paraguay - comma format
    'BO': 'es-BO',    // Bolivia - comma format
    'CR': 'es-CR',    // Costa Rica - comma format
    'PA': 'es-PA',    // Panama - comma format
    'GT': 'es-GT',    // Guatemala - comma format
    'HN': 'es-HN',    // Honduras - comma format
    'SV': 'es-SV',    // El Salvador - comma format
    'NI': 'es-NI',    // Nicaragua - comma format
    'DO': 'es-DO',    // Dominican Republic - comma format
    'CU': 'es-CU',    // Cuba - comma format
    'PR': 'es-PR',    // Puerto Rico - comma format
};

/** Default locale for number formatting */
export const DEFAULT_NUMBER_FORMAT_LOCALE = 'en-IN';

/** Default display format for number formatting */
export const DEFAULT_NUMBER_DISPLAY_FORMAT = 'IND_COMMA_SEPARATED';

/** Global localStorage key for storing UI preferences and settings */
export const UI_SETTINGS_STORAGE_KEY = 'ui-settings';

/** Cache duration constants in milliseconds */
export const CACHE_DURATION = {
    ONE_DAY: 24 * 60 * 60 * 1000,
    SEVEN_DAYS: 7 * 24 * 60 * 60 * 1000,
    THIRTY_DAYS: 30 * 24 * 60 * 60 * 1000,
    ONE_YEAR: 365 * 24 * 60 * 60 * 1000
};

/** Holds all possible field types for form fields */
export enum FormFieldsType {
    BOOLEAN = 'BOOLEAN',
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    BARCODE = 'BARCODE'
}

/** Round off threshold for 4 decimal place precision */
export const ROUND_OFF_THRESHOLD = 0.5555; 