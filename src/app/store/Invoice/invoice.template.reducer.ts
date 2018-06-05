import { Action } from '@ngrx/store';
import { ICommonResponseOfManufactureItem, IManufacturingItemRequest, IManufacturingUnqItemObj } from '../../../models/interfaces/manufacturing.interface';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import * as _ from '../../lodash-optimized';
import { CustomTemplateResponse } from '../../models/api-models/Invoice';
import { INVOICE } from '../../actions/invoice/invoice.const';
import { CustomActions } from '../customActions';

export interface CustomTemplateState {
  sampleTemplates: CustomTemplateResponse[];
  customCreatedTemplates: CustomTemplateResponse[];
  defaultTemplate: CustomTemplateResponse;
}

export const initialState: CustomTemplateState = {
  sampleTemplates: null,
  customCreatedTemplates: null,
  defaultTemplate: {
    logoUniqueName: null,
    createdBy: null,
    uniqueName: '',
    fontSize: '10pt',
    createdAt: '16-09-2017 13:36:17',
    updatedAt: '16-09-2017 13:36:17',
    updatedBy: null,
    sample: true,
    templateColor: '#df4927',
    tableColor: '#fdf6f4',
    font: 'Roboto',
    topMargin: 10,
    leftMargin: 10,
    rightMargin: 10,
    bottomMargin: 10,
    logoPosition: '',
    logoSize: '140',
    isDefault: false,
    copyFrom: 'gst_template_a',
    sections: [
      {
        sectionName: 'header',
        content: [
          {
            display: true,
            label: 'Walkover',
            field: 'companyName',
            width: null
          },
          {
            display: true,
            label: 'GSTIN',
            field: 'gstin',
            width: null
          },
          {
            display: true,
            label: 'PAN',
            field: 'pan',
            width: null
          },
          {
            display: true,
            label: '',
            field: 'address',
            width: null
          },
          {
            display: true,
            label: 'Invoice Date',
            field: 'invoiceDate',
            width: null
          },
          {
            display: true,
            label: 'Invoice No.',
            field: 'invoiceNumber',
            width: null
          },
          {
            display: true,
            label: 'Ship Date',
            field: 'shippingDate',
            width: null
          },
          {
            display: true,
            label: 'Ship Via',
            field: 'shippedVia',
            width: null
          },
          {
            display: true,
            label: 'Tracking No.',
            field: 'trackingNumber',
            width: null
          },
          // {
          //   display: true,
          //   label: 'Tracking No.',
          //   field: 'trackingNumber',
          //   width: null
          // },
          {
            display: true,
            label: 'Mr. John Doe',
            field: 'customerName',
            width: null
          },
          {
            display: true,
            label: 'john@gmail.com',
            field: 'customerEmail',
            width: null
          },
          {
            display: true,
            label: '+91 9876543210',
            field: 'customerMobileNumber',
            width: null
          },
          {
            display: true,
            label: 'Due Date',
            field: 'dueDate',
            width: null
          },
          {
            display: true,
            label: 'Billing State',
            field: 'billingState',
            width: null
          },
          {
            display: true,
            label: 'Billing Address',
            field: 'billingAddress',
            width: null
          },
          {
            display: true,
            label: 'GSTIN',
            field: 'billingGstin',
            width: null
          },
          {
            display: true,
            label: 'Shipping Address',
            field: 'shippingAddress',
            width: null
          },
          {
            display: true,
            label: 'Shipping State',
            field: 'shippingState',
            width: null
          },
          {
            display: true,
            label: 'GSTIN',
            field: 'shippingGstin',
            width: null
          },
          {
            display: true,
            label: 'Field 1',
            field: 'customField1',
            width: null
          },
          {
            display:  true,
            label: 'Field 2',
            field: 'customField2',
            width: null
          },
          {
            display: true,
            label: 'Field 3',
            field: 'customField3',
            width: null
          },
          {
            display: true,
            label: 'INVOICE',
            field: 'formNameInvoice',
            width: null
          },
          {
            display: true,
            label: 'TAX INVOICE',
            field: 'formNameTaxInvoice',
            width: null
          },
          {
            display: true,
            label: 'Attention To',
            field: 'attentionTo',
            width: null
          }
        ]
      },
      {
        sectionName: 'table',
        content: [
          {
            display: true,
            label: 'S no.',
            field: 'sNo',
            width: '10'
          },
          {
            display: true,
            label: 'Date',
            field: 'date',
            width: '10'
          },
          {
            display: true,
            label: 'Item',
            field: 'item',
            width: '10'
          },
          {
            display: true,
            label: 'HSN/ SAC',
            field: 'hsnSac',
            width: '10'
          },
          // {
          //   display: true,
          //   label: 'Item Code',
          //   field: 'itemCode',
          //   width: '10'
          // },
          {
            display: true,
            label: 'Qty.',
            field: 'quantity',
            width: '10'
          },
          {
            display: true,
            label: 'description',
            field: 'description',
            width: '10'
          },
          {
            display: true,
            label: 'Rate',
            field: 'rate',
            width: '10'
          },
          {
            display: true,
            label: 'Disc.',
            field: 'discount',
            width: '10'
          },
          {
            display: true,
            label: 'Taxable Value',
            field: 'taxableValue',
            width: '10'
          },
          {
            display: true,
            label: 'Tax',
            field: 'taxes',
            width: '10'
          },
          {
            display: true,
            label: 'Total',
            field: 'total',
            width: '10'
          }
        ]
      },
      {
        sectionName: 'footer',
        content: [
          {
            display: true,
            label: 'Taxable Amount',
            field: 'taxableAmount',
            width: null
          },
          {
            display: true,
            label: 'Total Tax*',
            field: 'totalTax',
            width: null
          },
          {
            display: true,
            label: 'Other Deduction',
            field: 'otherDeduction',
            width: null
          },
          {
            display: true,
            label: 'Invoice Total',
            field: 'total',
            width: null
          },
          {
            display: true,
            label: 'Invoice Total (In words)',
            field: 'totalInWords',
            width: null
          },
          {
            display: true,
            label: 'NOTE 1',
            field: 'message1',
            width: null
          },
          // {
          //   display: true,
          //   label: 'NOTE 2',
          //   field: 'message2',
          //   width: null
          // },
          {
            display: true,
            label: 'Thank You for your business.',
            field: 'thanks',
            width: null
          },
          {
            display: true,
            label: '',
            field: 'companyAddress',
            width: null
          },
          {
            display: true,
            label: '',
            field: 'imageSignature',
            width: null
          },
          {
            display: true,
            label: '',
            field: 'slogan',
            width: null
          }
        ]
      }
    ],
    name: null, // done
  },

};

