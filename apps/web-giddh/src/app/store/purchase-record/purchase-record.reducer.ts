import { PurchaseRecordUpdateModel } from "../../purchase/purchase-record/constants/purchase-record.interface";
import { CustomActions } from '../custom-actions';
import { PURCHASE_RECORD_ACTIONS } from '../../actions/purchase-record/purchase-record.const';

/**
 * Purchase record state
 *
 * @export
 * @interface PurchaseRecordState
 */
export interface PurchaseRecordState {
    updatedRecordDetails: PurchaseRecordUpdateModel | undefined;
}

/** Initial state of purchase record */
export const initialState: PurchaseRecordState = {
    updatedRecordDetails: undefined
}

/**
 * Purchase record reducer
 *
 * @export
 * @param {PurchaseRecordState} [state=initialState]
 * @param {CustomActions} action
 * @returns {PurchaseRecordState}
 */
export function purchaseRecordReducer(state: PurchaseRecordState = initialState, action: CustomActions): PurchaseRecordState {
    switch (action.type) {
        case PURCHASE_RECORD_ACTIONS.UPDATE_SUCCESS:
            return { ...state, updatedRecordDetails: action.payload };
        case PURCHASE_RECORD_ACTIONS.RESET_UPDATE_DETAILS:
            return { ...state, updatedRecordDetails: undefined };
        default: return state;
    }
}
