import { cloneDeep, forEach, isNull, pick } from '../../lodash-optimized';
import { LedgerDiscountClass } from './SettingsDiscount';
import { IVariant, LedgerResponseDiscountClass } from './Ledger';
import { giddhRoundOff } from '../../shared/helpers/helperFunctions';
import { INameUniqueName } from '../interfaces/name-unique-name.interface';
import * as dayjs from 'dayjs';
import { VoucherAdjustments } from './AdvanceReceiptsAdjust';
import { ReferenceVoucher } from '../../ledger/ledger.vm';
import { HIGH_RATE_FIELD_PRECISION, IOption } from '../../app.constant';
import { ITaxControlData } from '../interfaces/tax.interface';


/**
 * VoucherTypeEnum enumeration
 * Defines constant values for VoucherTypeEnum
 */
export enum VoucherTypeEnum {
    sales = 'sales',
    purchase = 'purchase',
    debitNote = 'debit note',
    creditNote = 'credit note',
    proforma = 'proforma',
    generateProforma = 'proformas',
    estimate = 'estimate',
    generateEstimate = 'estimates',
    cash = 'cash',
    receipt = 'receipt',
    payment = 'payment',
    cashDebitNote = 'cash debit note',
    cashCreditNote = 'cash credit note',
    cashBill = 'cash bill',
    purchaseOrder = 'purchase-order',
    invoice = 'invoice',
    voucher = 'voucher',
    purchase_bill = 'purchase_bill',
    purchase_order = 'purchase_order'
};

/**
 * TemplateTypeEnum enumeration
 * Defines constant values for TemplateTypeEnum
 */
export enum TemplateTypeEnum {
    GstTemplateA = 'gst_template_a',
    TallyTemplate = 'tally_template',
    ThermalTemplate = 'thermal_template'
}

/**
 * TemplateModeEnum enumeration
 * Defines constant values for TemplateModeEnum
 */
export enum TemplateModeEnum {
    Create = 'create',
    Edit = 'edit',
    Update = 'update'
}

/**
 * ActionTypeAfterVoucherGenerateOrUpdate enumeration
 * Defines constant values for ActionTypeAfterVoucherGenerateOrUpdate
 */
export enum ActionTypeAfterVoucherGenerateOrUpdate {
    generate,
    generateAndClose,
    generateAndSend,
    generateAndPrint,
    generateAndRecurring,
    updateSuccess,
    saveAsDraft
}

/**
 * IMP by dude
 * do not change
 * changing below const breaks the generate functionality
 */
export const VOUCHER_TYPE_LIST: any[] = [
    {
        value: VoucherTypeEnum.sales,
        label: 'Sales',
        additional: {
            label: 'Sales'
        }
    },
    {
        value: VoucherTypeEnum.creditNote,
        label: 'Credit Note',
        additional: {
            label: 'Credit Note'
        }
    },
    {
        value: VoucherTypeEnum.debitNote,
        label: 'Debit Note',
        additional: {
            label: 'Debit Note'
        }
    },
    {
        value: VoucherTypeEnum.purchase,
        label: 'Purchase',
        additional: {
            label: 'Purchase'
        }
    },
    {
        value: VoucherTypeEnum.generateProforma,
        label: 'Proforma',
        additional: {
            label: 'Proforma'
        }
    },
    {
        value: VoucherTypeEnum.generateEstimate,
        label: 'Estimate',
        additional: {
            label: 'Estimate (Beta)'
        }
    },
    {
        value: VoucherTypeEnum.cashCreditNote,
        label: 'Cash Credit Note',
        additional: {
            label: 'Cash Credit Note'
        }
    },
    {
        value: VoucherTypeEnum.cashDebitNote,
        label: 'Cash Debit Note',
        additional: {
            label: 'Cash Debit Note'
        }
    },
    {
        value: VoucherTypeEnum.cashBill,
        label: 'Cash Bill',
        additional: {
            label: 'Cash Bill'
        }
    }
];

/**
 * IStockUnit interface definition
 * Defines the structure and contract for IStockUnit objects
 */
