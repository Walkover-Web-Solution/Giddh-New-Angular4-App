import { StockReportResponse } from '../models/api-models/Inventory';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { INVENTORY_API } from './apiurls/inventory.api';

import {
  CreateStockRequest,
  StockDetailResponse,
  StockGroupRequest,
  StockGroupResponse,
  StockReportRequest,
  StocksResponse,
  StockUnitRequest,
  StockUnitResponse
} from '../models/api-models/Inventory';
import { GroupsWithStocksFlatten, GroupsWithStocksHierarchyMin } from '../models/api-models/GroupsWithStocks';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { HandleCatch } from './catchManager/catchmanger';

@Injectable()
export class InventoryService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(public _http: HttpWrapperService, public _router: Router, private store: Store<AppState>) {
  }

  public CreateStockGroup(model: StockGroupRequest): Observable<BaseResponse<StockGroupResponse, StockGroupRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.post(INVENTORY_API.CREATE_STOCK_GROUP.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
      let data: BaseResponse<StockGroupResponse, StockGroupRequest> = res.json();
      data.request = model;
      return data;
    }).catch((e) => HandleCatch<StockGroupResponse, StockGroupRequest>(e, model));
  }

  /**
   * Update StockGroup
   */
  public UpdateStockGroup(model: StockGroupRequest, stockGroupUniquename: string): Observable<BaseResponse<StockGroupResponse, StockGroupRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.put(INVENTORY_API.UPDATE_STOCK_GROUP.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockGroupUniquename', encodeURIComponent(stockGroupUniquename)), model).map((res) => {
      let data: BaseResponse<StockGroupResponse, StockGroupRequest> = res.json();
      data.request = model;
      data.queryString = { stockGroupUniquename };
      return data;
    }).catch((e) => HandleCatch<StockGroupResponse, StockGroupRequest>(e, model, { stockGroupUniquename }));
  }

  /**
   * Delete StockGroup
   */
  public DeleteStockGroup(stockGroupUniqueName: string): Observable<BaseResponse<string, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.delete(INVENTORY_API.DELETE_STOCK_GROUP.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockGroupUniquename', encodeURIComponent(stockGroupUniqueName))).map((res) => {
      let data: BaseResponse<string, string> = res.json();
      data.request = stockGroupUniqueName;
      data.queryString = { stockGroupUniqueName };
      return data;
    }).catch((e) => HandleCatch<string, string>(e, stockGroupUniqueName, { stockGroupUniqueName }));
  }

  public GetGroupsStock(stockGroupUniqueName: string): Observable<BaseResponse<StockGroupResponse, string>> {
    debugger;
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(INVENTORY_API.GROUPS_STOCKS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName))).map((res) => {
      let data: BaseResponse<StockGroupResponse, string> = res.json();
      data.request = stockGroupUniqueName;
      data.queryString = { stockGroupUniqueName };
      return data;
    }).catch((e) => HandleCatch<StockGroupResponse, string>(e, stockGroupUniqueName, { stockGroupUniqueName }));
  }

  /**
   * get Groups with Stocks
   */
  // public GetGroupsWithStocksFlatten(q: string = '', page: number = 1, count: string = '100000000'): Observable<BaseResponse<GroupsWithStocksFlatten, string>> {
  //   this.store.take(1).subscribe(s => {
  //     if (s.session.user) {
  //       this.user = s.session.user.user;
  //     }
  //     this.companyUniqueName = s.session.companyUniqueName;
  //   });
  //   return this._http.get(INVENTORY_API.GROUPS_WITH_STOCKS_FLATTEN.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':q', encodeURIComponent(q || '').replace(':page', page.toString()).replace(':count', count.toString())).map((res) => {
  //     let data: BaseResponse<GroupsWithStocksFlatten, string> = res.json();
  //     data.request = '';
  //     data.queryString = { q, page, count };
  //     return data;
  //   }).catch((e) => HandleCatch<GroupsWithStocksFlatten, string>(e, '', { q, page, count }));
  // }
  public GetGroupsWithStocksFlatten(): Observable<BaseResponse<GroupsWithStocksHierarchyMin, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(INVENTORY_API.GROUPS_WITH_STOCKS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<GroupsWithStocksHierarchyMin, string> = res.json();
      data.request = '';
      return data;
    }).catch((e) => HandleCatch<GroupsWithStocksHierarchyMin, string>(e, '', {}));
  }

  /**
   * get Stocks
   */
  public GetStocks(): Observable<BaseResponse<StocksResponse, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(INVENTORY_API.STOCKS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<StocksResponse, string> = res.json();
      data.request = '';
      data.queryString = {};
      return data;
    }).catch((e) => HandleCatch<StocksResponse, string>(e, '', {}));
  }

  /**
   * get Stocks with hierarchy
   */
  public GetGroupsWithStocksHierarchyMin(q: string = '', page: number = 1, count: string = ''): Observable<BaseResponse<GroupsWithStocksHierarchyMin, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(INVENTORY_API.GROUPS_WITH_STOCKS_HIERARCHY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':q', encodeURIComponent(q || '')).replace(':page', encodeURIComponent(page.toString())).replace(':count', encodeURIComponent(count.toString()))).map((res) => {
      let data: BaseResponse<GroupsWithStocksHierarchyMin, string> = res.json();
      data.request = '';
      data.queryString = { q, page, count };
      return data;
    }).catch((e) => HandleCatch<GroupsWithStocksHierarchyMin, string>(e, '', { q, page, count }));
  }

  /**
   * Create StockUnit
   */
  public CreateStockUnit(model: StockUnitRequest): Observable<BaseResponse<StockUnitResponse, StockUnitRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.post(INVENTORY_API.CREATE_STOCK_UNIT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
      let data: BaseResponse<StockUnitResponse, StockUnitRequest> = res.json();
      data.request = model;
      return data;
    }).catch((e) => HandleCatch<StockUnitResponse, StockUnitRequest>(e, model));
  }

  /**
   * Update StockUnit
   */
  public UpdateStockUnit(model: StockUnitRequest, uName: string): Observable<BaseResponse<StockUnitResponse, StockUnitRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.put(INVENTORY_API.UPDATE_STOCK_UNIT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':uName', uName), model).map((res) => {
      let data: BaseResponse<StockUnitResponse, StockUnitRequest> = res.json();
      data.request = model;
      data.queryString = { uName };
      return data;
    }).catch((e) => HandleCatch<StockUnitResponse, StockUnitRequest>(e, model, { uName }));
  }

  /**
   * Delete StockUnit
   */
  public DeleteStockUnit(uName: string): Observable<BaseResponse<string, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.delete(INVENTORY_API.DELETE_STOCK_UNIT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':uName', uName)).map((res) => {
      let data: BaseResponse<string, string> = res.json();
      data.request = uName;
      data.queryString = { uName };
      return data;
    }).catch((e) => HandleCatch<string, string>(e, uName, { uName }));
  }

  /**
   * get StockUnits
   */
  public GetStockUnit(): Observable<BaseResponse<StockUnitResponse[], string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(INVENTORY_API.STOCK_UNIT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<StockUnitResponse[], string> = res.json();
      data.request = '';
      data.queryString = {};
      return data;
    }).catch((e) => HandleCatch<StockUnitResponse[], string>(e, '', {}));
  }

  /**
   * Create Stock
   */
  public CreateStock(model: CreateStockRequest, stockGroupUniqueName: string): Observable<BaseResponse<StockDetailResponse, CreateStockRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.post(INVENTORY_API.CREATE_STOCK.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockGroupUniquename', encodeURIComponent(stockGroupUniqueName)), model).map((res) => {
      let data: BaseResponse<StockDetailResponse, CreateStockRequest> = res.json();
      data.request = model;
      data.queryString = { stockGroupUniqueName };
      return data;
    }).catch((e) => HandleCatch<StockDetailResponse, CreateStockRequest>(e, model, { stockGroupUniqueName }));
  }

  /**
   * Update Stock
   */
  public UpdateStock(model: CreateStockRequest, stockGroupUniqueName: string, stockUniqueName: string): Observable<BaseResponse<StockDetailResponse, CreateStockRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.put(INVENTORY_API.UPDATE_STOCK.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockGroupUniquename', encodeURIComponent(stockGroupUniqueName)).replace(':stockUniqueName', encodeURIComponent(stockUniqueName)), model).map((res) => {
      let data: BaseResponse<StockDetailResponse, CreateStockRequest> = res.json();
      data.request = model;
      data.queryString = { stockGroupUniqueName, stockUniqueName };
      return data;
    }).catch((e) => HandleCatch<StockDetailResponse, CreateStockRequest>(e, model, { stockGroupUniqueName, stockUniqueName }));
  }

  /**
   * Delete Stock
   */
  public DeleteStock(stockGroupUniqueName: string, stockUniqueName: string): Observable<BaseResponse<string, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.delete(INVENTORY_API.DELETE_STOCK.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockGroupUniquename', encodeURIComponent(stockGroupUniqueName)).replace(':stockUniqueName', encodeURIComponent(stockUniqueName))).map((res) => {
      let data: BaseResponse<string, string> = res.json();
      data.request = '';
      data.queryString = { stockGroupUniqueName, stockUniqueName };
      return data;
    }).catch((e) => HandleCatch<string, string>(e, '', { stockGroupUniqueName, stockUniqueName }));
  }

  /**
   * get Stockdetails
   */
  public GetStockDetails(stockGroupUniqueName: string, stockUniqueName: string): Observable<BaseResponse<StockDetailResponse, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(INVENTORY_API.STOCK_DETAIL.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockGroupUniquename', encodeURIComponent(stockGroupUniqueName)).replace(':stockUniqueName', encodeURIComponent(stockUniqueName))).map((res) => {
      let data: BaseResponse<StockDetailResponse, string> = res.json();
      data.request = '';
      data.queryString = { stockGroupUniqueName, stockUniqueName };
      return data;
    }).catch((e) => HandleCatch<StockDetailResponse, string>(e, '', { stockGroupUniqueName, stockUniqueName }));
  }

  /**
   * get GetStocksReport
   */
  public GetStocksReport(stockReportRequest: StockReportRequest): Observable<BaseResponse<StockReportResponse, StockReportRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(INVENTORY_API.STOCK_REPORT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':stockGroupUniqueName', encodeURIComponent(stockReportRequest.stockGroupUniqueName))
      .replace(':stockUniqueName', encodeURIComponent(stockReportRequest.stockUniqueName))
      .replace(':from', encodeURIComponent(stockReportRequest.from))
      .replace(':to', encodeURIComponent(stockReportRequest.to))
      .replace(':count', encodeURIComponent(stockReportRequest.count.toString()))
      .replace(':page', encodeURIComponent(stockReportRequest.page.toString())))
      .map((res) => {
        let data: BaseResponse<StockReportResponse, StockReportRequest> = res.json();
        data.request = stockReportRequest;
        data.queryString = {
          stockGroupUniqueName: stockReportRequest.stockGroupUniqueName,
          stockUniqueName: stockReportRequest.stockUniqueName,
          from: stockReportRequest.from,
          to: stockReportRequest.to,
          count: stockReportRequest.count,
          page: stockReportRequest.page
        }
          ;
        return data;
      }).catch((e) => HandleCatch<StockReportResponse, StockReportRequest>(e, stockReportRequest, {
        stockGroupUniqueName: stockReportRequest.stockGroupUniqueName,
        stockUniqueName: stockReportRequest.stockUniqueName,
        from: stockReportRequest.from,
        to: stockReportRequest.to,
        count: stockReportRequest.count,
        page: stockReportRequest.page
      }));
  }

}
