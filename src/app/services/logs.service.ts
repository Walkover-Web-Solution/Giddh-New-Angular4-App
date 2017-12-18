import { Injectable, Optional, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { LOGS_API } from './apiurls/logs.api';
import { LogsRequest, LogsResponse } from '../models/api-models/Logs';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';

@Injectable()
export class LogsService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(private errorHandler: ErrorHandler, public _http: HttpWrapperService, public _router: Router,
              private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }

  /**
   * get transactions
   */
  public GetAuditLogs(model: LogsRequest, page: number = 1): Observable<BaseResponse<LogsResponse, LogsRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + LOGS_API.AUDIT_LOGS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':page', page.toString()), model)
      .map((res) => {
        let data: BaseResponse<LogsResponse, LogsRequest> = res.json();
        data.request = model;
        data.queryString = {page};
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<LogsResponse, LogsRequest>(e, model, {page}));
  }
}
