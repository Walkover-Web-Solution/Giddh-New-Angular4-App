import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { SALES_ACTIONS } from './sales.const';
import { AccountRequestV2, AccountResponseV2, AddAccountRequest, UpdateAccountRequest } from '../../models/api-models/Account';
import { AccountService } from '../../services/account.service';
import { CustomActions } from '../../store/custom-actions';
import { IUpdateDbRequest } from "../../models/interfaces/ulist.interface";
import { GeneralActions } from "../general/general.actions";
import { GeneralService } from "../../services/general.service";
import { LocaleService } from '../../services/locale.service';

@Injectable()
export class SalesActions {

    public GetAccountDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SALES_ACTIONS.GET_ACCOUNT_DETAILS),
            switchMap((action: CustomActions) => this._accountService.GetAccountDetailsV2(action.payload)),
            map(response => {
                return this.getAccountDetailsForSalesResponse(response);
            })));

    public GetAccountDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SALES_ACTIONS.GET_ACCOUNT_DETAILS_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload?.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public CreateAccountDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SALES_ACTIONS.ADD_ACCOUNT_DETAILS),
            switchMap((action: CustomActions) => this._accountService.CreateAccountV2(action.payload.accountRequest, action.payload.activeGroupUniqueName)),
            map(response => {
                return this.addAccountDetailsForSalesResponse(response);
            })));

    public CreateAccountResponseDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SALES_ACTIONS.ADD_ACCOUNT_DETAILS_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return {
                        type: 'EmptyAction'
                    };
                } else {
                    this._toasty.successToast(this.localeService.translate("app_messages.account_created"));
                }
                return { type: 'EmptyAction' };
            })));

    public UpdateAccountDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SALES_ACTIONS.UPDATE_ACCOUNT_DETAILS),
            switchMap((action: CustomActions) => this._accountService.UpdateAccountV2(action.payload.accountRequest, action.payload?.value)),
            map(response => {
                if (response && response.body && response.queryString) {
                    const updateIndexDb: IUpdateDbRequest = {
                        newUniqueName: response.body?.uniqueName,
                        oldUniqueName: response.queryString.accountUniqueName,
                        latestName: response.request.name,
                        uniqueName: this._generalServices.companyUniqueName,
                        type: "accounts",
                        isActive: false,
                        name: response.body.name
                    }
                    this.store.dispatch(this._generalActions.updateIndexDb(updateIndexDb));
                }
                return this.updateAccountDetailsForSalesResponse(response);
            })));

    public UpdateAccountDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SALES_ACTIONS.UPDATE_ACCOUNT_DETAILS_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this._toasty.successToast(this.localeService.translate("app_messages.account_updated"));
                }
                return { type: 'EmptyAction' };
            })));

    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private localeService: LocaleService,
        private store: Store<AppState>,
        private _accountService: AccountService,
        private _generalActions: GeneralActions,
        private _generalServices: GeneralService
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

    public createStockAcSuccess(value: any): CustomActions {
        return {
            type: SALES_ACTIONS.STOCK_AC_SUCCESS,
            payload: value
        };
    }
}
