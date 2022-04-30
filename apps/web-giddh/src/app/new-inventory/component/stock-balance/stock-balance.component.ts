import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { select, Store } from "@ngrx/store";
import { combineLatest, ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { InventoryService } from "../../../services/inventory.service";
import { AppState } from "../../../store";
import { IOption } from "../../../theme/ng-virtual-select/sh-options.interface";
import { WarehouseActions } from "../../../settings/warehouse/action/warehouse.action";
import { cloneDeep } from "../../../lodash-optimized";
import { IGroupsWithStocksHierarchyMinItem } from "../../../models/interfaces/groupsWithStocks.interface";
import { StockReportActions } from "../../../actions/inventory/stocks-report.actions";
import { GroupStockReportRequest, StockReportRequest } from "../../../models/api-models/Inventory";
import { SettingsFinancialYearActions } from "../../../actions/settings/financial-year/financial-year.action";
import { GeneralService } from "../../../services/general.service";

interface quantity {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'stock-balance',
  templateUrl: './stock-balance.component.html',
  styleUrls: ['./stock-balance.component.scss'],
})

export class StockBalanceComponent implements OnInit, OnDestroy {
  showLoader = false;

  /** Image path variable */
  public imgPath: string = '';
  /** Observable to unsubscribe all the store listeners to avoid memory leaks */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /** Stock units list */
  public stockUnits: IOption[] = [];
  /** Holds stock unit name */
  public stockUnitName: string = "";
  /** Warehouse data for warehouse drop down */
  public warehouses: Array<any>;
  /** toggle all collapse */
  public isStockLlistCollapsed: boolean = false;
  /** Active row of warehouse stock list */
  public activeRow: number = -1;
  /** Stock groups list */
  public stockGroups: IOption[] = [];
  /** Holds stock group unique name */
  public stockGroupUniqueName: string = "";
  /** Holds stock group name */
  public stockGroupName: string = "";
  /** Hide/Show for unique name list */
  public showUniqueName: boolean = true;
  /** Hide/Show for group name list */
  public showGroupName: boolean = true;
  /** Hold group stock report request */
  public GroupStockReportRequest: GroupStockReportRequest;
  /** Hold stock report request */
  public stockReportRequest: StockReportRequest;
  /** Hold stocks report */
  public stocksList: any[] = [];
  /** Hold stocks variants  */
  public stocksVariants: any[] = [];
  /** Thsi will use for searching for stock */
  public productUniqueNameInput: FormControl = new FormControl();
  /** Hold warehouse checked  */
  public selectedWarehouse: any[] = [];


  @ViewChild('select') select: MatSelect;
  public allSelected = false;


  public warehouse = new FormControl();
  toppingList: string[] = ['Warehouse 1'];

  quantites: quantity[] = [
    { value: 'dummy-1', viewValue: 'Dummy 1' },
  ];

  constructor(
    private inventoryService: InventoryService,
    private store: Store<AppState>,
    private warehouseActions: WarehouseActions,
    private stockReportActions: StockReportActions,
    private generalService: GeneralService,
    private settingsFinancialYearActions: SettingsFinancialYearActions
  ) {
    this.store.dispatch(this.settingsFinancialYearActions.getFinancialYearLimits());
  }

