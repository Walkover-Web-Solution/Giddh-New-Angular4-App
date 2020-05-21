import { BaseResponse } from '../../models/api-models/BaseResponse';
import { DownloadLedgerRequest, LedgerResponse, LedgerUpdateRequest, TransactionsRequest, TransactionsResponse } from '../../models/api-models/Ledger';
import { AccountResponse, AccountSharedWithResponse } from '../../models/api-models/Account';
import { LEDGER } from '../../actions/ledger/ledger.const';
import { FlattenGroupsAccountsResponse } from '../../models/api-models/Group';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { BlankLedgerVM } from '../../ledger/ledger.vm';
import { CustomActions } from '../customActions';
import { COMMON_ACTIONS } from '../../actions/common.const';
import * as _ from 'lodash';

export interface LedgerState {
    account?: AccountResponse;
    transcationRequest?: TransactionsRequest;
    transactionsResponse?: TransactionsResponse;
    transactionInprogress: boolean;
    accountInprogress: boolean;
    downloadInvoiceInProcess?: boolean;
    discountAccountsList?: IFlattenGroupsAccountsDetail;
    ledgerCreateSuccess?: boolean;
    ledgerCreateInProcess?: boolean;
    selectedTxnForEditUniqueName: string;
    selectedAccForEditUniqueName: string;
    isDeleteTrxEntrySuccessfull: boolean;
    activeAccountSharedWith?: AccountSharedWithResponse[];
    isTxnUpdateInProcess: boolean;
    isTxnUpdateSuccess: boolean;
    isQuickAccountInProcess: boolean;
    isQuickAccountCreatedSuccessfully: boolean;
    transactionDetails: LedgerResponse;
    isAdvanceSearchApplied: boolean;
    ledgerBulkActionSuccess: boolean;
    ledgerBulkActionFailedEntries: string[];
    ledgerTransactionsBalance: any;
    refreshLedger: boolean;
}

export const initialState: LedgerState = {
    transactionInprogress: false,
    accountInprogress: false,
    selectedTxnForEditUniqueName: '',
    selectedAccForEditUniqueName: '',
    isDeleteTrxEntrySuccessfull: false,
    activeAccountSharedWith: null,
    isTxnUpdateInProcess: false,
    isTxnUpdateSuccess: false,
    isQuickAccountInProcess: false,
    isQuickAccountCreatedSuccessfully: false,
    transactionDetails: null,
    isAdvanceSearchApplied: false,
    ledgerBulkActionSuccess: false,
    ledgerBulkActionFailedEntries: [],
    ledgerTransactionsBalance: null,
    refreshLedger: false
};

