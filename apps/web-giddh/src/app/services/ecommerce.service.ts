import { UserDetails } from '../models/api-models/loginModels';
import { Optional, Inject, Injectable } from '@angular/core';
import { ErrorHandler } from './catchManager/catchmanger';
import { HttpWrapperService } from './httpWrapper.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';
import { GeneralService } from './general.service';
import { SHOPIFY_API } from './apiurls/shopify.api';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class EcommerceService {

    private user: UserDetails;
    private companyUniqueName: string;

    constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
        private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * API call to confirm shopify is integrated or not
     *
     * @param {*} model request body
     * @param {string} ecommerceUniqueName ecommerce uniqye name
     * @returns return API response
     * @memberof EcommerceService
     */
    public getShopifyEcommerceVerify(model: any, ecommerceUniqueName: string): any {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + SHOPIFY_API.ECOMMERCE_VERIFY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':ecommerceUniqueName', ecommerceUniqueName), model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }
}
