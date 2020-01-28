import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BaseResponse } from '../models/api-models/BaseResponse';
import { PurchaseRecordRequest } from '../models/api-models/Sales';
import { PURCHASE_RECORD_API } from './apiurls/purchase-record.api';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { HttpWrapperService } from './httpWrapper.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { PurchaseRecordAttachmentResponse } from '../models/api-models/PurchaseRecord';

@Injectable()
export class PurchaseRecordService {

    /** @ignore */
    constructor(
        private _http: HttpWrapperService,
        private errorHandler: ErrorHandler,
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
    public generatePurchaseRecord(requestObject: PurchaseRecordRequest, method: string = 'POST'): Observable<BaseResponse<any, PurchaseRecordRequest>> {
        const accountUniqueName = requestObject.account.uniqueName;
        const contextPath: string =
            `${this.config.apiUrl}${PURCHASE_RECORD_API.GENERATE.replace(':companyUniqueName', this._generalService.companyUniqueName).replace(':accountUniqueName', accountUniqueName)}`;
        // TODO: Add patch integration once the API is ready
        return this._http.post(contextPath, requestObject).pipe(
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, requestObject)));
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
}
