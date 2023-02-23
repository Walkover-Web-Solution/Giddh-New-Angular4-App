import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { WAREHOUSE_API } from '../settings/warehouse/constants/warehouse.constant';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { HttpWrapperService } from './httpWrapper.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { WareHouseResponse } from '../models/api-models/Warehouse';

/**
 * Provider to carry out warehouse related operations
 *
 * @export
 * @class SettingsWarehouseService
 */
@Injectable({
    providedIn: 'root'
})
export class SettingsWarehouseService {

    /** @ignore */
    constructor(
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs,
        private errorHandler: GiddhErrorHandler,
        private generalService: GeneralService,
        private http: HttpWrapperService,
    ) { }

    /**
     * Sends the create warehouse request to server
     *
     * @param {*} params Request parameter required for the service
     * @returns {Observable<BaseResponse<any, any>>} Observable of create warehouse to carry out further operations
     * @memberof SettingsWarehouseService
     */
    public createWarehouse(params: any): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + WAREHOUSE_API.CREATE?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)), params).pipe(
            map((response) => {
                let data: BaseResponse<any, any> = response;
                data.request = params;
                return data;
            }), catchError((error) => this.errorHandler.HandleCatch<any, any>(error, params)));
    }

    /**
     *Sends the fetch warehouse request to server
     *
     * @param {*} params  Request parameter required for the service
     * @param {*} [branchUniqueName]
     * @return {*}  {Observable<BaseResponse<any, any>>} Observable of fetch warehouse to carry out further operations
     * @memberof SettingsWarehouseService
     */
    public fetchAllWarehouse(params: any, branchUniqueName?: any): Observable<BaseResponse<any, any>> {
        const companyUniqueName: string = this.generalService.companyUniqueName;
        let contextPath: string = `${this.config.apiUrl}${WAREHOUSE_API.FETCH
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
            ?.replace(':page', params.page)
            }`;
        if (branchUniqueName) {
            contextPath = contextPath.concat(`&&branchUniqueName=${branchUniqueName}`);
        }
        if (Number.isInteger(params.count)) {
            contextPath = contextPath.concat(`&count=${params.count}`);
        }
        if (params.query) {
            contextPath = contextPath.concat(`&q=${params.query}`);
        }
        return this.http.get(contextPath).pipe(
            map((response) => {
                let data: BaseResponse<any, any> = response;
                return data;
            }), catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
    }

    /**
     * Sends the update warehouse request to server
     *
     * @param {*} params Request parameter required for the service
     * @returns {Observable<BaseResponse<any, any>>} Observable of update warehouse to carry out further operations
     * @memberof SettingsWarehouseService
     */
    public updateWarehouse(params: any): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        const contextPath = WAREHOUSE_API.UPDATE?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
            ?.replace(':warehouseUniqueName', params.warehouseUniqueName);
        return this.http.put(this.config.apiUrl + contextPath, params).pipe(
            map((response) => {
                let data: BaseResponse<any, any> = response;
                data.request = params;
                return data;
            }), catchError((error) => this.errorHandler.HandleCatch<any, any>(error, params)));
    }

    /**
     * Sends the update warehouse request to server
     *
     * @param {*} params Request parameter required for the service
     * @returns {Observable<BaseResponse<any, any>>} Observable of update warehouse to carry out further operations
     * @memberof SettingsWarehouseService
     */
    public setAsDefaultWarehouse(params: any): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        const contextPath = WAREHOUSE_API.SET_DEFAULT_WAREHOUSE?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
            ?.replace(':warehouseUniqueName', params.warehouseUniqueName);
        return this.http.patch(this.config.apiUrl + contextPath, params).pipe(
            map((response) => {
                let data: BaseResponse<any, any> = response;
                data.request = params;
                return data;
            }), catchError((error) => this.errorHandler.HandleCatch<any, any>(error, params)));
    }

    /**
     * Fetches the warehouse details
     *
     * @param {string} warehouseUniqueName Unique name of warehosue
     * @returns {Observable<BaseResponse<any, any>>} Observable to carry out further operations
     * @memberof SettingsWarehouseService
     */
    public getWarehouseDetails(warehouseUniqueName: string): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + WAREHOUSE_API.GET_WAREHOUSE_DETAILS
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
            ?.replace(':warehouseUniqueName', encodeURIComponent(warehouseUniqueName))).pipe(map((res) => {
                let data: BaseResponse<WareHouseResponse, string> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<WareHouseResponse, string>(e, WareHouseResponse)));
    }

    /**
     * Updates the warehouse status
     *
     * @param {*} model
     * @param {string} warehouseUniqueName
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsWarehouseService
     */
    public updateWarehouseStatus(model: any, warehouseUniqueName: string): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        return this.http.patch(this.config.apiUrl + WAREHOUSE_API.UPDATE_WAREHOUSE_STATUS
            ?.replace(':companyUniqueName', companyUniqueName)
            ?.replace(':warehouseUniqueName', warehouseUniqueName), model).pipe(
                map((res) => {
                    let data: BaseResponse<any, string> = res;
                    data.queryString = {};
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }
}
