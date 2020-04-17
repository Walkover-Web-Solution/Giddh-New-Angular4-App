import { catchError, map } from 'rxjs/operators';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { RecurringInvoice } from '../models/interfaces/RecurringInvoice';
import { RECURRING_VOUCHER_API } from '../models/api-models/recurring-voucher.api';

@Injectable()
export class RecurringVoucherService {

	constructor(private errorHandler: GiddhErrorHandler,
		private _http: HttpWrapperService,
		private _generalService: GeneralService,
		@Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
	}

	public getRecurringVouchers({ filter, page, count }) {
		const companyUniqueName = this._generalService.companyUniqueName;
		if (filter) {
			return this._http.post(this.config.apiUrl + RECURRING_VOUCHER_API.GET
				.replace('{{companyname}}', companyUniqueName)
				.replace(':sort', filter.sort.toString())
				.replace(':sortBy', filter.sortBy.toString())
				.replace(':page', page.toString())
				.replace(':count', count.toString()
				), filter).pipe(map((res) => {
					let data: BaseResponse<RecurringInvoice[], string> = res;
					data.queryString = {};
					return data;
				}), catchError((e) => this.errorHandler.HandleCatch<RecurringInvoice[], string>(e)));
		}
		return this._http.get(this.config.apiUrl + RECURRING_VOUCHER_API.GET
			.replace('{{companyname}}', companyUniqueName)
			.replace(':page', page.toString())
			.replace(':count', count.toString())).pipe(map((res) => {
				let data: BaseResponse<RecurringInvoice[], string> = res;
				data.queryString = {};
				return data;
			}), catchError((e) => this.errorHandler.HandleCatch<RecurringInvoice[], string>(e)));
	}

	public createRecurringVouchers(model: RecurringInvoice) {
		const companyUniqueName = this._generalService.companyUniqueName;
		return this._http.post(this.config.apiUrl + RECURRING_VOUCHER_API.CREATE
			.replace('{{companyname}}', companyUniqueName), model).pipe(map((res) => {
				let data: BaseResponse<RecurringInvoice, string> = res;
				data.queryString = {};
				return data;
			}), catchError((e) => this.errorHandler.HandleCatch<RecurringInvoice, string>(e)));
	}

	public updateRecurringVouchers(model: RecurringInvoice) {
		const companyUniqueName = this._generalService.companyUniqueName;
		const req = {
			duration: model.duration,
			nextCronDate: model.nextCronDate,
			cronEndDate: model.cronEndDate
		};
		return this._http.patch(this.config.apiUrl + RECURRING_VOUCHER_API.UPDATE
			.replace('{{companyname}}', companyUniqueName)
			.replace('{{uniqueName}}', model.uniqueName), req).pipe(
				map((res) => {
					let data: BaseResponse<RecurringInvoice, string> = res;
					data.queryString = {};
					return data;
				}), catchError((e) => this.errorHandler.HandleCatch<RecurringInvoice, string>(e)));
	}

	public deleteRecurringVouchers(id: string) {
		const companyUniqueName = this._generalService.companyUniqueName;
		return this._http.delete(this.config.apiUrl + RECURRING_VOUCHER_API.DELETE
			.replace('{{companyname}}', companyUniqueName)
			.replace('{{uniqueName}}', id)).pipe(map((res) => {
				let data: BaseResponse<string, string> = res;
				data.queryString = {};
				data.request = id;
				return data;
			}), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
	}
}
