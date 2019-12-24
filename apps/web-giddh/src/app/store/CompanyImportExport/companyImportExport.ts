import { CustomActions } from '../customActions';
import { COMPANY_IMPORT_EXPORT_ACTIONS } from '../../actions/company-import-export/company-import-export.const';

export interface CompanyImportExportState {
    exportRequestInProcess: boolean;
    exportRequestSuccess: boolean;
    importRequestInProcess: boolean;
    importRequestSuccess: boolean;
}

const initialState: CompanyImportExportState = {
    exportRequestInProcess: false,
    exportRequestSuccess: false,
    importRequestInProcess: false,
    importRequestSuccess: false
};

export function companyImportExportReducer(state: CompanyImportExportState = initialState, action: CustomActions): CompanyImportExportState {

    switch (action.type) {
        case COMPANY_IMPORT_EXPORT_ACTIONS.EXPORT_REQUEST:
            return {
                ...state,
                exportRequestInProcess: true,
                exportRequestSuccess: false
            };

        case COMPANY_IMPORT_EXPORT_ACTIONS.EXPORT_RESPONSE:
            return {
                ...state,
                exportRequestInProcess: false,
                exportRequestSuccess: action.payload.status === 'success'
            };

        case COMPANY_IMPORT_EXPORT_ACTIONS.IMPORT_REQUEST:
            return {
                ...state,
                importRequestInProcess: true,
                importRequestSuccess: false
            };

        case COMPANY_IMPORT_EXPORT_ACTIONS.IMPORT_RESPONSE:
            return {
                ...state,
                importRequestInProcess: false,
                importRequestSuccess: action.payload.status === 'success'
            };

        case COMPANY_IMPORT_EXPORT_ACTIONS.COMPANY_IMPORT_EXPORT_RESET:
            return initialState;

        default:
            return state;
    }
}
