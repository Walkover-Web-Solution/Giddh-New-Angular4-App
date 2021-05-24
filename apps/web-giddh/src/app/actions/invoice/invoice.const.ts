export const INVOICE = {
    TEMPLATE: {
        SELECT_TEMPLATE: 'SELECT_TEMPLATE',
        GET_SAMPLE_TEMPLATES: 'GET_SAMPLE_TEMPLATES',
        GET_SAMPLE_TEMPLATES_RESPONSE: 'GET_SAMPLE_TEMPLATES_RESPONSE',
        GET_ALL_CREATED_TEMPLATES: 'GET_ALL_CREATED_TEMPLATES',
        GET_ALL_CREATED_TEMPLATES_RESPONSE: 'GET_ALL_CREATED_TEMPLATES_RESPONSE',
        SET_TEMPLATE_AS_DEFAULT: 'SET_TEMPLATE_AS_DEFAULT',
        SET_TEMPLATE_AS_DEFAULT_RESPONSE: 'SET_TEMPLATE_AS_DEFAULT_RESPONSE',
        DELETE_TEMPLATE: 'DELETE_TEMPLATE',
        DELETE_TEMPLATE_RESPONSE: 'DELETE_TEMPLATE_RESPONSE',
        SET_TEMPLATE_STATE: 'SET_TEMPLATE_STATE',
        GET_CURRENT_TEMPLATE: 'GET_CURRENT_TEMPLATE',
        SET_TEMPLATE_DATA: 'SET_TEMPLATE_DATA',
        UPDATE_GSTIN: 'UPDATE_GSTIN',
        SET_VISIBLE: 'SET_VISIBLE',
        UPDATE_PAN: 'UPDATE_PAN',
        UPDATE_INVOICE_DATE: 'UPDATE_INVOICE_DATE',
        UPDATE_INVOICE_NO: 'UPDATE_INVOICE_NO',
        UPDATE_SHIPPING_DATE: 'UPDATE_SHIPPING_DATE',
        UPDATE_SHIPPING_VIA: 'UPDATE_SHIPPING_VIA',
        UPDATE_SHIPPING_NO: 'UPDATE_SHIPPING_NO',
        UPDATE_TRACKING_DATE: 'UPDATE_TRACKING_DATE',
        UPDATE_TRACKING_NO: 'UPDATE_TRACKING_NO',
        UPDATE_CUSTOMER_NAME: 'UPDATE_CUSTOMER_NAME',
        UPDATE_CUSTOMER_EMAIL: 'UPDATE_CUSTOMER_EMAIL',
        UPDATE_CUSTOMER_MOBILE_NO: 'UPDATE_CUSTOMER_MOBILE_NO',
        UPDATE_DUE_DATE: 'UPDATE_DUE_DATE',
        UPDATE_BILLING_STATE: 'UPDATE_BILLING_STATE',
        UPDATE_BILLING_ADDRESS: 'UPDATE_BILLING_ADDRESS',
        UPDATE_BILLING_GSTIN: 'UPDATE_BILLING_GSTIN',
        UPDATE_SHIPPING_STATE: 'UPDATE_SHIPPING_STATE',
        UPDATE_SHIPPING_ADDRESS: 'UPDATE_SHIPPING_ADDRESS',
        UPDATE_SHIPPING_GSTIN: 'UPDATE_SHIPPING_GSTIN',
        UPDATE_CUSTOM_FIELD_1: 'UPDATE_CUSTOM_FIELD_1',
        UPDATE_CUSTOM_FIELD_2: 'UPDATE_CUSTOM_FIELD_2',
        UPDATE_CUSTOM_FIELD_3: 'UPDATE_CUSTOM_FIELD_3',
        UPDATE_FORM_NAME_INVOICE: 'UPDATE_FORM_NAME_INVOICE',
        UPDATE_FORM_NAME_TAX_INVOICE: 'UPDATE_FORM_NAME_TAX_INVOICE',
        UPDATE_SNOLABEL: 'UPDATE_SNOLABEL',
        UPDATE_DATE_LABEL: 'UPDATE_DATE_LABEL',
        UPDATE_ITEM_LABEL: 'UPDATE_ITEM_LABEL',
        UPDATE_HSNSAC_LABEL: 'UPDATE_HSNSAC_LABEL',
        UPDATE_ITEM_CODE_LABEL: 'UPDATE_ITEM_CODE_LABEL',
        UPDATE_DESC_LABEL: 'UPDATE_DESC_LABEL',
        UPDATE_RATE_LABEL: 'UPDATE_RATE_LABEL',
        UPDATE_DISCOUNT_LABEL: 'UPDATE_DISCOUNT_LABEL',
        UPDATE_TAXABLE_VALUE_LABEL: 'UPDATE_TAXABLE_VALUE_LABEL',
        UPDATE_TAX_LABEL: 'UPDATE_TAX_LABEL',
        UPDATE_TOTAL_LABEL: 'UPDATE_TOTAL_LABEL',
        UPDATE_QUANTITY_LABEL: 'UPDATE_QUANTITY_LABEL',
        UPDATE_RIGHT_MARGIN: 'UPDATE_RIGHT_MARGIN',
        UPDATE_LEFT_MARGIN: 'UPDATE_LEFT_MARGIN',
        UPDATE_TOP_MARGIN: 'UPDATE_TOP_MARGIN',
        UPDATE_BOTTOM_MARGIN: 'UPDATE_BOTTOM_MARGIN',
        UPDATE_MESSAGE1: 'UPDATE_MESSAGE1',
        UPDATE_MESSAGE2: 'UPDATE_MESSAGE2',
        SET_FONT: 'SET_FONT',
        SET_COLOR: 'SET_COLOR',

    },
    CONTENT: {
        SET_HEADING: 'SET_HEADING',
        SET_COLUMN_WIDTH: 'SET_COLUMN_WIDTH',
    },
    SETTING: {
        GET_INVOICE_SETTING: 'GET_INVOICE_SETTING',
        GET_INVOICE_SETTING_RESPONSE: 'GET_INVOICE_SETTING_RESPONSE',
        DELETE_WEBHOOK: 'DELETE_WEBHOOK',
        DELETE_WEBHOOK_RESPONSE: 'DELETE_WEBHOOK_RESPONSE',
        UPDATE_INVOICE_EMAIL: 'UPDATE_INVOICE_EMAIL',
        UPDATE_INVOICE_EMAIL_RESPONSE: 'UPDATE_INVOICE_EMAIL_RESPONSE',
        SAVE_INVOICE_WEBHOOK: 'SAVE_INVOICE_WEBHOOK',
        SAVE_INVOICE_WEBHOOK_RESPONSE: 'SAVE_INVOICE_WEBHOOK_RESPONSE',
        UPDATE_INVOICE_SETTING: 'UPDATE_INVOICE_SETTING',
        UPDATE_INVOICE_SETTING_RESPONSE: 'UPDATE_INVOICE_SETTING_RESPONSE',
        GET_RAZORPAY_DETAIL: 'GET_RAZORPAY_DETAIL',
        GET_RAZORPAY_DETAIL_RESPONSE: 'GET_RAZORPAY_DETAIL_RESPONSE',
        UPDATE_RAZORPAY_DETAIL: 'UPDATE_RAZORPAY_DETAIL',
        UPDATE_RAZORPAY_DETAIL_RESPONSE: 'UPDATE_RAZORPAY_DETAIL_RESPONSE',
        DELETE_RAZORPAY_DETAIL: 'DELETE_RAZORPAY_DETAIL',
        DELETE_RAZORPAY_DETAIL_RESPONSE: 'DELETE_RAZORPAY_DETAIL_RESPONSE',
        DELETE_INVOICE_EMAIL: 'DELETE_INVOICE_EMAIL',
        DELETE_INVOICE_EMAIL_RESPONSE: 'DELETE_INVOICE_EMAIL_RESPONSE',
        SAVE_RAZORPAY_DETAIL: 'SAVE_RAZORPAY_DETAIL',
        SAVE_RAZORPAY_DETAIL_RESPONSE: 'SAVE_RAZORPAY_DETAIL_RESPONSE',
    },
    RECURRING: {
        GET_RECURRING_INVOICE_DATA: 'GET_RECURRING_INVOICE_DATA',
        GET_RECURRING_INVOICE_DATA_RESPONSE: 'GET_RECURRING_INVOICE_DATA_RESPONSE',
        CREATE_RECURRING_INVOICE: 'CREATE_RECURRING_INVOICE',
        CREATE_RECURRING_INVOICE_RESPONSE: 'CREATE_RECURRING_INVOICE_RESPONSE',
        UPDATE_RECURRING_INVOICE: 'UPDATE_RECURRING_INVOICE',
        UPDATE_RECURRING_INVOICE_RESPONSE: 'UPDATE_RECURRING_INVOICE_RESPONSE',
        DELETE_RECURRING_INVOICE: 'DELETE_RECURRING_INVOICE',
        DELETE_RECURRING_INVOICE_RESPONSE: 'DELETE_RECURRING_INVOICE_RESPONSE',
        RESET_RECURRING_INVOICE_REQUEST: 'RESET_RECURRING_INVOICE_REQUEST'
    }
};

