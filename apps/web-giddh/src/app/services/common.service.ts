import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { COMMON_API } from './apiurls/common.api';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { CountryRequest, CountryResponse, CallingCodesResponse, OnboardingFormRequest, OnboardingFormResponse } from '../models/api-models/Common';
import { HttpWrapperService } from "./http-wrapper.service";
import { Observable } from "rxjs";
import { GeneralService } from './general.service';
import { GiddhErrorHandler } from './catchManager/catchmanger';

@Injectable()
export class CommonService {
    constructor(private http: HttpWrapperService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs, private generalService: GeneralService, private errorHandler: GiddhErrorHandler) {

    }

    public GetCountry(request: CountryRequest): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.COUNTRY;
        url = url?.replace(':formName', request.formName);
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
        url = url?.replace(':formName', request.formName);
        url = url?.replace(':country', request.country);
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

    /**
     * Download files
     *
     * @param {*} model
     * @param {string} downloadOption
     * @param {string} [fileType="base64"]
     * @returns {Observable<any>}
     * @memberof CommonService
     */
    public downloadFile(model: any, downloadOption: string, fileType: string = "base64"): Observable<any> {
        let url = this.config.apiUrl + COMMON_API.DOWNLOAD_FILE
            ?.replace(':fileType', fileType)
            ?.replace(':downloadOption', downloadOption)
            ?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));

        let responseType = (fileType === "base64") ? {} : { responseType: 'blob' };

        return this.http.post(url, model, responseType).pipe(
            map((res) => {
                return res;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e))
        );
    }

    /**
     * Stock Units for GST Filing
     *
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof CommonService
     */
    public getStockUnits(): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.STOCK_UNITS;
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }));
    }

    /**
     * GST Mapped Units for GST Filing
     *
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof CommonService
     */
    public getGstUnits(): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.GST_STOCK_UNITS;
        let companyUniqueName = this.generalService.companyUniqueName;
        url = url?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }));
    }

    /**
     * This will use for patch mapped gst unit 
     *
     * @param {*} params
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof CommonService
     */
    public updateStockUnits(params: any): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        const contextPath = COMMON_API.GST_STOCK_UNITS?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        return this.http.patch(this.config.apiUrl + contextPath, params).pipe(
            map((response) => {
                let data: BaseResponse<any, any> = response;
                data.request = params;
                return data;
            }), catchError((error) => this.errorHandler.HandleCatch<any, any>(error, params)));
    }
}
