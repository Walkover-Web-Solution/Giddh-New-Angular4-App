import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewChildren, QueryList, AfterViewInit, Renderer2 } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, ReplaySubject, debounceTime, distinctUntilChanged, filter, of, take, takeUntil, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { InventoryModuleName } from '../../inventory.enum';
import { PAGE_SIZE_OPTIONS, IOption, PAGINATION_LIMIT_BULK_STOCK } from '../../../app.constant';
import { PageEvent } from '@angular/material/paginator';
import { InventoryComponentStore } from '../inventory.store';
import { SalesService } from '../../../services/sales.service';
import { InventoryService } from '../../../services/inventory.service';
import { CompanyActions } from '../../../actions/company.actions';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groups-with-stocks.interface';
import { ManufacturingService } from '../../../services/manufacturing.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { FieldTypes } from '../../../custom-fields/custom-fields.constant';
import { IDiscountList } from '../../../models/api-models/SettingsDiscount';
import { cloneDeep, find, findIndex, forEach, get, has, includes, isEqual, keys, map, set, toArray } from '../../../lodash-optimized';

@Component({
    selector: 'bulk-stock',
    
    templateUrl: './bulk-stock-edit.component.html',
    standalone: false,
    styleUrls: ['./bulk-stock-edit.component.scss'],
    providers: [InventoryComponentStore]
})

export class BulkStockEditComponent implements OnInit, OnDestroy, AfterViewInit {

    /** Store Advance search dialog template reference*/
    @ViewChild('bulkStockAdvanceFilter') public bulkStockAdvanceFilter: TemplateRef<any>
    /** ViewChildren for tax select dropdowns */
    @ViewChildren('taxSelect') public taxSelects: QueryList<MatSelect>;
    /** ViewChildren for menu triggers */
    @ViewChildren(MatMenuTrigger) menuTriggers!: QueryList<MatMenuTrigger>;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds Inventory Type */
    public inventoryType: string;
    /** Holds Pagination Info*/
    public pagination: any;
    /**Holds Page count in single page for Pagination */
    public pageCount: number = PAGINATION_LIMIT_BULK_STOCK;
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Holds Total Item(stock) get from API */
    public totalInventoryCount: number;
    /** Holds recent sort order*/
    public sortOrderStatus: null | 'asc' | 'desc' = null;
    /** Holds recent sorted key*/
    public sortOrderKey: string = null;
    /** Holds recent search text*/
    public searchString: string = null;
    /** Holds recent search on which key*/
    public searchStringKey: string = null;
    /** Holds Loader status */
    public isLoading: boolean = true;
    /** Taxes list */
    // public taxes: any[] = [];
    /** Holds list of selected taxes */
    // private selectedTaxes: any[] = [];
    /** True if tax selection box is open */
    // public isTaxSelectionOpen: boolean = false;
    /** Holds list of taxes processed while tax selection box was closed */
    // public processedTaxes: any[] = [];
    /** True if we need to show tax field. We are maintaining this because taxes are not getting reset on form reset */
    // public showTaxField: boolean = true;
    /** Stock groups list */
    // public stockGroups: IOption[] = [];
    /** Holds stock group unique name */
    // public stockGroupUniqueName: string = "";
    /** Holds Advance search dailog ref*/
    public advanceFilterDialogRef: MatDialogRef<any>;
    /** Holds Recent Advance search data*/
    public advanceSearchData: any = null;
    /** Holds hide show column list*/
    public hideShowColumnList: any = [];
    /** Holds Table Head Input Fileds open/close status*/
    public tableHeadInput = {
        variantName: false,
        variantUniqueName: false,
        stockName: false,
        stockUniqueName: false,
        stockGroupName: false,
        hsn: false,
        sac: false,
        skuCode: false
    };
    /** Holds bulkStockEditForm Form Group  */
    public bulkStockEditForm: UntypedFormGroup;
    /** Store Dropdown fields value get from API */
    public dropdownValues: any[] = [];
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;
    /** Holds module name */
    public moduleName: string = "";
    /** Stores the Table head VariantName input value for the search filter */
    public thVariantName: UntypedFormControl = new UntypedFormControl();
    /** Stores the Table head VariantUniqueName input value for the search filter */
    public thVariantUniqueName: UntypedFormControl = new UntypedFormControl();
    /** Stores the Table head StockName input value for the search filter */
    public thStockName: UntypedFormControl = new UntypedFormControl();
    /** Stores the Table head StockUniqueName input value for the search filter */
    public thStockUniqueName: UntypedFormControl = new UntypedFormControl();
    /** Stores the Table head StockGroupName input value for the search filter */
    public thStockGroupName: UntypedFormControl = new UntypedFormControl();
    /** Stores the Table head HSN input value for the search filter */
    public thHsn: UntypedFormControl = new UntypedFormControl();
    /** Stores the Table head SAC input value for the search filter */
    public thSac: UntypedFormControl = new UntypedFormControl();
    /** Stores the Table head SkuCode input value for the search filter */
    public thSkuCode: UntypedFormControl = new UntypedFormControl();
    /** Hold no data found status */
    public noDataFound: boolean = false;
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds Table Head Input Fileds open/close status*/
    public tableHeaderShowHide = {
        variantName: true,
        variantUniqueName: false,
        stockName: true,
        stockUniqueName: false,
        stockGroupName: true,
        stockGroupUniqueName: false,
        stockUnit: true,

        purchaseUnits: false,
        purchaseAccountName: false,
        purchaseAccountUniqueName: false,
        purchaseRate: true,
        purchaseTaxInclusive: false,

        salesUnits: false,
        salesAccountName: false,
        salesAccountUniqueName: false,
        salesRate: true,
        salesTaxInclusive: false,

        fixedAssetUnits: false,
        fixedAssetRate: true,
        fixedAssetAccountName: false,
        fixedAssetAccountUniqueName: false,
        fixedAssetTaxInclusive: false,

        hsnNo: true,
        sacNo: true,
        skuCode: false,
        archive: true,
        taxes: false,
        customFields: false,
        discountName: false,
    };
    /** This will use for report custom fields column check values */
    public newCustomFieldsColumns: any[] = [];
    /** Custom Fields list Observable */
    public customFieldsSuccess$: Observable<any> = this.inventoryStore.customFieldsSuccess$;
    /** Custom fields request */
    public customFieldsVariantRequest: any = {
        page: 0,
        count: 0,
        moduleUniqueName: 'variant'
    };
    /** This will use for report custom fields column check values */
    public tableHeaderDynamicColumns: any[] = [];
    /** True if Api called once time */
    public isApiCalled: boolean = false;
    /** This will use for select table row index */
    public selectTableRowIndex: number = -1;
    /** This will use for sales account list */
    public salesAccountList: any[] = [];
    /** This will use for purchase account list */
    public purchaseAccountList: any[] = [];
    /** This will use for stock unit group list */
    public stockUnitGroupList: any[] = [];
    /** This will use for fixed asset account list */
    public fixedAssetAccountList: any[] = [];
    /** This will use for taxes list */
    public taxes: any[] = [];
    /** This will use for taxes list Observable */
    public taxes$: Observable<any>;
    /** This will use for filtered taxes list */
    public filteredTaxesList: any[] = [];
    /** This will use for stock main units list */
    public stockMainUnits: any[] = [];
    /** This will use for select table row name */
    public selectTableRowName: string = '';
    /** This will use for instance of tax Dropdown */
    public taxDropdown: FormControl = new FormControl();
    /** Holds list of selected taxes - index wise for each row */
    public selectedTaxes: any[][] = [];
    /** True if tax selection box is open */
    public isTaxSelectionOpen: boolean = false;
    /** Holds list of taxes processed while tax selection box was closed */
    public processedTaxes: any[] = [];
    /** Temporary array to hold selected taxes - index wise for each row */
    public taxTempArray: any[][] = [];
    /** This will use for taxes list Observable - index wise for each row */
    public taxesList: any[][] = [];
    /** Available field types list */
    public availableFieldTypes: any = FieldTypes;
    /** Number of menus per row */
    public get menusPerRow(): number {
        const firstRowMenus = document.querySelectorAll('tr:first-child mat-menu').length;
        return firstRowMenus || 0;
    }
    /** All custom fields */
    public allCustomField: any = {};
    /** Discounts list Observable */
    public discountsList$: Observable<any> = this.inventoryStore.discountsList$;
    /** Discounts list */
    public discountsList: IDiscountList[] = [];

