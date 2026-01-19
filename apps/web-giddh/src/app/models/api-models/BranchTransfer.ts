import { INameUniqueName } from '../interfaces/name-unique-name.interface';

/**
 * BranchTransfersArray class
 * Implements BranchTransfersArray functionality
 */
export class BranchTransfersArray {
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(public entityDetails: BranchTransferEntity, public quantity: number, public stockUnit: string, public rate: number) {
        //
    }
}

/**
 * BranchTransferEntity class
 * Implements BranchTransferEntity functionality
 */
export class BranchTransferEntity {
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(public uniqueName: string, public entity: 'warehouse' | 'stock' | 'company') {
        //
    }
}

/**
 * TransferDestinationRequest class
 * Implements TransferDestinationRequest functionality
 */
export class TransferDestinationRequest {
    public transferProducts: boolean = false;
    public source: BranchTransferEntity;
    public product: BranchTransferEntity;
    public transferDate: string;
    public description: string;
    public transfers: BranchTransfersArray[];
}

/**
 * TransferProductsRequest class
 * Implements TransferProductsRequest functionality
 */
export class TransferProductsRequest {
    public transferProducts: boolean = true;
    public source: BranchTransferEntity;
    public destination: BranchTransferEntity;
    public transferDate: string;
    public description: string;
    public transfers: BranchTransfersArray[];
}

/**
 * BranchTransferResponse class
 * Implements BranchTransferResponse functionality
 */
export class BranchTransferResponse {
    public uniqueName: string;
    public amount: number;
    public rate: number;
    public fromStock: INameUniqueName;
    public toStock: INameUniqueName;
    public transferDate: string;
    public fromCompany: string;
    public toCompany: string;
    public fromWarehouse: INameUniqueName;
    public toWarehouse: INameUniqueName;
    public quantity: number;
    public description: string;
    public fromStockUnit: {
        name: string,
        code: string
    };
    public toStockUnit: {
        name: string,
        code: string
    };
}

/**
 * ILinkedStocksResult interface definition
 * Defines the structure and contract for ILinkedStocksResult objects
 */
export interface ILinkedStocksResult extends INameUniqueName {
    warehouses: INameUniqueName[];
    isCompany?: boolean;
    isConsolidatedBranch?: boolean;
}

/**
 * LinkedStocksResponse class
 * Implements LinkedStocksResponse functionality
 */
export class LinkedStocksResponse {
    public page: number;
    public count: number;
    public totalPages: number;
    public totalItems: number;
    public results: ILinkedStocksResult[];
}

/**
 * LinkedStocksVM class
 * Implements LinkedStocksVM functionality
 */
export class LinkedStocksVM implements INameUniqueName {
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        public name: string,
        public uniqueName: string,
        public isWareHouse: boolean = false,
        public alias: string = '',
        public warehouses: Array<any> = [],
        public isArchived: boolean = false) {
    }
}

/**
 * NewBranchTransferWarehouse class
 * Implements NewBranchTransferWarehouse functionality
 */
export class NewBranchTransferWarehouse {
    public name: string;
    public uniqueName: string;
    public taxNumber: any;
    public address: string;
    public stockDetails: NewBranchTransferProductStockDetails;
    public pincode?: string;
}

/**
 * NewBranchTransferSourceDestination class
 * Implements NewBranchTransferSourceDestination functionality
 */
export class NewBranchTransferSourceDestination {
    public name: string;
    public uniqueName: string;
    public warehouse: NewBranchTransferWarehouse;
}

/**
 * NewBranchTransferProductStockDetails class
 * Implements NewBranchTransferProductStockDetails functionality
 */
export class NewBranchTransferProductStockDetails {
    public stockUnit?: any;
    public amount: any;
    public rate: any;
    public quantity: any;
    public stockUnitUniqueName?: any;
}

/**
 * NewBranchTransferProduct class
 * Implements NewBranchTransferProduct functionality
 */
export class NewBranchTransferProduct {
    public name: string;
    public hsnNumber: any;
    public sacNumber: any;
    public showCodeType: string;
    public skuCode: any;
    public uniqueName: any;
    public stockDetails: NewBranchTransferProductStockDetails;
    public description: string;
    public variant?: any;
}

/**
 * NewBranchTransferTransportationDetails class
 * Implements NewBranchTransferTransportationDetails functionality
 */
export class NewBranchTransferTransportationDetails {
    public dispatchedDate: any;
    public transporterName: string;
    public transporterId: any;
    public transportMode: string;
    public vehicleNumber: any;
}

/**
 * NewBranchTransferResponse class
 * Implements NewBranchTransferResponse functionality
 */
export class NewBranchTransferResponse {
    public dateOfSupply: any;
    public challanNo: any;
    public note: string;
    public uniqueName: any;
    public sources: NewBranchTransferSourceDestination[];
    public destinations: NewBranchTransferSourceDestination[];
    public products: NewBranchTransferProduct[];
    public transporterDetails: NewBranchTransferTransportationDetails;
    public entity: string;
    public transferType: string;
}

/**
 * NewBranchTransferRequest class
 * Implements NewBranchTransferRequest functionality
 */
export class NewBranchTransferRequest {
    public dateOfSupply: any;
    public challanNo: string;
    public uniqueName: string;
    public note: string;
    public sources: NewBranchTransferSourceDestination[];
    public destinations: NewBranchTransferSourceDestination[];
    public products: NewBranchTransferProduct[];
    public transporterDetails: NewBranchTransferTransportationDetails;
    public entity: string;
    public transferType: string;
}

/**
 * NewBranchTransferListGetRequestParams class
 * Implements NewBranchTransferListGetRequestParams functionality
 */
export class NewBranchTransferListGetRequestParams {
    public from: string;
    public to: string;
    public page: any;
    public count: any;
    public sort: string;
    public sortBy: string;
    public branchUniqueName: string;
}

/**
 * NewBranchTransferListPostRequestParams class
 * Implements NewBranchTransferListPostRequestParams functionality
 */
export class NewBranchTransferListPostRequestParams {
    public amountOperator: string;
    public amount: any;
    public voucherType: string;
    public date: string;
    public voucherNo: string;
    public senderReceiver: string;
    public warehouseName: string;
    public sender?: string;
    public receiver?: string;
    public fromWarehouse?: string;
    public toWarehouse?: string;
}

/**
 * NewBranchTransferListItems class
 * Implements NewBranchTransferListItems functionality
 */
export class NewBranchTransferListItems {
    public dateOfSupply: string;
    public voucherType: string;
    public voucherNo: string;
    public senderReceiver: string;
    public warehouseName: string;
    public totalAmount: any;
    public uniqueName: string;
    public sender?: string;
    public receiver?: string;
    public fromWarehouse?: string;
    public toWarehouse?: string;
}

/**
 * NewBranchTransferListResponse class
 * Implements NewBranchTransferListResponse functionality
 */
export class NewBranchTransferListResponse {
    public items: NewBranchTransferListItems[];
    public fromDate: string;
    public toDate: string;
    public page: number;
    public count: number;
    public totalPages: number;
    public totalItems: number;
}

/**
 * NewBranchTransferDownloadRequest class
 * Implements NewBranchTransferDownloadRequest functionality
 */
export class NewBranchTransferDownloadRequest {
    public uniqueName: string;
}
