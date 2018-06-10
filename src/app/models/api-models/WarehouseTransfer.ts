export class WarehouseTransfersArray {
  constructor(public entityDetails: WarehouseTransferEntity, public quantity: number, public rate: number, public stockUnit: string) {
    //
  }
}

export class WarehouseTransferEntity {
  constructor(public uniqueName: string, public entity: 'warehouse' | 'stock') {
    //
  }
}

export class TranferDestinationRequest {
  public transferProducts: boolean = false;
  public source: WarehouseTransferEntity;
  public product: WarehouseTransferEntity;
  public transferDate: string;
  public description: string;
  public transfers: WarehouseTransfersArray[];
}

export class TransferProductsRequest {
  public transferProducts: boolean = true;
  public source: WarehouseTransferEntity;
  public destination: WarehouseTransferEntity;
  public transferDate: string;
  public description: string;
  public transfers: WarehouseTransfersArray[];
}
