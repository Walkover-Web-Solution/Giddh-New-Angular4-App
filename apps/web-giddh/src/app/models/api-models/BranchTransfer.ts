import {INameUniqueName} from '../interfaces/nameUniqueName.interface';

export class BranchTransfersArray {
	constructor(public entityDetails: BranchTransferEntity, public quantity: number, public stockUnit: string, public rate: number) {
		//
	}
}

export class BranchTransferEntity {
	constructor(public uniqueName: string, public entity: 'warehouse' | 'stock' | 'company') {
		//
	}
}

export class TransferDestinationRequest {
	public transferProducts: boolean = false;
	public source: BranchTransferEntity;
	public product: BranchTransferEntity;
	public transferDate: string;
	public description: string;
	public transfers: BranchTransfersArray[];
}

export class TransferProductsRequest {
	public transferProducts: boolean = true;
	public source: BranchTransferEntity;
	public destination: BranchTransferEntity;
	public transferDate: string;
	public description: string;
	public transfers: BranchTransfersArray[];
}

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

export interface ILinkedStocksResult extends INameUniqueName {
	warehouses: INameUniqueName[];
}

export class LinkedStocksResponse {
	public page: number;
	public count: number;
	public totalPages: number;
	public totalItems: number;
	public results: ILinkedStocksResult[];
}

export class LinkedStocksVM implements INameUniqueName {
	constructor(public name: string, public uniqueName: string, public isWareHouse: boolean = false) {
	}
}

export class NewBranchTransferWarehouse {
	public name: string;
	public uniqueName: string;
	public taxNumber: any;
	public address: string;
	public stockDetails: NewBranchTransferProductStockDetails;
}

export class NewBranchTransferSourceDestination {
	public name: string;
	public uniqueName: string;
	public warehouse: NewBranchTransferWarehouse;
}

export class NewBranchTransferProductStockDetails {
	public stockUnit: any;
	public amount: any;
	public rate: any;
	public quantity: any;
	public skuCode: any;
}

export class NewBranchTransferProduct {
	public name: string;
	public hsnNumber: any;
	public uniqueName: any;
	public stockDetails: NewBranchTransferProductStockDetails;
	public description: string;
}

export class NewBranchTransferTransportationDetails {
	public dispatchedDate: any;
	public transporterName: string;
	public transporterId: any;
	public transportMode: string;
	public vehicleNumber: any;
}

export class NewBranchTransferResponse {
	public dateOfSupply: any;
	public challanNo: any;
	public note: string;
	public uniqueName: any;
	public source: NewBranchTransferSourceDestination[];
	public destination: NewBranchTransferSourceDestination[];
	public product: NewBranchTransferProduct[];
	public transportationDetails: NewBranchTransferTransportationDetails;
	public entity: string;
}