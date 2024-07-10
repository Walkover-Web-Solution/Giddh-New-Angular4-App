import * as dayjs from 'dayjs';
import * as quarterOfYear from 'dayjs/plugin/quarterOfYear' // load on demand
import { ajax } from 'rxjs/ajax';
dayjs.extend(quarterOfYear) // use plugin

export const Configuration = {
    'AppUrl': AppUrl,
    'ApiUrl': ApiUrl,
    'isElectron': isElectron,
    'APP_FOLDER': APP_FOLDER
};

/** Add Company business type*/
export enum BusinessTypes {
    Registered = 'Registered',
    Unregistered = 'Unregistered'
};

export const MOBILE_NUMBER_UTIL_URL = 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.17/js/utils.js';
export const INTL_INPUT_OPTION = {
    nationalMode: true,
    utilsScript: MOBILE_NUMBER_UTIL_URL,
    autoHideDialCode: false,
    separateDialCode: false,
    initialCountry: 'auto',
    geoIpLookup: (success: any, failure: any) => {
        let countryCode = 'in';
        const fetchIPApi = ajax({
            url: MOBILE_NUMBER_SELF_URL,
            method: 'GET',
        });

        fetchIPApi.subscribe({
            next: (res: any) => {
                if (res?.response?.ipAddress) {
                    const fetchCountryByIpApi = ajax({
                        url: MOBILE_NUMBER_IP_ADDRESS_URL + res.response.ipAddress,
                        method: 'GET',
                    });

                    fetchCountryByIpApi.subscribe({
                        next: (fetchCountryByIpApiRes: any) => {
                            if (fetchCountryByIpApiRes?.response?.countryCode) {
                                return success(fetchCountryByIpApiRes.response.countryCode);
                            } else {
                                return success(countryCode);
                            }
                        },
                        error: (fetchCountryByIpApiErr) => {
                            const fetchCountryByIpInfoApi = ajax({
                                url: MOBILE_NUMBER_ADDRESS_JSON_URL + `${res.response.ipAddress}/json`,
                                method: 'GET',
                            });

                            fetchCountryByIpInfoApi.subscribe({
                                next: (fetchCountryByIpInfoApiRes: any) => {
                                    if (fetchCountryByIpInfoApiRes?.response?.country) {
                                        return success(fetchCountryByIpInfoApiRes.response.country);
                                    } else {
                                        return success(countryCode);
                                    }
                                },
                                error: (fetchCountryByIpInfoApiErr) => {
                                    return success(countryCode);
                                },
                            });
                        },
                    });
                } else {
                    return success(countryCode);
                }
            },
            error: (err) => {
                return success(countryCode);
            },
        });
    },
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
/** Pagination count options */
export const PAGE_SIZE_OPTIONS = [20, 50, 100];
/** API default count limit */
export const API_COUNT_LIMIT = 20;
/** Vouchers pagination limit  */
export const ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT = 200;

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

export const API_POSTMAN_DOC_URL = 'https://apidoc.giddh.com/';

/** Decimal point for rate field, irrespective of user profile preference
 * will be displayed up to 4 decimal places
 */
export const RATE_FIELD_PRECISION = 4;

/** High precision for rate value to avoid variation in rate */
export const HIGH_RATE_FIELD_PRECISION = 16;

/** Regex to remove trailing zeros from a string representation of number */
export const REMOVE_TRAILING_ZERO_REGEX = /^([\d,' ]*)$|^([\d,' ]*)\.0*$|^([\d,' ]+\.[0-9]*?)0*$/;

/** Regex for mobile number */
export const PHONE_NUMBER_REGEX = /^[0-9-+()\/\\ ]+$/;


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
    '/pages/settings/financial-year',
    '/pages/user-details/subscription'
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
/** Email Validation Regex */
export const EMAIL_VALIDATION_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
export const CALENDLY_URL = "https://calendly.com/sales-accounting-software/talk-to-sale";
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
export const MOBILE_NUMBER_SELF_URL = `https://api.db-ip.com/v2/free/self`;
export const MOBILE_NUMBER_IP_ADDRESS_URL = 'http://ip-api.com/json/';
export const MOBILE_NUMBER_ADDRESS_JSON_URL = 'https://ipinfo.io/';



export const OTP_PROVIDER_URL = `https://control.msg91.com/app/assets/otp-provider/otp-provider.js?time=${new Date().getTime()}`;
export const RESTRICTED_VOUCHERS_FOR_DOWNLOAD = ['journal'];
export const SAMPLE_FILES_URL = 'https://giddh-import-sample-files.s3.ap-south-1.amazonaws.com/sample-file-';
export const OTP_WIDGET_ID_NEW = '33686b716134333831313239';
export const OTP_WIDGET_TOKEN_NEW = '205968TmXguUAwoD633af103P1';
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
