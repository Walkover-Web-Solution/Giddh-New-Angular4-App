import { catchError, map } from 'rxjs/operators';
import { DownloadLedgerAttachmentResponse, DownloadLedgerRequest, ExportLedgerRequest, IELedgerResponse, ILedgerAdvanceSearchRequest, ILedgerAdvanceSearchResponse, IUnpaidInvoiceListResponse, LedgerResponse, LedgerUpdateRequest, MagicLinkRequest, MagicLinkResponse, MailLedgerRequest, ReconcileResponse, TransactionsRequest, TransactionsResponse } from '../models/api-models/Ledger';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './httpWrapper.service';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { LEDGER_API } from './apiurls/ledger.api';
import { BlankLedgerVM } from '../material-ledger/ledger.vm';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { DaybookQueryRequest, DayBookRequestModel } from '../models/api-models/DaybookRequest';
import { ToasterService } from './toaster.service';
import { ReportsDetailedRequestFilter } from '../models/api-models/Reports';
import { cloneDeep } from '../lodash-optimized';
import { PAGINATION_LIMIT } from '../app.constant';

@Injectable({
    providedIn: 'any'
})
export class LedgerService {
    private companyUniqueName: string;

    constructor(
        private errorHandler: GiddhErrorHandler,
        public http: HttpWrapperService,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs,
        private toaster: ToasterService) {
    }

    /**
     * get bank transactions for a account
     */
    public GetBankTransactionsForLedger(getRequest: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + LEDGER_API.GET_BANK_TRANSACTIONS;
        url = url.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        url = url.replace(':accountUniqueName', encodeURIComponent(getRequest.accountUniqueName));
        url = url.replace(':from', getRequest.from);
        url = url.replace(':page', getRequest.page);
        url = url.replace(':count', getRequest.count);

        return this.http.get(url).pipe(map((res) => {
            let data: BaseResponse<IELedgerResponse[], string> = res;
            data.request = getRequest;
            data.queryString = { getRequest };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, { getRequest })));
    }