export const INVOICE_ACTIONS = {
    GET_ALL_INVOICES: 'GET_ALL_INVOICES',
    GET_ALL_INVOICES_RESPONSE: 'GET_ALL_INVOICES_RESPONSE',
    GET_ALL_LEDGERS_FOR_INVOICE: 'GET_ALL_LEDGERS_FOR_INVOICE',
    GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE: 'GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE',
    PREVIEW_INVOICE: 'PREVIEW_INVOICE',
    PREVIEW_INVOICE_RESPONSE: 'PREVIEW_INVOICE_RESPONSE',
    GENERATE_INVOICE: 'GENERATE_INVOICE',
    GENERATE_INVOICE_RESPONSE: 'GENERATE_INVOICE_RESPONSE',
    GET_INVOICE_TEMPLATE_DETAILS: 'GET_INVOICE_TEMPLATE_DETAILS',
    GET_INVOICE_TEMPLATE_DETAILS_RESPONSE: 'GET_INVOICE_TEMPLATE_DETAILS_RESPONSE',
    GENERATE_BULK_INVOICE: 'GENERATE_BULK_INVOICE',
    GENERATE_BULK_INVOICE_RESPONSE: 'GENERATE_BULK_INVOICE_RESPONSE',
    ACTION_ON_INVOICE: 'ACTION_ON_INVOICE',
    ACTION_ON_INVOICE_RESPONSE: 'ACTION_ON_INVOICE_RESPONSE',
    SEND_MAIL: 'SEND_MAIL',
    SEND_MAIL_RESPONSE: 'SEND_MAIL_RESPONSE',
    DELETE_INVOICE: 'DELETE_INVOICE',
    DELETE_INVOICE_RESPONSE: 'DELETE_INVOICE_RESPONSE',
    MODIFIED_INVOICE_STATE_DATA: 'MODIFIED_INVOICE_STATE_DATA',
    INVOICE_GENERATION_COMPLETED: 'INVOICE_GENERATION_COMPLETED',
    RESET_INVOICE_DATA: 'RESET_INVOICE_DATA',
    DOWNLOAD_INVOICE: 'DOWNLOAD_INVOICE',
    DOWNLOAD_INVOICE_RESPONSE: 'DOWNLOAD_INVOICE_RESPONSE',
    PREVIEW_OF_GENERATED_INVOICE: 'PREVIEW_OF_GENERATED_INVOICE',
    PREVIEW_OF_GENERATED_INVOICE_RESPONSE: 'PREVIEW_OF_GENERATED_INVOICE_RESPONSE',
    VISIT_FROM_PREVIEW: 'VISIT_FROM_PREVIEW',
    UPDATE_GENERATED_INVOICE: 'UPDATE_GENERATED_INVOICE',
    UPDATE_GENERATED_INVOICE_RESPONSE: 'UPDATE_GENERATED_INVOICE_RESPONSE',
    SEND_SMS: 'SEND_SMS',
    SEND_SMS_RESPONSE: 'SEND_SMS_RESPONSE',
    DOWNLOAD_INVOICE_EXPORTED_RESPONSE: ' DOWNLOAD_INVOICE_EXPORTED_RESPONSE',
    DOWNLOAD_INVOICE_EXPORTED: ' DOWNLOAD_INVOICE_EXPORTED',
    GENERATE_BULK_E_INVOICE: 'GENERATE_BULK_E_INVOICE',
    CANCEL_E_INVOICE: 'CANCEL_E_INVOICE',
    CANCEL_E_INVOICE_RESPONSE: 'CANCEL_E_INVOICE_RESPONSE',
    GENERATE_BULK_E_INVOICE_RESPONSE: 'GENERATE_BULK_E_INVOICE_RESPONSE',
    RESET_BULK_E_INVOICE_RESPONSE: 'RESET_BULK_E_INVOICE_RESPONSE',
};
export const EWAYBILL_ACTIONS = {
    LOGIN_EAYBILL_USER: 'LOGIN_EAYBILL_USER',
    LOGIN_EAYBILL_USER_RESPONSE: 'LOGIN_EAYBILL_USER_RESPONSE',
    IS_LOOGEDIN_USER_EWAYBILL: 'IS_LOOGEDIN_USER_EWAYBILL',
    IS_LOOGEDIN_USER_EWAYBILL_RESPONSE: 'IS_LOOGEDIN_USER_EWAYBILL_RESPONSE',
    GET_ADD_EAYBILL_USER: 'GET_ADD_EAYBILL_USER',
    GENERATE_EWAYBILL: 'GENERATE_EWAYBILL',
    GENERATE_EWAYBILL_RESPONSE: 'GENERATE_EWAYBILL_RESPONSE',

    GET_All_LIST_EWAYBILLS: 'GET_All_LIST_EWAYBILLS',
    GET_All_LIST_EWAYBILLS_RESPONSE: 'GET_All_LIST_EWAYBILLS_RESPONSE',

    GET_All_FILTERED_LIST_EWAYBILLS: 'GET_All_FILTERED_LIST_EWAYBILLS',
    GET_All_FILTERED_LIST_EWAYBILLS_RESPONSE: 'GET_All_FILTERED_LIST_EWAYBILLS_RESPONSE',

    GET_EWAYBILLS_USER: 'GET_EWAYBILLS_USER',
    GET_EWAYBILLS_USER_RESPONSE: 'GET_EWAYBILLS_USER_RESPONSE',

    DOWNLOAD_EWAYBILL: 'DOWNLOAD_EWAYBILL',
    DOWNLOAD_EWAYBILL_RESPONSE: 'DOWNLOAD_EWAYBILL_RESPONSE',

    ADD_TRANSPORTER: 'ADD_TRANSPORTER',
    ADD_TRANSPORTER_RESPONSE: 'ADD_TRANSPORTER_RESPONSE',

    GET_TRANSPORTER_BYID: 'GET_TRANSPORTER_BYID',
    GET_TRANSPORTER_BYID_RESPONSE: 'GET_TRANSPORTER_BYID_RESPONSE',

    GET_ALL_TRANSPORTER: 'GET_ALL_TRANSPORTER',
    GET_ALL_TRANSPORTER_RESPONSE: 'GET_ALL_TRANSPORTER_RESPONSE',
    UPDATE_TRANSPORTER: 'UPDATE_TRANSPORTER',
    UPDATE_TRANSPORTER_RESPONSE: 'UPDATE_TRANSPORTER_RESPONSE',
    DELETE_TRANSPORTER: 'DELETE_TRANSPORTER',
    DELETE_TRANSPORTER_RESPONSE: 'DELETE_TRANSPORTER_RESPONSE',
    RESET_ALL_TRANSPORTER_RESPONSE: 'RESET_ALL_TRANSPORTER_RESPONSE',

    UPDATE_EWAY_VEHICLE: 'UPDATE_EWAY_VEHICLE',
    UPDATE_EWAY_VEHICLE_RESPONSE: 'UPDATE_EWAY_VEHICLE_RESPONSE:',
    CANCEL_EWAYBILL: 'CANCEL_EWAYBILL',
    CANCEL_EWAYBILL_RESPONSE: 'CANCEL_EWAYBILL_RESPONSE',
};
