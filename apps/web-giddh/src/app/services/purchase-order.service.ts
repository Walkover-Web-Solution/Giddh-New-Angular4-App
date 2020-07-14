import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { PURCHASE_ORDER_API } from './apiurls/purchase-order.api';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { HttpWrapperService } from './httpWrapper.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class PurchaseOrderService {

    constructor(private http: HttpWrapperService, private errorHandler: GiddhErrorHandler, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {

    }

    /**
     * This will send the api request to get all purchase orders
     *
     * @param {*} getRequestObject
     * @param {*} postRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseOrderService
     */
    public getAll(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.GET_ALL;
        url = url.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url.replace(':from', getRequestObject.from);
        url = url.replace(':to', getRequestObject.to);
        url = url.replace(':page', getRequestObject.page);
        url = url.replace(':count', getRequestObject.count);
        url = url.replace(':q', getRequestObject.search);
        url = url.replace(':sort', getRequestObject.sort);
        url = url.replace(':sortBy', getRequestObject.sortBy);

        return this.http.post(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

}