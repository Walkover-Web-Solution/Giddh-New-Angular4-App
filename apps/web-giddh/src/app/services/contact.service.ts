import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './http-wrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { ACCOUNT_STATEMENT_API, CONTACT_API } from './apiurls/contact.api';
import { ContactAdvanceSearchModal, SendBulkEmailTemplateRequest } from "../models/api-models/Contact";
import { PAGINATION_LIMIT } from '../app.constant';
import { AccountArchivedStatusEnum } from '../shared/Enums/common.enum';
import { concat, get, keys } from '../lodash-optimized';

interface IBankRefreshResponse {
    success: boolean;
    message: string;
}

@Injectable()
export class ContactService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler,
        public http: HttpWrapperService,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * To get contact details
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
     * @param {string} [branchUniqueName] Current branch selected
     * @param {string} [accountArchiveStatus]
     * @param {ContactAdvanceSearchModal} [postData] Request model object
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof ContactService
     */
    public GetContacts(
        fromDate: string, 
        toDate: string, 
        groupUniqueName: string, 
        pageNumber: number, 
        refresh: string, 
        count: number, 
        query?: string, 
        sortBy: string = '',
        order: string = 'asc', 
        postData?: ContactAdvanceSearchModal, 
        branchUniqueName?: string
    ): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + 'v2/company/:companyUniqueName/groups/:groupUniqueName/account-balances?page=:page' +
            '&count=:count&refresh=:refresh&q=:query&sortBy=:sortBy&sort=:order&from=:fromDate&to=:toDate';
        query = (query) ? query : '';
        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':groupUniqueName', encodeURIComponent(groupUniqueName))
            ?.replace(':count', count?.toString())
            ?.replace(':page', pageNumber?.toString())
            ?.replace(':refresh', refresh)
            ?.replace(':query', query)
            ?.replace(':sortBy', sortBy)
            ?.replace(':order', order)
            ?.replace(':fromDate', fromDate)
            ?.replace(':toDate', toDate);
        if (branchUniqueName) {
            branchUniqueName = branchUniqueName !== this.companyUniqueName ? branchUniqueName : '';
            url = url.concat('&branchUniqueName=', branchUniqueName);
        }
        
        if (postData && Object.keys(postData)?.length > 0) {
            return this.http.post(url, postData).pipe(map((res) => {
                let data: BaseResponse<any, string> = res;
                data.request = '';
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', '')));
        } else {
            return this.http.get(url).pipe(map((res) => {
                let data: BaseResponse<any, string> = res;
                data.request = '';
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', '')));
        }
    }

    public addComment(comment, accountUniqueName): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let description = comment;
        return this.http.post(this.config.apiUrl + CONTACT_API.ADD_COMMENT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), { description }).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', '')));
    }

    public deleteComment(accountUniqueName): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + CONTACT_API.ADD_COMMENT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', '')));
    }

    public GetContactsDashboard(fromDate: string, toDate: string, groupUniqueName: string, pageNumber: number, refresh: string, count: number = PAGINATION_LIMIT, query?: string, sortBy: string = '',
        order: string = 'asc', postData?: ContactAdvanceSearchModal): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + 'v2/company/:companyUniqueName/groups/:groupUniqueName/account-balances?page=:page' +
            '&count=:count&refresh=:refresh&q=:query&sortBy=:sortBy&sort=:order&from=:fromDate&to=:toDate&module=dashboard';

        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':groupUniqueName', encodeURIComponent(groupUniqueName))
            ?.replace(':count', count?.toString())
            ?.replace(':page', pageNumber?.toString())
            ?.replace(':refresh', refresh)
            ?.replace(':query', query)
            ?.replace(':sortBy', sortBy)
            ?.replace(':order', order)
            ?.replace(':fromDate', fromDate)
            ?.replace(':toDate', toDate);

        if (postData && Object.keys(postData)?.length > 0) {
            return this.http.post(url, postData).pipe(map((res) => {
                let data: BaseResponse<any, string> = res;
                data.request = '';
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', '')));
        } else {
            return this.http.get(url).pipe(map((res) => {
                let data: BaseResponse<any, string> = res;
                data.request = '';
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', '')));
        }
    }

    /**
     * Refresh go-cardless bank transactions
     *
     * . @returns {Observable<BaseResponse<IBankRefreshResponse, any>>}
     * @memberof ContactService
     */
    public refreshGoCardlessBankTransactions(accountUniqueName: string): Observable<BaseResponse<IBankRefreshResponse, string>> {
        let url = this.config.apiUrl + CONTACT_API.GOCARDLESS_BANK_TRANSACTIONS_REFRESH;
        url = url.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));
        url = url.replace(':accountUniqueName', encodeURIComponent(accountUniqueName ?? ''));
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = '';
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<IBankRefreshResponse, string>(e, '', '')));
    }

    /**
    * Send bulk email template to specified customers or vendors
    * @param model Request payload containing customer/vendor unique names and template type
    * @returns Observable<BaseResponse<any, string>> API response
    */
    public sendBulkEmailTemplate(model: SendBulkEmailTemplateRequest): Observable<BaseResponse<any, string>> {
        return this.http.post(this.config.apiUrl + CONTACT_API.SEND_EMAIL_TEMPLATE?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, string> = res;
                data.request = '';
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', ''))
        );
    }

    /**
* Get Account Statement List API
*
* @param {*} model
* @return {*}  {Observable<BaseResponse<any, any>>}
* @memberof ContactService
*/
    /**
     * Optimized: Get Account Statement List API
     * - DRY URL construction
     * - Unified response mapping & error handling
     * - Improved readability
     */
    public getAccountStatementList(requestObj: any): Observable<BaseResponse<any, any>> {
        const model = requestObj.model ? requestObj.model : requestObj;
        const body = requestObj.body ? requestObj.body : null;
        let requestObjCopy = { ...requestObj };
        delete requestObj.branchUniqueName;
        this.companyUniqueName = this.generalService.companyUniqueName;
        const branchUniqueName = requestObjCopy.branchUniqueName;
        // Helper to build URL
        const buildUrl = () => {
            let url = this.config.apiUrl + ACCOUNT_STATEMENT_API.GET
                .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
                .replace(':accountUniqueName', encodeURIComponent(model.accountUniqueName))
                .replace(':count', encodeURIComponent(model.count))
                .replace(':page', encodeURIComponent(model.page))
                .replace(':from', encodeURIComponent(model.from))
                .replace(':to', encodeURIComponent(model.to))
                .replace(':sort', encodeURIComponent(model.sort))
                .replace(':q', encodeURIComponent(model.q));
            if (branchUniqueName) {
                url = url.concat(`&branchUniqueName=${branchUniqueName}`);
            }
            return url;
        };

        // Unified pipe logic
        const handleResponse = map((res: BaseResponse<any, string>) => {
            let data = res;
            data.queryString = { data };
            return data;
        });
        const handleError = (e: any) => this.errorHandler.HandleCatch<any, any>(e);

        if (requestObj.method === 'POST') {
            return this.http.post(buildUrl(), body).pipe(handleResponse, catchError(handleError));
        } else {
            return this.http.get(buildUrl()).pipe(handleResponse, catchError(handleError));
        }
    }

    /**
     * Export account statement API call
     * 
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof ContactService
     */
    public exportAccountStatement(requestObj: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.generalService.replaceUrlPlaceholders(ACCOUNT_STATEMENT_API.EXPORT_ACCOUNT_STATEMENT, requestObj.queryParam), requestObj.payload).pipe(
            map((res) => {
                let data: BaseResponse<any, string> = res;
                data.request = '';
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', ''))
        );
    }
}
