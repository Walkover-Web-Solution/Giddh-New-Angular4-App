import { DownloadLedgerAttachmentResponse, DownloadLedgerRequest, ExportLedgerRequest, IELedgerResponse, ILedgerAdvanceSearchRequest, ILedgerAdvanceSearchResponse, LedgerResponse, LedgerUpdateRequest, MagicLinkRequest, MagicLinkResponse, MailLedgerRequest, ReconcileResponse, TransactionsRequest, TransactionsResponse } from '../models/api-models/Ledger';
import { Inject, Injectable, Optional } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { LEDGER_API } from './apiurls/ledger.api';
import { BlankLedgerVM } from '../ledger/ledger.vm';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { DaybookQueryRequest, DayBookRequestModel } from '../models/api-models/DaybookRequest';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LedgerService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(private errorHandler: ErrorHandler, public _http: HttpWrapperService, private _httpClient: HttpClient, public _router: Router,
              private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }

  /**
   * get bank transactions for a account
   */
  public GetBankTranscationsForLedger(accountUniqueName: string, from: string = '') {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + LEDGER_API.GET_BANK_TRANSACTIONS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':from', from)).map((res) => {
      let data: BaseResponse<IELedgerResponse[], string> = res;
      data.request = accountUniqueName;
      data.queryString = {accountUniqueName};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<IELedgerResponse[], string>(e, {accountUniqueName}));
  }

  /*
  * Map Bank transaction
  */
  public MapBankTransactions(model: { uniqueName: string }, unqObj: { accountUniqueName: string, transactionId: string }): Observable<BaseResponse<string, any>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + LEDGER_API.MAP_BANK_TRANSACTIONS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(unqObj.accountUniqueName)).replace(':transactionId', unqObj.transactionId), model)
      .map((res) => {
        let data: BaseResponse<string, any> = res;
        data.request = model;
        data.queryString = unqObj;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, any>(e, model, unqObj));
  }

  /**
   * get ledger transactions
   */
  public GetLedgerTranscations(q: string = '', page: number = 1, count: number = 15, accountUniqueName: string = '', from: string = '', to: string = '', sort: string = 'asc', reversePage: boolean = false): Observable<BaseResponse<TransactionsResponse, TransactionsRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    let request = new TransactionsRequest();
    request.q = q;
    request.accountUniqueName = accountUniqueName;
    request.count = count;
    request.from = from;
    request.page = page;
    request.reversePage = reversePage;
    request.sort = sort;
    request.to = to;
    // tslint:disable-next-line:max-line-length
    return this._http.get(this.config.apiUrl + LEDGER_API.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':q', encodeURIComponent(q || '')).replace(':page', page.toString()).replace(':count', encodeURIComponent(count.toString())).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':from', from).replace(':sort', encodeURIComponent(sort)).replace(':to', encodeURIComponent(to)).replace(':reversePage', reversePage.toString())).map((res) => {
      let data: BaseResponse<TransactionsResponse, TransactionsRequest> = res;
      data.request = request;
      data.queryString = {q, page, count, accountUniqueName, from, to, reversePage, sort};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<TransactionsResponse, TransactionsRequest>(e, request, {q, page, count, accountUniqueName, from, to, reversePage, sort}));
  }

  /*
  * create Ledger transaction
  */

  public CreateLedger(model: BlankLedgerVM, accountUniqueName: string): Observable<BaseResponse<LedgerResponse[], BlankLedgerVM>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + LEDGER_API.CREATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model)
      .map((res) => {
        let data: BaseResponse<LedgerResponse[], BlankLedgerVM> = res;
        data.request = model;
        data.queryString = {accountUniqueName};
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<LedgerResponse[], BlankLedgerVM>(e, model, {accountUniqueName}));
  }

  /*
  * update Ledger transaction
  */
  public UpdateLedgerTransactions(model: LedgerUpdateRequest, accountUniqueName: string, entryUniqueName: string): Observable<BaseResponse<LedgerResponse, LedgerUpdateRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + LEDGER_API.UNIVERSAL.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':entryUniqueName', entryUniqueName), model)
      .map((res) => {
        let data: BaseResponse<LedgerResponse, LedgerUpdateRequest> = res;
        data.request = model;
        data.queryString = {accountUniqueName, entryUniqueName};
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<LedgerResponse, LedgerUpdateRequest>(e, model, {accountUniqueName, entryUniqueName}));
  }

  /*
  * delete Ledger transaction
  */
  public DeleteLedgerTransaction(accountUniqueName: string, entryUniqueName: string): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + LEDGER_API.UNIVERSAL.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':entryUniqueName', entryUniqueName)).map((res) => {
      let data: BaseResponse<string, string> = res;
      data.queryString = {accountUniqueName, entryUniqueName};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, string>(e, accountUniqueName, {accountUniqueName, entryUniqueName}));
  }

  /*
  * Ledger get transaction details
  */
  public GetLedgerTransactionDetails(accountUniqueName: string, entryUniqueName: string): Observable<BaseResponse<LedgerResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + LEDGER_API.UNIVERSAL.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':entryUniqueName', entryUniqueName)).map((res) => {
      let data: BaseResponse<LedgerResponse, string> = res;
      data.queryString = {accountUniqueName, entryUniqueName};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<LedgerResponse, string>(e, accountUniqueName, {accountUniqueName, entryUniqueName}));
  }

  /**
   * Ledger get reconcile entries
   * It will internally call Eledger API with condition
   * Note in response user only get check number entries
   * /ledgers/reconcile?from=24-06-2017&to=24-07-2017
   */
  public GetReconcile(accountUniqueName: string = '', from: string = '', to: string = '', chequeNumber: string = ''): Observable<BaseResponse<ReconcileResponse[], string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + LEDGER_API.RECONCILE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':from', from).replace(':to', to).replace(':chequeNumber', chequeNumber)).map((res) => {
      let data: BaseResponse<ReconcileResponse[], string> = res;
      data.queryString = {accountUniqueName, from, to, chequeNumber};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<ReconcileResponse[], string>(e, '', {accountUniqueName, from, to, chequeNumber}));
  }

  public DownloadAttachement(fileName: string): Observable<BaseResponse<DownloadLedgerAttachmentResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + LEDGER_API.DOWNLOAD_ATTACHMENT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':fileName', fileName))
      .map((res) => {
        let data: BaseResponse<DownloadLedgerAttachmentResponse, string> = res;
        data.request = fileName;
        data.queryString = {fileName};
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<DownloadLedgerAttachmentResponse, string>(e, fileName, {fileName}));
  }

  public DownloadInvoice(model: DownloadLedgerRequest, accountUniqueName: string): Observable<BaseResponse<string, DownloadLedgerRequest>> {
    let dataToSend = {voucherNumber: model.invoiceNumber};
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + LEDGER_API.DOWNLOAD_INVOICE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), dataToSend)
      .map((res) => {
        let data: BaseResponse<string, DownloadLedgerRequest> = res;
        data.request = model;
        data.queryString = {accountUniqueName};
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, DownloadLedgerRequest>(e, model, {accountUniqueName}));
  }

  public GenerateMagicLink(model: MagicLinkRequest, accountUniqueName: string): Observable<BaseResponse<MagicLinkResponse, MagicLinkRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + LEDGER_API.MAGIC_LINK.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':accountUniqueName', encodeURIComponent(accountUniqueName))
      .replace(':from', model.from).replace(':to', model.to), model)
      .map((res) => {
        let data: BaseResponse<MagicLinkResponse, MagicLinkRequest> = res;
        data.request = model;
        data.queryString = {accountUniqueName};
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<MagicLinkResponse, MagicLinkRequest>(e, model, {accountUniqueName}));
  }

  public ExportLedger(model: ExportLedgerRequest, accountUniqueName: string, body: any, exportByInvoiceNumber?: boolean): Observable<BaseResponse<string, ExportLedgerRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    let API = exportByInvoiceNumber ? this.config.apiUrl + LEDGER_API.EXPORT_LEDGER_WITH_INVOICE_NUMBER : this.config.apiUrl + LEDGER_API.EXPORT_LEDGER;
    return this._http.post(API.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':accountUniqueName', encodeURIComponent(accountUniqueName))
      .replace(':from', model.from).replace(':to', model.to).replace(':type', encodeURIComponent(model.type)).replace(':format', encodeURIComponent(model.format)).replace(':sort', encodeURIComponent(model.sort)), body)
      .map((res) => {
        let data: BaseResponse<string, ExportLedgerRequest> = res;
        data.request = model;
        data.queryString = {accountUniqueName, fileType: model.format};
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, ExportLedgerRequest>(e, model, {accountUniqueName}));
  }

  public MailLedger(model: MailLedgerRequest, accountUniqueName: string, from: string = '', to: string = '', format: string = ''): Observable<BaseResponse<string, MailLedgerRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + LEDGER_API.MAIL_LEDGER.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':accountUniqueName', encodeURIComponent(accountUniqueName))
      .replace(':from', from).replace(':to', to).replace(':format', encodeURIComponent(format)), model)
      .map((res) => {
        let data: BaseResponse<string, MailLedgerRequest> = res;
        data.request = model;
        data.queryString = {accountUniqueName, from, to, format};
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, MailLedgerRequest>(e, model, {accountUniqueName}));
  }

  public AdvanceSearch(model: ILedgerAdvanceSearchRequest, accountUniqueName: string, from: string = '', to: string = '', sortingOrder: string = '', page: number = 1, count: number = 15, q: string): Observable<BaseResponse<ILedgerAdvanceSearchResponse, ILedgerAdvanceSearchRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + LEDGER_API.ADVANCE_SEARCH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':accountUniqueName', encodeURIComponent(accountUniqueName))
      .replace(':fromDate', from).replace(':toDate', to).replace(':page', page.toString()).replace(':count', encodeURIComponent(count.toString())).replace(':q', encodeURIComponent(q.toString())), model)
      .map((res) => {
        let data: BaseResponse<ILedgerAdvanceSearchResponse, ILedgerAdvanceSearchRequest> = res;
        data.request = model;
        data.queryString = {accountUniqueName, from, to, count};
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<ILedgerAdvanceSearchResponse, ILedgerAdvanceSearchRequest>(e, model, {accountUniqueName}));
  }

  public GetReconciliation(model: any, accountUniqueName: string): Observable<BaseResponse<any, any>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + LEDGER_API.RECONCILIATION.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model)
      .map((res) => {
        let data: BaseResponse<any, any> = res;
        data.request = model;
        data.queryString = {accountUniqueName};
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<any, any>(e, model, {accountUniqueName}));
  }

  public GroupExportLedger(groupUniqueName: string, queryRequest: DaybookQueryRequest): Observable<BaseResponse<any, DayBookRequestModel>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + LEDGER_API.GET_GROUP_EXPORT_LEDGER
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':groupUniqueName', encodeURIComponent(groupUniqueName))
      .replace(':page', queryRequest.page.toString())
      .replace(':count', queryRequest.count.toString())
      .replace(':from', encodeURIComponent(queryRequest.from))
      .replace(':to', encodeURIComponent(queryRequest.to))
      .replace(':format', queryRequest.format.toString())
      .replace(':type', queryRequest.type.toString())
      .replace(':sort', queryRequest.sort.toString()))
      .map((res) => {
        let data: BaseResponse<any, DayBookRequestModel> = res;
        data.queryString = queryRequest;
        data.queryString.requestType = queryRequest.format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel';
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<any, DayBookRequestModel>(e, null));
  }

  /*
  * delete Multiple Ledger transaction
  */
 public DeleteMultipleLedgerTransaction(accountUniqueName: string, entryUniqueNamesArray: string[]): Observable<BaseResponse<string, string>> {
  this.user = this._generalService.user;
  let sessionId = this._generalService.sessionId;
  this.companyUniqueName = this._generalService.companyUniqueName;
  return this._httpClient.request('delete', this.config.apiUrl + LEDGER_API.MULTIPLE_DELETE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), { headers: { 'Session-Id': sessionId }, body: { entryUniqueNames: entryUniqueNamesArray }}).map((res) => {
    let data: any = res;
    data.queryString = {accountUniqueName, entryUniqueNamesArray};
    return data;
  }).catch((e) => this.errorHandler.HandleCatch<string, string>(e, accountUniqueName, {accountUniqueName, entryUniqueNamesArray}));
}

public GetCurrencyRate(baseCurrency): Observable<BaseResponse<any, any>> {
  this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + 'company/' + this.companyUniqueName + '/curreny-converter/' + baseCurrency).map((res) => {
      let data: any = res;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e));
  }
}
