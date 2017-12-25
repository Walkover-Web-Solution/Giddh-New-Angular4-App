import { INameUniqueName } from '../interfaces/nameUniqueName.interface';
import { IPaginatedResponse } from '../interfaces/paginatedResponse.interface';
import {
  IAccountDetails,
  IManufacturingDetails,
  Istock,
  IStockDetail,
  IStockItem,
  IStockReport,
  IStockReportItem,
  IStocksItem,
  IStockTransaction,
  IStockUnit,
  IStockUnitItem,
  IStockUnitResponse
} from '../interfaces/stocksItem.interface';

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
  public isSubGroup?: boolean;
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
export class StockUnitResponse implements IStockUnitResponse {
  public code: string;
  public hierarchicalQuantity: number;
  public name: string;
  public parentStockUnit?: IStockItem;
  public quantityPerUnit: number;
}

/**
 * Model for stock-report api response
 * GET call
 * API:: (stock-report) company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName/report-v2?from=:from&to=:to&count=:count&page=:page
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

export class StockReportRequest {
  public stockGroupUniqueName: string;
  public stockUniqueName: string;
  public from: string = '';
  public to: string = '';
  public count: number = 10;
  public page: number = 1;
}

/**
 * Model for stock-detail api response
 * GET call
 * API:: (stock-detail) company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName
 * Response will be hash containing StockDetailResponse
 */
export class StockDetailResponse implements IStockDetail {
  public manufacturingDetails: IManufacturingDetails;
  public openingAmount: number;
  public openingQuantity: number;
  public purchaseAccountDetails?: IAccountDetails;
  public salesAccountDetails?: IAccountDetails;
  public stockGroup: INameUniqueName;
  public stockUnit: IStockUnitItem;
  public stockUnitCode?: string;
  public name: string;
  public uniqueName: string;
  public hsnNumber?: number;
}

/*
 * Model for create-stock api request
 * POST call
 * API:: (create-stock) company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock
 * its response will be hash as StockDetailResponse
 */
export class CreateStockRequest {
  public isFsStock: boolean;
  public manufacturingDetails: IManufacturingDetails;
  public name: string;
  public openingAmount: number;
  public openingQuantity: number;
  public purchaseAccountDetails: IAccountDetails;
  public salesAccountDetails: IAccountDetails;
  public stockUnitCode: string;
  public uniqueName: string;
  public hsnNumber?: number;
}

/*
 * Model for create-stock-unit api request
 * POST call
 * API:: (create-stock-unit) company/:companyUniqueName/stock-unit
 * used to create custom stock units
 * its response will be hash as StockUnitResponse
 */
export class StockUnitRequest implements IStockUnit {
  public parentStockUnit: IStockItem;
  public quantityPerUnit: number;
  public name: string;
  public code: string;
  public parentStockUnitCode?: string;
}

/*
 * Delete stock api
 * DELETE call
 * API:: (Delete stock) company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName
 * its response will be string in body
 */

/*
 * Delete custom stock unit api
 * DELETE call
 * API:: (Delete custom stock unit) company/:companyUniqueName/stock-unit/:uName
 * uname stands for unique name of custom unit
 * its response will be string in body
 */