export function ledgerReducer(state = initialState, action: CustomActions): LedgerState {
    let data: BaseResponse<AccountResponse, string>;
    let transaction: BaseResponse<TransactionsResponse, TransactionsRequest>;
    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
        case LEDGER.GET_LEDGER_ACCOUNT:
            return Object.assign({}, state, {
                accountInprogress: true
            });
        case LEDGER.GET_LEDGER_ACCOUNT_RESPONSE:
            data = action.payload as BaseResponse<AccountResponse, string>;
            if (data.status === 'success') {
                return Object.assign({}, state, {
                    accountInprogress: false,
                    account: data.body
                });
            }
            return Object.assign({}, state, {
                accountInprogress: false
            });
        case LEDGER.GET_TRANSACTION:
            return Object.assign({}, state, {
                transactionInprogress: true
            });
        case LEDGER.GET_TRANSACTION_RESPONSE:
            transaction = action.payload as BaseResponse<TransactionsResponse, TransactionsRequest>;
            if (transaction.status === 'success') {
                return Object.assign({}, state, {
                    transactionInprogress: false,
                    isAdvanceSearchApplied: false,
                    transcationRequest: transaction.request,
                    transactionsResponse: prepareTransactions(transaction.body)
                });
            }
            return Object.assign({}, state, {
                transactionInprogress: false
            });
        case LEDGER.ADVANCE_SEARCH:
            return Object.assign({}, state, { transactionInprogress: true });
        case LEDGER.ADVANCE_SEARCH_RESPONSE:
            transaction = action.payload as BaseResponse<TransactionsResponse, TransactionsRequest>;
            if (transaction.status === 'success') {
                let ledgerTransactionsBalance = {
                    closingBalance: transaction.body.closingBalance,
                    convertedClosingBalance: transaction.body.convertedClosingBalance,
                    creditTotal: transaction.body.creditTotal,
                    convertedCreditTotal: transaction.body.convertedCreditTotal,
                    debitTotal: transaction.body.debitTotal,
                    convertedDebitTotal: transaction.body.convertedDebitTotal,
                    forwardedBalance: transaction.body.forwardedBalance,
                    convertedForwardedBalance: transaction.body.convertedForwardedBalance,
                    currencySymbol: transaction.body.currencySymbol,
                    currencyCode: transaction.body.currencyCode,
                    convertedCurrencySymbol: transaction.body.convertedCurrencySymbol,
                    convertedCurrencyCode: transaction.body.convertedCurrencyCode
                };
                return Object.assign({}, state, {
                    transactionInprogress: false,
                    isAdvanceSearchApplied: true,
                    transcationRequest: transaction.request,
                    transactionsResponse: prepareTransactions(transaction.body),
                    ledgerTransactionsBalance
                });
            }
            return Object.assign({}, state, {
                transactionInprogress: false
            });
        case LEDGER.DOWNLOAD_LEDGER_INVOICE:
            return Object.assign({}, state, { downloadInvoiceInProcess: true });
        case LEDGER.DOWNLOAD_LEDGER_INVOICE_RESPONSE:
            let downloadData = action.payload as BaseResponse<string, DownloadLedgerRequest>;
            if (downloadData.status === 'success') {
                return Object.assign({}, state, { downloadInvoiceInProcess: false });
            }
            return Object.assign({}, state, { downloadInvoiceInProcess: false });
        case LEDGER.GET_DISCOUNT_ACCOUNTS_LIST_RESPONSE:
            let discountData: BaseResponse<FlattenGroupsAccountsResponse, string> = action.payload;
            if (discountData.status === 'success' && discountData.body.results.length > 0) {
                return Object.assign({}, state, {
                    discountAccountsList: discountData.body.results.find(r => r.groupUniqueName === 'discount')
                });
            } else {
                return { ...state, discountAccountsList: null };
            }
        case LEDGER.CREATE_BLANK_LEDGER_REQUEST:
            return Object.assign({}, state, {
                ledgerCreateSuccess: false,
                ledgerCreateInProcess: true
            });
        case LEDGER.CREATE_BLANK_LEDGER_RESPONSE:
            let ledgerResponse: BaseResponse<LedgerResponse[], BlankLedgerVM> = action.payload;
            if (ledgerResponse.status === 'success') {
                return Object.assign({}, state, {
                    ledgerCreateSuccess: true,
                    ledgerCreateInProcess: false,
                    // transactionsResponse: prepareTransactionOnCreate(ledgerResponse.body, state.transactionsResponse)
                });
            }
            return Object.assign({}, state, {
                ledgerCreateSuccess: false,
                ledgerCreateInProcess: false
            });
        case LEDGER.SET_SELECTED_TXN_FOR_EDIT:
            return {
                ...state,
                selectedTxnForEditUniqueName: action.payload
            };
        case LEDGER.SET_SELECTED_ACCOUNT_FOR_EDIT:
            return {
                ...state,
                selectedAccForEditUniqueName: action.payload
            };
        case LEDGER.DELETE_TRX_ENTRY:
            return {
                ...state,
                isDeleteTrxEntrySuccessfull: false
            };
        case LEDGER.DELETE_TRX_ENTRY_RESPONSE:
            let delResp = action.payload as BaseResponse<string, string>;
            return {
                ...state,
                isDeleteTrxEntrySuccessfull: delResp.status === 'success'
            };
        case LEDGER.RESET_DELETE_TRX_ENTRY_MODAL:
            return {
                ...state,
                isDeleteTrxEntrySuccessfull: false
            };
        case LEDGER.LEDGER_SHARED_ACCOUNT_WITH_RESPONSE:
            let sharedAccountData: BaseResponse<AccountSharedWithResponse[], string> = action.payload;
            if (sharedAccountData.status === 'success') {
                return {
                    ...state,
                    activeAccountSharedWith: sharedAccountData.body
                };
            }
            return state;
        case LEDGER.LEDGER_UNSHARE_ACCOUNT_RESPONSE:
            let unSharedAccData: BaseResponse<string, string> = action.payload;
            if (unSharedAccData.status === 'success') {
                return {
                    ...state,
                    activeAccountSharedWith: state.activeAccountSharedWith.filter(ac => unSharedAccData.request !== ac.userEmail)
                };
            }
            return state;
        case LEDGER.UPDATE_TXN_ENTRY:
            return {
                ...state,
                isTxnUpdateInProcess: true,
                isTxnUpdateSuccess: false
            };
        case LEDGER.RESET_UPDATE_TXN_ENTRY:
            return {
                ...state,
                isTxnUpdateInProcess: false,
                isTxnUpdateSuccess: false
            };
        case LEDGER.UPDATE_TXN_ENTRY_RESPONSE:
            let updateResponse: BaseResponse<LedgerResponse, LedgerUpdateRequest> = action.payload;
            if (updateResponse.status === 'success') {
                return {
                    ...state,
                    isTxnUpdateInProcess: false,
                    isTxnUpdateSuccess: true,
                    transactionDetails: updateResponse.body
                };
            }
            return {
                ...state,
                isTxnUpdateInProcess: false,
                isTxnUpdateSuccess: false
            };
        case LEDGER.CREATE_QUICK_ACCOUNT:
            return {
                ...state,
                isQuickAccountInProcess: true
            };
        case LEDGER.CREATE_QUICK_ACCOUNT_RESPONSE:
            if (action.payload.status === 'success') {
                return {
                    ...state,
                    isQuickAccountInProcess: false,
                    isQuickAccountCreatedSuccessfully: true
                };
            }
            return {
                ...state,
                isQuickAccountInProcess: false,
                isQuickAccountCreatedSuccessfully: false
            };
        case LEDGER.GET_LEDGER_TRX_DETAILS_RESPONSE: {
            let response: BaseResponse<LedgerResponse, string> = action.payload;
            if (response.status === 'success') {
                return {
                    ...state,
                    transactionDetails: response.body
                };
            }
            return state;
        }
        case LEDGER.RESET_LEGER_TRX_DETAILS:
            return {
                ...state, transactionDetails: null
            };
        case LEDGER.RESET_QUICK_ACCOUNT_MODAL:
            return {
                ...state,
                isQuickAccountInProcess: false,
                isQuickAccountCreatedSuccessfully: false
            };
        case LEDGER.RESET_LEDGER:
            return {
                ...state,
                account: null,
                transcationRequest: null,
                transactionsResponse: null,
                transactionInprogress: false,
                accountInprogress: false,
                downloadInvoiceInProcess: false,
                discountAccountsList: null,
                ledgerCreateSuccess: false,
                isDeleteTrxEntrySuccessfull: false,
                ledgerCreateInProcess: false,
                selectedTxnForEditUniqueName: '',
                selectedAccForEditUniqueName: '',
                activeAccountSharedWith: null,
                isTxnUpdateInProcess: false,
                isTxnUpdateSuccess: false,
                isQuickAccountInProcess: false,
                isQuickAccountCreatedSuccessfully: false,
                transactionDetails: null
            };
        case LEDGER.GET_RECONCILIATION_RESPONSE: {
            let res = action.payload;
            if (res.status === 'success') {
                return Object.assign({}, state, {
                    transactionsResponse: prepareTransactions(res.body)
                });
            }
            return state;
        }
        case LEDGER.DELETE_MULTIPLE_LEDGER_ENTRIES: {
            return Object.assign({}, state, { ledgerBulkActionSuccess: false });
        }
        case LEDGER.DELETE_MULTIPLE_LEDGER_ENTRIES_RESPONSE: {
            return Object.assign({}, state, { ledgerBulkActionSuccess: true });
        }
        case LEDGER.GENERATE_BULK_LEDGER_INVOICE: {
            return Object.assign({}, state, { ledgerBulkActionSuccess: false });
        }
        case LEDGER.GENERATE_BULK_LEDGER_INVOICE_RESPONSE: {
            return Object.assign({}, state, { ledgerBulkActionSuccess: true });
        }
        case LEDGER.GET_CURRENCY_RATE_RESPONSE: {
            let res = action.payload;
            return state;
        }
        case LEDGER.SELECT_DESELECT_ALL_ENTRIES: {
            return {
                ...state,
                transactionsResponse: markCheckedUnChecked(state.transactionsResponse, action.payload.mode, action.payload.isChecked)
            };
        }
        case LEDGER.SELECT_GIVEN_ENTRIES: {
            let res = action.payload as string[];
            let newState = _.cloneDeep(state);
            let debitTrx = newState.transactionsResponse.debitTransactions;
            debitTrx = debitTrx.map(f => {
                res.forEach(c => {
                    if (c === f.entryUniqueName) {
                        f.isChecked = true;
                    }
                });
                return f;
            });
            let creditTrx = newState.transactionsResponse.creditTransactions;
            creditTrx = creditTrx.map(f => {
                res.forEach(c => {
                    if (c === f.entryUniqueName) {
                        f.isChecked = true;
                    }
                });
                return f;
            });

            return {
                ...state,
                transactionsResponse: {
                    ...state.transactionsResponse,
                    debitTransactions: debitTrx,
                    creditTransactions: creditTrx
                },
                ledgerBulkActionFailedEntries: []
            };
        }

        case LEDGER.DESELECT_GIVEN_ENTRIES: {
            let res = action.payload as string[];
            let newState = _.cloneDeep(state);
            let debitTrx = newState.transactionsResponse.debitTransactions;
            debitTrx = debitTrx.map(f => {
                res.forEach(c => {
                    if (c === f.entryUniqueName) {
                        f.isChecked = false;
                    }
                });
                return f;
            });
            let creditTrx = newState.transactionsResponse.creditTransactions;
            creditTrx = creditTrx.map(f => {
                res.forEach(c => {
                    if (c === f.entryUniqueName) {
                        f.isChecked = false;
                    }
                });
                return f;
            });

            return {
                ...state,
                transactionsResponse: {
                    ...state.transactionsResponse,
                    debitTransactions: debitTrx,
                    creditTransactions: creditTrx
                },
                ledgerBulkActionFailedEntries: []
            };
        }

        case LEDGER.SET_FAILED_BULK_ENTRIES: {
            return {
                ...state,
                ledgerBulkActionFailedEntries: action.payload
            };
        }
        case LEDGER.GET_LEDGER_BALANCE: {
            return {
                ...state,
                ledgerTransactionsBalance: null
            };
        }
        case LEDGER.GET_LEDGER_BALANCE_RESPONSE: {
            let res = action.payload;
            if (res.status === 'success') {
                return Object.assign({}, state, {
                    ledgerTransactionsBalance: res.body
                });
            }
            return Object.assign({}, state, {
                ledgerTransactionsBalance: null
            });
        }

        case LEDGER.REFRESH_LEDGER: {
            let request = action.payload;
            return Object.assign({}, state, {
                refreshLedger: request
            });
        }

        default: {
            return state;
        }
    }
}

