import { CustomActions } from './../../store/custom-actions';
import { map, switchMap } from 'rxjs/operators';
import { DownloadLedgerRequest, ILedgerAdvanceSearchRequest, ILedgerAdvanceSearchResponse, LedgerResponse, LedgerUpdateRequest, TransactionsRequest, TransactionsResponse } from '../../models/api-models/Ledger';
import { AccountRequestV2, AccountResponseV2, AccountSharedWithResponse, ShareAccountRequest } from '../../models/api-models/Account';
import { AccountService } from '../../services/account.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AppState } from '../../store/roots';
import { LEDGER } from './ledger.const';
import { LedgerService } from '../../services/ledger.service';
import { BlankLedgerVM } from '../../ledger/ledger.vm';
import { GenerateBulkInvoiceRequest, IBulkInvoiceGenerationFalingError } from '../../models/api-models/Invoice';
import { InvoiceService } from '../../services/invoice.service';
import { LocaleService } from '../../services/locale.service';
import { GeneralService } from '../../services/general.service';

@Injectable()
export class LedgerActions {

    public GetTransactions$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.GET_TRANSACTION),
            switchMap((action: CustomActions) => {
                let req: TransactionsRequest = action.payload as TransactionsRequest;
                return this.ledgerService.GetLedgerTransactions(req);
            }), map(res => this.validateResponse<TransactionsResponse, TransactionsRequest>(res, {
                type: LEDGER.GET_TRANSACTION_RESPONSE,
                payload: res
            }, true, {
                type: LEDGER.GET_TRANSACTION_RESPONSE,
                payload: res
            }))));

    public GetAccountDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.GET_LEDGER_ACCOUNT),
            switchMap((action: CustomActions) => this.accountService.GetAccountDetailsV2(action.payload)),
            map(res => this.validateResponse<AccountResponseV2, string>(res, {
                type: LEDGER.GET_LEDGER_ACCOUNT_RESPONSE,
                payload: res
            }, true, {
                type: LEDGER.GET_LEDGER_ACCOUNT_RESPONSE,
                payload: res
            }))));

    public DownloadInvoiceFile$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.DOWNLOAD_LEDGER_INVOICE),
            switchMap((action: CustomActions) => this.ledgerService.DownloadInvoice(action.payload?.body, action.payload.accountUniqueName)),
            map(res => this.validateResponse<string, DownloadLedgerRequest>(res, {
                type: LEDGER.DOWNLOAD_LEDGER_INVOICE_RESPONSE,
                payload: res
            }, true, {
                type: LEDGER.DOWNLOAD_LEDGER_INVOICE_RESPONSE,
                payload: res
            }))));

    public CreateBlankLedger$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.CREATE_BLANK_LEDGER_REQUEST),
            switchMap((action: CustomActions) => this.ledgerService.CreateLedger(action.payload.model, action.payload.accountUniqueName)),
            map(res => this.validateResponse<LedgerResponse[], BlankLedgerVM>(res, {
                type: LEDGER.CREATE_BLANK_LEDGER_RESPONSE,
                payload: res
            }, true, {
                type: LEDGER.CREATE_BLANK_LEDGER_RESPONSE,
                payload: res
            }, true))));

    /**
     * Create Bulk Blank Ledgers
     *
     * @type {Observable<Action>}
     * @memberof LedgerActions
     */
    public CreateBulkBlankLedgers$: Observable<Action> = createEffect(() => this.action$
    .pipe(
        ofType(LEDGER.CREATE_BULK_BLANK_LEDGER_REQUEST),
        switchMap((action: CustomActions) => this.ledgerService.createBulkLedger(action.payload.model, action.payload.accountUniqueName)),
        map(res => this.validateResponse<LedgerResponse[], BlankLedgerVM>(res, {
            type: LEDGER.CREATE_BULK_BLANK_LEDGER_RESPONSE,
            payload: res
        }, true, {
            type: LEDGER.CREATE_BULK_BLANK_LEDGER_RESPONSE,
            payload: res
        }, true))));

    public DeleteTrxEntry$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.DELETE_TRX_ENTRY),
            switchMap((action: CustomActions) => this.ledgerService.DeleteLedgerTransaction(action.payload.accountUniqueName, action.payload.entryUniqueName)),
            map(res => this.deleteTrxEntryResponse(res))));

    public DeleteTrxEntryResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.DELETE_TRX_ENTRY_RESPONSE),
            map((action: CustomActions) => {
                let res = action.payload as BaseResponse<string, string>;
                if (res?.status === 'success') {
                    this.toaster.showSnackBar("success", this.localeService.translate("app_messages.entry_deleted"), this.localeService.translate("app_success"));
                } else {
                    this.toaster.showSnackBar("error", res.message);
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public shareAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.LEDGER_SHARE_ACCOUNT),
            switchMap((action: CustomActions) =>
                this.accountService.AccountShare(
                    action.payload?.body,
                    action.payload.accountUniqueName
                )
            ),
            map(response => {
                return this.shareAccountResponse(response);
            })));

    public shareAccountResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.LEDGER_SHARE_ACCOUNT_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload?.status === 'error') {
                    this.toaster.showSnackBar("error", action.payload.message, action.payload.code);
                    return {
                        type: 'EmptyAction'
                    };
                } else {
                    let data: BaseResponse<string, ShareAccountRequest> = action.payload;
                    this.toaster.showSnackBar("show", action.payload?.body);
                    return this.sharedAccountWith(data.queryString.accountUniqueName);
                }
            })));

    public sharedAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.LEDGER_SHARED_ACCOUNT_WITH),
            switchMap((action: CustomActions) => this.accountService.AccountShareWith(action.payload)),
            map(response => {
                return this.sharedAccountWithResponse(response);
            })));

    public sharedAccountResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.LEDGER_SHARED_ACCOUNT_WITH_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload?.status === 'error') {
                    this.toaster.showSnackBar("error", action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public updateTxnEntry$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.UPDATE_TXN_ENTRY),
            switchMap((action: CustomActions) => this.ledgerService.UpdateLedgerTransactions(action.payload.model,
                action.payload.accountUniqueName, action.payload.entryUniqueName)),
            map(resp => {
                return this.updateTxnEntryResponse(resp);
            })));

    public updateTxnEntryResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.UPDATE_TXN_ENTRY_RESPONSE),
            map((action: CustomActions) => {
                let response: BaseResponse<LedgerResponse, LedgerUpdateRequest> = action.payload;
                if (response?.status === 'error') {
                    this.toaster.showSnackBar("error", response.message, response.code);
                    return { type: 'EmptyAction' };
                } else if (response?.status === 'no-network') {
                    this.ResetUpdateLedger();
                    return { type: 'EmptyAction' };
                } else if (response?.status === 'confirm' ||  response?.status === 'einvoice-confirm') {
                    return {
                        type: LEDGER.SHOW_DUPLICATE_VOUCHER_CONFIRMATION,
                        payload: response
                    }
                } else {
                    this.toaster.showSnackBar("success", this.localeService.translate("app_messages.entry_updated"));
                    if (action && action.payload && action.payload.request && action.payload.request.refreshLedger) {
                        this.store.dispatch(this.refreshLedger(true));
                    }

                    if (this.generalService.voucherApiVersion !== 2 && response.request.generateInvoice && !response?.body?.voucherGenerated) {
                        let invoiceGenModel: GenerateBulkInvoiceRequest[] = [];
                        let entryUniqueName = response.queryString.entryUniqueName.split('?')[0];
                        invoiceGenModel.push({
                            accountUniqueName: response.queryString.accountUniqueName,
                            entries: [entryUniqueName]
                        });
                        return this.generateUpdatedLedgerInvoice(invoiceGenModel);
                    }
                }
                return { type: 'EmptyAction' };
            })));

    public CreateQuickAccountV2$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.CREATE_QUICK_ACCOUNT),
            switchMap((action: CustomActions) => this.accountService.CreateAccountV2(action.payload.account, action.payload.accountUniqueName)),
            map(response => {
                return this.createQuickAccountResponseV2(response);
            })));

    public CreateQuickAccountResponseV2$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.CREATE_QUICK_ACCOUNT_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload?.status === 'error') {
                    this.toaster.showSnackBar("error", action.payload.message, action.payload.code);
                    return {
                        type: 'EmptyAction'
                    };
                } else {
                    this.toaster.showSnackBar("success", this.localeService.translate("app_messages.account_created"));
                }
                return { type: 'EmptyAction' };
            })));

    public AdvanceSearch$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.ADVANCE_SEARCH),
            switchMap((action: CustomActions) => this.ledgerService.AdvanceSearch(action.payload.model, action.payload.accountUniqueName, action.payload.from,
                action.payload.to, '', action.payload.page, action.payload.count, action.payload.q, action.payload.branchUniqueName)),
            map(response => {
                return this.advanceSearchResponse(response);
            })));

    public AdvanceSearchResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.ADVANCE_SEARCH_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload?.status === 'error') {
                    this.toaster.showSnackBar("error", action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public generateUpdatedLedgerInvoice$: Observable<CustomActions> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.GENERATE_UPDATED_LEDGER_INVOICE),
            switchMap((action: CustomActions) => this.invoiceServices.GenerateBulkInvoice({ combined: false }, action.payload)),
            map(response => {
                if (response?.status === 'success') {
                    if (typeof response?.body === 'string') {
                        this.toaster.showSnackBar("success", response?.body);
                        this.store.dispatch(this.setTxnForEdit(''));
                        return this.setTxnForEdit(response.request[0].entries[0]);
                    } else if (Array.isArray(response?.body) && 'reason' in response?.body[0]) {
                        this.toaster.showSnackBar("error", response?.body[0].reason);
                    }
                } else {
                    this.toaster.showSnackBar("error", response.message, response.code);
                }
                return { type: 'EmptyAction' };
            })));

    public getLedgerTrxDetails$: Observable<CustomActions> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.GET_LEDGER_TRX_DETAILS),
            switchMap((action: CustomActions) => this.ledgerService.GetLedgerTransactionDetails(action.payload.accountUniqueName, action.payload.entryName)),
            map(response => {
                return this.validateResponse(response, {
                    type: LEDGER.GET_LEDGER_TRX_DETAILS_RESPONSE,
                    payload: response
                }, true, {
                    type: LEDGER.GET_LEDGER_TRX_DETAILS_RESPONSE,
                    payload: response
                });
            })));

    public GetReconciliation$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.GET_RECONCILIATION),
            switchMap((action: CustomActions) => {
                let req: TransactionsRequest = action.payload as TransactionsRequest;
                return this.ledgerService.GetReconciliation(req, req.accountUniqueName);
            }), map(response => {
                if (response?.status === 'success') {
                    this.toaster.showSnackBar("info", response?.body?.message);
                } else {
                    this.toaster.showSnackBar("error", response.message, response.code);
                }
                return {
                    type: LEDGER.GET_RECONCILIATION_RESPONSE,
                    payload: response
                };
            })));

    public DeleteMultipleLedgerEntries$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.DELETE_MULTIPLE_LEDGER_ENTRIES),
            switchMap((action: CustomActions) => this.ledgerService.DeleteMultipleLedgerTransaction(action.payload.accountUniqueName, action.payload.entryUniqueNames)),
            map(res => this.DeleteMultipleLedgerEntriesResponse(res))));

    public DeleteMultipleLedgerEntriesResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.DELETE_MULTIPLE_LEDGER_ENTRIES_RESPONSE),
            map((action: CustomActions) => {
                let res: any = action.payload as BaseResponse<any, string>;
                if (res?.status === 'success') {
                    if (Array.isArray(res?.body)) {
                        let errorMessage = res?.body[0].reason;
                        let failedEntries = res?.body[0].failedEntries;
                        if (errorMessage) {
                            this.toaster.showSnackBar("error", errorMessage, this.localeService.translate("app_error"));
                        }
                        if (failedEntries && failedEntries.length) {
                            return this.SetFailedBulkEntries(failedEntries);
                        }
                    } else {
                        this.toaster.showSnackBar("success", this.localeService.translate("app_messages.entry_deleted"), this.localeService.translate("app_success"));
                    }
                } else {
                    this.toaster.showSnackBar("error", res.message);
                }
                return {
                    type: 'EmptyAction'
                };
            })));

    public GenerateBulkLedgerInvoice$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.GENERATE_BULK_LEDGER_INVOICE),
            switchMap((action: CustomActions) => this.invoiceServices.GenerateBulkInvoice(action.payload.reqObj, action.payload?.body, action.payload.requestedFrom)),
            map(response => {
                return this.GenerateBulkLedgerInvoiceResponse(response);
            })));

    public GenerateBulkLedgerInvoiceResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.GENERATE_BULK_LEDGER_INVOICE_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, GenerateBulkInvoiceRequest[]> = response?.payload;
                if (data?.status === 'error') {
                    this.toaster.showSnackBar("error", data.message, data.code);
                } else if (data?.status === 'einvoice-confirm') {
                    return this.setBulkGenerateConfirm(data);
                } else {
                    if (typeof data.body === 'string') {
                        this.toaster.showSnackBar("success", data.body);
                    } else if (_.isArray(data.body) && data.body?.length > 0) {
                        // Block will execute if multiple invoice generate
                        if (data && data.queryString && data.queryString.reqObj && !data.queryString.reqObj.combined) {
                            _.forEach(data.body, (item: IBulkInvoiceGenerationFalingError) => {
                                if (item.failedEntries) {
                                    this.toaster.showSnackBar("warning", item.reason);
                                }
                                if (data.request && data.request.length > 0 && data.request[0].entries && data.request[0].entries.length > data.body?.length) {
                                    this.toaster.showSnackBar("success", this.localeService.translate("app_messages.vouchers_generated"));
                                }
                            });
                        } else {
                            //  Block will execute if compound invoice generate
                            _.forEach(data.body, (item: IBulkInvoiceGenerationFalingError) => {
                                this.toaster.showSnackBar("warning", item.reason);
                            });
                        }
                        return this.SetFailedBulkEntries(data.body[0].failedEntries);
                    }
                }
                return { type: 'EmptyAction' };
            })));

    public GetLedgerBalance$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(LEDGER.GET_LEDGER_BALANCE),
            switchMap((action: CustomActions) => {
                let req: any = action.payload;
                return this.ledgerService.GetLedgerBalance(req);
            }), map(res => this.validateResponse<any, any>(res, {
                type: LEDGER.GET_LEDGER_BALANCE_RESPONSE,
                payload: res
            }, true, {
                type: LEDGER.GET_LEDGER_BALANCE_RESPONSE,
                payload: res
            }))));

    constructor(private action$: Actions,
        private toaster: ToasterService,
        private store: Store<AppState>,
        private ledgerService: LedgerService,
        private accountService: AccountService,
        private invoiceServices: InvoiceService,
        private localeService: LocaleService,
        private generalService: GeneralService) {
    }

    public GetTransactions(request: TransactionsRequest): CustomActions {
        return {
            type: LEDGER.GET_TRANSACTION,
            payload: request
        };
    }

    public GetLedgerAccount(value: string): CustomActions {
        return {
            type: LEDGER.GET_LEDGER_ACCOUNT,
            payload: value
        };
    }

    public DownloadInvoice(value: DownloadLedgerRequest, accountUniqueName: string): CustomActions {
        return {
            type: LEDGER.DOWNLOAD_LEDGER_INVOICE,
            payload: { body: value, accountUniqueName }
        };
    }

    public CreateBlankLedger(model: BlankLedgerVM, accountUniqueName: string): CustomActions {
        return {
            type: LEDGER.CREATE_BLANK_LEDGER_REQUEST,
            payload: { model, accountUniqueName }
        };
    }

    /**
     * Used to Reset Blank Ledger
     *
     * @returns {CustomActions}
     * @memberof LedgerActions
     */
    public ResetBlankLedger(): CustomActions {
        return {
            type: LEDGER.RESET_BLANK_LEDGER_REQUEST
        };
    }

    /**
     * Create Bulk Blank Ledgers action
     *
     * @param {BlankLedgerVM} model
     * @param {string} accountUniqueName
     * @returns {CustomActions}
     * @memberof LedgerActions
     */
    public CreateBulkBlankLedgers(model: BlankLedgerVM, accountUniqueName: string): CustomActions {
        return {
            type: LEDGER.CREATE_BULK_BLANK_LEDGER_REQUEST,
            payload: { model, accountUniqueName }
        };
    }

    public setTxnForEdit(txnUniqueName: string) {
        return {
            type: LEDGER.SET_SELECTED_TXN_FOR_EDIT,
            payload: txnUniqueName
        };
    }

    public setAccountForEdit(accountUniqueName: string) {
        return {
            type: LEDGER.SET_SELECTED_ACCOUNT_FOR_EDIT,
            payload: accountUniqueName
        };
    }

    public ResetLedger(): CustomActions {
        return {
            type: LEDGER.RESET_LEDGER
        };
    }

    public ResetUpdateLedger(): CustomActions {
        return {
            type: LEDGER.RESET_UPDATE_TXN_ENTRY
        };
    }

    public deleteTrxEntry(accountUniqueName: string, entryUniqueName: string): CustomActions {
        return {
            type: LEDGER.DELETE_TRX_ENTRY,
            payload: { accountUniqueName, entryUniqueName }
        };
    }

    public shareAccount(value: ShareAccountRequest, accountUniqueName: string): CustomActions {
        return {
            type: LEDGER.LEDGER_SHARE_ACCOUNT,
            payload: Object.assign({}, {
                body: value
            }, {
                accountUniqueName
            })
        };
    }

    public shareAccountResponse(value: BaseResponse<string, ShareAccountRequest>): CustomActions {
        return {
            type: LEDGER.LEDGER_SHARE_ACCOUNT_RESPONSE,
            payload: value
        };
    }

    public sharedAccountWith(accountUniqueName: string): CustomActions {
        return {
            type: LEDGER.LEDGER_SHARED_ACCOUNT_WITH,
            payload: accountUniqueName
        };
    }

    public sharedAccountWithResponse(value: BaseResponse<AccountSharedWithResponse[], string>): CustomActions {
        return {
            type: LEDGER.LEDGER_SHARED_ACCOUNT_WITH_RESPONSE,
            payload: value
        };
    }

    public deleteTrxEntryResponse(res: BaseResponse<string, string>): CustomActions {
        return {
            type: LEDGER.DELETE_TRX_ENTRY_RESPONSE,
            payload: res
        };
    }

    public updateTxnEntry(model: LedgerUpdateRequest, accountUniqueName: string, entryUniqueName: string): CustomActions {
        return {
            type: LEDGER.UPDATE_TXN_ENTRY,
            payload: { model, accountUniqueName, entryUniqueName }
        };
    }

    public updateTxnEntryResponse(payload: BaseResponse<LedgerResponse, LedgerUpdateRequest>): CustomActions {
        return {
            type: LEDGER.UPDATE_TXN_ENTRY_RESPONSE,
            payload
        };
    }

    public resetQuickAccountModal(): CustomActions {
        return {
            type: LEDGER.RESET_QUICK_ACCOUNT_MODAL
        };
    }

    public createQuickAccountV2(value: string, account: AccountRequestV2): CustomActions {
        return {
            type: LEDGER.CREATE_QUICK_ACCOUNT,
            payload: Object.assign({}, {
                accountUniqueName: value
            }, {
                account
            })
        };
    }

    public createQuickAccountResponseV2(value: BaseResponse<AccountResponseV2, AccountRequestV2>): CustomActions {
        return {
            type: LEDGER.CREATE_QUICK_ACCOUNT_RESPONSE,
            payload: value
        };
    }

    public resetDeleteTrxEntryModal() {
        return {
            type: LEDGER.RESET_DELETE_TRX_ENTRY_MODAL
        };
    }

    public doAdvanceSearch(model: ILedgerAdvanceSearchRequest, accountUniqueName: string, from?: string, to?: string, page?: number, count?: number, q?: string, branchUniqueName?: string): CustomActions {
        return {
            type: LEDGER.ADVANCE_SEARCH,
            payload: { model, accountUniqueName, from, to, page, count, q, branchUniqueName }
        };
    }

    public advanceSearchResponse(value: BaseResponse<ILedgerAdvanceSearchResponse, ILedgerAdvanceSearchRequest>): CustomActions {
        return {
            type: LEDGER.ADVANCE_SEARCH_RESPONSE,
            payload: value
        };
    }

    public generateUpdatedLedgerInvoice(model: GenerateBulkInvoiceRequest[]): CustomActions {
        return {
            type: LEDGER.GENERATE_UPDATED_LEDGER_INVOICE,
            payload: model
        };
    }

    public getLedgerTrxDetails(accountUniqueName: string, entryName: string): CustomActions {
        return {
            type: LEDGER.GET_LEDGER_TRX_DETAILS,
            payload: {
                accountUniqueName, entryName
            }
        };
    }

    public resetLedgerTrxDetails(): CustomActions {
        return {
            type: LEDGER.RESET_LEGER_TRX_DETAILS
        };
    }

    public GetReconciliation(request: any): CustomActions {
        return {
            type: LEDGER.GET_RECONCILIATION,
            payload: request
        };
    }

    public DeleteMultipleLedgerEntries(accountUniqueName: string, entryUniqueNames: string[]): CustomActions {
        return {
            type: LEDGER.DELETE_MULTIPLE_LEDGER_ENTRIES,
            payload: { accountUniqueName, entryUniqueNames }
        };
    }

    public DeleteMultipleLedgerEntriesResponse(res: BaseResponse<any, string>): CustomActions {
        return {
            type: LEDGER.DELETE_MULTIPLE_LEDGER_ENTRIES_RESPONSE,
            payload: res
        };
    }

    public GenerateBulkLedgerInvoice(reqObj: { combined: boolean }, model: any, requestedFrom?: string): CustomActions {
        return {
            type: LEDGER.GENERATE_BULK_LEDGER_INVOICE,
            payload: { reqObj, body: model, requestedFrom }
        };
    }

    public GenerateBulkLedgerInvoiceResponse(model: any): CustomActions {
        return {
            type: LEDGER.GENERATE_BULK_LEDGER_INVOICE_RESPONSE,
            payload: model
        };
    }

    public GetCurrencyRate(curreny: string): CustomActions {
        return {
            type: LEDGER.GET_CURRENCY_RATE,
            payload: curreny
        };
    }

    public GetCurrencyRateResponse(res): CustomActions {
        return {
            type: LEDGER.GET_CURRENCY_RATE_RESPONSE,
            payload: res
        };
    }

    public SelectDeSelectAllEntries(mode: 'debit' | 'credit' | 'all', isChecked: boolean): CustomActions {
        return {
            type: LEDGER.SELECT_DESELECT_ALL_ENTRIES,
            payload: { mode, isChecked }
        };
    }

    public SelectGivenEntries(entries: string[]): CustomActions {
        return {
            type: LEDGER.SELECT_GIVEN_ENTRIES,
            payload: entries
        };
    }


    public DeSelectGivenEntries(entries: string[]): CustomActions {
        return {
            type: LEDGER.DESELECT_GIVEN_ENTRIES,
            payload: entries
        };
    }

    public SetFailedBulkEntries(entries: string[]): CustomActions {
        return {
            type: LEDGER.SET_FAILED_BULK_ENTRIES,
            payload: entries
        };
    }

    public GetLedgerBalance(request: any): CustomActions {
        return {
            type: LEDGER.GET_LEDGER_BALANCE,
            payload: { from: request.from, to: request.to, accountUniqueName: request.accountUniqueName, accountCurrency: request.accountCurrency, branchUniqueName: request.branchUniqueName }
        };
    }

    public GetLedgerBalanceResponse(res: any): CustomActions {
        return {
            type: LEDGER.GET_LEDGER_BALANCE_RESPONSE,
            payload: res
        };
    }

    private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }, isCreateLedger?: boolean): CustomActions {
        if (response?.status === 'error') {
            if (showToast) {
                this.toaster.showSnackBar("error", response.message);
            }
            return errorAction;
        } else if (response?.status === "confirm" ||  response?.status === 'einvoice-confirm') {
            if (isCreateLedger) {
                return {
                    type: LEDGER.SHOW_DUPLICATE_VOUCHER_CONFIRMATION,
                    payload: response
                }
            }
        } else {
            if (showToast && typeof response.body === 'string') {
                this.toaster.showSnackBar("success", response.body);
            }
        }
        return successAction;
    }

    /**
     * This will store the boolean value to refresh the ledger once account update completes
     *
     * @param {boolean} request
     * @returns {CustomActions}
     * @memberof LedgerActions
     */
    public refreshLedger(request: boolean): CustomActions {
        return {
            type: LEDGER.REFRESH_LEDGER,
            payload: request
        };
    }

    public setBulkGenerateConfirm(body: any): CustomActions {
        return {
            type: LEDGER.SHOW_BULK_GENERATE_VOUCHER_CONFIRMATION,
            payload: body
        };
    }
}
