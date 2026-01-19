import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './http-wrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GenericRequestForGenerateSCD } from '../models/api-models/Sales';
import { SALES_API_V2, SALES_API_V4 } from './apiurls/sales.api';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { AdvanceReceiptRequest, VoucherAdjustments } from '../models/api-models/AdvanceReceiptsAdjust';
import { ADVANCE_RECEIPTS_API } from './apiurls/advance-receipt-adjustment.api';
import { PAGINATION_LIMIT } from '../app.constant';
import { concat, forEach, get, keys } from '../lodash-optimized';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * SalesService service
 * Provides sales related business logic and data operations
 */
export class SalesService {
    private companyUniqueName: string;

    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private http: HttpWrapperService,
        private errorHandler: GiddhErrorHandler,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig)
        private config: IServiceConfigArgs
    ) {
    }

    /**
     *
     * @param model : GenericRequestForGenerateSCD object
     * @param updateAccount: boolean flag to update A/c
     * {{url}}/company/{{companyUniqueName}}/accounts/{{accountUniqueName}}/vouchers/generate
     */
    public generateGenericItem(model: any, isVoucherV4 = false): Observable<BaseResponse<any, any>> {
        let accountUniqueName = model.account?.uniqueName;
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url;
        /**
         * Handles if functionality
         */
        if (isVoucherV4) {
            url = this.config.apiUrl + SALES_API_V4.GENERATE_GENERIC_ITEMS;
        } else {
            url = this.config.apiUrl + SALES_API_V2.GENERATE_GENERIC_ITEMS;
        }
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.post(url
            ?.replace(':companyUniqueName', this.companyUniqueName)
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName))
            , model)
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, GenericRequestForGenerateSCD> = res;
                    data.request = model;
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, GenericRequestForGenerateSCD>(e, model)));
    }

    /**
     * Updates existing voucher
     */
    public updateVoucher(model: any): Observable<BaseResponse<any, any>> {
        let accountUniqueName = model.voucher?.accountDetails?.uniqueName;
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + SALES_API_V2.UPDATE_VOUCHER
            ?.replace(':companyUniqueName', this.companyUniqueName)
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model)
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = model;
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, GenericRequestForGenerateSCD>(e, model)));
    }

    /**
     * Updates existing voucherv4
     */
    public updateVoucherV4(model: any): Observable<BaseResponse<any, GenericRequestForGenerateSCD>> {
        let accountUniqueName = model.account?.uniqueName;
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + SALES_API_V4.UPDATE_VOUCHER
            ?.replace(':companyUniqueName', this.companyUniqueName)
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName));
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.put(url, model)
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = model;
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * Retrieves statecode data
     */
    public getStateCode(country) {
        let url = this.config.apiUrl + 'country/' + country;
        return this.http.get(url).pipe(map((res) => {
            let data = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch(e)));
    }

    /**
     * API call to get all advance receipt vouchers using invoice date
     *
     * @param {AdvanceReceiptRequest} model Request model
     * @returns {Observable<BaseResponse<any, AdvanceReceiptRequest>>} API response
     * @memberof SalesService
     */
    public getAllAdvanceReceiptVoucher(model: AdvanceReceiptRequest): Observable<BaseResponse<any, AdvanceReceiptRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = this.config.apiUrl + ADVANCE_RECEIPTS_API.GET_ALL_ADVANCE_RECEIPTS
            ?.replace(':companyUniqueName', this.companyUniqueName)
            ?.replace(':accountUniqueName', encodeURIComponent(model.accountUniqueName))?.replace(':invoiceDate', model.invoiceDate);
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            contextPath = this.generalService.addVoucherVersion(contextPath, this.generalService.voucherApiVersion);
        }
        return this.http.get(contextPath)
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, AdvanceReceiptRequest> = res;
                    data.request = model;
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, AdvanceReceiptRequest>(e, model)));
    }

    /**
     * API call to adjust an invoice with advance receipts
     *
     * @param {*} model Adjust advance receipts request model
     * @param {string} invoiceUniqueName Invoice unique name which need to adjust
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SalesService
     */
    public adjustAnInvoiceWithAdvanceReceipts(model: any, invoiceUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url;

        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            url = this.config.apiUrl + ADVANCE_RECEIPTS_API.VOUCHER_ADJUSTMENT_WITH_ADVANCE_RECEIPT?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':voucherUniqueName', invoiceUniqueName);
        } else {
            url = this.config.apiUrl + ADVANCE_RECEIPTS_API.INVOICE_ADJUSTMENT_WITH_ADVANCE_RECEIPT?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':invoiceUniqueName', invoiceUniqueName);
        }

        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }

        return this.http.post(url, model).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
    * To generate pending type voucher
    * @param model : GenericRequestForGenerateSCD object
    *
    *
    */
    public generatePendingVoucherGenericItem(model: any): Observable<BaseResponse<any, any>> {
        let accountUniqueName = model.account?.uniqueName;
        let url = `${this.config.apiUrl}${SALES_API_V4.GENERATE_GENERIC_ITEMS}-pending-vouchers`;
        this.companyUniqueName = this.generalService.companyUniqueName;
      
        url = url?.replace(':companyUniqueName', this.companyUniqueName)
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName));
        
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.post(url
            , model)
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, GenericRequestForGenerateSCD> = res;
                    data.request = model;
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, GenericRequestForGenerateSCD>(e, model)));
    }

    /**
     * This will get the invoice list where balance is due
     *
     * @param {any} model voucher type & account unique name
     * @param {string} date Date in GIDDH_DATE_FORMAT
     * @param {number} count
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof LedgerService
     */
    public getInvoiceList(model: any, date: string, count: number = PAGINATION_LIMIT): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = SALES_API_V2.GET_VOUCHER_INVOICE_LIST
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':voucherDate', encodeURIComponent(date))
            ?.replace(':adjustmentRequest', String(true))
            ?.replace(':count', String(count))
            ?.replace(':number', encodeURIComponent((model.number || "")))
            ?.replace(':page', (model.page || 1));
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            contextPath = this.generalService.addVoucherVersion(contextPath, this.generalService.voucherApiVersion);
        }
        return this.http.post(this.config.apiUrl + contextPath, model
        ).pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error, model)));
    }

    /**
     * Returns accounts of a particular group and with particular currency
     *
     * @param {*} requestObject Comma delimited string of group names or request object with param keys for the API in dynamic search
     * @param {string} [currency] Comma delimited string of currencies
     * @returns {Observable<any>} Observable to carry out further operations
     * @memberof SalesService
     */
    public getAccountsWithCurrency(requestObject: any, currency?: string): Observable<any> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = `${this.config.apiUrl}${SALES_API_V2.GET_ACCOUNTS_OF_GROUP_WITH_CURRENCY?.replace(':companyUniqueName', companyUniqueName)}`;
        /**
         * Handles if functionality
         */
        if (typeof requestObject === 'string') {
            contextPath = contextPath.concat(`?group=${requestObject}&count=0`);
        } else {
            Object.keys(requestObject).forEach((key, index) => {
                const delimiter = index === 0 ? '?' : '&'
                /**
                 * Handles if functionality
                 */
                if (requestObject[key] !== undefined) {
                    contextPath += `${delimiter}${key}=${requestObject[key]}`
                }
            });
        }
        /**
         * Handles if functionality
         */
        if (currency) {
            contextPath = contextPath.concat(`&currency=${currency}`);
        }
        return this.http.get(contextPath);
    }

    /**
     * Updates attachment in voucher
     *
     * @param {*} model
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SalesService
     */
    public updateAttachmentInVoucher(model: any): Observable<BaseResponse<any, any>> {
        let url: string = `${this.config.apiUrl}${SALES_API_V4.UPDATE_ATTACHMENT?.replace(':companyUniqueName', this.generalService.companyUniqueName)}`;
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.patch(url, model).pipe(
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }
}