import { Injectable } from '@angular/core';
import { PURCHASE_ORDER_ACTIONS } from './purchase-order.const';
import { CustomActions } from '../../store/customActions';

@Injectable()
export class PurchaseOrderActions {

    /**
     * This will set the filters of purchase order in store
     *
     * @param {*} model
     * @returns {CustomActions}
     * @memberof PurchaseOrderActions
     */
    public setPurchaseOrderFilters(model: any): CustomActions {
        return { type: PURCHASE_ORDER_ACTIONS.SET_FILTERS, payload: model };
    }
}
