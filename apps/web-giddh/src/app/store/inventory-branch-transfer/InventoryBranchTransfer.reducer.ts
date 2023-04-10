import { BranchTransferResponse, LinkedStocksResponse } from '../../models/api-models/BranchTransfer';
import { CustomActions } from '../custom-actions';
import { INVENTORY_BRANCH_TRANSFER, INVENTORY_LINKED_STOCKS } from '../../actions/inventory/inventory.const';
import { COMMON_ACTIONS } from '../../actions/common.const';

export interface InventoryBranchTransferState {
    isBranchTransferInProcess: boolean;
    isBranchTransferSuccess: boolean;
    branchTransferResponse: BranchTransferResponse;
    isLinkedStocksInProcess: boolean;
    isLinkedStocksSuccess: boolean;
    linkedStocks: LinkedStocksResponse;
}

const initialState: InventoryBranchTransferState = {
    isBranchTransferInProcess: false,
    isBranchTransferSuccess: false,
    branchTransferResponse: null,
    isLinkedStocksInProcess: false,
    isLinkedStocksSuccess: false,
    linkedStocks: null
};

export function InventoryBranchTransferReducer(state: InventoryBranchTransferState = initialState, action: CustomActions): InventoryBranchTransferState {

    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
        case INVENTORY_BRANCH_TRANSFER.CREATE_TRANSFER: {
            return Object.assign({}, state, {
                isBranchTransferInProcess: true,
                isBranchTransferSuccess: false,
                branchTransferResponse: null
            });
        }
        case INVENTORY_BRANCH_TRANSFER.CREATE_TRANSFER_RESPONSE: {
            return Object.assign({}, state, {
                isBranchTransferInProcess: false,
                isBranchTransferSuccess: !(action.payload === null),
                branchTransferResponse: action.payload
            });
        }

        case INVENTORY_LINKED_STOCKS.GET_LINKED_STOCKS: {
            return Object.assign({}, state, {
                isLinkedStocksInProcess: true,
                isLinkedStocksSuccess: false,
                linkedStocks: null
            });
        }
        case INVENTORY_LINKED_STOCKS.GET_LINKED_STOCKS_RESPONSE: {
            return Object.assign({}, state, {
                isLinkedStocksInProcess: false,
                isLinkedStocksSuccess: !(action.payload === null),
                linkedStocks: action.payload
            });
        }

        case INVENTORY_BRANCH_TRANSFER.RESET_BRANCH_TRANSFER_STATE: {
            return initialState;
        }
        default:
            return state;
    }
}