    /*
    * Map Bank transaction
    */
    public MapBankTransactions(model: { uniqueName: string }, unqObj: { accountUniqueName: string, transactionId: string }): Observable<BaseResponse<string, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + LEDGER_API.MAP_BANK_TRANSACTIONS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(unqObj.accountUniqueName)).replace(':transactionId', unqObj.transactionId), model).pipe(
            map((res) => {
                let data: BaseResponse<string, any> = res;
                data.request = model;
                data.queryString = unqObj;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, any>(e, model, unqObj)));
    }

    /**
     * get ledger transactions
     */
    public GetLedgerTransactions(request: TransactionsRequest): Observable<BaseResponse<TransactionsResponse, TransactionsRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        let url = this.config.apiUrl + LEDGER_API.NEW_GET_LEDGER.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':q', encodeURIComponent(request.q || ''))
            .replace(':page', request.page.toString())
            .replace(':count', encodeURIComponent(request.count.toString()))
            .replace(':accountUniqueName', encodeURIComponent(request.accountUniqueName))
            .replace(':from', request.from)
            .replace(':sort', encodeURIComponent(request.sort))
            .replace(':to', encodeURIComponent(request.to))
            .replace(':reversePage', request.reversePage.toString())
            .replace(':accountCurrency', request.accountCurrency.toString());
        if (request.branchUniqueName) {
            request.branchUniqueName = request.branchUniqueName !== this.companyUniqueName ? request.branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${request.branchUniqueName}`);
        }
        // tslint:disable-next-line:max-line-length
        return this.http.get(url).pipe(map((res) => {
            let data: BaseResponse<TransactionsResponse, TransactionsRequest> = res;
            data.request = request;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<TransactionsResponse, TransactionsRequest>(e, request)));
    }

    /*
    * create Ledger transaction
    */

    public CreateLedger(model: BlankLedgerVM, accountUniqueName: string): Observable<BaseResponse<LedgerResponse[], BlankLedgerVM>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        const clonedRequest = cloneDeep(model);
        // Delete keys which are not required by API
        model?.transactions?.forEach(transaction => {
            delete transaction.selectedAccount;
            delete transaction.tax;
            delete transaction.convertedTax;
            delete transaction.taxesVm;
        });
        delete model.baseCurrencyToDisplay;
        delete model.foreignCurrencyToDisplay;
        delete model.otherTaxModal;
        let url = LEDGER_API.CREATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':accountUniqueName', encodeURIComponent(accountUniqueName));
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.post(this.config.apiUrl + url, model).pipe(
            map((res) => {
                let data: BaseResponse<LedgerResponse[], BlankLedgerVM> = res;
                data.request = clonedRequest;
                data.queryString = { accountUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<LedgerResponse[], BlankLedgerVM>(e, model, { accountUniqueName })));
    }

    /*
    * update Ledger transaction
    */
    public UpdateLedgerTransactions(model: LedgerUpdateRequest, accountUniqueName: string, entryUniqueName: string): Observable<BaseResponse<LedgerResponse, LedgerUpdateRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        const clonedRequest = cloneDeep(model);
        // Delete keys not required by API
        const keysToDelete = ['discountResources', 'warning', 'otherTaxModal', 'otherTaxesSum', 'refreshLedger', 'actualAmount', 'actualRate', 'unitRates', 'entryVoucherTotals', 'isOtherTaxesApplicable', 'tdsTcsTaxesSum'];
        keysToDelete.forEach(key => delete model[key]);
        let url = this.config.apiUrl + LEDGER_API.UNIVERSAL.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':entryUniqueName', entryUniqueName);
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.put(url, model).pipe(
            map((res) => {
                let data: BaseResponse<LedgerResponse, LedgerUpdateRequest> = res;
                data.request = clonedRequest;
                data.queryString = { accountUniqueName, entryUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<LedgerResponse, LedgerUpdateRequest>(e, model, { accountUniqueName, entryUniqueName })));
    }

    /*
    * delete Ledger transaction
    */
    public DeleteLedgerTransaction(accountUniqueName: string, entryUniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + LEDGER_API.DELETE_LEDGER_ENTRY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':entryUniqueName', entryUniqueName);
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.delete(url).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.queryString = { accountUniqueName, entryUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, accountUniqueName, { accountUniqueName, entryUniqueName })));
    }

    /*
    * Ledger get transaction details
    */
    public GetLedgerTransactionDetails(accountUniqueName: string, entryUniqueName: string): Observable<BaseResponse<LedgerResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = LEDGER_API.GET_TRANSACTION.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':accountUniqueName', encodeURIComponent(accountUniqueName))
            .replace(':entryUniqueName', entryUniqueName);
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.get(this.config.apiUrl + url).pipe(map((res) => {
            let data: BaseResponse<LedgerResponse, string> = res;
            data.queryString = { accountUniqueName, entryUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<LedgerResponse, string>(e, accountUniqueName, { accountUniqueName, entryUniqueName })));
    }

    /**
     * Ledger get reconcile entries
     * It will internally call Eledger API with condition
     * Note in response user only get check number entries
     * /ledgers/reconcile?from=24-06-2017&to=24-07-2017
     */
    public GetReconcile(accountUniqueName: string = '', from: string = '', to: string = '', chequeNumber: string = ''): Observable<BaseResponse<ReconcileResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        const url = this.config.apiUrl + LEDGER_API.RECONCILE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':from', from).replace(':to', to).replace(':chequeNumber', chequeNumber);
        return this.http.post(url, {}).pipe(map((res) => {
            let data: BaseResponse<ReconcileResponse[], string> = res;
            data.queryString = { accountUniqueName, from, to, chequeNumber };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<ReconcileResponse[], string>(e, '', { accountUniqueName, from, to, chequeNumber })));
    }

    public DownloadAttachement(fileName: string): Observable<BaseResponse<DownloadLedgerAttachmentResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + LEDGER_API.DOWNLOAD_ATTACHMENT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':fileName', fileName);
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<DownloadLedgerAttachmentResponse, string> = res;
                data.request = fileName;
                data.queryString = { fileName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<DownloadLedgerAttachmentResponse, string>(e, fileName, { fileName })));
    }

    public DownloadInvoice(model: DownloadLedgerRequest, accountUniqueName: string): Observable<BaseResponse<string, DownloadLedgerRequest>> {
        let dataToSend = {};
        if (model.uniqueName) {
            dataToSend = { uniqueName: model.uniqueName, voucherType: model.voucherType };
        } else {
            dataToSend = { voucherNumber: model.invoiceNumber, voucherType: model.voucherType };
        }
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = `${this.config.apiUrl}${LEDGER_API.DOWNLOAD_INVOICE}`
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':accountUniqueName', encodeURIComponent(accountUniqueName));
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.post(url, dataToSend).pipe(
            map((res) => {
                let data: BaseResponse<string, DownloadLedgerRequest> = res;
                data.request = model;
                data.queryString = { accountUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, DownloadLedgerRequest>(e, model, { accountUniqueName })));
    }

    public GenerateMagicLink(model: MagicLinkRequest, accountUniqueName: string): Observable<BaseResponse<MagicLinkResponse, MagicLinkRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + LEDGER_API.MAGIC_LINK.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':accountUniqueName', encodeURIComponent(accountUniqueName))
            .replace(':from', model.from).replace(':to', model.to);
        if (model.branchUniqueName) {
            url = url.concat(`&branchUniqueName=${model.branchUniqueName !== this.companyUniqueName ? encodeURIComponent(model.branchUniqueName) : ''}`);
        }
        return this.http.post(url, model).pipe(
            map((res) => {
                let data: BaseResponse<MagicLinkResponse, MagicLinkRequest> = res;
                data.request = model;
                data.queryString = { accountUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<MagicLinkResponse, MagicLinkRequest>(e, model, { accountUniqueName })));
    }

    public ExportLedger(model: ExportLedgerRequest, accountUniqueName: string, body: any, exportByInvoiceNumber?: boolean): Observable<BaseResponse<any, ExportLedgerRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let API = (this.generalService.voucherApiVersion === 2) ? this.config.apiUrl + LEDGER_API.EXPORT : (exportByInvoiceNumber ? this.config.apiUrl + LEDGER_API.EXPORT_LEDGER_WITH_INVOICE_NUMBER : this.config.apiUrl + LEDGER_API.EXPORT_LEDGER);
        let url = API.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':accountUniqueName', encodeURIComponent(accountUniqueName))
            .replace(':from', model.from).replace(':to', model.to).replace(':type', encodeURIComponent(model.type)).replace(':format', encodeURIComponent(model.format)).replace(':sort', encodeURIComponent(model.sort));
        if (model.branchUniqueName) {
            url = url.concat(`&branchUniqueName=${model.branchUniqueName !== this.companyUniqueName ? encodeURIComponent(model.branchUniqueName) : ''}`);
        }
        return this.http.post(url, body).pipe(
            map((res) => {
                let data: BaseResponse<any, ExportLedgerRequest> = res;
                data.request = model;
                data.queryString = { accountUniqueName, fileType: model.format };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, ExportLedgerRequest>(e, model, { accountUniqueName })));
    }

    public MailLedger(model: MailLedgerRequest, accountUniqueName: string, emailRequestParams: ExportLedgerRequest): Observable<BaseResponse<string, MailLedgerRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        let request = ''; // URL params for mail will be as from=:from&to=:to&format=:format&type=:type&sort=:sort&withInvoice=:withInvoice

        if (emailRequestParams.from) {
            request += 'from=' + emailRequestParams.from;
        }
        if (emailRequestParams.to) {
            request += '&to=' + emailRequestParams.to;
        }
        if (emailRequestParams.format) {
            request += '&format=' + encodeURIComponent(emailRequestParams.format);
        }
        if (emailRequestParams.type) {
            request += '&type=' + emailRequestParams.type;
        }
        if (emailRequestParams.sort) {
            request += '&sort=' + encodeURIComponent(emailRequestParams.sort);
        }
        if (emailRequestParams.branchUniqueName) {
            request = request.concat(`&branchUniqueName=${emailRequestParams.branchUniqueName !== this.companyUniqueName ? encodeURIComponent(emailRequestParams.branchUniqueName) : ''}`);
        }
        request += '&withInvoice=' + emailRequestParams.withInvoice; // emailRequestParams.withInvoice is a boolean so in case of false need to send false as well that will be default

        return this.http.post(this.config.apiUrl + LEDGER_API.MAIL_LEDGER.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':accountUniqueName', encodeURIComponent(accountUniqueName)) + request, model).pipe(
                map((res) => {
                    let data: BaseResponse<string, MailLedgerRequest> = res;
                    data.request = model;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<string, MailLedgerRequest>(e, model, { accountUniqueName })));
    }

    public AdvanceSearch(model: ILedgerAdvanceSearchRequest, accountUniqueName: string, from?: string, to?: string, sortingOrder?: string, page?: number, count?, q?: string, branchUniqueName?: string): Observable<BaseResponse<ILedgerAdvanceSearchResponse, ILedgerAdvanceSearchRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let request = '';

        if (from) {
            request += '&from=' + from;
        }
        if (to) {
            request += '&to=' + to;
        }
        if (page) {
            request += '&page=' + page;
        } else {
            request += '&page=' + 0;
        }
        if (count) {
            request += '&count=' + count;
        }
        if (q) {
            request += '&q=' + q;
        }
        if (branchUniqueName) {
            request = request.concat(`&branchUniqueName=${branchUniqueName !== this.companyUniqueName ? encodeURIComponent(branchUniqueName) : ''}`);
        }
        return this.http.post(this.config.apiUrl + LEDGER_API.ADVANCE_SEARCH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':accountUniqueName', encodeURIComponent(accountUniqueName)) + request, model).pipe(
                map((res) => {
                    let data: BaseResponse<ILedgerAdvanceSearchResponse, ILedgerAdvanceSearchRequest> = res;
                    data.request = model;
                    data.queryString = { accountUniqueName, from, to, count };
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<ILedgerAdvanceSearchResponse, ILedgerAdvanceSearchRequest>(e, model, { accountUniqueName })));
    }

    public GetReconciliation(model: any, accountUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + LEDGER_API.RECONCILIATION.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                data.queryString = { accountUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model, { accountUniqueName })));
    }

    public GroupExportLedger(groupUniqueName: string, queryRequest: DaybookQueryRequest): Observable<BaseResponse<any, DayBookRequestModel>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + LEDGER_API.GET_GROUP_EXPORT_LEDGER
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':groupUniqueName', encodeURIComponent(groupUniqueName))
            .replace(':page', queryRequest.page.toString())
            .replace(':count', queryRequest.count.toString())
            .replace(':from', encodeURIComponent(queryRequest.from))
            .replace(':to', encodeURIComponent(queryRequest.to))
            .replace(':format', queryRequest.format.toString())
            .replace(':type', queryRequest.type.toString())
            .replace(':sort', queryRequest.sort.toString())).pipe(
                map((res) => {
                    let data: BaseResponse<any, DayBookRequestModel> = res;
                    data.queryString = queryRequest;
                    data.queryString.requestType = queryRequest.format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel';
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, DayBookRequestModel>(e, null)));
    }

    /*
    * delete Multiple Ledger transaction
    */
    public DeleteMultipleLedgerTransaction(accountUniqueName: string, entryUniqueNamesArray: string[]): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + LEDGER_API.MULTIPLE_DELETE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName));

        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.deleteWithBody(url, { entryUniqueNames: entryUniqueNamesArray }).pipe(map((res) => {
            let data: any = res;
            data.queryString = { accountUniqueName, entryUniqueNamesArray };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, accountUniqueName, { accountUniqueName, entryUniqueNamesArray })));
    }

    public GetCurrencyRate(fromCurrency: string, toCurrency: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + LEDGER_API.CURRENCY_CONVERTER.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':fromCurrency', encodeURIComponent(fromCurrency)).replace(':toCurrency', encodeURIComponent(toCurrency))).pipe(map((res) => {
            let data: any = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    public GetCurrencyRateNewApi(fromCurrency: string, toCurrency: string, date: string) {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + LEDGER_API.GET_CURRENCY_RATE
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':from', encodeURIComponent(fromCurrency))
            .replace(':to', encodeURIComponent(toCurrency))
            .replace(':date', encodeURIComponent(date))
        )
            .pipe(map((res) => {
                let data: any = res;
                return data;
            }), catchError((e) => {
                if (fromCurrency !== undefined && toCurrency !== undefined) {
                    this.toaster.errorToast(e.error.message);
                }
                return this.errorHandler.HandleCatch<any, any>(e)
            }));
    }

    /*
    * delete bank transaction
    */
    public DeleteBankTransaction(transactionId: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + LEDGER_API.DELETE_BANK_TRANSACTION.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':transactionId', transactionId)).pipe(map((res) => {
            let data: any = res;
            data.queryString = { transactionId };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, transactionId)));
    }

    public GetLedgerBalance(model: TransactionsRequest): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + LEDGER_API.GET_BALANCE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':accountUniqueName', encodeURIComponent(model.accountUniqueName))
            .replace(':from', model.from).replace(':to', model.to)
            .replace(':accountCurrency', model.accountCurrency.toString());
        if (model.branchUniqueName) {
            model.branchUniqueName = model.branchUniqueName !== this.companyUniqueName ? model.branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${model.branchUniqueName}`);
        }
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                data.queryString = { model };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * This will download/JSON to show the columnar report
     *
     * @param {any} model voucher type & account unique name
     * @param {string} date Date
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof LedgerService
     */
    public getInvoiceListsForCreditNote(model: any, date: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + LEDGER_API.GET_VOUCHER_INVOICE_LIST
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':voucherDate', encodeURIComponent(date))
            .replace(':number', encodeURIComponent((model.number || "")))
            .replace(':count', (model.count || PAGINATION_LIMIT))
            .replace(':page', (model.page || 1));

        delete model.page;
        delete model.count;

        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.post(url, model
        ).pipe(map((res) => {
            let data: BaseResponse<IUnpaidInvoiceListResponse, any> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    public GetInvoiceList(model: any) {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + LEDGER_API.GET_UNPAID_INVOICE_LIST
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':accountUniqueName', encodeURIComponent(model.accountUniqueName))
            .replace(':accStatus', encodeURIComponent(model.status))
        ).pipe(
            map((res) => {
                let data: BaseResponse<IUnpaidInvoiceListResponse, any> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * This will download/JSON to show the columnar report
     *
     * @param {string} companyUniqueName Company unique name
     * @param {string} groupUniqueName Group unique name
     * @param {*} request Object, Request body
     * @param {boolean} isShowData True if columnar report table need to show instead of download
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof LedgerService
     */
    public downloadColumnarReport(companyUniqueName: string, groupUniqueName: string, request: any, isShowData?: boolean): Observable<BaseResponse<any, any>> {
        let url: string = '';
        if (isShowData) {
            url = this.config.apiUrl + LEDGER_API.GET_COLUMNAR_REPORT + '?fileType=json';
            if (request.page) {
                url = `${url}&page=${request.page}`;
            }
            if (request.count) {
                url = `${url}&count=${request.count}`;
            }
        } else {
            url = this.config.apiUrl + LEDGER_API.GET_COLUMNAR_REPORT;
        }
        return this.http.post(url.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
            .replace(':groupUniqueName', groupUniqueName), request
        ).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = request;
                data.queryString = { request };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, request)));
    }

    /**
     * To get export Ledger's columnar report table
     *
     * @param {ReportsDetailedRequestFilter} model request model
     * @param {string} companyUniqueName Company unique name
     * @param {string} accountUniqueName Account unique name
     * @param {*} [body] body
     * @returns {Observable<BaseResponse<any, ReportsDetailedRequestFilter>>}
     * @memberof LedgerService
     */
    public exportLedgerColumnarReportTable(model: ReportsDetailedRequestFilter, companyUniqueName: string, accountUniqueName: string, body?: any): Observable<BaseResponse<any, ReportsDetailedRequestFilter>> {
        let url = this.config.apiUrl + LEDGER_API.EXPORT_LEDGER_COLUMNAR_REPORT_TABLE
            .replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
            .replace(':accountUniqueName', encodeURIComponent(accountUniqueName))
            .replace(':from', model.from)
            .replace(':to', model.to);
        if (model.page) {
            url = `${url}&page=${model.page}`;
        }
        if (model.count) {
            url = `${url}&count=${model.count}`;
        }
        if (model.sort) {
            url = `${url}&sort=${model.sort}`;
        }
        if (model.branchUniqueName) {
            url = url.concat(`&branchUniqueName=${model.branchUniqueName !== companyUniqueName ? encodeURIComponent(model.branchUniqueName) : ''}`);
        }
        return this.http.post(url, body).pipe(map((res) => {
            let data: BaseResponse<any, ReportsDetailedRequestFilter> = res;
            data.request = body;
            data.queryString = { accountUniqueName };
            return data;
        }),
            catchError((e) => this.errorHandler.HandleCatch<string, ReportsDetailedRequestFilter>(e, model, { accountUniqueName })));
    }

    /**
     * This will upload the statement pdf
     *
     * @param {*} getRequest
     * @param {*} postRequest
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof LedgerService
     */
    public importStatement(getRequest: any, postRequest: any): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + LEDGER_API.IMPORT_STATEMENT
            .replace(':companyUniqueName', encodeURIComponent(getRequest.companyUniqueName))
            .replace(':accountUniqueName', encodeURIComponent(getRequest.accountUniqueName))
            .replace(':entity', getRequest.entity);

        const formData: FormData = new FormData();
        formData.append('file', postRequest.file, postRequest.file.name);
        formData.append('pdfpassword', postRequest.password);
        return this.http.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    /**
     * Removes the attachment
     *
     * @param {string} attachmentUniqueName Unique name of the attachment
     * @return {*}  {Observable<BaseResponse<any, any>>} Observable to carry out further operations
     * @memberof LedgerService
     */
    public removeAttachment(attachmentUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = `${this.config.apiUrl}${LEDGER_API.UPLOAD_FILE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))}/${attachmentUniqueName}`;

        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }

        return this.http.delete(url).pipe(catchError((error) => this.errorHandler.HandleCatch<any, string>(error)));
    }

    /**
     * Deletes the bank transactions
     *
     * @param {string} accountUniqueName
     * @param {*} params
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof LedgerService
     */
    public deleteBankTransactions(accountUniqueName: string, params: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        const url = `${this.config.apiUrl}${LEDGER_API.DELETE_BANK_TRANSACTIONS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName))}`;
        return this.http.deleteWithBody(url, params).pipe(catchError((error) => this.errorHandler.HandleCatch<any, string>(error)));
    }
}
