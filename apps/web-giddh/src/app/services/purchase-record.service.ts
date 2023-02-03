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
        private http: HttpWrapperService,
        private errorHandler: GiddhErrorHandler,
        private generalService: GeneralService,
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
        const accountUniqueName = requestObject.account?.uniqueName;
        // TODO: Add patch integration once the API is ready
        if (method === 'POST') {
            const contextPath: string =
                `${this.config.apiUrl}${PURCHASE_RECORD_API.GENERATE?.replace(':companyUniqueName', this.generalService.companyUniqueName)?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName))}`;
            return this.http.post(contextPath, requestObject).pipe(
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, requestObject)));
        } else if (method === 'PATCH') {
            if (updateAttachment) {
                delete requestObject.account;
            }
            const contextPath: string =
                `${this.config.apiUrl}${PURCHASE_RECORD_API.UPDATE?.replace(':companyUniqueName', this.generalService.companyUniqueName)?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName))}`;
            return this.http.patch(contextPath, requestObject).pipe(
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
        const { accountUniqueName, purchaseRecordUniqueName } = requestObject;
        if (this.generalService.voucherApiVersion === 2) {
            let contextPath: string =
                `${this.config.apiUrl}${PURCHASE_RECORD_API.V2.DOWNLOAD_ATTACHMENT?.replace(':companyUniqueName', this.generalService.companyUniqueName)
                    ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName))}`;

            contextPath = this.generalService.addVoucherVersion(contextPath, this.generalService.voucherApiVersion);

            return this.http.post(contextPath, { uniqueName: purchaseRecordUniqueName }).pipe(
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, requestObject)));
        } else {
            let contextPath: string =
                `${this.config.apiUrl}${PURCHASE_RECORD_API.DOWNLOAD_ATTACHMENT?.replace(':companyUniqueName', this.generalService.companyUniqueName)
                    ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName))}`;

            return this.http.get(contextPath, { uniqueName: purchaseRecordUniqueName }).pipe(
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, requestObject)));
        }
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
        const { accountUniqueName } = requestObject;
        const contextPath: string =
            `${this.config.apiUrl}${PURCHASE_RECORD_API.VALIDATE_RECORD?.replace(':companyUniqueName', this.generalService.companyUniqueName)
                ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName))}`;
        delete requestObject.accountUniqueName;
        return this.http.get(contextPath, requestObject).pipe(
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
            `${this.config.apiUrl}${PURCHASE_RECORD_API.DELETE?.replace(':companyUniqueName', this.generalService.companyUniqueName)?.replace(':uniqueName', requestObject?.uniqueName)}`;
        return this.http.delete(contextPath).pipe(
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, requestObject)));
    }

    /**
     * This will get all the revisions
     *
     * @param {*} getRequestObject
     * @param {*} postRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseRecordService
     */
    public getAllVersions(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_RECORD_API.GET_ALL_VERSIONS;
        url = url?.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url?.replace(':accountUniqueName', encodeURIComponent(getRequestObject.accountUniqueName));
        url = url?.replace(':page', getRequestObject.page);
        url = url?.replace(':count', getRequestObject.count);

        return this.http.post(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    /**
     * This will send email
     *
     * @param {*} getRequestObject
     * @param {*} postRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseRecordService
     */
    public sendEmail(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_RECORD_API.EMAIL;
        url = url?.replace(':companyUniqueName', getRequestObject.companyUniqueName);
        url = url?.replace(':accountUniqueName', encodeURIComponent(getRequestObject.accountUniqueName));
        url = url?.replace(':uniqueName', getRequestObject?.uniqueName);

        return this.http.post(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
    }

    /**
     * This will get the PDF
     *
     * @param {*} requestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseRecordService
     */
    public getPdf(requestObject: any): Observable<BaseResponse<any, any>> {
        if (this.generalService.voucherApiVersion === 2) {
            let url: string = this.config.apiUrl + PURCHASE_RECORD_API.V2.GET_PDF;
            url = url?.replace(':companyUniqueName', this.generalService.companyUniqueName);
            url = url?.replace(':accountUniqueName', encodeURIComponent(requestObject.accountUniqueName));

            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);

            return this.http.post(url, { uniqueName: requestObject?.uniqueName }).pipe(
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, requestObject)));
        } else {
            let url: string = this.config.apiUrl + PURCHASE_RECORD_API.GET_PDF;
            url = url?.replace(':companyUniqueName', this.generalService.companyUniqueName);
            url = url?.replace(':accountUniqueName', encodeURIComponent(requestObject.accountUniqueName));
            url = url?.replace(':uniqueName', requestObject?.uniqueName);

            return this.http.get(url).pipe(
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, requestObject)));
        }
    }
}
