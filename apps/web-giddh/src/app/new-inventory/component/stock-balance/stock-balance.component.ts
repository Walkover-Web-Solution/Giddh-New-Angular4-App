import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { combineLatest, ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { InventoryService } from "../../../services/inventory.service";
import { AppState } from "../../../store";
import { IOption } from "../../../theme/ng-virtual-select/sh-options.interface";
import { WarehouseActions } from "../../../settings/warehouse/action/warehouse.action";
import { cloneDeep } from "../../../lodash-optimized";
import { IGroupsWithStocksHierarchyMinItem } from "../../../models/interfaces/groupsWithStocks.interface";
import { GroupStockReportRequest, StockReportRequest } from "../../../models/api-models/Inventory";
import { SettingsFinancialYearActions } from "../../../actions/settings/financial-year/financial-year.action";
import { GeneralService } from "../../../services/general.service";
import { ToasterService } from "../../../services/toaster.service";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
@Component({
	selector: 'stock-balance',
	templateUrl: './stock-balance.component.html',
	styleUrls: ['./stock-balance.component.scss'],
})

export class StockBalanceComponent implements OnInit, OnDestroy {
	/**  Selector for warehouseInput1 input field */
	@ViewChild('warehouseInput1', { static: false }) warehouseInput1: ElementRef;
	/**  Selector for warehouseInput2 input field */
	@ViewChild('warehouseInput2', { static: false }) warehouseInput2: ElementRef;
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
	public productNameSearching: FormControl = new FormControl();
	/** Hold warehouse checked  */
	public selectedWarehouse: any[] = [];
	/** Holded all selected warehouse checked  */
	public allSelectedWarehouse: any[] = [];
	/** True if api call in progress */
	public isLoading: boolean = false;
	/** This will hold common JSON data */
	public commonLocaleData: any = {};
	/** True if click on particular unit dropdown */
	public isOpen: boolean = false;

	constructor(
		private render: Renderer2,
		private cdr: ChangeDetectorRef,
		private inventoryService: InventoryService,
		private store: Store<AppState>,
		private warehouseActions: WarehouseActions,
		private generalService: GeneralService,
		private settingsFinancialYearActions: SettingsFinancialYearActions,
		private toaster: ToasterService
	) {
		this.store.dispatch(this.settingsFinancialYearActions.getFinancialYearLimits());
	}

	/**
	* Lifecycle hook for initialization
	*
	* @memberof StockBalanceComponent
	*/
	public ngOnInit(): void {
		this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
		this.isLoading = true;
		this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
		this.getStockUnits();
		this.getStockGroups();
		this.getWarehouses();
		this.GroupStockReportRequest = new GroupStockReportRequest();
		this.stockReportRequest = new StockReportRequest();
		document.querySelector('body').classList.add('stock-balance');

		combineLatest([this.inventoryService.GetGroupsWithStocksFlatten(), this.store.pipe(select(state => state.warehouse.warehouses)), this.store.pipe(select(state => state.settings.financialYearLimits))]).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
			if (resp[0] && resp[1] && resp[2]) {
				this.isLoading = false;
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

		this.productNameSearching.valueChanges.pipe(
			debounceTime(700),
			distinctUntilChanged(),
			takeUntil(this.destroyed$)
		).subscribe(s => {
			this.GroupStockReportRequest.stockName = s;
			this.getStocks();
		});
	}

	/**
	* Get stock varients from stock unqiue name 
	*
	* @param {string} uniquename
	* @memberof StockBalanceComponent
	*/
	public getStockVariants(stock: any): void {
		if (!stock?.stock) {
			this.inventoryService.getStock(stock?.stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
				if (response?.status === "success") {
					stock.stock = response?.body;
					stock?.stock?.variants.forEach(variant => {
						this.warehouses.forEach(warehouse => {
							const warehouseFound = variant?.warehouseBalance?.filter(balance => balance.warehouse?.uniqueName === warehouse?.uniqueName);
							if (!warehouseFound?.length) {
								variant.warehouseBalance.push({
									openingAmount: 0, openingQuantity: 0, stockUnit: stock.stock.stockUnit, warehouse: { name: warehouse.name, uniqueName: warehouse?.uniqueName }
								});
							}
						});
					});
					stock.stock.stockUnitCode = response?.body?.stockUnit?.code;
					stock.stock.stockUnitName = response?.body?.stockUnit?.name;
				}
			});
		}
	}

	/**
	* Get stock details
	*
	* @memberof StockBalanceComponent
	*/
	public getStocks(): void {
		if (this.GroupStockReportRequest.stockGroupUniqueName && this.GroupStockReportRequest.warehouseUniqueName) {
			if (!this.selectedWarehouse.includes(this.GroupStockReportRequest.warehouseUniqueName)) {
				this.selectedWarehouse.push(this.GroupStockReportRequest.warehouseUniqueName);
			}
			if (!this.allSelectedWarehouse.includes(this.GroupStockReportRequest.warehouseUniqueName)) {
				this.allSelectedWarehouse.push(this.GroupStockReportRequest.warehouseUniqueName);
			}
			let groupStockReportRequest = cloneDeep(this.GroupStockReportRequest);
			delete groupStockReportRequest.warehouseUniqueName;
			this.inventoryService.GetGroupStocksReport_V3(groupStockReportRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
				if (response) {
					this.stocksList = response?.body?.stockReport;
					this.stockGroupName = response?.body?.stockGroupName;
					this.stocksList?.forEach(stock => {
						stock.warehouses = [];
						this.warehouses?.forEach(warehouse => {
							stock.warehouses.push({ name: warehouse.name, uniqueName: warehouse?.uniqueName });
						});
					});

					this.allSelectedWarehouse.forEach(warehouse => {
						this.selectWarehouse(warehouse);
					});
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
			if (!warehouses?.results?.length) {
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
	public selectWarehouse(uniqueName: any): void {
		if (uniqueName) {
			this.GroupStockReportRequest.warehouseUniqueName = uniqueName;
			this.inventoryService.GetGroupStocksReport_V3(this.GroupStockReportRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
				if (response) {
					let warehouseStocksList = response?.body?.stockReport;
					if (warehouseStocksList?.length > 0) {
						warehouseStocksList.forEach(warehouseStock => {
							const stockFound = this.stocksList?.filter(stock => stock.stockUniqueName === warehouseStock?.stockUniqueName);
							if (stockFound?.length > 0) {
								if (stockFound[0]?.warehouses?.length > 0) {
									const warehouseFound = stockFound[0]?.warehouses?.filter(warehouse => warehouse?.uniqueName === uniqueName);
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
	* This function will use for update selected warehouse
	*
	* @memberof StockBalanceComponent
	*/
	public updateSelectedWarehouse(uniqueName: any): void {
		if (this.allSelectedWarehouse?.includes(uniqueName)) {
			this.allSelectedWarehouse = this.generalService.removeValueFromArray(this.allSelectedWarehouse, uniqueName);
		} else {
			this.allSelectedWarehouse.push(uniqueName);
		}
	}

	/**
	* Callback for selection of group name
	*
	* @param {*} field
	* @memberof StockBalanceComponent
	*/
	public selectGroupName(event: any): void {
		this.GroupStockReportRequest.stockGroupUniqueName = event.value;
		this.getStocks();
	}

	/**
	* Update a stock according to warehouse
	*
	* @memberof StockBalanceComponent
	*/
	public stockUpdate(stock: any): void {
		setTimeout(() => {
			this.inventoryService.updateStock(stock?.stock, stock?.stock?.stockGroup?.uniqueName, stock?.stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
				if (response?.status === "success") {
					this.toaster.showSnackBar("success", "Stock updated successfully");
				} else {
					this.toaster.showSnackBar("error", response?.message);
				}
			});
		}, 3000);
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
						label: result.name + ` (${result.code})`,
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
	* @memberof StockBalanceComponent
	*/
	private arrangeStockGroups(groups: IGroupsWithStocksHierarchyMinItem[], parents: IOption[] = []): void {
		groups.map(group => {
			if (group) {
				let newOption: IOption = { label: '', value: '', additional: {} };
				newOption.label = group?.name;
				newOption.value = group?.uniqueName;
				newOption.additional = group;
				parents.push(newOption);
				if (group?.childStockGroups?.length > 0) {
					this.arrangeStockGroups(group?.childStockGroups, parents);
				}
			}
		});
	}

	/**
	 * This will use for focus on warehouse click
	 *
	 * @memberof StockBalanceComponent
	 */
	public setInputFocus(event: any): void {
		setTimeout(() => {
			if (event === 1) {
				this.warehouseInput1.nativeElement.focus();
				this.isOpen = false;
			} else if (event === 2) {
				this.warehouseInput2.nativeElement.focus();
				this.isOpen = false;
			} else {
				this.isOpen = true;
			}
			this.cdr.detectChanges();
		}, 20);
	}

	/**
	* Lifecycle hook for destroy
	*
	* @memberof StockBalanceComponent
	*/
	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
		document.querySelector('body').classList.remove('stock-balance');
	}
}

