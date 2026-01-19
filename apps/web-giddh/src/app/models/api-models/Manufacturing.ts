/**
 * ManufacturingVariant class
 * Implements ManufacturingVariant functionality
 */
export class ManufacturingVariant {
    name: string;
    uniqueName: string;
}

/**
 * ManufacturingLinkedStock class
 * Implements ManufacturingLinkedStock functionality
 */
export class ManufacturingLinkedStock {
    selectedStock?: any;
    stockUniqueName: string;
    quantity: number;
    stockUnitUniqueName: string;
    stockUnitCode?: string;
    rate: number;
    amount: number;
    variant: ManufacturingVariant;
    variants?: ManufacturingVariant[];
    cssClass?: string;
    stockNameError?: boolean;
    variantNameError?: boolean;
    quantityError?: boolean;
    stocks?: any[];
    stocksPageNumber?: number;
    stocksTotalPages?: number;
    stocksQ?: any;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.variant = new ManufacturingVariant();
        this.variants = [new ManufacturingVariant()];
        this.cssClass = "form-control border";
        this.stocksPageNumber = 1;
        this.stocksTotalPages = 1;
        this.stocksQ = "";
    }
}

/**
 * ManufacturingBaseAccount class
 * Implements ManufacturingBaseAccount functionality
 */
export class ManufacturingBaseAccount {
    uniqueName: string;
    defaultName: string;
}
/**
 * ManufacturingTransactionAccount class
 * Implements ManufacturingTransactionAccount functionality
 */
export class ManufacturingTransactionAccount {
    uniqueName: string;
    defaultName: string;
}

/**
 * ManufacturingTransaction class
 * Implements ManufacturingTransaction functionality
 */
export class ManufacturingTransaction {
    account: ManufacturingTransactionAccount;
    amount: number;
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.account = new ManufacturingTransactionAccount();
    }
}
/**
 * ManufacturingExpense class
 * Implements ManufacturingExpense functionality
 */
export class ManufacturingExpense {
    baseAccount: ManufacturingBaseAccount;
    transactions: ManufacturingTransaction[];
    cssClass?: string;
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.baseAccount = new ManufacturingBaseAccount();
        this.transactions = [new ManufacturingTransaction()];
        this.cssClass = "form-control border";
    }
}

/**
 * CreateManufacturingClass class
 * Implements CreateManufacturingClass functionality
 */
export class CreateManufacturingClass {
    manufacturingQuantity: number;
    date: string;
    linkedStocks: ManufacturingLinkedStock[];
    byProducts: ManufacturingLinkedStock[];
    otherExpenses: ManufacturingExpense[];
    increaseAssetValue: boolean;
    warehouseUniqueName: string;
    manufacturingMultipleOf: number;
    stockUniqueName: string;
    variant: ManufacturingVariant;
    variants?: ManufacturingVariant[];
    manufacturingUnitCode?: string;
    manufacturingUnitUniqueName?: string;
    stockName?: string;
    stocks: any[];
    stocksPageNumber: number;
    stocksTotalPages: number;
    stocksQ: any;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(preserveFields?: {
        stocks?: any[];
        stocksPageNumber?: number;
        stocksTotalPages?: number;
    }) {
        this.manufacturingQuantity = 1;
        this.manufacturingMultipleOf = 1;
        this.date = '';
        this.linkedStocks = [];
        this.byProducts = [];
        this.otherExpenses = [];
        this.increaseAssetValue = true;
        this.variant = new ManufacturingVariant();
        this.variants = [new ManufacturingVariant()];
        this.stocks = preserveFields?.stocks || [];
        this.stocksPageNumber = preserveFields?.stocksPageNumber || 1;
        this.stocksTotalPages = preserveFields?.stocksTotalPages || 1;
    }
}

/**
 * CreateManufacturing class
 * Implements CreateManufacturing functionality
 */
export class CreateManufacturing {
    manufacturingDetails: CreateManufacturingClass[];

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(preserveFields?: {
        stocks?: any[];
        stocksPageNumber?: number;
        stocksTotalPages?: number;
    }) {
        this.manufacturingDetails = [new CreateManufacturingClass(preserveFields)];
    }
}