export function InvoiceTemplateReducer(state = initialState, action: CustomActions): CustomTemplateState {
  switch (action.type) {
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
      }
      return Object.assign({}, state, nextState);
    }
    case INVOICE.TEMPLATE.SET_TEMPLATE_AS_DEFAULT_RESPONSE: {
      let nextState = _.cloneDeep(state);
      let res: BaseResponse<any, string> = action.payload;
      if (res.status === 'success') {
        let uniqName = res.queryString.templateUniqueName;
        let indx = nextState.customCreatedTemplates.findIndex((template) => template.uniqueName === uniqName);
        if (indx > -1) {
          nextState.customCreatedTemplates.forEach((tem) => tem.isDefault = false);
          nextState.customCreatedTemplates[indx].isDefault = true;
        }
        return Object.assign({}, state, nextState);
      }
      return state;
    }
    case INVOICE.TEMPLATE.DELETE_TEMPLATE_RESPONSE: {
      let nextState = _.cloneDeep(state);
      let res: BaseResponse<any, string> = action.payload;
      if (res.status === 'success') {
        let uniqName = res.queryString.templateUniqueName;
        let indx = nextState.customCreatedTemplates.findIndex((template) => template.uniqueName === uniqName);
        if (indx > -1) {
          nextState.customCreatedTemplates.splice(indx, 1);
        }
        return Object.assign({}, state, nextState);
      }
      return state;
    }
    default:
      {
        return state;
      }
  }
}

