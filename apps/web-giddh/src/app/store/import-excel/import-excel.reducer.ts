import { CustomActions } from '../customActions';
import { IMPORT_EXCEL } from '../../actions/import-excel/import-excel.const';
import { ImportExcelProcessResponseData, ImportExcelResponseData, ImportExcelStatusPaginatedResponse } from '../../models/api-models/import-excel';
import { COMMON_ACTIONS } from '../../actions/common.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';

export enum ImportExcelRequestStates {
    Default,
    UploadFileInProgress,
    UploadFileError,
    UploadFileSuccess,
    ProcessImportInProgress,
    ProcessImportSuccess,
    ProcessImportError,
    ImportStatusInProcess,
    ImportStatusSuccess,
    ImportStatusError
}

export interface ImportExcelState {
    requestState: ImportExcelRequestStates;
    importExcelData?: ImportExcelResponseData;
    importRequestIsSuccess: boolean;
    importResponse?: ImportExcelProcessResponseData;
    importStatus: ImportExcelStatusPaginatedResponse;

}

const importStatusRequest: ImportExcelStatusPaginatedResponse = new ImportExcelStatusPaginatedResponse();
importStatusRequest.totalItems = 0;

export const initialState: ImportExcelState = {
    requestState: ImportExcelRequestStates.Default,
    importRequestIsSuccess: false,
    importResponse: new ImportExcelProcessResponseData(),
    importStatus: importStatusRequest
};

export function importExcelReducer(state = initialState, action: CustomActions): ImportExcelState {
    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
        case IMPORT_EXCEL.UPLOAD_FILE_REQUEST: {
            return { ...state, importRequestIsSuccess: false, requestState: ImportExcelRequestStates.UploadFileInProgress };
        }
        case IMPORT_EXCEL.UPLOAD_FILE_RESPONSE: {
            let response: BaseResponse<ImportExcelResponseData, string> = action.payload;
            let newState = _.cloneDeep(state);
            if (response.status === 'success') {
                newState.importRequestIsSuccess = true;
                newState.requestState = ImportExcelRequestStates.UploadFileSuccess;
                newState.importExcelData = { ...response.body, isHeaderProvided: true };
                return Object.assign({}, state, newState);
            }
            return {
                ...state,
                importRequestIsSuccess: false,
                requestState: ImportExcelRequestStates.UploadFileError,
                importExcelData: null
            };
        }
        case IMPORT_EXCEL.PROCESS_IMPORT_REQUEST: {
            return { ...state, requestState: ImportExcelRequestStates.ProcessImportInProgress };
        }
        case IMPORT_EXCEL.PROCESS_IMPORT_RESPONSE: {
            let response: BaseResponse<ImportExcelProcessResponseData, string> = action.payload;
            if (response) {
                return { ...state, importResponse: action.payload, requestState: ImportExcelRequestStates.ProcessImportSuccess };
            } else {
                return { ...state, requestState: ImportExcelRequestStates.ProcessImportError };
            }
        }
        case IMPORT_EXCEL.IMPORT_STATUS_REQUEST: {
            return { ...state, requestState: ImportExcelRequestStates.ImportStatusInProcess };
        }
        case IMPORT_EXCEL.IMPORT_STATUS_RESPONSE: {
            let response: BaseResponse<ImportExcelStatusPaginatedResponse, string> = action.payload;
            if (response.status === 'success') {
                return { ...state, importStatus: response.body, requestState: ImportExcelRequestStates.ImportStatusSuccess };
            } else {
                return { ...state, requestState: ImportExcelRequestStates.ImportStatusError };
            }
        }
        case IMPORT_EXCEL.RESET_IMPORT_EXCEL_STATE:
            return initialState;
        default: {
            return state;
        }
    }
}
