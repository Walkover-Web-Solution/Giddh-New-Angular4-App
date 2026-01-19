import { INameUniqueName } from '../api-models/Inventory';

/*
 * Interface for groups-with-stocks-flatten api response result item
 */
/**
 * IGroupsWithStocksFlattenItem interface definition
 * Defines the structure and contract for IGroupsWithStocksFlattenItem objects
 */
export interface IGroupsWithStocksFlattenItem extends INameUniqueName {
    stocks?: INameUniqueName[];
}

/**
 * IGroupsWithStocksHierarchyMinItem interface definition
 * Defines the structure and contract for IGroupsWithStocksHierarchyMinItem objects
 */
export interface IGroupsWithStocksHierarchyMinItem extends INameUniqueName {
    childStockGroups?: IGroupsWithStocksHierarchyMinItem[];
    isActive?: boolean;
    isOpen?: boolean;
    stocks?: INameUniqueName[];
}
