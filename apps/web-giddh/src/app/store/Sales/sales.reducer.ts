import { SALES_ACTIONS } from '../../actions/sales/sales.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AccountResponseV2 } from '../../models/api-models/Account';
import { CustomActions } from '../customActions';
import { COMMON_ACTIONS } from '../../actions/common.const';

export interface SalesState {
    acDtl: AccountResponseV2;
    newlyCreatedStockAc: any;
    createAccountInProcess: boolean;
    createAccountSuccess: boolean;
    createdAccountDetails: AccountResponseV2;
    updatedAccountDetails: AccountResponseV2;
    updateAccountInProcess: boolean;
    updateAccountSuccess: boolean;
}

const initialState: SalesState = {
    acDtl: null,
    newlyCreatedStockAc: null,
    createAccountInProcess: false,
    createAccountSuccess: false,
    createdAccountDetails: null,
    updatedAccountDetails: null,
    updateAccountInProcess: false,
    updateAccountSuccess: false,
};

export function salesReducer(state = initialState, action: CustomActions): SalesState {
    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
        case SALES_ACTIONS.GET_ACCOUNT_DETAILS_RESPONSE: {
            let res: BaseResponse<AccountResponseV2, string> = action.payload;
            if (res?.status === 'success') {
                return Object.assign({}, state, {
                    acDtl: action.payload.body
                });
            }
            return state;
        }

        case SALES_ACTIONS.ADD_ACCOUNT_DETAILS: {
            return {
                ...state,
                createAccountInProcess: true,
                createAccountSuccess: false,
                createdAccountDetails: null,
                updateAccountSuccess: false
            }
        }

        case SALES_ACTIONS.ADD_ACCOUNT_DETAILS_RESPONSE: {
            let res: BaseResponse<AccountResponseV2, string> = action.payload;
            if (res?.status === 'success') {
                return {
                    ...state,
                    createAccountInProcess: false,
                    createAccountSuccess: true,
                    createdAccountDetails: res.body,
                };
            }
            return { ...state, updateAccountInProcess: false, updateAccountSuccess: false, createdAccountDetails: null, createAccountInProcess: false };
        }

        case SALES_ACTIONS.UPDATE_ACCOUNT_DETAILS: {
            return {
                ...state,
                updateAccountInProcess: true,
                updateAccountSuccess: false,
                createAccountSuccess: false,
                updatedAccountDetails: null
            }
        }

        case SALES_ACTIONS.UPDATE_ACCOUNT_DETAILS_RESPONSE: {
            let res: BaseResponse<AccountResponseV2, string> = action.payload;
            if (res?.status === 'success') {
                return {
                    ...state,
                    updatedAccountDetails: action.payload.body,
                    updateAccountInProcess: false,
                    updateAccountSuccess: true
                };
            }
            return { ...state, updateAccountInProcess: false, updateAccountSuccess: false, updatedAccountDetails: null };
        }

        case SALES_ACTIONS.RESET_ACCOUNT_DETAILS: {
            return Object.assign({}, state, {
                acDtl: null,
                createdAccountDetails: null,
                updatedAccountDetails: null,
                createAccountSuccess: false,
                updateAccountSuccess: false
            });
        }
        case SALES_ACTIONS.STOCK_AC_SUCCESS: {
            let data = action.payload;
            return Object.assign({}, state, { newlyCreatedStockAc: data });
        }
        default: {
            return state;
        }
    }
}
