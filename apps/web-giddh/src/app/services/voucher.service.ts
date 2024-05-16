import { Inject, Injectable, Optional } from "@angular/core";
import { GiddhErrorHandler } from "./catchManager/catchmanger";
import { HttpWrapperService } from "./http-wrapper.service";
import { GeneralService } from "./general.service";
import { IServiceConfigArgs, ServiceConfig } from "./service.config";
import { Observable, map, catchError } from "rxjs";
import { BaseResponse } from "../models/api-models/BaseResponse";
import { InvoiceSetting } from "../models/interfaces/invoice.setting.interface";
import { INVOICE_API, INVOICE_API_2 } from "./apiurls/invoice.api";
import { ProformaFilter, ProformaGetRequest, ProformaResponse } from "../models/api-models/proforma";
import { PROFORMA_API } from "./apiurls/proforma.api";
import { InvoiceReceiptFilter, ReceiptVoucherDetailsRequest, ReciptResponse, Voucher, VoucherRequest } from "../models/api-models/recipt";
import { VoucherTypeEnum } from "../models/api-models/Sales";
import { RECEIPT_API } from "./apiurls/receipt.api";
import { PURCHASE_RECORD_DATE_OPERATION, PURCHASE_RECORD_DUE_DATE_OPERATION, PURCHASE_RECORD_GRAND_TOTAL_OPERATION, PurchaseRecordAdvanceSearch } from "../purchase/purchase-record/constants/purchase-record.interface";
import { CustomTemplateResponse } from "../models/api-models/Invoice";
import { VouchersUtilityService } from "../vouchers/utility/vouchers.utility.service";
import { SALES_API_V2, SALES_API_V4 } from "./apiurls/sales.api";
import { PURCHASE_ORDER_API } from "./apiurls/purchase-order.api";
import { PAGINATION_LIMIT } from "../app.constant";


@Injectable()
export class VoucherService {
    private companyUniqueName: string;

    constructor(
        private errorHandler: GiddhErrorHandler,
        private http: HttpWrapperService,
        private generalService: GeneralService,
        private vouchersUtilityService: VouchersUtilityService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs
    ) {

    }

