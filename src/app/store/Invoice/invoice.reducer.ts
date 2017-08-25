import { Action } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import * as _ from 'lodash';
import { INVOICE_ACTIONS, INVOICE } from '../../services/actions/invoice/invoice.const';
import { CommonPaginatedRequest, GetAllLedgersOfInvoicesResponse, GetAllInvoicesPaginatedResponse, PreviewInvoiceResponseClass, PreviewInvoiceRequest, GenerateInvoiceRequestClass, GenerateBulkInvoiceRequest, InvoiceTemplateDetailsResponse, ILedgersInvoiceResult } from '../../models/api-models/Invoice';
import { InvoiceSetting } from '../../models/interfaces/invoice.setting.interface';

export class GeneratePage {
  public ledgers: GetAllLedgersOfInvoicesResponse;
  public invoiceData: PreviewInvoiceResponseClass;
  public invoiceTemplateConditions: InvoiceTemplateDetailsResponse;
  public isInvoiceGenerated: boolean;
}

export class PreviewPage {
  public invoices: GetAllInvoicesPaginatedResponse;
}

export interface InvoiceState {
  preview: PreviewPage;
  generate: GeneratePage;
  settings: InvoiceSetting;
}

export const initialState: InvoiceState = {
  preview: {invoices: null},
  generate: {ledgers: null, invoiceData: null, invoiceTemplateConditions: null, isInvoiceGenerated: false},
  settings: null
};

export function InvoiceReducer(state = initialState, action: Action): InvoiceState {
    switch (action.type) {
        case INVOICE_ACTIONS.GET_ALL_INVOICES_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<GetAllInvoicesPaginatedResponse, CommonPaginatedRequest> = action.payload;
            if (res.status === 'success') {
                newState.preview.invoices = res.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<GetAllLedgersOfInvoicesResponse, CommonPaginatedRequest> = action.payload;
            if (res.status === 'success') {
                let body = _.cloneDeep(res.body);
                if (body.results.length > 0) {
                    body.results.map((item: ILedgersInvoiceResult) => {
                        item.isSelected = (item.isSelected) ? true : false;
                    });
                }
                newState.generate.ledgers = body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE_ACTIONS.MODIFIED_INVOICE_STATE_DATA: {
            let newState = _.cloneDeep(state);
            let uniq: string[] = action.payload;
            _.forEach(uniq, (value) => {
                if (newState.generate.ledgers.results.length > 0) {
                    newState.generate.ledgers.results.map((item: ILedgersInvoiceResult) => {
                        if (item.uniqueName === value) {
                            item.isSelected = true;
                        }else {
                            item.isSelected = false;
                        }
                    });
                }
            });
            return Object.assign({}, state, newState);
        }
        case INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<PreviewInvoiceResponseClass, PreviewInvoiceRequest> = action.payload;
            if (res.status === 'success') {
                newState.generate.invoiceData = res.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE_ACTIONS.GENERATE_INVOICE_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<GenerateInvoiceRequestClass, string> = action.payload;
            if (res.status === 'success') {
                newState.generate.isInvoiceGenerated = true;
                newState.generate.ledgers.results = _.remove(newState.generate.ledgers.results, (item: ILedgersInvoiceResult) => {
                    return !item.isSelected;
                });
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE_ACTIONS.GENERATE_BULK_INVOICE_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<string, GenerateBulkInvoiceRequest> = action.payload;
            let reqObj: GenerateBulkInvoiceRequest[] = action.payload.request;
            if (res.status === 'success' && reqObj.length > 0) {
                _.forEach(reqObj, (item: GenerateBulkInvoiceRequest) => {
                    _.forEach(item.entries, (uniqueName: string) => {
                        newState.generate.ledgers.results = _.remove(newState.generate.ledgers.results, (o: ILedgersInvoiceResult) => {
                            return o.uniqueName !== uniqueName;
                        });
                    });
                });
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE_ACTIONS.INVOICE_GENERATION_COMPLETED: {
            let newState = _.cloneDeep(state);
            newState.generate.isInvoiceGenerated = false;
            return Object.assign({}, state, newState);
        }
        case INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<InvoiceTemplateDetailsResponse, string> = action.payload;
            if (res.status === 'success') {
                newState.generate.invoiceTemplateConditions = res.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE_ACTIONS.DELETE_INVOICE_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<string, string> = action.payload;
            if (res.status === 'success') {
                let indx = newState.preview.invoices.results.findIndex((o) => o.invoiceNumber === res.request);
                if (indx > -1) {
                    newState.preview.invoices.results.splice(indx, 1);
                }
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE.SETTING.GET_INVOICE_SETTING_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<InvoiceSetting, string> = action.payload;
            if (res.status === 'success') {
                newState.settings = res.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        default: {
            return state;
        }
    }
}
