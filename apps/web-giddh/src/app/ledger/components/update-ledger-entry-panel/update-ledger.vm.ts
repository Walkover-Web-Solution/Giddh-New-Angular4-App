import { Observable, BehaviorSubject } from 'rxjs';
import { ILedgerTransactionItem } from '../../../models/interfaces/ledger.interface';
import { LedgerResponse } from '../../../models/api-models/Ledger';
import { clone, cloneDeep, filter, find, sumBy } from '../../../lodash-optimized';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flatten-accounts-result-item.interface';
import { UpdateLedgerTaxData } from '../update-ledger-tax-control/update-ledger-tax-control.component';
import { UpdateLedgerDiscountComponent } from '../update-ledger-discount/update-ledger-discount.component';
import { TaxControlData } from '../../../theme/tax-control/tax-control.component';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { LedgerDiscountClass } from '../../../models/api-models/SettingsDiscount';
import { AccountResponse } from '../../../models/api-models/Account';
import { ICurrencyResponse, TaxResponse } from '../../../models/api-models/Company';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from '../../../models/api-models/Sales';
import { giddhRoundOff } from '../../../shared/helpers/helperFunctions';
import { HIGH_RATE_FIELD_PRECISION, RATE_FIELD_PRECISION } from '../../../app.constant';
import { take } from 'rxjs/operators';
import { GeneralService } from '../../../services/general.service';
import { LedgerUtilityService } from '../../services/ledger-utility.service';

export class UpdateLedgerVm {
    public otherAccountList: IFlattenAccountsResultItem[] = [];
    public flatternAccountList4Select: Observable<IOption[]>;
    public flatternAccountList4BaseAccount: IOption[] = [];
    public companyTaxesList$: Observable<TaxResponse[]>;
    public currencyList$: Observable<ICurrencyResponse[]>;
    public selectedLedger: LedgerResponse;
    public entryTotal: { crTotal: number, drTotal: number } = { drTotal: 0, crTotal: 0 };
    public convertedEntryTotal: { crTotal: number, drTotal: number } = { drTotal: 0, crTotal: 0 };
    public grandTotal: number = 0;
    public convertedGrandTotal: number = 0;
    public totalAmount: number = 0;
    public convertedTotalAmount: number = 0;
    public totalForTax: number = 0;
    public compoundTotal: number = 0;
    public convertedCompoundTotal: number = 0;
    public convertedRate?: number = 0;
    public voucherTypeList: IOption[];
    public discountArray: LedgerDiscountClass[] = [];
    public discountTrxTotal: number = 0;
    public convertedDiscountTrxTotal: number = 0;
    public taxTrxTotal: number = 0;
    public convertedTaxTrxTotal: number = 0;
    public appliedTaxPerTotal: number = 0;
    public isInvoiceGeneratedAlready: boolean = false;
    public showNewEntryPanel: boolean = true;
    public selectedTaxes: UpdateLedgerTaxData[] = [];
    public taxRenderData: TaxControlData[] = [];
    public discountComponent: UpdateLedgerDiscountComponent;
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
    /** True, if advance receipt is present */
    public isAdvanceReceipt: boolean = false;
    /** True, if RCM is present */
    public isRcmEntry: boolean = false;
    /** True, when amount needs to be calculated inclusive of tax */
    public isInclusiveTax: boolean = false;

    // multi-currency variables
    public isMultiCurrencyAvailable: boolean = false;
    public baseCurrencyDetails: ICurrencyResponse;
    public foreignCurrencyDetails: ICurrencyResponse;
    public selectedCurrency: 0 | 1 = 0;
    public isPrefixAppliedForCurrency: boolean = true;
    public selectedPrefixForCurrency: string;
    public selectedSuffixForCurrency: string;
    public inputMaskFormat: string;
    public selectedCurrencyForDisplay: 0 | 1 = 0;
    public giddhBalanceDecimalPlaces: number = 2;
    /** Advance receipt amount */
    public advanceReceiptAmount: number = 0;
    /** To track compund total change for update ledger advance adjustment */
    public compundTotalObserver = new BehaviorSubject(null);
    /** Rate should have precision up to 4 digits for better calculation */
    public ratePrecision = RATE_FIELD_PRECISION;
    /** Holds active ledger account data */
    public activeAccount: AccountResponse;
    /** Is advance receipt with tds/tcs */
    public isAdvanceReceiptWithTds: boolean = false;
    /** True if it's payment or receipt entry */
    private isPaymentReceipt: boolean = false;
    /** Is Initial Load */
    private initialLoad: boolean = true;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
    /* Amount should have precision up to 16 digits for better calculation */
    public highPrecisionRate = HIGH_RATE_FIELD_PRECISION;
    /** True if entry value is calculated inclusively */
    public isInclusiveEntry: boolean = false;

