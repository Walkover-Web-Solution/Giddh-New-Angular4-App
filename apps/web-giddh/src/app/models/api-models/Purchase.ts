import { SalesEntryClass, VoucherDetailsClass, AccountDetailsClass } from './Sales';

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
 * NameUniqueName class
 * Implements NameUniqueName functionality
 */
export class NameUniqueName {
    name: string;
    uniqueName: string;
}

/**
 * Address class
 * Implements Address functionality
 */
export class Address {
    public gstNumber: string;
    public address: string[];
    public state: StateCode;
    public stateName: string;
    public stateCode: string;
    public panNumber: string;
    public pincode?: string;
    public county?: CountyCode;
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
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
 * Transaction class
 * Implements Transaction functionality
 */
export class Transaction {
    public account: {
        name: string;
        uniqueName: string;
    };
    public amount: {
        amountForAccount: string;
        amountForCompany: string;
        type: string;
    }
}

/**
 * Tax class
 * Implements Tax functionality
 */
export class Tax {
    uniqueName: string;
}

/**
 * Company class
 * Implements Company functionality
 */
export class Company {
    public billingDetails: Address;
    public shippingDetails: Address;
}

/**
 * Currency class
 * Implements Currency functionality
 */
export class Currency {
    code: string;
}

/**
 * Account class
 * Implements Account functionality
 */
export class Account {
    public name: string;
    public uniqueName: string;
    public customerName: string;
    public email: string;
    public mobileNumber: string;
    public billingDetails: Address;
    public shippingDetails: Address;
    public currency: Currency;
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
    constructor() {
        this.shippingDate = null;
        this.shippedVia = null;
        this.trackingNumber = null;
        this.customField1 = null;
        this.customField2 = null;
        this.customField3 = null;
    }
}

/**
 * TemplateDetails class
 * Implements TemplateDetails functionality
 */
export class TemplateDetails {
    public other: OtherSalesItemClass;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.other = new OtherSalesItemClass();
    }
}

/**
 * PurchaseOrder class
 * Implements PurchaseOrder functionality
 */
export class PurchaseOrder {
    public type: string;
    public date: string;
    public dueDate: string;
    public number: string;
    public exchangeRate: string;
    public account: Account;
    public entries: SalesEntryClass[];
    public company: Company;
    public warehouse: NameUniqueName;
    public templateDetails: TemplateDetails;
    public voucherDetails: VoucherDetailsClass;
    public accountDetails: AccountDetailsClass;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.account = new Account();
        this.account.billingDetails = new Address();
        this.account.billingDetails.address = [];
        this.account.billingDetails.state = new StateCode();
        this.account.shippingDetails = new Address();
        this.account.shippingDetails.state = new StateCode();
        this.account.shippingDetails.address = [];
        this.account.currency = new Currency();

        this.company = new Company();
        this.company.billingDetails = new Address();
        this.company.billingDetails.address = [];
        this.company.billingDetails.state = new StateCode();
        this.company.shippingDetails = new Address();
        this.company.shippingDetails.address = [];
        this.company.shippingDetails.state = new StateCode();
        this.warehouse = new NameUniqueName();
        this.accountDetails = new AccountDetailsClass();
        this.entries = [new SalesEntryClass()];
        this.voucherDetails = new VoucherDetailsClass();

        this.templateDetails = new TemplateDetails();
    }
}
