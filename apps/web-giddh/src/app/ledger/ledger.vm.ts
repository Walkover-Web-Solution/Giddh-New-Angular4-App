import { IELedgerResponse, IELedgerTransaction, TransactionsResponse } from '../models/api-models/Ledger';
import { Observable } from 'rxjs';
import { AccountResponse, AccountResponseV2 } from '../models/api-models/Account';
import { ITransactionItem } from '../models/interfaces/ledger.interface';
import * as dayjs from 'dayjs';
import { IFlattenAccountsResultItem } from '../models/interfaces/flatten-accounts-result-item.interface';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep, forEach, remove } from '../lodash-optimized';
import { INameUniqueName } from '../models/api-models/Inventory';
import { IOption } from '../theme/ng-virtual-select/sh-options.interface';
import { LedgerDiscountClass } from '../models/api-models/SettingsDiscount';
import { TaxControlData } from '../theme/tax-control/tax-control.component';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from '../models/api-models/Sales';
import { ICurrencyResponse } from '../models/api-models/Company';
import { VoucherAdjustments } from '../models/api-models/AdvanceReceiptsAdjust';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';

export class LedgerVM {
    public activeAccount$: Observable<AccountResponse | AccountResponseV2>;
    public activeAccount: AccountResponse | AccountResponseV2;
    public currencies: ICurrencyResponse[] = [];
    public transactionData$: Observable<TransactionsResponse>;
    public flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
    public companyProfile$: Observable<any>;
    public selectedTxnUniqueName: string;
    public currentTxn: ITransactionItem;
    public currentBlankTxn: TransactionVM;
    public currentPage: number;
    public flattenAccountList: Observable<IOption[]>;
    public showNewLedgerPanel: boolean = false;
    public noAccountChosenForNewEntry: boolean;
    public selectedAccount: IFlattenAccountsResultItem = null;
    public today: Date = new Date();
    public fromDate: Date;
    public toDate: Date;
    public format: string = 'dd-MM-yyyy';
    public formatPlaceholder: string = 'dd-mm-yyyy';
    public accountUnq: string = '';
    public blankLedger: BlankLedgerVM;
    public dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    public showTaxationDiscountBox: boolean = false;
    public ledgerUnderStandingObj = {
        accountType: '',
        text: {
            cr: '',
            dr: ''
        },
        balanceText: {
            cr: '',
            dr: ''
        }
    };
    // bank transaction related
    public showEledger: boolean = false;
    public bankTransactionsCreditData: BlankLedgerVM[] = [];
    public bankTransactionsDebitData: BlankLedgerVM[] = [];
    public selectedBankTxnUniqueName: string;
    public showBankLedgerPanel: boolean = false;
    public currentBankEntry: BlankLedgerVM;
    public reckoningDebitTotal: number = 0;
    public convertedReckoningDebitTotal: number = 0;
    public reckoningCreditTotal: number = 0;
    public convertedReckoningCreditTotal: number = 0;

    constructor() {
        this.noAccountChosenForNewEntry = false;
        this.blankLedger = this.getBlankLedger();
    }