    constructor(
        private generalService: GeneralService,
        private ledgerUtilityService: LedgerUtilityService
    ) {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
    }

    public get stockTrxEntry(): ILedgerTransactionItem {
        return find(this.selectedLedger?.transactions, (t => !!(t.inventory && t.inventory.stock))) || null;
    }

    public blankTransactionItem(type: string = 'DEBIT'): ILedgerTransactionItem {
        return {
            amount: 0,
            convertedAmount: 0,
            type,
            particular: {
                name: '',
                uniqueName: ''
            }
        } as ILedgerTransactionItem;
    }

    public handleDiscountEntry(amount: number) {
        this.discountTrxTotal = amount;
        this.convertedDiscountTrxTotal = this.calculateConversionRate(amount);

        if (this.selectedLedger?.transactions) {
            this.selectedLedger.transactions = this.selectedLedger.transactions.filter(f => !f.isDiscount);
            let incomeExpenseEntryIndex = this.selectedLedger.transactions.findIndex((trx: ILedgerTransactionItem) => {
                if (trx?.particular?.uniqueName && !trx?.isTax) {
                    let category = this.getAccountCategory(trx.particular, trx.particular?.uniqueName);
                    return this.isValidCategory(category);
                }
            });

            let discountEntryType = 'CREDIT';
            let totalAmount = 0;
            if (incomeExpenseEntryIndex > -1) {
                discountEntryType = this.selectedLedger.transactions[incomeExpenseEntryIndex].type === 'DEBIT' ? 'CREDIT' : 'DEBIT';
                totalAmount = this.selectedLedger.transactions[incomeExpenseEntryIndex].amount;
            } else {
                discountEntryType = 'CREDIT';
                totalAmount = 0;
            }

            this.discountArray?.filter(f => f.isActive && f.amount > 0)?.forEach((dx, index) => {
                let trx: ILedgerTransactionItem = this.blankTransactionItem(discountEntryType);

                trx.particular.uniqueName = dx.discountUniqueName ? dx.discountUniqueName : 'discount';
                trx.particular.name = dx.name ? dx.name : 'discount';
                trx.amount = dx.discountType === 'FIX_AMOUNT' ? dx.amount : giddhRoundOff(((dx.discountValue * totalAmount) / 100), this.giddhBalanceDecimalPlaces);
                trx.convertedAmount = this.calculateConversionRate(trx.amount);
                trx.isStock = false;
                trx.isTax = false;
                trx.isDiscount = true;

                this.selectedLedger.transactions.splice(index, 0, trx);
            });

            this.getEntryTotal();
            this.generateCompoundTotal();
        }
        return;
    }

