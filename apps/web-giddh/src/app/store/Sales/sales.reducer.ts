import { SALES_ACTIONS } from '../../actions/sales/sales.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AccountResponseV2, FlattenAccountsResponse } from '../../models/api-models/Account';
import { INameUniqueName } from '../../models/api-models/Inventory';
import { IOption } from '../../theme/ng-select/option.interface';
import { CustomActions } from '../customActions';
import { COMMON_ACTIONS } from '../../actions/common.const';

export interface SalesState {
	invObj: any;
	acDtl: AccountResponseV2;
	hierarchicalStockGroups: IOption[];
	purchaseAcList: IOption[];
	salesAcList: IOption[];
	newlyCreatedGroup: INameUniqueName;
	newlyCreatedStockAc: any;
	newlyCreatedServiceAc: any;
	createAccountInProcess: boolean;
	createAccountSuccess: boolean;
	createdAccountDetails: AccountResponseV2;
	updatedAccountDetails: AccountResponseV2;
	updateAccountInProcess: boolean;
	updateAccountSuccess: boolean;
	flattenSalesAc: IOption[];
}

const initialState: SalesState = {
	invObj: null,
	acDtl: null,
	hierarchicalStockGroups: null,
	purchaseAcList: null,
	salesAcList: null,
	newlyCreatedGroup: null,
	newlyCreatedStockAc: null,
	flattenSalesAc: [],
	newlyCreatedServiceAc: null,
	createAccountInProcess: false,
	createAccountSuccess: false,
	createdAccountDetails: null,
	updatedAccountDetails: null,
	updateAccountInProcess: false,
	updateAccountSuccess: false,
};

export function salesReducer(state = initialState, action: CustomActions): SalesState {
	switch (action.type) {
		case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
			return Object.assign({}, state, initialState);
		}
		case SALES_ACTIONS.GET_ACCOUNT_DETAILS_RESPONSE: {
			let res: BaseResponse<AccountResponseV2, string> = action.payload;
			if (res.status === 'success') {
				return Object.assign({}, state, {
					acDtl: action.payload.body
				});
			}
			return state;
		}

		case SALES_ACTIONS.ADD_ACCOUNT_DETAILS: {
			return {
				...state,
				createAccountInProcess: true,
				createAccountSuccess: false,
				createdAccountDetails: null,
				updateAccountSuccess: false
			}
		}

		case SALES_ACTIONS.ADD_ACCOUNT_DETAILS_RESPONSE: {
			let res: BaseResponse<AccountResponseV2, string> = action.payload;
			if (res.status === 'success') {
				return Object.assign({}, state, {
					createAccountInProcess: false,
					createAccountSuccess: true,
					createdAccountDetails: res.body,
				});
			}
			return { ...state, updateAccountInProcess: false, updateAccountSuccess: false, createdAccountDetails: null, createAccountInProcess: false };
		}

		case SALES_ACTIONS.UPDATE_ACCOUNT_DETAILS: {
			return {
				...state,
				updateAccountInProcess: true,
				updateAccountSuccess: false,
				createAccountSuccess: false,
				updatedAccountDetails: null
			}
		}

		case SALES_ACTIONS.UPDATE_ACCOUNT_DETAILS_RESPONSE: {
			let res: BaseResponse<AccountResponseV2, string> = action.payload;
			if (res.status === 'success') {
				return Object.assign({}, state, {
					updatedAccountDetails: action.payload.body,
					updateAccountInProcess: false,
					updateAccountSuccess: true
				});
			}
			return { ...state, updateAccountInProcess: false, updateAccountSuccess: false, updatedAccountDetails: null };
		}

		case SALES_ACTIONS.RESET_ACCOUNT_DETAILS: {
			return Object.assign({}, state, {
				acDtl: null,
				createdAccountDetails: null,
				updatedAccountDetails: null,
				createAccountSuccess: false,
				updateAccountSuccess: false
			});
		}
		case SALES_ACTIONS.GET_HIERARCHICAL_STOCK_GROUPS_RESPONSE: {
			return Object.assign({}, state, {
				hierarchicalStockGroups: action.payload
			});
		}
		case SALES_ACTIONS.GET_PURCHASE_AC_LIST_RESPONSE: {
			let data: BaseResponse<FlattenAccountsResponse, { groupUniqueNames: string[] }> = action.payload;
			let purchaseAcList: IOption[] = [];
			if (data.status === 'success') {
				data.body.results.map(d => {
					purchaseAcList.push({ label: d.name, value: d.uniqueName });
				});
			}
			return Object.assign({}, state, { purchaseAcList });
		}
		case SALES_ACTIONS.GET_SALES_AC_LIST_RESPONSE: {
			let data: BaseResponse<FlattenAccountsResponse, { groupUniqueNames: string[] }> = action.payload;
			let salesAcList: IOption[] = [];
			if (data.status === 'success') {
				data.body.results.map(d => {
					salesAcList.push({ label: d.name, value: d.uniqueName });
				});
			}
			return Object.assign({}, state, { salesAcList });
		}
		case SALES_ACTIONS.STOCK_GROUP_SUCCESS: {
			let data = action.payload;
			return Object.assign({}, state, { newlyCreatedGroup: data });
		}
		case SALES_ACTIONS.STOCK_AC_SUCCESS: {
			let data = action.payload;
			return Object.assign({}, state, { newlyCreatedStockAc: data });
		}
		case SALES_ACTIONS.SERVICE_AC_SUCCESS: {
			let data = action.payload;
			return {
				...state,
				newlyCreatedServiceAc: data
			}
		}
		case SALES_ACTIONS.SALES_FLATTEN_AC_STORED: {
			let data = action.payload;
			return Object.assign({}, state, { flattenSalesAc: data });
		}
		default: {
			return state;
		}
	}
}
