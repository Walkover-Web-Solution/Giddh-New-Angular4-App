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
        url = url.replace(':sort', getRequestObject.sort);
        url = url.replace(':sortBy', getRequestObject.sortBy);

        return this.http.post(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    /**
     * This will send the api request to create purchase order
     *
     * @param {*} getRequestObject
     * @param {*} postRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseOrderService
     */
    public create(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.CREATE;
        url = url.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url.replace(':accountUniqueName', getRequestObject.accountUniqueName);

        return this.http.post(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    public bulkUpdate(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.BULK_UPDATE;
        url = url.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url.replace(':action', getRequestObject.action);

        return this.http.patch(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    public statusUpdate(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.STATUS_UPDATE;
        url = url.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url.replace(':accountUniqueName', getRequestObject.accountUniqueName);

        return this.http.patch(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    public delete(getRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.DELETE;
        url = url.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url.replace(':poUniqueName', getRequestObject.poUniqueName);

        return this.http.delete(url).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    public sendEmail(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.EMAIL;
        url = url.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url.replace(':accountUniqueName', getRequestObject.accountUniqueName);
        url = url.replace(':poUniqueName', getRequestObject.poUniqueName);

        return this.http.post(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    public get(getRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.GET;
        url = url.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url.replace(':poUniqueName', getRequestObject.poUniqueName);

        return this.http.get(url).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    public update(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.UPDATE;
        url = url.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url.replace(':accountUniqueName', getRequestObject.accountUniqueName);

        return this.http.put(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    public getPreview(getRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.GET_PREVIEW;
        url = url.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url.replace(':poUniqueName', getRequestObject.poUniqueName);

        return this.http.get(url).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }
}