    public getAccountCategory(account: any, accountName: string): string {
        let parent = account && account.parentGroups && account.parentGroups.length > 0 ? account.parentGroups[0] : '';
        if (parent) {
            if (find(['shareholdersfunds', 'noncurrentliabilities', 'currentliabilities'], p => p === (parent?.uniqueName || parent))) {
                return 'liabilities';
            } else if (find(['fixedassets'], p => p === (parent?.uniqueName || parent))) {
                return 'fixedassets';
            } else if (find(['noncurrentassets', 'currentassets'], p => p === (parent?.uniqueName || parent))) {
                return 'assets';
            } else if (find(['revenuefromoperations', 'otherincome'], p => p === (parent?.uniqueName || parent))) {
                return 'income';
            } else if (find(['operatingcost', 'indirectexpenses'], p => p === (parent?.uniqueName || parent))) {
                if (accountName === 'roundoff') {
                    return 'roundoff';
                }
                let subParent = account.parentGroups[1];
                if (subParent && subParent?.uniqueName === 'discount') {
                    return 'discount';
                }
                return 'expenses';
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    public isValidCategory(category: string): boolean {
        return category === 'income' || category === 'expenses' || category === 'fixedassets' || this.isAdvanceReceipt || this.isRcmEntry || this.isPaymentReceipt;
    }

    public isThereStockEntry(uniqueName: string): boolean {
        // check if entry with same stock added multiple times
        let isAvailable = this.selectedLedger?.transactions?.filter(f => f.particular?.uniqueName === uniqueName);
        let count: number = isAvailable && isAvailable.length;

        if (count > 1) {
            return true;
        }
        // check if is there any stock entry or not
        return find(this.selectedLedger?.transactions,
            (f: ILedgerTransactionItem) => {
                if (f.particular?.uniqueName && f.particular?.uniqueName !== uniqueName) {
                    return !!(f.inventory && f.inventory.stock);
                }
            }
        ) !== undefined;
    }

    public isThereIncomeOrExpenseEntry(): number {
        let isAvailable = filter(this.selectedLedger?.transactions, (trx: ILedgerTransactionItem) => {
            if (trx?.particular?.uniqueName && !trx?.isTax) {
                let category = this.getAccountCategory(trx.particular, trx.particular?.uniqueName);
                return this.isValidCategory(category) || trx.inventory;
            }
        });
        return isAvailable && isAvailable.length;
    }

    public checkDiscountTaxesAllowedOnOpenedLedger(acc: AccountResponse): boolean {
        if (!acc) {
            return false;
        }
        let allowedUniqueNameArr = ['revenuefromoperations', 'otherincome', 'operatingcost', 'indirectexpenses', 'fixedassets'];
        return (acc?.parentGroups?.length) ? allowedUniqueNameArr?.indexOf(acc?.parentGroups[0]?.uniqueName) > -1 : false;
    }

    public getEntryTotal() {
        this.entryTotal.drTotal = giddhRoundOff(sumBy(this.selectedLedger?.transactions, (tr) => {
            if (tr.type === 'DEBIT') {
                return Number(tr.amount) || 0;
            }
            return 0;
        }), this.giddhBalanceDecimalPlaces);
        this.entryTotal.crTotal = giddhRoundOff(sumBy(this.selectedLedger?.transactions, (tr) => {
            if (tr.type === 'CREDIT') {
                return Number(tr.amount) || 0;
            }
            return 0;
        }), this.giddhBalanceDecimalPlaces);

        this.convertedEntryTotal = {
            drTotal: this.calculateConversionRate(this.entryTotal.drTotal),
            crTotal: this.calculateConversionRate(this.entryTotal.crTotal),
        };
    }

    public onTxnAmountChange(txn: ILedgerTransactionItem) {

        if (!txn.isUpdated) {
            if (this.selectedLedger && this.selectedLedger.taxes && this.selectedLedger.taxes.length && !txn.isTax) {
                txn.isUpdated = true;
            }
        }

        this.generatePanelAmount();

        if (this.stockTrxEntry) {
            this.stockTrxEntry.inventory.rate = giddhRoundOff((Number(this.totalAmount) / this.stockTrxEntry.inventory.quantity), this.ratePrecision);
            this.convertedRate = this.calculateConversionRate(this.stockTrxEntry.inventory.rate, this.ratePrecision);
        }

        if (this.discountComponent) {
            this.discountComponent.ledgerAmount = this.totalAmount;
            this.discountComponent.change();
        }

        this.getEntryTotal();
        this.generateGrandTotal();
        this.generateCompoundTotal();
    }

    // FIXME: fix amount calculation
    public generatePanelAmount() {
        if (this.selectedLedger?.transactions && this.selectedLedger?.transactions?.length) {
            if (this.stockTrxEntry) {
                this.totalAmount = this.stockTrxEntry.amount;
            } else {
                let trx: ILedgerTransactionItem = find(this.selectedLedger.transactions, (t) => {
                    let particular = (t?.selectedAccount?.particular?.parentGroups?.length > 0 && !t?.particular.parentGroups?.length) ? t?.selectedAccount?.particular : t?.particular;
                    let category = this.getAccountCategory(particular, particular?.uniqueName);
                    if (particular?.uniqueName) {
                        return this.isValidCategory(category);
                    }
                });
                this.totalAmount = trx ? Number(trx.amount) : 0;
            }
            this.convertedTotalAmount = this.calculateConversionRate(this.totalAmount);
        }
    }

    private getParticularAccount(): any {
        return (this.selectedLedger?.transactions?.length && this.selectedLedger?.transactions[0]?.particular?.uniqueName === this.activeAccount?.uniqueName) ? this.selectedLedger?.particular : this.selectedLedger?.transactions?.length ? this.selectedLedger?.transactions[0]?.particular : null;
    }

    private getLedgerAccount(particularAccount: any): any {
        return (this.selectedLedger?.particular?.uniqueName === particularAccount?.uniqueName) ? this.activeAccount : this.selectedLedger?.particular;
    }

    public calculateOtherTaxes(modal: SalesOtherTaxesModal) {
        let taxableValue = 0;
        let companyTaxes: TaxResponse[] = [];
        let totalTaxes = 0;

        this.isAdvanceReceiptWithTds = this.isAdvanceReceipt;

        this.companyTaxesList$.pipe(take(1)).subscribe(taxes => companyTaxes = taxes);

        let particularAccount = this.getParticularAccount();
        let ledgerAccount = this.getLedgerAccount(particularAccount);

        if (this.generalService.isReceiptPaymentEntry(ledgerAccount, particularAccount, this.selectedLedger.voucher.shortCode)) {
            this.isPaymentReceipt = true;
        }

        if (modal?.appliedOtherTax && modal?.appliedOtherTax?.uniqueName) {
            let tax = companyTaxes.find(ct => ct?.uniqueName === modal?.appliedOtherTax?.uniqueName);
            if (tax && tax.taxDetail[0]) {
                this.selectedLedger.otherTaxType = ['tcsrc', 'tcspay'].includes(tax.taxType) ? 'tcs' : 'tds';
                totalTaxes += tax.taxDetail[0].taxValue;
            }

            if (this.isPaymentReceipt) {
                let mainTaxPercentage = this.selectedTaxes?.reduce((sum, current) => sum + current.amount, 0);
                let tdsTaxPercentage = null;
                let tcsTaxPercentage = null;

                let transactions = this.selectedLedger?.transactions?.filter(transaction => !transaction?.isTax);
                let totalAmount = (transactions?.length > 0) ? Number(transactions[0].amount) : Number(this.selectedLedger.actualAmount);

                if (this.selectedLedger.otherTaxType === "tcs") {
                    tcsTaxPercentage = totalTaxes;
                    this.isAdvanceReceiptWithTds = false;
                } else if (this.selectedLedger.otherTaxType === "tds") {
                    tdsTaxPercentage = totalTaxes;
                    this.isAdvanceReceiptWithTds = false;
                }

                taxableValue = this.generalService.getReceiptPaymentOtherTaxAmount(modal.tcsCalculationMethod, totalAmount, mainTaxPercentage, tdsTaxPercentage, tcsTaxPercentage);

                this.advanceReceiptAmount = taxableValue;
                this.totalForTax = taxableValue;

                const totalPercentage = this.selectedTaxes.reduce((pv, cv) => {
                    return pv + cv.amount;
                }, 0);
                this.taxTrxTotal = (taxableValue * totalPercentage) / 100;

                if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                    taxableValue = (taxableValue + this.taxTrxTotal);
                }
            } else {
                this.isPaymentReceipt = false;
                const amount = (this.isAdvanceReceipt) ? this.advanceReceiptAmount : this.totalAmount;
                if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
                    taxableValue = Number(amount) - this.discountTrxTotal;
                } else if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                    let rawAmount = Number(amount) - this.discountTrxTotal;
                    taxableValue = (rawAmount + this.taxTrxTotal);
                }
            }
            this.selectedLedger.tdsTcsTaxesSum = giddhRoundOff(((taxableValue * totalTaxes) / 100), this.giddhBalanceDecimalPlaces);
        } else {
            this.selectedLedger.tdsTcsTaxesSum = 0;
            this.selectedLedger.isOtherTaxesApplicable = false;
            this.selectedLedger.otherTaxModal = new SalesOtherTaxesModal();
        }

        this.selectedLedger.otherTaxModal = modal;
        this.selectedLedger.tcsCalculationMethod = modal.tcsCalculationMethod;
        this.selectedLedger.otherTaxesSum = giddhRoundOff((this.selectedLedger.tdsTcsTaxesSum), this.giddhBalanceDecimalPlaces);

        if (this.isPaymentReceipt && this.initialLoad) {
            this.initialLoad = false;
            this.generatePanelAmount();
            this.inventoryAmountChanged();
        }
    }

