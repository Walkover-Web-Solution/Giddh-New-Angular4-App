import { catchError, map } from 'rxjs/operators';
import {
    CreateStockRequest,
    GroupStockReportRequest,
    GroupStockReportResponse,
    StockDetailResponse,
    StockGroupRequest,
    StockGroupResponse,
    StockReportRequest,
    StockReportResponse,
    StocksResponse,
    StockUnitRequest,
    StockUnitResponse,
    InventoryDownloadRequest,
    StockMappedUnitResponse,
    StockTransactionReportRequest,
    InventoryReportRequest,
    InventoryReportResponse,
    CreateDiscount,
    InventoryReportRequestExport
} from '../models/api-models/Inventory';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './http-wrapper.service';
import { INVENTORY_API } from './apiurls/inventory.api';
import { GroupsWithStocksFlatten, GroupsWithStocksHierarchyMin } from '../models/api-models/GroupsWithStocks';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { InventoryEntry, InventoryFilter, InventoryReport, InventoryUser } from '../models/api-models/Inventory-in-out';
import { IPaginatedResponse } from '../models/interfaces/paginated-response.interface';
import {
    BranchTransferResponse,
    LinkedStocksResponse,
    TransferDestinationRequest,
    TransferProductsRequest,
    NewBranchTransferRequest, NewBranchTransferResponse, NewBranchTransferListResponse, NewBranchTransferListPostRequestParams, NewBranchTransferListGetRequestParams, NewBranchTransferDownloadRequest
} from '../models/api-models/BranchTransfer';
import { PAGINATION_LIMIT } from '../app.constant';
import { cloneDeep } from '../lodash-optimized';

declare var _: any;

@Injectable()
export class InventoryService {
    private companyUniqueName: string;
    private _: any;

    constructor(private errorHandler: GiddhErrorHandler, public http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this._ = config._;
        _ = config._;
    }

