import { CreateStockRequest, GroupStockReportRequest, GroupStockReportResponse, StockDetailResponse, StockGroupRequest, StockGroupResponse, StockReportRequest, StockReportResponse, StocksResponse, StockUnitRequest, StockUnitResponse } from '../models/api-models/Inventory';
import { Inject, Injectable, Optional } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { INVENTORY_API } from './apiurls/inventory.api';
import { GroupsWithStocksFlatten, GroupsWithStocksHierarchyMin } from '../models/api-models/GroupsWithStocks';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { IGroupsWithStocksHierarchyMinItem } from '../models/interfaces/groupsWithStocks.interface';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { InventoryEntry, InventoryFilter, InventoryReport, InventoryUser } from '../models/api-models/Inventory-in-out';
import { IPaginatedResponse } from '../models/interfaces/paginatedResponse.interface';
import { BranchTransferResponse, LinkedStocksResponse, TransferDestinationRequest, TransferProductsRequest } from '../models/api-models/BranchTransfer';

declare var _: any;

@Injectable()
export class InventoryService {
  private companyUniqueName: string;
  private user: UserDetails;
  private _: any;

  constructor(private errorHandler: ErrorHandler, public _http: HttpWrapperService, public _router: Router,
              private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    this._ = config._;
    _ = config._;
  }

  /**
   * return flatten group list
   * @param rawList array of IGroupsWithStocksHierarchyMinItem
   * @param parents an empty []
   */
  public makeStockGroupsFlatten(rawList: IGroupsWithStocksHierarchyMinItem[], parents) {
    let a = _.map(rawList, (item) => {
      let result;
      if (item.childStockGroups && item.childStockGroups.length > 0) {
        result = this.makeStockGroupsFlatten(item.childStockGroups, []);
        result.push({
          label: item.name,
          value: item.uniqueName
        });
      } else {
        result = {
          label: item.name,
          value: item.uniqueName
        };
      }
      return result;
    });
    return _.flatten(a);
  }

