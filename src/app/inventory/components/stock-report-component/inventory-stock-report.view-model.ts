import { StockReportResponse } from '../../../models/api-models/Inventory';
/**
 * Created by ad on 04-07-2017.
 */
export class InventoryStockReportVM {
  public selectedStock = {};
  public today = new Date();
  public fromDatePickerIsOpen = false;
  public toDatePickerIsOpen = false;
  public format = 'dd-MM-yyyy';
  public dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1,
    'showWeeks': false,
    'show-button-bar': false,
    'year-range': 1,
    'todayBtn': false
  };
  public report: StockReportResponse;
  public fromDate = new Date();
  public toDate = new Date();
  public stockId;
}
