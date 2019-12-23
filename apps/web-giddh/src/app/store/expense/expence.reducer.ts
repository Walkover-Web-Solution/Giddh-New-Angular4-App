import { CustomActions } from '../customActions';
import { COMMON_ACTIONS } from '../../actions/common.const';
import { PettyCashReportResponse, PettyCashResonse } from '../../models/api-models/Expences';
import { ExpencesAction } from '../../actions/expences/expence.action';
import { BaseResponse } from '../../models/api-models/BaseResponse';

export interface ExpensePettyCash {
    pettycashReport?: PettyCashReportResponse;
    pettycashEntry?: PettyCashResonse;
    pettycashRejectedReport?: PettyCashReportResponse;
    showLoader: boolean;
    getPettycashReportInprocess: boolean;
    getPettycashReportSuccess: boolean;
    ispPettycashEntryInprocess: boolean;
    ispPettycashEntrySuccess: boolean;
    getPettycashRejectedReportInprocess: boolean;
    getPettycashRejectedReportSuccess: boolean;
    noData: boolean;
}

export const initialState: ExpensePettyCash = {
    pettycashReport: null,
    pettycashEntry: null,
    pettycashRejectedReport: null,
    noData: true,
    getPettycashReportInprocess: false,
    getPettycashReportSuccess: false,
    ispPettycashEntrySuccess: false,
    ispPettycashEntryInprocess: false,
    getPettycashRejectedReportInprocess: false,
    getPettycashRejectedReportSuccess: false,
    showLoader: false
};

export function expensesReducer(state = initialState, action: CustomActions): ExpensePettyCash {
    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }

        case ExpencesAction.GET_PETTYCASH_REPORT_REQUEST: {
            return { ...state, getPettycashReportInprocess: true, getPettycashReportSuccess: false };
        }
        case ExpencesAction.GET_PETTYCASH_REPORT_RESPONSE: {
            let res: BaseResponse<any, string> = action.payload;
            if (res.status === 'success') {
                return {
                    ...state, pettycashReport: res.body,
                    getPettycashReportInprocess: false,
                    getPettycashReportSuccess: true,
                };

            } else {
                return {
                    ...state,
                    getPettycashReportInprocess: false,
                    getPettycashReportSuccess: false,
                }
            }

        }
        case ExpencesAction.GET_PETTYCASH_REJECTED_REPORT_REQUEST: {
            return { ...state, getPettycashRejectedReportInprocess: true, getPettycashRejectedReportSuccess: false };
        }
        case ExpencesAction.GET_PETTYCASH_REJECTED_REPORT_RESPONSE: {
            let res: BaseResponse<any, string> = action.payload;
            if (res.status === 'success') {
                return {
                    ...state, pettycashRejectedReport: res.body,
                    getPettycashRejectedReportInprocess: false,
                    getPettycashRejectedReportSuccess: true,
                };
            } else {
                return {
                    ...state,
                    getPettycashRejectedReportInprocess: false,
                    ispPettycashEntrySuccess: false,
                }
            }
        }
        case ExpencesAction.GET_PETTYCASH_ENTRY_REQUEST: {
            return { ...state, ispPettycashEntryInprocess: true, ispPettycashEntrySuccess: false };
        }
        case ExpencesAction.GET_PETTYCASH_ENTRY_RESPONSE: {
            let res: BaseResponse<PettyCashResonse, string> = action.payload;
            if (res.status === 'success') {
                return Object.assign({}, state, {
                    pettycashEntry: res.body,
                    ispPettycashEntryInprocess: false,
                    ispPettycashEntrySuccess: true,
                });

            } else {
                return {
                    ...state,
                    ispPettycashEntryInprocess: false,
                    ispPettycashEntrySuccess: false,
                }
            }

        }

        default: {
            return state;
        }
    }
}
