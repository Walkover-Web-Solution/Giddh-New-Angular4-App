import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { SETTINGS_BUNCH_API } from './apiurls/settings.bunch.api';

@Injectable()
export class SettingsBunchService {

	private user: UserDetails;
	private companyUniqueName: string;

	constructor(private errorHandler: GiddhErrorHandler, private _http: HttpWrapperService,
		private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
	}

	/*
	* Get all bunch
	*/
	public GetAllBunches(): Observable<BaseResponse<any, any>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.get(this.config.apiUrl + SETTINGS_BUNCH_API.GET_ALL_BUNCH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
			let data: BaseResponse<any, any> = res;
			data.queryString = {};
			return data;
		}), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
	}

	/*
	* Get bunch
	*/
	public GetBunch(bunchUniqueName: string): Observable<BaseResponse<any, any>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.get(this.config.apiUrl + SETTINGS_BUNCH_API.GET_BUNCH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':bunchUniqueName', encodeURIComponent(bunchUniqueName))).pipe(map((res) => {
			let data: BaseResponse<any, any> = res;
			data.queryString = {};
			return data;
		}), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
	}

	/**
	 * Create Bunch
	 */
	public CreateBunch(model): Observable<BaseResponse<any, any>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.post(this.config.apiUrl + SETTINGS_BUNCH_API.CREATE_BUNCH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
			let data: BaseResponse<any, any> = res;
			data.request = model;
			return data;
		}), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
	}

	/*
	* Remove bunch
	*/
	public RemoveBunch(bunchUniqueName: string): Observable<BaseResponse<any, any>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.delete(this.config.apiUrl + SETTINGS_BUNCH_API.DELETE_BUNCH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':bunchUniqueName', encodeURIComponent(bunchUniqueName))).pipe(map((res) => {
			let data: BaseResponse<any, any> = res;
			data.queryString = {};
			return data;
		}), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
	}

	/*
	  * Update bunch
	  */
	public UpdateBunch(model, bunchUniqueName): Observable<BaseResponse<any, any>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.patch(this.config.apiUrl + SETTINGS_BUNCH_API.UPDATE_BUNCH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':bunchUniqueName', encodeURIComponent(bunchUniqueName)), model).pipe(map((res) => {
			let data: BaseResponse<any, any> = res;
			data.queryString = {};
			return data;
		}), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
	}

	/*
	  * Add Companies to bunch
	  */
	public AddCompanies(model, bunchUniqueName): Observable<BaseResponse<any, any>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		let dataToSend: any = {};
		dataToSend.companyUniqueNames = _.cloneDeep(model);
		dataToSend.bunchUniqueName = _.cloneDeep(bunchUniqueName);
		bunchUniqueName = _.cloneDeep(model);
		return this._http.post(this.config.apiUrl + SETTINGS_BUNCH_API.ADD_COMPANIES.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), dataToSend).pipe(map((res) => {
			let data: BaseResponse<any, any> = res;
			data.queryString = {};
			return data;
		}), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
	}

	/*
	  * Remove Companies from bunch
	  */
	public RemoveCompanies(model, bunchUniqueName): Observable<BaseResponse<any, any>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		let dataToSend: any = {};
		dataToSend.companyUniqueNames = _.cloneDeep(model);
		dataToSend.bunchUniqueName = _.cloneDeep(bunchUniqueName);
		return this._http.patch(this.config.apiUrl + SETTINGS_BUNCH_API.DELETE_COMPANIES_FROM_BUNCH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), dataToSend).pipe(map((res) => {
			let data: BaseResponse<any, any> = res;
			data.queryString = {};
			return data;
		}), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
	}

	/*
	  * Get Companies from bunch
	  */
	public GetCompanies(bunchUniqueName): Observable<BaseResponse<any, any>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.get(this.config.apiUrl + SETTINGS_BUNCH_API.GET_COMPANIES_FROM_BUNCH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':bunchUniqueName', encodeURIComponent(bunchUniqueName))).pipe(map((res) => {
			let data: BaseResponse<any, any> = res;
			data.queryString = {};
			return data;
		}), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
	}
}
