import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Configuration, URLS } from '../app.constants';
import { Router } from '@angular/router';
import { HttpWrapperService } from './httpWrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { HandleCatch } from './catchManager/catchmanger';
import { AppState } from '../store/roots';
import { DASHBOARD_API } from './apiurls/dashboard.api';
import { DashboardResponse, GroupHistoryResponse, GroupHistoryRequest, ClosingBalanceResponse } from '../models/api-models/Dashboard';

@Injectable()
export class DashboardService {
  private companyUniqueName: string;
  private user: UserDetails;
  
  constructor(public _http: HttpWrapperService, public _router: Router, private store: Store<AppState>) {
  }

  public Dashboard(fromDate :string = '', toDate: string = '', interval: string = 'monthly', refresh: boolean = false): Observable<BaseResponse<DashboardResponse, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(DASHBOARD_API.DASHBOARD.replace(':companyUniqueName', this.companyUniqueName).replace(':fromDate', fromDate).replace(':toDate', toDate).replace(':interval', interval).replace(':refresh', refresh.toString())).map((res) => {
      let data: BaseResponse<DashboardResponse, string> = res.json();
      data.queryString = { fromDate, toDate, interval, refresh };
      data.request = '';
      return data;
    }).catch((e) => HandleCatch<DashboardResponse, string>(e, '', { fromDate, toDate, interval, refresh }));
  }

  public GetGroupHistory(model: GroupHistoryRequest, fromDate: string = '', toDate: string = '', interval: string = 'monthly', refresh: boolean = false): Observable<BaseResponse<GroupHistoryResponse, GroupHistoryRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.post(DASHBOARD_API.GROUP_HISTORY.replace(':companyUniqueName', this.companyUniqueName).replace(':fromDate', fromDate).replace(':toDate', toDate).replace(':interval', interval).replace(':refresh', refresh.toString()), model).map((res) => {
      let data: BaseResponse<GroupHistoryResponse, GroupHistoryRequest> = res.json();
      data.request = model;
      data.queryString = { fromDate, toDate, interval, refresh };
      return data;
    }).catch((e) => HandleCatch<GroupHistoryResponse, GroupHistoryRequest>(e, model, { fromDate, toDate, interval, refresh }));
  }

  public GetClosingBalance(groupUniqueName: string = '', fromDate: string = '', toDate: string = '',  refresh: boolean = false): Observable<BaseResponse<ClosingBalanceResponse, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(DASHBOARD_API.CLOSING_BALANCE.replace(':companyUniqueName', this.companyUniqueName).replace(':fromDate', fromDate).replace(':toDate', toDate).replace(':groupUniqueName', groupUniqueName).replace(':refresh', refresh.toString())).map((res) => {
      let data: BaseResponse<ClosingBalanceResponse, string> = res.json();
      data.queryString = { fromDate, toDate, groupUniqueName, refresh };
      data.request = '';
      return data;
    }).catch((e) => HandleCatch<ClosingBalanceResponse, string>(e, '', { fromDate, toDate, groupUniqueName, refresh }));
  }

}
