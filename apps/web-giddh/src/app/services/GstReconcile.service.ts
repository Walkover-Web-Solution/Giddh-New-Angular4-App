import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './httpWrapper.service';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { GST_RECONCILE_API } from './apiurls/GstReconcile.api';
import { FileGstr1Request, GetGspSessionResponse, GstOverViewRequest, GstOverViewResult, Gstr1SummaryRequest, Gstr1SummaryResponse, GstReconcileInvoiceRequest, GstReconcileInvoiceResponse, GstrSheetDownloadRequest, GstSaveGspSessionRequest, GStTransactionRequest, GstTransactionResult, VerifyOtpRequest, Gstr3bOverviewResult } from '../models/api-models/GstReconcile';
import { catchError, map } from 'rxjs/operators';
import { GSTR_API } from './apiurls/gstR.api';
import { GST_RETURN_API } from './apiurls/purchase-invoice.api';

@Injectable()
export class GstReconcileService {
    private companyUniqueName: string;
    private user: UserDetails;

    constructor(private errorHandler: ErrorHandler, public _http: HttpWrapperService,
        private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    public GstReconcileGenerateOtp(userName: string): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;

        return this._http.get(this.config.apiUrl + GST_RECONCILE_API.GENERATE_OTP
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':userName', encodeURIComponent(userName))
        )
            .pipe(
                map((res) => {
                    let data: BaseResponse<string, string> = res;
                    data.queryString = userName;
                    return data;
                })
                , catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
    }

    public GstReconcileVerifyOtp(model: VerifyOtpRequest): Observable<BaseResponse<string, VerifyOtpRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;