  public CreateStockGroup(model: StockGroupRequest): Observable<BaseResponse<StockGroupResponse, StockGroupRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + INVENTORY_API.CREATE_STOCK_GROUP.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
      let data: BaseResponse<StockGroupResponse, StockGroupRequest> = res;
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<StockGroupResponse, StockGroupRequest>(e, model));
  }

  /**
   * Update StockGroup
   */
  public UpdateStockGroup(model: StockGroupRequest, stockGroupUniquename: string): Observable<BaseResponse<StockGroupResponse, StockGroupRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + INVENTORY_API.UPDATE_STOCK_GROUP.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniquename)), model).map((res) => {
      let data: BaseResponse<StockGroupResponse, StockGroupRequest> = res;
      data.request = model;
      data.queryString = {stockGroupUniquename};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<StockGroupResponse, StockGroupRequest>(e, model, {stockGroupUniquename}));
  }

  /**
   * Delete StockGroup
   */
  public DeleteStockGroup(stockGroupUniqueName: string): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + INVENTORY_API.DELETE_STOCK_GROUP.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName))).map((res) => {
      let data: BaseResponse<string, string> = res;
      data.request = stockGroupUniqueName;
      data.queryString = {stockGroupUniqueName};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, string>(e, stockGroupUniqueName, {stockGroupUniqueName}));
  }

  public GetGroupsStock(stockGroupUniqueName: string): Observable<BaseResponse<StockGroupResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + INVENTORY_API.GROUPS_STOCKS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName))).map((res) => {
      let data: BaseResponse<StockGroupResponse, string> = res;
      data.request = stockGroupUniqueName;
      data.queryString = {stockGroupUniqueName};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<StockGroupResponse, string>(e, stockGroupUniqueName, {stockGroupUniqueName}));
  }

  /**
   * get Groups with Stocks
   */
  public SearchStockGroupsWithStocks(q: string = '', page: number = 1, count: string = '100000000'): Observable<BaseResponse<GroupsWithStocksFlatten, any>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + INVENTORY_API.GROUPS_WITH_STOCKS_FLATTEN.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':q', encodeURIComponent(q || '')).replace(':page', page.toString()).replace(':count', count.toString())).map((res) => {
      let data: BaseResponse<GroupsWithStocksFlatten, string> = res;
      data.request = '';
      data.queryString = {q, page, count};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<GroupsWithStocksFlatten, string>(e, '', {q, page, count}));
  }

  public GetGroupsWithStocksFlatten(): Observable<BaseResponse<GroupsWithStocksHierarchyMin, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + INVENTORY_API.GROUPS_WITH_STOCKS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<GroupsWithStocksHierarchyMin, string> = res;
      data.request = '';
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<GroupsWithStocksHierarchyMin, string>(e, '', {}));
  }

  /**
   * get Stocks
   */
  public GetStocks(companyUniqueName: string = ''): Observable<BaseResponse<StocksResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;

    let cmpUniqueName: string = this.companyUniqueName;

    if (companyUniqueName) {
      cmpUniqueName = companyUniqueName;
    }

    return this._http.get(this.config.apiUrl + INVENTORY_API.STOCKS.replace(':companyUniqueName', encodeURIComponent(cmpUniqueName))).map((res) => {
      let data: BaseResponse<StocksResponse, string> = res;
      data.request = '';
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<StocksResponse, string>(e, '', {}));
  }

  /**
   * GetManufacturingStocks
   */
  public GetManufacturingStocks(): Observable<BaseResponse<StocksResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + INVENTORY_API.MANUFACTURING_STOCKS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<StocksResponse, string> = res;
      data.request = '';
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<StocksResponse, string>(e, '', {}));
  }

  /**
   * GetManufacturingStocks
   */
  public GetManufacturingStocksForCreateMF(): Observable<BaseResponse<StocksResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + INVENTORY_API.CREATE_NEW_MANUFACTURING_STOCKS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<StocksResponse, string> = res;
      data.request = '';
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<StocksResponse, string>(e, '', {}));
  }

  /**
   * get Stocks with hierarchy
   */
  public GetGroupsWithStocksHierarchyMin(q: string = '', page: number = 1, count: string = ''): Observable<BaseResponse<GroupsWithStocksHierarchyMin, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + INVENTORY_API.GROUPS_WITH_STOCKS_HIERARCHY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':q', encodeURIComponent(q || '')).replace(':page', encodeURIComponent(page.toString())).replace(':count', encodeURIComponent(count.toString()))).map((res) => {
      let data: BaseResponse<GroupsWithStocksHierarchyMin, string> = res;
      data.request = '';
      data.queryString = {q, page, count};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<GroupsWithStocksHierarchyMin, string>(e, '', {q, page, count}));
  }

  /**
   * Create StockUnit
   */
  public CreateStockUnit(model: StockUnitRequest): Observable<BaseResponse<StockUnitResponse, StockUnitRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + INVENTORY_API.CREATE_STOCK_UNIT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
      let data: BaseResponse<StockUnitResponse, StockUnitRequest> = res;
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<StockUnitResponse, StockUnitRequest>(e, model));
  }

  /**
   * Update StockUnit
   */
  public UpdateStockUnit(model: StockUnitRequest, uName: string): Observable<BaseResponse<StockUnitResponse, StockUnitRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + INVENTORY_API.UPDATE_STOCK_UNIT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':uName', uName), model).map((res) => {
      let data: BaseResponse<StockUnitResponse, StockUnitRequest> = res;
      data.request = model;
      data.queryString = {uName};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<StockUnitResponse, StockUnitRequest>(e, model, {uName}));
  }

  /**
   * Delete StockUnit
   */
  public DeleteStockUnit(uName: string): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + INVENTORY_API.DELETE_STOCK_UNIT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':uName', uName)).map((res) => {
      let data: BaseResponse<string, string> = res;
      data.request = uName;
      data.queryString = {uName};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, string>(e, uName, {uName}));
  }

  /**
   * get StockUnits
   */
  public GetStockUnit(): Observable<BaseResponse<StockUnitResponse[], string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + INVENTORY_API.STOCK_UNIT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<StockUnitResponse[], string> = res;
      data.request = '';
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<StockUnitResponse[], string>(e, '', {}));
  }

  /**
   * Create Stock
   */
  public CreateStock(model: CreateStockRequest, stockGroupUniqueName: string): Observable<BaseResponse<StockDetailResponse, CreateStockRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = encodeURIComponent(this._generalService.companyUniqueName);
    return this._http.post(this.config.apiUrl + INVENTORY_API.CREATE_STOCK.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName)), model).map((res) => {
      let data: BaseResponse<StockDetailResponse, CreateStockRequest> = res;
      data.request = model;
      data.queryString = {stockGroupUniqueName};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<StockDetailResponse, CreateStockRequest>(e, model, {stockGroupUniqueName}));
  }

  /**
   * Update Stock
   */
  public UpdateStock(model: CreateStockRequest, stockGroupUniqueName: string, stockUniqueName: string): Observable<BaseResponse<StockDetailResponse, CreateStockRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + INVENTORY_API.UPDATE_STOCK.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName)).replace(':stockUniqueName', encodeURIComponent(stockUniqueName)), model).map((res) => {
      let data: BaseResponse<StockDetailResponse, CreateStockRequest> = res;
      data.request = model;
      data.queryString = {stockGroupUniqueName, stockUniqueName};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<StockDetailResponse, CreateStockRequest>(e, model, {stockGroupUniqueName, stockUniqueName}));
  }

  /**
   * Delete Stock
   */
  public DeleteStock(stockGroupUniqueName: string, stockUniqueName: string): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + INVENTORY_API.DELETE_STOCK.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName)).replace(':stockUniqueName', encodeURIComponent(stockUniqueName))).map((res) => {
      let data: BaseResponse<string, string> = res;
      data.request = '';
      data.queryString = {stockGroupUniqueName, stockUniqueName};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, string>(e, '', {stockGroupUniqueName, stockUniqueName}));
  }

  /**
   * get Stockdetails
   */
  public GetStockDetails(stockGroupUniqueName: string, stockUniqueName: string): Observable<BaseResponse<StockDetailResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + INVENTORY_API.STOCK_DETAIL.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName)).replace(':stockUniqueName', encodeURIComponent(stockUniqueName))).map((res) => {
      let data: BaseResponse<StockDetailResponse, string> = res;
      data.request = '';
      data.queryString = {stockGroupUniqueName, stockUniqueName};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<StockDetailResponse, string>(e, '', {stockGroupUniqueName, stockUniqueName}));
  }

  /**
   * get Get-Rate-For-Stoke
   */
  public GetRateForStoke(stockUniqueName: string, model: any): Observable<BaseResponse<any, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + INVENTORY_API.GET_RATE_FOR_STOCK.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockUniqueName', encodeURIComponent(stockUniqueName)), model).map((res) => {
      let data: BaseResponse<any, string> = res;
      data.request = '';
      data.queryString = {stockUniqueName};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<StockDetailResponse, string>(e, '', {stockUniqueName}));
  }

  /**
   * get GetStocksReport
   */
  public GetStocksReport(stockReportRequest: StockReportRequest): Observable<BaseResponse<StockReportResponse, StockReportRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + INVENTORY_API.STOCK_REPORT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':stockGroupUniqueName', encodeURIComponent(stockReportRequest.stockGroupUniqueName))
      .replace(':stockUniqueName', encodeURIComponent(stockReportRequest.stockUniqueName))
      .replace(':from', encodeURIComponent(stockReportRequest.from))
      .replace(':to', encodeURIComponent(stockReportRequest.to))
      .replace(':count', encodeURIComponent(stockReportRequest.count.toString()))
      .replace(':page', encodeURIComponent(stockReportRequest.page.toString())))
      .map((res) => {
        let data: BaseResponse<StockReportResponse, StockReportRequest> = res;
        data.request = stockReportRequest;
        data.queryString = {
          stockGroupUniqueName: stockReportRequest.stockGroupUniqueName,
          stockUniqueName: stockReportRequest.stockUniqueName,
          from: stockReportRequest.from,
          to: stockReportRequest.to,
          count: stockReportRequest.count,
          page: stockReportRequest.page
        };
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<StockReportResponse, StockReportRequest>(e, stockReportRequest, {
        stockGroupUniqueName: stockReportRequest.stockGroupUniqueName,
        stockUniqueName: stockReportRequest.stockUniqueName,
        from: stockReportRequest.from,
        to: stockReportRequest.to,
        count: stockReportRequest.count,
        page: stockReportRequest.page
      }));
  }

  /**
   * get GetGroupStocksReport
   */
  public GetGroupStocksReport(stockReportRequest: GroupStockReportRequest): Observable<BaseResponse<GroupStockReportResponse, GroupStockReportRequest>> {
    // console.log('stockReportRequest is :', stockReportRequest);
    let url = this.config.apiUrl + INVENTORY_API.GROUP_STOCK_REPORT;
    if (stockReportRequest.entity) {
      url = url.replace(':entity', encodeURIComponent(stockReportRequest.entity));
    } else {
      url = url.replace(':entity', '');
    }
    if (stockReportRequest.value) {
      url = url.replace(':value', encodeURIComponent(stockReportRequest.value));
    } else {
      url = url.replace(':value', '');
    }
    if (stockReportRequest.condition) {
      url = url.replace(':condition', encodeURIComponent(stockReportRequest.condition));
    } else {
      url = url.replace(':condition', '');
    }
    if (stockReportRequest.number) {
      url = url.replace(':number', encodeURIComponent(stockReportRequest.number.toString()));
    } else {
      url = url.replace(':number', '');
    }

    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(url.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':stockGroupUniqueName', encodeURIComponent(stockReportRequest.stockGroupUniqueName))
      .replace(':from', encodeURIComponent(stockReportRequest.from))
      .replace(':to', encodeURIComponent(stockReportRequest.to))
      .replace(':count', encodeURIComponent(stockReportRequest.count ? stockReportRequest.count.toString() : ''))
      .replace(':page', encodeURIComponent(stockReportRequest.page ? stockReportRequest.page.toString() : ''))
      .replace(':stock', encodeURIComponent(stockReportRequest.stockUniqueName)))
      .map((res) => {
        let data: BaseResponse<GroupStockReportResponse, GroupStockReportRequest> = res;
        data.request = stockReportRequest;
        data.queryString = {
          stockGroupUniqueName: stockReportRequest.stockGroupUniqueName,
          from: stockReportRequest.from,
          to: stockReportRequest.to,
          count: stockReportRequest.count,
          page: stockReportRequest.page
        }
        ;
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<GroupStockReportResponse, GroupStockReportRequest>(e, stockReportRequest, {
        stockGroupUniqueName: stockReportRequest.stockGroupUniqueName,
        from: stockReportRequest.from,
        to: stockReportRequest.to,
        count: stockReportRequest.count,
        page: stockReportRequest.page
      }));
  }

  /**
   * get Stockdetails
   */
  public GetStockUniqueNameWithDetail(stockUniqueName: string): Observable<BaseResponse<StockDetailResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + INVENTORY_API.GET_STOCK_WITH_UNIQUENAME.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockUniqueName', encodeURIComponent(stockUniqueName))).map((res) => {
      let data: BaseResponse<StockDetailResponse, string> = res;
      data.request = '';
      data.queryString = {stockUniqueName};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<StockDetailResponse, string>(e, '', {stockUniqueName}));
  }

  public CreateInventoryUser(name: string): Observable<BaseResponse<InventoryUser, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http
      .post(this.config.apiUrl + INVENTORY_API.USER.CREATE
        .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), {name}
      )
      .map((res) => {
        let data: BaseResponse<InventoryUser, string> = res;
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<InventoryUser, string>(e, '', {name}));
  }

  public GetInventoryUser(uniqueName: string): Observable<BaseResponse<InventoryUser, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http
      .get(this.config.apiUrl + INVENTORY_API.USER.GET
        .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
        .replace(':inventoryUserUniqueName', encodeURIComponent(uniqueName))
      ).map((res) => {
        let data: BaseResponse<InventoryUser, string> = res;
        data.request = '';
        data.queryString = {uniqueName};
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<InventoryUser, string>(e, '', {uniqueName}));
  }

  public GetAllInventoryUser(q: string = '', refresh = false, page = 0, count = 0): Observable<BaseResponse<IPaginatedResponse<InventoryUser>, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http
      .get(this.config.apiUrl + INVENTORY_API.USER.GET_ALL
        .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
        .replace(':q', q)
        .replace(':refresh', refresh.toString())
        .replace(':page', page.toString())
        .replace(':count', count.toString())
      ).map((res) => {
        let data: BaseResponse<IPaginatedResponse<InventoryUser>, string> = res;
        data.request = '';
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<IPaginatedResponse<InventoryUser>, string>(e, '', {}));
  }

  public UpdateInventoryUser(name: string): Observable<BaseResponse<InventoryUser, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http
      .patch(this.config.apiUrl + INVENTORY_API.USER.GET_ALL
        .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), {name}
      ).map((res) => {
        let data: BaseResponse<InventoryUser, string> = res;
        data.request = '';
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<InventoryUser, string>(e, '', {}));
  }

  public DeleteInventoryUser(uniqueName: string): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http
      .delete(this.config.apiUrl + INVENTORY_API.USER.DELETE
        .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
        .replace(':inventoryUserUniqueName', encodeURIComponent(uniqueName))
      ).map((res) => {
        let data: BaseResponse<string, string> = res;
        data.request = '';
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<string, string>(e, '', {}));
  }

  public CreateInventoryEntry(entry: InventoryEntry, reciever?: InventoryUser): Observable<BaseResponse<InventoryEntry, InventoryEntry>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http
      .post(this.config.apiUrl + INVENTORY_API.ENTRY.CREATE
        .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
        .replace(':inventoryUserUniqueName', encodeURIComponent((reciever && reciever.uniqueName) || this.companyUniqueName)), entry
      )
      .map((res) => {
        let data: BaseResponse<InventoryEntry, InventoryEntry> = res;
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<InventoryEntry, InventoryEntry>(e, ''));
  }

  public GetInventoryEntry(inventoryUserUniqueName: string, uniqueName: string): Observable<BaseResponse<InventoryEntry, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http
      .get(this.config.apiUrl + INVENTORY_API.ENTRY.GET
        .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
        .replace(':inventoryUserUniqueName', encodeURIComponent(inventoryUserUniqueName))
        .replace(':inventoryEntryUniqueName', encodeURIComponent(uniqueName))
      ).map((res) => {
        let data: BaseResponse<InventoryEntry, string> = res;
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<InventoryEntry, string>(e, ''));
  }

  public UpdateInventoryEntry(entry: InventoryEntry, inventoryUserUniqueName: string, inventoryEntryUniqueName: string): Observable<BaseResponse<InventoryEntry, InventoryEntry>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http
      .patch(this.config.apiUrl + INVENTORY_API.ENTRY.UPDATE
        .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
        .replace(':inventoryUserUniqueName', encodeURIComponent(inventoryUserUniqueName))
        .replace(':inventoryEntryUniqueName', encodeURIComponent(inventoryEntryUniqueName)), entry
        ,
      ).map((res) => {
        let data: BaseResponse<InventoryEntry, InventoryEntry> = res;
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<InventoryEntry, InventoryEntry>(e, '', {}));
  }

  public DeleteInventoryEntry(inventoryUserUniqueName: string, uniqueName: string): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http
      .delete(this.config.apiUrl + INVENTORY_API.ENTRY.DELETE
        .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
        .replace(':inventoryUserUniqueName', encodeURIComponent(inventoryUserUniqueName))
        .replace(':inventoryEntryUniqueName', encodeURIComponent(uniqueName))
      ).map((res) => {
        let data: BaseResponse<string, string> = res;
        data.request = '';
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<string, string>(e, '', {}));
  }

  public GetInventoryReport({stockUniqueName, from = '', to = '', page = 1, count = 10, reportFilters}: {
    stockUniqueName: string, from: string, to: string, page: number, count: number, reportFilters?: InventoryFilter
  }): Observable<BaseResponse<InventoryReport, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    let url;
    if (reportFilters && ((reportFilters.senders && reportFilters.senders.length > 0) || (reportFilters.receivers && reportFilters.receivers.length > 0))) {
      url = this.config.apiUrl + INVENTORY_API.REPORT_ALL;
    } else {
      url = this.config.apiUrl + INVENTORY_API.REPORT;
    }
    url = url.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':stockUniqueName', encodeURIComponent(stockUniqueName))
      .replace(':from', encodeURIComponent(from))
      .replace(':to', encodeURIComponent(to))
      .replace(':page', encodeURIComponent(page.toString()))
      .replace(':count', encodeURIComponent(count.toString()));
    let response;
    if (reportFilters) {
      response = this._http.post(url, reportFilters);
    } else {
      response = this._http.get(url);
    }
    return response.map((res) => {
      let data: BaseResponse<InventoryReport, string> = res;
      data.request = '';
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<InventoryReport, string>(e, '', {}));
  }

  public GetInventoryAllInOutReport(from?: string, to?: string, page?: number, count?: number, filterParams?: InventoryFilter): Observable<BaseResponse<InventoryReport, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http
      .get(this.config.apiUrl + INVENTORY_API.REPORT_ALL
        .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
        .replace(':from', encodeURIComponent(from))
        .replace(':to', encodeURIComponent(to))
        .replace(':page', encodeURIComponent(page.toString()))
        .replace(':count', encodeURIComponent(count.toString()))
      ).map((res) => {
        let data: BaseResponse<InventoryReport, string> = res;
        data.request = '';
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<InventoryReport, string>(e, '', {}));
  }

  // region branch
  public BranchTransfer(modal: TransferDestinationRequest | TransferProductsRequest): Observable<BaseResponse<BranchTransferResponse, TransferDestinationRequest | TransferProductsRequest>> {
    return this._http
      .post(this.config.apiUrl + INVENTORY_API.BRANCH_TRANSFER.TRANSFER, modal)
      .map((res) => {
        let data: BaseResponse<BranchTransferResponse, TransferDestinationRequest | TransferProductsRequest> = res;
        data.request = modal;
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<BranchTransferResponse, TransferDestinationRequest | TransferProductsRequest>(e, modal, ''));
  }

  //  endregion

  // region linked Stocks
  public GetLinkedStocks(): Observable<BaseResponse<LinkedStocksResponse, string>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http
      .get(this.config.apiUrl + INVENTORY_API.LINKED_STOCKS.LINKED_STOCKS
        .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      ).map((res) => {
        let data: BaseResponse<LinkedStocksResponse, string> = res;
        data.request = '';
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<LinkedStocksResponse, string>(e, '', {}));
  }
  // endregion

  /**
   * get StockUnitsByName
   */
  public GetStockUnitByName(unitName: string): Observable<BaseResponse<StockUnitResponse[], string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + INVENTORY_API.GET_STOCK_UNIT_WITH_NAME.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':uName', encodeURIComponent(unitName))).map((res) => {
      let data: BaseResponse<StockUnitResponse[], string> = res;
      data.request = '';
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<StockUnitResponse[], string>(e, '', {}));
  }

  /**
   * Move Stock
   */
  public MoveStock(activeGroup, stockUniqueName: string, stockGroupUniqueName: string): Observable<BaseResponse<StockUnitResponse[], string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    let objToSend = {
      uniqueName: stockGroupUniqueName
    };
    let requestObj = {
      activeGroup,
      stockUniqueName,
      stockGroupUniqueName
    };
    return this._http.put(this.config.apiUrl + INVENTORY_API.MOVE_STOCK.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':stockUniqueName', encodeURIComponent(stockUniqueName)), objToSend).map((res) => {
      let data: BaseResponse<any, any> = res;
      data.request = '';
      data.queryString = requestObj;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e, '', {}));
  }
}
