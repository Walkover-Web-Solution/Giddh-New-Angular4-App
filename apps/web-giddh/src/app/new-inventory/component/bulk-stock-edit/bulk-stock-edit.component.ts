import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groups-with-stocks.interface';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InventoryModuleName } from '../../inventory.enum';
@Component({
    selector: 'bulk-stock',
    templateUrl: './bulk-stock-edit.component.html',
    styleUrls: ['./bulk-stock-edit.component.scss']
})
export class BulkStockEditComponent implements OnInit, OnDestroy {
    @ViewChild('bulkStockAdvanceFilter') public bulkStockAdvanceFilter: TemplateRef<any>
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds Inventory Type */
    public inventoryType: string;
    /** Holds Pagination Info*/
    public pagination: any;
    /**Holds Page count in single page for Pagination */
    private pageCount = 100;
    public totalInventoryCount: number;
    public sortOrderStatus: null | 'asc' | 'desc' = null;
    public sortOrderKey:string = null;
    public searchString:string = null;
    public searchStringKey:string = null;
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
    public advanceFilterDialogRef: MatDialogRef<any>;
    public advanaceSearchData: any = null;
    public hideShowColumnList: any = [];
    private commonHideShowColumnList = [
        {
            label: "Variant Unique Name",
            value: "variantUniqueName",
            checked: false
        },
        {
            label: "Variant Name",
            value: "variantName",
            checked: false
        },
        {
            label: "Stock Name",
            value: "stockName",
            checked: false
        },
        {
            label: "Stock Unique Name",
            value: "stockUniqueName",
            checked: false
        },
        {
            label: "Stock Group Name",
            value: "stockGroupName",
            checked: false
        },
        {
            label: "Stock Group Unique Name",
            value: "stockGroupUniqueName",
            checked: false
        },
        {
            label: "SKU Code",
            value: "skuCode",
            checked: false
        },
        {
            label: "Taxes",
            value: "taxes",
            checked: false
        },
        {
            label: "HSN No",
            value: "hsnNo",
            checked: false
        },
        {
            label: "SAC No",
            value: "sacNo",
            checked: false
        },
        {
            label: "Archive",
            value: "archive",
            checked: false
        }
    ];

    private fixedAssetHideShowColumn = [
        {
            label: "Fixed Asset Account Name",
            value: "fixedAssetAccountName",
            checked: false
        },
        {
            label: "Fixed Asset Account UniqueName",
            value: "fixedAssetAccountUniqueName",
            checked: false
        },
        {
            label: "Fixed Asset Rate",
            value: "fixedAssetRate",
            checked: false
        },
        {
            label: "Fixed Asset Units",
            value: "fixedAssetUnits",
            checked: false
        },
        {
            label: "Fixed Asset Tax Inclusive",
            value: "fixedAssetTaxInclusive",
            checked: false
        }
    ];

    private salesPurchaseHideShowColumn = [
        {
            label: "Purchase Account Name",
            value: "purchaseAccountName",
            checked: false
        },
        {
            label: "Purchase Account Unique Name",
            value: "purchaseAccountUniqueName",
            checked: false
        },
        {
            label: "Purchase Rate",
            value: "purchaseRate",
            checked: false
        },
        {
            label: "Purchase Units",
            value: "purchaseUnits",
            checked: false
        },
        {
            label: "Purchase Tax Inclusive",
            value: "purchaseTaxInclusive",
            checked: false
        },
        {
            label: "Sales Account Name",
            value: "salesAccountName",
            checked: false
        },
        {
            label: "Sales Account Unique Name",
            value: "salesAccountUniqueName",
            checked: false
        },
        {
            label: "Sales Rate",
            value: "salesRate",
            checked: false
        },
        {
            label: "Sales Units",
            value: "salesUnits",
            checked: false
        },
        {
            label: "Sales Tax Inclusive",
            value: "salesTaxInclusive",
            checked: false
        },
    ];

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
    /** UntypedFormArray Group for group UntypedFormArray */
    public bulkStockEditForm: UntypedFormGroup;
    public hideShowForm: UntypedFormGroup;
    public dropdownValues: any[] = [];
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds module name */
    public moduleName = InventoryModuleName.bulk;
    /** Stores the Table head inpu value for the Name filter */
    public thVariantName: UntypedFormControl = new UntypedFormControl();
    public thVariantUniqueName: UntypedFormControl = new UntypedFormControl();
    public thStockName: UntypedFormControl = new UntypedFormControl();
    public thStockUniqueName: UntypedFormControl = new UntypedFormControl();
    public thStockGroupName: UntypedFormControl = new UntypedFormControl();
    public thHSN: UntypedFormControl = new UntypedFormControl();
    public thSAC: UntypedFormControl = new UntypedFormControl();
    public thSkuCode: UntypedFormControl = new UntypedFormControl();

