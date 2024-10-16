import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './http-wrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { MANUFACTURING_API } from './apiurls/manufacturing.api';
import { ICommonResponseOfManufactureItem, IManufacturingItemRequest, IManufacturingUnqItemObj, IMfStockSearchRequest } from '../models/interfaces/manufacturing.interface';
import { StocksResponse } from '../models/api-models/Inventory';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class ManufacturingService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService, private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * create manufacturing item
     * URL:: company/:companyUniqueName/stock/:stockUniqueName/manufacture
     * get resuest model and stock uniquename
     */
    public CreateManufacturingItem(model: IManufacturingItemRequest, stockUniqueName: string): Observable<BaseResponse<ICommonResponseOfManufactureItem, IManufacturingItemRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + MANUFACTURING_API.CREATE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<ICommonResponseOfManufactureItem, IManufacturingItemRequest> = res;
            data.request = model;
            data.queryString = { stockUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<ICommonResponseOfManufactureItem, IManufacturingItemRequest>(e, model)));
    }

    /**
     * Update manufacturing item
     * URL:: company/:companyUniqueName/stock/:stockUniqueName/manufacture/:manufacturingUniqueName
     */
    public UpdateManufacturingItem(model: IManufacturingItemRequest, reqModal: IManufacturingUnqItemObj): Observable<BaseResponse<ICommonResponseOfManufactureItem, IManufacturingItemRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + MANUFACTURING_API.UPDATE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockUniqueName', reqModal.stockUniqueName)?.replace(':manufacturingUniqueName', reqModal.manufacturingUniqueName), model).pipe(map((res) => {
            let data: BaseResponse<ICommonResponseOfManufactureItem, IManufacturingItemRequest> = res;
            data.request = model;
            data.queryString = reqModal;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<ICommonResponseOfManufactureItem, IManufacturingItemRequest>(e, model)));
    }

    /**
     * Delete manufacturing item
     * URL:: company/:companyUniqueName/stock/:stockUniqueName/manufacture/:manufacturingUniqueName
     */
    public DeleteManufacturingItem(model: IManufacturingUnqItemObj): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + MANUFACTURING_API.DELETE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockUniqueName', encodeURIComponent(model.stockUniqueName))?.replace(':manufacturingUniqueName', model.manufacturingUniqueName)).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.request = '';
            data.queryString = { model };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '', { model })));
    }

    /**
     * get manufacturing report details
     * URL:: company/:companyUniqueName/stock/manufacture-report
     */
    public GetMfReport(model: IMfStockSearchRequest): Observable<BaseResponse<StocksResponse, IMfStockSearchRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        // create url conditionally
        let url = this.config.apiUrl + MANUFACTURING_API.MF_REPORT;
        if ((model.warehouseUniqueName)) {
            url = url + 'warehouseUniqueName=' + encodeURIComponent(model.warehouseUniqueName) + '&';
        }
        if ((model.product)) {
            url = url + 'product=' + model.product + '&';
        }
        if ((model.productVariant)) {
            url = url + 'productVariant=' + model.productVariant + '&';
        }
        if ((model.searchBy)) {
            url = url + 'searchBy=' + model.searchBy + '&';
        }
        if ((model.searchOperation)) {
            url = url + 'searchOperation=' + model.searchOperation + '&';
        }
        if ((model.searchValue)) {
            url = url + 'searchValue=' + model.searchValue + '&';
        }
        if ((model.inventoryType)) {
            url = url + 'inventoryType=' + model.inventoryType + '&';
        }
        if ((model.from)) {
            url = url + 'from=' + model.from + '&';
        }
        if ((model.to)) {
            url = url + 'to=' + model.to + '&';
        }
        if ((model.page)) {
            url = url + 'page=' + model.page + '&';
        }
        if ((model.count)) {
            url = url + 'count=' + model.count;
        }
        if (this.generalService.currentBranchUniqueName) {
            // model.branchUniqueName = model.branchUniqueName !== this.companyUniqueName ? model.branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${encodeURIComponent(this.generalService.currentBranchUniqueName)}`)
        }

        return this.http.get(url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(
            map((res) => {
                let data: BaseResponse<StocksResponse, IMfStockSearchRequest> = res;
                data.request = model;
                data.queryString = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<StocksResponse, IMfStockSearchRequest>(e, model)));
    }

    /**
     * get stock with rate
     * URL:: /company/:companyUniqueName/stock/:stockUniqueName/link-with-rates
     */
    public GetStockWithRate(model: IManufacturingUnqItemObj): Observable<BaseResponse<ICommonResponseOfManufactureItem, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + MANUFACTURING_API.GET_STOCK_WITH_RATE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockUniqueName', encodeURIComponent(model.stockUniqueName))).pipe(
            map((res) => {
                let data: BaseResponse<ICommonResponseOfManufactureItem, string> = res;
                data.queryString = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<ICommonResponseOfManufactureItem, string>(e, '')));
    }

    /**
     * Get recipe for variant
     *
     * @param {string} stockUniqueName
     * @param {string[]} variantUniqueNames
     * @param {boolean} [withRate=false]
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof ManufacturingService
     */
    public getVariantRecipe(stockUniqueName: string, variantUniqueNames: string[] = [], withRate: boolean = false): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + MANUFACTURING_API.GET_RECIPE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName))?.replace(':withRate', String(withRate)), variantUniqueNames).pipe(
            map((res) => {
                let data: BaseResponse<any, string> = res;
                data.queryString = stockUniqueName;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '')));
    }

    /**
     * Get rate for stock
     *
     * @param {string} stockUniqueName
     * @param {*} model
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof ManufacturingService
     */
    public getRateForStockV2(stockUniqueName: string, model: any): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + MANUFACTURING_API.GET_RATE_FOR_STOCK?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, string> = res;
                data.queryString = stockUniqueName;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<ICommonResponseOfManufactureItem, string>(e, '')));
    }

    /**
     * Saves manufacturing details
     *
     * @param {string} stockUniqueName
     * @param {*} model
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof ManufacturingService
     */
    public saveManufacturing(stockUniqueName: string, model: any): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + MANUFACTURING_API.CREATE_V2?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, string> = res;
                data.queryString = stockUniqueName;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '')));
    }

    /**
     * Saves recipe details
     *
     * @param {string} stockUniqueName
     * @param {*} model
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof ManufacturingService
     */
    public saveRecipe(stockUniqueName: string, model: any): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + MANUFACTURING_API.CREATE_RECIPE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':stockUniqueName', encodeURIComponent(stockUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, string> = res;
                data.queryString = stockUniqueName;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '')));
    }

    /**
     * Get manufacturing details
     *
     * @param {string} manufactureUniqueName
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof ManufacturingService
     */
    public getManufacturingDetails(manufactureUniqueName: string): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + MANUFACTURING_API.GET_MANUFACTURING?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':manufactureUniqueName', encodeURIComponent(manufactureUniqueName))).pipe(
            map((res) => {
                let data: BaseResponse<any, string> = res;
                data.queryString = manufactureUniqueName;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '')));
    }

    /**
     * Delete manufacturing
     *
     * @param {string} manufactureUniqueName
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof ManufacturingService
     */
    public deleteManufacturing(manufactureUniqueName: string): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + MANUFACTURING_API.GET_MANUFACTURING?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':manufactureUniqueName', encodeURIComponent(manufactureUniqueName))).pipe(
            map((res) => {
                let data: BaseResponse<any, string> = res;
                data.queryString = manufactureUniqueName;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '')));
    }

    /**
     * Update manufacturing
     *
     * @param {string} manufactureUniqueName
     * @param {*} model
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof ManufacturingService
     */
    public updateManufacturing(manufactureUniqueName: string, model: any): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + MANUFACTURING_API.GET_MANUFACTURING?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':manufactureUniqueName', encodeURIComponent(manufactureUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, string> = res;
                data.queryString = manufactureUniqueName;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '')));
    }

    /**
     * Gets linked stock units by stock unit unique name
     *
     * @param {string} stockUnitUniqueName
     * @returns {Observable<Array<any>>}
     * @memberof ManufacturingService
     */
    public loadStockUnits(stockUnitUniqueName: string): Observable<Array<any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        const url = this.config.apiUrl + MANUFACTURING_API.GET_STOCK_UNITS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':stockUnitUniqueName', encodeURIComponent(stockUnitUniqueName));
        return this.http.get(url).pipe(map((res) => res.body),catchError(e => this.errorHandler.HandleCatch<string, string>(e, '')));
    }
}