    // FIXME: fix total calculation
    public generateGrandTotal() {
        let taxTotal: number = sumBy(this.selectedTaxes, 'amount') || 0;
        let total = this.totalAmount - this.discountTrxTotal;
        this.appliedTaxPerTotal = taxTotal;
        this.totalForTax = total;
        let particularAccount = this.getParticularAccount();
        let ledgerAccount = this.getLedgerAccount(particularAccount);

        const isExportValid = this.checkIfExportIsValid();

        if (this.isAdvanceReceipt || this.generalService.isReceiptPaymentEntry(ledgerAccount, particularAccount, this.selectedLedger.voucher.shortCode)) {
            this.taxTrxTotal = giddhRoundOff(this.getInclusiveTax(), this.giddhBalanceDecimalPlaces);
            this.advanceReceiptAmount = giddhRoundOff(this.totalAmount - this.taxTrxTotal, this.giddhBalanceDecimalPlaces);
            this.grandTotal = giddhRoundOff((this.advanceReceiptAmount + (!isExportValid ? this.taxTrxTotal : 0)), this.giddhBalanceDecimalPlaces);
        } else {
            if (this.isRcmEntry) {
                taxTotal = 0;
            }
            this.taxTrxTotal = giddhRoundOff(((total * taxTotal) / 100), this.giddhBalanceDecimalPlaces);
            this.grandTotal = giddhRoundOff((total + (!isExportValid ? this.taxTrxTotal : 0)), this.giddhBalanceDecimalPlaces);
        }
        this.convertedTaxTrxTotal = this.calculateConversionRate(this.taxTrxTotal);
        this.convertedGrandTotal = this.calculateConversionRate(this.grandTotal);

        this.calculateOtherTaxes(this.selectedLedger.otherTaxModal);
    }

