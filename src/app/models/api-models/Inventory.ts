import { INameUniqueName } from '../interfaces/nameUniqueName.interface';
import { IPaginatedResponse } from '../interfaces/paginatedResponse.interface';
import { IStocksItem, IStockItem } from '../interfaces/stocksItem.interface';

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

/**
 * Model for Stocks api response
 * API:: (Stocks) company/:companyUniqueName/stock-group/stocks
 * response will ne a hash containing StocksResponse
 */
export class StocksResponse implements IPaginatedResponse {
  public count: number;
  public page: number;
  public results: IStocksItem[];
  public size: number;
  public totalItems: number;
  public totalPages: number;
}

/**
 * Model for Delete Stock-Group api response
 * DELETE call
 * from ui we are makingcall to delete-stockgrp api whereas from node it is directed to stock-unit api
 * API:: (Delete Stock-Group) company/:companyUniqueName/stock-group/:stockGroupUniqueName
 * Response will be a string message in body
 */

/**
 * Model for units types api response
 * from ui we are makingcall to units types api whereas from node it is directed to stock-unit api
 * GET call
 * API:: (units types) company/:companyUniqueName/stock-unit
 * Response will be a array of StockUnitResponse
 */
export class StockUnitResponse {
  public code: string;
  public hierarchicalQuantity: number;
  public name: string;
  public parentStockUnit?: IStockItem;
  public quantityPerUnit: number;
}
