import { IPaginatedResponse } from '../interfaces/paginated-response.interface';
import { IGroupsWithStocksFlattenItem, IGroupsWithStocksHierarchyMinItem } from '../interfaces/groups-with-stocks.interface';

/*
 * Model for groups-with-stocks-flatten api response
 * GET call
 * API:: (groups-with-stocks-flatten) company/:companyUniqueName/stock-group/groups-with-stocks-flatten?count=&page=1&q=
 * you can pass query parameters in this as page, query as q and and count
 * its response will be hash as GroupsWithStocksFlatten
 */
export class GroupsWithStocksFlatten implements IPaginatedResponse {
    public count: number;
    public page: number;
    public results: IGroupsWithStocksFlattenItem[];
    public size: number;
    public totalItems: number;
    public totalPages: number;
}

/*
 * Model for groups-with-stocks-hierarchy-min api response
 * GET call
 * API:: (groups-with-stocks-hierarchy-min) company/:companyUniqueName/stock-group/groups-with-stocks-hierarchy-min
 * its response will be hash as GroupsWithStocksHierarchyMin
 */
export class GroupsWithStocksHierarchyMin implements IPaginatedResponse {
    public count: number;
    public page: number;
    public results: IGroupsWithStocksHierarchyMinItem[];
    public size: number;
    public totalItems: number;
    public totalPages: number;
}
