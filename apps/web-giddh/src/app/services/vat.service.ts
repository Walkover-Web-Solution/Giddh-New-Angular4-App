import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { VAT_API } from './apiurls/vat.api';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { VatReportRequest, VatReportResponse, VatReportTransactionsRequest } from '../models/api-models/Vat';
import { GiddhErrorHandler } from "./catchManager/catchmanger";
import { HttpWrapperService } from "./http-wrapper.service";
import { Observable } from "rxjs";

@Injectable()
export class VatService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService, private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        
    }

    public getVatReport(request: VatReportRequest): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        let url = this.config.apiUrl + VAT_API.VIEW_REPORT;
        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        url = url?.replace(':from', request.from);
        url = url?.replace(':to', request.to);
        url = url?.replace(':taxNumber', request.taxNumber);
        if (request.branchUniqueName) {
            request.branchUniqueName = request.branchUniqueName !== this.companyUniqueName ? request.branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${encodeURIComponent(request.branchUniqueName)}`);
        }
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<VatReportResponse, any> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, request)));
    }

    public downloadVatReport(request: VatReportRequest): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        let url = this.config.apiUrl + VAT_API.DOWNLOAD_REPORT;
        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        url = url?.replace(':from', request.from);
        url = url?.replace(':to', request.to);
        url = url?.replace(':taxNumber', request.taxNumber);
        if (request.branchUniqueName) {
            request.branchUniqueName = request.branchUniqueName !== this.companyUniqueName ? request.branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${encodeURIComponent(request.branchUniqueName)}`);
        }
        return this.http.get(url).pipe(
            map((res) => {
                return res;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, request)));
    }

    /**
     * This will get the transaction of vat report
     *
     * @param {string} companyUniqueName
     * @param {VatReportTransactionsRequest} request
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof VatService
     */
    public getVatReportTransactions(companyUniqueName: string, request: VatReportTransactionsRequest): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + VAT_API.VIEW_TRANSACTIONS_REPORT;
        url = url?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        url = url?.replace(':from', request.from);
        url = url?.replace(':to', request.to);
        url = url?.replace(':taxNumber', request.taxNumber);
        url = url?.replace(':section', request.section);
        url = url?.replace(':page', request.page);
        url = url?.replace(':count', request.count);
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, request)));
    }
}
