import { CustomActions } from './../../store/customActions';
import { map, switchMap } from 'rxjs/operators';
import { DownloadLedgerRequest, ILedgerAdvanceSearchRequest, ILedgerAdvanceSearchResponse, IUnpaidInvoiceListResponse, LedgerResponse, LedgerUpdateRequest, TransactionsRequest, TransactionsResponse } from '../../models/api-models/Ledger';
import { AccountRequestV2, AccountResponseV2, AccountSharedWithResponse, ShareAccountRequest } from '../../models/api-models/Account';
import { AccountService } from '../../services/account.service';
/**
 * Created by ad on 04-07-2017.
 */
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AppState } from '../../store/roots';
import { LEDGER } from './ledger.const';
import { LedgerService } from '../../services/ledger.service';
import { GroupService } from '../../services/group.service';
import { FlattenGroupsAccountsResponse } from '../../models/api-models/Group';
import { BlankLedgerVM } from '../../ledger/ledger.vm';
import { GenerateBulkInvoiceRequest, IBulkInvoiceGenerationFalingError } from '../../models/api-models/Invoice';
import { InvoiceService } from '../../services/invoice.service';
import { DaybookQueryRequest } from '../../models/api-models/DaybookRequest';

@Injectable()
export class LedgerActions {
    @Effect()
    public GetTransactions$: Observable<Action> = this.action$
        .ofType(LEDGER.GET_TRANSACTION).pipe(
            switchMap((action: CustomActions) => {
                let req: TransactionsRequest = action.payload as TransactionsRequest;
                return this._ledgerService.GetLedgerTranscations(req);
            }), map(res => this.validateResponse<TransactionsResponse, TransactionsRequest>(res, {
                type: LEDGER.GET_TRANSACTION_RESPONSE,
                payload: res
            }, true, {
                type: LEDGER.GET_TRANSACTION_RESPONSE,
                payload: res
            })));

    @Effect()
    public GetAccountDetails$: Observable<Action> = this.action$
        .ofType(LEDGER.GET_LEDGER_ACCOUNT).pipe(
            switchMap((action: CustomActions) => this._accountService.GetAccountDetailsV2(action.payload)),
            map(res => this.validateResponse<AccountResponseV2, string>(res, {
                type: LEDGER.GET_LEDGER_ACCOUNT_RESPONSE,
                payload: res
            }, true, {
                type: LEDGER.GET_LEDGER_ACCOUNT_RESPONSE,
                payload: res
            })));

    @Effect()
    public DownloadInvoiceFile$: Observable<Action> = this.action$
        .ofType(LEDGER.DOWNLOAD_LEDGER_INVOICE).pipe(
            switchMap((action: CustomActions) => this._ledgerService.DownloadInvoice(action.payload.body, action.payload.accountUniqueName)),
            map(res => this.validateResponse<string, DownloadLedgerRequest>(res, {
                type: LEDGER.DOWNLOAD_LEDGER_INVOICE_RESPONSE,
                payload: res
            }, true, {
                type: LEDGER.DOWNLOAD_LEDGER_INVOICE_RESPONSE,
                payload: res
            })));

    @Effect()
    public GetDiscountAccounts$: Observable<Action> = this.action$
        .ofType(LEDGER.GET_DISCOUNT_ACCOUNTS_LIST).pipe(
            switchMap((action: CustomActions) => this._groupService.GetFlattenGroupsAccounts('discount')),
            map(res => this.validateResponse<FlattenGroupsAccountsResponse, string>(res, {
                type: LEDGER.GET_DISCOUNT_ACCOUNTS_LIST_RESPONSE,
                payload: res
            }, true, {
                type: LEDGER.GET_DISCOUNT_ACCOUNTS_LIST_RESPONSE,
                payload: res
            })));

    @Effect()
    public CreateBlankLedger$: Observable<Action> = this.action$
        .ofType(LEDGER.CREATE_BLANK_LEDGER_REQUEST).pipe(
            switchMap((action: CustomActions) => this._ledgerService.CreateLedger(action.payload.model, action.payload.accountUniqueName)),
            map(res => this.validateResponse<LedgerResponse[], BlankLedgerVM>(res, {
                type: LEDGER.CREATE_BLANK_LEDGER_RESPONSE,
                payload: res
            }, true, {
                type: LEDGER.CREATE_BLANK_LEDGER_RESPONSE,
                payload: res
            })));

