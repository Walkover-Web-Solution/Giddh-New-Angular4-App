import { empty as observableEmpty, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ShareRequestForm } from '../models/api-models/Permission';
import { AccountMergeRequest, AccountMoveRequest, AccountRequest, AccountRequestV2, AccountResponse, AccountResponseV2, AccountSharedWithResponse, AccountsTaxHierarchyResponse, AccountUnMergeRequest, FlattenAccountsResponse, ShareAccountRequest, ShareEntityRequest } from '../models/api-models/Account';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { ACCOUNTS_API, ACCOUNTS_API_V2 } from './apiurls/account.api';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { APPLY_TAX_API } from './apiurls/applyTax.api';
import { ApplyTaxRequest } from '../models/api-models/ApplyTax';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { AssignDiscountRequestForAccount, ApplyDiscountRequestV2 } from '../models/api-models/ApplyDiscount';
import { APPLY_DISCOUNT_API } from './apiurls/applyDiscount';

@Injectable()
export class AccountService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this.companyUniqueName = this.generalService.companyUniqueName;
    }

    public UpdateAccount(model: AccountRequest, accountUniqueName: string): Observable<BaseResponse<AccountResponse, AccountRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + ACCOUNTS_API.UPDATE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<AccountResponse, AccountRequest> = res;
                data.request = model;
                data.queryString = { accountUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<AccountResponse, AccountRequest>(e)));
    }

    public MergeAccount(model: AccountMergeRequest[], accountUniqueName: string): Observable<BaseResponse<string, AccountMergeRequest[]>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + ACCOUNTS_API.MERGE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<string, AccountMergeRequest[]> = res;
                data.request = model;
                data.queryString = { accountUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, AccountMergeRequest[]>(e)));
    }

    public UnmergeAccount(model: AccountUnMergeRequest, accountUniqueName: string): Observable<BaseResponse<string, AccountUnMergeRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + ACCOUNTS_API.UNMERGE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<string, AccountUnMergeRequest> = res;
                data.request = model;
                data.queryString = { accountUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, AccountUnMergeRequest>(e)));
    }

    public ApplyTax(model: ApplyTaxRequest): Observable<BaseResponse<string, ApplyTaxRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let mod = [];
        mod.push(model);
        return this.http.post(this.config.apiUrl + APPLY_TAX_API.APPLY_TAX?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), mod).pipe(
            map((res) => {
                let data: BaseResponse<string, ApplyTaxRequest> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, ApplyTaxRequest>(e)));
    }

    public ApplyDiscount(model: AssignDiscountRequestForAccount): Observable<BaseResponse<string, AssignDiscountRequestForAccount>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + APPLY_DISCOUNT_API.APPLY_DISCOUNT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<string, AssignDiscountRequestForAccount> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, AssignDiscountRequestForAccount>(e)));
    }

    public GetApplyDiscount(accountUniqueName: string): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + APPLY_DISCOUNT_API.GET_APPLY_DISCOUNT_API?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.queryString = { accountUniqueName };
            data.request = accountUniqueName;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    public AccountMove(model: AccountMoveRequest, accountUniqueName: string, activeGroupUniqueName: string): Observable<BaseResponse<string, AccountMoveRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + ACCOUNTS_API.MOVE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<string, AccountMoveRequest> = res;
                data.request = model;
                data.queryString = { accountUniqueName, activeGroupUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, AccountMoveRequest>(e)));
    }

    public AccountShare(model: ShareAccountRequest, accountUniqueName: string): Observable<BaseResponse<string, ShareAccountRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + ACCOUNTS_API.SHARE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<string, ShareAccountRequest> = res;
                data.request = model;
                data.queryString = { accountUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, ShareAccountRequest>(e)));
    }

    public Share(model: ShareEntityRequest, roleUniqueName: string): Observable<BaseResponse<string, ShareEntityRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + ACCOUNTS_API.SHARE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':roleUniqueName', encodeURIComponent(roleUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<string, ShareEntityRequest> = res;
                data.request = model;
                data.queryString = { roleUniqueName, entity: model.entity, entityUniqueName: model.entityUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, ShareEntityRequest>(e)));
    }

    public UnShare(entryUniqueName: string, entity: string, entityUniqueName: string): Observable<BaseResponse<string, ShareEntityRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + ACCOUNTS_API.CHANGE_PERMISSION?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':assignRoleEntryUniqueName', encodeURIComponent(entryUniqueName))).pipe(
            map((res) => {
                let data: BaseResponse<string, ShareEntityRequest> = res;
                data.queryString = { entryUniqueName, entityUniqueName, entity };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, ShareEntityRequest>(e)));
    }

    public UpdateEntityPermission(model: ShareRequestForm, entity: string, newRoleUniqueName: string): Observable<BaseResponse<string, ShareEntityRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.put(this.config.apiUrl + ACCOUNTS_API.CHANGE_PERMISSION?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':assignRoleEntryUniqueName', encodeURIComponent(model?.uniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<string, ShareEntityRequest> = res;
                data.queryString = { model, newRoleUniqueName, entity };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, ShareEntityRequest>(e)));
    }

    public AccountUnshare(userEmail: string, accountUniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.put(this.config.apiUrl + ACCOUNTS_API.CHANGE_PERMISSION?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), { user: userEmail }).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.request = userEmail;
            data.queryString = { accountUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public AccountShareWith(accountUniqueName: string): Observable<BaseResponse<AccountSharedWithResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + ACCOUNTS_API.SHARED_WITH?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName))).pipe(
            map((res) => {
                let data: BaseResponse<AccountSharedWithResponse[], string> = res;
                data.request = '';
                data.queryString = { accountUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<AccountSharedWithResponse[], string>(e)));
    }

    public DeleteAccount(accountUniqueName: string, groupUniqueName: string): Observable<BaseResponse<string, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + ACCOUNTS_API.DELETE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName))).pipe(map((res) => {
            let data: BaseResponse<string, any> = res;
            data.request = { accountUniqueName, groupUniqueName };
            data.queryString = accountUniqueName;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, accountUniqueName, { accountUniqueName })));
    }

    public getFlattenAccounts(q?: string, page?: string, count?: string): Observable<BaseResponse<FlattenAccountsResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        if (this.companyUniqueName) {
            return this.http.get(this.config.apiUrl + ACCOUNTS_API.FLATTEN_ACCOUNTS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':q', encodeURIComponent(q || ''))?.replace(':count', count || '')?.replace(':page', encodeURIComponent(page || ''))).pipe(map((res) => {
                let data: BaseResponse<FlattenAccountsResponse, string> = res;
                data.request = '';
                data.queryString = { q, page, count };
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<FlattenAccountsResponse, string>(e)));
        } else {
            return observableEmpty();
        }
    }

    public GetTaxHierarchy(accountUniqueName: string): Observable<BaseResponse<AccountsTaxHierarchyResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + ACCOUNTS_API.TAX_HIERARCHY?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName))).pipe(map((res) => {
            let data: BaseResponse<AccountsTaxHierarchyResponse, string> = res;
            data.request = '';
            data.queryString = { accountUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<AccountsTaxHierarchyResponse, string>(e)));
    }

    /**
     * accounts v2 api's
     */
    public GetAccountDetailsV2(accountUniqueName: string): Observable<BaseResponse<AccountResponseV2, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        if (accountUniqueName) {
            return this.http.get(this.config.apiUrl + ACCOUNTS_API_V2.GET?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName))).pipe(map((res) => {
                let data: BaseResponse<AccountResponseV2, string> = res;
                data.queryString = { accountUniqueName };
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<AccountResponseV2, string>(e)));
        } else {
            return of({});
        }
    }

    public CreateAccountV2(model: AccountRequestV2, groupUniqueName: string): Observable<BaseResponse<AccountResponseV2, AccountRequestV2>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + ACCOUNTS_API_V2.CREATE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':groupUniqueName', encodeURIComponent(groupUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<AccountResponseV2, AccountRequestV2> = res;
                data.request = model;
                data.queryString = { groupUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<AccountResponseV2, AccountRequestV2>(e, model, { groupUniqueName })));
    }

    public UpdateAccountV2(model: AccountRequestV2, reqObj: { groupUniqueName: string, accountUniqueName: string, isMasterOpen?: boolean }): Observable<BaseResponse<AccountResponseV2, AccountRequestV2>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + ACCOUNTS_API_V2.UPDATE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':groupUniqueName', encodeURIComponent(reqObj?.groupUniqueName))
            ?.replace(':accountUniqueName', encodeURIComponent(reqObj?.accountUniqueName)), model).pipe(
                map((res) => {
                    let data: BaseResponse<AccountResponseV2, AccountRequestV2> = res;
                    data.request = model;
                    data.queryString = reqObj;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<AccountResponseV2, AccountRequestV2>(e)));
    }

    /**
     * To apply discount in accounts
     *
     * @param {ApplyDiscountRequestV2} model request model
     * @returns {Observable<BaseResponse<string, ApplyDiscountRequestV2>>}
     * @memberof AccountService
     */
    public applyDiscounts(model: ApplyDiscountRequestV2): Observable<BaseResponse<string, ApplyDiscountRequestV2>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + APPLY_DISCOUNT_API.APPLY_DISCOUNTS_V2?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<string, ApplyDiscountRequestV2> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, ApplyDiscountRequestV2>(e)));
    }

}