    public generateCompoundTotal() {
        if (this.entryTotal.crTotal > this.entryTotal.drTotal) {
            this.compoundTotal = giddhRoundOff((this.entryTotal.crTotal - this.entryTotal.drTotal), this.giddhBalanceDecimalPlaces);
        } else {
            this.compoundTotal = giddhRoundOff((this.entryTotal.drTotal - this.entryTotal.crTotal), this.giddhBalanceDecimalPlaces);
        }
        this.convertedCompoundTotal = this.calculateConversionRate(this.compoundTotal);
        this.compundTotalObserver.next(this.compoundTotal);
    }

    public getUniqueName(txn: ILedgerTransactionItem) {
        if (txn?.selectedAccount?.stock) {
            return txn.particular?.uniqueName.split('#')[0];
        } else if (txn?.inventory?.stock) {
            return txn.particular?.uniqueName.split('#')[0];
        }
        return txn?.particular?.uniqueName;
    }

    public inventoryQuantityChanged(val: any) {
        // if val is typeof string change event should be fired and if not then paste event should be fired
        if (typeof val !== 'string') {
            let tempVal = val.clipboardData.getData('text/plain');
            if (Number.isNaN(Number(tempVal))) {
                val.stopImmediatePropagation();
                val.preventDefault();
                return;
            }
            val = tempVal;
        }

        if (Number(this.stockTrxEntry.inventory.rate * val) !== this.stockTrxEntry.amount) {
            this.stockTrxEntry.isUpdated = true;
        }
        this.stockTrxEntry.amount = Number(this.stockTrxEntry.inventory.rate * val);

        this.getEntryTotal();
        this.generatePanelAmount();

        if (this.discountComponent) {
            this.discountComponent.ledgerAmount = this.totalAmount;
            this.discountComponent.change();
        }

        this.generateGrandTotal();
        this.generateCompoundTotal();
    }

