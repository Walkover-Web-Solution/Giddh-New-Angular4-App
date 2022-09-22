import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { SETTINGS_FINANCIAL_YEAR_API } from './apiurls/settings.financial-year.api';
import { ActiveFinancialYear } from '../models/api-models/Company';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

export interface ILockFinancialYearRequest {
    lockAll: boolean;
    uniqueName: string;
}

export interface IFinancialYearResponse {
    companyName: string;
    companyUniqueName: string;
    financialYears: ActiveFinancialYear[];
}

@Injectable()
export class SettingsFinancialYearService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /*
    * Get All Financial Years
    * API: 'company/:companyUniqueName/financial-year'
    * Method: GET
    */
    public GetAllFinancialYears(): Observable<BaseResponse<IFinancialYearResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        if (this.companyUniqueName) {
            let apiHost = this.generalService.getApiDomain();
            return this.http.get(apiHost + SETTINGS_FINANCIAL_YEAR_API.GET_ALL_FINANCIAL_YEARS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
                let data: BaseResponse<IFinancialYearResponse, string> = res;
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<IFinancialYearResponse, string>(e)));
        } else {
            return of({});
        }
    }

    /*
    * Lock Financial Year
    * API: 'company/:companyUniqueName/financial-year-lock'
    * Method: PATCH
    */
    public LockFinancialYear(reqObj: ILockFinancialYearRequest): Observable<BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.patch(this.config.apiUrl + SETTINGS_FINANCIAL_YEAR_API.LOCK_FINANCIAL_YEAR?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), reqObj).pipe(map((res) => {
            let data: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<IFinancialYearResponse, ILockFinancialYearRequest>(e)));
    }

    /*
    * Unlock Financial Year
    * API: 'company/:companyUniqueName/financial-year-unlock'
    * Method: PATCH
    */
    public UnlockFinancialYear(reqObj: ILockFinancialYearRequest): Observable<BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.patch(this.config.apiUrl + SETTINGS_FINANCIAL_YEAR_API.UNLOCK_FINANCIAL_YEAR?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), reqObj).pipe(map((res) => {
            let data: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<IFinancialYearResponse, ILockFinancialYearRequest>(e)));
    }

    /*
    * Add Financial Year
    * API: 'company/:companyUniqueName/financial-year'
    * Method: POST
    */
    public AddFinancialYear(fromYear: string): Observable<BaseResponse<IFinancialYearResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_FINANCIAL_YEAR_API.ADD_FINANCIAL_YEAR?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), { fromYear }).pipe(map((res) => {
            let data: BaseResponse<IFinancialYearResponse, string> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<IFinancialYearResponse, string>(e)));
    }

    /*
   * Update Financial Year Period
   * API: 'company/:companyUniqueName/financial-year'
   * Method: PUT
   */
    public UpdateFinancialYearPeriod(period: string): Observable<BaseResponse<IFinancialYearResponse, string>> {
        const dataToSend = {
            financialYearPeriod: period
        };
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + SETTINGS_FINANCIAL_YEAR_API.UPDATE_FY_PERIOD?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), dataToSend).pipe(map((res) => {
            let data: BaseResponse<IFinancialYearResponse, string> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<IFinancialYearResponse, string>(e)));
    }

    /*
    * Add Future Financial Year
    * API: 'company/:companyUniqueName/future-financial-year'
    * Method: POST
    */
    public addFutureFinancialYear(fromYear: string): Observable<BaseResponse<IFinancialYearResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_FINANCIAL_YEAR_API.ADD_FUTURE_FINANCIAL_YEAR?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), { fromYear }).pipe(map((res) => {
            let data: BaseResponse<IFinancialYearResponse, string> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<IFinancialYearResponse, string>(e)));
    }

    /**
     * This will get intial and last financial year
     *
     * @returns {Observable<BaseResponse<IFinancialYearResponse, string>>}
     * @memberof SettingsFinancialYearService
     */
    public getFinancialYearLimits(): Observable<BaseResponse<any, any>> {
        let companyUniqueName = this.generalService.companyUniqueName;
        let options = { loader: "hide" };
        let apiHost = this.generalService.getApiDomain();
        return this.http.get(apiHost + SETTINGS_FINANCIAL_YEAR_API.GET_FINANCIAL_YEAR_LIMITS?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)), false, options).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }
}
