import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './http-wrapper.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { TB_PL_BS_API } from './apiurls/tl-pl.api';
import { AccountDetails, BalanceSheetRequest, GetCogsRequest, GetCogsResponse, ProfitLossDateRangeResponse, ProfitLossRequest, TrialBalanceExportExcelRequest, TrialBalanceRequest } from '../models/api-models/tb-pl-bs';
import { saveAs } from 'file-saver';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { ReportType } from '../multi-currency-reports/multi-currency.const';
import { filter, get, keys } from '../lodash-optimized';

@Injectable({
    providedIn: 'root'
})
export class TlPlService {
    private companyUniqueName: string;
    public isReportTailed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

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
    public getComparedProfitLoss(request: ProfitLossRequest): Observable<BaseResponse<AccountDetails, ProfitLossRequest>> {
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
    public GetCogs(request: GetCogsRequest): Observable<BaseResponse<GetCogsResponse, GetCogsRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let filteredRequest = (Object.keys(request)
            ?.filter(p => request[p] != null)
            .reduce((r, i) => ({ ...r, [i]: request[i] }), {}));

        return this.http.get(this.config.apiUrl + TB_PL_BS_API.GET_COGS
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), filteredRequest).pipe(
                map((res) => {
                    let data: BaseResponse<GetCogsResponse, GetCogsRequest> = res;
                    data.request = request;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<GetCogsResponse, { from: string; to: string }>(e, request)));
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
                    let data = this.generalService.base64ToBlob(res.body.data, 'application/xml', 512);
                    saveAs(data, res.body.name);
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
                    let data = this.generalService.base64ToBlob(res.body.data, 'application/xml', 512);
                    saveAs(data, res.body.name);
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
                    let data = this.generalService.base64ToBlob(res.body.data, 'application/xml', 512);
                    saveAs(data, res.body.name);
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
    public createMultiCurrencyReport(reportType: string, payload: any): Observable<BaseResponse<any, any>> {
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

    /**
     * Updates the tailed report for the given report type with the given account or group, either adding or removing it based on the value of the checked flag.
     * 
     * @param {any} request - The request data to send in the request, including the reportType, from, and to.
     * @param {any} payload - The payload data to send in the request, including the uniqueName of the account or group to add or remove, the entityType of the payload (either "account" or "group"), and the checked flag indicating whether to add or remove the account or group.
     * @param {string} branchUniqueName - The unique name of the branch to update the report for.
     * @returns {Observable<BaseResponse<any, any>>} An observable of the response containing the status of the report update.
     * @memberof TlPlService
     */
    public tailedReportAccountGroup(request: {reportType: typeof ReportType, from: string, to: string, branchUniqueName?: string}, payload: {uniqueName: string, entityType: 'account' | 'group', checked: boolean}[]): Observable<BaseResponse<any, any>> {
       let url = this.config.apiUrl + TB_PL_BS_API.TAILED_REPORT_ACCOUNT_GROUP
       ?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName))
       ?.replace(':reportType', request?.reportType?.toString())
       ?.replace(':from', request?.from)
       ?.replace(':to', request?.to);
       if (request?.branchUniqueName) {
           url += `&branchUniqueName=${request?.branchUniqueName}`;
       }
        return this.http.post(
            url
            , payload).pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = payload;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * Gets the reconcile date range for the given report type.
     * 
     * @param {typeof ReportType} reportType - The type of report to get the date range for (e.g., "TrialBalance", "ProfitLoss").
     * @param {string} branchUniqueName - The unique name of the branch to get the date range for.
     * @returns {Observable<BaseResponse<any, any>>} An observable of the response containing the date range.
     * @memberof TlPlService
     */
    public getReconcileDateRange(reportType: typeof ReportType, branchUniqueName?: string): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + TB_PL_BS_API.TAILED_REPORT_DATE_RANGE
        ?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName))
        ?.replace(':reportType', reportType?.toString());
        if (branchUniqueName) {
            url += `&branchUniqueName=${branchUniqueName}`;
        }
        return this.http.post(
            url
            , {}).pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = { reportType };
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }
}
