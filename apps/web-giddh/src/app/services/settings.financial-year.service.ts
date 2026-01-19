import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpWrapperService } from './http-wrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { SETTINGS_FINANCIAL_YEAR_API } from './apiurls/settings.financial-year.api';
import { ActiveFinancialYear } from '../models/api-models/Company';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { get } from '../lodash-optimized';

/**
 * ILockFinancialYearRequest interface definition
 * Defines the structure and contract for ILockFinancialYearRequest objects
 */
export interface ILockFinancialYearRequest {
    lockAll: boolean;
    uniqueName: string;
}

/**
 * IFinancialYearResponse interface definition
 * Defines the structure and contract for IFinancialYearResponse objects
 */
export interface IFinancialYearResponse {
    companyName: string;
    companyUniqueName: string;
    financialYears: ActiveFinancialYear[];
    financialYearPeriod: string;
}

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * SettingsFinancialYearService service
 * Provides settingsfinancialyear related business logic and data operations
 */
export class SettingsFinancialYearService {
    private companyUniqueName: string;

    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /*
    * Get All Financial Years
    * API: 'company/:companyUniqueName/financial-year'
    * Method: GET
    */
    /**
     * Handles GetAllFinancialYears functionality
     */
    public GetAllFinancialYears(): Observable<BaseResponse<IFinancialYearResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        /**
         * Handles if functionality
         */
        if (this.companyUniqueName) {
            return this.http.get(this.config.apiUrl + SETTINGS_FINANCIAL_YEAR_API.GET_ALL_FINANCIAL_YEARS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
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
    /**
     * Handles LockFinancialYear functionality
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
    /**
     * Handles UnlockFinancialYear functionality
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
    /**
     * Handles AddFinancialYear functionality
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
    /**
     * Handles UpdateFinancialYearPeriod functionality
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
    /**
     * Handles addFutureFinancialYear functionality
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
        return this.http.get(this.config.apiUrl + SETTINGS_FINANCIAL_YEAR_API.GET_FINANCIAL_YEAR_LIMITS?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)), false, options).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }
}
