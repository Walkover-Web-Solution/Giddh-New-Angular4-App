import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GenericRequestForGenerateSCD } from '../models/api-models/Sales';
import { SALES_API_V2, SALES_API_V4 } from './apiurls/sales.api';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { ReportsDetailedRequestFilter, SalesRegisteDetailedResponse } from "../models/api-models/Reports";
import { AdvanceReceiptRequest, VoucherAdjustments } from '../models/api-models/AdvanceReceiptsAdjust';
import { ADVANCE_RECEIPTS_API } from './apiurls/advance-receipt-adjustment.api';

@Injectable()
export class SalesService {

    private user: UserDetails;
    private companyUniqueName: string;

    constructor(
        private _http: HttpWrapperService,
        private errorHandler: GiddhErrorHandler,
        private _generalService: GeneralService,
        @Optional() @Inject(ServiceConfig)
        private config: IServiceConfigArgs
    ) {
    }

    /**
     *
     * @param model : any object
     * @param updateAccount: boolean flag
     */
    public generateSales(model: any): Observable<BaseResponse<any, any>> {
        let accountUniqueName = model.invoice.account.uniqueName;
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + SALES_API_V2.GENERATE_SALES.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     *
     * @param model : GenericRequestForGenerateSCD object
     * @param updateAccount: boolean flag to update A/c
     * {{url}}/company/{{companyUniqueName}}/accounts/{{accountUniqueName}}/vouchers/generate
     */
    public generateGenericItem(model: any, isVoucherV4 = false): Observable<BaseResponse<any, any>> {
        let accountUniqueName = model.account.uniqueName;
        this.user = this._generalService.user;
        let url;

        if (isVoucherV4) {
            url = this.config.apiUrl + SALES_API_V4.GENERATE_GENERIC_ITEMS;
        } else {
            url = this.config.apiUrl + SALES_API_V2.GENERATE_GENERIC_ITEMS;
        }
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(url
            .replace(':companyUniqueName', this.companyUniqueName)
            .replace(':accountUniqueName', accountUniqueName)
            , model)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, GenericRequestForGenerateSCD> = res;
                    data.request = model;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, GenericRequestForGenerateSCD>(e, model)));
    }

    public updateVoucher(model: GenericRequestForGenerateSCD): Observable<BaseResponse<any, GenericRequestForGenerateSCD>> {
        let accountUniqueName = model.voucher.accountDetails.uniqueName;
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + SALES_API_V2.UPDATE_VOUCHER
            .replace(':companyUniqueName', this.companyUniqueName)
            .replace(':accountUniqueName', accountUniqueName), model)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, GenericRequestForGenerateSCD> = res;
                    data.request = model;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, GenericRequestForGenerateSCD>(e, model)));
    }

    public updateVoucherV4(model: GenericRequestForGenerateSCD): Observable<BaseResponse<any, GenericRequestForGenerateSCD>> {
        let accountUniqueName = model.account.uniqueName;
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + SALES_API_V4.UPDATE_VOUCHER
            .replace(':companyUniqueName', this.companyUniqueName)
            .replace(':accountUniqueName', accountUniqueName), model)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, GenericRequestForGenerateSCD> = res;
                    data.request = model;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, GenericRequestForGenerateSCD>(e, model)));
    }

    public getStateCode(country) {
        let url = this.config.apiUrl + 'country/' + country;
        return this._http.get(url).pipe(map((res) => {
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
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + ADVANCE_RECEIPTS_API.GET_ALL_ADVANCE_RECEIPTS
            .replace(':companyUniqueName', this.companyUniqueName)
            .replace(':accountUniqueName', model.accountUniqueName).replace(':invoiceDate', model.invoiceDate))
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, AdvanceReceiptRequest> = res;
                    data.request = model;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, AdvanceReceiptRequest>(e, model)));
    }

    /**
     * API call to adjust an invoice with advance receipts
     *
     * @param {VoucherAdjustments} model Adjust advance receipts request model
     * @param {string} invoiceUniqueName Invoice unique name which need to adjust
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SalesService
     */
    public adjustAnInvoiceWithAdvanceReceipts(model: VoucherAdjustments, invoiceUniqueName: string): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + ADVANCE_RECEIPTS_API.INVOICE_ADJUSTMENT_WITH_ADVANCE_RECEIPT.replace(':companyUniqueName', this.companyUniqueName).replace(':invoiceUniqueName', invoiceUniqueName), model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
    * To generate pending type voucher
    * @param model : GenericRequestForGenerateSCD object
    *
    *
    */
    public generatePendingVoucherGenericItem(model: any): Observable<BaseResponse<any, any>> {
        let accountUniqueName = model.account.uniqueName;
        let url;
        url = this.config.apiUrl + SALES_API_V4.GENERATE_GENERIC_ITEMS + '-pending-vouchers';
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(url
            .replace(':companyUniqueName', this.companyUniqueName)
            .replace(':accountUniqueName', accountUniqueName)
            , model)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, GenericRequestForGenerateSCD> = res;
                    data.request = model;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, GenericRequestForGenerateSCD>(e, model)));
    }

}