export interface IStockUnit {
    text: string;
    id: string;
    rate?: number;
}

/**
 * IForceClear interface definition
 * Defines the structure and contract for IForceClear objects
 */
export interface IForceClear {
    status: boolean;
}

/**
 * draw invoice on ui and api model related class and interface
 */
class CompanyDetailsClass {
    public name: string;
    public gstNumber: string;
    public address: string[];
    public state: StateCode;
    public panNumber: string;
}

/**
 * GstDetailsClass class
 * Implements GstDetailsClass functionality
 */
export class GstDetailsClass {
    public index?: number;
    public gstNumber?: any;
    public address: string[];
    public state?: StateCode;
    public county?: CountyCode;
    public panNumber?: any;
    public countryName?: string;
    /*Keeping both as API team is too confused to Map one variable type
    *thus kept both whichever is needed on run time we can send that in request mapping.
    * */
    public stateCode?: string;
    public stateName?: string;
    public pincode?: string;
    public taxNumber?: string;
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.address = [];
        this.index = 0;
        this.state = new StateCode();
        this.county = new CountyCode();
    }
}
/**
 * CountyCode class
 * Implements CountyCode functionality
 */
export class CountyCode {
    name: string;
    code: string;
}
/**
 * CurrencyClass class
 * Implements CurrencyClass functionality
 */
class CurrencyClass {
    public code: string;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(attrs?: any) {
        /**
         * Handles if functionality
         */
        if (attrs) {
            this.code = attrs.currency;
        } else {
            this.code = "IN";
        }
    }
}

/**
 * AccountDetailsClass class
 * Implements AccountDetailsClass functionality
 */
export class AccountDetailsClass {
    public name: string;
    public uniqueName: string;
    public data?: string[];
    public address?: string[];
    public attentionTo?: string;
    public email: string;
    public contactNumber?: any;
    public mobileNo?: any;
    public billingDetails: GstDetailsClass;
    public shippingDetails: GstDetailsClass;
    public country?: CountryClass;
    public currency?: CurrencyClass;
    public currencySymbol: string = '';
    public currencyCode?: string = '';
    public customerName: string;
    public mobileNumber?: string;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(attrs?: any) {
        this.currency = new CurrencyClass(attrs);
        this.billingDetails = new GstDetailsClass();
        this.shippingDetails = new GstDetailsClass();
        /**
         * Handles if functionality
         */
        if (attrs) {
            /**
             * Handles if functionality
             */
            if (attrs.currencySymbol) {
                this.currencySymbol = attrs.currencySymbol;
            }
            /**
             * Handles if functionality
             */
            if (attrs.currency) {
                this.currencyCode = attrs.currency;
            }
            Object.assign(this, pick(attrs, ['name', 'uniqueName', 'email', 'attentionTo']));
            this.contactNumber = attrs.mobileNo || '';
            this.mobileNumber = attrs.mobileNo || '';
            this.email = attrs.email || '';
            this.customerName = attrs.updatedBy.name || '';
            /**
             * Handles if functionality
             */
            if (attrs.country) {
                this.country = new CountryClass(attrs.country);
            }
            /**
             * Handles if functionality
             */
            if (attrs.addresses?.length > 0) {
                let str = isNull(attrs.addresses[0].address) ? '' : attrs.addresses[0].address;
                // set billing
                this.billingDetails.address = [];
                this.billingDetails.address.push(str);
                this.billingDetails.state.code = (attrs.addresses[0].state) ?
                    (attrs.addresses[0].state.code) ? attrs.addresses[0].state.code : attrs.addresses[0].state.stateGstCode
                    : attrs.addresses[0].stateCode;
                this.billingDetails.county.code = attrs.addresses[0]?.county?.code;
                this.billingDetails.county.name = attrs.addresses[0].county?.name;
                this.billingDetails.state.name = attrs.addresses[0].stateName;

                this.billingDetails.gstNumber = attrs.addresses[0].gstNumber;
                this.billingDetails.taxNumber = attrs.addresses[0].gstNumber;
                this.billingDetails.pincode = attrs.addresses[0].pincode;
                this.billingDetails.panNumber = '';
                // set shipping
                this.shippingDetails.address = [];
                this.shippingDetails.address.push(str);
                this.shippingDetails.state.code = (attrs.addresses[0].state) ?
                    (attrs.addresses[0].state.code) ? attrs.addresses[0].state.code : attrs.addresses[0].state.stateGstCode
                    : attrs.addresses[0].stateCode;
                this.shippingDetails.county.code = attrs.addresses[0].county?.code;
                this.shippingDetails.county.name = attrs.addresses[0]?.county?.name;
                this.shippingDetails.state.name = attrs.addresses[0].stateName;
                this.shippingDetails.gstNumber = attrs.addresses[0].gstNumber;
                this.shippingDetails.taxNumber = attrs.addresses[0].gstNumber;
                this.shippingDetails.pincode = attrs.addresses[0].pincode;
                this.shippingDetails.panNumber = '';
            }
        } else {
            this.email = '';
        }
    }
}

