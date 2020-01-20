import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
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

	private user: UserDetails;
	private companyUniqueName: string;

	constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
		private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
	}

	/*
	* Get All Financial Years
	* API: 'company/:companyUniqueName/financial-year'
	* Method: GET
	*/
	public GetAllFinancialYears(): Observable<BaseResponse<IFinancialYearResponse, string>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.get(this.config.apiUrl + SETTINGS_FINANCIAL_YEAR_API.GET_ALL_FINANCIAL_YEARS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
			let data: BaseResponse<IFinancialYearResponse, string> = res;
			data.queryString = {};
			return data;
		}), catchError((e) => this.errorHandler.HandleCatch<IFinancialYearResponse, string>(e)));
	}

	/*
	* Lock Financial Year
	* API: 'company/:companyUniqueName/financial-year-lock'
	* Method: PATCH
	*/
	public LockFinancialYear(reqObj: ILockFinancialYearRequest): Observable<BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.patch(this.config.apiUrl + SETTINGS_FINANCIAL_YEAR_API.LOCK_FINANCIAL_YEAR.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), reqObj).pipe(map((res) => {
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
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.patch(this.config.apiUrl + SETTINGS_FINANCIAL_YEAR_API.UNLOCK_FINANCIAL_YEAR.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), reqObj).pipe(map((res) => {
			let data: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest> = res;
			data.queryString = {};
			return data;
		}), catchError((e) => this.errorHandler.HandleCatch<IFinancialYearResponse, ILockFinancialYearRequest>(e)));
	}

	/*
	* Switch Financial Year
	* API: 'company/:companyUniqueName/financial-year-unlock'
	* Method: PATCH
	*/
	public SwitchFinancialYear(uniqueName: string): Observable<BaseResponse<ActiveFinancialYear, string>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.patch(this.config.apiUrl + SETTINGS_FINANCIAL_YEAR_API.SWITCH_FINANCIAL_YEAR.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), { uniqueName }).pipe(map((res) => {
			let data: BaseResponse<ActiveFinancialYear, string> = res;
			data.queryString = {};
			return data;
		}), catchError((e) => this.errorHandler.HandleCatch<ActiveFinancialYear, string>(e)));
	}

	/*
	* Add Financial Year
	* API: 'company/:companyUniqueName/financial-year'
	* Method: POST
	*/
	public AddFinancialYear(fromYear: string): Observable<BaseResponse<IFinancialYearResponse, string>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.post(this.config.apiUrl + SETTINGS_FINANCIAL_YEAR_API.ADD_FINANCIAL_YEAR.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), { fromYear }).pipe(map((res) => {
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
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.put(this.config.apiUrl + SETTINGS_FINANCIAL_YEAR_API.UPDATE_FY_PERIOD.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), dataToSend).pipe(map((res) => {
			let data: BaseResponse<IFinancialYearResponse, string> = res;
			data.queryString = {};
			return data;
		}), catchError((e) => this.errorHandler.HandleCatch<IFinancialYearResponse, string>(e)));
	}
}
