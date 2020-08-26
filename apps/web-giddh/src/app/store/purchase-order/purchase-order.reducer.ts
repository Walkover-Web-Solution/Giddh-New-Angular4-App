import { CustomActions } from '../customActions';
import { PURCHASE_ORDER_ACTIONS } from '../../actions/purchase-order/purchase-order.const';

export interface PurchaseOrderState {
    listFilters: any;
}

export const initialState: PurchaseOrderState = {
    listFilters: null
}

export function purchaseOrderReducer(state: PurchaseOrderState = initialState, action: CustomActions): PurchaseOrderState {
    switch (action.type) {
        case PURCHASE_ORDER_ACTIONS.SET_FILTERS:
            return { ...state, listFilters: action.payload };
        default: return state;
    }
}