import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpWrapperService } from './httpWrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { PayNowRequest } from '../contact/contact.component';
import { CONTACT_API } from './apiurls/contact.api';
import { ContactAdvanceSearchModal } from "../models/api-models/Contact";

@Injectable()
export class ContactService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, public _http: HttpWrapperService, public _router: Router,
        private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    public payNow(body: PayNowRequest): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + 'company/:companyUniqueName/cashfree/transfer'.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), body).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = body;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, body, '')));
    }

    /**
     *To get contact details
     *
     * @param {string} fromDate From date
     * @param {string} toDate To date
     * @param {string} groupUniqueName Group unique name
     * @param {number} pageNumber Page number
     * @param {string} refresh Refresh type
     * @param {number} count pagination count
     * @param {string} [query]
     * @param {string} [sortBy=''] Sort by item name
     * @param {string} [order='asc'] Sort type
     * @param {ContactAdvanceSearchModal} [postData] Request model object
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof ContactService
     */
    public GetContacts(fromDate: string, toDate: string, groupUniqueName: string, pageNumber: number, refresh: string, count: number, query?: string, sortBy: string = '',
        order: string = 'asc', postData?: ContactAdvanceSearchModal): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        let url = this.config.apiUrl + 'v2/company/:companyUniqueName/groups/:groupUniqueName/account-balances?page=:page' +
            '&count=:count&refresh=:refresh&q=:query&sortBy=:sortBy&sort=:order&from=:fromDate&to=:toDate';

        url = url.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':groupUniqueName', encodeURIComponent(groupUniqueName))
            .replace(':count', count.toString())
            .replace(':page', pageNumber.toString())
            .replace(':refresh', refresh)
            .replace(':query', query)
            .replace(':sortBy', sortBy)
            .replace(':order', order)
            .replace(':fromDate', fromDate)
            .replace(':toDate', toDate);

        if (postData && Object.keys(postData).length > 0) {
            return this._http.post(url, postData).pipe(map((res) => {
                let data: BaseResponse<any, string> = res;
                data.request = '';
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', '')));
        } else {
            return this._http.get(url).pipe(map((res) => {
                let data: BaseResponse<any, string> = res;
                data.request = '';
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', '')));
        }
    }

    public GetCashFreeBalance(): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + 'company/:companyUniqueName/cashfree/balance'.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', '')));
    }

    public addComment(comment, accountUniqueName): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        let description = comment;
        return this._http.post(this.config.apiUrl + CONTACT_API.ADD_COMMENT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', accountUniqueName), { description }).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', '')));
    }

    public deleteComment(accountUniqueName): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.delete(this.config.apiUrl + CONTACT_API.ADD_COMMENT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', accountUniqueName)).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', '')));
    }

    public GetContactsDashboard(fromDate: string, toDate: string, groupUniqueName: string, pageNumber: number, refresh: string, count: number = 50, query?: string, sortBy: string = '',
        order: string = 'asc', postData?: ContactAdvanceSearchModal): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        let url = this.config.apiUrl + 'v2/company/:companyUniqueName/groups/:groupUniqueName/account-balances?page=:page' +
            '&count=:count&refresh=:refresh&q=:query&sortBy=:sortBy&sort=:order&from=:fromDate&to=:toDate&module=dashboard';

        url = url.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':groupUniqueName', encodeURIComponent(groupUniqueName))
            .replace(':count', count.toString())
            .replace(':page', pageNumber.toString())
            .replace(':refresh', refresh)
            .replace(':query', query)
            .replace(':sortBy', sortBy)
            .replace(':order', order)
            .replace(':fromDate', fromDate)
            .replace(':toDate', toDate);

        if (postData && Object.keys(postData).length > 0) {
            return this._http.post(url, postData).pipe(map((res) => {
                let data: BaseResponse<any, string> = res;
                data.request = '';
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', '')));
        } else {
            return this._http.get(url).pipe(map((res) => {
                let data: BaseResponse<any, string> = res;
                data.request = '';
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', '')));
        }
    }
}
