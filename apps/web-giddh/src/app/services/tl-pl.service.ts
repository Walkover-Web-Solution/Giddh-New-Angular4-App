import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './http-wrapper.service';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { TB_PL_BS_API } from './apiurls/tl-pl.api';
import { AccountDetails, BalanceSheetRequest, GetCogsRequest, GetCogsResponse, ProfitLossDateRangeResponse, ProfitLossRequest, TrialBalanceExportExcelRequest, TrialBalanceRequest } from '../models/api-models/tb-pl-bs';
import { saveAs } from 'file-saver';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class TlPlService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, public http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * Get Trial Balance
     */
    public GetTrailBalance(request: TrialBalanceRequest): Observable<BaseResponse<AccountDetails, TrialBalanceRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let params: any = { from: request.from, to: request.to, refresh: request.refresh };
        if (request.tagName) {
            params.tagName = request.tagName;
        }
        if (request.branchUniqueName && request.branchUniqueName !== this.companyUniqueName) {
            params.branchUniqueName = encodeURIComponent(request.branchUniqueName);
        } else {
            params.branchUniqueName = '';
        }
        return this.http.get(this.config.apiUrl + TB_PL_BS_API.GET_TRIAL_BALANCE
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), params).pipe(
                map((res) => {
                    let data: BaseResponse<AccountDetails, TrialBalanceRequest> = res;
                    data.request = request;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<AccountDetails, TrialBalanceRequest>(e, request)));
    }

    /**
     * Get V2 Trial Balance
     */
    public GetV2TrailBalance(request: TrialBalanceRequest): Observable<BaseResponse<AccountDetails, TrialBalanceRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let params: any = { from: request.from, to: request.to, refresh: request.refresh };
        if (request.tagName) {
            params.tagName = request.tagName;
        }
        if (request.branchUniqueName && request.branchUniqueName !== this.companyUniqueName) {
            params.branchUniqueName = encodeURIComponent(request.branchUniqueName);
        } else {
            params.branchUniqueName = '';
        }
        return this.http.get(this.config.apiUrl + TB_PL_BS_API.GET_V2_TRIAL_BALANCE
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), params).pipe(
                map((res) => {
                    let data: BaseResponse<AccountDetails, TrialBalanceRequest> = res;
                    data.request = request;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<AccountDetails, TrialBalanceRequest>(e, request)));
    }

    /**
     * get Profit/Loss
     */
    public GetProfitLoss(request: ProfitLossRequest): Observable<BaseResponse<AccountDetails, ProfitLossRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        if (request.branchUniqueName && request.branchUniqueName === this.companyUniqueName) {
            delete request.branchUniqueName;
        }
        let filteredRequest = (Object.keys(request)
            ?.filter(p => request[p] != null)
            .reduce((r, i) => ({ ...r, [i]: request[i] }), {}));

        return this.http.get(this.config.apiUrl + TB_PL_BS_API.GET_PROFIT_LOSS
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), filteredRequest).pipe(
                map((res) => {
                    let data: BaseResponse<AccountDetails, ProfitLossRequest> = res;
                    data.request = request;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<AccountDetails, ProfitLossRequest>(e, request)));
    }

    /**
     * Get Compared Profit/Loss
     *
     * @param {ProfitLossRequest} request
     * @return {*}  {Observable<BaseResponse<AccountDetails, ProfitLossRequest>>}
     * @memberof TlPlService
     */
    public GetComparedProfitLoss(request: ProfitLossRequest): Observable<BaseResponse<AccountDetails, ProfitLossRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        if (request.branchUniqueName && request.branchUniqueName === this.companyUniqueName) {
            delete request.branchUniqueName;
        }
        let filteredRequest = (Object.keys(request)
            ?.filter(key => request[key] != null)
            .reduce((params, item) => ({ ...params, [item]: request[item] }), {}));

        return this.http.get(this.config.apiUrl + TB_PL_BS_API.GET_COMPARED_PROFIT_LOSS
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), filteredRequest).pipe(
                map((res) => {
                    let data: BaseResponse<AccountDetails, ProfitLossRequest> = res;
                    data.request = request;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<AccountDetails, ProfitLossRequest>(e, request)));
    }

    /**
     * get Profit/Loss
     */
    public GetCogs(request: GetCogsRequest): Observable<BaseResponse<ProfitLossDateRangeResponse<GetCogsResponse>, GetCogsRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let filteredRequest = (Object.keys(request)
            ?.filter(p => request[p] != null)
            .reduce((r, i) => ({ ...r, [i]: request[i] }), {}));

        return this.http.get(this.config.apiUrl + TB_PL_BS_API.GET_COGS
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), filteredRequest).pipe(
                map((res) => {
                    let data: BaseResponse<ProfitLossDateRangeResponse<GetCogsResponse>, GetCogsRequest> = res;
                    data.request = request;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<ProfitLossDateRangeResponse<GetCogsResponse>, GetCogsRequest>(e, request)));
    }

    /**
     * get BalanceSheet
     */
    public GetBalanceSheet(request: BalanceSheetRequest): Observable<BaseResponse<AccountDetails, BalanceSheetRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        if (request.branchUniqueName && request.branchUniqueName === this.companyUniqueName) {
            delete request.branchUniqueName;
        }
        let filteredRequest = (Object.keys(request)
            ?.filter(p => request[p] != null)
            .reduce((r, i) => ({ ...r, [i]: request[i] }), {}));

        return this.http.get(this.config.apiUrl + TB_PL_BS_API.GET_BALANCE_SHEET
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), filteredRequest).pipe(
                map((res) => {
                    let data: BaseResponse<AccountDetails, BalanceSheetRequest> = res;
                    data.request = request;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    public DownloadTrialBalanceExcel(request: TrialBalanceExportExcelRequest): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.get(this.config.apiUrl + TB_PL_BS_API.DOWNLOAD_TRIAL_BALANCE_EXCEL
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), request).pipe(
                map((res) => {
                    let data = this.generalService.base64ToBlob(res.body, 'application/xml', 512);
                    saveAs(data, request.filename);
                    return res;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    public DownloadBalanceSheetExcel(request: ProfitLossRequest): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        if (request.branchUniqueName && request.branchUniqueName === this.companyUniqueName) {
            delete request.branchUniqueName;
        }
        let filteredRequest = (Object.keys(request)
            ?.filter(p => request[p] != null)
            .reduce((r, i) => ({ ...r, [i]: request[i] }), {}));

        return this.http.get(this.config.apiUrl + TB_PL_BS_API.DOWNLOAD_BALANCE_SHEET_EXCEL
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), filteredRequest).pipe(
                map((res) => {
                    let data = this.generalService.base64ToBlob(res.body, 'application/xml', 512);
                    saveAs(data, request.filename);
                    return res;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    public DownloadProfitLossExcel(request: ProfitLossRequest): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        if (request.branchUniqueName && request.branchUniqueName === this.companyUniqueName) {
            delete request.branchUniqueName;
        }
        let filteredRequest = (Object.keys(request)
            ?.filter(p => request[p] != null)
            .reduce((r, i) => ({ ...r, [i]: request[i] }), {}));

        return this.http.get(this.config.apiUrl + TB_PL_BS_API.DOWNLOAD_PROFIT_LOSS_EXCEL
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), filteredRequest).pipe(
                map((res) => {
                    let data = this.generalService.base64ToBlob(res.body, 'application/xml', 512);
                    saveAs(data, request.filename);
                    return res;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Fetches the multi-currency report for the given report type.
     * 
     * @param {string} reportType - The type of report to fetch (e.g., "TrialBalance", "ProfitLoss").
     * @returns {Observable<BaseResponse<any, any>>} An observable of the response containing the report data.
     * @memberof TlPlService
     */
    public getMultiCurrencyReport(reportType: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + TB_PL_BS_API.GET_MULTI_CURRENCY_REPORT
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':reportType', reportType)).pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }


    /**
      * Creates the multi-currency report for the given report type and payload.
      * 
      * @param {string} reportType - The type of report to create (e.g., "TrialBalance", "ProfitLoss").
      * @param {any} payload - The payload data to send in the request.
      * @returns {Observable<BaseResponse<any, any>>} An observable of the response containing the status of the report creation.
      * @memberof TlPlService
      */
    public creatMultiCurrencyReport(reportType: string, payload: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + TB_PL_BS_API.GET_MULTI_CURRENCY_REPORT
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':reportType', reportType), payload).pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }
}
