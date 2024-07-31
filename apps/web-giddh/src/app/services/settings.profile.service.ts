import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpWrapperService } from './http-wrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { SmsKeyClass } from '../models/api-models/SettingsIntegraion';
import { SETTINGS_PROFILE_API } from './apiurls/settings.profile.api';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class SettingsProfileService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /*
    * Get company profile
    */
    public GetProfileInfo(): Observable<BaseResponse<SmsKeyClass, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        if (this.companyUniqueName) {
            return this.http.get(this.config.apiUrl + SETTINGS_PROFILE_API.GET?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
                let data: BaseResponse<SmsKeyClass, string> = res;
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<SmsKeyClass, string>(e)));
        } else {
            return of({});
        }
    }

    /**
     * Update company profile
     */
    public UpdateProfile(model): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + SETTINGS_PROFILE_API.GET?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * Patch company profile
     */
    public PatchProfile(model: any, companyUniqueName?: any, status?: any): Observable<BaseResponse<any, any>> {
        if (companyUniqueName) {
            this.companyUniqueName = companyUniqueName;
        } else {
            this.companyUniqueName = (model.moveCompany) ? model.moveCompany : this.generalService.companyUniqueName;
        }
        if (status) {
            model = status;
        } else {
            model = model;
        }
        const contextPath = (model.callNewPlanApi) ? SETTINGS_PROFILE_API.UPDATE_COMPANY_PLAN : SETTINGS_PROFILE_API.GET;
        return this.http.patch(this.config.apiUrl + contextPath?.replace(':companyUniqueName', encodeURIComponent(model?.companyUniqueName ? model?.companyUniqueName :  this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * Get Company Inventory Settings
     */
    public GetInventoryInfo(): Observable<BaseResponse<SmsKeyClass, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_PROFILE_API.GET?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)) + '/settings').pipe(map((res) => {
            let data: BaseResponse<SmsKeyClass, string> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<SmsKeyClass, string>(e)));
    }

    /**
     * Update company profile
     */
    public UpdateInventory(model): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + SETTINGS_PROFILE_API.GET?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)) + '/settings', model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * Retrieves the branch info
     *
     * @returns {Observable<BaseResponse<any, any>>} Observable to carry out further operations
     * @memberof SettingsProfileService
     */
    public getBranchInfo(): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        const branchUniqueName = this.generalService.currentBranchUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_PROFILE_API.GET_BRANCH_INFO
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
            ?.replace(':branchUniqueName', encodeURIComponent(branchUniqueName)))
            .pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
    }

    /**
     * Retrieves all the addresses of a company
     *
     * @returns {Observable<BaseResponse<any, any>>} Observable to carry out further operations
     * @memberof SettingsProfileService
     */
    public getCompanyAddresses(method: string, params?: any): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = `${this.config.apiUrl}${SETTINGS_PROFILE_API.GET_COMPANY_ADDRESSES}`
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        if (method === 'GET') {
            if (params) {
                Object.keys(params).forEach((key, index) => {
                    const delimiter = index === 0 ? '?' : '&'
                    if (params[key] !== undefined) {
                        contextPath += `${delimiter}${key}=${params[key]}`
                    }
                });
            }
            return this.http.get(contextPath).pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
        } else if (method === 'POST') {
            contextPath = contextPath.concat(`?page=${[params.page]}`);
            return this.http.post(contextPath, params).pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
        }
    }

    /**
     * Updates branch profile information
     *
     * @param {*} params Params for update operation
     * @returns {Observable<BaseResponse<any, any>>} Observable to carry out further operations
     * @memberof SettingsProfileService
     */
    public updateBranchInfo(params: any): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        const branchUniqueName = this.generalService.currentBranchUniqueName || params.branchUniqueName;
        let contextPath = `${this.config.apiUrl}${SETTINGS_PROFILE_API.UPDATE_BRANCH_INFO}`
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
            ?.replace(':branchUniqueName', encodeURIComponent(branchUniqueName));
        return this.http.put(contextPath, params).pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
    }

    /**
     * Fetches all the linked entities
     *
     * @returns {Observable<BaseResponse<any, any>>} Observable to carry out further operation
     * @memberof SettingsProfileService
     */
    public getAllLinkedEntities(): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = `${this.config.apiUrl}${SETTINGS_PROFILE_API.GET_LINKED_ENTITIES}`
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        return this.http.get(contextPath).pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
    }

    /**
     * Creates new address
     *
     * @param {*} params
     * @returns {Observable<BaseResponse<any, any>>} Observable to carry out further operation
     * @memberof SettingsProfileService
     */
    public createNewAddress(params: any): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = `${this.config.apiUrl}${SETTINGS_PROFILE_API.CREATE_NEW_ADDRESS}`
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        return this.http.post(contextPath, params).pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
    }

    /**
     * Updates the address
     *
     * @param {*} params
     * @returns {Observable<BaseResponse<any, any>>} Observable to carry out further operation
     * @memberof SettingsProfileService
     */
    public updateAddress(params: any): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        const addressUniqueName = params?.uniqueName;
        let contextPath = `${this.config.apiUrl}${SETTINGS_PROFILE_API.UPDATE_ADDRESS}`
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
            ?.replace(':addressUniqueName', encodeURIComponent(addressUniqueName));
        return this.http.put(contextPath, params).pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
    }

    /**
     * Deletes the address
     *
     * @param {string} addressUniqueName
     * @returns {Observable<BaseResponse<any, any>>} Observable to carry out further operation
     * @memberof SettingsProfileService
     */
    public deleteAddress(addressUniqueName: string): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = `${this.config.apiUrl}${SETTINGS_PROFILE_API.DELETE_ADDRESS}`
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
            ?.replace(':addressUniqueName', encodeURIComponent(addressUniqueName));
        return this.http.delete(contextPath).pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
    }

    /**
     * Creates new branch
     *
     * @param {*} params
     * @returns {Observable<BaseResponse<any, any>>} Observable to carry out further operation
     * @memberof SettingsProfileService
     */
    public createNewBranch(params: any): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = `${this.config.apiUrl}${SETTINGS_PROFILE_API.CREATE_BRANCH}`
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        return this.http.post(contextPath, params).pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
    }

    /**
     * Creates new warehouse
     *
     * @param {*} params
     * @returns {Observable<BaseResponse<any, any>>} Observable to carry out further operation
     * @memberof SettingsProfileService
     */
    public createNewWarehouse(params: any): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = `${this.config.apiUrl}${SETTINGS_PROFILE_API.CREATE_NEW_WAREHOUSE}`
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        return this.http.post(contextPath, params).pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
    }

    /**
     * Updates warehouse information
     *
     * @param {*} params Params for update operation
     * @returns {Observable<BaseResponse<any, any>>} Observable to carry out further operations
     * @memberof SettingsProfileService
     */
    public updatWarehouseInfo(params: any): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        const warehouseUniqueName = params.warehouseUniqueName;
        let contextPath = `${this.config.apiUrl}${SETTINGS_PROFILE_API.EDIT_WAREHOUSE}`
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
            ?.replace(':warehouseUniqueName', encodeURIComponent(warehouseUniqueName));
        return this.http.put(contextPath, params).pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
    }

    /**
     * This will get the company details
     *
     * @param {string} companyUniqueName
     * @returns {Observable<BaseResponse<SmsKeyClass, string>>}
     * @memberof SettingsProfileService
     */
    public getCompanyDetails(companyUniqueName: string): Observable<BaseResponse<SmsKeyClass, string>> {
        this.companyUniqueName = companyUniqueName ?? this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_PROFILE_API.GET?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<SmsKeyClass, string> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<SmsKeyClass, string>(e)));
    }

    /**
     * This will be use for get domain list
     *
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SettingsProfileService
     */
    public getDomainList(): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_PROFILE_API.GET_DOMAIN_LIST?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * This will be use for verify whilte lable url
     *
     * @param {*} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SettingsProfileService
     */
    public verifyPortalWhilteLabel(domainUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_PROFILE_API.VERIFY_PORTAL_WHITE_LABEL?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':domainUniqueName', encodeURIComponent(domainUniqueName)), '').pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * This will be use for add portal domain
     *
     * @param {*} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SettingsProfileService
     */
    public addPortalDomain(model: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_PROFILE_API.ADD_PORTAL_DOMAIN?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * This will be use for shared domain email
     *
     * @param {*} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SettingsProfileService
     */
    public sharedDomainEmail(model: any, domainUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_PROFILE_API.SHARE_PORTAL_DOMAIN?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':domainUniqueName', encodeURIComponent(domainUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * This will be use for get domain list with unique name
     *
     * @param {string} domainUniqueName
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SettingsProfileService
     */
    public getDomainListTableData(domainUniqueName: string, fromDnsCompanyUniqueName?: string): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName || fromDnsCompanyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_PROFILE_API.GET_DOMAIN_LIST_DATA?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))?.replace(':domainUniqueName', encodeURIComponent(domainUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * This will be use for set primary domain
     *
     * @param {string} domainUniqueName
     * @param {string} operation
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SettingsProfileService
     */
    public setPrimaryDeleteDomain(domainUniqueName: string, operation: string): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        return this.http.patch(this.config.apiUrl + SETTINGS_PROFILE_API.PRIMARY_DELETE_DOMAIN_SET?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))?.replace(':domainUniqueName', encodeURIComponent(domainUniqueName))?.replace(':operation', encodeURIComponent(operation)), '').pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * This will be use for new update subscriptions payment
     *
     * @param {*} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SettingsProfileService
     */
    public updateSubscriptionPayment(model: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.config.apiUrl + SETTINGS_PROFILE_API.SUBSCRIPTION_CHARGE?.replace(':subscriptionId', encodeURIComponent(model?.subscriptionRequest?.subscriptionId)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }
}