/**
 * ICommonItemOfTransaction class
 * Implements ICommonItemOfTransaction functionality
 */
class ICommonItemOfTransaction {
    public amount: number;
    public convertedAmount: number;
    public accountUniqueName: string;
    public accountName: string;
}

/**
 * ITaxList interface definition
 * Defines the structure and contract for ITaxList objects
 */
export interface ITaxList {
    name: string;
    uniqueName: string;
    amount: number;
    isChecked: boolean;
    isDisabled?: boolean;
    type?: string;
}

/**
 * SalesTransactionItemClass class
 * Implements SalesTransactionItemClass functionality
 */
export class SalesTransactionItemClass extends ICommonItemOfTransaction {
    public discount: any[];
    public hsnOrSac: string;
    public hsnNumber: string;
    public sacNumber: string;
    public sacNumberExists?: boolean;
    public description: string;
    public quantity: number;
    public stockUnit: string;
    public stockUnitCode?: string;
    public rate: number;
    public date: any;
    public taxableValue: number;
    public total?: number;
    public convertedTotal?: number;
    public fakeAccForSelect2?: string;
    public isStockTxn?: boolean;
    public stockDetails?: any;
    public stockList?: IStockUnit[] = [];
    public applicableTaxes: string[] = [];
    public taxRenderData: ITaxList[] = [];
    public sku_and_customfields?: string;
    public requiredTax?: boolean;
    public maxQuantity?: number;
    public purchaseOrderItemMapping?: { uniqueName: string; entryUniqueName: any; };
    public showCodeType: string;
    public highPrecisionAmount?: number;
    /* Rate should have precision up to 16 digits for better calculation */
    public highPrecisionRate = HIGH_RATE_FIELD_PRECISION;
    /** Stores the selected stock variant */
    public variant: IVariant;
    public taxInclusive: boolean;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        /**
         * Handles super functionality
         */
        super();
        this.amount = 0;
        this.total = 0;
        this.isStockTxn = false;
        this.hsnOrSac = 'hsn';
        this.taxableValue = 0;
        this.showCodeType = "";
        this.variant = { name: '', uniqueName: '' };
    }

    // basic check for valid transaction
    /**
     * Handles isValid functionality
     */
    public isValid() {
        return !!this.accountUniqueName;
    }

    /**
     * Sets amount value
     */
    public setAmount(entry: SalesEntryClass) {
        this.taxableValue = this.getTaxableValue(entry);
        let tax = this.getTotalTaxOfEntry(entry.taxes);
        this.total = this.getTransactionTotal(tax, entry);
    }

    /**
     * Retrieves totaltaxofentry data
     */
    public getTotalTaxOfEntry(taxArr: ITaxControlData[]): number {
        let count: number = 0;
        /**
         * Handles if functionality
         */
        if (taxArr?.length > 0) {
            /**
             * Handles forEach functionality
             */
            forEach(taxArr, (item: ITaxControlData) => {
                count += item.amount;
            });
            return this.checkForInfinity(count);
        } else {
            return count;
        }
    }

    /**
     * Handles checkForInfinity functionality
     */
    public checkForInfinity(value): number {
        /**
         * Handles return functionality
         */
        return (value === Infinity) ? 0 : value;
    }

    /**
     * Retrieves transactiontotal data
     */
    public getTransactionTotal(tax: number, entry: SalesEntryClass): number {
        let count: number = 0;
        /**
         * Handles if functionality
         */
        if (tax > 0) {
            let a = this.getTaxableValue(entry) * (tax / 100);
            a = this.checkForInfinity(a);
            let b = cloneDeep(this.getTaxableValue(entry));
            count = a + b;
        } else {
            count = cloneDeep(this.getTaxableValue(entry));
        }
        return giddhRoundOff(count, this.highPrecisionRate);
    }

    /**
     * @param entry: SalesEntryClass object
     * @return taxable value after calculation
     * @scenerio one -- without stock entry -- amount - discount = taxableValue
     * @scenerio two -- stock entry { rate*qty -(discount) = taxableValue}
     */
    public getTaxableValue(entry: SalesEntryClass): number {
        let count: number = 0;
        /**
         * Handles if functionality
         */
        if (this.quantity && this.rate) {
            this.amount = this.rate * this.quantity;
            count = this.checkForInfinity((this.rate * this.quantity) - entry.discountSum);
        } else {
            count = this.checkForInfinity(this.amount - entry.discountSum);
        }
        return count;
    }
}