    public calculateReckonging(transactions: any) {
        if (transactions.forwardedBalance?.amount === 0) {
            let recTotal = 0;
            let convertedTotal = 0;
            if (transactions.creditTotal > transactions.debitTotal) {
                recTotal = transactions.creditTotal;
                convertedTotal = transactions.convertedCreditTotal;
            } else {
                recTotal = transactions.debitTotal;
                convertedTotal = transactions.convertedDebitTotal;
            }
            this.reckoningCreditTotal = recTotal;
            this.convertedReckoningCreditTotal = convertedTotal;

            this.reckoningDebitTotal = recTotal;
            this.convertedReckoningDebitTotal = convertedTotal;
        } else {
            if (transactions.forwardedBalance?.type === 'DEBIT') {
                if ((transactions.forwardedBalance?.amount + transactions.debitTotal) <= transactions.creditTotal) {
                    this.reckoningCreditTotal = transactions.creditTotal;
                    this.convertedReckoningCreditTotal = transactions.convertedCreditTotal;

                    this.reckoningDebitTotal = transactions.creditTotal;
                    this.convertedReckoningDebitTotal = transactions.convertedCreditTotal;
                    return;
                } else {
                    this.reckoningCreditTotal = transactions.forwardedBalance?.amount + transactions.debitTotal;
                    this.convertedReckoningCreditTotal = transactions.convertedForwardedBalance?.amount + transactions.convertedDebitTotal;

                    this.reckoningDebitTotal = transactions.forwardedBalance?.amount + transactions.debitTotal;
                    this.convertedReckoningDebitTotal = transactions.convertedForwardedBalance?.amount + transactions.convertedDebitTotal;
                    return;
                }
            } else {
                if ((transactions.forwardedBalance?.amount + transactions.creditTotal) <= transactions.debitTotal) {
                    this.reckoningCreditTotal = transactions.debitTotal;
                    this.convertedReckoningCreditTotal = transactions.convertedDebitTotal;

                    this.reckoningDebitTotal = transactions.debitTotal;
                    this.convertedReckoningDebitTotal = transactions.convertedDebitTotal;
                    return;
                } else {
                    this.reckoningCreditTotal = transactions.forwardedBalance?.amount + transactions.creditTotal;
                    this.convertedReckoningCreditTotal = transactions.convertedForwardedBalance?.amount + transactions.convertedCreditTotal;

                    this.reckoningDebitTotal = transactions.forwardedBalance?.amount + transactions.creditTotal;
                    this.convertedReckoningDebitTotal = transactions.convertedForwardedBalance?.amount + transactions.convertedCreditTotal;
                }
            }
        }
    }

    /**
     * prepare blankLedger request object from vm
     * @returns {BlankLedgerVM}
     */
    public prepareBlankLedgerRequestObject(): BlankLedgerVM {
        let requestObj: BlankLedgerVM;
        requestObj = cloneDeep(this.blankLedger);

        // filter transactions which have selected account
        requestObj.transactions = requestObj.transactions?.filter((bl: TransactionVM) => bl.particular);

        // map over transactions array
        requestObj.transactions.map((bl) => {
            if (bl) {
                // set transaction.particular to selectedAccount uniqueName
                bl.particular = bl.selectedAccount ? bl.selectedAccount?.uniqueName : bl.particular;
                bl.isInclusiveTax = false;
                // filter taxes uniqueNames
                bl.taxes = [...bl?.taxesVm?.filter(p => p.isChecked).map(p => p?.uniqueName)];
                // filter discount
                bl.discounts = bl.discounts?.filter(p => p.amount && p.isActive);
                // delete local id
                delete bl['id'];

                if (requestObj.isOtherTaxesApplicable && requestObj.otherTaxModal.appliedOtherTax) {
                    bl.taxes.push(requestObj.otherTaxModal.appliedOtherTax?.uniqueName);
                }
            }
        });
        if (requestObj.voucherType === 'advance-receipt') {
            /** Voucher type in case of advance receipt should be 'rcpt' but to differentiate the drop down values 'advance-receipt' is used */
            requestObj.voucherType = 'rcpt';
        }
        if (requestObj.voucherType !== 'rcpt' && requestObj.invoicesToBePaid && requestObj.invoicesToBePaid.length) {
            requestObj.invoicesToBePaid = [];
        } else if (requestObj.voucherType === 'rcpt' && requestObj.invoiceNumberAgainstVoucher) {
            requestObj.invoiceNumberAgainstVoucher = '';
        }
        return requestObj;
    }