    constructor(
        private changeDetection: ChangeDetectorRef,
        private route: ActivatedRoute,
        private formBuilder: UntypedFormBuilder,
        private store: Store<AppState>,
        private inventoryAction: InventoryAction,
        private dailog: MatDialog
    ) {
        this.initBulkStockForm();
        this.hideShowForm = this.initalHideShowFrom();
    }

    public ngOnInit(): void {
        this.searchInputObservableInitialize();

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.type) {
                this.inventoryType = params.type == 'fixedassets' ? 'FIXED_ASSETS' : params?.type.toUpperCase();
                this.createHideshowColumn();
                const bulkStockForm = this.bulkStockData;
                bulkStockForm.clear();
                this.isLoading = true;
                this.store.dispatch(this.inventoryAction.GetListBulkStock({
                    inventoryType: this.inventoryType, page: 1, count: this.pageCount, body: {
                        "search": "",
                        "searchBy": "",
                        "sortBy": "",
                        "sort": "",
                        "expression": "GREATER_THAN",
                        "rate": 0
                    }
                }));
                this.store.pipe(select(select => select.inventory.bulkStock), takeUntil(this.destroyed$)).subscribe((res: any) => {
                    if (res) {
                        console.log("Res: ",res);                        
                        this.isLoading = false;
                        const bulkStockForm = this.bulkStockData;
                        bulkStockForm.clear();
                        this.setPaginationData(res);
                        console.log(this.pagination);
                        
                        this.totalInventoryCount = res?.totalItems;
                        res.results.forEach((row, index) => {
                            this.dropdownValues[index] = [];
                            this.dropdownValues[index].salesUnits = row.salesUnits;
                            this.dropdownValues[index].purchaseUnits = row.purchaseUnits;
                            this.dropdownValues[index].fixedAssetUnits = row.fixedAssetUnits;
                            this.addRow(row);
                        });
                    }
                });
            }
        });
      
        // this.getStockGroups();
        // this.getTaxes();
     
    }

    public initalHideShowFrom() {
        return this.formBuilder.group({

            variantName: [false],
            variantUniqueName: [false],

            stockName: [false],
            stockUniqueName: [false],
            stockGroupName: [false],
            stockGroupUniqueName: [false],

            purchaseUnits: [false],
            purchaseAccountName: [false],
            purchaseAccountUniqueName: [false],
            purchaseRate: [false],
            purchaseTaxInclusive: [false],

            salesUnits: [false],
            salesAccountName: [false],
            salesAccountUniqueName: [false],
            salesRate: [false],
            salesTaxInclusive: [false],

            fixedAssetUnits: [false],
            fixedAssetRate: [false],
            fixedAssetAccountName: [false],
            fixedAssetAccountUniqueName: [false],
            fixedAssetTaxInclusive: [false],

            hsnNo: [false],
            sacNo: [false],
            skuCode: [false],
            archive: [false],
            taxes: [false]
        });
    }

    /**
     * This will use for init main formgroup     *
     * @private
     */
    private initBulkStockForm(): void {
        this.bulkStockEditForm = this.formBuilder.group({
            fields: this.formBuilder.array([])
        });
    }

    private addNewRow(controlValue: any): FormGroup {
        return this.formBuilder.group({
            variantName: [controlValue.variantName, Validators.required],
            variantUniqueName: [controlValue.variantUniqueName, Validators.required],

            stockName: [controlValue.stockName, Validators.required],
            stockUniqueName: [controlValue.stockUniqueName, Validators.required],
            stockGroupName: [controlValue.stockGroupName, Validators.required],
            stockGroupUniqueName: [controlValue.stockGroupUniqueName, Validators.required],

            purchaseUnits: [(controlValue.purchaseUnits?.length && controlValue.purchaseUnits[0] !== null ? controlValue.purchaseUnits[0]?.uniqueName : ""), Validators.required],
            purchaseAccountName: [controlValue.purchaseAccountName, Validators.required],
            purchaseAccountUniqueName: [controlValue.purchaseAccountUniqueName, Validators.required],
            purchaseRate: [controlValue.purchaseRate, Validators.required],
            purchaseTaxInclusive: [controlValue.purchaseTaxInclusive, Validators.required],

            salesUnits: [(controlValue.salesUnits?.length && controlValue.salesUnits[0] !== null ? controlValue.salesUnits[0]?.uniqueName : ""), Validators.required],
            salesAccountName: [controlValue.salesAccountName, Validators.required],
            salesAccountUniqueName: [controlValue.salesAccountUniqueName, Validators.required],
            salesRate: [controlValue.salesRate, Validators.required],
            salesTaxInclusive: [controlValue.salesTaxInclusive, Validators.required],

            fixedAssetTaxInclusive: [controlValue.fixedAssetTaxInclusive, Validators.required],
            fixedAssetRate: [controlValue.fixedAssetRate, Validators.required],
            fixedAssetUnits: [(controlValue.fixedAssetUnits?.length && controlValue.fixedAssetUnits[0] !== null ? controlValue.fixedAssetUnits[0]?.uniqueName : ""), Validators.required],
            fixedAssetAccountName: [controlValue.fixedAssetAccountName, Validators.required],
            fixedAssetAccountUniqueName: [controlValue.fixedAssetAccountUniqueName, Validators.required],

            hsnNo: [controlValue.hsnNo, Validators.required],
            sacNo: [controlValue.sacNo, Validators.required],
            skuCode: [controlValue.skuCode, Validators.required],
            archive: [controlValue.archive, Validators.required],
            taxes: [controlValue.taxes, Validators.required]
        })
    }

    addRow(data) {
        this.bulkStockData.push(this.addNewRow(data));
    }

    get bulkStockData(): FormArray {
        return this.bulkStockEditForm.get("fields") as FormArray
    }

    onFormSubmit() {
        // console.log(this.bulkStockEditForm.value);
    }

    /**
    * Get select value from select field
    */
    public setPaginationData(data: any): void {
        this.pagination = {
            currentPage: data?.page,
            itemsPerPage: data?.count,
            totalPages: data?.totalPages,
            totalItems: data?.totalItems
        }
    }

    /**
     * Get select value from filter checkbox
    
     */
    public showSelectedHeaderColumns(e): void {
        // console.log("Event: ", e);
    }
    /**
  * Get Pagination page change event
  */
    public pageChanged(e): void {
        this.isLoading = true;
        this.store.dispatch(this.inventoryAction.GetListBulkStock({
            inventoryType: this.inventoryType, page: e.page, count: this.pageCount, body: {
                "search": this.searchString !== null ? this.searchString : "",
                "searchBy": this.searchStringKey !== null ? this.searchStringKey : "",
                "sortBy": this.advanaceSearchData !== null ? this.advanaceSearchData?.sortBy : (this.sortOrderKey !== null ? this.sortOrderKey : ""),
                "sort":  this.sortOrderStatus !== null ? this.sortOrderStatus : "asc",
                "expression": this.advanaceSearchData !== null ? this.advanaceSearchData?.expression : "",
                "rate": this.advanaceSearchData !== null ? this.advanaceSearchData?.amount : ""
            }
        })); 
       this.changeDetection.detectChanges();
    }

    public toggleInput(key): void {
        this.hideTableHeadInput();
        this.tableHeadInput[key] = !this.tableHeadInput[key];
    }

    public hideTableHeadInput(): void {
        Object.entries(this.tableHeadInput).forEach(([key]) => {
            this.tableHeadInput[key] = false;
        });
    }
    /**
     * Create list of items in respect to Inventory Type
     * which will by hide and show by user
     * @memberof StockCreateEditComponent
     */
    private createHideshowColumn(): void {
        this.hideShowColumnList = [];
        if (this.inventoryType === 'FIXED_ASSETS') {
            this.hideShowColumnList = [...this.commonHideShowColumnList, ...this.fixedAssetHideShowColumn];
        } else {
            this.hideShowColumnList = [...this.commonHideShowColumnList, ...this.salesPurchaseHideShowColumn];
        }
    }

    public getInputIndex(index: number, key: string): void {
        // console.log(`At index - ${index} and key is '${key}'`);
    }
    private searchInputObservableInitialize(): void {
        this.thVariantName.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.searchString = searchedText;
                this.searchStringKey = "variant_name";
                let bodyObj;
                if (this.advanaceSearchData !== null) {
                    bodyObj = {
                        "search": searchedText,
                        "searchBy": "variant_name",
                        "sortBy": this.advanaceSearchData.sortBy,
                        "sort": this.advanaceSearchData.sortOrder,
                        "expression": this.advanaceSearchData.expression,
                        "rate": this.advanaceSearchData.amount
                    }
                } else {
                    bodyObj = {
                        "search": searchedText,
                        "searchBy": "variant_name",
                        "sortBy": "",
                        "sort": "",
                        "expression": "GREATER_THAN",
                        "rate": 0
                    }
                }
                this.isLoading = true;
                this.store.dispatch(this.inventoryAction.GetListBulkStock({
                    inventoryType: this.inventoryType, page: this.pagination.currentPage, count: this.pageCount, body: bodyObj
                }));
            }
        });
        this.thVariantUniqueName.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.searchString = searchedText;
                this.searchStringKey = "variant_unique_name";
                let bodyObj;
                if (this.advanaceSearchData !== null) {
                    bodyObj = {
                        "search": searchedText,
                        "searchBy": "variant_unique_name",
                        "sortBy": this.advanaceSearchData.sortBy,
                        "sort": this.advanaceSearchData.sortOrder,
                        "expression": this.advanaceSearchData.expression,
                        "rate": this.advanaceSearchData.amount
                    }
                } else {
                    bodyObj = {
                        "search": searchedText,
                        "searchBy": "variant_unique_name",
                        "sortBy": "",
                        "sort": "",
                        "expression": "GREATER_THAN",
                        "rate": 0
                    }
                }
                this.isLoading = true;
                this.store.dispatch(this.inventoryAction.GetListBulkStock({
                    inventoryType: this.inventoryType, page: this.pagination.currentPage, count: this.pageCount, body: bodyObj
                }));
            }
        });
        this.thStockName.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.searchString = searchedText;
                this.searchStringKey = "stock_name";
                let bodyObj;
                if (this.advanaceSearchData !== null) {
                    bodyObj = {
                        "search": searchedText,
                        "searchBy": "stock_name",
                        "sortBy": this.advanaceSearchData.sortBy,
                        "sort": this.advanaceSearchData.sortOrder,
                        "expression": this.advanaceSearchData.expression,
                        "rate": this.advanaceSearchData.amount
                    }
                } else {
                    bodyObj = {
                        "search": searchedText,
                        "searchBy": "stock_name",
                        "sortBy": "",
                        "sort": "",
                        "expression": "GREATER_THAN",
                        "rate": 0
                    }
                }
                this.isLoading = true;
                this.store.dispatch(this.inventoryAction.GetListBulkStock({
                    inventoryType: this.inventoryType, page: this.pagination.currentPage, count: this.pageCount, body: bodyObj
                }));
            }
        });
        this.thStockUniqueName.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.searchString = searchedText;
                this.searchStringKey = "stock_unique_name";
                let bodyObj;
                if (this.advanaceSearchData !== null) {
                    bodyObj = {
                        "search": searchedText,
                        "searchBy": "stock_unique_name",
                        "sortBy": this.advanaceSearchData.sortBy,
                        "sort": this.advanaceSearchData.sortOrder,
                        "expression": this.advanaceSearchData.expression,
                        "rate": this.advanaceSearchData.amount
                    }
                } else {
                    bodyObj = {
                        "search": searchedText,
                        "searchBy": "stock_unique_name",
                        "sortBy": "",
                        "sort": "",
                        "expression": "GREATER_THAN",
                        "rate": 0
                    }
                }
                this.isLoading = true;
                this.store.dispatch(this.inventoryAction.GetListBulkStock({
                    inventoryType: this.inventoryType, page: this.pagination.currentPage, count: this.pageCount, body: bodyObj
                }));
            }
        });
        this.thStockGroupName.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.searchString = searchedText;
                this.searchStringKey = "stock_group_name";
                let bodyObj;
                if (this.advanaceSearchData !== null) {
                    bodyObj = {
                        "search": searchedText,
                        "searchBy": "stock_group_name",
                        "sortBy": this.advanaceSearchData.sortBy,
                        "sort": this.advanaceSearchData.sortOrder,
                        "expression": this.advanaceSearchData.expression,
                        "rate": this.advanaceSearchData.amount
                    }
                } else {
                    bodyObj = {
                        "search": searchedText,
                        "searchBy": "stock_group_name",
                        "sortBy": "",
                        "sort": "",
                        "expression": "GREATER_THAN",
                        "rate": 0
                    }
                }
                this.isLoading = true;
                this.store.dispatch(this.inventoryAction.GetListBulkStock({
                    inventoryType: this.inventoryType, page: this.pagination.currentPage, count: this.pageCount, body: bodyObj
                }));
            }
        });
        this.thHSN.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.searchString = searchedText;
                this.searchStringKey = "hsn";
                let bodyObj;
                if (this.advanaceSearchData !== null) {
                    bodyObj = {
                        "search": searchedText,
                        "searchBy": "hsn",
                        "sortBy": this.advanaceSearchData.sortBy,
                        "sort": this.advanaceSearchData.sortOrder,
                        "expression": this.advanaceSearchData.expression,
                        "rate": this.advanaceSearchData.amount
                    }
                } else {
                    bodyObj = {
                        "search": searchedText,
                        "searchBy": "hsn",
                        "sortBy": "",
                        "sort": "",
                        "expression": "GREATER_THAN",
                        "rate": 0
                    }
                }
                this.isLoading = true;
                this.store.dispatch(this.inventoryAction.GetListBulkStock({
                    inventoryType: this.inventoryType, page: this.pagination.currentPage, count: this.pageCount, body: bodyObj
                }));
            }
        });
        this.thSAC.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.searchString = searchedText;
                this.searchStringKey = "sac";
                let bodyObj;
                if (this.advanaceSearchData !== null) {
                    bodyObj = {
                        "search": searchedText,
                        "searchBy": "sac",
                        "sortBy": this.advanaceSearchData.sortBy,
                        "sort": this.advanaceSearchData.sortOrder,
                        "expression": this.advanaceSearchData.expression,
                        "rate": this.advanaceSearchData.amount
                    }
                } else {
                    bodyObj = {
                        "search": searchedText,
                        "searchBy": "sac",
                        "sortBy": "",
                        "sort": "",
                        "expression": "GREATER_THAN",
                        "rate": 0
                    }
                }
                this.isLoading = true;
                this.store.dispatch(this.inventoryAction.GetListBulkStock({
                    inventoryType: this.inventoryType, page: this.pagination.currentPage, count: this.pageCount, body: bodyObj
                }));
            }
        });
        this.thSkuCode.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.searchString = searchedText;
                this.searchStringKey = "sku";
                let bodyObj;
                if (this.advanaceSearchData !== null) {
                    bodyObj = {
                        "search": searchedText,
                        "searchBy": "sku",
                        "sortBy": this.advanaceSearchData.sortBy,
                        "sort": this.advanaceSearchData.sortOrder,
                        "expression": this.advanaceSearchData.expression,
                        "rate": this.advanaceSearchData.amount
                    }
                } else {
                    bodyObj = {
                        "search": searchedText,
                        "searchBy": "sku",
                        "sortBy": "",
                        "sort": "",
                        "expression": "GREATER_THAN",
                        "rate": 0
                    }
                }
                this.isLoading = true;
                this.store.dispatch(this.inventoryAction.GetListBulkStock({
                    inventoryType: this.inventoryType, page: this.pagination.currentPage, count: this.pageCount, body: bodyObj
                }));
            }
        });
    }

    public sort(key: string): void {
        if (this.sortOrderStatus === null || this.sortOrderStatus === 'desc') {
            this.sortOrderStatus = 'asc';
        } else {
            this.sortOrderStatus = 'desc';
        }
        this.sortOrderKey = key;
        this.isLoading = true;
        this.store.dispatch(this.inventoryAction.GetListBulkStock({
            inventoryType: this.inventoryType, page: this.pagination.currentPage, count: this.pageCount, body: {
                "search": "",
                "searchBy": "",
                "sortBy": key,
                "sort": this.sortOrderStatus,
                "expression": "GREATER_THAN",
                "rate": 0
            }
        }));
    }

    /**
     * Get stock groups
     *
     * @memberof StockCreateEditComponent
     */
    // public getStockGroups(): void {

    //     this.inventoryService.GetGroupsWithStocksFlatten(this.inventoryType).pipe(takeUntil(this.destroyed$)).subscribe(response => {
    //         if (response?.status === "success") {
    //             let stockGroups: IOption[] = [];
    //             this.arrangeStockGroups(response.body?.results, stockGroups);
    //             this.stockGroups = stockGroups;
    //             // this.stockGroupUniqueName = this.activeGroup?.uniqueName ? this.activeGroup?.uniqueName : this.stockGroups?.length ? this.stockGroups[0]?.value : '';
    //         }
    //     });
    //     this.changeDetection.detectChanges();
    // }

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
                newOption.label = group?.name;
                newOption.value = group?.uniqueName;
                newOption.additional = group;
                parents.push(newOption);
                if (group?.childStockGroups?.length > 0) {
                    this.arrangeStockGroups(group?.childStockGroups, parents);
                }
            }
        });
        this.changeDetection.detectChanges();
    }

    /**
    * Get taxes
    *
    * @memberof BulkStockEditComponent
    */
    // public getTaxes(): void {
    //     this.store.dispatch(this.companyAction.getTax());
    //     this.store.pipe(select(state => state?.company?.taxes), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(response => {
    //         if (response?.length > 0 && !this.processedTaxes?.length) {
    //             this.taxes = response || [];
    //             console.log("Taxes: ", this.taxes);
    //         }
    //         this.changeDetection.detectChanges();
    //     });
    // }
    // public openedSelectTax(e): void {
    //     console.log("Selected Tax : ", e)
    // }

    // public selectTax(tax): void {
    //     console.log("OnTaxSelection Change : ", tax)
    // }

    public openAdvanceFilter(): void {
        this.advanceFilterDialogRef = this.dailog.open(this.bulkStockAdvanceFilter, {
            width: '600px'
        })
    }

    public resetAdvanceSearch(): void {
        this.advanaceSearchData = null;
        this.sortOrderStatus = null;
        this.isLoading = true;
        this.store.dispatch(this.inventoryAction.GetListBulkStock({
            inventoryType: this.inventoryType, page: this.pagination.currentPage, count: this.pageCount, body: {
                "search": "",
                "searchBy": "",
                "sortBy": "",
                "sort": "",
                "expression": "GREATER_THAN",
                "rate": 0
            }
        }));

    }

    public applyAdvanceFilter(e): void {
        this.advanceFilterDialogRef.close();

        // let checkColumnStatus: boolean;

        // if (e.sortBy === 'fixed_asset_rate') {
        //     checkColumnStatus = this.hideShowForm.controls['fixedAssetRate'].value
        // } else if (e.sortBy === 'sales_rate') {
        //     checkColumnStatus = this.hideShowForm.controls['salesRate'].value
        // } else if (e.sortBy === 'purchase_rate') {
        //     checkColumnStatus = this.hideShowForm.controls['purchaseRate'].value
        // }
        // if (checkColumnStatus) {
            this.isLoading = true;
            this.advanaceSearchData = e;
            const pageNo = this.pagination.currentPage;
            this.isLoading = true;
            this.store.dispatch(this.inventoryAction.GetListBulkStock({
                inventoryType: this.inventoryType, page: pageNo, count: this.pageCount, body: {
                    "sortBy": e.sortBy,
                    "expression": e.expression,
                    "rate": e.amount
                }
            }));
        // } else {
        //     this.toaster.errorToast("This column is Hidden, you cannot sort Hidden Column");
        // }
    }

    public setDisplayColumns(e): void {
        this.hideShowForm.reset();
        e.forEach(keys => {
            this.hideShowForm.controls[keys].setValue(true);
        });
    }

    /**
    * Lifcycle hook for destroy event
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}