    public getInvoiceSettings(): Observable<BaseResponse<InvoiceSetting, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVOICE_API.SETTING_INVOICE?.replace(':companyUniqueName', this.companyUniqueName)).pipe(
            map((res) => {
                let data: BaseResponse<InvoiceSetting, string> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<InvoiceSetting, string>(e)));
    }

    public getAllProformaEstimate(request: ProformaFilter, voucherType: string): Observable<BaseResponse<ProformaResponse, ProformaFilter>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.generalService.createQueryString(this.config.apiUrl + PROFORMA_API.getAll, {
            page: request.page, count: request.count, from: request.from, to: request.to, q: request.q, sort: request.sort, sortBy: request.sortBy
        });

        return this.http.post(url
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':vouchers', voucherType), request)
            .pipe(
                map((res) => {
                    let data: BaseResponse<ProformaResponse, ProformaFilter> = res;
                    data.queryString = { page: request.page, count: request.count, from: request.from, to: request.to, type: 'pdf' };
                    data.request = request;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<ProformaResponse, ProformaFilter>(e, request, { page: request.page, count: request.count, from: request.from, to: request.to, type: 'pdf' })));
    }

    public getAllVouchers(body: InvoiceReceiptFilter, type: string): Observable<BaseResponse<ReciptResponse, InvoiceReceiptFilter>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        const requestPayload = (type === VoucherTypeEnum.purchase && this.generalService.voucherApiVersion !== 2) ? this.getPurchaseRecordPayload(body) : body;
        const contextPath = (type === VoucherTypeEnum.purchase && this.generalService.voucherApiVersion !== 2) ? RECEIPT_API.GET_ALL_PURCHASE_RECORDS : RECEIPT_API.GET_ALL;
        const requestParameter = {
            page: body?.page, count: body?.count, from: body?.from, to: body?.to, q: (body?.q) ? encodeURIComponent(body?.q) : body?.q, sort: body?.sort, sortBy: body?.sortBy
        };

        if (this.generalService.voucherApiVersion === 2) {
            delete body.from;
            delete body.to;
        }

        let url = this.vouchersUtilityService.createQueryString(this.config.apiUrl + contextPath, (type === VoucherTypeEnum.purchase && this.generalService.voucherApiVersion !== 2) ? requestParameter : { ...requestParameter, type });
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.post(url
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), requestPayload).pipe(
                map((res) => {
                    let data: BaseResponse<ReciptResponse, InvoiceReceiptFilter> = res;
                    data.queryString = { page: body?.page, count: body?.count, from: body?.from, to: body?.to, type: 'pdf' };
                    data.request = body;
                    return data;
                }),
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
        if (request.invoiceDateEqual) {
            advanceSearchRequest.purchaseDateOperation = PURCHASE_RECORD_DATE_OPERATION.ON;
        } else if (request.invoiceDateAfter) {
            advanceSearchRequest.purchaseDateOperation = PURCHASE_RECORD_DATE_OPERATION.AFTER;
        } else if (request.invoiceDateBefore) {
            advanceSearchRequest.purchaseDateOperation = PURCHASE_RECORD_DATE_OPERATION.BEFORE;
        }
        advanceSearchRequest.dueDate = request.dueDate;
        if (request.dueDateEqual) {
            advanceSearchRequest.dueDateOperation = PURCHASE_RECORD_DUE_DATE_OPERATION.ON;
        } else if (request.dueDateAfter) {
            advanceSearchRequest.dueDateOperation = PURCHASE_RECORD_DUE_DATE_OPERATION.AFTER;
        } else if (request.dueDateBefore) {
            advanceSearchRequest.dueDateOperation = PURCHASE_RECORD_DUE_DATE_OPERATION.BEFORE;
        }
        advanceSearchRequest.grandTotal = request.total;
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

        if (request.purchaseOrderNumber) {
            advanceSearchRequest.purchaseOrderNumber = request.purchaseOrderNumber;
        }

        return advanceSearchRequest;
    }

    public getAllCreatedTemplates(voucherType: any): Observable<BaseResponse<CustomTemplateResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVOICE_API.GET_CREATED_TEMPLATES?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':voucherType', encodeURIComponent(voucherType))).pipe(map((res) => {
            let data: BaseResponse<CustomTemplateResponse[], string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<CustomTemplateResponse[], string>(e, '')));
    }

    /**
     * Returns accounts of a particular group and with particular currency
     *
     * @param {*} requestObject Comma delimited string of group names or request object with param keys for the API in dynamic search
     * @returns {Observable<any>} Observable to carry out further operations
     * @memberof SalesService
     */
    public getBriefAccounts(params: any): Observable<any> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let url = `${this.config.apiUrl}${SALES_API_V2.GET_ACCOUNTS_OF_GROUP_WITH_CURRENCY?.replace(':companyUniqueName', companyUniqueName)}`;
        url = this.generalService.createQueryString(url, params);
        return this.http.get(url);
    }

    /**
     * This will send the api request to get all pending purchase orders
     *
     * @param {*} getRequestObject
     * @param {*} postRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PurchaseOrderService
     */
    public getVendorPurchaseOrders(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
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

    public generateVoucher(accountUniqueName: string, model: any): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + SALES_API_V4.GENERATE_GENERIC_ITEMS;
        url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);

        return this.http.post(url
            ?.replace(':companyUniqueName', companyUniqueName)
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName))
            , model)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = model;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    public getVoucherDetails(accountUniqueName: string, model: ReceiptVoucherDetailsRequest): Observable<BaseResponse<Voucher, ReceiptVoucherDetailsRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + RECEIPT_API.GET_DETAILS_V4
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName));
        let requestObj: VoucherRequest | ReceiptVoucherDetailsRequest = Object.assign({}, model);
        requestObj = new VoucherRequest(model.invoiceNumber, model.voucherType, model?.uniqueName);

        url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        return this.http.post(url, requestObj
        ).pipe(
            map((res) => {
                let data: BaseResponse<Voucher, ReceiptVoucherDetailsRequest> = res;
                data.queryString = accountUniqueName;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<Voucher, ReceiptVoucherDetailsRequest>(e, model, { accountUniqueName })));
    }

    public sendVoucherOnEmail(accountUniqueName: string, dataToSend: any): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVOICE_API_2.SEND_INVOICE_ON_MAIL?.replace(':companyUniqueName', this.companyUniqueName)
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName));
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.post(url, dataToSend).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.queryString = { accountUniqueName, dataToSend };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public sendProformaEstimateOnEmail(request: ProformaGetRequest, voucherType: string): Observable<BaseResponse<string, ProformaGetRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + PROFORMA_API.mailProforma
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':vouchers', voucherType)
            ?.replace(':accountUniqueName', encodeURIComponent(request.accountUniqueName)),
            request
        ).pipe(
            map((res) => {
                let data: BaseResponse<string, ProformaGetRequest> = res;
                data.queryString = voucherType;
                data.request = request;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, ProformaGetRequest>(e, request)));
    }

    /**
     * This will get the invoice list where balance is due
     *
     * @param {any} model voucher type & account unique name
     * @param {string} date Date in GIDDH_DATE_FORMAT
     * @param {number} count
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
     */
    public getVouchersList(model: any, date: string, count: number = PAGINATION_LIMIT): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = SALES_API_V2.GET_VOUCHER_INVOICE_LIST
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':voucherDate', encodeURIComponent(date))
            ?.replace(':adjustmentRequest', String(true))
            ?.replace(':count', String(count))
            ?.replace(':number', encodeURIComponent((model.number || "")))
            ?.replace(':page', (model.page || 1));
        if (this.generalService.voucherApiVersion === 2) {
            contextPath = this.generalService.addVoucherVersion(contextPath, this.generalService.voucherApiVersion);
        }
        return this.http.post(this.config.apiUrl + contextPath, model
        ).pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error, model)));
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
}