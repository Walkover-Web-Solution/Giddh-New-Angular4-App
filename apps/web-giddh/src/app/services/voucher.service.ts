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

    /**
     * Get invoice settings
     *
     * @return {*}  {Observable<BaseResponse<InvoiceSetting, string>>}
     * @memberof VoucherService
     */
    public getInvoiceSettings(): Observable<BaseResponse<InvoiceSetting, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVOICE_API.SETTING_INVOICE?.replace(':companyUniqueName', this.companyUniqueName)).pipe(
            map((res) => {
                let data: BaseResponse<InvoiceSetting, string> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<InvoiceSetting, string>(e)));
    }

    /**
     * Get all proforma/estimate
     *
     * @param {ProformaFilter} request
     * @param {string} voucherType
     * @return {*}  {Observable<BaseResponse<ProformaResponse, ProformaFilter>>}
     * @memberof VoucherService
     */
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

    /**
     * Get all vouchers
     *
     * @param {InvoiceReceiptFilter} body
     * @param {string} type
     * @return {*}  {Observable<BaseResponse<ReciptResponse, InvoiceReceiptFilter>>}
     * @memberof VoucherService
     */
    public getAllVouchers(body: InvoiceReceiptFilter, type: string): Observable<BaseResponse<ReciptResponse, InvoiceReceiptFilter>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        const requestPayload = body;
        const contextPath = RECEIPT_API.GET_ALL;
        const requestParameter = {
            page: body?.page, count: body?.count, from: body?.from, to: body?.to, q: (body?.q) ? encodeURIComponent(body?.q) : body?.q, sort: body?.sort, sortBy: body?.sortBy
        };

        delete body.from;
        delete body.to;

        let url = this.vouchersUtilityService.createQueryString(this.config.apiUrl + contextPath, (type === VoucherTypeEnum.purchase && this.generalService.voucherApiVersion !== 2) ? requestParameter : { ...requestParameter, type });
        url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);

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
     * Get list of all templates
     *
     * @param {*} voucherType
     * @return {*}  {Observable<BaseResponse<CustomTemplateResponse[], string>>}
     * @memberof VoucherService
     */
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
     * @memberof VoucherService
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
     * @memberof VoucherService
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

    /**
     * Generate voucher
     *
     * @param {string} accountUniqueName
     * @param {*} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
     */
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

    /**
     * Get voucher details
     *
     * @param {string} accountUniqueName
     * @param {ReceiptVoucherDetailsRequest} model
     * @return {*}  {Observable<BaseResponse<Voucher, ReceiptVoucherDetailsRequest>>}
     * @memberof VoucherService
     */
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

    /**
     * Sends voucher pdf on email
     *
     * @param {string} accountUniqueName
     * @param {*} dataToSend
     * @return {*}  {Observable<BaseResponse<string, string>>}
     * @memberof VoucherService
     */
    public sendVoucherOnEmail(accountUniqueName: string, dataToSend: any): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVOICE_API_2.SEND_INVOICE_ON_MAIL?.replace(':companyUniqueName', this.companyUniqueName)
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName));
        url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        return this.http.post(url, dataToSend).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.queryString = { accountUniqueName, dataToSend };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Sends proforma/estimate voucher pdf on email
     *
     * @param {ProformaGetRequest} request
     * @param {string} voucherType
     * @return {*}  {Observable<BaseResponse<string, ProformaGetRequest>>}
     * @memberof VoucherService
     */
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
        contextPath = this.generalService.addVoucherVersion(contextPath, this.generalService.voucherApiVersion);
        return this.http.post(this.config.apiUrl + contextPath, model
        ).pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error, model)));
    }

    /**
     * This will send the api request to get all pending purchase orders
     *
     * @param {*} getRequestObject
     * @param {*} postRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
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

    /**
     * Get entries by entry unique name to convert pending entries to voucher
     *
     * @param {string} accountUniqueName
     * @param {*} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
     */
    public getEntriesByEntryUniqueNames(accountUniqueName: string, model: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVOICE_API_2.PREVIEW_VOUCHERS_V4?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName));
        url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);

        return this.http.post(url, model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * Updates voucher
     *
     * @param {*} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
     */
    public updateVoucher(model: any): Observable<BaseResponse<any, any>> {
        let accountUniqueName = model.account?.uniqueName;
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + SALES_API_V4.UPDATE_VOUCHER?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName));
        
        url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        return this.http.put(url, model)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = model;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * This will get the purchase order
     *
     * @param {*} getRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
     */
    public getPurchaseOrder(poUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.GET;
        url = url?.replace(':companyUniqueName', this.companyUniqueName);
        url = url?.replace(':poUniqueName', poUniqueName);

        return this.http.get(url).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, poUniqueName)));
    }

    /**
     * This will get the estimate/proforma details
     *
     * @param {*} request
     * @param {string} voucherType
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
     */
    public getEstimateProforma(request: any, voucherType: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + PROFORMA_API.base
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':vouchers', voucherType)
            ?.replace(':accountUniqueName', encodeURIComponent(request.accountUniqueName)),
            request
        ).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.queryString = voucherType;
                data.request = request;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, request)));
    }
}