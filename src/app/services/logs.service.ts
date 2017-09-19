import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { LOGS_API } from './apiurls/logs.api';
import { LogsRequest, LogsResponse } from '../models/api-models/Logs';

@Injectable()
export class LogsService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(private errorHandler: ErrorHandler, public _http: HttpWrapperService, public _router: Router, private store: Store<AppState>) {
  }

  /**
   * get transactions
   */
  public GetAuditLogs(model: LogsRequest, page: number = 1): Observable<BaseResponse<LogsResponse, LogsRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    return this._http.post(LOGS_API.AUDIT_LOGS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':page', page.toString()), model)
      .map((res) => {
        let data: BaseResponse<LogsResponse, LogsRequest> = res.json();
        data.request = model;
        data.queryString = { page };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<LogsResponse, LogsRequest>(e, model, { page }));
  }
}
