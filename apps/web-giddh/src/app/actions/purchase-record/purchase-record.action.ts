import { Injectable } from '@angular/core';
import { CustomActions } from '../../store/custom-actions';
import { PURCHASE_RECORD_ACTIONS } from './purchase-record.const';
import { PurchaseRecordUpdateModel } from '../../purchase/purchase-record/constants/purchase-record.interface';

@Injectable()
export class PurchaseRecordActions {

    /**
     * Returns the update purchase record success action
     *
     * @param {PurchaseRecordUpdateModel} model Payload required to show the updated data
     * @returns {CustomActions}
     * @memberof PurchaseRecordActions
     */
    public getUpdatePurchaseRecordSuccessAction(model: PurchaseRecordUpdateModel): CustomActions {
        return { type: PURCHASE_RECORD_ACTIONS.UPDATE_SUCCESS, payload: model };
    }

    /**
     * Returns the action to reset purchase record update data
     *
     * @returns {CustomActions} Action to reset purchase record update data
     * @memberof PurchaseRecordActions
     */
    public resetUpdatePurchaseRecord(): CustomActions {
        return { type: PURCHASE_RECORD_ACTIONS.RESET_UPDATE_DETAILS };
    }
}
