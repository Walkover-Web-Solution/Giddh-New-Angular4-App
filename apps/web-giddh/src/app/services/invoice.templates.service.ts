import { catchError, map } from 'rxjs/operators';
import { CustomTemplateResponse } from '../models/api-models/Invoice';
import { Observable } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { INVOICE_API } from './apiurls/invoice';
import { HttpWrapperService } from './httpWrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class InvoiceTemplatesService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, public http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    public getTemplates(): Observable<BaseResponse<CustomTemplateResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVOICE_API.GET_USER_TEMPLATES).pipe(map((res) => {
            let data: BaseResponse<CustomTemplateResponse[], string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<CustomTemplateResponse[], string>(e, '')));
    }

    public getAllCreatedTemplates(templateType: any): Observable<BaseResponse<CustomTemplateResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVOICE_API.GET_CREATED_TEMPLATES.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':voucherType', encodeURIComponent(templateType))).pipe(map((res) => {
            let data: BaseResponse<CustomTemplateResponse[], string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<CustomTemplateResponse[], string>(e, '')));
    }

    public setTemplateAsDefault(templateUniqueName: string, templateType: string): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.patch(this.config.apiUrl + INVOICE_API.SET_AS_DEFAULT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':templateUniqueName', templateUniqueName).replace(':voucherType', encodeURIComponent(templateType)), {}).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.queryString = { templateUniqueName };
            return data;
        }), catchError((e) => {
            let object = this.errorHandler.HandleCatch<any, string>(e);
            return object.pipe(map(p => p.body));
        }));
    }

    public deleteTemplate(templateUniqueName: string): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + INVOICE_API.DELETE_TEMPLATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':templateUniqueName', templateUniqueName)).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.queryString = { templateUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, templateUniqueName)));
    }

    public saveTemplates(model: any): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVOICE_API.CREATE_NEW_TEMPLATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.request = model;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, model)));
    }

    public updateTemplate(templateUniqueName: string, model: any): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + INVOICE_API.UPDATE_TEMPLATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':templateUniqueName', encodeURIComponent(templateUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.request = model;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, model)));
    }
}
