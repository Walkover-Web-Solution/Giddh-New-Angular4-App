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

    /**
     * This will use for save stock transaction report columns
     *
     * @param {*} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof CommonService
     */
    public saveSelectedTableColumns(model: any): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + COMMON_API.MODULE_WISE_COLUMNS;
        url = url?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))?.replace(':module', model.module);
        return this.http.post(url, model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
    * This will use for get selected  columns data
    *
    * @param {string} module
    * @return {*}  {Observable<BaseResponse<any, string>>}
    * @memberof CommonService
    */
    public getSelectedTableColumns(module: string): Observable<BaseResponse<any, string>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + COMMON_API.MODULE_WISE_COLUMNS?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))?.replace(':module', module)).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', {})));
    }

    /**
     * Uploads file
     *
     * @param {*} postRequest
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof CommonService
     */
    public uploadFile(postRequest: any, addVoucherVersion: boolean = false): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.UPLOAD_FILE?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));

        const formData: FormData = new FormData();
        formData.append('file', postRequest.file, postRequest.fileName);

        if (postRequest.entries) {
            formData.append('entries', postRequest.entries);
        }

        if (addVoucherVersion && this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }

        return this.http.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    /**
     * Uploads image
     *
     * @param {*} postRequest
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof CommonService
     */
    public uploadImage(postRequest: any): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.UPLOAD_IMAGE?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));

        const formData: FormData = new FormData();
        formData.append('file', postRequest.file, postRequest.fileName);

        return this.http.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    /**
     * Uploads base64 image
     *
     * @param {*} postRequest
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof CommonService
     */
    public uploadImageBase64(postRequest: any): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.UPLOAD_IMAGE?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));
        return this.http.post(url, postRequest).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    /**
     * This will be use for get Barcode Scan Data
     *
     * @param {string} uniqueName
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof CommonService
     */
    public getBarcodeScanData(barcodeValue: string, model: any): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.BARCODE_SCAN;
        url = url?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));
        url = url?.replace(':barcode', barcodeValue);
        url = url?.replace(':customerUniqueName', model.customerUniqueName);
        url = url?.replace(':invoiceType', model.invoiceType);
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<CountryResponse, any> = res;
                data.queryString = { model };
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    public getCountryStates(country: string): Observable<any> {
        let url = this.config.apiUrl + 'country/' + country;
        return this.http.get(url).pipe(map((res) => {
            let data = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch(e)));
    }

    /**
     * This will be use for gst information details
     *
     * @param {*} gstin
     * @return {*}  {Observable<BaseResponse<any, string>>}
     * @memberof CommonService
     */
    public getGstInformationDetails(gstin: any): Observable<BaseResponse<any, string>> {
        return this.http.get(this.config.apiUrl + COMMON_API.GST_INFORMATION?.replace(':gstin', gstin)).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', {})));
    }
}
