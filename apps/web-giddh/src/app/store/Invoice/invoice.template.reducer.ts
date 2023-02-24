import { BaseResponse } from '../../models/api-models/BaseResponse';
import { CustomTemplateResponse } from '../../models/api-models/Invoice';
import { INVOICE } from '../../actions/invoice/invoice.const';
import { CustomActions } from '../customActions';
import { COMMON_ACTIONS } from '../../actions/common.const';
import { UNAUTHORISED } from '../../app.constant';

export interface CustomTemplateState {
    sampleTemplates: CustomTemplateResponse[];
    customCreatedTemplates: CustomTemplateResponse[];
    defaultTemplate: CustomTemplateResponse;
    hasInvoiceTemplatePermissions: boolean;
}

export const initialState: CustomTemplateState = {
    sampleTemplates: null,
    customCreatedTemplates: null,
    defaultTemplate: {
        createdBy: null,
        fontSize: 14,
        fontSmall: 10,
        fontDefault: 14,
        isDefault: false,
        fontMedium: 12,
        isDefaultForVoucher: false,
        uniqueName: 'gst_template_a',
        createdAt: '',
        updatedAt: '',
        updatedBy: null,
        sections: {
            footer: {
                data: {
                    totalTax: {
                        label: 'Total Tax*',
                        display: true,
                        width: null
                    },
                    thanks: {
                        label: '',
                        display: true,
                        width: null
                    },
                    taxableAmount: {
                        label: 'Sub Total',
                        display: true,
                        width: null
                    },
                    otherDeduction: {
                        label: '',
                        display: true,
                        width: null
                    },
                    imageSignature: {
                        label: '',
                        display: false,
                        width: null
                    },
                    grandTotal: {
                        label: 'Invoice Total',
                        display: true,
                        width: null
                    },
                    totalInWords: {
                        label: 'Invoice Total (In words)',
                        display: true,
                        width: null
                    },
                    totalDue: {
                        label: 'Total Due',
                        display: true,
                        width: null
                    },
                    companyAddress: {
                        label: '',
                        display: true,
                        width: null
                    },
                    companyName: {
                        label: '',
                        display: true,
                        width: null
                    },
                    slogan: {
                        label: '',
                        display: true,
                        width: null
                    },
                    textUnderSlogan: {
                        label: '',
                        display: true,
                        width: null
                    },
                    showNotesAtLastPage: {
                        label: '',
                        display: false,
                        width: null
                    },
                    message1: {
                        label: '',
                        display: true,
                        width: null
                    },
                    showMessage2: {
                        label: '',
                        display: true,
                        width: null
                    },
                    tcs: { // this is for template a
                        label: 'TCS',
                        display: true,
                        width: null
                    },
                    tds: { // this is for template a
                        label: 'TDS',
                        display: true,
                        width: null
                    },
                    taxBifurcation: { // this is for template a
                        label: 'Tax Bifurcation',
                        display: true,
                        width: null
                    },
                }
            },
            header: {
                data: {
                    shippingDate: {
                        label: 'Ship Date',
                        display: true,
                        width: null
                    },
                    showIrnNumber: {
                        label: '',
                        display: false,
                        width: null
                    },
                    customField1: {
                        label: '',
                        display: true,
                        width: null
                    },
                    customField2: {
                        label: '',
                        display: true,
                        width: null
                    },
                    shippedVia: {
                        label: 'Ship Via',
                        display: true,
                        width: null
                    },
                    customField3: {
                        label: '',
                        display: true,
                        width: null
                    },
                    companyName: {
                        label: '',
                        display: true,
                        width: null
                    },
                    dueDate: {
                        label: 'Due Date',
                        display: true,
                        width: null
                    },
                    gstComposition: {
                        label: '',
                        display: true,
                        width: null
                    },
                    gstin: {
                        label: 'GSTIN',
                        display: true,
                        width: null
                    },
                    shippingGstin: {
                        label: 'GSTIN',
                        display: true,
                        width: null
                    },
                    voucherNumber: {
                        label: 'Voucher No.',
                        display: true,
                        width: null
                    },
                    customerEmail: {
                        label: '',
                        display: true,
                        width: null
                    },
                    invoiceNumber: {
                        label: 'Invoice No.',
                        display: true,
                        width: null
                    },
                    showQrCode: {
                        label: '',
                        display: false,
                        width: null
                    },
                    voucherDate: {
                        label: 'Voucher Date',
                        display: true,
                        width: null
                    },
                    customerMobileNumber: {
                        label: '',
                        display: true,
                        width: null
                    },
                    attentionTo: {
                        label: 'Attention To',
                        display: true,
                        width: null
                    },
                    pan: {
                        label: 'PAN',
                        display: true,
                        width: null
                    },
                    trackingNumber: {
                        label: 'Tracking No.',
                        display: true,
                        width: null
                    },
                    formNameInvoice: {
                        label: 'INVOICE',
                        display: true,
                        width: null
                    },
                    billingGstin: {
                        label: 'GSTIN',
                        display: true,
                        width: null
                    },
                    address: {
                        label: '',
                        display: true,
                        width: null
                    },
                    billingState: {
                        label: 'State',
                        display: true,
                        width: null
                    },
                    invoiceDate: {
                        label: 'Invoice Date',
                        display: true,
                        width: null
                    },
                    customerName: {
                        label: '',
                        display: true,
                        width: null
                    },
                    formNameTaxInvoice: {
                        label: 'TAX INVOICE',
                        display: true,
                        width: null
                    },
                    shippingAddress: {
                        label: 'Shipping Address',
                        display: true,
                        width: null
                    },
                    shippingState: {
                        label: 'State',
                        display: true,
                        width: null
                    },
                    billingAddress: {
                        label: 'Billing Address',
                        display: true,
                        width: null
                    },
                    warehouseAddress: {
                        label: '',
                        display: true,
                        width: null
                    },
                    showCompanyAddress: {
                        label: '',
                        display: true,
                        width: null
                    },
                }
            },
            table: {
                data: {
                    date: {
                        label: 'Date',
                        display: true,
                        width: '10'
                    },
                    item: {
                        label: 'Description',
                        display: true,
                        width: '10'
                    },
                    total: {
                        label: 'Total',
                        display: true,
                        width: '10'
                    },
                    quantity: {
                        label: 'Qty.',
                        display: true,
                        width: '10'
                    },
                    sNo: {
                        label: '#',
                        display: true,
                        width: '10'
                    },
                    rate: {
                        label: 'Rate/ Item',
                        display: true,
                        width: '10'
                    },
                    taxableValue: {
                        label: 'Taxable Amt.',
                        display: true,
                        width: '10'
                    },
                    previousDue: {
                        label: 'Previous Due',
                        display: false,
                        width: null
                    },
                    description: {
                        label: 'Some label',
                        display: true,
                        width: '10'
                    },
                    discount: {
                        label: 'Dis./ Item',
                        display: true,
                        width: '10'
                    },
                    taxes: {
                        label: 'Taxes',
                        display: true,
                        width: '10'
                    },
                    showDescriptionInRows: {
                        label: '',
                        display: false,
                        width: null
                    },
                    hsnSac: {
                        label: 'HSN/SAC',
                        display: true,
                        width: '10'
                    },
                    otherTaxBifurcation: {
                        label: "TCS",
                        display: true,
                        width: null
                    },
                    totalQuantity: { // this is for template e
                        label: 'Total Quantity',
                        display: true,
                        width: null
                    }
                }
            }
        },
        font: 'open sans',
        topMargin: 10,
        leftMargin: 10,
        rightMargin: 10,
        bottomMargin: 10,
        logoPosition: 'center/left/right',
        logoSize: 'small/medium/large',
        logoUniqueName: null,
        copyFrom: 'gst_template_a',
        templateColor: '#f63407',
        tableColor: '#ffffff',
        templateType: 'gst_template_a',
        name: '',
    },
    hasInvoiceTemplatePermissions: true

};

