import { map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { COMMON_API } from './apiurls/common.api';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { UserDetails } from "../models/api-models/loginModels";
import { CountryRequest, CountryResponse, CurrencyResponse, CallingCodesResponse, OnboardingFormRequest, OnboardingFormResponse } from '../models/api-models/Common';
import { ErrorHandler } from "./catchManager/catchmanger";
import { HttpWrapperService } from "./httpWrapper.service";
import { Observable } from "rxjs";

@Injectable()
export class CommonService {
    private user: UserDetails;

    constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService, private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this.user = this._generalService.user;
    }

    public GetCountry(request: CountryRequest): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.COUNTRY;
        url = url.replace(':formName', request.formName);
        return this._http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<CountryResponse, any> = res;
                return data;
            }));
    }

    public GetCurrency(): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.CURRENCY;
        return this._http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<CurrencyResponse, any> = res;
                return data;
            }));
    }

    public GetCallingCodes(): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.CALLING_CODES;
        return this._http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<CallingCodesResponse, any> = res;
                return data;
            }));
    }

    public getOnboardingForm(request: OnboardingFormRequest): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.FORM;
        url = url.replace(':formName', request.formName);
        url = url.replace(':country', request.country);
        return this._http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<OnboardingFormResponse, any> = res;
                return data;
            }));
    }
    public GetPartyType(): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.PARTY_TYPE;
        return this._http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }));
    }
}