    public inventoryPriceChanged(val: any) {
        if (Number(val * this.stockTrxEntry.inventory.quantity) !== this.stockTrxEntry.amount) {
            this.stockTrxEntry.isUpdated = true;
        }

        this.convertedRate = this.calculateConversionRate(val);
        this.stockTrxEntry.amount = giddhRoundOff(val * this.stockTrxEntry.inventory.quantity, this.giddhBalanceDecimalPlaces);
        this.stockTrxEntry.convertedAmount = this.calculateConversionRate(this.stockTrxEntry.amount);

        this.getEntryTotal();
        this.generatePanelAmount();

        if (this.discountComponent) {
            this.discountComponent.ledgerAmount = this.totalAmount;
            this.discountComponent.change();
        }

        this.generateGrandTotal();
        this.generateCompoundTotal();
    }

    public inventoryAmountChanged() {
        this.convertedTotalAmount = this.calculateConversionRate(this.totalAmount);
        if (this.stockTrxEntry) {
            if (this.stockTrxEntry.amount !== giddhRoundOff(Number(this.totalAmount), this.giddhBalanceDecimalPlaces)) {
                this.stockTrxEntry.isUpdated = true;
            }
            this.stockTrxEntry.amount = giddhRoundOff(Number(this.totalAmount), this.giddhBalanceDecimalPlaces);
            this.stockTrxEntry.convertedAmount = this.calculateConversionRate(this.stockTrxEntry.amount);

            this.stockTrxEntry.inventory.rate = giddhRoundOff((Number(this.totalAmount) / this.stockTrxEntry.inventory.quantity), this.ratePrecision);
            this.convertedRate = this.calculateConversionRate(this.stockTrxEntry.inventory.rate, this.ratePrecision);

            // update every transaction conversion rates for multi-currency
            this.selectedLedger?.transactions?.filter(f => f.particular?.uniqueName !== this.stockTrxEntry.particular?.uniqueName).map(trx => {
                trx.convertedAmount = this.calculateConversionRate(trx.amount);
                return trx;
            });
        } else {

            // update every transaction conversion rates for multi-currency
            if (this.selectedLedger?.transactions && this.selectedLedger?.transactions?.length > 0) {
                this.selectedLedger.transactions = this.selectedLedger.transactions.map((t, i) => {
                    let category = this.getAccountCategory(t?.particular, t?.particular?.uniqueName);

                    // find account that's from category income || expenses || fixed assets and update it's amount too
                    if (category && this.isValidCategory(category) && !t.isTax) {
                        if (i === 0) {
                            t.amount = giddhRoundOff(Number(this.totalAmount), this.giddhBalanceDecimalPlaces);
                        }
                        t.isUpdated = true;
                    }
                    t.convertedAmount = this.calculateConversionRate(t.amount);
                    return t;
                });
            }
        }

        this.getEntryTotal();

        if (this.discountComponent) {
            this.discountComponent.ledgerAmount = this.totalAmount;
            this.discountComponent.change();
        }

        this.generateGrandTotal();
        this.generateCompoundTotal();
    }

