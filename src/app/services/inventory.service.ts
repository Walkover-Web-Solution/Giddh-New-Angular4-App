import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { INVENTORY_API } from './apiurls/inventory.api';
import { StockGroupRequest, StockGroupResponse } from '../models/api-models/Inventory';
import { GroupsWithStocksFlatten } from '../models/api-models/GroupsWithStocks';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { HandleCatch } from './catchManager/catchmanger';

@Injectable()
export class InventoryService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(public _http: HttpWrapperService,
    public _router: Router,
    private store: Store<AppState>
  ) {
  }

  public CreateStockGroup(model: StockGroupRequest): Observable<BaseResponse<StockGroupResponse, StockGroupRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.post(INVENTORY_API.CREATE_STOCK_GROUP.replace(':companyUniqueName', this.companyUniqueName), model).map((res) => {
      let data: BaseResponse<StockGroupResponse, StockGroupRequest> = res.json();
      data.request = model;
      return data;
    }).catch((e) => HandleCatch<StockGroupResponse, StockGroupRequest>(e, model));
  }

  public GetGroupsWithStocksFlatten(q: string = '', page: number = 1, count: number = null): Observable<BaseResponse<GroupsWithStocksFlatten, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(INVENTORY_API.GROUPS_WITH_STOCKS_FLATTEN.replace(':companyUniqueName', this.companyUniqueName).replace(':q', q).replace(':page', page.toString()).replace(':count', count.toString())).map((res) => {
      let data: BaseResponse<GroupsWithStocksFlatten, string> = res.json();
      data.request = '';
      data.queryString = { q, page, count };
      return data;
    }).catch((e) => HandleCatch<GroupsWithStocksFlatten, string>(e, '', { q, page, count }));
  }
}
