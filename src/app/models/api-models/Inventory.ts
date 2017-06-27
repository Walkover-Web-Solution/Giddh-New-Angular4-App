import { INameUniqueName } from '../interfaces/nameUniqueName.interface';
import { IPaginatedResponse } from '../interfaces/paginatedResponse.interface';
import { IStocksItem, IStockItem, IStockReport, IStockReportItem, IStockTransaction } from '../interfaces/stocksItem.interface';

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

/**
 * Model for stock-report api response
 * GET call
 * API:: (stock-report) company/:companyUniqueName/stock-group/get-stock-report?count=10&from=&page=0&stockGroupUniqueName=&stockUniqueName=d&to=
 * you can pass query parameters in this as:
 * 1) from => date string
 * 2) to => date string,
 * 3) page => number,
 * 4) stockUniqueName => string
 * 5)stockGroupUniqueName string
 * 6)count => number which is sent 10
 * Response will be a array of StockUnitResponse
 * the field stockUnitQtyMap contains a hash depending on the stockUnit
 * if stock unit is 'kg' stockUnitQtyMap contains {kg: 1}
 * for hour stockUnitQtyMap contains {hr: 1} etc
 */
export class StockReportResponse implements IStockReport {
  public closingBalance: IStockReportItem;
  public count: number;
  public openingBalance: IStockReportItem;
  public page: number;
  public stockUnit: string;
  public stockUnitQtyMap: any;
  public totalItems: number;
  public totalPages: number;
  public transactions: IStockTransaction[];
}