export function InvoiceTemplateReducer(state = initialState, action: CustomActions): CustomTemplateState {
    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
        case INVOICE.TEMPLATE.GET_SAMPLE_TEMPLATES_RESPONSE: {
            let nextState = _.cloneDeep(state);
            let res: BaseResponse<CustomTemplateResponse[], string> = action.payload;
            if (res && res.status === 'success') {
                nextState.sampleTemplates = res.body;
            }
            return Object.assign({}, state, nextState);
        }
        case INVOICE.TEMPLATE.GET_ALL_CREATED_TEMPLATES_RESPONSE: {
            let nextState = _.cloneDeep(state);
            let res: BaseResponse<CustomTemplateResponse[], string> = action.payload;
            if (res && res.status === 'success') {
                nextState.customCreatedTemplates = _.sortBy(res.body, [(o) => !o.isDefault]);
                nextState.hasInvoiceTemplatePermissions = true;
            } else if(res?.status === 'error' && res.statusCode === UNAUTHORISED) {
                nextState.hasInvoiceTemplatePermissions = false;
            }
            return Object.assign({}, state, nextState);
        }
        case INVOICE.TEMPLATE.SET_TEMPLATE_AS_DEFAULT_RESPONSE: {
            let nextState = _.cloneDeep(state);
            let res: BaseResponse<any, string> = action.payload;
            if (res?.status === 'success') {
                let uniqName = res.queryString?.templateUniqueName;
                let indx = nextState.customCreatedTemplates.findIndex((template) => template?.uniqueName === uniqName);
                if (indx > -1) {
                    if (res.body.type === 'voucher') {
                        nextState.customCreatedTemplates.forEach((tem) => tem.isDefaultForVoucher = false);
                        nextState.customCreatedTemplates[indx].isDefaultForVoucher = true;
                    } else {
                        nextState.customCreatedTemplates.forEach((tem) => tem.isDefault = false);
                        nextState.customCreatedTemplates[indx].isDefault = true;
                    }
                }
                return Object.assign({}, state, nextState);
            }
            return state;
        }
        case INVOICE.TEMPLATE.DELETE_TEMPLATE_RESPONSE: {
            let nextState = _.cloneDeep(state);
            let res: BaseResponse<any, string> = action.payload;
            if (res?.status === 'success') {
                let uniqName = res?.queryString?.templateUniqueName;
                let indx = nextState.customCreatedTemplates.findIndex((template) => template?.uniqueName === uniqName);
                if (indx > -1) {
                    nextState.customCreatedTemplates.splice(indx, 1);
                }
                return Object.assign({}, state, nextState);
            }
            return state;
        }
        default: {
            return state;
        }
    }
}