    /**
     * add new transaction object of given type
     * @param {string} type
     * @returns {TransactionVM}
     */
    public addNewTransaction(type: string = 'DEBIT'): TransactionVM {
        return {
            ...new TransactionVM(),
            id: uuidv4(),
            type,
            discounts: [this.staticDefaultDiscount()],
            selectedAccount: null,
            isInclusiveTax: true
        };
    }

    public getUnderstandingText(selectedLedgerAccountType, accountName, parentGroups, localeData?: any) {
        if (localeData) {
            let data;
            let isReverseChargeAccount = false;

            if (parentGroups) {
                parentGroups.forEach(key => {
                    if (key?.uniqueName === "reversecharge") {
                        isReverseChargeAccount = true;
                    }
                });
            }

            let underStandingTextData = localeData?.text_data;

            if (isReverseChargeAccount) {
                data = _.cloneDeep(underStandingTextData?.find(p => p.accountType === "ReverseCharge"));
            } else {
                data = _.cloneDeep(underStandingTextData?.find(p => p.accountType === selectedLedgerAccountType));
            }

            if (data) {
                if (data.balanceText && data.balanceText.cr) {
                    data.balanceText.cr = data.balanceText.cr?.replace('<accountName>', accountName);
                }
                if (data.balanceText && data.balanceText.dr) {
                    data.balanceText.dr = data.balanceText.dr?.replace('<accountName>', accountName);
                }

                if (data.text && data.text.dr) {
                    data.text.dr = data.text.dr?.replace('<accountName>', accountName);
                }
                if (data.text && data.text.cr) {
                    data.text.cr = data.text.cr?.replace('<accountName>', accountName);
                }
                this.ledgerUnderStandingObj = _.cloneDeep(data);
            }
        }
    }

    /**
     * prepare bank transactions
     * @param {IELedgerResponse[]} data API response
     * @param {boolean} isCompany True if company mode, to add transaction manually as we don't add
     * default CREDIT & DEBIT transactions to ledger when in company mode so as to open the ledger in READ only mode
     * but for ICICI banking ledger it requires the two default transaction to show the mapped transactions
     * and therefore isCompany is used to add the two default transaction manually at runtime if found true
     * @returns void
     */
    public getReadyBankTransactionsForUI(data: IELedgerResponse[], isCompany?: boolean) {
        if (data && data.length > 0) {
            this.bankTransactionsCreditData = [];
            this.bankTransactionsDebitData = [];
            this.showEledger = true;
            let creditLoop = 0, debitLoop = 0;
            let blankLedger = this.getBlankLedger();
            forEach(data, (txn: IELedgerResponse) => {
                let item: BlankLedgerVM;
                item = cloneDeep(blankLedger);
                if (isCompany) {
                    item.transactions = [
                        this.addNewTransaction('DEBIT'),
                        this.addNewTransaction('CREDIT')
                    ];
                }
                item.entryDate = txn.date;
                item.transactionId = txn.transactionId;
                item.isBankTransaction = true;
                forEach(txn.transactions, (bankTxn: IELedgerTransaction) => {
                    item.description = bankTxn.remarks.description;
                    if (bankTxn.type === 'DEBIT') {
                        item.voucherType = 'rcpt';
                    } else {
                        item.voucherType = 'pay';
                    }
                    if (bankTxn.remarks.chequeNumber) {
                        item.chequeNumber = bankTxn.remarks.chequeNumber;
                    }
                    // push transaction
                    item.transactions.map(transaction => {
                        transaction.isChecked = false;
                        if (transaction.type === bankTxn.type) {
                            transaction.amount = bankTxn.amount;
                            transaction.id = item.transactionId;
                        }
                    });
                    item.transactions = remove(item.transactions, (n: any) => {
                        return n.type === bankTxn.type;
                    });
                });
                if (item.transactions[0].type === "CREDIT") {
                    item.index = creditLoop;
                    this.bankTransactionsCreditData.push(item);
                    creditLoop++;
                } else {
                    item.index = debitLoop;
                    this.bankTransactionsDebitData.push(item);
                    debitLoop++;
                }
            });
        } else {
            this.bankTransactionsCreditData = [];
            this.bankTransactionsDebitData = [];
            this.showEledger = false;
        }
    }