    public inventoryTotalChanged() {
        let fixDiscount = 0;
        let percentageDiscount = 0;

        if (this.discountComponent) {
            percentageDiscount = this.discountComponent.discountAccountsDetails?.filter(f => f.isActive)
                ?.filter(s => s.discountType === 'PERCENTAGE')
                .reduce((pv, cv) => {
                    return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
                }, 0) || 0;

            fixDiscount = this.discountComponent.discountAccountsDetails?.filter(f => f.isActive)
                ?.filter(s => s.discountType === 'FIX_AMOUNT')
                .reduce((pv, cv) => {
                    return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
                }, 0) || 0;
        }

        let taxTotal: number = sumBy(this.selectedTaxes, 'amount') || 0;
        const particularAccount = this.getParticularAccount();
        const ledgerAccount = this.getLedgerAccount(particularAccount);
        if (this.isAdvanceReceipt || this.isRcmEntry || this.generalService.isReceiptPaymentEntry(ledgerAccount, particularAccount, this.selectedLedger?.voucher?.shortCode)) {
            this.totalAmount = this.grandTotal;
            this.generateGrandTotal();
        } else {
            this.totalAmount = giddhRoundOff(Number(((Number(this.grandTotal) + fixDiscount + 0.01 * fixDiscount * Number(taxTotal)) / (1 - 0.01 * percentageDiscount + 0.01 * Number(taxTotal) - 0.0001 * percentageDiscount * Number(taxTotal)))), this.giddhBalanceDecimalPlaces);
        }

        this.convertedTotalAmount = this.calculateConversionRate(this.totalAmount);

        if (this.stockTrxEntry) {
            this.stockTrxEntry.amount = this.totalAmount;
            this.stockTrxEntry.convertedAmount = this.calculateConversionRate(this.stockTrxEntry.amount);

            const rate = giddhRoundOff(Number(this.stockTrxEntry.amount / this.stockTrxEntry.inventory.quantity), this.ratePrecision);
            this.stockTrxEntry.inventory.rate = rate;
            this.convertedRate = this.calculateConversionRate(this.stockTrxEntry.inventory.rate, this.ratePrecision);
            this.stockTrxEntry.isUpdated = true;

            if (this.discountComponent) {
                this.discountComponent.ledgerAmount = this.totalAmount;
                this.discountComponent.change();
            }
        } else {
            // find account that's from category income || expenses || fixed assets
            let trx: ILedgerTransactionItem = find(this.selectedLedger?.transactions, (t) => {
                let category = this.getAccountCategory(t?.particular, t?.particular?.uniqueName);
                return !t?.isTax && this.isValidCategory(category);
            });
            if (trx) {
                trx.amount = this.totalAmount;
                trx.convertedAmount = this.calculateConversionRate(trx.amount);
                trx.isUpdated = true;
            }

            if (this.discountComponent) {
                this.discountComponent.ledgerAmount = this.totalAmount;
                this.discountComponent.change();
            }
        }

        this.getEntryTotal();
        this.generateCompoundTotal();
    }

    public unitChanged(stockUnitUniqueName: string) {
        let unit = this.stockTrxEntry.unitRate.find(p => p.stockUnitUniqueName === stockUnitUniqueName);
        const unitRate = giddhRoundOff(unit.rate / (this.selectedLedger?.exchangeRate ?? 1), this.ratePrecision);
        this.stockTrxEntry.inventory.unit = { code: unit.stockUnitCode, rate: unitRate, stockUnitCode: unit.stockUnitCode, uniqueName: unit.stockUnitUniqueName };
        this.stockTrxEntry.inventory.rate = this.stockTrxEntry.inventory.unit.rate;
        this.inventoryPriceChanged(Number(this.stockTrxEntry.inventory.unit.rate));
    }

    public taxTrxUpdated(taxes: UpdateLedgerTaxData[]) {
        this.selectedTaxes = taxes;
        this.generateGrandTotal();
        this.generateCompoundTotal();
    }

    public reInitilizeDiscount(resp: LedgerResponse) {
        let discountArray: LedgerDiscountClass[] = [];
        let defaultDiscountIndex = resp.discounts?.findIndex(f => !f.discount?.uniqueName);

        if (defaultDiscountIndex > -1) {
            discountArray.push({
                discountType: resp.discounts[defaultDiscountIndex].discount?.discountType,
                amount: resp.discounts[defaultDiscountIndex]?.amount,
                discountValue: resp.discounts[defaultDiscountIndex].discount?.discountValue,
                discountUniqueName: resp.discounts[defaultDiscountIndex].discount?.uniqueName,
                name: resp.discounts[defaultDiscountIndex].discount?.name,
                particular: resp.discounts[defaultDiscountIndex].account?.uniqueName,
                isActive: true
            });
        } else {
            discountArray.push({
                discountType: 'FIX_AMOUNT',
                amount: 0,
                name: '',
                particular: '',
                isActive: true,
                discountValue: 0
            });
        }

        resp.discounts.forEach((f, index) => {
            if (index !== defaultDiscountIndex) {
                discountArray.push({
                    discountType: f.discount?.discountType,
                    amount: f.discount?.discountValue,
                    name: f.discount?.name,
                    particular: f.account?.uniqueName,
                    isActive: true,
                    discountValue: f.discount?.discountValue,
                    discountUniqueName: f.discount?.uniqueName
                });
            }
        });
        this.discountArray = discountArray;
    }