/**
 * SalesEntryClass class
 * Implements SalesEntryClass functionality
 */
export class SalesEntryClass {
    public uniqueName: string;
    public discounts: LedgerDiscountClass[];
    public tradeDiscounts?: LedgerResponseDiscountClass[];
    public taxes: ITaxControlData[] = [];
    public transactions: SalesTransactionItemClass[];
    public description: string;
    public taxableValue: number;
    public discountTotal: number;
    public nonTaxableValue: number;
    public entryDate: any;
    public taxList?: string[];
    public voucherType: string;
    public entryTotal: number;
    public taxSum?: number;
    public discountSum?: number;
    public attachedFile?: string;
    public attachedFileName?: string;
    public isNewEntryInUpdateMode?: boolean;
    public isOtherTaxApplicable: boolean = false;
    public otherTaxSum: number;
    public otherTaxType: 'tcs' | 'tds' | undefined;
    public cessSum: number;
    public otherTaxModal: SalesOtherTaxesModal;
    public tcsCalculationMethod: SalesOtherTaxesCalculationMethodEnum;
    public tcsTaxList?: string[];
    public tdsTaxList?: string[];
    public purchaseOrderItemMapping?: { uniqueName: string; entryUniqueName: any; };
    public discountFixedValueModal?: number;
    public discountPercentageModal?: number;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.transactions = [new SalesTransactionItemClass()];
        this.entryDate = dayjs().toDate();
        this.taxes = [];
        this.taxList = [];
        this.discounts = [this.staticDefaultDiscount()];
        this.tradeDiscounts = [];
        this.taxSum = 0;
        this.discountSum = 0;
        this.isOtherTaxApplicable = false;
        this.otherTaxSum = 0;
        this.otherTaxType = 'tcs';
        this.otherTaxModal = new SalesOtherTaxesModal();
        this.cessSum = 0;
        this.purchaseOrderItemMapping = { uniqueName: '', entryUniqueName: '' };
    }

    /**
     * Handles staticDefaultDiscount functionality
     */
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

/**
 * CountryClass class
 * Implements CountryClass functionality
 */
class CountryClass {
    public countryName: string;
    public countryCode: string;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(attrs?: any) {
        /**
         * Handles if functionality
         */
        if (attrs) {
            return Object.assign({}, this, attrs);
        }
    }
}

/**
 * OtherSalesItemClass class
 * Implements OtherSalesItemClass functionality
 */
export class OtherSalesItemClass {
    public shippingDate: any;
    public shippedVia: string;
    public trackingNumber: string;
    public customField1: string;
    public customField2: string;
    public customField3: string;
    public message1?: string;
    public message2?: string;
    public slogan?: any;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() { }
}

/**
 * end draw invoice on ui and api model related class and interface
 */

