import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { CreateDiscountRequest, IDiscountList } from '../models/api-models/SettingsDiscount';
import { SETTINGS_DISCOUNT_API } from './apiurls/settings.discount';

@Injectable()
export class SettingsDiscountService {

    private user: UserDetails;
    private companyUniqueName: string;

    constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
        private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * Get Discount
     */
    public GetDiscounts(): Observable<BaseResponse<IDiscountList[], string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + SETTINGS_DISCOUNT_API.COMMON.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<IDiscountList[], string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<IDiscountList[], string>(e, '')));
    }

    /**
     * Create Discount
     */
    public CreateDiscount(model: CreateDiscountRequest): Observable<BaseResponse<IDiscountList, CreateDiscountRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + SETTINGS_DISCOUNT_API.COMMON
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)),
            model).pipe(map((res) => {
                let data: BaseResponse<IDiscountList, CreateDiscountRequest> = res;
                data.request = model;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<IDiscountList, CreateDiscountRequest>(e, model)));
    }

    /**
     * Update Discount
     */
    public UpdateDiscount(model: CreateDiscountRequest, uniqueName: string): Observable<BaseResponse<IDiscountList, CreateDiscountRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + SETTINGS_DISCOUNT_API.PUT
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':discountUniqueName', encodeURIComponent(uniqueName)), model).pipe(map((res) => {
                let data: BaseResponse<IDiscountList, CreateDiscountRequest> = res;
                data.request = model;
                data.queryString = uniqueName;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<IDiscountList, CreateDiscountRequest>(e, model)));
    }

    /**
     * Delete Discount
     */
    public DeleteDiscount(uniqueName: string): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.delete(this.config.apiUrl + SETTINGS_DISCOUNT_API.COMMON.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)) + '/' + uniqueName).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = uniqueName;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, uniqueName)));
    }
}
