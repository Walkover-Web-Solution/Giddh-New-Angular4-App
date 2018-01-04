import { Injectable, Optional, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { ELEDGER_API } from './apiurls/eledger.api';
import { EledgerMapRequest, EledgerResponse } from '../models/api-models/Eledger';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';

@Injectable()
export class EledgerService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(private errorHandler: ErrorHandler, public _http: HttpWrapperService, public _router: Router,
              private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }

  /*
  * Eledger get transactions
  * Response will be an array of EledgerResponse in body
  * refresh is optional
  * conditional making url
  */
  public GetEledgerTransactions(accountUniqueName: string, refresh: boolean = false): Observable<BaseResponse<EledgerResponse[], string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    let URL = this.config.apiUrl + ELEDGER_API.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName));
    if (refresh) {
      URL = URL + '?refresh=true';
    }
    return this._http.get(URL).map((res) => {
      let data: BaseResponse<EledgerResponse[], string> = res;
      data.queryString = {accountUniqueName, refresh};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<EledgerResponse[], string>(e, '', {accountUniqueName, refresh}));
  }

  /*
  * Trash Eledger transaction
  * Response will be string in body
  */
  public TrashEledgerTransaction(accountUniqueName: string, transactionId: string): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + ELEDGER_API.TRASH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':transactionId', transactionId)).map((res) => {
      let data: BaseResponse<string, string> = res;
      data.queryString = {accountUniqueName, transactionId};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, string>(e, '', {accountUniqueName, transactionId}));
  }

  /*
  * Map Eledger transaction
  * Response will be string in body
  */
  public MapEledgerTransaction(model: EledgerMapRequest, accountUniqueName: string, transactionId: string): Observable<BaseResponse<string, EledgerMapRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + ELEDGER_API.MAP.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':transactionId', transactionId), model)
      .map((res) => {
        let data: BaseResponse<string, EledgerMapRequest> = res;
        data.request = model;
        data.queryString = {accountUniqueName, transactionId};
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, EledgerMapRequest>(e, model, {accountUniqueName, transactionId}));
  }

}
