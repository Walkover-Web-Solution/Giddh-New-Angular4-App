import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
        url = url?.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url?.replace(':from', getRequestObject.from);
        url = url?.replace(':to', getRequestObject.to);
        url = url?.replace(':page', getRequestObject.page);
        url = url?.replace(':count', getRequestObject.count);
        url = url?.replace(':sort', getRequestObject.sort);
        url = url?.replace(':sortBy', getRequestObject.sortBy);

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
        url = url?.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url?.replace(':accountUniqueName', encodeURIComponent(getRequestObject.accountUniqueName));

        return this.http.post(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    /**
     * This will bulk update the data
     *
     * @param {*} getRequestObject
     * @param {*} postRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseOrderService
     */
    public bulkUpdate(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.BULK_UPDATE;
        url = url?.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url?.replace(':action', getRequestObject.action);

        return this.http.patch(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    /**
     * This will bulk update the status of orders
     *
     * @param {*} getRequestObject
     * @param {*} postRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseOrderService
     */
    public statusUpdate(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.STATUS_UPDATE;
        url = url?.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url?.replace(':accountUniqueName', encodeURIComponent(getRequestObject.accountUniqueName));

        return this.http.patch(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    /**
     * This will delete the order
     *
     * @param {*} getRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseOrderService
     */
    public delete(getRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.DELETE;
        url = url?.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url?.replace(':poUniqueName', getRequestObject.poUniqueName);

        return this.http.delete(url).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    /**
     * This will send email
     *
     * @param {*} getRequestObject
     * @param {*} postRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseOrderService
     */
    public sendEmail(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.EMAIL;
        url = url?.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url?.replace(':accountUniqueName', encodeURIComponent(getRequestObject.accountUniqueName));
        url = url?.replace(':poUniqueName', getRequestObject?.uniqueName);

        return this.http.post(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    /**
     * This will get the order
     *
     * @param {*} getRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseOrderService
     */
    public get(getRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.GET;
        url = url?.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url?.replace(':poUniqueName', getRequestObject.poUniqueName);

        return this.http.get(url).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    /**
     * This will update the order
     *
     * @param {*} getRequestObject
     * @param {*} postRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseOrderService
     */
    public update(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.UPDATE;
        url = url?.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url?.replace(':accountUniqueName', encodeURIComponent(getRequestObject.accountUniqueName));

        return this.http.put(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    /**
     * This will get the preview data
     *
     * @param {*} getRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseOrderService
     */
    public getPreview(getRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.GET_PREVIEW;
        url = url?.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url?.replace(':poUniqueName', getRequestObject.poUniqueName);

        return this.http.get(url).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    /**
     * This will update/verify the purchase order settings email
     *
     * @param {*} getRequestObject
     * @param {*} postRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseOrderService
     */
    public updateSettingsEmail(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.UPDATE_SETTINGS_EMAIL;
        url = url?.replace(':companyUniqueName', getRequestObject.companyUniqueName);

        return this.http.put(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    /**
     * This will get all the revisions
     *
     * @param {*} getRequestObject
     * @param {*} postRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseOrderService
     */
    public getAllVersions(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.GET_ALL_VERSIONS;
        url = url?.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url?.replace(':accountUniqueName', encodeURIComponent(getRequestObject.accountUniqueName));
        url = url?.replace(':page', getRequestObject.page);
        url = url?.replace(':count', getRequestObject.count);

        return this.http.post(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    /**
     * This will get the PDF
     *
     * @param {*} getRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseOrderService
     */
    public getPdf(getRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.GET_PDF;
        url = url?.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url?.replace(':accountUniqueName', encodeURIComponent(getRequestObject.accountUniqueName));
        url = url?.replace(':poUniqueName', getRequestObject.poUniqueName);

        return this.http.get(url).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    /**
     * This will send the api request to get all pending purchase orders
     *
     * @param {*} getRequestObject
     * @param {*} postRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseOrderService
     */
    public getAllPendingPo(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.GET_ALL_PENDING;
        url = url?.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url?.replace(':accountUniqueName', encodeURIComponent(getRequestObject.accountUniqueName));
        url = url?.replace(':from', getRequestObject.from);
        url = url?.replace(':to', getRequestObject.to);
        url = url?.replace(':page', getRequestObject.page);
        url = url?.replace(':count', getRequestObject.count);
        url = url?.replace(':sort', getRequestObject.sort);
        url = url?.replace(':sortBy', getRequestObject.sortBy);

        return this.http.post(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    /* This will verify the email
     *
     * @param {*} params
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof PurchaseOrderService
     */
    public verifyEmail(params: any): Observable<BaseResponse<any, string>> {
        let url = this.config.apiUrl + PURCHASE_ORDER_API.VERIFY_EMAIL?.replace(':companyUniqueName', params.companyUniqueName)?.replace(':branchUniqueName', params.branchUniqueName)?.replace(':emailAddress', params.emailAddress)?.replace(':scope', params.scope);
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, string> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }
}
