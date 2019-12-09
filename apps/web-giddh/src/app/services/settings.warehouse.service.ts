import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BaseResponse } from '../models/api-models/BaseResponse';
import { WAREHOUSE_API } from '../settings/warehouse/constants/warehouse.constant';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { HttpWrapperService } from './httpWrapper.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

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
        private errorHandler: ErrorHandler,
        private generalService: GeneralService,
        private http: HttpWrapperService,
    ) {
    }

    /**
     * Sends the create warehouse request to server
     *
     * @param {*} params Request parameter required for the service
     * @returns {Observable<BaseResponse<any, any>>} Observable of create warehouse to carry out further operations
     * @memberof SettingsWarehouseService
     */
    public createWarehouse(params: any): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + WAREHOUSE_API.CREATE.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)), params).pipe(
            map((response) => {
                let data: BaseResponse<any, any> = response;
                data.request = params;
                return data;
            }), catchError((error) => this.errorHandler.HandleCatch<any, any>(error, params)));
    }

    /**
     * Sends the fetch warehouse request to server
     *
     * @returns {Observable<BaseResponse<any, any>>} Observable of fetch warehouse to carry out further operations
     * @memberof SettingsWarehouseService
     */
    public fetchAllWarehouse(): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + WAREHOUSE_API.CREATE.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))).pipe(
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
        const contextPath = WAREHOUSE_API.UPDATE.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
            .replace(':warehouseUniqueName', params.warehouseUniqueName);
        return this.http.put(this.config.apiUrl + contextPath, params).pipe(
            map((response) => {
                let data: BaseResponse<any, any> = response;
                data.request = params;
                return data;
            }), catchError((error) => this.errorHandler.HandleCatch<any, any>(error, params)));
    }

}
