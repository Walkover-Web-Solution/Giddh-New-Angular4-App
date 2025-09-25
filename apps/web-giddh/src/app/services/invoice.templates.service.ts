import { catchError, map } from 'rxjs/operators';
import { CustomTemplateResponse } from '../models/api-models/Invoice';
import { Observable } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { INVOICE_API } from './apiurls/invoice';
import { HttpWrapperService } from './http-wrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class InvoiceTemplatesService {
    private companyUniqueName: string;

    /**
     * Creates an instance of InvoiceTemplatesService.
     *
     * @param {GiddhErrorHandler} errorHandler Handles errors across the service
     * @param {HttpWrapperService} http HTTP wrapper for API calls
     * @param {GeneralService} generalService Provides general utility functions
     * @param {IServiceConfigArgs} [config] Optional service configuration
     * @memberof InvoiceTemplatesService
     */
    constructor(private errorHandler: GiddhErrorHandler, public http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * Retrieves user templates for the given template type.
     *
     * @param {string} [templateType] The type of template to fetch
     * @returns {Observable<BaseResponse<CustomTemplateResponse[], string>>} Observable emitting the templates response
     * @memberof InvoiceTemplatesService
     */
    public getTemplates(templateType?: string): Observable<BaseResponse<CustomTemplateResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVOICE_API.GET_USER_TEMPLATES
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':voucherType', encodeURIComponent(templateType))).pipe(map((res) => {
                let data: BaseResponse<CustomTemplateResponse[], string> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<CustomTemplateResponse[], string>(e, '')));
    }

    /**
     * Retrieves all templates created by the user for the given template type.
     *
     * @param {*} templateType The type of template to fetch
     * @returns {Observable<BaseResponse<CustomTemplateResponse[], string>>} Observable emitting the created templates response
     * @memberof InvoiceTemplatesService
     */
    public getAllCreatedTemplates(templateType: any): Observable<BaseResponse<CustomTemplateResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVOICE_API.GET_CREATED_TEMPLATES
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':voucherType', encodeURIComponent(templateType))).pipe(map((res) => {
                let data: BaseResponse<CustomTemplateResponse[], string> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<CustomTemplateResponse[], string>(e, '')));
    }

    /**
     * Sets a template as the default for the given type.
     *
     * @param {string} templateUniqueName The unique name of the template
     * @param {string} templateType The type of template
     * @returns {Observable<BaseResponse<any, string>>} Observable emitting the response
     * @memberof InvoiceTemplatesService
     */
    public setTemplateAsDefault(templateUniqueName: string, templateType: string): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.patch(this.config.apiUrl + INVOICE_API.SET_AS_DEFAULT
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':templateUniqueName', templateUniqueName)
            ?.replace(':voucherType', encodeURIComponent(templateType)), {}).pipe(map((res) => {
                let data: BaseResponse<any, string> = res;
                data.queryString = { templateUniqueName };
                return data;
            }), catchError((e) => {
                let object = this.errorHandler.HandleCatch<any, string>(e);
                return object.pipe(map(p => p.body));
            }));
    }

    /**
     * Deletes a template by its unique name.
     *
     * @param {string} templateUniqueName The unique name of the template to delete
     * @returns {Observable<BaseResponse<any, string>>} Observable emitting the response
     * @memberof InvoiceTemplatesService
     */
    public deleteTemplate(templateUniqueName: string): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + INVOICE_API.DELETE_TEMPLATE
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':templateUniqueName', templateUniqueName)).pipe(map((res) => {
                let data: BaseResponse<any, string> = res;
                data.queryString = { templateUniqueName };
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, templateUniqueName)));
    }

    /**
     * Saves a new template.
     *
     * @param {*} model The template model to save
     * @returns {Observable<BaseResponse<string, string>>} Observable emitting the save response
     * @memberof InvoiceTemplatesService
     */
    public saveTemplates(model: any): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVOICE_API.CREATE_NEW_TEMPLATE
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = model;
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, model)));
    }

    /**
     * Updates an existing template.
     *
     * @param {string} templateUniqueName The unique name of the template
     * @param {*} model The updated template model
     * @returns {Observable<BaseResponse<string, string>>} Observable emitting the update response
     * @memberof InvoiceTemplatesService
     */
    public updateTemplate(templateUniqueName: string, model: any): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + INVOICE_API.UPDATE_TEMPLATE
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':templateUniqueName', encodeURIComponent(templateUniqueName)), model).pipe(map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = model;
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, model)));
    }

    /**
     * Saves template settings/configuration.
     *
     * @param {*} model The template settings model to save
     * @returns {Observable<BaseResponse<any, any>>} Observable emitting the save response
     * @memberof InvoiceTemplatesService
     */
    public saveTemplateSettings(model: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        
        const postUrl = this.config.apiUrl + INVOICE_API.SAVE_TEMPLATE_SETTINGS
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            
        return this.http.post(postUrl, model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * Retrieves template preview for the given template type and unique name.
     *
     * @param {*} templateType The type of template to preview
     * @param {string} [templateUniqueName] The unique name of the template (optional)
     * @returns {Observable<BaseResponse<any, string>>} Observable emitting the template preview response
     * @memberof InvoiceTemplatesService
     */
    public getTemplatePreview(templateType: any, templateUniqueName?: string): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        
        const getUrl = this.config.apiUrl + INVOICE_API.GET_TEMPLATE_PREVIEW
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':templateUniqueName', encodeURIComponent(templateUniqueName || ''))
            ?.replace(':voucherType', encodeURIComponent(templateType));
            
        return this.http.get(getUrl).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '')));
    }
}
