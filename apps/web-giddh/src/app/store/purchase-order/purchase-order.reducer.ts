import { CustomActions } from '../custom-actions';
import { PURCHASE_ORDER_ACTIONS } from '../../actions/purchase-order/purchase-order.const';

export interface PurchaseOrderState {
    listFilters: any;
    selectedPo: [];
    poSearch: any;
}

export const initialState: PurchaseOrderState = {
    listFilters: null,
    selectedPo: null,
    poSearch: null
}

export function purchaseOrderReducer(state: PurchaseOrderState = initialState, action: CustomActions): PurchaseOrderState {
    switch (action.type) {
        case PURCHASE_ORDER_ACTIONS.SET_FILTERS:
            return { ...state, listFilters: { getRequest: action.payload.getRequest, postRequest: action.payload.postRequest }, selectedPo: action.payload.selectedPo };
        case PURCHASE_ORDER_ACTIONS.PO_PREVIEW_SEARCH:
            return { ...state, poSearch: action.payload };
        default: return state;
    }
}
