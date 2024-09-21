import { Inject, Injectable, Optional } from "@angular/core";
import { GiddhErrorHandler } from "./catchManager/catchmanger";
import { HttpWrapperService } from "./http-wrapper.service";
import { GeneralService } from "./general.service";
import { IServiceConfigArgs, ServiceConfig } from "./service.config";
import { Observable, map, catchError } from "rxjs";
import { BaseResponse } from "../models/api-models/BaseResponse";
import { InvoiceSetting } from "../models/interfaces/invoice.setting.interface";
import { BULK_UPDATE_VOUCHER, INVOICE_API, INVOICE_API_2 } from "./apiurls/invoice.api";
import { ProformaFilter, ProformaGetRequest, ProformaResponse, ProformaUpdateActionRequest } from "../models/api-models/proforma";
import { ESTIMATES_API, PROFORMA_API } from "./apiurls/proforma.api";
import { InvoiceReceiptFilter, ReceiptVoucherDetailsRequest, ReciptDeleteRequest, ReciptResponse, Voucher, VoucherRequest } from "../models/api-models/recipt";
import { RECEIPT_API } from "./apiurls/receipt.api";
import { CustomTemplateResponse } from "../models/api-models/Invoice";
import { VouchersUtilityService } from "../vouchers/utility/vouchers.utility.service";
import { SALES_API_V2, SALES_API_V4 } from "./apiurls/sales.api";
import { PURCHASE_ORDER_API } from "./apiurls/purchase-order.api";
import { PAGINATION_LIMIT } from "../app.constant";
import { ADVANCE_RECEIPTS_API } from "./apiurls/advance-receipt-adjustment.api";
import { BULK_VOUCHER_EXPORT_API } from "./apiurls/bulkvoucherexport.api";
import { COMMON_API } from "./apiurls/common.api";
import { VoucherTypeEnum } from "../vouchers/utility/vouchers.const";


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
        const requestParameter = {
            page: body?.page,
            count: body?.count,
            from: body?.from,
            to: body?.to,
            q: ((body?.q) ? encodeURIComponent(body?.q) : body?.q),
            sort: body?.sort,
            sortBy: body?.sortBy
        };

        delete body.from;
        delete body.to;

        let contextPath = RECEIPT_API.GET_ALL?.replace("?", "");

        let url = this.vouchersUtilityService.createQueryString(this.config.apiUrl + contextPath, { ...requestParameter, type });
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
     * This will send the api request to get all purchase orders
     *
     * @param {*} model
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
     */
    public getPurchaseOrderList(model: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.GET_ALL;
        url = url?.replace(':companyUniqueName', this.companyUniqueName);
        url = url?.replace(':from', model.from ?? '');
        url = url?.replace(':to', model.to ?? '');
        url = url?.replace(':page', model.page ?? 1);
        url = url?.replace(':count', model.count ?? '');
        url = url?.replace(':sort', model.sort ?? '');
        url = url?.replace(':sortBy', model.sortBy ?? 'purchaseDate');

        const { vendorName, type, purchaseOrderNumber, grandTotal, grandTotalOperation, statuses, dueFrom, dueTo } = model;

        return this.http.post(url, { vendorName, type, purchaseOrderNumber, grandTotal, grandTotalOperation, statuses, dueFrom, dueTo }).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * This will send email
     *
     * @param {*} getRequestObject
     * @param {*} postRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
     */
    public sendEmail(getRequestObject: any, postRequestObject: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.EMAIL;
        url = url?.replace(':companyUniqueName', this.companyUniqueName);
        url = url?.replace(':accountUniqueName', encodeURIComponent(getRequestObject.accountUniqueName));
        url = url?.replace(':poUniqueName', encodeURIComponent(getRequestObject.uniqueName));
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

    /**
     * Get voucher balances
     *
     * @param {*} payload
     * @param {string} requestType
     * @return {*}  {Observable<BaseResponse<ReciptResponse, any>>}
     * @memberof VoucherService
     */
    public getVoucherBalances(payload: any, requestType: string): Observable<BaseResponse<ReciptResponse, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = RECEIPT_API.GET_ALL_BAL_SALE_DUE?.replace("?", "");
        let url = this.generalService.createQueryString(this.config.apiUrl + contextPath, {
            page: payload?.page, count: payload?.count, from: payload?.from, to: payload?.to, type: requestType, q: payload?.q ? encodeURIComponent(payload?.q) : payload?.q, sort: payload?.sort, sortBy: payload?.sortBy
        });

        url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);

        delete payload.from;
        delete payload.to;

        return this.http.post(url
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), payload).pipe(
                map((res) => {
                    let data: BaseResponse<ReciptResponse, any> = res;
                    data.queryString = { page: payload?.page, count: payload?.count, from: payload?.from, to: payload?.to };
                    data.request = payload;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<ReciptResponse, any>(e, payload)));
    }

    /**
     * Export Voucher API
     *
     * @param {*} model
     * @return {*}  {Observable<BaseResponse<string, any>>}
     * @memberof VoucherService
     */
    public exportVouchers(model: any): Observable<BaseResponse<string, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVOICE_API.DOWNLOAD_INVOICE_EXPORT_CSV?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':from', encodeURIComponent(model.from))?.replace(':to', encodeURIComponent(model.to));

        delete model.dataToSend.from;
        delete model.dataToSend.to;
        url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);

        return this.http.post(url, model.dataToSend).pipe(
            map((res) => {
                let data: BaseResponse<string, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, any>(model)));
    }

    /**
     * Voucher Action API (i.e unpaid, hold, cancel etc)
     *
     * @param {string} voucherUniqueName
     * @param {{ action: string, amount?: number }} action
     * @return {*}  {Observable<BaseResponse<string, string>>}
     * @memberof VoucherService
     */
    public actionVoucher(voucherUniqueName: string, action: { action: string, amount?: number }): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVOICE_API.ACTION_ON_INVOICE?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':invoiceUniqueName', voucherUniqueName);
        url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);

        return this.http.post(url, action).pipe(
            map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = voucherUniqueName;
                data.queryString = { voucherUniqueName, action };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e, voucherUniqueName)));
    }

    /**
     * This will delete the order
     *
     * @param {*} getRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
     */
    public deleteSinglePOVoucher(uniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.DELETE;
        url = url?.replace(':companyUniqueName', this.companyUniqueName);
        url = url?.replace(':poUniqueName', uniqueName);

        return this.http.delete(url).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, uniqueName)));
    }

    /**
     * This will bulk update the data
     *
     * @param {*} getRequestObject
     * @param {*} postRequestObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
     */
    public bulkUpdate(actionType: string, postRequestObject: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.BULK_UPDATE;
        url = url?.replace(':companyUniqueName', this.companyUniqueName);
        url = url?.replace(':action', actionType);
        return this.http.patch(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, actionType)));
    }

    /**
     * API call to adjust an invoice with advance receipts
     *
     * @param {*} model Adjust advance receipts request model
     * @param {string} invoiceUniqueName Invoice unique name which need to adjust
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
     */
    public adjustAnInvoiceWithAdvanceReceipts(model: any, invoiceUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url;
        url = this.config.apiUrl + ADVANCE_RECEIPTS_API.VOUCHER_ADJUSTMENT_WITH_ADVANCE_RECEIPT?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':voucherUniqueName', invoiceUniqueName);
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
     * Update Action for Proforma 
     *
     * @param {ProformaUpdateActionRequest} request
     * @param {string} voucherType
     * @return {*}  {Observable<BaseResponse<string, ProformaUpdateActionRequest>>}
     * @memberof VoucherService
     */
    public updateAction(request: ProformaUpdateActionRequest, voucherType: string): Observable<BaseResponse<string, ProformaUpdateActionRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + PROFORMA_API.updateAction
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':vouchers', voucherType)
            ?.replace(':accountUniqueName', encodeURIComponent(request.accountUniqueName)),
            request
        ).pipe(
            map((res) => {
                let data: BaseResponse<string, ProformaUpdateActionRequest> = res;
                data.queryString = voucherType;
                data.request = request;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, ProformaUpdateActionRequest>(e, request)));
    }

    /**
     * Generate Invoice for Estimate and Proforma 
     *
     * @param {ProformaGetRequest} request
     * @param {string} voucherType
     * @return {*}  {Observable<BaseResponse<string, ProformaGetRequest>>}
     * @memberof VoucherService
     */
    public generateInvoice(request: ProformaGetRequest, voucherType: string): Observable<BaseResponse<string, ProformaGetRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + (voucherType === 'proformas' ? PROFORMA_API.generateInvoice : ESTIMATES_API.generateInvoice)
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
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
     * Generate Proforma for Estimate
     *
     * @param {ProformaGetRequest} request
     * @param {string} voucherType
     * @return {*}  {Observable<BaseResponse<string, ProformaGetRequest>>}
     * @memberof VoucherService
     */
    public generateProforma(request: ProformaGetRequest, voucherType: string): Observable<BaseResponse<string, ProformaGetRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + ESTIMATES_API.generateProforma
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
     * Delete Estimste/Proforma Voucher
     *
     * @param {ProformaGetRequest} request
     * @param {string} voucherType
     * @return {*}  {Observable<BaseResponse<string, ProformaGetRequest>>}
     * @memberof VoucherService
     */
    public deleteEstimsteProformaVoucher(request: ProformaGetRequest, voucherType: string): Observable<BaseResponse<string, ProformaGetRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.deleteWithBody(this.config.apiUrl + PROFORMA_API.base
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
     *  Delete Receipt voucher
     *
     * @param {string} accountUniqueName
     * @param {ReciptDeleteRequest} queryRequest
     * @return {*}  {Observable<BaseResponse<string, ReciptDeleteRequest>>}
     * @memberof VoucherService
     */
    public deleteReceipt(accountUniqueName: string, queryRequest: ReciptDeleteRequest): Observable<BaseResponse<string, ReciptDeleteRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + RECEIPT_API.DELETE
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName));

        url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);

        return this.http.deleteWithBody(
            url,
            queryRequest
        ).pipe(
            map((res) => {
                let data: BaseResponse<string, ReciptDeleteRequest> = res;
                data.request = queryRequest;
                data.queryString = { accountUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, ReciptDeleteRequest>(e, accountUniqueName))
        )
    }

    /**
     * API call for bulk update Invoice
     *
     * @param {*} model
     * @param {string} actionType
     * @returns
     * @memberof VoucherService
     */
    public bulkUpdateInvoice(model: any, actionType: string): Observable<BaseResponse<any, any>> {
        let url;
        if (actionType) {
            url = this.config.apiUrl + BULK_UPDATE_VOUCHER.BULK_UPDATE_VOUCHER_ACTION?.replace(':companyUniqueName', this.generalService.companyUniqueName)?.replace(':actionType', actionType);
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.post(url, model).pipe(
            map(res => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                data.queryString = { model, actionType };
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * This will bulk export the vouchers
     *
     * @param {*} getRequest
     * @param {*} postRequest
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
     */
    public bulkExport(getRequest: any, postRequest: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + BULK_VOUCHER_EXPORT_API.BULK_EXPORT;
        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        url = url?.replace(':from', getRequest.from);
        url = url?.replace(':to', getRequest.to);
        url = url?.replace(':type', getRequest.type);
        url = url?.replace(':mail', getRequest.mail);
        url = url?.replace(':q', getRequest.q);
        url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        delete postRequest.from;
        delete postRequest.to;

        return this.http.post(url, postRequest).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = postRequest;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, postRequest)));
    }

    /**
     * Get PDF Base64 URL or Attachement Blob file
     * 
     * @param {*} model 
     * @param {string} downloadOption 
     * @param {string} fileType 
     * @param {*} voucherType 
     * @return {*}  {Observable<any>}
     * @memberof VoucherService
     */
    public downloadPdfFile(model: any, downloadOption: string, fileType: string = "base64", voucherType: any): Observable<any> {
        let apiUrl = '';
        let httpMethod: 'post' | 'get' = 'post';
        let apiParams = model;
        let responseType = (fileType === 'base64') ? {} : { responseType: 'blob' };

        if ([VoucherTypeEnum.sales, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote, VoucherTypeEnum.purchase].includes(voucherType)) {
            apiUrl = this.config.apiUrl + COMMON_API.DOWNLOAD_FILE
                ?.replace(':fileType', fileType)
                ?.replace(':downloadOption', downloadOption)
                ?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));
        } else if ([VoucherTypeEnum.generateProforma, VoucherTypeEnum.generateEstimate].includes(voucherType)) {
            apiUrl = this.config.apiUrl + PROFORMA_API.download
                ?.replace(':vouchers', voucherType)
                ?.replace(':fileType', fileType)
                ?.replace(':accountUniqueName', encodeURIComponent(model.accountUniqueName))
                ?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));
        } else if (voucherType === VoucherTypeEnum.purchaseOrder) {
            httpMethod = 'get';
            apiUrl = this.config.apiUrl + PURCHASE_ORDER_API.GET_PDF
                ?.replace(':companyUniqueName', this.generalService.companyUniqueName)
                ?.replace(':accountUniqueName', encodeURIComponent(model.accountUniqueName))
                ?.replace(':poUniqueName', model.poUniqueName);
            apiParams = undefined;
        }

        return this.http[httpMethod](apiUrl, apiParams, responseType).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * This will get voucher versions
     *
     * @param {*} getRequestObject
     * @param {*} postRequestObject
     * @param {string} voucherType
     * @return {*}  {Observable<BaseResponse<any, string>>}
     * @memberof VoucherService
     */
    public getVoucherVersions(getRequestObject: any, postRequestObject: any, voucherType: string): Observable<BaseResponse<any, string>> {
        if (voucherType === VoucherTypeEnum.purchaseOrder) {
            let url: string = this.config.apiUrl + PURCHASE_ORDER_API.GET_ALL_VERSIONS;
            url = url?.replace(':companyUniqueName', this.generalService.companyUniqueName);
            url = url?.replace(':accountUniqueName', encodeURIComponent(getRequestObject.accountUniqueName));
            url = url?.replace(':page', getRequestObject.page);
            url = url?.replace(':count', getRequestObject.count);

            return this.http.post(url, postRequestObject).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e, getRequestObject)));
        } else if (voucherType === VoucherTypeEnum.generateEstimate || voucherType === VoucherTypeEnum.generateProforma) {
            let url = this.generalService.createQueryString(this.config.apiUrl + ESTIMATES_API.getVersions, {
                page: getRequestObject.page, count: getRequestObject.count
            });
            return this.http.post(url
                ?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName))
                ?.replace(':vouchers', voucherType)
                ?.replace(':accountUniqueName', encodeURIComponent(getRequestObject.accountUniqueName)),
                postRequestObject
            ).pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.queryString = voucherType;
                    data.request = postRequestObject;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, postRequestObject)));
        } else {
            let url = this.config.apiUrl + INVOICE_API.GET_ALL_VERSIONS;
            url = url?.replace(':companyUniqueName', this.generalService.companyUniqueName);
            url = url?.replace(':voucherUniqueName', getRequestObject?.voucherUniqueName);
            url = url?.replace(':page', getRequestObject.page);
            url = url?.replace(':count', getRequestObject.count);
            url = this.generalService.addVoucherVersion(url, 2);

            return this.http.get(url).pipe(
                map((res) => {
                    let data: BaseResponse<any, string> = res;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
        }
    }

    /**
     * This will bulk update the status of orders
     *
     * @param {string} accountUniqueName
     * @param {*} payload
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
     */
    public purchaseOrderStatusUpdate(accountUniqueName: string, payload: any): Observable<BaseResponse<any, any>> {
        let url: string = this.config.apiUrl + PURCHASE_ORDER_API.STATUS_UPDATE;
        url = url?.replace(':companyUniqueName', this.generalService.companyUniqueName);
        url = url?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName));

        return this.http.patch(url, payload).pipe(catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Uploads file
     * 
     * @param {*} postRequest 
     * @param {boolean}  addVoucherVersion 
     * @return {*} {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
     */
    public uploadFile(postRequest: any, addVoucherVersion: boolean = false): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.UPLOAD_FILE?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));

        const formData: FormData = new FormData();
        formData.append('file', postRequest.file, postRequest.fileName);

        if (postRequest.entries) {
            formData.append('entries', postRequest.entries);
        }
        if (addVoucherVersion) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }

        return this.http.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    /**
     * Updates attachment in voucher
     *
     * @param {*} postRequestObject
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
     */
    public updateAttachmentInVoucher(postRequestObject: any): Observable<BaseResponse<any, any>> {
        let url: string = `${this.config.apiUrl}${SALES_API_V4.UPDATE_ATTACHMENT?.replace(':companyUniqueName', this.generalService.companyUniqueName)}`;
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        return this.http.patch(url, postRequestObject).pipe(
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, postRequestObject)));
    }

    /**
     * Handler for cancellation of E-invoice
     *
     * @param {*} requestObject
     * @param {*} postObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof VoucherService
     */
    public cancelEInvoice(requestObject: any, postObject: any): Observable<BaseResponse<any, any>> {
        let contextPath = 
        `${this.config.apiUrl}${(requestObject.voucherType === VoucherTypeEnum.creditNote || requestObject.voucherType === VoucherTypeEnum.debitNote) 
            ? INVOICE_API.CANCEL_CN_DN_E_INVOICE_API 
            : INVOICE_API_2.CANCEL_E_INVOICE}`;

        contextPath = contextPath?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));
        if (requestObject.accountUniqueName) {
            contextPath = contextPath?.replace(':accountUniqueName', encodeURIComponent(requestObject.accountUniqueName));
            delete requestObject.accountUniqueName;
        }
        Object.keys(requestObject).forEach((key, index) => {
            const delimiter = index === 0 ? '?' : '&'
            if (requestObject[key] !== undefined) {
                contextPath += `${delimiter}${key}=${encodeURIComponent(requestObject[key])}`
            }
        });
        // contextPath = this.generalService.addVoucherVersion(contextPath, this.generalService.voucherApiVersion);

        return this.http.post(contextPath, postObject).pipe(
            catchError((error) => this.errorHandler.HandleCatch<string, any>(error)));
    }
}