    /**
     * prepare bankLedger request object from vm for API
     * @returns {BlankLedgerVM}
     */
    public prepareBankLedgerRequestObject(): BlankLedgerVM {
        let requestObj: BlankLedgerVM;
        requestObj = cloneDeep(this.currentBankEntry);

        // filter transactions which have selected account
        requestObj.transactions = requestObj.transactions?.filter((bl: TransactionVM) => bl.particular);

        // map over transactions array
        requestObj.transactions.map((bl: any) => {
            if (bl) {
                // set transaction.particular to selectedAccount uniqueName
                bl.particular = bl?.selectedAccount ? bl.selectedAccount.uniqueName : bl?.particular;
                // filter taxes uniqueNames
                bl.taxes = [...bl?.taxesVm?.filter(p => p.isChecked).map(p => p?.uniqueName)];
                // filter discount
                bl.discounts = bl.discounts?.filter(p => p.amount && p.isActive);
                // delete local id
                delete bl['id'];
            }
        });
        if (requestObj.voucherType === 'advance-receipt') {
            /** Voucher type in case of advance receipt should be 'rcpt' but to differentiate the drop down values 'advance-receipt' is used */
            requestObj.voucherType = 'rcpt';
        }
        if (requestObj.voucherType !== 'rcpt' && requestObj.invoicesToBePaid && requestObj.invoicesToBePaid.length) {
            requestObj.invoicesToBePaid = [];
        } else if (requestObj.voucherType === 'rcpt' && requestObj.invoiceNumberAgainstVoucher) {
            requestObj.invoiceNumberAgainstVoucher = '';
        }
        return requestObj;
    }

    public staticDefaultDiscount(): LedgerDiscountClass {
        return {
            discountType: 'FIX_AMOUNT',
            amount: 0,
            name: '',
            particular: '',
            isActive: true
        };
    }

    /**
     * Returns blank ledger object
     *
     * @returns {*}
     * @memberof LedgerVM
     */
    public getBlankLedger(): any {
        return {
            transactions: [
                {
                    ...new TransactionVM(),
                    id: uuidv4(),
                    type: 'DEBIT',
                    discounts: [this.staticDefaultDiscount()],
                    selectedAccount: null,
                    isInclusiveTax: true,
                },
                {
                    ...new TransactionVM(),
                    id: uuidv4(),
                    type: 'CREDIT',
                    discounts: [this.staticDefaultDiscount()],
                    selectedAccount: null,
                    isInclusiveTax: true,
                }],
            voucherType: 'sal',
            entryDate: dayjs().format(GIDDH_DATE_FORMAT),
            unconfirmedEntry: false,
            attachedFile: '',
            attachedFileName: '',
            tag: null,
            description: '',
            generateInvoice: false,
            chequeNumber: '',
            chequeClearanceDate: '',
            invoiceNumberAgainstVoucher: '',
            compoundTotal: 0,
            convertedCompoundTotal: 0,
            invoicesToBePaid: [],
            otherTaxModal: new SalesOtherTaxesModal(),
            tdsTcsTaxesSum: 0,
            otherTaxesSum: 0,
            otherTaxType: 'tcs',
            exchangeRate: 1,
            valuesInAccountCurrency: true
        };
    }
}

