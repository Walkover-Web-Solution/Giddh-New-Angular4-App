import { Injectable, Optional, Inject } from '@angular/core';
import { HttpWrapperService } from './httpWrapper.service';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from './catchManager/catchmanger';

import { WAREHOUSE_API } from '../settings/warehouse/constants/warehouse.constant';

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
        return this.http.post(this.config.apiUrl + WAREHOUSE_API.CREATE.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)), params).pipe(
            map((response) => {
                let data: BaseResponse<any, any> = response;
                data.request = params;
                return data;
            }), catchError((error) => this.errorHandler.HandleCatch<any, any>(error, params)));
    }

}
