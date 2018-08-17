import { CustomActions } from '../customActions';
import { IMPORT_EXCEL } from '../../actions/import-excel/import-excel.const';
import { ImportExcelResponseData } from '../../models/api-models/import-excel';
import { COMMON_ACTIONS } from '../../actions/common.const';

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
}

export const initialState: ImportExcelState = {
  requestState: ImportExcelRequestStates.Default
};

export function importExcelReducer(state = initialState, action: CustomActions): ImportExcelState {
  switch (action.type) {
    case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
      return Object.assign({}, state, initialState);
    }
    case IMPORT_EXCEL.UPLOAD_FILE_REQUEST: {
      return {...state, requestState: ImportExcelRequestStates.UploadFileInProgress};
    }
    case IMPORT_EXCEL.UPLOAD_FILE_RESPONSE: {
      console.log(action);
      return {
        ...state,
        requestState: action.payload ? ImportExcelRequestStates.UploadFileSuccess : ImportExcelRequestStates.UploadFileError,
        importExcelData: action.payload
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