    public prepare4Submit(): LedgerResponse {
        let requestObj: any = cloneDeep(this.selectedLedger);
        let discounts: LedgerDiscountClass[] = cloneDeep(this.discountArray);
        let taxes: UpdateLedgerTaxData[] = cloneDeep(this.selectedTaxes);

        requestObj.voucherType = requestObj?.voucher?.shortCode;
        requestObj.transactions = requestObj?.transactions ? requestObj.transactions.filter(p => p.particular?.uniqueName && !p.isDiscount) : [];
        requestObj.generateInvoice = this.selectedLedger?.generateInvoice;

        requestObj?.transactions.map(trx => {
            if (trx.inventory && trx.inventory.stock) {
                trx.particular.uniqueName = trx.particular?.uniqueName.split('#')[0];
            }
        });
        requestObj.taxes = [...taxes.map(t => t.particular?.uniqueName)];

        if (requestObj.isOtherTaxesApplicable) {
            requestObj.taxes.push(requestObj.otherTaxModal.appliedOtherTax?.uniqueName);
        }

        requestObj.discounts = discounts?.filter(p => p.amount && p.isActive).map(m => {
            m.amount = m.discountValue;
            return m;
        });

        this.getEntryTotal();
        requestObj.total = this.entryTotal.drTotal - this.entryTotal.crTotal;
        return requestObj;
    }

    public getUnderstandingText(selectedLedgerAccountType, accountName, localeData?: any) {
        let underStandingTextData = localeData?.text_data;
        if (underStandingTextData) {
            let data = _.cloneDeep(underStandingTextData?.find(p => p.accountType === selectedLedgerAccountType));
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

    public resetVM() {
        this.selectedLedger = null;
        this.taxRenderData = [];
        this.selectedTaxes = [];
        this.discountArray = [];
    }

    /**
     * Calculates conversion rate
     *
     * @param {*} baseModel Value to be converted
     * @param {number} [customDecimalPlaces] Optional custom decimal places (required for Rate as 4 digits are required for rate)
     * @returns Converted rate
     * @memberof UpdateLedgerVm
     */
    public calculateConversionRate(baseModel: any, customDecimalPlaces?: number): number {
        if (!baseModel || !this.selectedLedger?.exchangeRate) {
            return 0;
        }
        if (this.selectedCurrencyForDisplay === 0) {
            return giddhRoundOff(baseModel * this.selectedLedger?.exchangeRate, (customDecimalPlaces) ? customDecimalPlaces : this.giddhBalanceDecimalPlaces);
        } else {
            return giddhRoundOff(baseModel / this.selectedLedger?.exchangeRate, (customDecimalPlaces) ? customDecimalPlaces : this.giddhBalanceDecimalPlaces);
        }
    }

    /**
     * Calculates the inclusive tax rate for advance receipt
     *
     * @private
     * @returns {number} Inclusive tax rate
     * @memberof UpdateLedgerVm
     */
    private getInclusiveTax(): number {
        const totalPercentage = this.selectedTaxes.reduce((pv, cv) => {
            return pv + cv.amount;
        }, 0);
        return (this.totalAmount * totalPercentage) / (100 + totalPercentage);
    }

    /**
     * Returns boolean if export case is valid/invalid
     *
     * @returns {boolean}
     * @memberof UpdateLedgerVm
     */
    public checkIfExportIsValid(): boolean {
        const data = {
            isMultiCurrency: this.isMultiCurrencyAvailable,
            voucherType: this.selectedLedger?.voucher?.shortCode,
            particularAccount: this.getParticularAccount(),
            ledgerAccount: this.activeAccount
        };

        return this.ledgerUtilityService.checkIfExportIsValid(data);
    }

    /**
     * Updates entry amount if manually updated
     *
     * @memberof UpdateLedgerVm
     */
    public updateFirstEntryAmount(): void {
        if (this.selectedLedger?.transactions && this.selectedLedger?.transactions?.length > 0) {
            this.selectedLedger.transactions = this.selectedLedger.transactions.map(transaction => {
                if (transaction?.particular?.uniqueName && !transaction?.isTax) {
                    transaction.amount = giddhRoundOff(Number(this.totalAmount), this.giddhBalanceDecimalPlaces);
                }
                return transaction;
            });
        }
    }
}