// generate sales interface

interface IPaymentAction {
    action?: string;
    amount: number;
}

/**
 * Generic Request type interface for vouchers and purchase record
 *
 * @export
 * @interface GenericRequest
 */
export interface GenericRequest {
    account?: AccountDetailsClass;
    number?: string;
    entries?: any[];
    date?: string;
    dueDate?: string;
    type?: string;
}

/**
 * Generic request class to generate sales, credit note, debit note
 */

export interface GenericRequestForGenerateSCD extends GenericRequest {
    entryUniqueNames?: string[];
    taxes?: string[];
    voucher: VoucherClass;
    updateAccountDetails?: boolean;
    paymentAction?: IPaymentAction;
    depositAccountUniqueName?: string;
    isEcommerceInvoice?: boolean;
    validateTax?: boolean;
    applyApplicableTaxes?: boolean;
    action?: string;
    oldVersions?: any[];
    entries?: SalesEntryClassMulticurrency[],
    exchangeRate?: number,
    uniqueName?: string,
    templateDetails?: TemplateDetailsClass
    deposit?: AmountClassMulticurrency;
    roundOffApplicable?: boolean;
    roundOffTotal?: AmountMulticurrency;
    warehouse?: any;
    account?: any;
    subVoucher?: string;
    touristSchemeApplicable?: boolean;
    passportNumber?: string;
    voucherAdjustments?: VoucherAdjustments;
    attachedFileName?: string;
    attachedFiles?: Array<string>;
    einvoiceGenerated?: boolean;
}

/**
 * Interface for purchase record request object
 *
 * @export
 * @interface PurchaseRecordRequest
 * @extends {GenericRequest}
 */
export interface PurchaseRecordRequest extends GenericRequest {
    // TODO: Add additional properties once the update flow is also supported for purchase record
    updateAccountDetails?: boolean;
    attachedFiles?: Array<string>;
    entries?: SalesEntryClass[];
    templateDetails?: TemplateDetailsClass;
    purchaseOrders?: Array<any>;
    purchaseBillCompany?: any;
}

/**
 * VoucherDetailsClass class
 * Implements VoucherDetailsClass functionality
 */
export class VoucherDetailsClass {
    public voucherNumber?: string;
    public proformaNumber?: string;
    public estimateNumber?: string;
    public voucherDate?: any;
    public proformaDate?: any;
    public estimateDate?: any;
    public dueDate?: any;
    public balance?: any;
    public deposit?: any;
    public balanceDue?: number;
    public convertedBalanceDue?: number;
    public balanceStatus?: string;
    public totalAsWords: string;
    public grandTotal: number;
    public grantTotalAmountForCompany?: number;
    public subTotal: number;
    public totalDiscount?: any;
    public gstTaxesTotal?: any;
    public totalTaxableValue?: number;
    public customerName?: any;
    public customerUniquename?: any;
    public tempCustomerName?: any;
    public voucherType?: string;
    public tcsTotal?: number;
    public tdsTotal?: number;
    public cessTotal?: number;
    public taxesTotal?: [];
    public totalDepositAmount?: number;
    public cashInvoice?: string;
    public invoiceLinkingRequest?: IInvoiceLinkingRequest;
    public currencySymbol: string;
    public currency: Currency;
    public exchangeRate?: number;
    public referenceVoucher?: ReferenceVoucher;
    public gainLoss?: number;
    public voucherUniqueName?: string;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.customerName = null;
        this.grandTotal = 0;
        this.subTotal = 0;
        this.totalAsWords = null;
        this.totalDiscount = 0;
        this.totalTaxableValue = 0;
        this.gstTaxesTotal = 0;
        this.voucherDate = null;
        this.balanceDue = 0;
        this.cessTotal = 0;
        this.tdsTotal = 0;
        this.tcsTotal = 0;
        this.balanceDue = 0;
        this.deposit = 0;
        this.totalDepositAmount = 0;
    }
}

/** Model invoice linking request */
/**
 * IInvoiceLinkingRequest class
 * Implements IInvoiceLinkingRequest functionality
 */
