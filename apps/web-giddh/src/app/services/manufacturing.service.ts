import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { MANUFACTURING_API } from './apiurls/manufacturing.api';
import { ICommonResponseOfManufactureItem, IManufacturingItemRequest, IManufacturingUnqItemObj, IMfStockSearchRequest } from '../models/interfaces/manufacturing.interface';
import { StocksResponse } from '../models/api-models/Inventory';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class ManufacturingService {

	private user: UserDetails;
	private companyUniqueName: string;

	constructor(private errorHandler: GiddhErrorHandler, private _http: HttpWrapperService, private _generalService: GeneralService,
		@Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
	}

	/**
	 * get manufacturing item details
	 * URL:: company/:companyUniqueName/stock/:stockUniqueName/manufacture/:manufacturingUniqueName
	 */
	public GetManufacturingItem(model: IManufacturingUnqItemObj): Observable<BaseResponse<ICommonResponseOfManufactureItem, string>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.get(this.config.apiUrl + MANUFACTURING_API.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockUniqueName', encodeURIComponent(model.stockUniqueName)).replace(':manufacturingUniqueName', model.manufacturingUniqueName)).pipe(
			map((res) => {
				let data: BaseResponse<ICommonResponseOfManufactureItem, string> = res;
				data.queryString = model;
				return data;
			}),
			catchError((e) => this.errorHandler.HandleCatch<ICommonResponseOfManufactureItem, string>(e, '')));
	}

	/**
	 * create manufacturing item
	 * URL:: company/:companyUniqueName/stock/:stockUniqueName/manufacture
	 * get resuest model and stock uniquename
	 */
	public CreateManufacturingItem(model: IManufacturingItemRequest, stockUniqueName: string): Observable<BaseResponse<ICommonResponseOfManufactureItem, IManufacturingItemRequest>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.post(this.config.apiUrl + MANUFACTURING_API.CREATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockUniqueName', encodeURIComponent(stockUniqueName)), model).pipe(map((res) => {
			let data: BaseResponse<ICommonResponseOfManufactureItem, IManufacturingItemRequest> = res;
			data.request = model;
			data.queryString = { stockUniqueName };
			return data;
		}), catchError((e) => this.errorHandler.HandleCatch<ICommonResponseOfManufactureItem, IManufacturingItemRequest>(e, model)));
	}

	/**
	 * Update manufacturing item
	 * URL:: company/:companyUniqueName/stock/:stockUniqueName/manufacture/:manufacturingUniqueName
	 */
	public UpdateManufacturingItem(model: IManufacturingItemRequest, reqModal: IManufacturingUnqItemObj): Observable<BaseResponse<ICommonResponseOfManufactureItem, IManufacturingItemRequest>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.put(this.config.apiUrl + MANUFACTURING_API.UPDATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockUniqueName', reqModal.stockUniqueName).replace(':manufacturingUniqueName', reqModal.manufacturingUniqueName), model).pipe(map((res) => {
			let data: BaseResponse<ICommonResponseOfManufactureItem, IManufacturingItemRequest> = res;
			data.request = model;
			data.queryString = reqModal;
			return data;
		}), catchError((e) => this.errorHandler.HandleCatch<ICommonResponseOfManufactureItem, IManufacturingItemRequest>(e, model)));
	}

	/**
	 * Delete manufacturing item
	 * URL:: company/:companyUniqueName/stock/:stockUniqueName/manufacture/:manufacturingUniqueName
	 */
	public DeleteManufacturingItem(model: IManufacturingUnqItemObj): Observable<BaseResponse<string, string>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.delete(this.config.apiUrl + MANUFACTURING_API.DELETE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockUniqueName', encodeURIComponent(model.stockUniqueName)).replace(':manufacturingUniqueName', model.manufacturingUniqueName)).pipe(map((res) => {
			let data: BaseResponse<string, string> = res;
			data.request = '';
			data.queryString = { model };
			return data;
		}), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '', { model })));
	}

	/**
	 * get manufacturing report details
	 * URL:: company/:companyUniqueName/stock/manufacture-report
	 */
	public GetMfReport(model: IMfStockSearchRequest): Observable<BaseResponse<StocksResponse, IMfStockSearchRequest>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		// create url conditionally
		let url = this.config.apiUrl + MANUFACTURING_API.MF_REPORT;
		if ((model.product)) {
			url = url + 'product=' + model.product + '&';
		}
		if ((model.searchBy)) {
			url = url + 'searchBy=' + model.searchBy + '&';
		}
		if ((model.searchOperation)) {
			url = url + 'searchOperation=' + model.searchOperation + '&';
		}
		if ((model.searchValue)) {
			url = url + 'searchValue=' + model.searchValue + '&';
		}
		if ((model.from)) {
			url = url + 'from=' + model.from + '&';
		}
		if ((model.to)) {
			url = url + 'to=' + model.to + '&';
		}
		if ((model.page)) {
			url = url + 'page=' + model.page + '&';
		}
		if ((model.count)) {
			url = url + 'count=' + model.count;
		}

		return this._http.get(url.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(
			map((res) => {
				let data: BaseResponse<StocksResponse, IMfStockSearchRequest> = res;
				data.request = model;
				data.queryString = model;
				return data;
			}),
			catchError((e) => this.errorHandler.HandleCatch<StocksResponse, IMfStockSearchRequest>(e, model)));
	}

	/**
	 * get stock with rate
	 * URL:: /company/:companyUniqueName/stock/:stockUniqueName/link-with-rates
	 */
	public GetStockWithRate(model: IManufacturingUnqItemObj): Observable<BaseResponse<ICommonResponseOfManufactureItem, string>> {
		this.user = this._generalService.user;
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.get(this.config.apiUrl + MANUFACTURING_API.GET_STOCK_WITH_RATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockUniqueName', encodeURIComponent(model.stockUniqueName))).pipe(
			map((res) => {
				let data: BaseResponse<ICommonResponseOfManufactureItem, string> = res;
				data.queryString = model;
				return data;
			}),
			catchError((e) => this.errorHandler.HandleCatch<ICommonResponseOfManufactureItem, string>(e, '')));
	}
}
