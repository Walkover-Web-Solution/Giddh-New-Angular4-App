export class StateCode {
    name: string;
    code: string;
    stateGstCode?: string;
}

export class NameUniqueName {
    name: string;
    uniqueName: string;
}

export class Address {
    public gstNumber: string;
    public address: string[];
    public state: StateCode;
    public stateName: string;
    public stateCode: string;
    public panNumber: string;
}

export class Entries {
    public uniqueName: string;
    public voucherType: string;
    public voucherNumber: string;
    public description: string;
    public date: string;
    public hsnNumber: string;
    public sacNumber: string;
    public transactions: [
        {
            account: {
                name: string;
                uniqueName: string;
            },
            amount: {
                amountForAccount: string;
                amountForCompany: string;
                type: string;
            }
        }
    ];
    public taxes: [
        {
            uniqueName: string;
        }
    ]
}

export class Company {
    public billingDetails: Address;
    public shippingDetails: Address;
}

export class Currency {
    code: string;
}

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

    constructor() {
        this.shippingDate = null;
        this.shippedVia = null;
        this.trackingNumber = null;
        this.customField1 = null;
        this.customField2 = null;
        this.customField3 = null;
    }
}

export class TemplateDetails {
    public other: OtherSalesItemClass;

    constructor() {
        this.other = new OtherSalesItemClass();
    }
}

export class PurchaseOrder {
    public type: string;
    public date: string;
    public dueDate: string;
    public number: string;
    public exchangeRate: string;
    public account: Account;
    public entries: Entries;
    public company: Company; 
    public warehouse: NameUniqueName;
    public templateDetails: TemplateDetails;

    constructor() {
        this.type = "purchase";

        this.account = new Account();
        this.account.billingDetails = new Address();
        this.account.billingDetails.state = new StateCode();
        this.account.shippingDetails = new Address();
        this.account.shippingDetails.state = new StateCode();
        this.account.currency = new Currency();

        this.company = new Company();
        this.company.billingDetails = new Address();
        this.company.billingDetails.state = new StateCode();
        this.company.shippingDetails = new Address();
        this.company.shippingDetails.state = new StateCode();
        this.warehouse = new NameUniqueName();
        this.entries = new Entries();

        this.templateDetails = new TemplateDetails();
    }
}