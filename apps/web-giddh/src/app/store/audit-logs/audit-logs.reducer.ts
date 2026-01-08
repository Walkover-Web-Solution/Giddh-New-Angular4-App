import { LogsRequest, LogsResponse, AuditLogsResponse, GetAuditLogsRequest } from '../../models/api-models/Logs';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ILogsItem } from '../../models/interfaces/logs.interface';
import { AUDIT_LOGS_ACTIONS, AUDIT_LOGS_ACTIONS_V2 } from '../../actions/audit-logs/audit-logs.const';
import { CustomActions } from '../custom-actions';
import { COMMON_ACTIONS } from '../../actions/common.const';

export interface AuditLogsState {
    logs: ILogsItem[];
    totalPages: number;
    size: number;
    totalElements: number;
    getLogInProcess: boolean;
    LoadMoreInProcess: boolean;
    currentLogsRequest?: LogsRequest;
    currentPage?: number;
    auditLogsRequest?: GetAuditLogsRequest;
    auditLogs: any
}

export const initialState: AuditLogsState = {
    logs: [],
    totalElements: 0,
    totalPages: 0,
    size: 20,
    getLogInProcess: false,
    LoadMoreInProcess: false,
    currentLogsRequest: null,
    currentPage: 0,
    auditLogsRequest: null,
    auditLogs: [],
};

export function auditLogsReducer(state = initialState, action: CustomActions): AuditLogsState {
    let data: BaseResponse<LogsResponse, LogsRequest> = null;
    let auditLogsData: BaseResponse<AuditLogsResponse, GetAuditLogsRequest> = null;
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
            if (data?.status === 'success') {
                newState = _.cloneDeep(state);
                newState.currentPage = 1;
                newState.currentLogsRequest = data.request;
                newState.getLogInProcess = false;
                newState.logs = data.body?.logs;
                newState.size = data.body?.size;
                newState.totalElements = data.body?.totalElements;
                newState.totalPages = data.body?.totalPages;
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
            if (data?.status === 'success') {
                newState = _.cloneDeep(state);
                newState.currentPage = data.queryString.page;
                newState.getLogInProcess = false;
                newState.LoadMoreInProcess = false;
                newState.currentLogsRequest = data.request;
                newState.logs.push(...data.body?.logs);
                newState.size = data.body?.size;
                newState.totalElements = data.body?.totalElements;
                newState.totalPages = data.body?.totalPages;
                return newState;
            }
            return Object.assign({}, state, { getLogInProcess: false });
        }
        case AUDIT_LOGS_ACTIONS.AUDIT_LOGS_RESET: {
            return Object.assign({}, state, initialState);
        }

        case AUDIT_LOGS_ACTIONS_V2.GET_LOGS_REQUEST: {
            newState = _.cloneDeep(state);
            newState.getLogInProcess = true;
            return Object.assign({}, state, newState);
        }
        case AUDIT_LOGS_ACTIONS_V2.GET_LOGS_RESPONSE_V2: {
            auditLogsData = action.payload as BaseResponse<AuditLogsResponse, GetAuditLogsRequest>;
            if (auditLogsData?.status === 'success') {
                newState = _.cloneDeep(state);
                newState.currentPage = auditLogsData.body?.page;
                newState.auditLogsRequest = auditLogsData.request;
                newState.auditLogs = auditLogsData.body?.results;
                newState.getLogInProcess = false;
                newState.totalElements = auditLogsData.body?.totalItems;
                newState.totalPages = auditLogsData.body?.totalPages;
                return newState;
            }
            return Object.assign({}, state, { getLogInProcess: false });
        }
        default: {
            return state;
        }
    }
}