    @Effect()
    public DeleteTrxEntry$: Observable<Action> = this.action$
        .ofType(LEDGER.DELETE_TRX_ENTRY).pipe(
            switchMap((action: CustomActions) => this._ledgerService.DeleteLedgerTransaction(action.payload.accountUniqueName, action.payload.entryUniqueName)),
            map(res => this.deleteTrxEntryResponse(res)));

    @Effect()
    public DeleteTrxEntryResponse$: Observable<Action> = this.action$
        .ofType(LEDGER.DELETE_TRX_ENTRY_RESPONSE).pipe(
            map((action: CustomActions) => {
                let res = action.payload as BaseResponse<string, string>;
                if (res.status === 'success') {
                    this._toasty.successToast('Entry deleted successfully', 'Success');
                } else {
                    this._toasty.errorToast(res.message);
                }
                return {
                    type: 'EmptyAction'
                };
            }));
    @Effect()
    public shareAccount$: Observable<Action> = this.action$
        .ofType(LEDGER.LEDGER_SHARE_ACCOUNT).pipe(
            switchMap((action: CustomActions) =>
                this._accountService.AccountShare(
                    action.payload.body,
                    action.payload.accountUniqueName
                )
            ),
            map(response => {
                return this.shareAccountResponse(response);
            }));
    @Effect()
    public shareAccountResponse$: Observable<Action> = this.action$
        .ofType(LEDGER.LEDGER_SHARE_ACCOUNT_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return {
                        type: 'EmptyAction'
                    };
                } else {
                    let data: BaseResponse<string, ShareAccountRequest> = action.payload;
                    this._toasty.successToast(action.payload.body, '');
                    return this.sharedAccountWith(data.queryString.accountUniqueName);
                }
            }));

    @Effect()
    public unShareAccount$: Observable<Action> = this.action$
        .ofType(LEDGER.LEDGER_UNSHARE_ACCOUNT).pipe(
            switchMap((action: CustomActions) =>
                this._accountService.AccountUnshare(
                    action.payload.user,
                    action.payload.accountUniqueName
                )
            ),
            map(response => {
                return this.unShareAccountResponse(response);
            }));

    @Effect()
    public unShareAccountResponse$: Observable<Action> = this.action$
        .ofType(LEDGER.LEDGER_UNSHARE_ACCOUNT_RESPONSE).pipe(
            map((action: CustomActions) => {
                let data: BaseResponse<string, string> = action.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this._toasty.successToast(action.payload.body, '');
                }
                return {
                    type: 'EmptyAction'
                };
                // return this.sharedAccountWith(data.queryString.accountUniqueName);
            }));

    @Effect()
    public sharedAccount$: Observable<Action> = this.action$
        .ofType(LEDGER.LEDGER_SHARED_ACCOUNT_WITH).pipe(
            switchMap((action: CustomActions) => this._accountService.AccountShareWith(action.payload)),
            map(response => {
                return this.sharedAccountWithResponse(response);
            }));
    @Effect()
    public sharedAccountResponse$: Observable<Action> = this.action$
        .ofType(LEDGER.LEDGER_SHARED_ACCOUNT_WITH_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public updateTxnEntry$: Observable<Action> = this.action$
        .ofType(LEDGER.UPDATE_TXN_ENTRY).pipe(
            switchMap((action: CustomActions) => this._ledgerService.UpdateLedgerTransactions(action.payload.model,
                action.payload.accountUniqueName, action.payload.entryUniqueName)),
            map(resp => {
                return this.updateTxnEntryResponse(resp);
            }));

    @Effect()
    public updateTxnEntryResponse$: Observable<Action> = this.action$
        .ofType(LEDGER.UPDATE_TXN_ENTRY_RESPONSE).pipe(
            map((action: CustomActions) => {
                let response: BaseResponse<LedgerResponse, LedgerUpdateRequest> = action.payload;
                if (response.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                } else if (response.status === 'no-network') {
                    this.ResetUpdateLedger();
                    return { type: 'EmptyAction' };
                } else {
                    this._toasty.successToast('entry updated successfully');
                    if (response.request.generateInvoice && !response.body.voucherGenerated) {
                        let invoiceGenModel: GenerateBulkInvoiceRequest[] = [];
                        // accountUniqueName, entryUniqueName
                        let entryUniqueName = response.queryString.entryUniqueName.split('?')[0];
                        invoiceGenModel.push({
                            accountUniqueName: response.queryString.accountUniqueName,
                            entries: [entryUniqueName]
                        });
                        return this.generateUpdatedLedgerInvoice(invoiceGenModel);
                    }
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public CreateQuickAccountV2$: Observable<Action> = this.action$
        .ofType(LEDGER.CREATE_QUICK_ACCOUNT).pipe(
            switchMap((action: CustomActions) => this._accountService.CreateAccountV2(action.payload.account, action.payload.accountUniqueName)),
            map(response => {
                return this.createQuickAccountResponseV2(response);
            }));

    @Effect()
    public CreateQuickAccountResponseV2$: Observable<Action> = this.action$
        .ofType(LEDGER.CREATE_QUICK_ACCOUNT_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return {
                        type: 'EmptyAction'
                    };
                } else {
                    this._toasty.successToast('Account Created Successfully');
                    // if (action.payload.body.errorMessageForCashFreeVirtualAccount) {
                    //     this._toasty.warningToast('Virtual account could not be created for Account "' + action.payload.body.name + '", ' + action.payload.body.errorMessageForCashFreeVirtualAccount);
                    // }
                    // if (action.payload.body.errorMessageForBankDetails) {
                    //   this._toasty.warningToast(action.payload.body.errorMessageForBankDetails);
                    // }
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public AdvanceSearch$: Observable<Action> = this.action$
        .ofType(LEDGER.ADVANCE_SEARCH).pipe(
            switchMap((action: CustomActions) => this._ledgerService.AdvanceSearch(action.payload.model, action.payload.accountUniqueName, action.payload.from,
                action.payload.to, '', action.payload.page, action.payload.count, action.payload.q)),
            map(response => {
                return this.advanceSearchResponse(response);
            }));

    @Effect()
    public AdvanceSearchResponse$: Observable<Action> = this.action$
        .ofType(LEDGER.ADVANCE_SEARCH_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    // this._toasty.successToast('Data filtered successfully');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public generateUpdatedLedgerInvoice$: Observable<CustomActions> = this.action$
        .ofType(LEDGER.GENERATE_UPDATED_LEDGER_INVOICE).pipe(
            switchMap((action: CustomActions) => this._invoiceServices.GenerateBulkInvoice({ combined: false }, action.payload)),
            map(response => {
                if (response.status === 'success') {
                    if (typeof response.body === 'string') {
                        this._toasty.successToast(response.body);
                        this.store.dispatch(this.setTxnForEdit(''));
                        return this.setTxnForEdit(response.request[0].entries[0]);
                    } else if (Array.isArray(response.body) && 'reason' in response.body[0]) {
                        this._toasty.errorToast(response.body[0].reason);
                    }
                } else {
                    this._toasty.errorToast(response.message, response.code);
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public getLedgerTrxDetails$: Observable<CustomActions> = this.action$
        .ofType(LEDGER.GET_LEDGER_TRX_DETAILS).pipe(
            switchMap((action: CustomActions) => this._ledgerService.GetLedgerTransactionDetails(action.payload.accountUniqueName, action.payload.entryName)),
            map(response => {
                return this.validateResponse(response, {
                    type: LEDGER.GET_LEDGER_TRX_DETAILS_RESPONSE,
                    payload: response
                }, true, {
                    type: LEDGER.GET_LEDGER_TRX_DETAILS_RESPONSE,
                    payload: response
                });
            }));

    @Effect()
    public GetReconciliation$: Observable<Action> = this.action$
        .ofType(LEDGER.GET_RECONCILIATION).pipe(
            switchMap((action: CustomActions) => {
                let req: TransactionsRequest = action.payload as TransactionsRequest;
                return this._ledgerService.GetReconciliation(req, req.accountUniqueName);
            }), map(response => {
                if (response.status === 'success') {
                    this._toasty.infoToast(response.body.message);
                } else {
                    this._toasty.errorToast(response.message, response.code);
                }
                return {
                    type: LEDGER.GET_RECONCILIATION_RESPONSE,
                    payload: response
                };
            }));

    @Effect()
    public ExportGroupLedger$: Observable<Action> = this.action$
        .ofType(LEDGER.GROUP_EXPORT_LEDGER).pipe(
            switchMap((action: CustomActions) => {
                return this._ledgerService.GroupExportLedger(action.payload.groupUniqueName, action.payload.queryRequest).pipe(
                    map((res) => {
                        if (res.status === 'success') {
                            this._toasty.clearAllToaster();
                            this._toasty.successToast(res.body, res.status);
                        } else {
                            this._toasty.clearAllToaster();
                            this._toasty.errorToast(res.message, res.code);
                        }
                        return { type: 'EmptyAction' };
                    }));
            }));

    @Effect()
    public DeleteMultipleLedgerEntries$: Observable<Action> = this.action$
        .ofType(LEDGER.DELETE_MULTIPLE_LEDGER_ENTRIES).pipe(
            switchMap((action: CustomActions) => this._ledgerService.DeleteMultipleLedgerTransaction(action.payload.accountUniqueName, action.payload.entryUniqueNames)),
            map(res => this.DeleteMultipleLedgerEntriesResponse(res)));

    @Effect()
    public DeleteMultipleLedgerEntriesResponse$: Observable<Action> = this.action$
        .ofType(LEDGER.DELETE_MULTIPLE_LEDGER_ENTRIES_RESPONSE).pipe(
            map((action: CustomActions) => {
                let res: any = action.payload as BaseResponse<any, string>;
                if (res.status === 'success') {
                    if (Array.isArray(res.body)) {
                        let errorMessage = res.body[0].reason;
                        let failedEntries = res.body[0].failedEntries;
                        if (errorMessage) {
                            this._toasty.errorToast(errorMessage, 'Error');
                        }
                        if (failedEntries && failedEntries.length) {
                            return this.SetFailedBulkEntries(failedEntries);
                        }
                    } else {
                        this._toasty.successToast('Entries deleted successfully', 'Success');
                    }
                } else {
                    this._toasty.errorToast(res.message);
                }
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public GenerateBulkLedgerInvoice$: Observable<Action> = this.action$
        .ofType(LEDGER.GENERATE_BULK_LEDGER_INVOICE).pipe(
            switchMap((action: CustomActions) => this._invoiceServices.GenerateBulkInvoice(action.payload.reqObj, action.payload.body, action.payload.requestedFrom)),
            map(response => {
                return this.GenerateBulkLedgerInvoiceResponse(response);
            }));

    @Effect()
    public GenerateBulkLedgerInvoiceResponse$: Observable<Action> = this.action$
        .ofType(LEDGER.GENERATE_BULK_LEDGER_INVOICE_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, GenerateBulkInvoiceRequest[]> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    if (typeof data.body === 'string') {
                        this._toasty.successToast(data.body);
                    } else if (_.isArray(data.body) && data.body.length > 0) {
                        _.forEach(data.body, (item: IBulkInvoiceGenerationFalingError) => {
                            if (item.failedEntries) {
                                this._toasty.warningToast(item.reason);
                            } else if (item.successEntries) {
                                this._toasty.successToast(item.reason);
                            } else {
                                this._toasty.warningToast(item.reason);
                            }

                        });
                        return this.SetFailedBulkEntries(data.body[0].failedEntries);
                    }
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public GetLedgerBalance$: Observable<Action> = this.action$
        .ofType(LEDGER.GET_LEDGER_BALANCE).pipe(
            switchMap((action: CustomActions) => {
                let req: any = action.payload;
                return this._ledgerService.GetLedgerBalance(req);
            }), map(res => this.validateResponse<any, any>(res, {
                type: LEDGER.GET_LEDGER_BALANCE_RESPONSE,
                payload: res
            }, true, {
                type: LEDGER.GET_LEDGER_BALANCE_RESPONSE,
                payload: res
            })));

    @Effect()
    public GetUnpaidInvoiceListAction$: Observable<Action> = this.action$
        .ofType(LEDGER.GET_UNPAID_INVOICE_LIST)
        .pipe(switchMap((action: CustomActions) =>
            this._ledgerService.GetInvoiceList(action.payload)), map(response => {
                return this.GetUnpaidInvoiceListResponse(response);
            }));

    @Effect()
    public GetUnpaidInvoiceListResponse$: Observable<Action> = this.action$
        .ofType(LEDGER.GET_UNPAID_INVOICE_LIST_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'success') {
                    this._toasty.successToast(action.payload.status);
                } else {
                    // this._toasty.successToast('Data filtered successfully');
                }
                return { type: 'EmptyAction' };
            }));

    // public GetCurrencyRate$: Observable<Action> = this.action$
    //   .ofType(LEDGER.GET_CURRENCY_RATE)
    //   .switchMap((action: CustomActions) => this._ledgerService.GetCurrencyRate(action.payload))
    //   .map(response => {
    //     return this.GetCurrencyRateResponse(response);
    //   });

    // @Effect()
    // public GetCurrencyRateResponse$: Observable<Action> = this.action$
    //   .ofType(LEDGER.GET_CURRENCY_RATE_RESPONSE)
    //   .map((action: CustomActions) => {
    //     // if (action.payload.status === 'error') {
    //     //   this._toasty.errorToast(action.payload.message, action.payload.code);
    //     // }
    //     return {
    //       type: 'EmptyAction'
    //     };
    //   });

    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private _ledgerService: LedgerService,
        private _accountService: AccountService,
        private _groupService: GroupService,
        private _invoiceServices: InvoiceService) {
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

    public GetDiscountAccounts(): CustomActions {
        return {
            type: LEDGER.GET_DISCOUNT_ACCOUNTS_LIST
        };
    }

    public CreateBlankLedger(model: BlankLedgerVM, accountUniqueName: string): CustomActions {
        return {
            type: LEDGER.CREATE_BLANK_LEDGER_REQUEST,
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

    public unShareAccount(value: string, accountUniqueName: string): CustomActions {
        return {
            type: LEDGER.LEDGER_UNSHARE_ACCOUNT,
            payload: Object.assign({}, {
                user: value
            }, {
                accountUniqueName
            })
        };
    }

    public unShareAccountResponse(value: BaseResponse<string, string>): CustomActions {
        return {
            type: LEDGER.LEDGER_UNSHARE_ACCOUNT_RESPONSE,
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

    public doAdvanceSearch(model: ILedgerAdvanceSearchRequest, accountUniqueName: string, from?: string, to?: string, page?: number, count?: number, q?: string): CustomActions {
        return {
            type: LEDGER.ADVANCE_SEARCH,
            payload: { model, accountUniqueName, from, to, page, count, q }
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

    public GroupExportLedger(groupUniqueName: string, queryRequest: DaybookQueryRequest): CustomActions {
        return {
            type: LEDGER.GROUP_EXPORT_LEDGER,
            payload: { groupUniqueName, queryRequest }
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

    public GenerateBulkLedgerInvoice(reqObj: { combined: boolean }, model: GenerateBulkInvoiceRequest[], requestedFrom?: string): CustomActions {
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

    public SelectDeSelectAllEntries(mode: 'debit' | 'credit', isChecked: boolean): CustomActions {
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
            payload: { from: request.from, to: request.to, accountUniqueName: request.accountUniqueName, accountCurrency: request.accountCurrency }
        };
    }

    public GetLedgerBalanceResponse(res: any): CustomActions {
        return {
            type: LEDGER.GET_LEDGER_BALANCE_RESPONSE,
            payload: res
        };
    }

    // for GET_UNPAID_INVOICE_LIST
    public GetUnpaidInvoiceListAction(request: any): CustomActions {
        return {
            type: LEDGER.GET_UNPAID_INVOICE_LIST,
            payload: { accountUniqueName: request.accountUniqueName, status: request.status }
        };
    }

    public GetUnpaidInvoiceListResponse(value: BaseResponse<IUnpaidInvoiceListResponse, any>): CustomActions {
        return {
            type: LEDGER.GET_UNPAID_INVOICE_LIST_RESPONSE,
            payload: value
        };
    }

    private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response.status === 'error') {
            if (showToast) {
                this._toasty.errorToast(response.message);
            }
            return errorAction;
        } else {
            if (showToast && typeof response.body === 'string') {
                this._toasty.successToast(response.body);
            }
        }
        return successAction;
    }

}
