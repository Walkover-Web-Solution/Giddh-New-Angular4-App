import { IELedgerResponse, IELedgerTransaction, TransactionsResponse } from '../models/api-models/Ledger';
import { Observable } from 'rxjs';
import { AccountResponse } from '../models/api-models/Account';
import { ITransactionItem } from '../models/interfaces/ledger.interface';
import * as moment from 'moment/moment';
import { IFlattenAccountsResultItem } from '../models/interfaces/flattenAccountsResultItem.interface';
import * as uuid from 'uuid';
import { cloneDeep, forEach, remove } from '../lodash-optimized';
import { GroupsWithAccountsResponse } from '../models/api-models/GroupsWithAccounts';
import { INameUniqueName } from '../models/api-models/Inventory';
import { underStandingTextData } from './underStandingTextData';
import { IOption } from '../theme/ng-virtual-select/sh-options.interface';
import { LedgerDiscountClass } from '../models/api-models/SettingsDiscount';
import { TaxControlData } from '../theme/tax-control/tax-control.component';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from '../models/api-models/Sales';
import { ICurrencyResponse } from '../models/api-models/Company';

export class LedgerVM {
    public groupsArray$: Observable<GroupsWithAccountsResponse[]>;
    public activeAccount$: Observable<AccountResponse>;
    public activeAccount: AccountResponse;
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
    // public datePipe = createAutoCorrectedDatePipe('dd-mm-yyyy');
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
    public bankTransactionsData: BlankLedgerVM[] = [];
    public selectedBankTxnUniqueName: string;
    public showBankLedgerPanel: boolean = false;
    public currentBankEntry: BlankLedgerVM;
    public reckoningDebitTotal: number = 0;
    public convertedReckoningDebitTotal: number = 0;
    public reckoningCreditTotal: number = 0;
    public convertedReckoningCreditTotal: number = 0;

    constructor() {
        this.noAccountChosenForNewEntry = false;
        this.blankLedger = {
            transactions: [
                {
                    ...new TransactionVM(),
                    id: uuid.v4(),
                    type: 'DEBIT',
                    discounts: [this.staticDefaultDiscount()],
                    selectedAccount: null,
                    isInclusiveTax: true,
                },
                {
                    ...new TransactionVM(),
                    id: uuid.v4(),
                    type: 'CREDIT',
                    discounts: [this.staticDefaultDiscount()],
                    selectedAccount: null,
                    isInclusiveTax: true,
                }],
            voucherType: 'sal',
            entryDate: moment().format('DD-MM-YYYY'),
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
            exchangeRateForDisplay: 1,
            valuesInAccountCurrency: true
        };
    }

