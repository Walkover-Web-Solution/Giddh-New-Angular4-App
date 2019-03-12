import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from '../services/httpWrapper.service';
import { IServiceConfigArgs, ServiceConfig } from '../services/service.config';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { Observable } from 'rxjs';
import { ErrorHandler } from '../services/catchManager/catchmanger';
import { CustomTemplateResponse } from 'app/models/api-models/Invoice';

@Injectable()
export class CreateHttpService {
  constructor(
    public _http: HttpWrapperService,
    @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs,
    private errorHandler: ErrorHandler) {
    //
  }

  public Generate(data: any): Observable<BaseResponse<any, any>> {
    return this._http.post(this.config.apiUrl + 'invoices' + '?templateUniqueName=gst_template_a', data).pipe(map((res) => {
      return res;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
  }
 public GetTemplates(): Observable<BaseResponse<any, any>> {
    return this._http.get(this.config.apiUrl + 'templates').pipe(map((res) => {
      return res;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
  }
   public getTemplates(): Observable<BaseResponse<CustomTemplateResponse[], string>> {
    return this._http.get(this.config.apiUrl + 'templates').pipe(map((res: BaseResponse<CustomTemplateResponse[], string>) => {
      let data: BaseResponse<CustomTemplateResponse[], string> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<CustomTemplateResponse[], string>(e, '')));
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
