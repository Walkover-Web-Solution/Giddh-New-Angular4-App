import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BaseResponse } from '../models/api-models/BaseResponse';
import { PurchaseRecordRequest } from '../models/api-models/Sales';
import { PURCHASE_RECORD_API } from './apiurls/purchase-record.api';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { HttpWrapperService } from './httpWrapper.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { PurchaseRecordAttachmentResponse } from '../models/api-models/PurchaseRecord';

@Injectable()
export class PurchaseRecordService {

    /** @ignore */
    constructor(
        private _http: HttpWrapperService,
        private errorHandler: GiddhErrorHandler,
        private _generalService: GeneralService,
        @Optional() @Inject(ServiceConfig)
        private config: IServiceConfigArgs
    ) { }

    /**
     * Calls the generate purchase record API
     *
     * @param {PurchaseRecordRequest} requestObject Request object required for the API
     * @param {string} [method='POST'] If update flow is carried out then value is 'PATCH'
     * @returns {Observable<BaseResponse<any, PurchaseRecordRequest>>} Observable to carry out further operations
     * @memberof PurchaseRecordService
     */
    public generatePurchaseRecord(requestObject: PurchaseRecordRequest | any, method: string = 'POST', updateAttachment?: boolean): Observable<BaseResponse<any, PurchaseRecordRequest>> {
        const accountUniqueName = requestObject.account.uniqueName;
        // TODO: Add patch integration once the API is ready
        if (method === 'POST') {
            const contextPath: string =
                `${this.config.apiUrl}${PURCHASE_RECORD_API.GENERATE.replace(':companyUniqueName', this._generalService.companyUniqueName).replace(':accountUniqueName', accountUniqueName)}`;
            return this._http.post(contextPath, requestObject).pipe(
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, requestObject)));
        } else if (method === 'PATCH') {
            if (updateAttachment) {
                delete requestObject.account;
            }
            const contextPath: string =
                `${this.config.apiUrl}${PURCHASE_RECORD_API.UPDATE.replace(':companyUniqueName', this._generalService.companyUniqueName).replace(':accountUniqueName', accountUniqueName)}`;
            return this._http.patch(contextPath, requestObject).pipe(
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, requestObject)));
        }
    }

    /**
     * Fetches the attached file details for purchase record
     *
     * @param {*} requestObject Request object required by the API
     * @returns {Observable<BaseResponse<PurchaseRecordAttachmentResponse, any>>} Attached file details
     * @memberof PurchaseRecordService
     */
    public downloadAttachedFile(requestObject: any): Observable<BaseResponse<PurchaseRecordAttachmentResponse, any>> {
        const {accountUniqueName, purchaseRecordUniqueName} = requestObject;
        const contextPath: string =
            `${this.config.apiUrl}${PURCHASE_RECORD_API.DOWNLOAD_ATTACHMENT.replace(':companyUniqueName', this._generalService.companyUniqueName)
                .replace(':accountUniqueName', accountUniqueName)}`;
        return this._http.get(contextPath, {uniqueName: purchaseRecordUniqueName}).pipe(
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, requestObject)));
    }

    /**
     * Validates the purchase record being created to avoid redundant data
     * Returns data of the old purchase record if it matches with the newly created
     * purchase record according to the contract policy (account unique name, tax number,
     * invoice date and invoice number) else returns null
     *
     * @param {*} requestObject Request object required from the service
     * @returns {Observable<BaseResponse<any, any>>} Returns data of previous record if found else null
     * @memberof PurchaseRecordService
     */
    public validatePurchaseRecord(requestObject: any): Observable<BaseResponse<any, any>> {
        const {accountUniqueName} = requestObject;
        const contextPath: string =
            `${this.config.apiUrl}${PURCHASE_RECORD_API.VALIDATE_RECORD.replace(':companyUniqueName', this._generalService.companyUniqueName)
                .replace(':accountUniqueName', accountUniqueName)}`;
        delete requestObject.accountUniqueName;
        return this._http.get(contextPath, requestObject).pipe(
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, requestObject)));
    }

    /**
     * Deletes purchase record
     *
     * @param {*} requestObject Request object for API
     * @returns {Observable<BaseResponse<any, any>>} Observable to carry out further operations
     * @memberof PurchaseRecordService
     */
    public deletePurchaseRecord(requestObject: any): Observable<BaseResponse<any, any>> {
        const contextPath: string =
            `${this.config.apiUrl}${PURCHASE_RECORD_API.DELETE.replace(':companyUniqueName', this._generalService.companyUniqueName).replace(':uniqueName', requestObject.uniqueName)}`;
        return this._http.delete(contextPath).pipe(
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, requestObject)));
    }
}
