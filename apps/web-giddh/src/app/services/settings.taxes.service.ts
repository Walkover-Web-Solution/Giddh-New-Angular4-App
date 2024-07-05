import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './http-wrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { COMPANY_API } from './apiurls/company.api';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class SettingsTaxesService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService, private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * Create Tax
     */
    public CreateTax(model): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + COMPANY_API.TAX?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * Update Tax
     */
    public UpdateTax(model, taxUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + COMPANY_API.TAX?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)) + '/' + taxUniqueName, model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * Delete Tax
     */
    public DeleteTax(taxUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + COMPANY_API.TAX?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)) + '/' + taxUniqueName).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = taxUniqueName;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, taxUniqueName)));
    }

    /**
     * Get Tax List
     */
    public GetTaxList(countryCode: string): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + COMPANY_API.GET_ALL_TAXES?.replace(':country', encodeURIComponent(countryCode))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }));
    }

    /**
     * Get Tax Authority List
     *
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsTaxesService
     */
    public GetTaxAuthorityList(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + COMPANY_API.GET_ALL_TAX_AUTHORITIES
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
        ).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }));
    }
}
