import { CustomActions } from '../customActions';
import { IMPORT_EXCEL } from '../../actions/import-excel/import-excel.const';
import { ImportExcelResponseData } from '../../models/api-models/import-excel';
import { COMMON_ACTIONS } from '../../actions/common.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';

export enum ImportExcelRequestStates {
  Default,
  UploadFileInProgress,
  UploadFileError,
  UploadFileSuccess,
  ProcessImportInProgress,
  ProcessImportSuccess
}

export interface ImportExcelState {
  requestState: ImportExcelRequestStates;
  importExcelData?: ImportExcelResponseData;
  importRequestIsSuccess: boolean;
}

export const initialState: ImportExcelState = {
  requestState: ImportExcelRequestStates.Default,
  importRequestIsSuccess: false
};

export function importExcelReducer(state = initialState, action: CustomActions): ImportExcelState {
  switch (action.type) {
    case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
      return Object.assign({}, state, initialState);
    }
    case IMPORT_EXCEL.UPLOAD_FILE_REQUEST: {
      return {...state, importRequestIsSuccess: false, requestState: ImportExcelRequestStates.UploadFileInProgress};
    }
    case IMPORT_EXCEL.UPLOAD_FILE_RESPONSE: {
      console.log(action);
      let response: BaseResponse<ImportExcelResponseData, string> = action.payload;
      // if (response.status === 'success') {
      //   return Object.assign({}, state, {
      //     importRequestIsSuccess: true,
      //     requestState: ImportExcelRequestStates.UploadFileSuccess,
      //     importExcelData: response,
      //   });
      // }
      // return Object.assign({}, state, {
      //   importRequestIsSuccess: false,
      //   requestState: ImportExcelRequestStates.UploadFileError
      // });

      let newState = _.cloneDeep(state);
      if (response.status === 'success') {
        newState.importRequestIsSuccess = true;
        newState.requestState = ImportExcelRequestStates.UploadFileSuccess;
        newState.importExcelData = response;
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
      return {...state, requestState: ImportExcelRequestStates.ProcessImportInProgress};
    }
    case IMPORT_EXCEL.PROCESS_IMPORT_RESPONSE: {
      return {...state, requestState: ImportExcelRequestStates.ProcessImportSuccess};
    }
    default: {
      return state;
    }
  }
}
