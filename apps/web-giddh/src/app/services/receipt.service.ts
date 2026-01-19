import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseResponse } from '../models/api-models/BaseResponse';
import {
    DownloadVoucherRequest,
    InvoiceReceiptFilter,
    ReceiptVoucherDetailsRequest,
    ReciptDeleteRequest,
    ReciptRequest,
    ReciptResponse,
    Voucher,
    VoucherRequest,
} from '../models/api-models/recipt';
import {
    AdvanceReceiptSummaryRequest,
    GetAllAdvanceReceiptsRequest,
    ReportsDetailedRequestFilter,
    SalesRegisteDetailedResponse,
} from '../models/api-models/Reports';
import { VoucherTypeEnum } from '../models/api-models/Sales';
import {
    PURCHASE_RECORD_DATE_OPERATION,
    PURCHASE_RECORD_DUE_DATE_OPERATION,
    PURCHASE_RECORD_GRAND_TOTAL_OPERATION,
    PurchaseRecordAdvanceSearch,
} from '../purchase/purchase-record/constants/purchase-record.interface';
import { COMPANY_API } from './apiurls/company.api';
import { RECEIPT_API } from './apiurls/receipt.api';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { HttpWrapperService } from './http-wrapper.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { concat, get } from '../lodash-optimized';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * ReceiptService service
 * Provides receipt related business logic and data operations
 */
export class ReceiptService {
    private companyUniqueName: string;

    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(private generalService: GeneralService, private http: HttpWrapperService, private errorHandler: GiddhErrorHandler,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this.companyUniqueName = this.generalService.companyUniqueName;
    }