  /**
   * Lifecycle hook for initialization
   *
   * @memberof StockBalanceComponent
   */
  public ngOnInit(): void {

    /** This will use for image format */
    this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

    this.getStockUnits();
    this.getStockGroups();
    this.getWarehouses();
    this.GroupStockReportRequest = new GroupStockReportRequest();
    this.stockReportRequest = new StockReportRequest();

    combineLatest([this.inventoryService.GetGroupsWithStocksFlatten(), this.store.pipe(select(state => state.warehouse.warehouses)), this.store.pipe(select(state => state.settings.financialYearLimits))]).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
      if (resp[0] && resp[1] && resp[2]) {
        this.warehouses = resp[1]?.results;
        let stockGroupUniqueName = resp[0]?.body?.results[0]?.uniqueName;
        let warehouseUniqueName = resp[1]?.results[0]?.uniqueName;
        let financialYearLimits = resp[2]?.startDate;
        if (stockGroupUniqueName && warehouseUniqueName && financialYearLimits && !this.GroupStockReportRequest.from) {
          this.GroupStockReportRequest.warehouseUniqueName = warehouseUniqueName;
          this.GroupStockReportRequest.stockGroupUniqueName = stockGroupUniqueName;
          this.GroupStockReportRequest.from = financialYearLimits;
          this.GroupStockReportRequest.to = financialYearLimits;
          this.getStocks();
        }
      }
    });

    this.productUniqueNameInput.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      takeUntil(this.destroyed$)
    ).subscribe(s => {
      this.GroupStockReportRequest.stockName = s;
      this.getStocks();
    });
  }

  /**
   * Sorting of warehouse per quantity and amount
   *
   * @param {('asc' | 'desc')} type
   * @param {string} columnName
   * @memberof StockBalanceComponent
   */
  public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
    if (this.GroupStockReportRequest.sort !== type || this.GroupStockReportRequest.sortBy !== columnName) {
      this.GroupStockReportRequest.sort = type;
      this.GroupStockReportRequest.sortBy = columnName;
    }
    this.getStocks();
  }

  /**
   * Get stock varients from stock unqiue name 
   *
   * @param {string} uniquename
   * @memberof StockBalanceComponent
   */
  public getStockVarients(uniquename: string) {
    this.inventoryService.getStock(uniquename).pipe(takeUntil(this.destroyed$)).subscribe(response => {
      this.stocksList?.forEach(stock => {
        stock.variants = response?.body?.variants;
      });
    });
  }

  /**
    * Get stock details
    *
    * @memberof StockBalanceComponent
    */
  public getStocks(): void {
    if (this.GroupStockReportRequest.stockGroupUniqueName && this.GroupStockReportRequest.warehouseUniqueName) {
      this.selectedWarehouse.push(this.GroupStockReportRequest.warehouseUniqueName);
      let groupStockReportRequest = cloneDeep(this.GroupStockReportRequest);
      delete groupStockReportRequest.warehouseUniqueName;
      combineLatest([this.inventoryService.GetGroupStocksReport_V3(groupStockReportRequest), this.inventoryService.GetGroupStocksReport_V3(this.GroupStockReportRequest)]).pipe(takeUntil(this.destroyed$)).subscribe((response: any[]) => {
        if (response[0]) {
          this.stocksList = response[0]?.body?.stockReport;
          this.stockGroupName = response[0]?.body?.stockGroupName;

          this.stocksList?.forEach(stock => {
            stock.warehouses = [];
            this.warehouses?.forEach(warehouse => {
              stock.warehouses.push({ name: warehouse.name, uniqueName: warehouse.uniqueName });
            });
          });

          let warehouseStocksList = response[1]?.body?.stockReport;
          if (warehouseStocksList?.length > 0) {
            warehouseStocksList.forEach(warehouseStock => {
              const stockFound = this.stocksList?.filter(stock => stock.uniqueName === warehouseStock.uniqueName);
              if (stockFound?.length > 0) {
                if (stockFound[0]?.warehouses?.length > 0) {
                  const warehouseFound = stockFound[0]?.warehouses?.filter(warehouse => warehouse.uniqueName === this.GroupStockReportRequest.warehouseUniqueName);
                  if (warehouseFound?.length > 0) {
                    warehouseFound[0].openingBalance = warehouseStock.openingBalance;
                  }
                }
              }
            });
          }
        }
      });
    }
  }

  /**
   * Get warehouses
   *
   * @memberof StockBalanceComponent
   */
  public getWarehouses(): void {
    this.store.pipe(select(state => state.warehouse.warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
      if (!warehouses?.results) {
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
      }
    });
  }

  /**
   * Get warehouse selected unique name
   *
   * @param {*} uniqueName
   * @memberof StockBalanceComponent
   */
  public optionClick(uniqueName: any): void {
    if (uniqueName) {
      if (this.selectedWarehouse?.includes(uniqueName)) {
        this.selectedWarehouse = this.generalService.removeValueFromArray(this.selectedWarehouse, uniqueName);
      } else {
        this.selectedWarehouse.push(uniqueName);
      }
      console.log(this.selectedWarehouse);
      this.GroupStockReportRequest.warehouseUniqueName = uniqueName;
      this.inventoryService.GetGroupStocksReport_V3(this.GroupStockReportRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
        if (response) {
          let warehouseStocksList = response?.body?.stockReport;
          if (warehouseStocksList?.length > 0) {
            warehouseStocksList.forEach(warehouseStock => {
              const stockFound = this.stocksList?.filter(stock => stock.stockUniqueName === warehouseStock?.stockUniqueName);
              if (stockFound?.length > 0) {
                if (stockFound[0]?.warehouses?.length > 0) {
                  const warehouseFound = stockFound[0]?.warehouses?.filter(warehouse => warehouse.uniqueName === this.GroupStockReportRequest.warehouseUniqueName);
                  if (warehouseFound?.length > 0) {
                    warehouseFound[0].openingBalance = warehouseStock.openingBalance;
                    console.log(warehouseFound);
                  }
                }
              }
            });
          }
        }
      });
    }
  }

  //   /**
  //  * Toggle selected all in warehouse multiple selection
  //  *
  //  * @memberof StockBalanceComponent
  //  */
  //   public toggleAllSelection(): void {
  //     if (this.allSelected) {

  //       this.select.options.forEach((item: MatOption) => item.selected == true);
  //     } else {
  //       this.select.options.forEach((item: MatOption) => item.deselect);
  //     }
  //   }

  /**
* Callback for selection of field type
*
* @param {*} field
* @memberof CustomFieldsCreateEditComponent
*/
  public selectFieldType(event: any): void {
    this.GroupStockReportRequest.stockGroupUniqueName = event.value;
    this.getStocks();
  }

  /**
   * Active row edit according to the selected option
   *
   * @param {*} index
   * @memberof StockBalanceComponent
   */
  public setActiveRow(index): void {
    this.activeRow = index;
  }

  /**
   * Hide row of active according to selected option
   *
   * @memberof StockBalanceComponent
   */
  public hideActiveRow(): void {
    this.activeRow = null;
  }

  /**
   * Get stock units
   *
   * @memberof StockBalanceComponent
   */
  public getStockUnits(): void {
    this.inventoryService.GetStockUnit().pipe(takeUntil(this.destroyed$)).subscribe(response => {
      if (response?.status === "success") {
        this.stockUnits = response?.body?.map(result => {
          return {
            value: result.code,
            label: result.name,
            additional: result
          };
        }) || [];
      }
    });
  }

  /**
  * Get stock groups
  *
  * @memberof StockBalanceComponent
  */
  public getStockGroups(): void {
    this.inventoryService.GetGroupsWithStocksFlatten().pipe(takeUntil(this.destroyed$)).subscribe(response => {
      if (response?.status === "success") {
        let stockGroups: IOption[] = [];
        this.arrangeStockGroups(response.body?.results, stockGroups);
        this.stockGroups = stockGroups;
      }
    });
  }

  /**
 * Arrange stock groups
 *
 * @private
 * @param {IGroupsWithStocksHierarchyMinItem[]} groups
 * @param {IOption[]} [parents=[]]
 * @memberof StockCreateEditComponent
 */
  private arrangeStockGroups(groups: IGroupsWithStocksHierarchyMinItem[], parents: IOption[] = []): void {
    groups.map(group => {
      if (group) {
        let newOption: IOption = { label: '', value: '', additional: {} };
        newOption.label = group.name;
        newOption.value = group.uniqueName;
        newOption.additional = group;
        parents.push(newOption);
        if (group.childStockGroups?.length > 0) {
          this.arrangeStockGroups(group.childStockGroups, parents);
        }
      }
    });
  }

  /**
 * Lifecycle hook for destroy
 *
 * @memberof StockCreateEditComponent
 */
  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}