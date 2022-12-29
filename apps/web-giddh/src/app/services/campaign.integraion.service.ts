import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { SmsKeyClass, } from '../models/api-models/SettingsIntegraion';
import { SETTINGS_INTEGRATION_COMMUNICATION_API } from './apiurls/settings.integration.api';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class CampaignIntegrationService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * Get platforms and fields for integration
     *
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof CampaignIntegrationService
     */
    public getCommunicationPlatforms(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.GET_PLATFORMS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Verifies the integration with communication platform
     *
     * @param {*} model
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof CampaignIntegrationService
     */
    public verifyCommunicationPlatform(model: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.VERIFY_PLATFORM.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Deletes the integration with communication platform
     *
     * @param {string} platformUniqueName
     * @returns {Observable<BaseResponse<string, string>>}
     * @memberof CampaignIntegrationService
     */
    public deleteCommunicationPlatform(platformUniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.DELETE_PLATFORM.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':platformUniqueName', platformUniqueName)).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Gets the list of triggers
     *
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof CampaignIntegrationService
     */
    public getTriggersList(requestObj: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.GET_TRIGGERS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), requestObj).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Deletes the trigger
     *
     * @param {string} triggerUniqueName
     * @returns {Observable<BaseResponse<string, string>>}
     * @memberof CampaignIntegrationService
     */
    public deleteTrigger(triggerUniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.DELETE_TRIGGER.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':triggerUniqueName', triggerUniqueName)).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Gets the trigger form
     *
     * @param {string} platform
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof CampaignIntegrationService
     */
    public getTriggerForm(platform: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.GET_TRIGGER_FORM.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':platform', platform)).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     *Get Field Suggestion
     *
     * @param {string} platform
     * @param {string} entity
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof CampaignIntegrationService
     */
    public getFieldSuggestions(platform: string, entity: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.GET_FIELD_SUGGESTIONS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':platform', platform).replace(':entity', entity)).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     *Get Campaign Field data
     *
     * @param {string} slug
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof CampaignIntegrationService
     */
    public getCampaignFields(slug: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.GET_CAMPAIGN_FIELDS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':slug', slug)).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Get Campaign List
     *
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof CampaignIntegrationService
     */
    public getCampaignList(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.GET_CAMPAIGN_LIST.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     *Get Trigger by  uniqueName
     *
     * @param {string} triggerUniqueName
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof CampaignIntegrationService
     */
    public getTriggerByUniqueName(triggerUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.GET_TRIGGERS_BY_UNIQUENAME.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':triggerUniqueName', triggerUniqueName)).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     *Create Trigger
     *
     * @param {*} requestObj
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof CampaignIntegrationService
     */
    public createTrigger(requestObj: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.CREATE_TRIGGERS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), requestObj).pipe(map((res) => {
            let data: BaseResponse<string, SmsKeyClass> = res;
            data.request = requestObj;
            return data;
        }), catchError((e) => this.errorHandler?.HandleCatch<any, any>(e, requestObj)));
    }

    /**
     *Update Trigger
     *
     * @param {*} requestObj
     * @param {string} triggerUniqueName
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof CampaignIntegrationService
     */
    public updateTrigger(requestObj: any, triggerUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.UPDATE_TRIGGERS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':triggerUniqueName', triggerUniqueName), requestObj).pipe(map((res) => {
            let data: BaseResponse<string, any> = res;
            data.request = requestObj;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, any>(e, requestObj)));
    }

    /**
     * This will use for trigger activate and deactivate
     *
     * @param {*} request
     * @param {*} triggerUniqueName
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof CampaignIntegrationService
     */
    public updateTriggerStatus(request: any, triggerUniqueName: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.patch(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.UPDATE_TRIGGER_STATUS
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':triggerUniqueName', triggerUniqueName), request).pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.queryString = {};
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }
}
