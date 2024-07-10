import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './http-wrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { COMPANY_API } from './apiurls/company.api';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { ITaxAuthority } from '../models/interfaces/tax.interface';
import { CreateTaxAuthority, SalesTaxReport, SalesTaxReportRequest } from '../theme/tax-authority/utility/tax-authority.const';

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

    /**
     * Create Tax Authority
     *
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsTaxesService
     */
    public CreateTaxAuthority(model: CreateTaxAuthority): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + COMPANY_API.CREATE_TAX_AUTHORITY
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            , model
        ).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }));
    }

    /**
     * Update Tax Authority
     *
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsTaxesService
     */
    public UpdateTaxAuthority(model: ITaxAuthority, uniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.patch(this.config.apiUrl + COMPANY_API.UPDATE_TAX_AUTHORITY
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':uniqueName', encodeURIComponent(uniqueName))
            , model
        ).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }));
    }

    /**
    * Delete Tax Authority
    *
    * @returns {Observable<BaseResponse<any, any>>}
    * @memberof SettingsTaxesService
    */
    public DeleteTaxAuthority(uniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + COMPANY_API.DELETE_TAX_AUTHORITY
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':uniqueName', encodeURIComponent(uniqueName))
        ).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }));
    }

    /**
     * Get or Export Sale Tax Report -  Tax Authority wise / Tax wise / Account wise
     *
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsTaxesService
     */
    public GetExportSaleTaxReport(reportType: string, params: SalesTaxReportRequest, isExport: boolean = false): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let apiUrl = this.config.apiUrl;
        switch (reportType) {
            case SalesTaxReport.TaxAuthorityWise: apiUrl +=
                (isExport ? COMPANY_API.EXPORT_SALES_TAX_AUTHORITY_WISE_REPORT : COMPANY_API.GET_SALES_TAX_AUTHORITY_WISE_REPORT)
                break;
            case SalesTaxReport.TaxWise: apiUrl +=
                (isExport ? COMPANY_API.EXPORT_SALES_TAX_WISE_REPORT : COMPANY_API.GET_SALES_TAX_WISE_REPORT)
                ?.replace(':taxAuthorityUniqueName', encodeURIComponent(params?.taxAuthorityUniqueName))
                break;
            case SalesTaxReport.AccountWise: apiUrl +=
                (isExport ? COMPANY_API.EXPORT_SALES_ACCOUNT_WISE_REPORT : COMPANY_API.GET_SALES_TAX_ACCOUNT_WISE_REPORT)
                ?.replace(':taxAuthorityUniqueName', encodeURIComponent(params?.taxAuthorityUniqueName))
                ?.replace(':taxUniqueName', encodeURIComponent(params?.taxUniqueName))
                break;
        }
        return this.http.get(apiUrl
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':taxNumber', encodeURIComponent(params?.taxNumber))
            ?.replace(':count', encodeURIComponent(params?.count))
            ?.replace(':page', encodeURIComponent(params?.page))
            ?.replace(':from', encodeURIComponent(params?.from))
            ?.replace(':to', encodeURIComponent(params?.to))
        ).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }));
    }

}