        return this._http.post(this.config.apiUrl + GST_RECONCILE_API.VERIFY_OTP
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)),
            model)
            .pipe(
                map((res) => {
                    let data: BaseResponse<string, VerifyOtpRequest> = res;
                    data.request = model;
                    return data;
                })
                , catchError((e) => this.errorHandler.HandleCatch<string, VerifyOtpRequest>(e, '')));
    }

    public GstReconcileGetInvoices(model: GstReconcileInvoiceRequest): Observable<BaseResponse<GstReconcileInvoiceResponse, GstReconcileInvoiceRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;

        let url = this.config.apiUrl + GST_RECONCILE_API.GET_INVOICES
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':from', encodeURIComponent(model.from))
            .replace(':to', encodeURIComponent(model.to))
            .replace(':action', encodeURIComponent(model.action))
            .replace(':page', encodeURIComponent(model.page.toString()))
            .replace(':count', encodeURIComponent(model.count.toString()))
            .replace(':refresh', model.refresh.toString());

        if (model.monthYear) {
            url = `${url}&monthYear=${model.monthYear}`;
        }

        if (model.category) {
            url = `${url}&category=${model.category}`;
        }

        return this._http.get(url)
            .pipe(
                map((res) => {
                    let data: BaseResponse<GstReconcileInvoiceResponse, GstReconcileInvoiceRequest> = res;
                    data.queryString = model;
                    return data;
                })
                , catchError((e) => this.errorHandler.HandleCatch<GstReconcileInvoiceResponse, GstReconcileInvoiceRequest>(e, '')));
    }

    public GetGstrOverview(type: string, requestParam: GstOverViewRequest): Observable<BaseResponse<GstOverViewResult, GstOverViewRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + GSTR_API.GET_OVERVIEW
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            // .replace(':page', requestParam.page)
            // .replace(':count', requestParam.count)
            .replace(':from', requestParam.from)
            .replace(':to', requestParam.to)
            .replace(':gstin', requestParam.gstin)
            .replace(':gstType', type)
        )
            .pipe(
                map((res) => {
                    let data: BaseResponse<GstOverViewResult, GstOverViewRequest> = res;
                    data.queryString = { requestParam, type };
                    return data;
                })
                , catchError((e) => this.errorHandler.HandleCatch<GstOverViewResult, GstOverViewRequest>(e, '', { requestParam, type })));
    }
    public GetGstr3BOverview(type: string, requestParam: GstOverViewRequest): Observable<BaseResponse<Gstr3bOverviewResult, GstOverViewRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + GSTR_API.GET_OVERVIEW
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            // .replace(':page', requestParam.page)
            // .replace(':count', requestParam.count)
            .replace(':from', requestParam.from)
            .replace(':to', requestParam.to)
            .replace(':gstin', requestParam.gstin)
            .replace(':gstType-summary', type)
        )
            .pipe(
                map((res) => {
                    let data: BaseResponse<Gstr3bOverviewResult, GstOverViewRequest> = res;
                    data.queryString = { requestParam, type };
                    return data;
                })
                , catchError((e) => this.errorHandler.HandleCatch<Gstr3bOverviewResult, GstOverViewRequest>(e, '', { requestParam, type })));
    }

    public GetSummaryTransaction(type: string, requestParam: any): Observable<BaseResponse<GstTransactionResult, GStTransactionRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + GSTR_API.GET_TRANSACTIONS
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':page', requestParam.page)
            .replace(':count', requestParam.count)
            .replace(':from', requestParam.from)
            .replace(':to', requestParam.to)
            .replace(':gstin', requestParam.gstin)
            .replace(':entityType', requestParam.entityType)
            .replace(':gstType', type)
            .replace(':type', requestParam.type)
            .replace(':status', requestParam.status)
        )
            .pipe(
                map((res) => {
                    let data: BaseResponse<GstTransactionResult, GStTransactionRequest> = res;
                    data.queryString = { requestParam, type };
                    return data;
                })
                , catchError((e) => this.errorHandler.HandleCatch<GstTransactionResult, GStTransactionRequest>(e, '')));
    }

    public GetGstr1SummaryDetails(model: Gstr1SummaryRequest): Observable<BaseResponse<Gstr1SummaryResponse, Gstr1SummaryRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + GSTR_API.GSTR1_SUMMARY_DETAILS
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':from', model.from)
            .replace(':to', model.to)
            .replace(':gstin', model.gstin)
            .replace(':monthYear', model.monthYear)
        )
            .pipe(
                map((res) => {
                    let data: BaseResponse<Gstr1SummaryResponse, Gstr1SummaryRequest> = res;
                    data.queryString = { model };
                    return data;
                })
                , catchError((e) => this.errorHandler.HandleCatch<Gstr1SummaryResponse, Gstr1SummaryRequest>(e, '')));
    }

    public DownloadGSTRSheet(reqObj: GstrSheetDownloadRequest): Observable<BaseResponse<any, GstrSheetDownloadRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;

        let apiUrl = GSTR_API.DOWNLOAD_SHEET
            .replace(':companyUniqueName', this.companyUniqueName)
            .replace(':from', reqObj.from)
            .replace(':to', reqObj.to)
            .replace(':sheetType', reqObj.sheetType)
            .replace(':gstType', reqObj.type)
            .replace(':gstin', reqObj.gstin);

        return this._http.get(this.config.apiUrl + apiUrl).pipe(map((res) => {
            let data: BaseResponse<any, GstrSheetDownloadRequest> = res;
            data.queryString = reqObj;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, GstrSheetDownloadRequest>(e)));
    }

    public SaveGSPSession(model: GstSaveGspSessionRequest): Observable<BaseResponse<any, GstSaveGspSessionRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + GSTR_API.SAVE_GSP_SESSION
            .replace(':companyUniqueName', this.companyUniqueName)
            .replace(':company_gstin', model.gstin)
            .replace(':USERNAME', model.userName)
            .replace(':GSP', model.gsp), {})
            .pipe(map((res) => {
                let data: BaseResponse<any, GstSaveGspSessionRequest> = res;
                data.queryString = model;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, GstSaveGspSessionRequest>(e)));
    }

    public SaveGSPSessionWithOTP(model: GstSaveGspSessionRequest): Observable<BaseResponse<string, GstSaveGspSessionRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + GSTR_API.SAVE_GSP_SESSION_WITH_OTP
            .replace(':companyUniqueName', this.companyUniqueName)
            .replace(':OTP', model.otp)
            .replace(':company_gstin', model.gstin)
            .replace(':USERNAME', model.userName)
            .replace(':GSP', model.gsp), {})
            .pipe(map((res) => {
                let data: BaseResponse<string, GstSaveGspSessionRequest> = res;
                data.queryString = model;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, GstSaveGspSessionRequest>(e)));
    }

    public FileGstr1(model: FileGstr1Request): Observable<BaseResponse<string, FileGstr1Request>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + GSTR_API.FILE_GSTR1
            .replace(':companyUniqueName', this.companyUniqueName)
            .replace(':company_gstin', model.gstin)
            .replace(':gsp', model.gsp)
            .replace(':from', model.from)
            .replace(':to', model.to), {})
            .pipe(map((res) => {
                let data: BaseResponse<string, FileGstr1Request> = res;
                data.queryString = model;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, FileGstr1Request>(e)));
    }

    public GetGSPSession(gstin: string): Observable<BaseResponse<GetGspSessionResponse, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + GST_RETURN_API.GET_GSP_SESSION
            .replace(':companyUniqueName', this.companyUniqueName)
            .replace(':company_gstin', gstin))
            .pipe(map((res) => {
                let data: BaseResponse<GetGspSessionResponse, string> = res;
                data.queryString = { gstin };
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<GetGspSessionResponse, string>(e)));
    }
}
