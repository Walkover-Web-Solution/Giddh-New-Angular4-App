import { LogsRequest, LogsResponse } from '../../models/api-models/Logs';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ILogsItem } from '../../models/interfaces/logs.interface';
import * as _ from '../../lodash-optimized';
import { AUDIT_LOGS_ACTIONS } from '../../actions/audit-logs/audit-logs.const';
import { CustomActions } from '../customActions';
import { COMMON_ACTIONS } from '../../actions/common.const';

export interface AuditLogsState {
    logs: ILogsItem[];
    totalPages: number;
    size: number;
    totalElements: number;
    getLogInProcess: boolean;
    LoadMoreInProcess: boolean;
    CurrectLogsRequest?: LogsRequest;
    CurrectPage?: number;
}

export const initialState: AuditLogsState = {
    logs: [],
    totalElements: 0,
    totalPages: 0,
    size: 20,
    getLogInProcess: false,
    LoadMoreInProcess: false,
    CurrectLogsRequest: null,
    CurrectPage: 0
};

export function auditLogsReducer(state = initialState, action: CustomActions): AuditLogsState {
    let data: BaseResponse<LogsResponse, LogsRequest> = null;
    let newState: AuditLogsState = null;
    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
        case AUDIT_LOGS_ACTIONS.GET_LOGS: {
            newState = _.cloneDeep(initialState);
            newState.getLogInProcess = true;
            return newState;
        }
        case AUDIT_LOGS_ACTIONS.GET_LOGS_RESPONSE: {
            data = action.payload as BaseResponse<LogsResponse, LogsRequest>;
            if (data.status === 'success') {
                newState = _.cloneDeep(state);
                newState.CurrectPage = 1;
                newState.CurrectLogsRequest = data.request;
                newState.getLogInProcess = false;
                newState.logs = data.body.logs;
                newState.size = data.body.size;
                newState.totalElements = data.body.totalElements;
                newState.totalPages = data.body.totalPages;
                return newState;
            }
            return Object.assign({}, state, { getLogInProcess: false });
        }
        case AUDIT_LOGS_ACTIONS.LOAD_MORE_LOGS: {
            newState = _.cloneDeep(state);
            newState.LoadMoreInProcess = true;
            return newState;
        }
        case AUDIT_LOGS_ACTIONS.LOAD_MORE_LOGS_RESPONSE: {
            data = action.payload as BaseResponse<LogsResponse, LogsRequest>;
            if (data.status === 'success') {
                newState = _.cloneDeep(state);
                newState.CurrectPage = data.queryString.page;
                newState.getLogInProcess = false;
                newState.LoadMoreInProcess = false;
                newState.CurrectLogsRequest = data.request;
                newState.logs.push(...data.body.logs);
                newState.size = data.body.size;
                newState.totalElements = data.body.totalElements;
                newState.totalPages = data.body.totalPages;
                return newState;
            }
            return Object.assign({}, state, { getLogInProcess: false });
        }
        case AUDIT_LOGS_ACTIONS.AUDIT_LOGS_RESET: {
            return Object.assign({}, state, initialState);
        }
        default: {
            return state;
        }
    }
}