// import { Action, combineReducers } from '@ngrx/store';
// import { GetInvoiceTemplateDetailsResponse, ISection } from '../../models/api-models/Invoice';
// import { INVOICE } from '../../services/actions/invoice/invoice.const';
// import { Font } from 'ngx-font-picker';
// // import {
// //   IsDivVisible,
// //   IsFieldVisible
// // } from '../../invoice/templates/edit-template/filters-container/content-filters/content.filters.component';
// import { BaseResponse } from '../../models/api-models/BaseResponse';

// export interface InvoiceTemplateState {
//   [uniqueName: string]: GetInvoiceTemplateDetailsResponse;
// }

// export interface InvoiceTemplateMetaState {
//   templateId: string;
//   companyName: string;
//   GSTIN: string;
//   PAN: string;
//   address: string;
//   invoiceDate: string;
//   invoiceNumber: string;
//   shippingDate: string;
//   shippingNo: string;
//   shippingVia: string;
//   trackingNumber: string;
//   trackingDate: string;
//   trackingRecord: string;
//   customerName: string;
//   customerEmail: string;
//   customerMobileNumber: string;
//   dueDate: string;
//   billingState: string;
//   billingAddress: string;
//   billingGstin: string;
//   shippingAddress: string;
//   shippingState: string;
//   shippinGstin: string;
//   customField1: string;
//   customField2: string;
//   customField3: string;
//   formNameInvoice: string;
//   formNameTaxInvoice: string;
//   sNoLabel: string;
//   sNoWidth: number;
//   dateLabel: string;
//   dateWidth: number;
//   itemLabel: string;
//   itemWidth: number;
//   hsnSacLabel: string;
//   hsnSacWidth: number;
//   itemCodeLabel: string;
//   itemCodeWidth: number;
//   descLabel: string;
//   descWidth: number;
//   rateLabel: string;
//   rateWidth: number;
//   discountLabel: string;
//   discountWidth: number;
//   taxableValueLabel: string;
//   taxableValueWidth: number;
//   taxLabel: string;
//   taxWidth: number;
//   totalLabel: string;
//   totalWidth: number;
//   quantityLabel: string;
//   quantityWidth: number;
//   topMargin: number;
//   leftMargin: number;
//   bottomMargin: number;
//   rightMargin: number;
//   font: string;
//   primaryColor: string;
//   secondaryColor: string;
//   taxableAmount: string;
//   totalTax: string;
//   otherDeduction: string;
//   total: string;
//   totalInWords: string;
//   thanks: string;
//   message1: string;
//   message2: string;
//   companyAddress: string;
//   imageSignature: string;
//   slogan: string;
//   setInvoiceFlag: boolean;
//   div: IsDivVisible;
//   setFieldDisplay: IsFieldVisible;
// }

// export interface InvoiceTableState {
//   theTestState: GetInvoiceTemplateDetailsResponse;
//   customCreatedTemplates: GetInvoiceTemplateDetailsResponse[];
//   isLoadingCustomCreatedTemplates: boolean;
// }

// export interface InvoiceTempState {
//   template: InvoiceTemplateState;
//   templateMeta: InvoiceTemplateMetaState;
//   table: InvoiceTableState;
// }

// export const initialTableState: InvoiceTableState = {
//   theTestState: null,
//   customCreatedTemplates: null,
//   isLoadingCustomCreatedTemplates: false,
// };

// export function invoiceTableReducer(state = initialTableState, action: CustomActions): InvoiceTableState {
//   switch (action.type) {

