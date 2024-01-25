import { Inject, Injectable, Optional } from "@angular/core";
import { GiddhErrorHandler } from "./catchManager/catchmanger";
import { HttpWrapperService } from "./http-wrapper.service";
import { GeneralService } from "./general.service";
import { IServiceConfigArgs, ServiceConfig } from "./service.config";
import { Observable, map, catchError } from "rxjs";
import { BaseResponse } from "../models/api-models/BaseResponse";
import { InvoiceSetting } from "../models/interfaces/invoice.setting.interface";
import { INVOICE_API } from "./apiurls/invoice.api";
import { ProformaFilter, ProformaResponse } from "../models/api-models/proforma";
import { PROFORMA_API } from "./apiurls/proforma.api";
import { InvoiceReceiptFilter, ReciptResponse } from "../models/api-models/recipt";
import { VoucherTypeEnum } from "../models/api-models/Sales";
import { RECEIPT_API } from "./apiurls/receipt.api";
import { PURCHASE_RECORD_DATE_OPERATION, PURCHASE_RECORD_DUE_DATE_OPERATION, PURCHASE_RECORD_GRAND_TOTAL_OPERATION, PurchaseRecordAdvanceSearch } from "../purchase/purchase-record/constants/purchase-record.interface";
import { CustomTemplateResponse } from "../models/api-models/Invoice";

@Injectable()
export class VoucherService {
    private companyUniqueName: string;

    constructor(
        private errorHandler: GiddhErrorHandler, 
        private http: HttpWrapperService, 
        private generalService: GeneralService, 
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs
    ) {

    }

    private createQueryString(url: string, model: any): string {
        if ((model.from)) {
            url = url + 'from=' + model.from + '&';
        }
        if ((model.to)) {
            url = url + 'to=' + model.to + '&';
        }
        if ((model.page)) {
            url = url + 'page=' + model.page + '&';
        }
        if ((model.count)) {
            url = url + 'count=' + model.count;
        }
        if ((model.type)) {
            url = url + '&type=' + model.type;
        }
        if ((model.sort)) {
            url = url + '&sort=' + model.sort;
        }
        if ((model.sortBy)) {
            url = url + '&sortBy=' + model.sortBy;
        }
        if ((model.q)) {
            url = url + '&q=' + model.q;
        }
        return url;
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

        let url = this.createQueryString(this.config.apiUrl + contextPath, (type === VoucherTypeEnum.purchase && this.generalService.voucherApiVersion !== 2) ? requestParameter : { ...requestParameter, type });
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
}