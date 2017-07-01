import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { INVENTORY_API } from './apiurls/inventory.api';
import { StockGroupRequest, StockGroupResponse, StockUnitResponse } from '../models/api-models/Inventory';
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
              private store: Store<AppState>) {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
  }

  public CreateStockGroup(model: StockGroupRequest): Observable<BaseResponse<StockGroupResponse, StockGroupRequest>> {
    return this._http.post(INVENTORY_API.CREATE_STOCK_GROUP.replace(':companyUniqueName', this.companyUniqueName), model).map((res) => {
      let data: BaseResponse<StockGroupResponse, StockGroupRequest> = res.json();
      data.request = model;
      return data;
    }).catch((e) => HandleCatch<StockGroupResponse, StockGroupRequest>(e, model));
  }

  public getStockUnits(): Observable<BaseResponse<StockUnitResponse[], string>> {
    return this._http.get(INVENTORY_API.STOCK_UNITS.replace(':companyUniqueName', this.companyUniqueName))
      .map((res) => {
        let data: BaseResponse<StockUnitResponse[], string> = res.json();
        data.request = this.companyUniqueName;
        return data;
      })
      .catch((e) => HandleCatch<StockUnitResponse[], string>(e, this.companyUniqueName));
  }
}