//     case INVOICE.CONTENT.SET_COLUMN_WIDTH:
//       let newState = _.cloneDeep(state);
//       newState.theTestState = action.payload;
//       return Object.assign({}, state, newState);
//     //   case INVOICE.CONTENT.SET_HEADING:
//     //   return Object.assign({}, state, {
//     //   heading: action.payload.data.heading
//     // });
//     // case INVOICE.CONTENT.SET_HEADING:
//     //   return Object.assign({}, state, {
//     //     heading: action.payload.data
//     //   });
//     case INVOICE.TEMPLATE.GET_ALL_CREATED_TEMPLATES: {
//       let nextState = _.cloneDeep(state);
//       nextState.isLoadingCustomCreatedTemplates = true;
//       return Object.assign({}, state, nextState);
//     }
//     case INVOICE.TEMPLATE.GET_ALL_CREATED_TEMPLATES_RESPONSE: {
//       let nextState = _.cloneDeep(state);
//       let res: BaseResponse<GetInvoiceTemplateDetailsResponse[], string> = action.payload;
//       nextState.isLoadingCustomCreatedTemplates = false;
//       if (res && res.status === 'success') {
//         nextState.customCreatedTemplates = _.sortBy(res.body, [(o) => !o.isDefault]);
//         // nextState.customCreatedTemplates = _.cloneDeep(res.body);
//       }
//       return Object.assign({}, state, nextState);
//     }
//     case INVOICE.TEMPLATE.SET_TEMPLATE_AS_DEFAULT_RESPONSE: {
//       let nextState = _.cloneDeep(state);
//       let res: BaseResponse<any, string> = action.payload;
//       if (res.status === 'success') {
//         let uniqName = res.queryString.templateUniqueName;
//         let indx = nextState.customCreatedTemplates.findIndex((template) => template.uniqueName === uniqName);
//         if (indx > -1) {
//           nextState.customCreatedTemplates.forEach((tem) => tem.isDefault = false);
//           nextState.customCreatedTemplates[indx].isDefault = true;
//         }
//         return Object.assign({}, state, nextState);
//       }
//       return state;
//     }
//     case INVOICE.TEMPLATE.DELETE_TEMPLATE_RESPONSE: {
//       let nextState = _.cloneDeep(state);
//       let res: BaseResponse<any, string> = action.payload;
//       if (res.status === 'success') {
//         let uniqName = res.queryString.templateUniqueName;
//         let indx = nextState.customCreatedTemplates.findIndex((template) => template.uniqueName === uniqName);
//         if (indx > -1) {
//           nextState.customCreatedTemplates.splice(indx, 1);
//         }
//         return Object.assign({}, state, nextState);
//       }
//       return state;
//     }
//     default: {
//       return state;
//     }
//   }
// }

// export const initialState: InvoiceTemplateState = {
// };

// export function invoiceTemplateReducer(state = initialState, action: CustomActions): InvoiceTemplateState {
//   switch (action.type) {

//     case INVOICE.TEMPLATE.SET_TEMPLATE_STATE:
//       // console.log('SET TEMPLATE STATE');
//       let result = action.payload.temp.body;
//       let newState = []; // Array
//       // console.log(result);
//       if (result) {
//         result.forEach((obj) => {
//           let key = obj.uniqueName;
//           let obj1 = {};
//           obj1[obj.uniqueName] = obj;
//           newState.push(obj1);
//         });
//       }
//       return Object.assign({}, state, newState);

