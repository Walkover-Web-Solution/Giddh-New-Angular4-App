export class ManufacturingVariant {
    name: string;
    uniqueName: string;
}

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

    constructor() {
        this.variant = new ManufacturingVariant();
        this.variants = [new ManufacturingVariant()];
        this.cssClass = "form-control mat-field-border";
        this.stocksPageNumber = 1;
        this.stocksTotalPages = 1;
        this.stocksQ = "";
    }
}

export class CreateManufacturingClass {
    manufacturingQuantity: number;
    date: string;
    linkedStocks: ManufacturingLinkedStock[];
    warehouseUniqueName: string;
    manufacturingMultipleOf: number;
    stockUniqueName: string;
    variant: ManufacturingVariant;
    variants?: ManufacturingVariant[];
    manufacturingUnitCode?: string;
    stockName?: string;
    stocks: any[];
    stocksPageNumber: number;
    stocksTotalPages: number;
    stocksQ: any;

    constructor() {
        this.manufacturingQuantity = 1;
        this.manufacturingMultipleOf = 1;
        this.date = '';
        this.linkedStocks = [];
        this.variant = new ManufacturingVariant();
        this.variants = [new ManufacturingVariant()];
        this.stocksPageNumber = 1;
        this.stocksTotalPages = 1;
        this.stocksQ = "";
    }
}

export class CreateManufacturing {
    manufacturingDetails: CreateManufacturingClass[];

    constructor() {
        this.manufacturingDetails = [new CreateManufacturingClass()];
    }
}