import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './httpWrapper.service';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { GST_RECONCILE_API } from './apiurls/GstReconcile.api';
import { GstOverViewRequest, GstOverViewResult, Gstr1SummaryRequest, Gstr1SummaryResponse, GstReconcileInvoiceResponse, GStTransactionRequest, GstTransactionResult, VerifyOtpRequest } from '../models/api-models/GstReconcile';
import { catchError, map } from 'rxjs/operators';
import { GSTR_API } from './apiurls/gstR.api';

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

  public GstReconcileGetInvoices(period: any, action: string, page: string, count: string, refresh: boolean): Observable<BaseResponse<GstReconcileInvoiceResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;

    return this._http.get(this.config.apiUrl + GST_RECONCILE_API.GET_INVOICES
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':from', encodeURIComponent(period.from))
      .replace(':to', encodeURIComponent(period.to))
      .replace(':action', encodeURIComponent(action))
      .replace(':page', encodeURIComponent(page))
      .replace(':count', encodeURIComponent(count))
      .replace(':refresh', refresh ? 'true' : 'false')
    )
      .pipe(
        map((res) => {
          let data: BaseResponse<GstReconcileInvoiceResponse, string> = res;
          data.queryString = {period, action, page, count};
          return data;
        })
        , catchError((e) => this.errorHandler.HandleCatch<GstReconcileInvoiceResponse, string>(e, '')));
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
          data.queryString = {requestParam, type};
          return data;
        })
        , catchError((e) => this.errorHandler.HandleCatch<GstOverViewResult, GstOverViewRequest>(e, '')));
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
          data.queryString = {requestParam, type};
          return data;
        })
        , catchError((e) => this.errorHandler.HandleCatch<GstTransactionResult, GStTransactionRequest>(e, '')));
  }

  public GetGstReturnSummary(type: string, requestParam: any): Observable<BaseResponse<any, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + GSTR_API.GET_RETURN_SUMMARY
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':page', requestParam.page)
      .replace(':count', requestParam.count)
      .replace(':from', requestParam.period.from)
      .replace(':to', requestParam.period.to)
      .replace(':gstin', requestParam.gstin)
      .replace(':gstType', type)
      .replace(':gstReturnType', requestParam.gstReturnType)
    )
      .pipe(
        map((res) => {
          let data: BaseResponse<any, string> = res;
          data.queryString = {requestParam, type};
          return data;
        })
        , catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '')));
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
          data.queryString = {model};
          return data;
        })
        , catchError((e) => this.errorHandler.HandleCatch<Gstr1SummaryResponse, Gstr1SummaryRequest>(e, '')));
  }

  public GetTransactionCount(requestParam: any): Observable<BaseResponse<any, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + GSTR_API.GET_TRANSACTIONS_COUNTS
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':from', requestParam.period.from)
      .replace(':to', requestParam.period.to)
      .replace(':gstin', requestParam.gstin)
    )
      .pipe(
        map((res) => {
          let data: BaseResponse<any, any> = res;
          data.queryString = requestParam;
          return data;
        })
        , catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  public GetDocumentIssuedTransaction(requestParam: any): Observable<BaseResponse<any, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + GSTR_API.GET_DOCUMENT_ISSUED
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':from', requestParam.period.from)
      .replace(':to', requestParam.period.to)
      .replace(':gstin', requestParam.gstin)
    )
      .pipe(
        map((res) => {
          let data: BaseResponse<any, string> = res;
          data.queryString = requestParam;
          return data;
        })
        , catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '')));
  }
}