export class IInvoiceLinkingRequest {
    public linkedInvoices: ILinkedInvoice[];
}

/** Model linked invoice */
/**
 * ILinkedInvoice class
 * Implements ILinkedInvoice functionality
 */
export class ILinkedInvoice {
    public invoiceUniqueName: string;
    public invoiceNumber?: string;
    public voucherType: string;
}

/**
 * TemplateDetailsClass class
 * Implements TemplateDetailsClass functionality
 */
export class TemplateDetailsClass {
    public logoPath?: string;
    public other: OtherSalesItemClass;
    public templateUniqueName?: string;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.other = new OtherSalesItemClass();
    }
}

/**
 * AmountMulticurrency class
 * Implements AmountMulticurrency functionality
 */
export class AmountMulticurrency {
    public amountForAccount: number;
    public amountForCompany: number;
}

/**
 * VoucherClass class
 * Implements VoucherClass functionality
 */
export class VoucherClass {
    public voucherDetails: VoucherDetailsClass;
    public companyDetails: CompanyDetailsClass;
    public accountDetails: AccountDetailsClass;
    public templateDetails: TemplateDetailsClass;
    public entries: SalesEntryClass[];
    public depositEntry?: SalesEntryClass; // depreciated but using for old data
    public depositEntryToBeUpdated?: SalesEntryClass;
    public depositAccountUniqueName: string;
    public templateUniqueName?: string;
    public touristSchemeApplicable?: boolean;
    public passportNumber?: string;
    public number?: string;
    public subVoucher?: string;
    public voucherAdjustments?: VoucherAdjustments;
    public subTotal?: AmountClassMulticurrency
    public roundOffTotal?: AmountMulticurrency;
    public warehouse?: any;
    public account?: any;
    public attachedFileName?: string;
    public attachedFiles?: Array<string>;
    public purchaseOrderDetails?: any;
    public deposit?: any;
    public exchangeRate?: number;
    public einvoiceGenerated?: boolean;
    public generateEInvoice?: boolean = undefined;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.accountDetails = new AccountDetailsClass();
        this.entries = [new SalesEntryClass()];
        this.voucherDetails = new VoucherDetailsClass();
        this.templateDetails = new TemplateDetailsClass();
    }
}

/**
 * SalesOtherTaxesCalculationMethodEnum enumeration
 * Defines constant values for SalesOtherTaxesCalculationMethodEnum
 */
export enum SalesOtherTaxesCalculationMethodEnum {
    OnTaxableAmount = 'OnTaxableAmount',
    OnTotalAmount = 'OnTotalAmount'
}

/**
 * SalesOtherTaxesModal class
 * Implements SalesOtherTaxesModal functionality
 */
export class SalesOtherTaxesModal {
    appliedOtherTax: INameUniqueName;
    tcsCalculationMethod: SalesOtherTaxesCalculationMethodEnum = SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;
    itemLabel: string;
}

/**
 * SalesAddBulkStockItems class
 * Implements SalesAddBulkStockItems functionality
 */
export class SalesAddBulkStockItems {
    name: string;
    uniqueName: string;
    quantity: number = 1;
    rate;
    sku?: string = '';
    stockUnitCode?: CodeStockMulticurrency;
    stockUnit?: CodeStockMulticurrency;
    additional?: any;
    variant?: IVariant;
    taxInclusive: boolean;
    variants?: Array<IOption>;
}

/**
 * CodeStockMulticurrency class
 * Implements CodeStockMulticurrency functionality
 */
export class CodeStockMulticurrency {
    code: string;
    uniqueName: any;
}

/**
 * Currency class
 * Implements Currency functionality
 */
export class Currency {
    code: string;
}

/**
 * StateCode class
 * Implements StateCode functionality
 */
export class StateCode {
    name: string;
    code: string;
    stateGstCode?: string;
}

/**
 * SalesEntryClassMulticurrency class
 * Implements SalesEntryClassMulticurrency functionality
 */
