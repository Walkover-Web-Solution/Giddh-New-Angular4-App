import { INameUniqueName } from '../interfaces/nameUniqueName.interface';

/*
 * Model for Create Stock Group api request
 * POST call
 * API:: (Create Stock Group) company/:companyUniqueName/stock-group
 * response will be hash as StockGroupResponse
 */
export class StockGroupRequest implements INameUniqueName {
  public isSelfParent?: boolean;
  public name: string;
  public uniqueName: string;
  public parentStockGroupUniqueName?: string;
}

/**
 * Model for Create Stock Group api response
 * API:: (Create Stock Group) company/:companyUniqueName/stock-group
 */
export class StockGroupResponse {
  public childStockGroups?: INameUniqueName[];
  public name: string;
  public parentStockGroup?: INameUniqueName;
  public parentStockGroupNames: string[];
  public stocks: INameUniqueName[];
  public uniqueName: string;
}