export class BlankLedgerVM {
    public transactions: TransactionVM[];
    public voucherType: string;
    public entryDate: string;
    public unconfirmedEntry: boolean;
    public attachedFile: string;
    public attachedFileName?: string;
    public tag: any;
    public description: string;
    public generateInvoice: boolean;
    public chequeNumber: string;
    public chequeClearanceDate: string;
    public compoundTotal: number;
    public convertedCompoundTotal: number = 0;
    public isBankTransaction?: boolean;
    public transactionId?: string;
    public invoiceNumberAgainstVoucher: string;
    public voucherNumber?: string;
    public invoicesToBePaid?: string[];
    public tagNames?: string[];
    public eledgerId?: number | string;
    public tcsCalculationMethod?: SalesOtherTaxesCalculationMethodEnum;
    public isOtherTaxesApplicable?: boolean;
    public otherTaxModal: SalesOtherTaxesModal;
    public otherTaxesSum: number;
    public tdsTcsTaxesSum: number;
    public otherTaxType: 'tcs' | 'tds';
    public exchangeRate: number = 1;
    public valuesInAccountCurrency: boolean = true;
    public baseCurrencyToDisplay?: ICurrencyResponse;
    public foreignCurrencyToDisplay?: ICurrencyResponse;
    public selectedCurrencyToDisplay?: 0 | 1 = 0;
    public passportNumber?: string;
    public touristSchemeApplicable?: boolean;
    public index?: number;
    public mergePB?: boolean;
    public referenceVoucher?: ReferenceVoucher;
}

export class IInvoiceLinkingRequest {
    public linkedInvoices: ILinkedInvoice[];
}

export class ILinkedInvoice {
    public invoiceUniqueName: string;
    public voucherType: string;
}

export class ReferenceVoucher {
    public uniqueName: string;
    public number?: any;
    public voucherType?: string;
    public date?: string;
}

export class TransactionVM {
    public id?: string;
    public amount: number = 0;
    public particular: string = '';
    public applyApplicableTaxes: boolean;
    public isInclusiveTax: boolean;
    public type: string;
    public taxes: string[] = [];
    public taxesVm?: TaxControlData[] = [];
    public tax?: number = 0;
    public convertedTax?: number = 0;
    public total: number = 0;
    public convertedTotal?: number = 0;
    public discounts: LedgerDiscountClass[];
    public discount?: number = 0;
    public convertedDiscount?: number = 0;
    public selectedAccount?: IFlattenAccountsResultItem | any;
    public unitRate?: IInventoryUnit[];
    public isStock?: boolean = false;
    public inventory?: IInventory | any;
    public convertedRate?: number = 0;
    public currency?: string;
    public convertedAmount?: number = 0;
    public isChecked: boolean = false;
    public showTaxationDiscountBox: boolean = false;
    public itcAvailable?: string = '';
    public reverseChargeTaxableAmount?: number;
    public shouldShowRcmEntry?: boolean;
    public advanceReceiptAmount?: number = 0;
    public invoiceLinkingRequest?: IInvoiceLinkingRequest;
    public voucherAdjustments?: VoucherAdjustments;
    public showDropdown?: boolean = false;
    public referenceVoucher?: ReferenceVoucher;
    public showOtherTax: boolean = false;
}

export interface IInventory {
    unit: IInventoryUnit;
    quantity: number;
    stock: INameUniqueName;
    warehouse: WarehouseDetails;
}

export interface IInventoryUnit {
    stockUnitUniqueName?: any;
    uniqueName?: any;
    stockUnitCode: string;
    code: string;
    rate: number;
    highPrecisionRate?: number;
}

/**
 * Warehouse details in a ledger
 *
 * @export
 * @interface WarehouseDetails
 */
export interface WarehouseDetails {
    name: string;
    uniqueName: string;
}

/**
 * List of available ITC for India
 *
 * @export
 * @enum {string}
 */
export enum AvailableItc {
    ImportOfGoods = 'import_of_goods',
    ImportOfServices = 'import_of_services',
    Others = 'all_other_itc'
}

/** List of available ITC */
export const AVAILABLE_ITC_LIST = [
    { label: 'Import of goods', value: AvailableItc.ImportOfGoods },
    { label: 'Import of services', value: AvailableItc.ImportOfServices },
    { label: 'Others', value: AvailableItc.Others }
];