    /**
     * Handles UpdateReceipt functionality
     */
    public UpdateReceipt(accountUniqueName: string, model: ReciptRequest): Observable<BaseResponse<string, ReciptRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + RECEIPT_API.PUT
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model).pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<string, ReciptRequest> = res;
                    data.request = model;
                    data.queryString = { accountUniqueName };
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<string, ReciptRequest>(e, model)));
    }

    /**
     * Handles GetAllReceipt functionality
     */
    public GetAllReceipt(body: InvoiceReceiptFilter, type: string): Observable<BaseResponse<ReciptResponse, InvoiceReceiptFilter>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        const requestPayload = (type === VoucherTypeEnum.purchase && this.generalService.voucherApiVersion !== 2) ? this.getPurchaseRecordPayload(body) : body;
        const contextPath = (type === VoucherTypeEnum.purchase && this.generalService.voucherApiVersion !== 2) ? RECEIPT_API.GET_ALL_PURCHASE_RECORDS : RECEIPT_API.GET_ALL;
        const requestParameter = {
            page: body?.page, count: body?.count, from: body?.from, to: body?.to, q: (body?.q) ? encodeURIComponent(body?.q) : body?.q, sort: body?.sort, sortBy: body?.sortBy
        };

        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            delete body.from;
            delete body.to;
        }

        let url = this.createQueryString(this.config.apiUrl + contextPath, (type === VoucherTypeEnum.purchase && this.generalService.voucherApiVersion !== 2) ? requestParameter : { ...requestParameter, type });
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.post(url
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), requestPayload).pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<ReciptResponse, InvoiceReceiptFilter> = res;
                    data.queryString = { page: body?.page, count: body?.count, from: body?.from, to: body?.to, type: 'pdf' };
                    data.request = body;
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<ReciptResponse, InvoiceReceiptFilter>(e, body, { page: body?.page, count: body?.count, from: body?.from, to: body?.to, type: 'pdf' })));
    }

    /**
     * Mapper to map advance search request for Purchase Record
     *
     * @private
     * @param {InvoiceReceiptFilter} request Request to be mapped
     * @returns {PurchaseRecordAdvanceSearch} Request payload for purchase record advance search
     * @memberof ReceiptService
     */
    private getPurchaseRecordPayload(request: InvoiceReceiptFilter): PurchaseRecordAdvanceSearch {
        let advanceSearchRequest: PurchaseRecordAdvanceSearch = new PurchaseRecordAdvanceSearch();
        advanceSearchRequest.purchaseDate = request.invoiceDate;
        /**
         * Handles if functionality
         */
        if (request.invoiceDateEqual) {
            advanceSearchRequest.purchaseDateOperation = PURCHASE_RECORD_DATE_OPERATION.ON;
        } else if (request.invoiceDateAfter) {
            advanceSearchRequest.purchaseDateOperation = PURCHASE_RECORD_DATE_OPERATION.AFTER;
        } else if (request.invoiceDateBefore) {
            advanceSearchRequest.purchaseDateOperation = PURCHASE_RECORD_DATE_OPERATION.BEFORE;
        }
        advanceSearchRequest.dueDate = request.dueDate;
        /**
         * Handles if functionality
         */
        if (request.dueDateEqual) {
            advanceSearchRequest.dueDateOperation = PURCHASE_RECORD_DUE_DATE_OPERATION.ON;
        } else if (request.dueDateAfter) {
            advanceSearchRequest.dueDateOperation = PURCHASE_RECORD_DUE_DATE_OPERATION.AFTER;
        } else if (request.dueDateBefore) {
            advanceSearchRequest.dueDateOperation = PURCHASE_RECORD_DUE_DATE_OPERATION.BEFORE;
        }
        advanceSearchRequest.grandTotal = request.total;
        /**
         * Handles if functionality
         */
        if (request.totalEqual && request.totalMoreThan) {
            advanceSearchRequest.grandTotalOperation = PURCHASE_RECORD_GRAND_TOTAL_OPERATION.GREATER_THAN_OR_EQUALS;
        } else if (request.totalEqual && request.totalLessThan) {
            advanceSearchRequest.grandTotalOperation = PURCHASE_RECORD_GRAND_TOTAL_OPERATION.LESS_THAN_OR_EQUALS;
        } else if (request.totalEqual) {
            advanceSearchRequest.grandTotalOperation = PURCHASE_RECORD_GRAND_TOTAL_OPERATION.EQUALS;
        } else if (request.totalMoreThan) {
            advanceSearchRequest.grandTotalOperation = PURCHASE_RECORD_GRAND_TOTAL_OPERATION.GREATER_THAN;
        } else if (request.totalLessThan) {
            advanceSearchRequest.grandTotalOperation = PURCHASE_RECORD_GRAND_TOTAL_OPERATION.LESS_THAN;
        }

        /**
         * Handles if functionality
         */
        if (request.purchaseOrderNumber) {
            advanceSearchRequest.purchaseOrderNumber = request.purchaseOrderNumber;
        }

        return advanceSearchRequest;
    }

    /**
     * Handles DeleteReceipt functionality
     */
    public DeleteReceipt(accountUniqueName: string, queryRequest: ReciptDeleteRequest): Observable<BaseResponse<string, ReciptDeleteRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + RECEIPT_API.DELETE
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName));
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.deleteWithBody(
            url,
            queryRequest
        ).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, ReciptDeleteRequest> = res;
                data.request = queryRequest;
                data.queryString = { accountUniqueName };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, ReciptDeleteRequest>(e, accountUniqueName))
        )
    }

    /**
     * Handles DownloadVoucher functionality
     */
    public DownloadVoucher(model: DownloadVoucherRequest, accountUniqueName: string, isPreview: boolean = false): any {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + RECEIPT_API.DOWNLOAD_VOUCHER
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName));
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.post(url
            , model, { responseType: isPreview ? 'text' : 'blob' }).pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.queryString = accountUniqueName;
                    data.request = model;
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model, { accountUniqueName }))
            );
    }

    /**
     * Handles GetVoucherDetails functionality
     */
    public GetVoucherDetails(accountUniqueName: string, model: ReceiptVoucherDetailsRequest): Observable<BaseResponse<Voucher, ReceiptVoucherDetailsRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + RECEIPT_API.GET_DETAILS
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName)),
            model
        ).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<Voucher, ReceiptVoucherDetailsRequest> = res;
                data.queryString = accountUniqueName;
                data.request = model;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<Voucher, ReceiptVoucherDetailsRequest>(e, model, { accountUniqueName })));
    }

    /**
     * Retrieves voucherdetailsv4 data
     */
    public getVoucherDetailsV4(accountUniqueName: string, model: ReceiptVoucherDetailsRequest): Observable<BaseResponse<Voucher, ReceiptVoucherDetailsRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + RECEIPT_API.GET_DETAILS_V4
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName));
        let requestObj: VoucherRequest | ReceiptVoucherDetailsRequest = Object.assign({}, model);
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            requestObj = new VoucherRequest(model.invoiceNumber, model.voucherType, model?.uniqueName);
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.post(url, requestObj
        ).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<Voucher, ReceiptVoucherDetailsRequest> = res;
                data.queryString = accountUniqueName;
                data.request = model;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<Voucher, ReceiptVoucherDetailsRequest>(e, model, { accountUniqueName })));
    }

    /*
  * get detailed registered sales
  * */
    /**
     * Retrieves detailedsalesregister data
     */
    public getDetailedSalesRegister(request: ReportsDetailedRequestFilter) {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.createQueryString(this.config.apiUrl + COMPANY_API.GET_DETAILED_REGISTERED_SALES, {
            page: request.page, count: request.count, from: request.from, to: request.to, q: request.q, sort: request.sort, sortBy: request.sortBy
        });

        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        /**
         * Handles if functionality
         */
        if (request.branchUniqueName && request.branchUniqueName !== this.companyUniqueName) {
            request.branchUniqueName = request.branchUniqueName !== this.companyUniqueName ? request.branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${encodeURIComponent(request.branchUniqueName)}`);
        }

        return this.http.post(url, { accountUniqueNames: request.accountUniqueNames, salesPersonUniqueName: request.salesPersonUniqueName }).pipe(map((res) => {
            let data: BaseResponse<SalesRegisteDetailedResponse, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SalesRegisteDetailedResponse>(e, ReportsDetailedRequestFilter)));
    }

    /*
  * get detailed registered sales
  * */
    /**
     * Retrieves detailedpurchaseregister data
     */
    public getDetailedPurchaseRegister(request: ReportsDetailedRequestFilter) {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.createQueryString(this.config.apiUrl + COMPANY_API.GET_DETAILED_REGISTERED_PURCHASE, {
            page: request.page, count: request.count, from: request.from, to: request.to, q: request.q, sort: request.sort, sortBy: request.sortBy
        });

        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        /**
         * Handles if functionality
         */
        if (request.branchUniqueName && request.branchUniqueName !== this.companyUniqueName) {
            request.branchUniqueName = request.branchUniqueName !== this.companyUniqueName ? request.branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${encodeURIComponent(request.branchUniqueName)}`);
        }

        return this.http.post(url, { accountUniqueNames: request.accountUniqueNames, salesPersonUniqueName: request.salesPersonUniqueName }).pipe(map((res) => {
            let data: BaseResponse<SalesRegisteDetailedResponse, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SalesRegisteDetailedResponse>(e, ReportsDetailedRequestFilter)));
    }

    /**
     * Creates new querystring
     */
    private createQueryString(str, model) {
        let url = str;
        /**
         * Handles if functionality
         */
        if ((model.from)) {
            url = url + 'from=' + model.from + '&';
        }
        /**
         * Handles if functionality
         */
        if ((model.to)) {
            url = url + 'to=' + model.to + '&';
        }
        /**
         * Handles if functionality
         */
        if ((model.page)) {
            url = url + 'page=' + model.page + '&';
        }
        /**
         * Handles if functionality
         */
        if ((model.count)) {
            url = url + 'count=' + model.count;
        }

        /**
         * Handles if functionality
         */
        if ((model.type)) {
            url = url + '&type=' + model.type;
        }
        /**
         * Handles if functionality
         */
        if ((model.sort)) {
            url = url + '&sort=' + model.sort;
        }
        /**
         * Handles if functionality
         */
        if ((model.sortBy)) {
            url = url + '&sortBy=' + model.sortBy;
        }
        /**
         * Handles if functionality
         */
        if ((model.q)) {
            url = url + '&q=' + model.q;
        }
        return url;
    }

    /**
     * Retrieves allreceiptbalancedue data
     */
    public getAllReceiptBalanceDue(body: any, type: string): Observable<BaseResponse<ReciptResponse, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let requestType = type;
        let url = this.createQueryString(this.config.apiUrl + RECEIPT_API.GET_ALL_BAL_SALE_DUE, {
            page: body?.page, count: body?.count, from: body?.from, to: body?.to, type: requestType, q: body?.q ? encodeURIComponent(body?.q) : body?.q, sort: body?.sort, sortBy: body?.sortBy
        });
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            delete body.from;
            delete body.to;
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.post(url
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), body).pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<ReciptResponse, any> = res;
                    data.queryString = { page: body?.page, count: body?.count, from: body?.from, to: body?.to, type: 'pdf' };
                    data.request = body;
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<ReciptResponse, any>(e, body, { page: body?.page, count: body?.count, from: body?.from, to: body?.to, type: 'pdf' })));
    }

    /**
     * Fetches purchase record detail
     *
     * @param {string} accountUniqueName Unique name of account
     * @param {string} purchaseRecordUniqueName Purchase record unique name
     * @returns {Observable<BaseResponse<Voucher, any>>} Observable to carry out further operations
     * @memberof ReceiptService
     */
    public GetPurchaseRecordDetails(accountUniqueName: string, purchaseRecordUniqueName: string): Observable<BaseResponse<Voucher, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + RECEIPT_API.GET_PURCHASE_RECORD
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName))
            ?.replace(':purchaseRecordUniqueNumber', purchaseRecordUniqueName)
        ).pipe(catchError((e) => this.errorHandler.HandleCatch<Voucher, any>(e)));
    }

    /**
     * Fetches all the advance receipts
     *
     * @param {GetAllAdvanceReceiptsRequest} requestObject Request object
     * @returns {Observable<BaseResponse<any, GetAllAdvanceReceiptsRequest>>} Observable to carry out further operations
     * @memberof ReceiptService
     */
    public getAllAdvanceReceipts(requestObject: GetAllAdvanceReceiptsRequest): Observable<BaseResponse<any, GetAllAdvanceReceiptsRequest>> {
        const companyUniqueName = String(requestObject.companyUniqueName);
        delete requestObject.companyUniqueName;
        let url = `${this.config.apiUrl}${RECEIPT_API.GET_ALL_ADVANCE_RECEIPTS}`
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
            ?.replace(':sortBy', requestObject && requestObject.sortBy ? requestObject.sortBy : '')
            ?.replace(':sort', requestObject && requestObject.sort ? requestObject.sort : '')
            ?.replace(':page', (requestObject && requestObject.page) ? String(requestObject.page) : '')
            ?.replace(':count', requestObject && requestObject.count ? String(requestObject.count) : '')
            ?.replace(':from', requestObject && requestObject.from ? requestObject.from : '')
            ?.replace(':to', requestObject && requestObject.to ? requestObject.to : '');
        /**
         * Handles if functionality
         */
        if (requestObject.branchUniqueName) {
            url = url.concat(`&branchUniqueName=${requestObject.branchUniqueName !== companyUniqueName ? requestObject.branchUniqueName : ''}`);
        }
        return this.http.post(url, requestObject).pipe(catchError((error) => this.errorHandler.HandleCatch<any, GetAllAdvanceReceiptsRequest>(error)));
    }

    /**
     * Fetches the summary advance receipts based on date filters
     *
     * @param {AdvanceReceiptSummaryRequest} requestObject Request object
     * @returns {Observable<BaseResponse<any, AdvanceReceiptSummaryRequest>>} Observable to carry out further operations
     * @memberof ReceiptService
     */
    public fetchSummary(requestObject: AdvanceReceiptSummaryRequest): Observable<BaseResponse<any, AdvanceReceiptSummaryRequest>> {
        const companyUniqueName = String(requestObject.companyUniqueName);
        delete requestObject.companyUniqueName;
        let url = `${this.config.apiUrl}${RECEIPT_API.GET_ADVANCE_RECEIPTS_SUMMARY}`
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
            ?.replace(':from', requestObject && requestObject.from ? requestObject.from : '')
            ?.replace(':to', requestObject && requestObject.to ? requestObject.to : '');
        /**
         * Handles if functionality
         */
        if (requestObject.branchUniqueName) {
            url = url.concat(`&branchUniqueName=${requestObject.branchUniqueName !== companyUniqueName ? requestObject.branchUniqueName : ''}`);
        }
        return this.http.get(url, {}).pipe(catchError((error) => this.errorHandler.HandleCatch<any, AdvanceReceiptSummaryRequest>(error)));
    }
}