    public CreateStockGroup(model: StockGroupRequest, moduleType: string = ''): Observable<BaseResponse<StockGroupResponse, StockGroupRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVENTORY_API.CREATE_STOCK_GROUP?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':type', encodeURIComponent(moduleType)), model).pipe(map((res) => {
                let data: BaseResponse<StockGroupResponse, StockGroupRequest> = res;
                data.request = model;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<StockGroupResponse, StockGroupRequest>(e, model)));
    }

    /**
     * Update StockGroup
     */
    public UpdateStockGroup(model: StockGroupRequest, stockGroupUniquename: string): Observable<BaseResponse<StockGroupResponse, StockGroupRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + INVENTORY_API.UPDATE_STOCK_GROUP?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniquename)), model).pipe(map((res) => {
            let data: BaseResponse<StockGroupResponse, StockGroupRequest> = res;
            data.request = model;
            data.queryString = { stockGroupUniquename };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StockGroupResponse, StockGroupRequest>(e, model, { stockGroupUniquename })));
    }

    /**
     * Delete StockGroup
     */
    public DeleteStockGroup(stockGroupUniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + INVENTORY_API.DELETE_STOCK_GROUP?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName))).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.request = stockGroupUniqueName;
            data.queryString = { stockGroupUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, stockGroupUniqueName, { stockGroupUniqueName })));
    }

    public GetGroupsStock(stockGroupUniqueName: string): Observable<BaseResponse<StockGroupResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.GROUPS_STOCKS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName))).pipe(map((res) => {
            let data: BaseResponse<StockGroupResponse, string> = res;
            data.request = stockGroupUniqueName;
            data.queryString = { stockGroupUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StockGroupResponse, string>(e, stockGroupUniqueName, { stockGroupUniqueName })));
    }

    /**
     * get Groups with Stocks
     */
    public SearchStockGroupsWithStocks(q: string = '', page: number = 1, count?: number): Observable<BaseResponse<GroupsWithStocksFlatten, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.GROUPS_WITH_STOCKS_FLATTEN?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':q', encodeURIComponent(q || ''))?.replace(':page', page?.toString())?.replace(':count', count?.toString())).pipe(map((res) => {
            let data: BaseResponse<GroupsWithStocksFlatten, string> = res;
            data.request = '';
            data.queryString = { q, page, count };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<GroupsWithStocksFlatten, string>(e, '', { q, page, count })));
    }

    /**
     *  Get stock group by inventory type
     *
     * @param {string} [moduleType='']
     * @return {*}  {Observable<BaseResponse<GroupsWithStocksHierarchyMin, string>>}
     * @memberof InventoryService
     */
    public GetGroupsWithStocksFlatten(moduleType: string = ''): Observable<BaseResponse<GroupsWithStocksHierarchyMin, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.GROUPS_WITH_STOCKS
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':type', encodeURIComponent(moduleType))).pipe(map((res) => {
                let data: BaseResponse<GroupsWithStocksHierarchyMin, string> = res;
                data.request = '';
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<GroupsWithStocksHierarchyMin, string>(e, '', {})));
    }

    /**
     * get Stocks
     */
    public GetStocks(payload: any = { companyUniqueName: '' }): Observable<BaseResponse<StocksResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let cmpUniqueName: string = this.companyUniqueName;
        if (payload.companyUniqueName) {
            cmpUniqueName = payload.companyUniqueName;
        }
        let url = this.config.apiUrl + INVENTORY_API.STOCKS?.replace(':companyUniqueName', encodeURIComponent(cmpUniqueName));
        let delimiter = '?';
        if (payload.branchUniqueName) {
            url = url.concat(`?branchUniqueName=${payload.branchUniqueName !== cmpUniqueName ? encodeURIComponent(payload.branchUniqueName) : ''}`);
            delimiter = '&';
        }
        if (payload.q) {
            url = url.concat(`${delimiter}q=${payload.q}`);
            delimiter = '&';
        }
        if (payload.page) {
            url = url.concat(`${delimiter}page=${payload.page}&count=${payload.count || PAGINATION_LIMIT}`);
        }

        return this.http.get(url).pipe(map((res) => {
            let data: BaseResponse<StocksResponse, string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StocksResponse, string>(e, '', {})));
    }

    /**
     * GetManufacturingStocks
     */
    public GetManufacturingStocks(): Observable<BaseResponse<StocksResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.MANUFACTURING_STOCKS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<StocksResponse, string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StocksResponse, string>(e, '', {})));
    }

    /**
     * GetManufacturingStocks
     */
    public GetManufacturingStocksForCreateMF(): Observable<BaseResponse<StocksResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.CREATE_NEW_MANUFACTURING_STOCKS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<StocksResponse, string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StocksResponse, string>(e, '', {})));
    }

    /**
     * get Stocks with hierarchy
     */
    public GetGroupsWithStocksHierarchyMin(q: string = '', page: number = 1, count?: number): Observable<BaseResponse<GroupsWithStocksHierarchyMin, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.GROUPS_WITH_STOCKS_HIERARCHY?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':q', encodeURIComponent(q || ''))?.replace(':page', encodeURIComponent(page?.toString()))?.replace(':count', encodeURIComponent((count) ? count?.toString() : ''))).pipe(map((res) => {
            let data: BaseResponse<GroupsWithStocksHierarchyMin, string> = res;
            data.request = '';
            data.queryString = { q, page, count };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<GroupsWithStocksHierarchyMin, string>(e, '', {
            q,
            page,
            count
        })));
    }

    /**
   * This will use for get stock mapped unit
   */
    public getStockMappedUnit(unitGroupUniqueName: any[] = []): Observable<BaseResponse<StockMappedUnitResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVENTORY_API.GET_STOCK_MAPPED_UNIT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), unitGroupUniqueName).pipe(map((res) => {
            let data: BaseResponse<StockMappedUnitResponse[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StockMappedUnitResponse[], string>(e, '', {})));
    }

    /**
   * This will use for get stock mapped units by unique name
   */
    public getStockMappedUnitByUniqueName(uniqueName: string): Observable<BaseResponse<StockMappedUnitResponse, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.UPDATE_STOCK_UNIT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':uniqueName', uniqueName)).pipe(map((res) => {
            let data: BaseResponse<StockMappedUnitResponse, string> = res;
            data.queryString = { uniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StockMappedUnitResponse, string>(e, { uniqueName })));
    }

    /**
     * Create Stock Multiple Unit
     */
    public CreateStockUnit(model: StockUnitRequest): Observable<BaseResponse<StockUnitResponse, StockUnitRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVENTORY_API.CREATE_STOCK_UNIT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<StockUnitResponse, StockUnitRequest> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StockUnitResponse, StockUnitRequest>(e, model)));
    }

    /**
     * Update StockUnit
     */
    public UpdateStockUnit(model: StockUnitRequest, uniqueName: string): Observable<BaseResponse<StockUnitResponse, StockUnitRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + INVENTORY_API.UPDATE_STOCK_UNIT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':uniqueName', uniqueName), model).pipe(map((res) => {
            let data: BaseResponse<StockUnitResponse, StockUnitRequest> = res;
            data.request = model;
            data.queryString = { uniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StockUnitResponse, StockUnitRequest>(e, model, { uniqueName })));
    }

    /**
     * Delete StockUnit
     */
    public DeleteStockUnit(uniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + INVENTORY_API.DELETE_STOCK_UNIT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':uniqueName', uniqueName)).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.request = uniqueName;
            data.queryString = { uniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, uniqueName, { uniqueName })));
    }

    /**
     * get StockUnits
     */
    public GetStockUnit(): Observable<BaseResponse<StockUnitResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.STOCK_UNIT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<StockUnitResponse[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StockUnitResponse[], string>(e, '', {})));
    }

    /**
     * Create Stock
     */
    public CreateStock(model: CreateStockRequest, stockGroupUniqueName: string): Observable<BaseResponse<StockDetailResponse, CreateStockRequest>> {
        this.companyUniqueName = encodeURIComponent(this.generalService.companyUniqueName);
        return this.http.post(this.config.apiUrl + INVENTORY_API.CREATE_STOCK?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<StockDetailResponse, CreateStockRequest> = res;
            data.request = model;
            data.queryString = { stockGroupUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StockDetailResponse, CreateStockRequest>(e, model, { stockGroupUniqueName })));
    }

    /**
     * Update Stock
     */
    public UpdateStock(model: CreateStockRequest, stockGroupUniqueName: string, stockUniqueName: string): Observable<BaseResponse<StockDetailResponse, CreateStockRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + INVENTORY_API.UPDATE_STOCK?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName))?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<StockDetailResponse, CreateStockRequest> = res;
            data.request = model;
            data.queryString = { stockGroupUniqueName, stockUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StockDetailResponse, CreateStockRequest>(e, model, {
            stockGroupUniqueName,
            stockUniqueName
        })));
    }

    /**
     * Delete Stock
     */
    public DeleteStock(stockGroupUniqueName: string, stockUniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + INVENTORY_API.DELETE_STOCK?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName))?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName))).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.request = '';
            data.queryString = { stockGroupUniqueName, stockUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '', {
            stockGroupUniqueName,
            stockUniqueName
        })));
    }

    /**
     * get Stockdetails
     */
    public GetStockDetails(stockGroupUniqueName: string, stockUniqueName: string): Observable<BaseResponse<StockDetailResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.STOCK_DETAIL?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName))?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName))).pipe(map((res) => {
            let data: BaseResponse<StockDetailResponse, string> = res;
            data.request = '';
            data.queryString = { stockGroupUniqueName, stockUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StockDetailResponse, string>(e, '', {
            stockGroupUniqueName,
            stockUniqueName
        })));
    }

    /**
     * get Get-Rate-For-Stoke
     */
    public GetRateForStoke(stockUniqueName: string, model: any): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVENTORY_API.GET_RATE_FOR_STOCK?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.request = '';
            data.queryString = { stockUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StockDetailResponse, string>(e, '', { stockUniqueName })));
    }

    /**
     * get GetStocksReport
     */
    public GetStocksReport(stockReportRequest: StockReportRequest): Observable<BaseResponse<StockReportResponse, StockReportRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.STOCK_REPORT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':stockGroupUniqueName', encodeURIComponent(stockReportRequest.stockGroupUniqueName))
            ?.replace(':stockUniqueName', encodeURIComponent(stockReportRequest.stockUniqueName))
            ?.replace(':from', encodeURIComponent(stockReportRequest.from))
            ?.replace(':to', encodeURIComponent(stockReportRequest.to))
            ?.replace(':count', encodeURIComponent(stockReportRequest.count?.toString()))
            ?.replace(':page', encodeURIComponent(stockReportRequest.page?.toString()))).pipe(
                map((res) => {
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
                }), catchError((e) => this.errorHandler.HandleCatch<StockReportResponse, StockReportRequest>(e, stockReportRequest, {
                    stockGroupUniqueName: stockReportRequest.stockGroupUniqueName,
                    stockUniqueName: stockReportRequest.stockUniqueName,
                    from: stockReportRequest.from,
                    to: stockReportRequest.to,
                    count: stockReportRequest.count,
                    page: stockReportRequest.page
                })));
    }

    public GetStocksReport_v2(stockReportRequest: StockReportRequest): Observable<BaseResponse<StockReportResponse, StockReportRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.post(this.config.apiUrl + INVENTORY_API.STOCK_REPORT_V2?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':stockGroupUniqueName', encodeURIComponent(stockReportRequest.stockGroupUniqueName))
            ?.replace(':stockUniqueName', encodeURIComponent(stockReportRequest.stockUniqueName))
            ?.replace(':transactionType', encodeURIComponent(stockReportRequest.transactionType ? stockReportRequest.transactionType?.toString() : 'all'))
            ?.replace(':from', encodeURIComponent(stockReportRequest.from))
            ?.replace(':to', encodeURIComponent(stockReportRequest.to))
            ?.replace(':count', encodeURIComponent(stockReportRequest.count?.toString()))
            ?.replace(':page', encodeURIComponent(stockReportRequest.page?.toString()))
            ?.replace(':sort', encodeURIComponent(stockReportRequest.sort ? stockReportRequest.sort?.toString() : ''))
            ?.replace(':sortBy', encodeURIComponent(stockReportRequest.sortBy ? stockReportRequest.sortBy?.toString() : ''))
            , stockReportRequest).pipe(
                map((res) => {
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
                }), catchError((e) => this.errorHandler.HandleCatch<StockReportResponse, StockReportRequest>(e, stockReportRequest, {
                    stockGroupUniqueName: stockReportRequest.stockGroupUniqueName,
                    stockUniqueName: stockReportRequest.stockUniqueName,
                    from: stockReportRequest.from,
                    to: stockReportRequest.to,
                    count: stockReportRequest.count,
                    page: stockReportRequest.page
                })));
    }

    /**
     * get GetGroupStocksReport
     */
    public GetGroupStocksReport(stockReportRequest: GroupStockReportRequest): Observable<BaseResponse<GroupStockReportResponse, GroupStockReportRequest>> {
        let url = this.config.apiUrl + INVENTORY_API.GROUP_STOCK_REPORT;
        if (stockReportRequest.entity) {
            url = url?.replace(':entity', encodeURIComponent(stockReportRequest.entity));
        } else {
            url = url?.replace(':entity', '');
        }
        if (stockReportRequest?.value) {
            url = url?.replace(':value', encodeURIComponent(stockReportRequest.value));
        } else {
            url = url?.replace(':value', '');
        }
        if (stockReportRequest.condition) {
            url = url?.replace(':condition', encodeURIComponent(stockReportRequest.condition));
        } else {
            url = url?.replace(':condition', '');
        }
        if (stockReportRequest.number) {
            url = url?.replace(':number', encodeURIComponent(stockReportRequest.number?.toString()));
        } else {
            url = url?.replace(':number', '');
        }

        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':stockGroupUniqueName', encodeURIComponent(stockReportRequest.stockGroupUniqueName))
            ?.replace(':from', encodeURIComponent(stockReportRequest.from))
            ?.replace(':to', encodeURIComponent(stockReportRequest.to))
            ?.replace(':count', encodeURIComponent(stockReportRequest.count ? stockReportRequest.count?.toString() : ''))
            ?.replace(':page', encodeURIComponent(stockReportRequest.page ? stockReportRequest.page?.toString() : ''))
            ?.replace(':stock', encodeURIComponent(stockReportRequest.stockUniqueName))).pipe(
                map((res) => {
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
                }), catchError((e) => this.errorHandler.HandleCatch<GroupStockReportResponse, GroupStockReportRequest>(e, stockReportRequest, {
                    stockGroupUniqueName: stockReportRequest.stockGroupUniqueName,
                    from: stockReportRequest.from,
                    to: stockReportRequest.to,
                    count: stockReportRequest.count,
                    page: stockReportRequest.page
                })));
    }

    public GetGroupStocksReport_V3(stockReportRequest: GroupStockReportRequest): Observable<BaseResponse<GroupStockReportResponse, GroupStockReportRequest>> {
        let url = this.config.apiUrl + INVENTORY_API.GROUP_STOCK_REPORT_V3;
        if (stockReportRequest.entity) {
            url = url?.replace(':entity', encodeURIComponent(stockReportRequest.entity));
        } else {
            url = url?.replace(':entity', '');
        }
        if (stockReportRequest?.value) {
            url = url?.replace(':value', encodeURIComponent(stockReportRequest.value));
        } else {
            url = url?.replace(':value', '');
        }
        if (stockReportRequest.condition) {
            url = url?.replace(':condition', encodeURIComponent(stockReportRequest.condition));
        } else {
            url = url?.replace(':condition', '');
        }
        if (stockReportRequest.number) {
            url = url?.replace(':number', encodeURIComponent(stockReportRequest.number?.toString()));
        } else {
            url = url?.replace(':number', '');
        }

        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':stockGroupUniqueName', encodeURIComponent(stockReportRequest.stockGroupUniqueName))
            ?.replace(':from', encodeURIComponent(stockReportRequest.from))
            ?.replace(':to', encodeURIComponent(stockReportRequest.to))
            ?.replace(':count', encodeURIComponent(stockReportRequest.count ? stockReportRequest.count?.toString() : ''))
            ?.replace(':page', encodeURIComponent(stockReportRequest.page ? stockReportRequest.page?.toString() : ''))
            ?.replace(':sort', encodeURIComponent(stockReportRequest.sort ? stockReportRequest.sort?.toString() : ''))
            ?.replace(':sortBy', encodeURIComponent(stockReportRequest.sortBy ? stockReportRequest.sortBy?.toString() : '')),
            stockReportRequest
        ).pipe(
            map((res) => {
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
            }), catchError((e) => this.errorHandler.HandleCatch<GroupStockReportResponse, GroupStockReportRequest>(e, stockReportRequest, {
                stockGroupUniqueName: stockReportRequest.stockGroupUniqueName,
                from: stockReportRequest.from,
                to: stockReportRequest.to,
                count: stockReportRequest.count,
                page: stockReportRequest.page
            })));
    }

    /**
     * get Stockdetails
     */
    public GetStockUniqueNameWithDetail(stockUniqueName: string): Observable<BaseResponse<StockDetailResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.GET_STOCK_WITH_UNIQUENAME?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName))).pipe(map((res) => {
            let data: BaseResponse<StockDetailResponse, string> = res;
            data.request = '';
            data.queryString = { stockUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StockDetailResponse, string>(e, '', { stockUniqueName })));
    }

    public CreateInventoryUser(name: string): Observable<BaseResponse<InventoryUser, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http
            .post(this.config.apiUrl + INVENTORY_API.USER.CREATE
                ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), { name }
            ).pipe(
                map((res) => {
                    let data: BaseResponse<InventoryUser, string> = res;
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<InventoryUser, string>(e, '', { name })));
    }

    public GetAllInventoryUser(q: string = '', refresh = false, page = 0, count = 0): Observable<BaseResponse<IPaginatedResponse<InventoryUser>, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http
            .get(this.config.apiUrl + INVENTORY_API.USER.GET_ALL
                ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
                ?.replace(':q', q)
                ?.replace(':refresh', refresh?.toString())
                ?.replace(':page', page?.toString())
                ?.replace(':count', count?.toString())
            ).pipe(map((res) => {
                let data: BaseResponse<IPaginatedResponse<InventoryUser>, string> = res;
                data.request = '';
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<IPaginatedResponse<InventoryUser>, string>(e, '', {})));
    }

    public CreateInventoryEntry(entry: InventoryEntry, reciever?: InventoryUser): Observable<BaseResponse<InventoryEntry, InventoryEntry>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http
            .post(this.config.apiUrl + INVENTORY_API.ENTRY.CREATE
                ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
                ?.replace(':inventoryUserUniqueName', encodeURIComponent((reciever && reciever.uniqueName) || this.companyUniqueName)), entry
            ).pipe(
                map((res) => {
                    let data: BaseResponse<InventoryEntry, InventoryEntry> = res;
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<InventoryEntry, InventoryEntry>(e, '')));
    }

    public CreateInventoryTransferEntry(entry: InventoryEntry, reciever?: InventoryUser): Observable<BaseResponse<InventoryEntry, InventoryEntry>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http
            .post(this.config.apiUrl + INVENTORY_API.TRANSFER_ENTRY.CREATE, entry).pipe(
                map((res) => {
                    let data: BaseResponse<InventoryEntry, InventoryEntry> = res;
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<InventoryEntry, InventoryEntry>(e, '')));
    }

    public GetInventoryReport_v2({ stockUniqueName, from = '', to = '', page = 1, count = 10, reportFilters }: {
        stockUniqueName: string, from: string, to: string, page: number, count: number, reportFilters?: InventoryFilter
    }): Observable<BaseResponse<InventoryReport, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url, sortBy, sort;
        if (reportFilters && ((reportFilters.senders && reportFilters.senders.length > 0) || (reportFilters.receivers && reportFilters.receivers.length > 0))) {
            url = this.config.apiUrl + INVENTORY_API.REPORT_ALL_V2; // person
        } else {
            url = this.config.apiUrl + INVENTORY_API.REPORT_V2; // stock
        }
        if (reportFilters && reportFilters.sort && reportFilters.sortBy) {
            sortBy = reportFilters.sortBy;
            sort = reportFilters.sort
        }

        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName))
            ?.replace(':from', encodeURIComponent(from))
            ?.replace(':to', encodeURIComponent(to))
            ?.replace(':page', encodeURIComponent(page?.toString()))
            ?.replace(':count', encodeURIComponent(count?.toString()))
            ?.replace(':sort', encodeURIComponent(sortBy ? sort?.toString() : ''))
            ?.replace(':sortBy', encodeURIComponent(sortBy ? sortBy?.toString() : ''));
        let response;
        response = this.http.post(url, reportFilters);
        return response.pipe(map((res: any) => {
            let data: BaseResponse<any, string> = res;
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<InventoryReport, string>(e, '', {
            stockUniqueName, from, to, page, count, reportFilters
        })));
    }

    // region branch
    public BranchTransfer(modal: TransferDestinationRequest | TransferProductsRequest): Observable<BaseResponse<BranchTransferResponse, TransferDestinationRequest | TransferProductsRequest>> {
        return this.http
            .post(this.config.apiUrl + INVENTORY_API.BRANCH_TRANSFER.TRANSFER, modal).pipe(
                map((res) => {
                    let data: BaseResponse<BranchTransferResponse, TransferDestinationRequest | TransferProductsRequest> = res;
                    data.request = modal;
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<BranchTransferResponse, TransferDestinationRequest | TransferProductsRequest>(e, modal, '')));
    }

    //  endregion

    // region linked Stocks
    public getLinkedStocks(): Observable<BaseResponse<LinkedStocksResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http
            .get(this.config.apiUrl + INVENTORY_API.LINKED_STOCKS.LINKED_STOCKS
                ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ).pipe(map((res) => {
                let data: BaseResponse<LinkedStocksResponse, string> = res;
                data.request = '';
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<LinkedStocksResponse, string>(e, '', {})));
    }

    // endregion

    /**
     * get StockUnitsByName
     */
    public GetStockUnitByName(unitName: string): Observable<BaseResponse<StockUnitResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.GET_STOCK_UNIT_WITH_NAME?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':uName', encodeURIComponent(unitName))).pipe(map((res) => {
            let data: BaseResponse<StockUnitResponse[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StockUnitResponse[], string>(e, '', {})));
    }

    /**
     * Move Stock
     */
    public MoveStock(activeGroup, stockUniqueName: string, stockGroupUniqueName: string): Observable<BaseResponse<StockUnitResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let objToSend = {
            uniqueName: stockGroupUniqueName
        };
        let requestObj = {
            activeGroup,
            stockUniqueName,
            stockGroupUniqueName
        };
        return this.http.put(this.config.apiUrl + INVENTORY_API.MOVE_STOCK?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName)), objToSend).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = '';
            data.queryString = requestObj;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', {})));
    }

    public downloadAllInventoryReports(request: InventoryDownloadRequest): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url: string = null;
        let requestObject;
        if (request.reportType === 'allgroup') {
            url = this.config.apiUrl + INVENTORY_API.DOWNLOAD_INVENTORY_ALL_GROUP_REPORT
                ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
                ?.replace(':format', encodeURIComponent(request.format))
                ?.replace(':from', encodeURIComponent(request.from ? request.from?.toString() : ''))
                ?.replace(':to', encodeURIComponent(request.to ? request.to?.toString() : ''))
                ?.replace(':sortBy', encodeURIComponent(request.sortBy ? request.sortBy?.toString() : ''))
                ?.replace(':sort', encodeURIComponent(request.sort ? request.sort?.toString() : ''))
                ?.replace(':entity', encodeURIComponent(request.entity ? request.entity?.toString() : ''))
                ?.replace(':value', encodeURIComponent(request?.value ? request.value?.toString() : ''))
                ?.replace(':number', encodeURIComponent(request.number ? request.number?.toString() : ''))
                ?.replace(':condition', encodeURIComponent(request.condition ? request.condition?.toString() : ''))
        }
        else if (request.reportType === 'group') {
            requestObject = {
                entity: request.entity,
                value: request?.value,
                number: request.number,
                condition: request.condition,
                warehouseUniqueName: request.warehouseUniqueName,
                branchUniqueName: request.branchUniqueName
            };
            url = this.config.apiUrl + INVENTORY_API.DOWNLOAD_INVENTORY_GROUP_REPORT
                ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
                ?.replace(':stockGroupUniquename', encodeURIComponent(request.stockGroupUniqueName))
                ?.replace(':format', encodeURIComponent(request.format))
                ?.replace(':from', encodeURIComponent(request.from ? request.from?.toString() : ''))
                ?.replace(':to', encodeURIComponent(request.to ? request.to?.toString() : ''))
                ?.replace(':sortBy', encodeURIComponent(request.sortBy ? request.sortBy?.toString() : ''))
                ?.replace(':sort', encodeURIComponent(request.sort ? request.sort?.toString() : ''));
        } else if (request.reportType === 'allstock') {
            url = this.config.apiUrl + INVENTORY_API.DOWNLOAD_INVENTORY_HIERARCHICAL_STOCKS_REPORT
                ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
                ?.replace(':stockGroupUniquename', encodeURIComponent(request.stockGroupUniqueName))
                ?.replace(':stockUniqueName', encodeURIComponent(request.stockUniqueName))
                ?.replace(':format', encodeURIComponent(request.format))
                ?.replace(':from', encodeURIComponent(request.from ? request.from?.toString() : ''))
                ?.replace(':to', encodeURIComponent(request.to ? request.to?.toString() : ''))
                ?.replace(':sortBy', encodeURIComponent(request.sortBy ? request.sortBy?.toString() : ''))
                ?.replace(':sort', encodeURIComponent(request.sort ? request.sort?.toString() : ''))
                ?.replace(':page', encodeURIComponent(request.page ? request.page?.toString() : ''))
                ?.replace(':count', encodeURIComponent(request.count ? request.count?.toString() : ''));
        } else if (request.reportType === 'stock') {
            requestObject = {
                warehouseUniqueName: request.warehouseUniqueName,
                branchUniqueName: request.branchUniqueName
            };
            url = this.config.apiUrl + INVENTORY_API.DOWNLOAD_INVENTORY_STOCK_REPORT
                ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
                ?.replace(':stockGroupUniqueName', encodeURIComponent(request.stockGroupUniqueName))
                ?.replace(':stockUniqueName', encodeURIComponent(request.stockUniqueName))
                ?.replace(':format', encodeURIComponent(request.format))
                ?.replace(':from', encodeURIComponent(request.from ? request.from?.toString() : ''))
                ?.replace(':to', encodeURIComponent(request.to ? request.to?.toString() : ''))
                ?.replace(':sortBy', encodeURIComponent(request.sortBy ? request.sortBy?.toString() : ''))
                ?.replace(':sort', encodeURIComponent(request.sort ? request.sort?.toString() : ''))
                ?.replace(':page', encodeURIComponent(request.page ? request.page?.toString() : ''))
                ?.replace(':count', encodeURIComponent(request.count ? request.count?.toString() : ''));
        } else if (request.reportType === 'account') {
            url = this.config.apiUrl + INVENTORY_API.DOWNLOAD_INVENTORY_STOCKS_ARRANGED_BY_ACCOUNT_REPORT
                ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
                ?.replace(':format', encodeURIComponent(request.format))
                ?.replace(':sort', encodeURIComponent(request.sort ? request.sort?.toString() : ''))
                ?.replace(':to', encodeURIComponent(request.to ? request.to?.toString() : ''))
                ?.replace(':from', encodeURIComponent(request.from ? request.from?.toString() : ''))
                ?.replace(':sortBy', encodeURIComponent(request.sortBy ? request.sortBy?.toString() : ''));
        }

        if (request.reportType === 'group' || request.reportType === 'stock') {
            if (request.branchUniqueName === this.generalService.companyUniqueName) {
                // Delete the branch unique name when company is selected in the dropdown
                delete request.branchUniqueName;
                delete requestObject.branchUniqueName;
            }
            return this.http.post(url, requestObject).pipe(catchError((error) => this.errorHandler.HandleCatch<any, string>(error, '', {})));
        } else {
            if (request.branchUniqueName) {
                url = url.concat(`&branchUniqueName=${request.branchUniqueName}`);
            }
            return this.http.get(url)
                .pipe(map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', {})));
        }
    }

    public downloadJobwork(stockUniqueName: string, reportType: string, format: string, from: string, to: string, reportFilters?: InventoryFilter): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = null;
        if (reportType === 'person') {
            url = this.config.apiUrl + INVENTORY_API.DOWNLOAD_JOBWORK_BY_PERSON
                ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
                ?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName))
                ?.replace(':format', encodeURIComponent(format))
                ?.replace(':from', encodeURIComponent(from))
                ?.replace(':to', encodeURIComponent(to))
                ?.replace(':sort', encodeURIComponent(reportFilters.sort ? reportFilters.sort?.toString() : ''))
                ?.replace(':sortBy', encodeURIComponent(reportFilters.sortBy ? reportFilters.sortBy?.toString() : ''))
            return this.http.post(url, reportFilters)
                .pipe(map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', {})));
        } else {

            url = this.config.apiUrl + INVENTORY_API.DOWNLOAD_JOBWORK_BY_STOCK
                ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
                ?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName))
                ?.replace(':format', encodeURIComponent(format))
                ?.replace(':from', encodeURIComponent(from))
                ?.replace(':to', encodeURIComponent(to))
                ?.replace(':sort', encodeURIComponent(reportFilters.sort ? reportFilters.sort?.toString() : ''))
                ?.replace(':sortBy', encodeURIComponent(reportFilters.sortBy ? reportFilters.sortBy?.toString() : ''))
            return this.http.get(url)
                .pipe(map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', {})));
        }

    }

    public updateDescription(uniqueName: string, description: string): Observable<BaseResponse<InventoryUser, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http
            .patch(this.config.apiUrl + INVENTORY_API.UPDATE_DESCRIPTION
                ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
                ?.replace(':uniqueName', encodeURIComponent(uniqueName))
                ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), { description: description }
            ).pipe(map((res) => {

                return res;
            }), catchError((e) => this.errorHandler.HandleCatch<InventoryUser, string>(e, '', {})));
    }

    public createNewBranchTransfer(branchTransfer: NewBranchTransferRequest): Observable<BaseResponse<NewBranchTransferResponse, NewBranchTransferRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVENTORY_API.CREATE_NEW_BRANCH_TRANSFER?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), branchTransfer).pipe(map((res) => {
            let data: BaseResponse<NewBranchTransferResponse, NewBranchTransferRequest> = res;
            data.request = branchTransfer;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<NewBranchTransferResponse, NewBranchTransferRequest>(e, branchTransfer)));
    }

    public getBranchTransferList(getParams: NewBranchTransferListGetRequestParams, postParams: NewBranchTransferListPostRequestParams): Observable<BaseResponse<NewBranchTransferListResponse, NewBranchTransferListPostRequestParams>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        let url = this.config.apiUrl + INVENTORY_API.GET_BRANCH_TRANSFER_LIST;
        url = url?.replace(":companyUniqueName", this.companyUniqueName);
        url = url?.replace(":from", getParams.from);
        url = url?.replace(":to", getParams.to);
        url = url?.replace(":page", getParams.page);
        url = url?.replace(":count", getParams.count);
        url = url?.replace(":sort", getParams.sort);
        url = url?.replace(":sortBy", getParams.sortBy);
        if (getParams.branchUniqueName) {
            const branchUniqueName = getParams.branchUniqueName !== this.companyUniqueName ? getParams.branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${encodeURIComponent(branchUniqueName)}`);
        }
        return this.http.post(url, postParams)
            .pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<NewBranchTransferListResponse, NewBranchTransferListPostRequestParams>(e, postParams)));
    }

    public deleteNewBranchTransfer(branchTransferUniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVENTORY_API.DELETE_BRANCH_TRANSFER;
        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        url = url?.replace(':branchTransferUniqueName', encodeURIComponent(branchTransferUniqueName));

        return this.http.delete(url).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.request = branchTransferUniqueName;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, branchTransferUniqueName)));
    }

    public getNewBranchTransfer(branchTransferUniqueName: string): Observable<BaseResponse<NewBranchTransferResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVENTORY_API.GET_BRANCH_TRANSFER;
        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        url = url?.replace(':branchTransferUniqueName', encodeURIComponent(branchTransferUniqueName));

        return this.http.get(url).pipe(map((res) => {
            let data: BaseResponse<NewBranchTransferResponse, string> = res;
            data.request = branchTransferUniqueName;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<NewBranchTransferResponse, string>(e, branchTransferUniqueName)));
    }

    public updateNewBranchTransfer(branchTransfer: NewBranchTransferRequest): Observable<BaseResponse<NewBranchTransferResponse, NewBranchTransferRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVENTORY_API.UPDATE_BRANCH_TRANSFER;
        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        url = url?.replace(':branchTransferUniqueName', encodeURIComponent(branchTransfer?.uniqueName));

        return this.http.put(url, branchTransfer).pipe(map((res) => {
            let data: BaseResponse<NewBranchTransferResponse, NewBranchTransferRequest> = res;
            data.request = branchTransfer;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<NewBranchTransferResponse, NewBranchTransferRequest>(e, branchTransfer)));
    }

    public downloadBranchTransfer(companyUniqueName: string, postParams: NewBranchTransferDownloadRequest): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + INVENTORY_API.DOWNLOAD_NEW_BRANCH_TRANSFER;
        url = url?.replace(":companyUniqueName", companyUniqueName);

        return this.http.post(url, postParams)
            .pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, companyUniqueName)));
    }

    /**
     * Method to fetch unit code regex for validaton
     *
     * @param {string} formName Form name for which regex is needed
     * @param {string} countryName Country name
     * @returns {Observable<BaseResponse<any, any>>} Observable to carry out further operation
     * @memberof InventoryService
     */
    public getUnitCodeRegex(formName: string, countryName: string): Observable<BaseResponse<any, any>> {
        const url = `${this.config.apiUrl}${INVENTORY_API.GET_UNIT_CODE_REGEX}`?.replace(':formName', formName)?.replace(':country', countryName);
        return this.http.get(url).pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
    }

    /**
     * This will create stock group
     *
     * @param {*} model
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public createStockGroup(model: any, moduleType: string = ''): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVENTORY_API.V5.CREATE_STOCK_GROUP;
        url = url?.replace(":companyUniqueName", companyUniqueName)
            ?.replace(':type', encodeURIComponent(moduleType));
        return this.http.post(url, model)
            .pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, companyUniqueName)));
    }

    /**
     * This will get the stock group details
     *
     * @param {string} groupUniqueName
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public getStockGroup(stockGroupUniqueName: string): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVENTORY_API.GET_STOCK_GROUP;
        url = url?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        url = url?.replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName));

        return this.http.get(url).pipe(map((res) => {
            let data: BaseResponse<NewBranchTransferResponse, string> = res;
            data.request = stockGroupUniqueName;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<NewBranchTransferResponse, string>(e, stockGroupUniqueName)));
    }

    /**
     * This will update the stock group
     *
     * @param {*} model
     * @param {string} groupUniqueName
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public updateStockGroup(model: any, groupUniqueName: string): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVENTORY_API.V5.UPDATE_STOCK_GROUP;
        url = url?.replace(":companyUniqueName", companyUniqueName);
        url = url?.replace(':groupUniqueName', encodeURIComponent(groupUniqueName));

        return this.http.put(url, model)
            .pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, companyUniqueName)));
    }

    /**
     * Delete Stock
     */
    public deleteStock(stockGroupUniqueName: string, stockUniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + INVENTORY_API.DELETE_STOCK_V2?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName))?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName))).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.request = '';
            data.queryString = { stockGroupUniqueName, stockUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '', {
            stockGroupUniqueName,
            stockUniqueName
        })));
    }

    /**
     * This will use for create stock in inventory v2
     *
     * @param {*} model
     * @param {*} stockGroupUniqueName
     * @param {string} [moduleType='']
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public createStock(model: any, stockGroupUniqueName: any, moduleType: string = ''): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVENTORY_API.CREATE_STOCK_V2;
        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        url = url?.replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName));
        url = url?.replace(':type', encodeURIComponent(moduleType));
        return this.http.post(url, model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * This wil use for get stock in inventory v2
     *
     * @param {string} stockUniqueName
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public getStockV2(stockUniqueName: string): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVENTORY_API.GET_STOCK_V2;
        url = url?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        url = url?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName));

        return this.http.get(url).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.request = stockUniqueName;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, stockUniqueName)));
    }

    /**
     * . This will use for update stock
     *
     * @param {*} model
     * @param {*} stockGroupUniqueName
     * @param {string} stockUniqueName
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public updateStockV2(model: any, stockGroupUniqueName: any, stockUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVENTORY_API.UPDATE_STOCK_V2;
        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        url = url?.replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName));
        url = url?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName));

        return this.http.put(url, model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    public getStock(stockUniqueName: string): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVENTORY_API.NEW.GET;
        url = url?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        url = url?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName));

        return this.http.get(url).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.request = stockUniqueName;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, stockUniqueName)));
    }

    public updateStock(model: any, stockGroupUniqueName: any, stockUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVENTORY_API.NEW.UPDATE;
        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        url = url?.replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName));
        url = url?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName));

        return this.http.put(url, model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * This will use for search stock transaction report
     *
     * @param {*} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public searchStockTransactionReport(model: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVENTORY_API.SEARCH_STOCK_TRANSACTION_FILTERS;
        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
        return this.http.post(url, model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            data.queryString = {
                type: model.type
            }
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model, {
            type: model.type
        })));
    }

    /**
     * This will use for get stock transaction report
     *
     * @param {StockTransactionReportRequest} stockReportRequest
     * @return {*}  {Observable<BaseResponse<StockReportResponse, StockTransactionReportRequest>>}
     * @memberof InventoryService
     */
    public getStockTransactionReport(stockReportRequest: StockTransactionReportRequest): Observable<BaseResponse<StockReportResponse, StockTransactionReportRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let updatedStockTransactionRequest = cloneDeep(stockReportRequest);
        delete updatedStockTransactionRequest.from;
        delete updatedStockTransactionRequest.to;
        return this.http.post(this.config.apiUrl + INVENTORY_API.TRANSACTION_STOCK_REPORT_V2?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':stockGroupUniqueName', encodeURIComponent(<any>stockReportRequest.stockGroupUniqueNames))
            ?.replace(':stockUniqueName', encodeURIComponent(<any>stockReportRequest.stockUniqueNames))
            ?.replace(':transactionType', encodeURIComponent(stockReportRequest.transactionType ? stockReportRequest.transactionType?.toString() : 'all'))
            ?.replace(':from', encodeURIComponent(stockReportRequest.from))
            ?.replace(':to', encodeURIComponent(stockReportRequest.to))
            ?.replace(':count', encodeURIComponent(stockReportRequest.count?.toString()))
            ?.replace(':page', encodeURIComponent(stockReportRequest.page?.toString()))
            ?.replace(':sort', encodeURIComponent(stockReportRequest.sort ? stockReportRequest.sort?.toString() : ''))
            ?.replace(':sortBy', encodeURIComponent(stockReportRequest.sortBy ? stockReportRequest.sortBy?.toString() : ''))
            , updatedStockTransactionRequest).pipe(
                map((res) => {
                    let data: BaseResponse<StockReportResponse, StockTransactionReportRequest> = res;
                    data.request = updatedStockTransactionRequest;
                    data.queryString = {
                        stockGroupUniqueName: stockReportRequest.stockGroupUniqueNames,
                        stockUniqueName: stockReportRequest.stockUniqueNames,
                        from: stockReportRequest.from,
                        to: stockReportRequest.to,
                        count: stockReportRequest.count,
                        page: stockReportRequest.page
                    };
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<StockReportResponse, StockTransactionReportRequest>(e, stockReportRequest, {
                    stockGroupUniqueName: stockReportRequest.stockGroupUniqueNames,
                    stockUniqueName: stockReportRequest.stockUniqueNames,
                    from: stockReportRequest.from,
                    to: stockReportRequest.to,
                    count: stockReportRequest.count,
                    page: stockReportRequest.page
                })));
    }

    /**
     * This will use for get stock transaction report balance
     *
     * @param {StockTransactionReportRequest} stockReportRequest
     * @return {*}  {Observable<BaseResponse<StockReportResponse, StockTransactionReportRequest>>}
     * @memberof InventoryService
     */
    public getStockTransactionReportBalance(queryParams: any, stockReportRequest: StockTransactionReportRequest): Observable<BaseResponse<StockReportResponse, StockTransactionReportRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVENTORY_API.TRANSACTION_STOCK_REPORT_BALANCE_V2?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':stockGroupUniqueName', encodeURIComponent(<any>queryParams.stockGroupUniqueName))
            ?.replace(':stockUniqueName', encodeURIComponent(<any>queryParams.stockUniqueNames))
            ?.replace(':entity', encodeURIComponent(<any>queryParams.entity))
            ?.replace(':from', encodeURIComponent(queryParams.from))
            ?.replace(':to', encodeURIComponent(queryParams.to))
            , stockReportRequest).pipe(
                map((res) => {
                    let data: BaseResponse<StockReportResponse, StockTransactionReportRequest> = res;
                    data.request = queryParams;
                    data.queryString = {
                        stockGroupUniqueName: queryParams.stockGroupUniqueName,
                        stockUniqueName: queryParams.stockUniqueNames,
                        from: queryParams.from,
                        to: queryParams.to
                    };
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<StockReportResponse, StockTransactionReportRequest>(e, stockReportRequest, {
                    stockGroupUniqueName: queryParams.stockGroupUniqueName,
                    stockUniqueName: queryParams.stockUniqueNames,
                    from: queryParams.from,
                    to: queryParams.to
                })));
    }

    /**
     * This will use for export inventory transaction report
     *
     * @param {*} queryParams
     * @param {InventoryReportRequestExport} stockReportRequest
     * @return {*}  {Observable<BaseResponse<InventoryReportRequestExport, InventoryReportRequest>>}
     * @memberof InventoryService
     */
    public getTransactionReportExport(queryParams: any, stockReportRequest: InventoryReportRequestExport): Observable<BaseResponse<InventoryReportRequestExport, InventoryReportRequest>> {
            this.companyUniqueName = this.generalService.companyUniqueName;
            return this.http.post(this.config.apiUrl + INVENTORY_API.INVENTORY_TRANSACTION_EXPORT
                ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
                ?.replace(':from', encodeURIComponent(queryParams?.from))
                ?.replace(':to', encodeURIComponent(queryParams?.to))
                , stockReportRequest).pipe(
                    map((res) => {
                        let data: BaseResponse<InventoryReportRequestExport, InventoryReportRequest> = res;
                        return data;
                    }), catchError((e) => this.errorHandler.HandleCatch<InventoryReportRequestExport, InventoryReportRequest>(e, stockReportRequest, {
                        from: queryParams.from,
                        to: queryParams.to
                    })));
    }


    /**
     * This will use for get inventory gorup report
     *
     * @param {InventoryReportRequest} stockReportRequest
     * @return {*}  {Observable<BaseResponse<InventoryReportResponse, InventoryReportRequest>>}
     * @memberof InventoryService
     */
    public getGroupWiseReport(queryParams: any, stockReportRequest: InventoryReportRequest): Observable<BaseResponse<InventoryReportResponse, InventoryReportRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVENTORY_API.INVENTORY_GROUP_WISE_REPORT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':from', encodeURIComponent(queryParams.from))
            ?.replace(':stockGroupUniqueName', queryParams?.stockGroupUniqueName)
            ?.replace(':to', encodeURIComponent(queryParams.to))
            ?.replace(':count', encodeURIComponent(queryParams.count?.toString()))
            ?.replace(':page', encodeURIComponent(queryParams.page?.toString()))
            ?.replace(':sort', encodeURIComponent(queryParams.sort ? queryParams.sort?.toString() : ''))
            ?.replace(':sortBy', encodeURIComponent(queryParams.sortBy ? queryParams.sortBy?.toString() : ''))

            , stockReportRequest).pipe(
                map((res) => {
                    let data: BaseResponse<InventoryReportResponse, InventoryReportRequest> = res;
                    data.request = queryParams;
                    data.queryString = {
                        from: queryParams.from,
                        to: queryParams.to,
                        count: queryParams.count,
                        page: queryParams.page,
                        type: queryParams.type
                    };
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<InventoryReportResponse, InventoryReportRequest>(e, stockReportRequest, {
                    from: queryParams.from,
                    to: queryParams.to,
                    count: queryParams.count,
                    page: queryParams.page,
                    type: queryParams.type
                })));
    }

    /**
     * This will use for export inventory group report
     *
     * @param {*} queryParams
     * @param {InventoryReportRequestExport} stockReportRequest
     * @return {*}  {Observable<BaseResponse<InventoryReportRequestExport, InventoryReportRequest>>}
     * @memberof InventoryService
     */
    public getGroupWiseReportExport(queryParams: any, stockReportRequest: InventoryReportRequestExport): Observable<BaseResponse<InventoryReportRequestExport, InventoryReportRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVENTORY_API.INVENTORY_GROUP_WISE_EXPORT
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':from', encodeURIComponent(queryParams?.from))
            ?.replace(':to', encodeURIComponent(queryParams?.to))
            , stockReportRequest).pipe(
                map((res) => {
                    let data: BaseResponse<InventoryReportRequestExport, InventoryReportRequest> = res;
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<InventoryReportRequestExport, InventoryReportRequest>(e, stockReportRequest, {
                    from: queryParams.from,
                    to: queryParams.to
                })));
    }

    /**
     *This will use for get inventory stock  report
     *
     * @param {InventoryReportRequest} stockReportRequest
     * @return {*}  {Observable<BaseResponse<InventoryReportResponse, InventoryReportRequest>>}
     * @memberof InventoryService
     */
    public getItemWiseReport(queryParams: any, stockReportRequest: InventoryReportRequest): Observable<BaseResponse<InventoryReportResponse, InventoryReportRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVENTORY_API.INVENTORY_ITEM_WISE_REPORT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':from', encodeURIComponent(queryParams.from))
            ?.replace(':to', encodeURIComponent(queryParams.to))
            ?.replace(':count', encodeURIComponent(queryParams.count?.toString()))
            ?.replace(':page', encodeURIComponent(queryParams.page?.toString()))
            ?.replace(':sort', encodeURIComponent(queryParams.sort ? queryParams.sort?.toString() : ''))
            ?.replace(':sortBy', encodeURIComponent(queryParams.sortBy ? queryParams.sortBy?.toString() : ''))
            ?.replace(':type', encodeURIComponent(queryParams.type))
            , stockReportRequest).pipe(
                map((res) => {
                    let data: BaseResponse<InventoryReportResponse, InventoryReportRequest> = res;
                    data.request = queryParams;
                    data.queryString = {
                        from: queryParams.from,
                        to: queryParams.to,
                        count: queryParams.count,
                        page: queryParams.page,
                        type: queryParams.type
                    };
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<InventoryReportResponse, InventoryReportRequest>(e, stockReportRequest, {
                    from: queryParams.from,
                    to: queryParams.to,
                    count: queryParams.count,
                    page: queryParams.page,
                    type: queryParams.type
                })));
    }

    /**
     * This will use for export inventory stock report
     *
     * @param {*} queryParams
     * @param {InventoryReportRequestExport} stockReportRequest
     * @return {*}  {Observable<BaseResponse<InventoryReportRequestExport, InventoryReportRequest>>}
     * @memberof InventoryService
     */
    public getItemWiseReportExport(queryParams: any, stockReportRequest: InventoryReportRequestExport): Observable<BaseResponse<InventoryReportRequestExport, InventoryReportRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVENTORY_API.INVENTORY_ITEM_WISE_EXPORT
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':from', encodeURIComponent(queryParams?.from))
            ?.replace(':to', encodeURIComponent(queryParams?.to))
            , stockReportRequest).pipe(
                map((res) => {
                    let data: BaseResponse<InventoryReportRequestExport, InventoryReportRequest> = res;
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<InventoryReportRequestExport, InventoryReportRequest>(e, stockReportRequest, {
                    from: queryParams.from,
                    to: queryParams.to
                })));
    }

    /**
     *This will use for get inventory variant report
     *
     * @param {InventoryReportRequest} stockReportRequest
     * @return {*}  {Observable<BaseResponse<InventoryReportResponse, InventoryReportRequest>>}
     * @memberof InventoryService
     */
    public getVariantWiseReport(queryParams: any, stockReportRequest: InventoryReportRequest): Observable<BaseResponse<InventoryReportResponse, InventoryReportRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVENTORY_API.INVENTORY_VARIANT_WISE_REPORT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':from', encodeURIComponent(queryParams.from))
            ?.replace(':to', encodeURIComponent(queryParams.to))
            ?.replace(':count', encodeURIComponent(queryParams.count?.toString()))
            ?.replace(':page', encodeURIComponent(stockReportRequest.page?.toString()))
            ?.replace(':sort', encodeURIComponent(queryParams.sort ? queryParams.sort?.toString() : ''))
            ?.replace(':sortBy', encodeURIComponent(queryParams.sortBy ? queryParams.sortBy?.toString() : ''))
            , stockReportRequest).pipe(
                map((res) => {
                    let data: BaseResponse<InventoryReportResponse, InventoryReportRequest> = res;
                    data.queryString = {
                        from: queryParams.from,
                        to: queryParams.to,
                        count: queryParams.count,
                        page: queryParams.page,
                        type: queryParams.type
                    };
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<InventoryReportResponse, InventoryReportRequest>(e, stockReportRequest, {
                    from: queryParams.from,
                    to: queryParams.to,
                    count: queryParams.count,
                    page: queryParams.page,
                    type: queryParams.type
                })));
    }

    /**
     * This will use for export inventory variant report
     *
     * @param {*} queryParams
     * @param {InventoryReportRequestExport} stockReportRequest
     * @return {*}  {Observable<BaseResponse<InventoryReportRequestExport, InventoryReportRequest>>}
     * @memberof InventoryService
     */
    public getVariantWiseReportExport(queryParams: any, stockReportRequest: InventoryReportRequestExport): Observable<BaseResponse<InventoryReportRequestExport, InventoryReportRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVENTORY_API.INVENTORY_VARIANT_WISE_EXPORT
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':from', encodeURIComponent(queryParams?.from))
            ?.replace(':to', encodeURIComponent(queryParams?.to))
            , stockReportRequest).pipe(
                map((res) => {
                    let data: BaseResponse<InventoryReportRequestExport, InventoryReportRequest> = res;
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<InventoryReportRequestExport, InventoryReportRequest>(e, stockReportRequest, {
                    from: queryParams.from,
                    to: queryParams.to
                })));
    }

    /**
     * Get list of stocks for v2 companies
     *
     * @param {*} payload
     * @returns {Observable<BaseResponse<StocksResponse, string>>}
     * @memberof InventoryService
     */
    public getStocksV2(payload: any): Observable<BaseResponse<StocksResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVENTORY_API.STOCKS_V2?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        let delimiter = '?';
        if (payload.inventoryType) {
            url = url.concat(`${delimiter}inventoryType=${payload.inventoryType}`);
            delimiter = '&';
        }
        if (payload.q) {
            url = url.concat(`${delimiter}q=${payload.q}`);
            delimiter = '&';
        }
        if (payload.page) {
            url = url.concat(`${delimiter}page=${payload.page}&count=${payload.count || PAGINATION_LIMIT}`);
        }

        return this.http.get(url).pipe(map((res) => {
            let data: BaseResponse<StocksResponse, string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StocksResponse, string>(e, '', {})));
    }

    /**
     * Get list of stock unit groups
     *
     * @returns {Observable<BaseResponse<any[], string>>}
     * @memberof InventoryService
     */
    public getStockUnitGroups(): Observable<BaseResponse<any[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.GET_STOCK_UNIT_GROUPS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any[], string>(e, '', {})));
    }

    /**
     * Create stock unit group
     *
     * @returns {Observable<BaseResponse<any[], string>>}
     * @memberof InventoryService
     */
    public createStockUnitGroup(model: any): Observable<BaseResponse<any[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVENTORY_API.GET_STOCK_UNIT_GROUPS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any[], string>(e, '', {})));
    }

    /**
     * Update stock unit group
     *
     * @param {*} model
     * @param {string} groupUniqueName
     * @returns {Observable<BaseResponse<any[], string>>}
     * @memberof InventoryService
     */
    public updateStockUnitGroup(model: any, groupUniqueName: string): Observable<BaseResponse<any[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + INVENTORY_API.UPDATE_STOCK_UNIT_GROUP?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':groupUniqueName', encodeURIComponent(groupUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any[], string>(e, '', {})));
    }

    /**
     * Deletes stock unit group
     *
     * @param {string} uniqueName
     * @returns {Observable<BaseResponse<string, string>>}
     * @memberof InventoryService
     */
    public deleteStockUnitGroup(uniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + INVENTORY_API.UPDATE_STOCK_UNIT_GROUP?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':groupUniqueName', uniqueName)).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.request = uniqueName;
            data.queryString = { uniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, uniqueName, { uniqueName })));
    }

    /**
     * Get top level groups of inventory
     *
     * @param {string} inventoryType
     * @param {string} [page='1']
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof InventoryService
     */
    public getTopLevelGroups(inventoryType: string, page: string = '1'): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.MASTER.TOP_INVENTORY_GROUPS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':inventoryType', encodeURIComponent(inventoryType))?.replace(':page', encodeURIComponent(page))?.replace(':count', '200')).pipe(map((res) => {
            let data: BaseResponse<any[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any[], string>(e, '', {})));
    }

    /**
     * Get stock/groups by group unique name
     *
     * @param {string} stockGroupUniqueName
     * @param {string} [page='1']
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof InventoryService
     */
    public getMasters(stockGroupUniqueName: string, page: string = '1'): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.MASTER.GET_MASTER?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockGroupUniqueName', encodeURIComponent(stockGroupUniqueName))?.replace(':page', encodeURIComponent(page))?.replace(':count', '200')).pipe(map((res) => {
            let data: BaseResponse<any[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any[], string>(e, '', {})));
    }

    /**
     * Search inventory
     *
     * @param {string} inventoryType
     * @param {string} [q='']
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof InventoryService
     */
    public searchInventory(inventoryType: string, q: string = ''): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.MASTER.SEARCH?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':inventoryType', encodeURIComponent(inventoryType))?.replace(':q', encodeURIComponent(q))).pipe(map((res) => {
            let data: BaseResponse<any[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any[], string>(e, '', {})));
    }

    /**
    * Get Bulk stock list
    *
    * @param {string} request
    * @returns {Observable<BaseResponse<any, string>>}
    * @memberof InventoryService
    */
    public getBulkStockList(request: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let apiUrl = this.config.apiUrl + INVENTORY_API.GET_BULK_STOCK_WITH_INVENTROY_TYPE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':page', encodeURIComponent(request.page))?.replace(':count', encodeURIComponent(request.count))?.replace(':inventoryType', encodeURIComponent(request.inventoryType));
        return this.http.post(apiUrl, request.body);
    }

    /**
     * Get Customer/Vendor Wise Discount Default Customer list
     *
     * @param {*} request
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public getCustomerVendorDiscountUserList(request: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let apiUrl = this.config.apiUrl + INVENTORY_API.GET_CUSTOMER_VENDOR_DISCOUNT_USERS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':page', encodeURIComponent(request.page))?.replace(':count', encodeURIComponent(request.count))?.replace(':group', encodeURIComponent(request.group))?.replace(':userType', encodeURIComponent(request.userType))?.replace(':query', encodeURIComponent(request.query || ''));

        return this.http.get(apiUrl).pipe(map((res) => {
            let data: BaseResponse<any[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any[], string>(e, '', {})));
    }

    /**
     * Get Customer/Vendor Wise Discount All Customer and Group list
     *
     * @param {*} request
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public getFlattenAccountsList(request: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let apiUrl = this.config.apiUrl + INVENTORY_API.GET_FLATTEN_ACCOUNTS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':page', encodeURIComponent(request.page))?.replace(':count', encodeURIComponent(request.count))?.replace(':group', encodeURIComponent(request.group))?.replace(':query', encodeURIComponent(request.query || ''));

        return this.http.get(apiUrl).pipe(map((res) => {
            let data: BaseResponse<any[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any[], string>(e, '', {})));
    }

    /**
    * Get Customer/Vendor Wise Discount Customer list
    *
    * @param {*} request
    * @return {*}  {Observable<BaseResponse<any, any>>}
    * @memberof InventoryService
    */
    public getStockList(request: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let apiUrl = this.config.apiUrl + INVENTORY_API.GET_ALL_STOCKS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':page', encodeURIComponent(request.page))?.replace(':count', encodeURIComponent(request.count))?.replace(':query', encodeURIComponent(request.query || ''));

        return this.http.get(apiUrl).pipe(map((res) => {
            let data: BaseResponse<any[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any[], string>(e, '', {})));
    }

    /**
     * Get list of stock and its variant based on user (uniqueName)
     *
     * @param {*} request
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public getAllDiscount(request: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let apiUrl = this.config.apiUrl + INVENTORY_API.GET_ALL_DISCOUNTS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':page', encodeURIComponent(request.page))?.replace(':count', encodeURIComponent(request.count))?.replace(':uniqueName', encodeURIComponent(request.uniqueName))?.replace(':query', encodeURIComponent(request.query || ''));

        return this.http.get(apiUrl).pipe(map((res) => {
            let data: BaseResponse<any[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any[], string>(e, '', {})));
    }

    /**
     * This is used to delete Customer/Vendor wise discount User, Stock and Variants
     *
     * Key "userUniqueName" is mandatory
     *
     * @param {*} request
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public deleteDiscountRecord(request: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let apiUrl = this.config.apiUrl + INVENTORY_API.DELETE_DISCOUNT_RECORD?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockUniqueName', encodeURIComponent(request.stockUniqueName))?.replace(':variantUniqueName', encodeURIComponent(request.variantUniqueName))?.replace(':userUniqueName', encodeURIComponent(request.userUniqueName));

        return this.http.delete(apiUrl).pipe(map((res) => {
            let data: BaseResponse<any[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any[], string>(e, '', {})));
    }

    /**
     * Create New discount and add new variant in existing stock
     *
     * @param {string} stockUniqueName
     * @param {CreateDiscount} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public createDiscount(stockUniqueName: string, model: CreateDiscount): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let apiUrl = this.config.apiUrl + INVENTORY_API.CREATE_DISCOUNT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName));

        return this.http.post(apiUrl, model).pipe(map((res) => {
            let data: BaseResponse<any[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any[], string>(e, '', {})));
    }

    /**
     * Update Discount for variant each key using Patch API
     *
     * @param {string} stockUniqueName
     * @param {string} variantUniqueName
     * @param {CreateDiscount} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public updateDiscount(stockUniqueName: string, variantUniqueName: string, model: CreateDiscount): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let apiUrl = this.config.apiUrl + INVENTORY_API.UPDATE_DISCOUNT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName))?.replace(':variantUniqueName', encodeURIComponent(variantUniqueName));

        return this.http.patch(apiUrl, model).pipe(map((res) => {
            let data: BaseResponse<any[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any[], string>(e, '', {})));
    }

    /**
     * Get Stockwise All Variant and Units List
     *
     * @param {string} stockUniqueName
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public getStockDetails(stockUniqueName: string, userType: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let apiUrl = this.config.apiUrl + INVENTORY_API.GET_STOCK_DETAILS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName))?.replace(':userType', encodeURIComponent(userType));

        return this.http.get(apiUrl).pipe(map((res) => {
            let data: BaseResponse<any[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any[], string>(e, '', {})));
    }

    /**
     * This will be use for get all adjustments inventory report
     *
     * @param {*} getParams
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public getAdjustmentInventoryReport(getParams: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVENTORY_API.INVENTORY_ADJUST.REPORT
            ?.replace(":companyUniqueName", this.companyUniqueName)
            ?.replace(":from", getParams.from)
            ?.replace(":to", getParams.to)
            ?.replace(":page", getParams.page)
            ?.replace(":count", getParams.count)
            ?.replace(":sortBy", getParams.sortBy ? getParams.sortBy?.toString() : '')
            ?.replace(":sort", getParams.sort ? getParams.sort?.toString() : '')
            ?.replace(":q", getParams.q ? getParams.q?.toString() : '')
            ?.replace(":searchBy", getParams.q ? getParams.searchBy?.toString() : '')
            ?.replace(":inventoryType", getParams.inventoryType ? getParams.inventoryType?.toString() : '');
        if (getParams.branchUniqueName) {
            const branchUniqueName = getParams.branchUniqueName !== this.companyUniqueName ? getParams.branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${encodeURIComponent(branchUniqueName)}`);
        }
        return this.http.post(url, {})
            .pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, {})));
    }

    /**
     * This will be use for delete inventory adjustment
     *
     * @param {string} referenceNo
     * @return {*}  {Observable<BaseResponse<string, string>>}
     * @memberof InventoryService
     */
    public deleteInventoryAdjust(referenceNo: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + INVENTORY_API.INVENTORY_ADJUST.DELETE
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':referenceNo', encodeURIComponent(referenceNo)
            )).pipe(map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = '';
                data.queryString = { referenceNo };
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '', { referenceNo })));
    }


    /**
    * This will be use for get inventory adjustment
    *
    * @param {string} referenceNo
    * @return {*}  {Observable<BaseResponse<string, string>>}
    * @memberof InventoryService
    */
    public getInventoryAdjust(referenceNo: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.INVENTORY_ADJUST.GET
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':referenceNo', encodeURIComponent(referenceNo)
            )).pipe(map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = '';
                data.queryString = { referenceNo };
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '', { referenceNo })));
    }

    /**
     * Get Inventory Adjust Reasons
     *
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public getInventoryAdjustReasons(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVENTORY_API.INVENTORY_ADJUST.GET_REASON
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<StockGroupResponse, string>(e, '', {})));
    }

    /**
     * This will be use for create inventory adjust reason
     *
     * @param {string} referenceNo
     * @return {*}  {Observable<BaseResponse<string, string>>}
     * @memberof InventoryService
     */
    public createInventoryAdjustReason(reason: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVENTORY_API.INVENTORY_ADJUST.CREATE_REASON?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            , reason).pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = { reason };
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<StockGroupResponse, StockGroupRequest>(e, reason)));
    }

    /**
     * This will be use for create inventory adjust
     *
     * @param {*} model
     * @param {string} branchUniqueName
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InventoryService
     */
    public createInventoryAdjustment(model: any, branchUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVENTORY_API.INVENTORY_ADJUST.CREATE_INVENTORY
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':branchUniqueName', encodeURIComponent(branchUniqueName))
            , model).pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = { model };
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<StockGroupResponse, StockGroupRequest>(e, model)));
    }

    /**
   * This will be use for update inventory adjust
   *
   * @param {*} model
   * @param {string} branchUniqueName
   * @return {*}  {Observable<BaseResponse<any, any>>}
   * @memberof InventoryService
   */
    public updateInventoryAdjustment(model: any, branchUniqueName: string): Observable<BaseResponse<any, any>> {
        let refNo = model.refNo;
        delete model.refNo;
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + INVENTORY_API.INVENTORY_ADJUST.UPDATE_INVENTORY
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':branchUniqueName', encodeURIComponent(branchUniqueName))
            ?.replace(':refNo', encodeURIComponent(refNo))
            , model).pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = { model };
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<StockGroupResponse, StockGroupRequest>(e, model)));
    }
}
