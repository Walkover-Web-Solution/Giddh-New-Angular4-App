import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { SalesService } from '../../services/sales.service';
import { SALES_ACTIONS } from './sales.const';
import { Router } from '@angular/router';
import { AccountRequestV2, AccountResponseV2, AddAccountRequest, FlattenAccountsResponse, UpdateAccountRequest } from '../../models/api-models/Account';
import { AccountService } from '../../services/account.service';
import { GroupService } from '../../services/group.service';
import { GroupsWithStocksHierarchyMin } from '../../models/api-models/GroupsWithStocks';
import { InventoryService } from '../../services/inventory.service';
import { INameUniqueName } from '../../models/api-models/Inventory';
import { IOption } from '../../theme/ng-select/option.interface';
import { CustomActions } from '../../store/customActions';

/**
 * Created by ad on 04-07-2017.
 */

@Injectable()
export class SalesActions {

    @Effect()
    public GetAccountDetails$: Observable<Action> = this.action$
        .ofType(SALES_ACTIONS.GET_ACCOUNT_DETAILS).pipe(
            switchMap((action: CustomActions) => this._accountService.GetAccountDetailsV2(action.payload)),
            map(response => {
                return this.getAccountDetailsForSalesResponse(response);
            }));

    @Effect()
    public GetAccountDetailsResponse$: Observable<Action> = this.action$
        .ofType(SALES_ACTIONS.GET_ACCOUNT_DETAILS_RESPONSE).pipe(
            map((action: CustomActions) => {
                let data: BaseResponse<AccountResponseV2, string> = action.payload;
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public GetGroupsListForSales$: Observable<Action> = this.action$
        .ofType(SALES_ACTIONS.GET_HIERARCHICAL_STOCK_GROUPS).pipe(
            switchMap((action: CustomActions) => this._inventoryService.GetGroupsWithStocksFlatten()),
            map(response => this.getGroupsListForSalesResponse(response)));

    @Effect()
    public GetGroupsListForSalesResponse$: Observable<Action> = this.action$
        .ofType(SALES_ACTIONS.GET_HIERARCHICAL_STOCK_GROUPS_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            }));

    // get purhase Ac list
    @Effect()
    public getFlattenAcOfPurchase$: Observable<Action> = this.action$
        .ofType(SALES_ACTIONS.GET_PURCHASE_AC_LIST).pipe(
            switchMap((action: CustomActions) => this._accountService.GetFlatternAccountsOfGroup(action.payload)),
            map(res => this.validateResponse<FlattenAccountsResponse, { groupUniqueNames: string[] }>(res, {
                type: SALES_ACTIONS.GET_PURCHASE_AC_LIST_RESPONSE,
                payload: res
            }, true, {
                type: SALES_ACTIONS.GET_PURCHASE_AC_LIST_RESPONSE,
                payload: res
            })));

    // get sales Ac list
    @Effect()
    public getFlattenAcOfSales$: Observable<Action> = this.action$
        .ofType(SALES_ACTIONS.GET_SALES_AC_LIST).pipe(
            switchMap((action: CustomActions) => this._accountService.GetFlatternAccountsOfGroup(action.payload)),
            map(res => this.validateResponse<FlattenAccountsResponse, { groupUniqueNames: string[] }>(res, {
                type: SALES_ACTIONS.GET_SALES_AC_LIST_RESPONSE,
                payload: res
            }, true, {
                type: SALES_ACTIONS.GET_SALES_AC_LIST_RESPONSE,
                payload: res
            })));

    @Effect()
    public CreateAccountDetails$: Observable<Action> = this.action$
        .ofType(SALES_ACTIONS.ADD_ACCOUNT_DETAILS).pipe(
            switchMap((action: CustomActions) => this._accountService.CreateAccountV2(action.payload.accountRequest, action.payload.activeGroupUniqueName)),
            map(response => {
                return this.addAccountDetailsForSalesResponse(response);
            }));

    @Effect()
    public CreateAccountResponseDetails$: Observable<Action> = this.action$
        .ofType(SALES_ACTIONS.ADD_ACCOUNT_DETAILS_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return {
                        type: 'EmptyAction'
                    };
                } else {
                    this._toasty.successToast('Account Created Successfully');
                    // if (action.payload.body.errorMessageForCashFreeVirtualAccount) {
                    //     this._toasty.warningToast('Virtual account could not be created for Account "' + action.payload.body.name + '", ' + action.payload.body.errorMessageForCashFreeVirtualAccount);
                    // }
                    // if (action.payload.body.errorMessageForBankDetails) {
                    //   this._toasty.warningToast(action.payload.body.errorMessageForBankDetails);
                    // }
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public UpdateAccountDetails$: Observable<Action> = this.action$
        .ofType(SALES_ACTIONS.UPDATE_ACCOUNT_DETAILS).pipe(
            switchMap((action: CustomActions) => this._accountService.UpdateAccountV2(action.payload.accountRequest, action.payload.value)),
            map(response => {
                return this.updateAccountDetailsForSalesResponse(response);
            }));

    @Effect()
    public UpdateAccountDetailsResponse$: Observable<Action> = this.action$
        .ofType(SALES_ACTIONS.UPDATE_ACCOUNT_DETAILS_RESPONSE).pipe(
            map((action: CustomActions) => {
                let resData: BaseResponse<AccountResponseV2, AccountRequestV2> = action.payload;
                if (action.payload.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this._toasty.successToast('Account Updated Successfully');
                }
                return { type: 'EmptyAction' };
            }));

    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private _router: Router,
        private store: Store<AppState>,
        private _salesService: SalesService,
        private _accountService: AccountService,
        private _groupService: GroupService,
        private _inventoryService: InventoryService
    ) {
    }

    public resetAccountDetailsForSales(): CustomActions {
        return {
            type: SALES_ACTIONS.RESET_ACCOUNT_DETAILS
        };
    }

    public getAccountDetailsForSales(value: string): CustomActions {
        return {
            type: SALES_ACTIONS.GET_ACCOUNT_DETAILS,
            payload: value
        };
    }

    public getAccountDetailsForSalesResponse(value: BaseResponse<AccountResponseV2, string>): CustomActions {
        return {
            type: SALES_ACTIONS.GET_ACCOUNT_DETAILS_RESPONSE,
            payload: value
        };
    }

    public addAccountDetailsForSales(value: AddAccountRequest): CustomActions {
        return {
            type: SALES_ACTIONS.ADD_ACCOUNT_DETAILS,
            payload: value
        };
    }

    public addAccountDetailsForSalesResponse(value: BaseResponse<AccountResponseV2, AccountRequestV2>): CustomActions {
        return {
            type: SALES_ACTIONS.ADD_ACCOUNT_DETAILS_RESPONSE,
            payload: value
        };
    }

    public updateAccountDetailsForSales(value: UpdateAccountRequest): CustomActions {
        return {
            type: SALES_ACTIONS.UPDATE_ACCOUNT_DETAILS,
            payload: value
        };
    }

    public updateAccountDetailsForSalesResponse(value: BaseResponse<AccountResponseV2, AccountRequestV2>): CustomActions {
        return {
            type: SALES_ACTIONS.UPDATE_ACCOUNT_DETAILS_RESPONSE,
            payload: value
        };
    }

    public getGroupsListForSales(): CustomActions {
        return {
            type: SALES_ACTIONS.GET_HIERARCHICAL_STOCK_GROUPS
        };
    }

    public getGroupsListForSalesResponse(value: BaseResponse<GroupsWithStocksHierarchyMin, string>): CustomActions {
        let res: BaseResponse<GroupsWithStocksHierarchyMin, string> = value;
        if (res.status === 'success') {
            return {
                type: SALES_ACTIONS.GET_HIERARCHICAL_STOCK_GROUPS_RESPONSE,
                payload: this._inventoryService.makeStockGroupsFlatten(value.body.results, [])
            };
        }
    }

    public getFlattenAcOfPurchase(value: { groupUniqueNames: string[] }): CustomActions {
        return {
            type: SALES_ACTIONS.GET_PURCHASE_AC_LIST,
            payload: value
        };
    }

    public getFlattenAcOfSales(value: { groupUniqueNames: string[] }): CustomActions {
        return {
            type: SALES_ACTIONS.GET_SALES_AC_LIST,
            payload: value
        };
    }

    public createStockGroupSuccess(value: INameUniqueName): CustomActions {
        return {
            type: SALES_ACTIONS.STOCK_GROUP_SUCCESS,
            payload: value
        };
    }

    public createStockAcSuccess(value: any): CustomActions {
        return {
            type: SALES_ACTIONS.STOCK_AC_SUCCESS,
            payload: value
        };
    }

    public createServiceAcSuccess(value: any): CustomActions {
        return {
            type: SALES_ACTIONS.SERVICE_AC_SUCCESS,
            payload: value
        };
    }

    public storeSalesFlattenAc(value: IOption[]): CustomActions {
        return {
            type: SALES_ACTIONS.SALES_FLATTEN_AC_STORED,
            payload: value
        };
    }

    private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response.status === 'error') {
            if (showToast) {
                this._toasty.errorToast(response.message);
            }
            return errorAction;
        }
        return successAction;
    }
}
