import { Optional, Inject, Injectable } from '@angular/core';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { HttpWrapperService } from './httpWrapper.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';
import { GeneralService } from './general.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { catchError, map } from 'rxjs/operators';
import { ECOMMERCE_API } from './apiurls/ecommerce.api';

@Injectable()
export class EcommerceService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * API call to confirm shopify is integrated or not
     *
     * @param {*} model request body
     * @param {string} ecommerceUniqueName ecommerce unique name
     * @returns return API response
     * @memberof EcommerceService
     */
    public isShopifyConnected(model: any, ecommerceUniqueName: string): any {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + ECOMMERCE_API.SHOPIFY_VERIFY?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':ecommerceUniqueName', ecommerceUniqueName), model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * This will send the email
     *
     * @param {*} model
     * @returns {*}
     * @memberof EcommerceService
     */
    public sendEmail(model: any): any {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + ECOMMERCE_API.SEND_EMAIL?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }
}