    constructor(
        private route: ActivatedRoute,
        private formBuilder: UntypedFormBuilder,
        private store: Store<AppState>,
        private inventoryAction: InventoryAction,
        private dailog: MatDialog,
        private cdr: ChangeDetectorRef,
        private inventoryStore: InventoryComponentStore,
        private salesService: SalesService,
        private inventoryService: InventoryService,
        private manufacturingService: ManufacturingService,
        private companyAction: CompanyActions,
        private renderer: Renderer2
    ) {
        this.initBulkStockForm();
        this.getCustomFields();
        this.customFieldsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const results = response.map(result => {
                    this.allCustomField[result.uniqueName] = result;
                    return {
                        label: result.fieldName,
                        value: result.uniqueName,
                        checked: false,
                        type: result.fieldType
                    }
                }) || [];
                this.newCustomFieldsColumns = results;
                this.cdr.detectChanges();
            }
        });
    }

    /**
     * Initializes the component,
     * get Inventory type  and call getBulkStockList api and then get list from Store
     * @memberof BulkStockEditComponent
     */
    public ngOnInit(): void {
        // Add CSS class to body element
        this.renderer.addClass(document.body, 'bulk-stock-edit');
        this.searchInputObservableInitialize();
        
        this.store.pipe(
            select(select => select.inventory.bulkStock),
            takeUntil(this.destroyed$)
        ).subscribe((res: any) => {
            this.isLoading = false;
            if (res && res?.results) {
                this.isApiCalled = false;
                const bulkStockForm = this.bulkStockData;
                bulkStockForm.clear();
                this.setPaginationData(res);
                this.noDataFound = res.totalItems === 0;
                this.totalInventoryCount = res?.totalItems;
                res.results.forEach((row: any, index: number) => {
                    this.dropdownValues[index] = row;
                    this.dropdownValues[index].hsnNo = row?.hsnNo || "";
                    this.dropdownValues[index].sacNo = row?.sacNo || "";
                    this.dropdownValues[index].purchaseUnits = [{code: row?.purchaseUnits?.[0]?.code ?? null, uniqueName: row?.purchaseUnits?.[0]?.uniqueName ?? null}];
                    this.dropdownValues[index].salesUnits = [{code: row?.salesUnits?.[0]?.code ?? null, uniqueName: row?.salesUnits?.[0]?.uniqueName ?? null}];
                    this.dropdownValues[index].fixedAssetUnits = [{code: row?.fixedAssetUnits?.[0]?.code ?? null, uniqueName: row?.fixedAssetUnits?.[0]?.uniqueName ?? null}];
                    this.addRow(row);
                });
            }
        });

        this.taxDropdown.valueChanges.pipe(debounceTime(700),
            takeUntil(this.destroyed$)).subscribe((search: string) => {
                if (!search) {
                    this.taxes$.pipe(take(1)).subscribe(res => {
                        this.filteredTaxesList = res as IOption[];
                    });
                } else {
                    this.taxes$.pipe(take(1)).subscribe(res => {
                        this.filteredTaxesList = res?.filter((tax: IOption) => tax?.label?.toLowerCase()?.includes(search?.toLowerCase())) as IOption[];
                    });
                }
                this.cdr.detectChanges();
            });

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.type) {

                this.inventoryType = params.type == 'fixedassets' ? 'FIXED_ASSETS' : params?.type.toUpperCase();
                this.moduleName = this.inventoryType === 'FIXED_ASSETS' ? InventoryModuleName.fixedAssetInventory : InventoryModuleName.bulk;
                this.isLoading = true;
                this.resetSearch();
            }
        });

        this.salesService.getAccountsWithCurrency('revenuefromoperations, otherincome').pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data.body?.results?.length > 0) {
                this.salesAccountList = data.body.results.map((item: any) => {
                    return {
                        label: item.name,
                        value: item.uniqueName,
                        additional: item
                    }
                });
                this.cdr.detectChanges();
            }
        });
        this.salesService.getAccountsWithCurrency('operatingcost, indirectexpenses').pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data.body?.results?.length > 0) {
                this.purchaseAccountList = data.body.results.map((item: any) => {
                    return {
                        label: item.name,
                        value: item.uniqueName,
                        additional: item
                    }
                });
                this.cdr.detectChanges();
            }
        });

        this.salesService.getAccountsWithCurrency('fixedassets').pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data.body?.results?.length > 0) {
                this.fixedAssetAccountList = data.body.results.map((item: any) => {
                    return {
                        label: item.name,
                        value: item.uniqueName,
                        additional: item
                    }
                });
                this.cdr.detectChanges();
            }
        });

        this.getTaxes();
        this.getStockGroups();
        this.getAllDiscounts();

        this.bulkStockEditForm.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe((searchedText: any) => {
            if (searchedText && this.selectTableRowIndex !== -1) {
                this.valueChangesOnUpdate(this.selectTableRowIndex);
            }
        });
    }

    /**
     * Get all discounts
     *
     * @private
     * @memberof StockCreateEditComponent
     */
    private getAllDiscounts(): void {
        this.discountsList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.discountsList = response;
            }
        });
        this.inventoryStore.getDiscountList();
    }

    /**
     * This will use for get stock groups
     * 
     * @memberof BulkStockEditComponent
     */
    public getStockGroups(): void {
        this.inventoryService.GetGroupsWithStocksFlatten(this.inventoryType).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.stockUnitGroupList = [];
                this.arrangeStockGroups(response.body?.results, this.stockUnitGroupList);
            }
        });
        this.cdr.detectChanges();
    }

    /**
     * This will use for arrange stock groups
     *
     * @private
     * @param {IGroupsWithStocksHierarchyMinItem[]} groups
     * @param {IOption[]} [parents=[]]
     * @memberof BulkStockEditComponent
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
        this.cdr.detectChanges();
    }

    /**
     * This will use for value changes on update
     * 
     * @param {number} selectTableRowIndex
     * @memberof BulkStockEditComponent
     */
    public valueChangesOnUpdate(selectTableRowIndex: number) {
        const requestBody = {
            stockUniqueName: this.bulkStockData.value[selectTableRowIndex].stockUniqueName,
            variantUniqueName: this.bulkStockData.value[selectTableRowIndex].variantUniqueName
        }
        const unitFields = ['fixedAssetUnits', 'purchaseUnits', 'salesUnits'];
        const customFields = ['customFields'];
        const currentFieldsData = this.bulkStockData.value[selectTableRowIndex];
        Object.keys(currentFieldsData).forEach(key => {
            if (unitFields.includes(key)) {
                if (!isEqual(currentFieldsData[key], this.dropdownValues[selectTableRowIndex][key][0]?.uniqueName)) {
                    requestBody[key] = currentFieldsData[key] ? [{ uniqueName: currentFieldsData[key] }] : [];
                }
            } else if (customFields.includes(key)) {
                requestBody[key] = [];
                currentFieldsData[key].forEach((item: any, index: number) => {
                    if (!isEqual(item, this.dropdownValues[selectTableRowIndex][key][index])) {
                        requestBody[key].push(item);
                    }
                });
                if (requestBody[key].length === 0) {
                    delete requestBody[key];
                }
            } else {
                if (!isEqual(currentFieldsData[key], this.dropdownValues[selectTableRowIndex][key])) {
                    requestBody[key] = currentFieldsData[key];
                }
            }
        });
        this.updateForm(requestBody, selectTableRowIndex);
    }

    /**
     * This will use for hide table input
     * 
     * @memberof BulkStockEditComponent
     */
    public hideTableInput(): void {
        if (this.selectTableRowIndex !== -1) {
            // Close mat-menus for current row
            for (let i = 0; i < this.menusPerRow; i++) {
                this.menuTriggers.get((this.selectTableRowIndex * this.menusPerRow) + i).closeMenu();
            }
        }
        this.selectTableRowIndex = -1;
    }

    /**
     * This will use for show table input
     * 
     * @param {any} $event
     * @param {number} index
     * @memberof BulkStockEditComponent
     */
    public showTableInput($event: any, index: number): void {
        $event.stopPropagation();
        if (this.selectTableRowIndex !== -1 && this.selectTableRowIndex !== index) {
            // Close mat-menus for previous row
            for (let i = 0; i < this.menusPerRow; i++) {
                this.menuTriggers.get((this.selectTableRowIndex * this.menusPerRow) + i).closeMenu();
            }
        }
        this.selectTableRowIndex = index;
        this.getStockUnits(index);
    }

    /**
     * This will use for get taxes
     * 
     * @memberof BulkStockEditComponent
     */
    public getTaxes(): void {
        this.store.dispatch(this.companyAction.getTax());
        this.store.pipe(select(state => state?.company?.taxes), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.length > 0) {
                this.taxes = response || [];
                this.taxes$ = of(this.taxes);
                this.filteredTaxesList = this.taxes;
            }
            this.cdr.detectChanges();
        });
    }

    /**
     * Select tax for bulk stock edit - adapted for multiple rows
     *
     * @param {*} taxSelected - Selected tax object
     * @memberof BulkStockEditComponent
     */
    public selectTax(taxSelected: any, selectTableRowIndex: number): void {
        if (!taxSelected) {
            return;
        }
        // For bulk edit, we need to handle tax selection per row
        const currentRowIndex = selectTableRowIndex;
        if (currentRowIndex === -1) {
            return;
        }

        // Initialize row-specific tax arrays if not exists
        if (!this.selectedTaxes[currentRowIndex]) {
            this.selectedTaxes[currentRowIndex] = [];
        }
        if (!this.taxTempArray[currentRowIndex]) {
            this.taxTempArray[currentRowIndex] = [];
        }
        if (!this.taxesList[currentRowIndex]) {
            this.taxesList[currentRowIndex] = cloneDeep(this.taxes);
        }

        // Work with row-specific tax list to maintain state per row
        let rowTaxes = this.taxesList[currentRowIndex];

        if (!this.isTaxSelectionOpen) {
            if (this.processedTaxes.includes(taxSelected.uniqueName)) {
                return;
            }
            this.processedTaxes.push(taxSelected.uniqueName);
        }

        let isSelected = this.selectedTaxes[currentRowIndex]?.filter(selectedTax => selectedTax === taxSelected.uniqueName);
        
        if (taxSelected.taxType !== 'gstcess') {
            let index = this.taxTempArray[currentRowIndex].findIndex((taxTemp) => taxTemp.taxType === taxSelected.taxType);
            
            if (index > -1 && !isSelected?.length) {
                rowTaxes.forEach((tax) => {
                    if (tax.taxType === taxSelected.taxType) {
                        tax.isChecked = false;
                        tax.isDisabled = true;
                    }
                    if ((taxSelected.taxType === 'tcsrc' || taxSelected.taxType === 'tdsrc' || taxSelected.taxType === 'tcspay' || taxSelected.taxType === 'tdspay') &&
                        (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay')) {
                        tax.isChecked = false;
                        tax.isDisabled = true;
                    }
                });
            }

            if (index < 0 && !isSelected?.length) {
                rowTaxes.forEach((tax) => {
                    if (tax.taxType === taxSelected.taxType) {
                        tax.isChecked = false;
                        tax.isDisabled = true;
                    }

                    if ((taxSelected.taxType === 'tcsrc' || taxSelected.taxType === 'tdsrc' || taxSelected.taxType === 'tcspay' || taxSelected.taxType === 'tdspay') &&
                        (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay')) {
                        tax.isChecked = false;
                        tax.isDisabled = true;
                    }
                    if (tax?.uniqueName === taxSelected.uniqueName) {
                        tax.isChecked = true;
                        tax.isDisabled = false;
                        this.taxTempArray[currentRowIndex].push(cloneDeep(tax));
                    }
                });
            } else if (index > -1 && !isSelected?.length) {
                // Find and update the tax in row-specific list
                let rowTax = rowTaxes.find(tax => tax.uniqueName === taxSelected.uniqueName);
                if (rowTax) {
                    rowTax.isChecked = true;
                    rowTax.isDisabled = false;
                }
                this.taxTempArray[currentRowIndex] = this.taxTempArray[currentRowIndex]?.filter(taxTemp => {
                    return taxSelected.taxType !== taxTemp.taxType;
                });
                this.taxTempArray[currentRowIndex].push(cloneDeep(rowTax || taxSelected));
            } else {
                let idx = this.taxTempArray[currentRowIndex].findIndex((taxTemp) => taxTemp?.uniqueName === taxSelected.uniqueName);
                this.taxTempArray[currentRowIndex].splice(idx, 1);
                // Update row-specific tax list
                let rowTax = rowTaxes.find(tax => tax.uniqueName === taxSelected.uniqueName);
                if (rowTax) {
                    rowTax.isChecked = false;
                }
                rowTaxes.forEach((tax) => {
                    if (tax.taxType === taxSelected.taxType) {
                        tax.isDisabled = false;
                    }
                    if ((taxSelected.taxType === 'tcsrc' || taxSelected.taxType === 'tdsrc' || taxSelected.taxType === 'tcspay' || taxSelected.taxType === 'tdspay') &&
                        (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay')) {
                        tax.isDisabled = false;
                    }
                });
            }
        } else {
            if (!isSelected?.length) {
                let rowTax = rowTaxes.find(tax => tax.uniqueName === taxSelected.uniqueName);
                if (rowTax) {
                    rowTax.isChecked = true;
                }
                this.taxTempArray[currentRowIndex].push(cloneDeep(rowTax || taxSelected));
            } else {
                let idx = this.taxTempArray[currentRowIndex].findIndex((taxTemp) => taxTemp?.uniqueName === taxSelected.uniqueName);
                this.taxTempArray[currentRowIndex].splice(idx, 1);
                let rowTax = rowTaxes.find(tax => tax.uniqueName === taxSelected.uniqueName);
                if (rowTax) {
                    rowTax.isChecked = false;
                }
            }
        }

        // Update selected taxes for current row
        this.selectedTaxes[currentRowIndex] = this.taxTempArray[currentRowIndex].map(tax => tax?.uniqueName);
        this.cdr.detectChanges();
    }

    /**
     * Handle tax dropdown open/close events
     *
     * @param {boolean} isOpen - Whether the dropdown is open
     * @memberof BulkStockEditComponent
     */
    public openedSelectTax(isOpen: boolean): void {
        this.isTaxSelectionOpen = isOpen;

        if (!isOpen) {
            // When dropdown closes, clear processed taxes for this session
            this.processedTaxes = [];
        }
    }

    /**
     * Get taxes for a specific row index
     *
     * @param {number} rowIndex - The row index
     * @returns {any[]} Array of taxes for the row
     * @memberof BulkStockEditComponent
     */
    public getTaxesForRow(rowIndex: number): any[] {
        if (!this.taxesList[rowIndex]) {
            this.taxesList[rowIndex] = cloneDeep(this.taxes);
        }
        return this.taxesList[rowIndex] || [];
    }

    /**
     * This will use for get stock units
     * 
     * @param {number} index
     * @memberof BulkStockEditComponent
     */
    public getStockUnits(index: number): void {
        this.stockMainUnits = [];
        if (!this.bulkStockData.value[index].stockUnitUniqueName) {
            return;
        }

        this.manufacturingService.loadStockUnits(this.bulkStockData.value[index].stockUnitUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(units => {
            if (units?.length) {
                units?.forEach(unit => {
                    this.stockMainUnits.push({ label: unit?.code, value: unit?.uniqueName });
                });
            }
        });
        this.cdr.detectChanges();
    }

    /**
     * This will use for init Bulk stock formgroup
     * @private
     * @memberof BulkStockEditComponent
     */
    private initBulkStockForm(): void {
        this.bulkStockEditForm = this.formBuilder.group({
            fields: this.formBuilder.array([])
        });
    }

    /**
     * The addNewRow(controlValue) is used to store FormArray at run time in  "bulkStockEditForm" form group
     *
     * @private
     * @param {*} controlValue
     * @return {*}  {FormGroup}
     * @memberof BulkStockEditComponent
     */
    private addNewRow(controlValue: any): FormGroup {
        return this.formBuilder.group({
            variantName: [controlValue.variantName, Validators.required],
            variantUniqueName: [controlValue.variantUniqueName, Validators.required],

            stockName: [controlValue.stockName, Validators.required],
            stockUniqueName: [controlValue.stockUniqueName, Validators.required],
            stockGroupName: [controlValue.stockGroupName, Validators.required],
            stockGroupUniqueName: [controlValue.stockGroupUniqueName, Validators.required],
            stockUnitCode: [controlValue.stockUnitCode, Validators.required],
            stockUnitName: [controlValue.stockUnitName, Validators.required],
            stockUnitUniqueName: [controlValue.stockUnitUniqueName, Validators.required],

            purchaseUnitsCode: [(controlValue.purchaseUnits?.length && controlValue.purchaseUnits[0] !== null ? controlValue.purchaseUnits[0]?.code : ""), Validators.required],
            purchaseUnits: [(controlValue.purchaseUnits?.length && controlValue.purchaseUnits[0] !== null ? controlValue.purchaseUnits[0]?.uniqueName : ""), Validators.required],
            purchaseAccountName: [controlValue.purchaseAccountName, Validators.required],
            purchaseAccountUniqueName: [controlValue.purchaseAccountUniqueName, Validators.required],
            purchaseRate: [controlValue.purchaseRate, Validators.required],
            purchaseTaxInclusive: [controlValue.purchaseTaxInclusive, Validators.required],

            salesUnitsCode: [(controlValue.salesUnits?.length && controlValue.salesUnits[0] !== null ? controlValue.salesUnits[0]?.code : ""), Validators.required],
            salesUnits: [(controlValue.salesUnits?.length && controlValue.salesUnits[0] !== null ? controlValue.salesUnits[0]?.uniqueName : ""), Validators.required],
            salesAccountName: [controlValue.salesAccountName, Validators.required],
            salesAccountUniqueName: [controlValue.salesAccountUniqueName, Validators.required],
            salesRate: [controlValue.salesRate, Validators.required],
            salesTaxInclusive: [controlValue.salesTaxInclusive, Validators.required],

            fixedAssetTaxInclusive: [controlValue.fixedAssetTaxInclusive, Validators.required],
            fixedAssetRate: [controlValue.fixedAssetRate, Validators.required],
            fixedAssetUnitsCode: [(controlValue.fixedAssetUnits?.length && controlValue.fixedAssetUnits[0] !== null ? controlValue.fixedAssetUnits[0]?.code : ""), Validators.required],
            fixedAssetUnits: [(controlValue.fixedAssetUnits?.length && controlValue.fixedAssetUnits[0] !== null ? controlValue.fixedAssetUnits[0]?.uniqueName : ""), Validators.required],
            fixedAssetAccountName: [controlValue.fixedAssetAccountName, Validators.required],
            fixedAssetAccountUniqueName: [controlValue.fixedAssetAccountUniqueName, Validators.required],

            hsnNo: [controlValue.hsnNo || "", Validators.required],
            sacNo: [controlValue.sacNo || "", Validators.required],
            skuCode: [controlValue.skuCode, Validators.required],
            archive: [controlValue.archive, Validators.required],
            taxes: [controlValue.taxes, Validators.required],
            customFields: this.createCustomFieldsFormArray(controlValue.customFields),
            discountUniqueName: [controlValue.discountUniqueName, Validators.required],
            discountName: [controlValue.discountName, Validators.required],
        })
    }

    /**
     * Creates FormArray for custom fields
     * 
     * @param {any[]} customFields - Array of custom field objects
     * @returns {FormArray} FormArray containing FormGroups for each custom field
     * @memberof BulkStockEditComponent
     */
    private createCustomFieldsFormArray(customFields: any[]): FormArray {
        const formArray = this.formBuilder.array([]);

        if (customFields && customFields.length > 0) {
            customFields.forEach(field => {
                formArray.push(this.formBuilder.group({
                    key: [field.key || ''],
                    value: [field.value || ''],
                    uniqueName: [field.uniqueName || ''],
                    dataType: [field.dataType || '']
                }));
            });
        }

        return formArray;
    }

    /**
    * The addRow(data) is used to push addNewRow() in "bulkStockEditForm" Formgroup
    * @private
    * @param {*} data
    * @memberof BulkStockEditComponent
    */
    private addRow(data: any): void {
        const currentIndex = this.bulkStockData.length;
        // Initialize tax arrays for this row index
        this.selectedTaxes[currentIndex] = data.taxes ? data.taxes.map((tax: any) => tax.uniqueName) : [];
        this.taxTempArray[currentIndex] = data.taxes ? cloneDeep(data.taxes) : [];
        this.taxesList[currentIndex] = cloneDeep(this.taxes);

        this.bulkStockData.push(this.addNewRow(data));
    }

    /**
     * Getter method for "fields" of "bulkStockEditForm" Formgroup
     * @readonly
     * @type {FormArray}
     * @memberof BulkStockEditComponent
     */
    get bulkStockData(): FormArray {
        return this.bulkStockEditForm.get("fields") as FormArray
    }

    /**
     * NgFormSubmit for "bulkStockEditForm" Formgroup
     * @memberof BulkStockEditComponent
     */
    onFormSubmit(): void {
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof BulkStockEditComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
            this.cdr.detectChanges();
        }
    }

    /** 
     * This will use for update form data
     * 
     * @param {*} requestBody 
     * @param {*} selectTableRowIndex 
     * @memberof BulkStockEditComponent
     */
    public updateForm(requestBody: any, selectTableRowIndex: number): void {
        Object.keys(requestBody).forEach(field => {
            if (requestBody[field] === null || requestBody[field] === undefined) {
                delete requestBody[field];
            }
        });
        this.inventoryStore.updateInventoryVariant(requestBody);
        this.inventoryStore.updateInventoryVariantSuccess$.pipe(filter(Boolean), take(1)).subscribe((response) => {
            if (response) {
                Object.keys(response).forEach(key => {
                    if (key === 'customFields') {
                        response[key].forEach((field: any) => {
                            this.dropdownValues[selectTableRowIndex][key].forEach((customField: any, customFieldIndex: number) => {
                                if (customField.uniqueName === field.uniqueName) {
                                    this.dropdownValues[selectTableRowIndex][key][customFieldIndex] = field;
                                }
                            });
                        });
                    } else {
                        this.dropdownValues[selectTableRowIndex][key] = response[key];
                    }
                });
            }
        });
    }

    /**
     * Get select value from select field
     * @param {*} data
     * @memberof BulkStockEditComponent
     */
    public setPaginationData(data: any): void {
        this.pagination = {
            currentPage: data?.page,
            itemsPerPage: this.pageCount,
            totalPages: data?.totalPages,
            totalItems: data?.totalItems
        }
    }

    /**
    * Get Pagination page change event
    * @param {*} event
    * @memberof BulkStockEditComponent
    */
    /**
     * Handles pagination events and updates API parameters
     *
     * @param {PageEvent} event - Contains pagination details
     * @memberof BulkStockEditComponent
     */
    public handlePageEvent(event: PageEvent): void {
        if (this.pageCount !== event.pageSize) {
            this.pagination.currentPage = 1;
        } else {
            this.pagination.currentPage = event.pageIndex + 1;
        }
        this.pageCount = event.pageSize;
        this.isLoading = true;
        this.store.dispatch(this.inventoryAction.getBulkStockList({
            inventoryType: this.inventoryType,
            page: this.pagination.currentPage,
            count: this.pageCount,
            body: {
                "search": this.searchString !== null ? this.searchString : "",
                "searchBy": this.searchStringKey !== null ? this.searchStringKey : "",
                "filterBy": this.advanceSearchData !== null ? this.advanceSearchData?.filterBy?.value : "",
                "sortBy": this.sortOrderKey !== null ? this.sortOrderKey : "",
                "sort": this.sortOrderStatus !== null ? this.sortOrderStatus : "asc",
                "expression": this.advanceSearchData !== null ? this.advanceSearchData?.expression?.value : "",
                "rate": this.advanceSearchData !== null ? this.advanceSearchData?.amount : ""
            }
        }));
    }


    /**
     *toggleInput(key) is used to change boolean value of tableHeadInput
     * object key value to show hide table head input fields
     * @param {*} key
     * @memberof BulkStockEditComponent
     */
    public toggleInput(key: string): void {
        this.hideTableHeadInput();
        if (!(this.tableHeadInput[key] && this.searchString && this.searchStringKey)) {
            this.tableHeadInput[key] = !this.tableHeadInput[key];
        }
    }

    /**
     * This will false all the keys of tableHeadInput Object
     * which will hide all the input fields from table head on, this method trigger on click outside the table head
     * @memberof BulkStockEditComponent
     */
    public hideTableHeadInput(): void {
        Object.entries(this.tableHeadInput).forEach(([key]) => {
            if (this.tableHeadInput[key] && this.searchString && this.searchStringKey) {
                this.tableHeadInput[key] = true;
            } else {
                this.tableHeadInput[key] = false;
            }
        });
    }

    /**
     * Used to get "key name and Index value" of form array
     * @param {number} index
     * @param {string} key
     * @memberof BulkStockEditComponent
     */
    public getInputIndex(index: number, key: string): void {
        this.selectTableRowName = key;
        // Trigger dropdown opening if it's the taxes field
        if (key === 'archive' || key === 'salesTaxInclusive' || key === 'purchaseTaxInclusive' || key === 'fixedAssetTaxInclusive') {
            for (let i = 0; i < this.menusPerRow; i++) {
                if (key === 'archive' && i === 0 || key === 'salesTaxInclusive' && i === 1 || key === 'purchaseTaxInclusive' && i === 2 || key === 'fixedAssetTaxInclusive' && i === 3) {
                    continue;
                }
                this.menuTriggers.get((this.selectTableRowIndex * this.menusPerRow) + i)?.closeMenu();
            }
        } else {
            for (let i = 0; i < this.menusPerRow; i++) {
                this.menuTriggers.get((this.selectTableRowIndex * this.menusPerRow) + i)?.closeMenu();
            }
        }
        if (key === 'taxes') {
            setTimeout(() => {
                this.openTaxDropdownIfNeeded();
            }, 50);
        } else {
            const taxSelect = this.taxSelects.toArray()[0];
            if (taxSelect && taxSelect.panelOpen) {
                taxSelect.close();
                this.cdr.detectChanges();
            }
        }
    }

    /**
     * Used to create Observable for all table head input on value changes
     * @private
     * @memberof BulkStockEditComponent
     */
    private searchInputObservableInitialize(): void {
        this.thVariantName.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.searchBy(searchedText, "variant_name");
            }
        });

        this.thVariantUniqueName.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.searchBy(searchedText, "variant_unique_name");
            }
        });

        this.thStockName.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.searchBy(searchedText, "stock_name");
            }
        });

        this.thStockUniqueName.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.searchBy(searchedText, "stock_unique_name");
            }
        });

        this.thStockGroupName.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.searchBy(searchedText, "stock_group_name");
            }
        });

        this.thHsn.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.searchBy(searchedText, "hsn");
            }
        });

        this.thSac.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.searchBy(searchedText, "sac");
            }
        });

        this.thSkuCode.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.searchBy(searchedText, "sku");
            }
        });
    }
    /**
     * Sort Table column ASC | DESC*
     * @param {string} key
     * @memberof BulkStockEditComponent
     */
    public sort(key: string): void {
        if (this.sortOrderStatus === null || this.sortOrderStatus === 'desc') {
            this.sortOrderStatus = 'asc';
        } else {
            this.sortOrderStatus = 'desc';
        }
        this.sortOrderKey = key;
        this.isLoading = true;
        this.store.dispatch(this.inventoryAction.getBulkStockList({
            inventoryType: this.inventoryType, page: 1, count: this.pageCount, body: {
                "search": this.searchString !== null ? this.searchString : "",
                "searchBy": this.searchStringKey !== null ? this.searchStringKey : "",
                "filterBy": this.advanceSearchData !== null ? this.advanceSearchData?.filterBy?.value : "",
                "sortBy": this.sortOrderKey,
                "sort": this.sortOrderStatus,
                "expression": this.advanceSearchData !== null ? this.advanceSearchData?.expression?.value : "GREATER_THAN",
                "rate": this.advanceSearchData !== null ? this.advanceSearchData?.amount : 0,
            }
        }));
    }

    /**
     * It call API and send custom body in payload with KEY and SEARCH TEXT
     * @private
     * @param {string} searchedText
     * @param {string} key
     * @memberof BulkStockEditComponent
     */
    private searchBy(searchedText: string, key: string): void {
        this.searchString = searchedText;
        this.searchStringKey = key;
        let bodyObj;
        if (this.advanceSearchData !== null) {
            bodyObj = {
                "search": searchedText,
                "searchBy": key,
                "filterBy": this.advanceSearchData?.filterBy?.value,
                "sortBy": this.sortOrderKey !== null ? this.sortOrderKey : "",
                "sort": this.sortOrderStatus !== null ? this.sortOrderStatus : "",
                "expression": this.advanceSearchData?.expression?.value,
                "rate": this.advanceSearchData?.amount
            }
        } else {
            bodyObj = {
                "search": searchedText,
                "searchBy": key,
                "sortBy": this.sortOrderKey !== null ? this.sortOrderKey : "",
                "sort": this.sortOrderStatus !== null ? this.sortOrderStatus : "",
                "filterBy": "",
                "expression": "GREATER_THAN",
                "rate": 0
            }
        }
        this.isLoading = true;
        this.store.dispatch(this.inventoryAction.getBulkStockList({
            inventoryType: this.inventoryType, page: 1, count: this.pageCount, body: bodyObj
        }));
    }

    /**
     * Open advance search Dialog
     * @memberof BulkStockEditComponent
     */
    public openAdvanceFilter(): void {
        this.advanceFilterDialogRef = this.dailog.open(this.bulkStockAdvanceFilter, {
            width: '600px'
        })
    }

    /**
     * Reset all the search/ sort value to intial value
     * @memberof BulkStockEditComponent
     */
    public resetSearch(): void {
        this.thVariantName.reset();
        this.thVariantUniqueName.reset();
        this.thStockName.reset();
        this.thStockUniqueName.reset();
        this.thStockGroupName.reset();
        this.thHsn.reset();
        this.thSac.reset();
        this.thSkuCode.reset();
        this.searchString = null;
        this.searchStringKey = null;
        this.sortOrderStatus = null;
        this.advanceSearchData = null;
        this.hideTableHeadInput();
        this.isLoading = false;

        if (this.isApiCalled) {
            this.store.dispatch(this.inventoryAction.getBulkStockList({
                inventoryType: this.inventoryType, page: 1, count: this.pageCount, body: {
                    "search": "",
                    "searchBy": "",
                    "filterBy": "",
                    "sortBy": "",
                    "sort": "",
                    "expression": "GREATER_THAN",
                    "rate": 0
                }
            }));
        }

    }

    /**
     * Apply Advance search
     * @param {*} event
     * @memberof BulkStockEditComponent
     */
    public applyAdvanceFilter(event: any): void {
        this.advanceFilterDialogRef.close();
        this.advanceSearchData = event;
        this.isLoading = true;
        this.store.dispatch(this.inventoryAction.getBulkStockList({
            inventoryType: this.inventoryType, page: 1, count: this.pageCount, body: {
                "filterBy": this.advanceSearchData?.filterBy?.value,
                "expression": this.advanceSearchData?.expression?.value,
                "rate": this.advanceSearchData?.amount
            }
        }));
    }

    /**
     * This function reset hideshowForm  and set true to user selected value which get from API
     * @param {*} event
     * @memberof BulkStockEditComponent
     */
    public setDisplayColumns(columns: any): void {
        setTimeout(() => {
            const columnMap = {};
            columns?.forEach(column => {
                columnMap[column.value] = column.checked;
            });
            this.hideShowColumnList = columns;
            const checkedValuesSet = new Set(
                columns.filter(column => column.checked).map(column => column.value)
            );
            const filterednewCustomFieldsColumns = this.newCustomFieldsColumns.filter(newCol => checkedValuesSet.has(newCol.value));
            this.tableHeaderDynamicColumns = filterednewCustomFieldsColumns;
            const fieldMapping = {
                variantName: "variant_name",
                variantUniqueName: "variant_unique_name",
                stockName: "stock_name",
                stockUniqueName: "stock_unique_name",
                stockGroupName: "stock_group_name",
                stockGroupUniqueName: "stock_group_unique_name",
                stockUnit: "stock_unit",
                purchaseUnits: "purchase_unit",
                purchaseAccountName: "purchases_account_name",
                purchaseAccountUniqueName: "purchase_account_unique_name",
                purchaseRate: "purchase_rate",
                purchaseTaxInclusive: "purchase_tax_inclusive",
                salesUnits: "sales_unit",
                salesAccountName: "sales_account_name",
                salesAccountUniqueName: "sales_account_unique_name",
                salesRate: "sales_rate",
                salesTaxInclusive: "sales_tax_inclusive",
                fixedAssetUnits: "fixed_asset_units",
                fixedAssetRate: "fixed_asset_rate",
                fixedAssetAccountName: "fixed_asset_account_name",
                fixedAssetAccountUniqueName: "fixed_asset_account_unique_name",
                hsnNo: "hsn",
                sacNo: "sac",
                skuCode: "sku",
                archive: "archive",
                taxes: "tax",
                customFields: "customFields",
                discountName: "discount_name"
            };

            Object.keys(fieldMapping).forEach(key => {
                this.tableHeaderShowHide[key] = columnMap[fieldMapping[key]] || false;
            });
            this.store.dispatch(this.inventoryAction.getBulkStockList({
                inventoryType: this.inventoryType, page: 1, count: this.pageCount, body: {
                    "search": "",
                    "searchBy": "",
                    "filterBy": "",
                    "sortBy": "",
                    "sort": "",
                    "expression": "GREATER_THAN",
                    "rate": 0
                }
            }));
        }, 100);
        this.cdr.detectChanges();
    }


    /**
     * This will be use for get custom fields
     *
     * @memberof BulkStockEditComponent
     */
    public getCustomFields(): void {
        this.inventoryStore.getCustomFields(this.customFieldsVariantRequest);
    }

    /**
     * Lifecycle hook after view initialization
     * @memberof BulkStockEditComponent
     */
    public ngAfterViewInit(): void {
        // Handle opening tax dropdown when selectTableRowName === 'taxes'
        this.taxSelects.changes.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.openTaxDropdownIfNeeded();
        });

        // Check initial state
        setTimeout(() => {
            this.openTaxDropdownIfNeeded();
        }, 200);
    }

    /**
     * Opens tax dropdown if condition is met
     * @memberof BulkStockEditComponent
     */
    private openTaxDropdownIfNeeded(): void {
        if (this.selectTableRowName === 'taxes' && this.selectTableRowIndex !== -1) {
            setTimeout(() => {
                const taxSelect = this.taxSelects.toArray()[0]; // Get the first (current) tax select
                if (taxSelect && !taxSelect.panelOpen) {
                    taxSelect.open();
                }
            }, 100);
        }
    }

    /**
     * Lifcycle hook for destroy event
     * @memberof BulkStockEditComponent
     */
    public ngOnDestroy(): void {
        // Remove CSS class from body element
        this.renderer.removeClass(document.body, 'bulk-stock-edit');
        this.isDestroying = true;

        // Clean up all tracked subscriptions first
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });
        this.subscriptions = [];

        // Safely complete the destroyed$ subject
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }
    }

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