//     //   case INVOICE.CONTENT.SET_HEADING:
//     //   return Object.assign({}, state, {
//     //   heading: action.payload.data.heading
//     // });
//     // case INVOICE.CONTENT.SET_HEADING:
//     //   return Object.assign({}, state, {
//     //     heading: action.payload.data
//     //   });
//     default: {
//       return state;
//     }
//   }
// }
// export const initialStateTempMeta: InvoiceTemplateMetaState = {
//   templateId: 'common_template_a',
//   companyName: 'Walkover Web Solution',
//   GSTIN: 'GSTIN',
//   PAN: 'PAN',
//   address: 'Walkover Web Solutions Private Limited, 405-406, Capt. C. S. Naydu Arcade, 10/2, Old Palasia, near Greater Kailash Hospital, Indore 452001(M. P.)',
//   invoiceDate: 'Invoice Date',
//   invoiceNumber: 'Invoice No.',
//   shippingDate: 'Ship Date',
//   shippingNo: 'Shipping No.',
//   shippingVia: 'Ship Via',
//   trackingNumber: 'Tracking No.',
//   trackingDate: 'Tracking Date',
//   trackingRecord: 'Tracking Record',
//   customerName: 'Mr. Alok Gangrade',
//   customerEmail: 'alokgangrade@gmail.com',
//   customerMobileNumber: '+91 9876543210',
//   dueDate: 'Due Date',
//   billingState: '',
//   billingAddress: 'Billing Address',
//   billingGstin: 'GSTIN',
//   shippingAddress: 'Shipping Address',
//   shippingState: '',
//   shippinGstin: 'GSTIN',
//   customField1: 'Field 1',
//   customField2: 'Field 2',
//   customField3: 'Field 3',
//   formNameInvoice: 'INVOICE',
//   formNameTaxInvoice: 'INVOICE',
//   sNoLabel: 'S no.',
//   sNoWidth: 10,
//   dateLabel: 'Date',
//   dateWidth: 10,
//   itemLabel: 'Item',
//   itemWidth: 10,
//   hsnSacLabel: 'HSN/ SAC',
//   hsnSacWidth: 10,
//   itemCodeLabel: 'Item Code',
//   itemCodeWidth: 10,
//   descLabel: 'Desc.',
//   descWidth: 10,
//   rateLabel: 'Rate',
//   rateWidth: 10,
//   discountLabel: 'Disc.',
//   discountWidth: 10,
//   taxableValueLabel: 'Taxable Value',
//   taxableValueWidth: 10,
//   taxLabel: 'Tax',
//   taxWidth: 10,
//   totalLabel: 'Total',
//   totalWidth: 10,
//   quantityLabel: 'Qty.',
//   quantityWidth: 10,
//   topMargin: 10,
//   leftMargin: 10,
//   bottomMargin: 10,
//   rightMargin: 10,
//   font: 'Roboto',
//   primaryColor: '#df4927',
//   secondaryColor: '#fdf6f4',
//   taxableAmount: 'Taxable Amount',
//   totalTax: 'Total Tax*',
//   otherDeduction: 'Other Deduction',
//   total: 'Invoice Total',
//   totalInWords: 'Invoice Total (In words)',
//   message1: 'NOTE 1',
//   message2: 'NOTE 2',
//   thanks: 'Thank You for your business.',
//   companyAddress: 'Walkover Web Solutions Private Limited, 405-406, Capt. C. S. Naydu Arcade, 10/2, Old Palasia, near Greater Kailash Hospital, Indore 452001(M. P.)',
//   imageSignature: '',
//   slogan: 'Signature',
//   setInvoiceFlag: false,
//   div: null,
//   setFieldDisplay: null,
// };

// export function invoiceTemplateMetaReducer(state = initialStateTempMeta, action: CustomActions): InvoiceTemplateMetaState {
//   switch (action.type) {
//     case INVOICE.TEMPLATE.SELECT_TEMPLATE:
//       // console.log(action.payload.id);
//       return Object.assign({}, state, {
//         templateId: action.payload.id
//       });

//     case INVOICE.TEMPLATE.UPDATE_GSTIN:
//       return Object.assign({}, state, {
//         GSTIN: action.payload.data
//       });

//     case INVOICE.TEMPLATE.UPDATE_PAN:
//       return Object.assign({}, state, {
//         PAN: action.payload.data
//       });

//     case INVOICE.TEMPLATE.UPDATE_INVOICE_DATE:
//       return Object.assign({}, state, {
//         invoiceDate: action.payload.data
//       });

//     case INVOICE.TEMPLATE.UPDATE_INVOICE_NO:
//       return Object.assign({}, state, {
//         invoiceNumber: action.payload.data
//       });

//     case INVOICE.TEMPLATE.UPDATE_DUE_DATE:
//       return Object.assign({}, state, {
//         dueDate: action.payload.data
//       });

//     case INVOICE.TEMPLATE.UPDATE_SHIPPING_DATE:
//       return Object.assign({}, state, {
//         shippingDate: action.payload.data
//       });

//     case INVOICE.TEMPLATE.UPDATE_SHIPPING_VIA:
//       return Object.assign({}, state, {
//         shippingVia: action.payload.data
//       });

//     case INVOICE.TEMPLATE.UPDATE_TRACKING_NO:
//       return Object.assign({}, state, {
//         trackingNumber: action.payload.data
//       });

