import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InventoryModuleName } from '../../inventory.enum';
import { PAGINATION_LIMIT } from '../../../app.constant';

@Component({
    selector: 'bulk-stock',
    templateUrl: './bulk-stock-edit.component.html',
    styleUrls: ['./bulk-stock-edit.component.scss']
})

export class BulkStockEditComponent implements OnInit, OnDestroy {

    /** Store Advance search dialog template reference*/
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
    private pageCount = PAGINATION_LIMIT;
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

    public search: boolean = false;
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
    /** Holds module name */
    public moduleName = InventoryModuleName.bulk;
    /** Holds inventory type module  */
    public moduleType: string = '';
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
        taxes: false
    };


    constructor(
        private route: ActivatedRoute,
        private formBuilder: UntypedFormBuilder,
        private store: Store<AppState>,
        private inventoryAction: InventoryAction,
        private dailog: MatDialog,
        private cdr: ChangeDetectorRef
    ) {
        this.initBulkStockForm();
    }

    /**
     * Initializes the component,
     * get Inventory type  and call getBulkStockList api and then get list from Store
     * @memberof BulkStockEditComponent
     */
    public ngOnInit(): void {
        this.searchInputObservableInitialize();

        this.store.pipe(select(select => select.inventory.bulkStock), takeUntil(this.destroyed$)).subscribe((res: any) => {
            if (res) {
                this.isLoading = false;
                const bulkStockForm = this.bulkStockData;
                bulkStockForm.clear();
                this.setPaginationData(res);
                this.noDataFound = res.totalItems === 0;

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

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.type) {
                this.hideShowColumnList = [];
                this.resetSearch();
                
                this.inventoryType = params.type == 'fixedassets' ? 'FIXED_ASSETS' : params?.type.toUpperCase();
                /** Holds list of all hide show column common in inventory type*/
                let commonHideShowColumnList = [
                    {
                        label: this.localeData?.variant_unique_name,
                        value: "variant_unique_name",
                        checked: false
                    },
                    {
                        label: this.localeData?.variant_name,
                        value: "variant_name",
                        checked: true
                    },
                    {
                        label: this.localeData?.stock_name,
                        value: "stock_name",
                        checked: true
                    },
                    {
                        label: this.localeData?.stock_unique_name,
                        value: "stock_unique_name",
                        checked: false
                    },
                    {
                        label: this.localeData?.stock_group_name,
                        value: "stock_group_name",
                        checked: true
                    },
                    {
                        label: this.localeData?.stock_group_unique_name,
                        value: "stock_group_unique_name",
                        checked: false
                    },
                    {
                        label: this.localeData?.stock_unit,
                        value: "stock_unit",
                        checked: true
                    },
                    {
                        label: this.localeData?.sku,
                        value: "sku",
                        checked: false
                    },
                    {
                        label: this.localeData?.tax,
                        value: "tax",
                        checked: false
                    },
                    {
                        label: this.localeData?.hsn,
                        value: "hsn",
                        checked: true
                    },
                    {
                        label: this.localeData?.sac,
                        value: "sac",
                        checked: true
                    },
                    {
                        label: this.localeData?.archive,
                        value: "archive",
                        checked: true
                    }
                ];

                /** Holds list of all hide show column only in FIXED ASSETS*/
                let fixedAssetHideShowColumn = [
                    {
                        label: this.localeData?.fixed_asset_account_name,
                        value: "fixed_asset_account_name",
                        checked: false
                    },
                    {
                        label: this.localeData?.fixed_asset_account_unique_name,
                        value: "fixed_asset_account_unique_name",
                        checked: false
                    },
                    {
                        label: this.localeData?.fixed_asset_rate,
                        value: "fixed_asset_rate",
                        checked: true
                    },
                    {
                        label: this.localeData?.fixed_asset_units,
                        value: "fixed_asset_units",
                        checked: false
                    },
                    {
                        label: this.localeData?.fixed_asset_tax_inclusive,
                        value: "fixed_asset_tax_inclusive",
                        checked: false
                    }
                ];

                /** Holds list of all hide show column of both PRODUCT AND SERVICE*/
                let salesPurchaseHideShowColumn = [
                    {
                        label: this.localeData?.purchases_account_name,
                        value: "purchases_account_name",
                        checked: false
                    },
                    {
                        label: this.localeData?.purchase_account_unique_name,
                        value: "purchase_account_unique_name",
                        checked: false
                    },
                    {
                        label: this.localeData?.purchase_rate,
                        value: "purchase_rate",
                        checked: true
                    },
                    {
                        label: this.localeData?.purchase_unit,
                        value: "purchase_unit",
                        checked: false
                    },
                    {
                        label: this.localeData?.purchase_tax_inclusive,
                        value: "purchase_tax_inclusive",
                        checked: false
                    },
                    {
                        label: this.localeData?.sales_account_name,
                        value: "sales_account_name",
                        checked: false
                    },
                    {
                        label: this.localeData?.sales_account_unique_name,
                        value: "sales_account_unique_name",
                        checked: false
                    },
                    {
                        label: this.localeData?.sales_rate,
                        value: "sales_rate",
                        checked: true
                    },
                    {
                        label: this.localeData?.sales_unit,
                        value: "sales_unit",
                        checked: false
                    },
                    {
                        label: this.localeData?.sales_tax_inclusive,
                        value: "sales_tax_inclusive",
                        checked: false
                    },
                ];
                if (this.inventoryType === 'FIXED_ASSETS') {
                    this.hideShowColumnList = [...commonHideShowColumnList, ...fixedAssetHideShowColumn];
                } else {
                    this.hideShowColumnList = [...commonHideShowColumnList, ...salesPurchaseHideShowColumn];
                }
                this.isLoading = true;
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
        });
        // this.getStockGroups();
        // this.getTaxes();
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

    /**
    * The addRow(data) is used to push addNewRow() in "bulkStockEditForm" Formgroup
    * @private
    * @param {*} data
    * @memberof BulkStockEditComponent
    */
    private addRow(data: any): void {
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
        // console.log(this.bulkStockEditForm.value);
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
            this.hideShowColumnList = this.hideShowColumnList?.map(column => {
                column.label = this.localeData[column.value];
                return column;
            });
            this.cdr.detectChanges();
        }
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
    public pageChanged(event: any): void {
        if (this.pagination.currentPage !== event?.page) {
            this.isLoading = true;
            this.store.dispatch(this.inventoryAction.getBulkStockList({
                inventoryType: this.inventoryType, page: event.page, count: this.pageCount, body: {
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
        this.search=true;
        console.log("Ankit", this.search);
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
        // console.log(`At index - ${index} and key is '${key}'`);
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
    // private arrangeStockGroups(groups: IGroupsWithStocksHierarchyMinItem[], parents: IOption[] = []): void {
    //     groups.map(group => {
    //         if (group) {
    //             let newOption: IOption = { label: '', value: '', additional: {} };
    //             newOption.label = group?.name;
    //             newOption.value = group?.uniqueName;
    //             newOption.additional = group;
    //             parents.push(newOption);
    //             if (group?.childStockGroups?.length > 0) {
    //                 this.arrangeStockGroups(group?.childStockGroups, parents);
    //             }
    //         }
    //     });
    //     this.changeDetection.detectChanges();
    // }

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
    // public openedSelectTax(event:any): void {
    //     console.log("Selected Tax : ", event)
    // }

    // public selectTax(tax): void {
    //     console.log("OnTaxSelection Change : ", tax)
    // }

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
        this.search=false;
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
        this.isLoading = true;
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
        if (columns.includes('variant_name') && columns.includes('stock_name') && columns.includes('purchase_rate') && columns.includes('stock_group_name') && columns.includes('sac') && columns.includes('archive') && columns.includes('hsn') && columns.includes('stock_unit') && columns.includes('stock_unit') && columns.includes('sales_rate') && columns.includes('fixed_asset_rate')) {
            this.tableHeaderShowHide.variantName = true;
            this.tableHeaderShowHide.stockName = true;
            this.tableHeaderShowHide.purchaseRate = true;
            this.tableHeaderShowHide.stockGroupName = true;
            this.tableHeaderShowHide.sacNo = true;
            this.tableHeaderShowHide.archive = true;
            this.tableHeaderShowHide.sacNo = true;
            this.tableHeaderShowHide.stockUnit = true;
            this.tableHeaderShowHide.salesRate = true;
            this.tableHeaderShowHide.fixedAssetRate = true;
        } else {
            this.tableHeaderShowHide.variantName = columns?.includes('variant_name');
            this.tableHeaderShowHide.variantUniqueName = columns?.includes('variant_unique_name');
            this.tableHeaderShowHide.stockName = columns?.includes('stock_name');
            this.tableHeaderShowHide.stockUniqueName = columns?.includes('stock_unique_name');
            this.tableHeaderShowHide.stockGroupName = columns?.includes('stock_group_name');
            this.tableHeaderShowHide.stockGroupUniqueName = columns?.includes('stock_group_unique_name');
            this.tableHeaderShowHide.stockUnit = columns?.includes('stock_unit');
            this.tableHeaderShowHide.purchaseUnits = columns?.includes('purchase_unit');
            this.tableHeaderShowHide.purchaseAccountName = columns?.includes('purchases_account_name');
            this.tableHeaderShowHide.purchaseAccountUniqueName = columns?.includes('purchase_account_unique_name');
            this.tableHeaderShowHide.purchaseRate = columns?.includes('purchase_rate');
            this.tableHeaderShowHide.purchaseTaxInclusive = columns?.includes('purchase_tax_inclusive');
            this.tableHeaderShowHide.salesUnits = columns?.includes('sales_unit');
            this.tableHeaderShowHide.salesAccountName = columns?.includes('sales_account_name');
            this.tableHeaderShowHide.salesAccountUniqueName = columns?.includes('sales_account_unique_name');
            this.tableHeaderShowHide.salesRate = columns?.includes('sales_rate');
            this.tableHeaderShowHide.salesTaxInclusive = columns?.includes('sales_tax_inclusive');
            this.tableHeaderShowHide.fixedAssetUnits = columns?.includes('fixed_asset_units');
            this.tableHeaderShowHide.fixedAssetRate = columns?.includes('fixed_asset_rate');
            this.tableHeaderShowHide.fixedAssetAccountName = columns?.includes('fixed_asset_account_name');
            this.tableHeaderShowHide.fixedAssetAccountUniqueName = columns?.includes('fixed_asset_account_unique_name');
            this.tableHeaderShowHide.hsnNo = columns?.includes('hsn');
            this.tableHeaderShowHide.sacNo = columns?.includes('sac');
            this.tableHeaderShowHide.skuCode = columns?.includes('sku');
            this.tableHeaderShowHide.archive = columns?.includes('archive');
            this.tableHeaderShowHide.taxes = columns?.includes('tax');
        }
        this.cdr.detectChanges();
    }

    /**
     * Lifcycle hook for destroy event
     * @memberof BulkStockEditComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
