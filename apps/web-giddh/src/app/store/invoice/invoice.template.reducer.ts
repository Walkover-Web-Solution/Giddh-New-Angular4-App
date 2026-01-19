import { BaseResponse } from '../../models/api-models/BaseResponse';
import { CustomTemplateResponse } from '../../models/api-models/Invoice';
import { INVOICE } from '../../actions/invoice/invoice.const';
import { CustomActions } from '../custom-actions';
import { COMMON_ACTIONS } from '../../actions/common.const';
import { UNAUTHORISED } from '../../app.constant';
import { cloneDeep, findIndex, forEach, sortBy } from '../../lodash-optimized';

/**
 * CustomTemplateState interface definition
 * Defines the structure and contract for CustomTemplateState objects
 */
export interface CustomTemplateState {
    sampleTemplates: CustomTemplateResponse[];
    customCreatedTemplates: CustomTemplateResponse[];
    defaultTemplate: CustomTemplateResponse;
    hasInvoiceTemplatePermissions: boolean;
}

export const initialState: CustomTemplateState = {
    sampleTemplates: null,
    customCreatedTemplates: null,
    defaultTemplate: null,
    hasInvoiceTemplatePermissions: true

};

export function InvoiceTemplateReducer(state = initialState, action: CustomActions): CustomTemplateState {
    /**
     * Handles switch functionality
     */
    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
        case INVOICE.TEMPLATE.GET_SAMPLE_TEMPLATES_RESPONSE: {
            let nextState = cloneDeep(state);
            let res: BaseResponse<CustomTemplateResponse[], string> = action.payload;
            /**
             * Handles if functionality
             */
            if (res && res.status === 'success') {
                nextState.sampleTemplates = res.body;
            }
            return Object.assign({}, state, nextState);
        }
        case INVOICE.TEMPLATE.GET_ALL_CREATED_TEMPLATES_RESPONSE: {
            let nextState = cloneDeep(state);
            let res: BaseResponse<CustomTemplateResponse[], string> = action.payload;
            /**
             * Handles if functionality
             */
            if (res && res.status === 'success') {
                nextState.customCreatedTemplates = sortBy(res.body, [(o) => !o.isDefault]);
                nextState.hasInvoiceTemplatePermissions = true;
            } else if(res?.status === 'error' && res.statusCode === UNAUTHORISED) {
                nextState.hasInvoiceTemplatePermissions = false;
            }
            return Object.assign({}, state, nextState);
        }
        case INVOICE.TEMPLATE.SET_TEMPLATE_AS_DEFAULT_RESPONSE: {
            let nextState = cloneDeep(state);
            let res: BaseResponse<any, string> = action.payload;
            /**
             * Handles if functionality
             */
            if (res?.status === 'success') {
                let uniqName = res.queryString?.templateUniqueName;
                let indx = nextState.customCreatedTemplates?.findIndex((template) => template?.uniqueName === uniqName);
                /**
                 * Handles if functionality
                 */
                if (indx > -1) {
                    /**
                     * Handles if functionality
                     */
                    if (res.body?.type === 'voucher') {
                        (Array.isArray(nextState.customCreatedTemplates) ? nextState.customCreatedTemplates : []).forEach((tem) => tem.isDefaultForVoucher = false);
                        nextState.customCreatedTemplates[indx].isDefaultForVoucher = true;
                    } else {
                        (Array.isArray(nextState.customCreatedTemplates) ? nextState.customCreatedTemplates : []).forEach((tem) => tem.isDefault = false);
                        nextState.customCreatedTemplates[indx].isDefault = true;
                    }
                }
                return Object.assign({}, state, nextState);
            }
            return state;
        }
        case INVOICE.TEMPLATE.DELETE_TEMPLATE_RESPONSE: {
            let nextState = cloneDeep(state);
            let res: BaseResponse<any, string> = action.payload;
            /**
             * Handles if functionality
             */
            if (res?.status === 'success') {
                let uniqName = res?.queryString?.templateUniqueName;
                let indx = nextState.customCreatedTemplates?.findIndex((template) => template?.uniqueName === uniqName);
                /**
                 * Handles if functionality
                 */
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
