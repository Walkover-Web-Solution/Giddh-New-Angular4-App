import { map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { COMMON_API } from './apiurls/common.api';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { CountryRequest, CountryResponse, CallingCodesResponse, OnboardingFormRequest, OnboardingFormResponse } from '../models/api-models/Common';
import { HttpWrapperService } from "./httpWrapper.service";
import { Observable } from "rxjs";

@Injectable()
export class CommonService {
    constructor(private http: HttpWrapperService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        
    }

    public GetCountry(request: CountryRequest): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.COUNTRY;
        url = url.replace(':formName', request.formName);
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<CountryResponse, any> = res;
                return data;
            }));
    }

    public GetCallingCodes(): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.CALLING_CODES;
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<CallingCodesResponse, any> = res;
                return data;
            }));
    }

    public getOnboardingForm(request: OnboardingFormRequest): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.FORM;
        url = url.replace(':formName', request.formName);
        url = url.replace(':country', request.country);
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<OnboardingFormResponse, any> = res;
                return data;
            }));
    }
    
    public GetPartyType(): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.PARTY_TYPE;
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }));
    }
}