export class SalesEntryClassMulticurrency {
    public date: string;
    public description: string;
    public hsnNumber: string;
    public sacNumber: string;
    public taxes: ITaxControlData[];
    public transactions: TransactionClassMulticurrency[];
    public uniqueName: string;
    public voucherNumber: string;
    public voucherType: string;
    public discounts: DiscountMulticurrency[];
    public purchaseOrderItemMapping?: { uniqueName: string; entryUniqueName: any; };

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.transactions = [];
        this.date = '';
        this.taxes = [];
        this.hsnNumber = '';
        this.sacNumber = '';
        this.description = '';
        this.uniqueName = '';
        this.voucherNumber = '';
        this.voucherType = '';
        this.discounts = [];
        this.purchaseOrderItemMapping = { uniqueName: '', entryUniqueName: '' };
    }
}

/**
 * TransactionClassMulticurrency class
 * Implements TransactionClassMulticurrency functionality
 */
export class TransactionClassMulticurrency {
    public account: INameUniqueName;
    public amount: AmountClassMulticurrency;
    public stock?: SalesAddBulkStockItems;
    public description?: string;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.account = new class implements INameUniqueName {
            name: 'sales';
            uniqueName: 'sales';
        };
        this.amount = new AmountClassMulticurrency();
    }
}

/**
 * AmountClassMulticurrency class
 * Implements AmountClassMulticurrency functionality
 */
export class AmountClassMulticurrency {
    public amountForAccount: number;
    public amountForCompany: number;
    public type?: string;
    public accountUniqueName?: string;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.type = 'DEBIT';
    }
}

/**
 * DiscountMulticurrency class
 * Implements DiscountMulticurrency functionality
 */
export class DiscountMulticurrency {
    public calculationMethod: string;
    public uniqueName: string;
    public amount: AmountClassMulticurrency;
    public discountValue: number;
    public particular: string;
    public name: string;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(ledgerDiscountClass: LedgerDiscountClass) {
        this.calculationMethod = ledgerDiscountClass.discountType;
        this.uniqueName = ledgerDiscountClass.discountUniqueName;
        this.amount = new AmountClassMulticurrency();
        this.amount.amountForAccount = ledgerDiscountClass.amount;
        this.discountValue = ledgerDiscountClass.discountValue;
        this.name = ledgerDiscountClass.name;
        this.particular = ledgerDiscountClass.particular;
    }
}

/**
 * PaymentReceiptTransaction class
 * Implements PaymentReceiptTransaction functionality
 */
export class PaymentReceiptTransaction {
    account: PaymentReceiptAccount;
    amount: PaymentReceiptAmount;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.account = new PaymentReceiptAccount();
        this.amount = new PaymentReceiptAmount();
    }
}

/**
 * PaymentReceiptAccount class
 * Implements PaymentReceiptAccount functionality
 */
export class PaymentReceiptAccount {
    uniqueName: string;
    name: string;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.uniqueName = "";
        this.name = "";
    }
}

/**
 * PaymentReceiptAmount class
 * Implements PaymentReceiptAmount functionality
 */
export class PaymentReceiptAmount {
    amountForAccount: number;
}

/**
 * PaymentReceiptEntry class
 * Implements PaymentReceiptEntry functionality
 */
export class PaymentReceiptEntry {
    transactions: PaymentReceiptTransaction[];
    date: any;
    chequeNumber: string;
    chequeClearanceDate: any;
    taxes: ITaxControlData[] = [];

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.transactions = [new PaymentReceiptTransaction()];
        this.taxes = [];
    }
}

/**
 * PaymentReceipt class
 * Implements PaymentReceipt functionality
 */
export class PaymentReceipt {
    account: AccountDetailsClass;
    accountDetails: any;
    updateAccountDetails: boolean;
    entries: PaymentReceiptEntry[];
    date: any;
    type: string;
    exchangeRate: number;
    attachedFiles: any[];
    subVoucher: any;
    uniqueName?: any;
    templateDetails?: TemplateDetailsClass;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.account = new AccountDetailsClass();
        this.accountDetails = new AccountDetailsClass();
        this.entries = [new PaymentReceiptEntry()];
        this.templateDetails = new TemplateDetailsClass();
        this.date = "";
    }
}