//     case INVOICE.TEMPLATE.UPDATE_TOP_MARGIN:
//       return Object.assign({}, state, {
//         topMargin: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_LEFT_MARGIN:
//       return Object.assign({}, state, {
//         leftMargin: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_BOTTOM_MARGIN:
//       return Object.assign({}, state, {
//         bottomMargin: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_RIGHT_MARGIN:
//       return Object.assign({}, state, {
//         rightMargin: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_CUSTOM_FIELD_1:
//       return Object.assign({}, state, {
//         customField1: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_CUSTOM_FIELD_2:
//       return Object.assign({}, state, {
//         customField2: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_CUSTOM_FIELD_3:
//       return Object.assign({}, state, {
//         customField3: action.payload.data
//       });

//     case INVOICE.TEMPLATE.UPDATE_SNOLABEL:
//       return Object.assign({}, state, {
//         sNoLabel: action.payload.data
//       });

//     case INVOICE.TEMPLATE.UPDATE_ITEM_LABEL:
//       return Object.assign({}, state, {
//         itemLabel: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_DATE_LABEL:
//       return Object.assign({}, state, {
//         dateLabel: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_HSNSAC_LABEL:
//       return Object.assign({}, state, {
//         hsnSacLabel: action.payload.data
//       });

//     case INVOICE.TEMPLATE.UPDATE_QUANTITY_LABEL:
//       return Object.assign({}, state, {
//         quantityLabel: action.payload.data
//       });
//     case INVOICE.TEMPLATE.SET_VISIBLE:
//       // console.log('DIV VISIBLE REDUCER CALLED');
//       return Object.assign({}, state, {
//         div: {
//           header: action.payload.divVis.header,
//           grid: action.payload.divVis.grid,
//           footer: action.payload.divVis.footer
//         },
//       });
//     case INVOICE.TEMPLATE.UPDATE_DISCOUNT_LABEL:
//       return Object.assign({}, state, {
//         discountLabel: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_TAXABLE_VALUE_LABEL:
//       return Object.assign({}, state, {
//         taxableValueLabel: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_TAX_LABEL:
//       return Object.assign({}, state, {
//         taxLabel: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_TOTAL_LABEL:
//       return Object.assign({}, state, {
//         totalLabel: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_SHIPPING_ADDRESS:
//       return Object.assign({}, state, {
//         shippingAddress: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_SHIPPING_GSTIN:
//       return Object.assign({}, state, {
//         shippinGstin: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_BILLING_ADDRESS:
//       return Object.assign({}, state, {
//         shippingAddress: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_BILLING_GSTIN:
//       return Object.assign({}, state, {
//         billingGstin: action.payload.data
//       });
//     case INVOICE.TEMPLATE.SET_FONT:
//       return Object.assign({}, state, {
//         font: action.payload.font
//       });
//     case INVOICE.TEMPLATE.SET_COLOR:
//       return Object.assign({}, state, {
//         primaryColor: action.payload.primaryColor,
//         secondaryColor: action.payload.secondaryColor
//       });
//     case INVOICE.TEMPLATE.UPDATE_MESSAGE1:
//       return Object.assign({}, state, {
//         message1: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_MESSAGE2:
//       return Object.assign({}, state, {
//         message2: action.payload.data
//       });
//     case INVOICE.TEMPLATE.UPDATE_FORM_NAME_INVOICE:
//       return Object.assign({}, state, {
//         formNameInvoice: action.payload.ti.data,
//         setInvoiceFlag: action.payload.ti.setTaxInvoiceActive
//       });
//     case INVOICE.TEMPLATE.UPDATE_FORM_NAME_TAX_INVOICE:
//       return Object.assign({}, state, {
//         formNameTaxInvoice: action.payload.ti.data,
//         setInvoiceFlag: action.payload.ti.setTaxInvoiceActive
//       });
//     default: {
//       return state;
//     }
//   }
// }

// export const invReducers = {
//   template: invoiceTemplateReducer,
//   templateMeta: invoiceTemplateMetaReducer,
//   table: invoiceTableReducer
// };

// export const InvoiceTemplateReducer = combineReducers(invReducers);