const prepareTransactions = (transactionDetails: TransactionsResponse): TransactionsResponse => {
    transactionDetails.debitTransactions.map(dbt => dbt.isChecked = false);
    transactionDetails.creditTransactions.map(cbt => cbt.isChecked = false);
    return transactionDetails;
};

const markCheckedUnChecked = (transactionDetails: TransactionsResponse, mode: 'debit' | 'credit', isChecked: boolean): TransactionsResponse => {
    let newResponse: TransactionsResponse = Object.assign({}, transactionDetails);
    let key = mode === 'debit' ? 'debitTransactions' : 'creditTransactions';
    let reverse = mode === 'debit' ? 'creditTransactions' : 'debitTransactions';
    newResponse[key].map(dbt => dbt.isChecked = false);
    if (isChecked) {
        newResponse[key].map(dt => {
            if (dt.isCompoundEntry) {
                newResponse[reverse].map(d => {
                    if (dt.entryUniqueName === d.entryUniqueName) {
                        return d.isChecked = true;
                    }
                    return d;
                });
                dt.isChecked = true;
            } else {
                dt.isChecked = true;
            }
            return dt;
        });
    }
    return newResponse;
};

const prepareTransactionOnCreate = (txnArr, ledgerTransactions) => {
    _.forEach(txnArr, (txn) => {
        _.map(txn.transactions, (o) => {
            o.entryDate = txn.entryDate;
            o.entryUniqueName = txn.uniqueName;
            o.voucherNo = txn.voucherNo;
            o.voucherNumber = txn.voucherNumber;
            o.voucherGenerated = txn.voucherGenerated;
            o.voucherGeneratedType = txn.voucher.name;
            o.attachedFileName = txn.attachedFileName;
            o.attachedFile = txn.attachedFile;
            if (o.type === 'DEBIT') {
                return ledgerTransactions.debitTransactions.push(o);
            } else {
                return ledgerTransactions.creditTransactions.push(o);
            }
        });
    });
    return ledgerTransactions;
};