    public calculateReckonging(transactions: any) {
        if (transactions.forwardedBalance.amount === 0) {
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
            if (transactions.forwardedBalance.type === 'DEBIT') {
                if ((transactions.forwardedBalance.amount + transactions.debitTotal) <= transactions.creditTotal) {
                    this.reckoningCreditTotal = transactions.creditTotal;
                    this.convertedReckoningCreditTotal = transactions.convertedCreditTotal;

                    this.reckoningDebitTotal = transactions.creditTotal;
                    this.convertedReckoningDebitTotal = transactions.convertedCreditTotal;
                    return;
                } else {
                    this.reckoningCreditTotal = transactions.forwardedBalance.amount + transactions.debitTotal;
                    this.convertedReckoningCreditTotal = transactions.convertedForwardedBalance.amount + transactions.convertedDebitTotal;

                    this.reckoningDebitTotal = transactions.forwardedBalance.amount + transactions.debitTotal;
                    this.convertedReckoningDebitTotal = transactions.convertedForwardedBalance.amount + transactions.convertedDebitTotal;
                    return;
                }
            } else {
                if ((transactions.forwardedBalance.amount + transactions.creditTotal) <= transactions.debitTotal) {
                    this.reckoningCreditTotal = transactions.debitTotal;
                    this.convertedReckoningCreditTotal = transactions.convertedDebitTotal;

                    this.reckoningDebitTotal = transactions.debitTotal;
                    this.convertedReckoningDebitTotal = transactions.convertedDebitTotal;
                    return;
                } else {
                    this.reckoningCreditTotal = transactions.forwardedBalance.amount + transactions.creditTotal;
                    this.convertedReckoningCreditTotal = transactions.convertedForwardedBalance.amount + transactions.convertedCreditTotal;

                    this.reckoningDebitTotal = transactions.forwardedBalance.amount + transactions.creditTotal;
                    this.convertedReckoningDebitTotal = transactions.convertedForwardedBalance.amount + transactions.convertedCreditTotal;
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
        // requestObj.entryDate = moment(requestObj.entryDate).format('DD-MM-YYYY');

        // filter transactions which have selected account
        requestObj.transactions = requestObj.transactions.filter((bl: TransactionVM) => bl.particular);

        // map over transactions array
        requestObj.transactions.map((bl) => {
            // set transaction.particular to selectedAccount uniqueName
            bl.particular = bl.selectedAccount.uniqueName;
            bl.isInclusiveTax = false;
            // filter taxes uniqueNames
            bl.taxes = [...bl.taxesVm.filter(p => p.isChecked).map(p => p.uniqueName)];
            // filter discount
            bl.discounts = bl.discounts.filter(p => p.amount && p.isActive);
            // delete local id
            delete bl['id'];

            if (requestObj.isOtherTaxesApplicable && requestObj.otherTaxModal.appliedOtherTax) {
                bl.taxes.push(requestObj.otherTaxModal.appliedOtherTax.uniqueName);
            }
        });
        if (requestObj.voucherType !== 'rcpt' && requestObj.invoicesToBePaid.length) {
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
            id: uuid.v4(),
            type,
            discounts: [this.staticDefaultDiscount()],
            selectedAccount: null,
            isInclusiveTax: true
        };
    }

    public getUnderstandingText(selectedLedgerAccountType, accountName) {
        let data = _.cloneDeep(underStandingTextData.find(p => p.accountType === selectedLedgerAccountType));
        if (data) {
            data.balanceText.cr = data.balanceText.cr.replace('<accountName>', accountName);
            data.balanceText.dr = data.balanceText.dr.replace('<accountName>', accountName);

            data.text.dr = data.text.dr.replace('<accountName>', accountName);
            data.text.cr = data.text.cr.replace('<accountName>', accountName);
            this.ledgerUnderStandingObj = _.cloneDeep(data);
        }
    }

    /**
     * prepare bank transactions
     * @param {IELedgerResponse[]} array
     * @returns {bankTransactionsData} array
     */
    public getReadyBankTransactionsForUI(data: IELedgerResponse[]) {
        if (data.length > 0) {
            this.bankTransactionsData = [];
            this.showEledger = true;
            forEach(data, (txn: IELedgerResponse) => {
                let item: BlankLedgerVM;
                item = cloneDeep(this.blankLedger);
                item.entryDate = txn.date;
                // item.entryDate = moment(txn.date).format('YYYY-MM-DD');
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
                this.bankTransactionsData.push(item);
            });
        } else {
            this.bankTransactionsData = [];
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
        requestObj.transactions = requestObj.transactions.filter((bl: TransactionVM) => bl.particular);

        // map over transactions array
        requestObj.transactions.map((bl: any) => {
            // set transaction.particular to selectedAccount uniqueName
            bl.particular = bl.selectedAccount.uniqueName;
            // filter taxes uniqueNames
            bl.taxes = bl.taxes.filter(p => p.isChecked).map(p => p.uniqueName);
            // filter discount
            bl.discounts = bl.discounts.filter(p => p.amount && p.isActive);
            // delete local id
            delete bl['id'];
        });
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
    public exchangeRateForDisplay: number = 1;
    public valuesInAccountCurrency: boolean = true;
    public baseCurrencyToDisplay?: ICurrencyResponse;
    public foreignCurrencyToDisplay?: ICurrencyResponse;
    public selectedCurrencyToDisplay?: 0 | 1 = 0;
    public passportNumber?: string;
    public touristSchemeApplicable?: boolean;
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
}

export interface IInventory {
    unit: IInventoryUnit;
    quantity: number;
    stock: INameUniqueName;
    warehouse: WarehouseDetails;
}

export interface IInventoryUnit {
    stockUnitCode: string;
    code: string;
    rate: number;
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
