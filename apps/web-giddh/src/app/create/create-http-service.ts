import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from '../services/httpWrapper.service';
import { IServiceConfigArgs, ServiceConfig } from '../services/service.config';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { Observable } from 'rxjs';
import { GiddhErrorHandler } from '../services/catchManager/catchmanger';

@Injectable()
export class CreateHttpService {
	constructor(
		public _http: HttpWrapperService,
		@Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs,
		private errorHandler: GiddhErrorHandler) {
		//
	}

	public Generate(data: any): Observable<BaseResponse<any, any>> {
		return this._http.post(this.config.apiUrl + 'invoices', data).pipe(map((res) => {
			return res;
		}), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
	}

	// public MapEledgerTransaction(model: EledgerMapRequest, accountUniqueName: string, transactionId: string): Observable<BaseResponse<string, EledgerMapRequest>> {
	//   this.user = this._generalService.user;
	//   this.companyUniqueName = this._generalService.companyUniqueName;
	//   return this._http.put(this.config.apiUrl + ELEDGER_API.MAP.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':transactionId', transactionId), model)
	//     .map((res) => {
	//       let data: BaseResponse<string, EledgerMapRequest> = res;
	//       data.request = model;
	//       data.queryString = {accountUniqueName, transactionId};
	//       return data;
	//     })
	//     .catch((e) => this.errorHandler.HandleCatch<string, EledgerMapRequest>(e, model, {accountUniqueName, transactionId}));
	// }
}
