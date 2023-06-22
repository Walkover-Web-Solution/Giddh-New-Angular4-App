import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { distinctUntilChanged, take, takeUntil } from "rxjs/operators";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { InventoryService } from "../../../services/inventory.service";
import { IOption } from "../../../theme/ng-virtual-select/sh-options.interface";
import { IGroupsWithStocksHierarchyMinItem } from "../../../models/interfaces/groups-with-stocks.interface";
import { SalesService } from "../../../services/sales.service";
import { ToasterService } from "../../../services/toaster.service";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../store";
import { WarehouseActions } from "../../../settings/warehouse/action/warehouse.action";
import { ActivatedRoute, Router } from "@angular/router";
import { cloneDeep, findIndex, forEach } from "../../../lodash-optimized";
import { NgForm } from "@angular/forms";
import { INVALID_STOCK_ERROR_MESSAGE } from "../../../app.constant";
import { CustomFieldsService } from "../../../services/custom-fields.service";
import { CompanyActions } from "../../../actions/company.actions";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmModalComponent } from "../../../theme/new-confirm-modal/confirm-modal.component";
import { FieldTypes } from "../../../custom-fields/custom-fields.constant";
import { Location } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: "stock-create-edit",
    templateUrl: "./stock-create-edit.component.html",
    styleUrls: ["./stock-create-edit.component.scss"]
})
export class StockCreateEditComponent implements OnInit, OnDestroy {
    /** Instance of stock create/edit form */
    @ViewChild('stockCreateEditForm', { static: false }) public stockCreateEditForm: NgForm;
    /** Key codes for handling of add variant options */
    public matChipSeparatorKeyCodes: any[] = [ENTER, COMMA];
    /* this will store image path*/
    public imgPath: string = "";
    /** Stock units list */
    public stockUnits: IOption[] = [];
    /** Stock groups list */
    public stockGroups: IOption[] = [];
    /** Purchase accounts list */
    public purchaseAccounts: IOption[] = [];
    /** Purchase accounts list */
    public fixedAssetsAccounts: IOption[] = [];
    /** Sales accounts list */
    public salesAccounts: IOption[] = [];
    /** Taxes list */
    public taxes: any[] = [];
    /** Object of stock form */
    public stockForm: any = {
        type: null,
        name: null,
        uniqueName: null,
        stockUnitCode: null,
        stockUnitUniqueName: null,
        hsnNumber: null,
        sacNumber: null,
        taxes: null,
        skuCode: null,
        openingQuantity: null,
        openingAmount: null,
        skuCodeHeading: null,
        customField1Heading: "Custom Field 1",
        customField1Value: null,
        customField2Heading: "Custom Field 2",
        customField2Value: null,
        purchaseAccountDetails: {
            accountUniqueName: null,
        },
        fixedAssetAccountDetails: {
            accountUniqueName: null,
        },
        salesAccountDetails: {
            accountUniqueName: null,
        },
        isFsStock: null,
        manufacturingDetails: null,
        accountGroup: null,
        lowStockAlertCount: 0,
        outOfStockSelling: true,
        variants: [
            {
                name: "",
                archive: false,
                uniqueName: undefined,
                skuCode: undefined,
                salesTaxInclusive: false,
                purchaseTaxInclusive: false,
                fixedAssetTaxInclusive: false,
                salesInformation: [
                    {
                        rate: undefined,
                        stockUnitCode: undefined,
                        stockUnitName: undefined,
                        stockUnitUniqueName: undefined,
                        accountUniqueName: ""
                    }
                ],
                purchaseInformation: [
                    {
                        rate: undefined,
                        stockUnitCode: undefined,
                        stockUnitName: undefined,
                        stockUnitUniqueName: undefined,
                        accountUniqueName: ""
                    }
                ],
                fixedAssetsInformation: [
                    {
                        rate: undefined,
                        stockUnitCode: undefined,
                        stockUnitName: undefined,
                        stockUnitUniqueName: undefined,
                        accountUniqueName: ""
                    }
                ],
                warehouseBalance: [
                    {
                        warehouse: {
                            name: undefined,
                            uniqueName: undefined
                        },
                        stockUnit: {
                            name: "",
                            uniqueName: ""
                        },
                        openingQuantity: 0,
                        openingAmount: 0
                    }
                ]
            }
        ],
        options: [],
        customFields: []
    };
    /** Holds stock group unique name */
    public stockGroupUniqueName: string = "";
    /** Holds stock group unique name */
    public defaultStockGroupUniqueName: string = "";
    /** True if variant is available */
    public isVariantAvailable: boolean = false;
    /** Holds index of currently editing custom field */
    public inlineEditCustomField: number = 0;
    /** List of warehouses */
    public warehouses: any[] = [];
    /** Holds stock unit name */
    public stockUnitName: string = "";
    /** Holds stock group name */
    public stockGroupName: string = "";
    /** Holds purchase account name */
    public purchaseAccountName: string = "";
    /** Holds sales account name */
    public salesAccountName: string = "";
    /** Holds fixed assets account name */
    public fixedAssetsAccountName: string = "";
    /** Holds query params */
    public queryParams: any = {};
    /** Holds temporarily list of taxes */
    public taxTempArray: any[] = [];
    /** True if loader is visible */
    public showLoader: boolean = false;
    /** Custom fields request */
    public customFieldsRequest: any = {
        page: 0,
        count: 0,
        moduleUniqueName: 'stock'
    };
    /** Available field types list */
    public availableFieldTypes: any = FieldTypes;
    /** Holds list of selected taxes */
    private selectedTaxes: any[] = [];
    /** Holds custom fields data */
    private customFieldsData: any[] = [];
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds active tab index */
    public activeTabIndex: number;
    /** True if name has spacing */
    public hasSpacingError = false;
    /** Holds if hsn/sac selected */
    public hsnSac: string = 'HSN';
    /** True if variant unit rate check validation*/
    public checkUnitRateValidation: any[] = [{
        purchase: false,
        sales: false,
        fixedAssets: false
    }];
    /** True if tax selection box is open */
    public isTaxSelectionOpen: boolean = false;
    /** Holds list of taxes processed while tax selection box was closed */
    public processedTaxes: any[] = [];
    /** Holds option values before edit */
    public optionEditing: any;
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    public companyCurrencySymbol: string = '';
    public inputMaskFormat: string = '';

    constructor(
        private inventoryService: InventoryService,
        private salesService: SalesService,
        private toaster: ToasterService,
        private store: Store<AppState>,
        private companyAction: CompanyActions,
        private warehouseAction: WarehouseActions,
        private route: ActivatedRoute,
        private router: Router,
        private changeDetection: ChangeDetectorRef,
        private customFieldsService: CustomFieldsService,
        private dialog: MatDialog,
        private location: Location
    ) {
    }

    /**
     * Lifecycle hook for initialization
     *
     * @memberof StockCreateEditComponent
     */
    public ngOnInit(): void {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        /** added parent class to body after entering new-inventory page */
        document.querySelector("body").classList.add("stock-create-edit");

        this.getTaxes();
        this.getStockUnits();
        this.getWarehouses();

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.type) {
                this.stockForm.type = params?.type?.toUpperCase();
                this.resetForm(this.stockCreateEditForm);
                this.getStockGroups();
                this.changeDetection.detectChanges();
            }
            if (params?.stockUniqueName) {
                this.queryParams = params;
                this.getStockDetails();
            } else {
                if (!["PRODUCT", "SERVICE", "FIXEDASSETS"].includes(params?.type?.toUpperCase())) {
                    this.router.navigate(['/pages/inventory/v2']);
                }
            }
            if (this.stockForm.type === 'PRODUCT' || this.stockForm.type === 'SERVICE') {
                this.getPurchaseAccounts();
                this.getSalesAccounts();
            }
            if (this.stockForm.type === 'FIXED_ASSETS') {
                this.getFixedAssetsAccounts();
            }
            this.hsnSac = "HSN";
        });

        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.tab && this.activeTabIndex !== params?.tab) {
                this.activeTabIndex = params?.tab;
                this.changeDetection.detectChanges();
            }
        });

        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe(async (profile) => {
            if (profile) {
                this.companyCurrencySymbol = profile.baseCurrencySymbol;
                this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
            }
        });
    }

    /**
     * Add option value
     *
     * @param {*} value
     * @param {number} optionIndex
     * @param {number} optionValueIndex
     * @memberof StockCreateEditComponent
     */
    public addNewOptionValue(value: any, optionIndex: number, optionValueIndex: number): void {
        // const valueIndex = this.stockForm.options[optionIndex].values?.filter((optionValue, index) => { optionValue === value && optionValueIndex !== index });
        // if (valueIndex?.length) {
        //     this.stockForm.options[optionIndex].values[optionValueIndex] = "";
        //     this.toaster.showSnackBar("warning", "You've already used the option value " + value);
        // }

        if (!this.stockForm.options[optionIndex].values[optionValueIndex + 1] && value?.trim()) {
            this.stockForm.options[optionIndex].values[optionValueIndex + 1] = { index: optionValueIndex + 1, value: "" };
        }
    }

    /**
     * Get stock units
     *
     * @memberof StockCreateEditComponent
     */
    public getStockUnits(): void {
        this.inventoryService.GetStockUnit().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.stockUnits = response?.body?.map(result => {
                    return {
                        value: result.uniqueName,
                        label: `${result.name} (${result.code})`,
                        additional: result
                    };
                }) || [];
            }
        });
    }

    /**
     * Get stock groups
     *
     * @memberof StockCreateEditComponent
     */
    public getStockGroups(): void {
        if (this.stockForm.type === 'FIXEDASSETS') {
            this.stockForm.type = 'FIXED_ASSETS';
        }
        this.inventoryService.GetGroupsWithStocksFlatten(this.stockForm.type).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                let stockGroups: IOption[] = [];
                this.arrangeStockGroups(response.body?.results, stockGroups);
                this.stockGroups = stockGroups;
                this.stockGroupUniqueName = this.stockGroups?.length ? this.stockGroups[0]?.value : '';
            }
        });
        this.changeDetection.detectChanges();
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
     * Get purchase accounts
     *
     * @memberof StockCreateEditComponent
     */
    public getPurchaseAccounts(): void {
        this.salesService.getAccountsWithCurrency('operatingcost, indirectexpenses').pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data?.status === 'success') {
                let purchaseAccounts: IOption[] = [];
                data.body?.results.map(account => {
                    purchaseAccounts.push({ label: `${account.name} (${account?.uniqueName})`, value: account?.uniqueName, additional: account });
                });

                this.purchaseAccounts = purchaseAccounts;

                if (this.queryParams?.stockUniqueName) {
                    this.findPurchaseAccountName();
                }
            }
        });
    }

    /**
     * Get fixed assets accounts
     *
     * @memberof StockCreateEditComponent
     */
    public getFixedAssetsAccounts(): void {
        this.salesService.getAccountsWithCurrency('fixedassets').pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data?.status === 'success') {
                let fixedAssetsAccounts: IOption[] = [];
                data.body?.results.map(account => {
                    fixedAssetsAccounts.push({ label: `${account.name} (${account?.uniqueName})`, value: account?.uniqueName, additional: account });
                });

                this.fixedAssetsAccounts = fixedAssetsAccounts;

                if (this.queryParams?.stockUniqueName) {
                    this.findFixedAssetsAccountName();
                }
            }
        });
    }

    /**
     * Get sales accounts
     *
     * @memberof StockCreateEditComponent
     */
    public getSalesAccounts(): void {
        this.salesService.getAccountsWithCurrency('revenuefromoperations, otherincome').pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data?.status === 'success') {
                let salesAccounts: IOption[] = [];
                data.body?.results?.map(account => {
                    salesAccounts.push({ label: `${account.name} (${account?.uniqueName})`, value: account?.uniqueName, additional: account });
                });

                this.salesAccounts = salesAccounts;

                if (this.queryParams?.stockUniqueName) {
                    this.findSalesAccountName();
                }
            }
        });
    }

    /**
     * Add new variant option
     *
     * @memberof StockCreateEditComponent
     */
    public addVariantOption(): void {
        if (this.checkOptionValidity()) {
            const optionIndex = this.stockForm.options?.length + 1;
            this.stockForm.options.push({ name: "", values: [{ index: 0, value: "" }], order: optionIndex, isEdit: true });
        }
    }

    /**
     * This will use for check option validation in variant
     *
     * @return {*}  {boolean}
     * @memberof StockCreateEditComponent
     */
    public checkOptionValidity(): boolean {
        let isValid = true;
        this.stockForm.options.forEach(option => {
            if (!option.name || !option.values.length) {
                isValid = false;
                return isValid;
            }
        });
        return isValid;
    }

    /**
     * Delete variant option
     *
     * @param {number} index
     * @memberof StockCreateEditComponent
     */
    public deleteVariantOption(index: number): void {
        this.stockForm.options = this.stockForm.options?.filter((data, optionIndex) => optionIndex !== index).map((data, optionIndex) => {
            return {
                name: data.name,
                values: data.values,
                order: optionIndex + 1
            }
        });
        this.generateVariants();
    }

    /**
     * Delete option value
     *
     * @param {number} optionIndex
     * @param {number} optionValueIndex
     * @memberof StockCreateEditComponent
     */
    public deleteOptionValue(optionIndex: number, optionValueIndex: number): void {
        let optionValues = this.stockForm.options[optionIndex].values?.filter((data, index) => optionValueIndex !== index);
        this.stockForm.options[optionIndex].values = optionValues;
    }

    /**
     * Generate variants
     *
     * @memberof StockCreateEditComponent
     */
    public generateVariants(): void {
        const checkUnitRateObject = {
            purchase: false,
            sales: false,
            fixedAssets: false
        }
        this.checkUnitRateValidation = [];
        let attributes = [];

        this.stockForm.options?.forEach((option, index) => {
            if (option?.values?.length > 0) {
                attributes[index] = [];
                let optionName = option?.name;
                option?.values?.forEach(value => {
                    if (value?.value?.trim()) {
                        attributes[index].push({ [optionName]: value?.value })
                    }
                });
            }
        });

        if (attributes?.length > 0) {
            attributes = attributes.reduce((previous, current) => previous.flatMap(currentValue => current.map(finalValue => ({ ...currentValue, ...finalValue }))));
        }

        let variants = [];
        attributes?.forEach(attribute => {
            let variantValues = [];
            Object.keys(attribute).forEach(key => {
                variantValues.push(attribute[key]);
            });

            variants.push({ forward: variantValues.join(" / "), backward: variantValues.reverse().join(" / ") });
        });

        let defaultWarehouse = null;
        if (this.warehouses?.length > 0) {
            defaultWarehouse = this.warehouses?.filter(warehouse => warehouse.isDefault);
        }
        const existingVariants = cloneDeep(this.stockForm.variants);
        let stockVariants = [];
        variants?.forEach(variant => {
            let forwardVariantExists = existingVariants?.filter(existingVariant => existingVariant?.name === variant.forward);
            let backwardVariantExists = (forwardVariantExists?.length <= 0) ? existingVariants?.filter(existingVariant => existingVariant?.name === variant.backward) : [];
            let variantObj = (forwardVariantExists?.length > 0) ? forwardVariantExists[0] : (backwardVariantExists?.length > 0) ? backwardVariantExists[0] : {
                name: variant.forward,
                archive: false,
                uniqueName: undefined,
                skuCode: undefined,
                salesTaxInclusive: false,
                purchaseTaxInclusive: false,
                fixedAssetTaxInclusive: false,
                salesInformation: [
                    {
                        rate: undefined,
                        stockUnitCode: undefined,
                        stockUnitName: this.stockUnitName,
                        stockUnitUniqueName: this.stockForm.stockUnitUniqueName,
                        accountUniqueName: this.stockForm.salesAccountDetails?.accountUniqueName
                    }
                ],
                purchaseInformation: [
                    {
                        rate: undefined,
                        stockUnitCode: undefined,
                        stockUnitName: this.stockUnitName,
                        stockUnitUniqueName: this.stockForm.stockUnitUniqueName,
                        accountUniqueName: this.stockForm.purchaseAccountDetails?.accountUniqueName
                    }
                ],
                fixedAssetsInformation: [
                    {
                        rate: undefined,
                        stockUnitCode: undefined,
                        stockUnitName: this.stockUnitName,
                        stockUnitUniqueName: this.stockForm.stockUnitUniqueName,
                        accountUniqueName: this.stockForm.fixedAssetAccountDetails?.accountUniqueName
                    }
                ],
                warehouseBalance: [
                    {
                        warehouse: {
                            name: (defaultWarehouse) ? defaultWarehouse[0]?.name : undefined,
                            uniqueName: (defaultWarehouse) ? defaultWarehouse[0]?.uniqueName : undefined
                        },
                        stockUnit: {
                            name: this.stockUnitName,
                            uniqueName: this.stockForm.stockUnitUniqueName
                        },
                        openingQuantity: 0,
                        openingAmount: 0
                    }
                ]
            };
            stockVariants.push(variantObj);
            this.checkUnitRateValidation.push(Object.assign({}, checkUnitRateObject));
        });

        if (!stockVariants?.length) {
            stockVariants.push({
                name: "",
                archive: false,
                uniqueName: undefined,
                skuCode: undefined,
                salesTaxInclusive: false,
                purchaseTaxInclusive: false,
                fixedAssetTaxInclusive: false,
                salesInformation: [
                    {
                        rate: undefined,
                        stockUnitCode: undefined,
                        stockUnitName: undefined,
                        stockUnitUniqueName: undefined,
                        accountUniqueName: ""
                    }
                ],
                purchaseInformation: [
                    {
                        rate: undefined,
                        stockUnitCode: undefined,
                        stockUnitName: undefined,
                        stockUnitUniqueName: undefined,
                        accountUniqueName: ""
                    }
                ],
                fixedAssetsInformation: [
                    {
                        rate: undefined,
                        stockUnitCode: undefined,
                        stockUnitName: undefined,
                        stockUnitUniqueName: undefined,
                        accountUniqueName: ""
                    }
                ],
                warehouseBalance: [
                    {
                        warehouse: {
                            name: undefined,
                            uniqueName: undefined
                        },
                        stockUnit: {
                            name: "",
                            uniqueName: ""
                        },
                        openingQuantity: 0,
                        openingAmount: 0
                    }
                ]
            });
            this.checkUnitRateValidation.push(Object.assign({}, checkUnitRateObject));
        }
        this.stockForm.variants = stockVariants;
    }

    /**
     * Add new purchase unit section
     *
     * @memberof StockCreateEditComponent
     */
    public addNewPurchaseUnitPrice(): void {
        this.stockForm.purchaseAccountDetails.unitRates.push({
            rate: null,
            stockUnitCode: null,
            stockUnitUniqueName: null
        });
    }


    /**
     * Add new fixed assets unit section
     *
     * @memberof StockCreateEditComponent
     */
    public addNewFixedAssetsUnitPrice(): void {
        this.stockForm.fixedAssetAccountDetails.unitRates.push({
            rate: null,
            stockUnitCode: null,
            stockUnitUniqueName: null
        });
    }

    /**
    * Delete fixed assets unit section
    *
    * @param {number} unitRateIndex
    * @memberof StockCreateEditComponent
    */
    public deleteFixedAssetsUnitPrice(unitRateIndex: number): void {
        let unitRates = this.stockForm.fixedAssetAccountDetails?.unitRates?.filter((data, index) => index !== unitRateIndex).map(data => { return data });
        this.stockForm.fixedAssetAccountDetails.unitRates = unitRates;

        if (unitRates?.length === 0) {
            this.addNewFixedAssetsUnitPrice();
        }
    }

    /**
     * Delete purchase unit section
     *
     * @param {number} unitRateIndex
     * @memberof StockCreateEditComponent
     */
    public deletePurchaseUnitPrice(unitRateIndex: number): void {
        let unitRates = this.stockForm.purchaseAccountDetails.unitRates?.filter((data, index) => index !== unitRateIndex).map(data => { return data });
        this.stockForm.purchaseAccountDetails.unitRates = unitRates;

        if (unitRates?.length === 0) {
            this.addNewPurchaseUnitPrice();
        }
    }

    /**
     * Add new sales unit section
     *
     * @memberof StockCreateEditComponent
     */
    public addNewSalesUnitPrice(): void {
        this.stockForm.salesAccountDetails.unitRates.push({
            rate: null,
            stockUnitCode: null,
            stockUnitUniqueName: null
        });
    }

    /**
     * Delete sales unit section
     *
     * @param {number} unitRateIndex
     * @memberof StockCreateEditComponent
     */
    public deleteSalesUnitPrice(unitRateIndex: number): void {
        let unitRates = this.stockForm.salesAccountDetails.unitRates?.filter((data, index) => index !== unitRateIndex).map(data => { return data });
        this.stockForm.salesAccountDetails.unitRates = unitRates;

        if (unitRates?.length === 0) {
            this.addNewSalesUnitPrice();
        }
    }

    /**
     * Set unit in variant
     *
     * @param {*} variant
     * @param {*} event
     * @memberof StockCreateEditComponent
     */
    public selectVariantUnit(variant: any, event: any): void {
        variant.warehouseBalance[0].stockUnit = { name: event.label, uniqueName: event?.value };
    }

    /**
     * Get taxes
     *
     * @memberof StockCreateEditComponent
     */
    public getTaxes(): void {
        this.store.dispatch(this.companyAction.getTax());
        this.store.pipe(select(state => state?.company?.taxes), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.length > 0 && !this.processedTaxes?.length) {
                this.taxes = response || [];
            }
            this.changeDetection.detectChanges();
        });
    }

    /**
    * This will reset the taxes list
    *
    * @memberof StockCreateEditComponent
    */
    public resetTaxes(): void {
        this.taxes?.forEach(tax => {
            tax.isChecked = false;
            tax.isDisabled = false;
            return tax;
        });
        this.changeDetection.detectChanges();
    }

    /**
     * Show inline editing for custom field label
     *
     * @param {number} field
     * @memberof StockCreateEditComponent
     */
    public showCustomFieldLabelInlineEdit(field: number): void {
        this.inlineEditCustomField = field;
    }

    /**
     * Get warehouses
     *
     * @memberof StockCreateEditComponent
     */
    public getWarehouses(): void {
        this.store.dispatch(this.warehouseAction.fetchAllWarehouses({ page: 1, count: 0 }));

        this.store.pipe(select(state => state.warehouse.warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
            this.warehouses = warehouses?.results;
        });
    }

    /**
     * Create stock
     *
     * @param {boolean} [openEditAfterSave=false]
     * @returns {void}
     * @memberof StockCreateEditComponent
     */
    public createStock(openEditAfterSave: boolean = false): void {
        this.isFormSubmitted = false;
        if (!this.stockForm.name || !this.stockForm.stockUnitUniqueName) {
            this.isFormSubmitted = true;
            return;
        }
        if (this.validateStock(this.stockForm.purchaseAccountDetails?.unitRates)) {
            this.stockForm.purchaseAccountDetails.unitRates = this.stockForm.purchaseAccountDetails.unitRates.filter((unitRate) => {
                return unitRate.stockUnitUniqueName || unitRate.rate;
            });
        } else {
            this.toaster.showSnackBar("error", INVALID_STOCK_ERROR_MESSAGE);
            return;
        }
        if (this.validateStock(this.stockForm.salesAccountDetails?.unitRates)) {
            this.stockForm.salesAccountDetails.unitRates = this.stockForm.salesAccountDetails.unitRates?.filter((unitRate) => {
                return unitRate.stockUnitUniqueName || unitRate.rate;
            });
        } else {
            this.toaster.showSnackBar("error", INVALID_STOCK_ERROR_MESSAGE);
            return;
        }
        if (this.validateStock(this.stockForm.fixedAssetAccountDetails?.unitRates)) {
            this.stockForm.fixedAssetAccountDetails.unitRates = this.stockForm.fixedAssetAccountDetails.unitRates.filter((unitRate) => {
                return unitRate.stockUnitUniqueName || unitRate.rate;
            });
        } else {
            this.toaster.showSnackBar("error", INVALID_STOCK_ERROR_MESSAGE);
            return;
        }
        if (!this.stockGroupUniqueName) {
            let mainGroupExists = this.stockGroups?.filter(group => {
                return group?.additional?.name === "Main Group"
            });
            if (mainGroupExists?.length > 0) {
                this.stockGroupUniqueName = mainGroupExists[0]?.value;
                this.saveStock(openEditAfterSave);
            } else {
                let stockRequest = {
                    name: 'Main Group',
                    uniqueName: 'maingroup',
                    hsnNumber: '',
                    sacNumber: '',
                    type: this.stockForm.type
                };
                this.inventoryService.CreateStockGroup(stockRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === "success") {
                        this.stockGroupUniqueName = response?.body?.uniqueName;
                        this.saveStock(openEditAfterSave);
                    } else {
                        this.toaster.showSnackBar("error", response?.message);
                    }
                });
            }
        } else {
            this.saveStock(openEditAfterSave);
        }
    }

    /**
     * Saves stock
     *
     * @private
     * @param {boolean} openEditAfterSave
     * @memberof StockCreateEditComponent
     */
    private saveStock(openEditAfterSave: boolean): void {
        this.toggleLoader(true);
        const request = this.formatRequest();
        this.inventoryService.createStock(request, this.stockGroupUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.toggleLoader(false);
            if (response?.status === "success") {
                this.resetForm(this.stockCreateEditForm);
                this.resetTaxes();
                if (!openEditAfterSave) {
                    this.toaster.showSnackBar("success", this.localeData?.stock_create_succesfully);
                    this.backClicked();
                } else {
                    this.router.navigate(['/pages/inventory/v2/stock/' + this.stockForm.type?.toLowerCase() + '/edit/' + response.body?.uniqueName], { queryParams: { tab: 2 } });
                }
            } else {
                this.toaster.showSnackBar("error", response?.message);
            }
        });
    }

    /**
     * Formats request before sending
     *
     * @returns {*}
     * @memberof StockCreateEditComponent
     */
    public formatRequest(): any {
        let stockForm = cloneDeep(this.stockForm);
        stockForm.taxes = this.taxTempArray.map(tax => tax?.uniqueName);

        stockForm.customFields = stockForm.customFields?.map(customField => {
            return {
                uniqueName: customField?.uniqueName,
                value: customField?.value
            }
        });
        let defaultWarehouse = null;
        if (this.warehouses?.length > 0) {
            defaultWarehouse = this.warehouses?.filter(warehouse => warehouse?.isDefault);
        }
        const variantfixedAssetAccountUniqueName = stockForm?.fixedAssetAccountDetails?.accountUniqueName ?? stockForm.variants[0]?.fixedAssetAccountDetails?.accountUniqueName;
        const variantPurchaseAccountUniqueName = stockForm?.purchaseAccountDetails?.accountUniqueName ?? stockForm.variants[0]?.purchaseAccountDetails?.accountUniqueName;
        const variantSalesAccountUniqueName = stockForm?.salesAccountDetails?.accountUniqueName ?? stockForm.variants[0]?.salesAccountDetails?.accountUniqueName;

        stockForm.options = stockForm.options?.map(option => {
            option.values = option?.values?.map(optionValue => {
                return optionValue.value;
            });
            return option;
        });

        stockForm.variants = stockForm.variants?.map(variant => {
            const salesUnitRate = variant?.salesInformation?.map(unitRate => {
                unitRate.accountUniqueName = variantSalesAccountUniqueName;
                return unitRate;
            });
            const purchaseUnitRate = variant?.purchaseInformation?.map(unitRate => {
                unitRate.accountUniqueName = variantPurchaseAccountUniqueName;
                return unitRate;
            });

            const fixedAssetsUnitRate = variant?.fixedAssetsInformation?.map(unitRate => {
                unitRate.accountUniqueName = variantfixedAssetAccountUniqueName;
                return unitRate;
            });
            if (!variant.name) {
                variant.name = stockForm.name;
            }
            if (this.stockForm.type === 'FIXED_ASSETS') {
                variant['unitRates'] = fixedAssetsUnitRate;
            } else {
                variant['unitRates'] = salesUnitRate?.concat(purchaseUnitRate);
            }
            variant.warehouseBalance = [
                {
                    warehouse: {
                        name: (defaultWarehouse) ? defaultWarehouse[0]?.name : undefined,
                        uniqueName: (defaultWarehouse) ? defaultWarehouse[0]?.uniqueName : undefined
                    },
                    stockUnit: {
                        name: variant.warehouseBalance[0].stockUnit?.name,
                        uniqueName: variant.warehouseBalance[0].stockUnit?.uniqueName
                    },
                    openingQuantity: this.isVariantAvailable ? variant.warehouseBalance[0].openingQuantity : this.stockForm.openingQuantity,
                    openingAmount: this.isVariantAvailable ? variant.warehouseBalance[0].openingAmount : this.stockForm.openingAmount
                }
            ]

            delete variant.salesInformation;
            delete variant.purchaseInformation;
            delete variant.fixedAssetsInformation;
            delete variant.fixedAssetAccountDetails;
            delete variant.purchaseAccountDetails;
            delete variant.salesAccountDetails;
            variant['unitRates'] = variant?.unitRates?.filter(rate => rate?.rate);
            return variant;
        });

        if (this.stockForm.type === 'FIXED_ASSETS') {
            stockForm['fixedAssetsAccountUniqueNames'] = variantfixedAssetAccountUniqueName ? [variantfixedAssetAccountUniqueName] : [];

        } else {
            stockForm['purchaseAccountUniqueNames'] = variantPurchaseAccountUniqueName ? [variantPurchaseAccountUniqueName] : [];
            stockForm['salesAccountUniqueNames'] = variantSalesAccountUniqueName ? [variantSalesAccountUniqueName] : [];
        }
        delete stockForm.fixedAssetAccountDetails;
        delete stockForm.purchaseAccountDetails;
        delete stockForm.salesAccountDetails;
        if (this.stockForm.type === 'FIXED_ASSETS') {
            delete stockForm.purchaseAccountUniqueNames;
            delete stockForm.salesAccountUniqueNames;
        } else {
            delete stockForm.fixedAssetsAccountUniqueNames;
        }

        if (this.hsnSac === "HSN") {
            stockForm.sacNumber = "";
        } else {
            stockForm.hsnNumber = "";
        }

        return stockForm;
    }

    /**
     * Get stock details
     *
     * @memberof StockCreateEditComponent
     */
    public getStockDetails(): void {
        this.toggleLoader(true);
        this.inventoryService.getStockV2(this.queryParams?.stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response.body) {
                this.stockForm.name = response.body.name;
                this.stockForm.uniqueName = response.body.uniqueName;
                this.stockForm.stockUnitCode = response.body.stockUnit?.code;
                this.stockForm.stockUnitUniqueName = response.body?.stockUnit?.uniqueName;
                this.stockForm.hsnNumber = response.body.hsnNumber;
                this.stockForm.sacNumber = response.body.sacNumber;
                this.stockForm.taxes = response.body.taxes;
                this.stockForm.skuCode = response.body.skuCode;
                this.stockForm.openingQuantity = response.body.openingQuantity;
                this.stockForm.openingAmount = response.body.openingAmount;
                this.stockForm.skuCodeHeading = response.body.skuCodeHeading;
                this.stockForm.customField1Heading = response.body.customField1Heading;
                this.stockForm.customField1Value = response.body.customField1Value;
                this.stockForm.customField2Heading = response.body.customField2Heading;
                this.stockForm.customField2Value = response.body.customField2Value;
                this.stockForm.isFsStock = response.body.isFsStock;
                this.stockForm.manufacturingDetails = response.body.manufacturingDetails;
                this.stockForm.accountGroup = response.body.accountGroup;
                this.stockForm.lowStockAlertCount = response.body.lowStockAlertCount;
                this.stockForm.outOfStockSelling = response.body.outOfStockSelling;
                this.stockForm.variants = response.body.variants;
                this.stockForm.options = response.body.options?.map(option => {
                    option.values = option.values?.map((optionValue, optionIndex) => {
                        return { index: optionIndex, value: optionValue };
                    });
                    return option;
                });

                this.isVariantAvailable = (this.stockForm?.variants?.length > 0) ? true : false;
                this.stockGroupUniqueName = response.body.stockGroup?.uniqueName;
                this.defaultStockGroupUniqueName = response.body.stockGroup?.uniqueName;
                if (response.body.purchaseAccountUniqueNames?.length) {
                    this.stockForm.purchaseAccountDetails = { accountUniqueName: response.body.purchaseAccountUniqueNames[0] };
                }
                if (response.body.salesAccountUniqueNames?.length) {
                    this.stockForm.salesAccountDetails = { accountUniqueName: response.body.salesAccountUniqueNames[0] };
                }
                if (response.body.fixedAssetAccountUniqueNames?.length) {
                    this.stockForm.fixedAssetAccountDetails = { accountUniqueName: response.body.fixedAssetAccountUniqueNames[0] };
                }
                const unitRateObj = {
                    rate: null,
                    stockUnitCode: null,
                    stockUnitUniqueName: null,
                    accountUniqueName: null
                }
                this.stockForm.variants = this.stockForm.variants?.map(variant => {
                    ['purchaseAccountDetails', 'salesAccountDetails', 'fixedAssetAccountDetails'].forEach(accountDetailsKey => {
                        if (!variant[accountDetailsKey]) {
                            variant[accountDetailsKey] = {
                                accountUniqueName: null,
                                unitRates: [Object.assign({}, unitRateObj)]
                            }
                        } else if (!variant[accountDetailsKey]?.unitRates?.length) {
                            variant[accountDetailsKey]['unitRates'] = [Object.assign({}, unitRateObj)];
                        } else {
                            variant[accountDetailsKey].unitRates = variant[accountDetailsKey].unitRates.map(unitRate => {
                                unitRate['accountUniqueName'] = variant[accountDetailsKey].accountUniqueName;
                                return unitRate;
                            });
                        }
                    });
                    variant['salesInformation'] = variant?.salesAccountDetails?.unitRates;
                    variant['purchaseInformation'] = variant?.purchaseAccountDetails?.unitRates;
                    variant['fixedAssetsInformation'] = variant?.fixedAssetAccountDetails?.unitRates;

                    return variant;
                });

                this.stockUnitName = response.body?.stockUnit?.name;
                this.stockGroupName = response.body?.stockGroup?.name;
                this.customFieldsData = response.body?.customFields;
                this.mapCustomFieldsData();
                this.findPurchaseAccountName();
                this.findSalesAccountName();
                this.findFixedAssetsAccountName();
                this.toggleLoader(false);
                this.changeDetection.detectChanges();
            } else {
                this.toggleLoader(false);
                this.toaster.showSnackBar("error", response?.message);
            }
        });
    }

    /**
     * Finds purchase account name
     *
     * @private
     * @memberof StockCreateEditComponent
     */
    private findPurchaseAccountName(): void {
        let purchaseAccountName = this.purchaseAccounts?.filter(purchaseAccount => purchaseAccount?.value === this.stockForm?.variants[0]?.purchaseAccountDetails?.accountUniqueName);
        if (purchaseAccountName?.length > 0) {
            this.purchaseAccountName = purchaseAccountName[0]?.label;
        }
        this.changeDetection.detectChanges();
    }

    /**
     * Finds fixed assets account name
     *
     * @private
     * @memberof StockCreateEditComponent
     */
    private findFixedAssetsAccountName(): void {
        let fixedAssetsAccountName = this.fixedAssetsAccounts?.filter(fixedAssetsAccount => fixedAssetsAccount?.value === this.stockForm?.variants[0]?.fixedAssetAccountDetails?.accountUniqueName);
        if (fixedAssetsAccountName?.length > 0) {
            this.fixedAssetsAccountName = fixedAssetsAccountName[0]?.label;
        }
        this.changeDetection.detectChanges();
    }

    /**
     * Finds sales account name
     *
     * @private
     * @memberof StockCreateEditComponent
     */
    private findSalesAccountName(): void {
        let salesAccountName = this.salesAccounts?.filter(salesAccount => salesAccount?.value === this.stockForm?.variants[0]?.salesAccountDetails?.accountUniqueName);
        if (salesAccountName?.length > 0) {
            this.salesAccountName = salesAccountName[0]?.label;
        }
        this.changeDetection.detectChanges();
    }

    /**
     * Update stock
     *
     * @param {NgForm} stockCreateEditForm
     * @returns {void}
     * @memberof StockCreateEditComponent
     */
    public updateStock(stockCreateEditForm: NgForm): void {
        if (stockCreateEditForm.invalid) {
            return;
        }

        this.toggleLoader(true);
        const request = this.formatRequest();
        this.inventoryService.updateStockV2(request, this.stockGroupUniqueName, this.queryParams?.stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.toggleLoader(false);
            if (response?.status === "success") {
                this.toaster.showSnackBar("success", this.localeData?.stock_update_succesfully);
                this.backClicked();
            } else {
                this.toaster.showSnackBar("error", response?.message);
            }
        });
    }

    /**
     * Validates the stock to have both unit and rate if either of them has been provided
     * The stock to be created is valid if the user has either provided both unit and rate or
     * has provided none. If the user provides anyone of them then it is invalid entry and method
     * will return false
     *
     * @private
     * @param {Array<any>} unitRates Array of stockUnitCode and rate keys
     * @returns {boolean} True, if the stock is valid
     * @memberof StockCreateEditComponent
     */
    private validateStock(unitRates: Array<any>): boolean {
        if (unitRates) {
            const formEntries = unitRates.filter((unitRate) => {
                return (unitRate.stockUnitUniqueName && !unitRate.rate) || (!unitRate.stockUnitUniqueName && unitRate.rate);
            });
            return formEntries?.length === 0;
        }
        return true;
    }

    /**
     * Callback for tax selection box change event
     *
     * @param {boolean} event
     * @memberof StockCreateEditComponent
     */
    public openedSelectTax(event: boolean): void {
        this.isTaxSelectionOpen = event;
        if (event) {
            this.processedTaxes = [];
        }
    }

    /**
     * Select tax
     *
     * @param {*} taxSelected
     * @memberof StockCreateEditComponent
     */
    public selectTax(taxSelected: any): void {
        if (!taxSelected) {
            return;
        }

        if (!this.isTaxSelectionOpen) {
            if (this.processedTaxes.includes(taxSelected.uniqueName)) {
                return;
            }
            this.processedTaxes.push(taxSelected.uniqueName);
        }

        let isSelected = this.selectedTaxes?.filter(selectedTax => selectedTax === taxSelected.uniqueName);
        if (taxSelected.taxType !== 'gstcess') {
            let index = findIndex(this.taxTempArray, (taxTemp) => taxTemp.taxType === taxSelected.taxType);
            if (index > -1 && !isSelected?.length) {
                forEach(this.taxes, (tax) => {
                    if (tax.taxType === taxSelected.taxType) {
                        tax.isChecked = false;
                        tax.isDisabled = true;
                    }
                    if ((taxSelected.taxType === 'tcsrc' || taxSelected.taxType === 'tdsrc' || taxSelected.taxType === 'tcspay' || taxSelected.taxType === 'tdspay') && (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay')) {
                        tax.isChecked = false;
                        tax.isDisabled = true;
                    }
                });
            }

            if (index < 0 && !isSelected?.length) {
                forEach(this.taxes, (tax) => {
                    if (tax.taxType === taxSelected.taxType) {
                        tax.isChecked = false;
                        tax.isDisabled = true;
                    }

                    if ((taxSelected.taxType === 'tcsrc' || taxSelected.taxType === 'tdsrc' || taxSelected.taxType === 'tcspay' || taxSelected.taxType === 'tdspay') && (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay')) {
                        tax.isChecked = false;
                        tax.isDisabled = true;
                    }
                    if (tax?.uniqueName === taxSelected.uniqueName) {
                        taxSelected.isChecked = true;
                        taxSelected.isDisabled = false;
                        this.taxTempArray.push(taxSelected);
                    }
                });
            } else if (index > -1 && !isSelected?.length) {
                taxSelected.isChecked = true;
                taxSelected.isDisabled = false;
                this.taxTempArray = this.taxTempArray?.filter(taxTemp => {
                    return taxSelected.taxType !== taxTemp.taxType;
                });
                this.taxTempArray.push(taxSelected);
            } else {
                let idx = findIndex(this.taxTempArray, (taxTemp) => taxTemp?.uniqueName === taxSelected.uniqueName);
                this.taxTempArray.splice(idx, 1);
                taxSelected.isChecked = false;
                forEach(this.taxes, (tax) => {
                    if (tax.taxType === taxSelected.taxType) {
                        tax.isDisabled = false;
                    }
                    if ((taxSelected.taxType === 'tcsrc' || taxSelected.taxType === 'tdsrc' || taxSelected.taxType === 'tcspay' || taxSelected.taxType === 'tdspay') && (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay')) {
                        tax.isDisabled = false;
                    }
                });
            }
        } else {
            if (!isSelected?.length) {
                this.taxTempArray.push(taxSelected);
                taxSelected.isChecked = true;
            } else {
                let idx = findIndex(this.taxTempArray, (taxTemp) => taxTemp?.uniqueName === taxSelected.uniqueName);
                this.taxTempArray.splice(idx, 1);
                taxSelected.isChecked = false;
            }
        }
        this.selectedTaxes = this.taxTempArray.map(tax => tax?.uniqueName);
        this.changeDetection.detectChanges();
    }

    /**
     * Get custom fields
     *
     * @memberof StockCreateEditComponent
     */
    public getCustomFields(): void {
        this.customFieldsService.list(this.customFieldsRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === 'success') {
                this.stockForm.customFields = response.body?.results;
                this.mapCustomFieldsData();
            } else {
                this.toaster.showSnackBar("error", response.message);
            }
            this.changeDetection.detectChanges();
        });
    }


    /**
     * Maps the custom field data in object
     *
     * @memberof StockCreateEditComponent
     */
    public mapCustomFieldsData(): void {
        if (this.stockForm.customFields?.length > 0 && this.customFieldsData?.length > 0) {
            this.stockForm.customFields?.forEach(customField => {
                const customFieldData = this.customFieldsData?.filter(cfData => cfData?.uniqueName === customField?.uniqueName);
                if (customFieldData?.length > 0) {
                    customField.value = customFieldData[0]?.value;
                }
            });
        }
    }

    /**
     * Toggle loader
     *
     * @private
     * @param {boolean} showLoader
     * @memberof StockCreateEditComponent
     */
    private toggleLoader(showLoader: boolean): void {
        this.showLoader = showLoader;
        this.changeDetection.detectChanges();
    }

    /**
     * Resets the form
     *
     * @param {NgForm} stockCreateEditForm
     * @memberof StockCreateEditComponent
     */
    public resetForm(stockCreateEditForm: NgForm): void {
        stockCreateEditForm?.form?.reset();
        stockCreateEditForm?.form?.controls?.hsn_sac?.setValue('HSN');
        this.stockForm = {
            type: this.stockForm.type,
            name: null,
            uniqueName: null,
            stockUnitCode: null,
            stockUnitUniqueName: null,
            hsnNumber: null,
            sacNumber: null,
            taxes: null,
            skuCode: null,
            openingQuantity: null,
            openingAmount: null,
            skuCodeHeading: null,
            customField1Heading: "Custom Field 1",
            customField1Value: null,
            customField2Heading: "Custom Field 2",
            customField2Value: null,
            purchaseAccountDetails: {
                accountUniqueName: null,
                unitRates: [
                    {
                        rate: null,
                        stockUnitCode: null,
                        stockUnitName: null,
                        stockUnitUniqueName: null
                    }
                ]
            },
            salesAccountDetails: {
                accountUniqueName: null,
                unitRates: [
                    {
                        rate: null,
                        stockUnitCode: null,
                        stockUnitName: null,
                        stockUnitUniqueName: null
                    }
                ]
            },
            fixedAssetAccountDetails: {
                accountUniqueName: null,
                unitRates: [
                    {
                        rate: null,
                        stockUnitCode: null,
                        stockUnitName: null,
                        stockUnitUniqueName: null
                    }
                ]
            },
            isFsStock: null,
            manufacturingDetails: null,
            accountGroup: null,
            lowStockAlertCount: 0,
            outOfStockSelling: true,
            variants: [
                {
                    name: "",
                    archive: false,
                    uniqueName: undefined,
                    skuCode: undefined,
                    salesTaxInclusive: false,
                    purchaseTaxInclusive: false,
                    fixedAssetTaxInclusive: false,
                    salesInformation: [
                        {
                            rate: undefined,
                            stockUnitCode: undefined,
                            stockUnitName: undefined,
                            stockUnitUniqueName: undefined,
                            accountUniqueName: ""
                        }
                    ],
                    purchaseInformation: [
                        {
                            rate: undefined,
                            stockUnitCode: undefined,
                            stockUnitName: undefined,
                            stockUnitUniqueName: undefined,
                            accountUniqueName: ""
                        }
                    ],
                    fixedAssetsInformation: [
                        {
                            rate: undefined,
                            stockUnitCode: undefined,
                            stockUnitName: undefined,
                            stockUnitUniqueName: undefined,
                            accountUniqueName: ""
                        }
                    ],
                    warehouseBalance: [
                        {
                            warehouse: {
                                name: undefined,
                                uniqueName: undefined
                            },
                            stockUnit: {
                                name: "",
                                uniqueName: ""
                            },
                            openingQuantity: 0,
                            openingAmount: 0
                        }
                    ]
                }
            ],
            options: [],
            customFields: []
        };
        this.isFormSubmitted = false;
        this.stockGroupUniqueName = this.stockGroups[0]?.value;
        this.isVariantAvailable = false;
        this.stockUnitName = "";
        this.stockGroupName = "";
        this.purchaseAccountName = "";
        this.fixedAssetsAccountName = "";
        this.salesAccountName = "";
        this.customFieldsData = [];
        this.inlineEditCustomField = 0;
        this.selectedTaxes = [];
        this.taxTempArray = [];
        this.isTaxSelectionOpen = false;
        this.processedTaxes = [];
        this.changeDetection.detectChanges();
    }

    /**
     * This will redirect to inventory list page
     *
     * @memberof StockCreateEditComponent
     */
    public cancelEdit(): void {
        this.backClicked();
    }

    /**
     * This will use for delete stock
     *
     * @memberof StockCreateEditComponent
     */
    public deleteStock(): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '40%',
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.delete_stock,
                permanentlyDeleteMessage: this.localeData?.permanently_delete,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.toggleLoader(true);
                this.inventoryService.deleteStock(this.defaultStockGroupUniqueName, this.queryParams?.stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.toggleLoader(false);
                    if (response?.status === "success") {
                        this.toaster.showSnackBar("success", this.localeData?.stock_delete_succesfully);
                        this.cancelEdit();
                    } else {
                        this.toaster.showSnackBar("error", response?.message);
                    }
                });
            }
        });
    }

    /**
     * Move stock in new group
     *
     * @memberof StockCreateEditComponent
     */
    public moveStock(): void {
        this.toggleLoader(true);
        this.inventoryService.MoveStock(this.defaultStockGroupUniqueName, this.queryParams?.stockUniqueName, this.stockGroupUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            this.toggleLoader(false);
            if (response?.status === "success") {
                this.defaultStockGroupUniqueName = cloneDeep(this.stockGroupUniqueName);
                this.toaster.showSnackBar("success", response?.body);
                this.changeDetection.detectChanges();
            } else {
                this.toaster.showSnackBar("error", response?.message);
            }
        });
    }

    /**
   * Set unit in variant
   *
   * @param {*} variantSalesUnitRate
   * @param {*} event
   * @memberof StockCreateEditComponent
   */
    public selectVariantSalesPurchaseUnit(variantSalesUnitRate: any, event: any): void {
        variantSalesUnitRate.stockUnitCode = event.additional?.code;
        variantSalesUnitRate.stockUnitName = event?.label;
        variantSalesUnitRate.stockUnitUniqueName = event?.value;
    }

    /**
    * Set unit in variant fixed assets
    *
    * @param {*} variantFixedAssetsUnitRate
    * @param {*} event
    * @memberof StockCreateEditComponent
    */
    public selectVariantFixedAssetsUnit(variantFixedAssetsUnitRate: any, event: any): void {
        variantFixedAssetsUnitRate.stockUnitCode = event.additional?.code;
        variantFixedAssetsUnitRate.stockUnitName = event?.label;
        variantFixedAssetsUnitRate.stockUnitUniqueName = event?.value;
    }

    /**
     * Add new fixed assets unit section
     *
     * @memberof StockCreateEditComponent
     */
    public addNewVariantFixedAssetsUnitPrice(variant: any, index = 0): void {
        if (this.checkUnitRateValidations(variant, 'fixedAssetsInformation')) {
            this.checkUnitRateValidation[index].fixedAssets = false;
            variant.fixedAssetsInformation.push({
                rate: null,
                stockUnitCode: null,
                stockUnitUniqueName: null,
                stockUnitName: null,
                accountUniqueName: this.stockForm.fixedAssetAccountDetails?.accountUniqueName
            });
        } else {
            this.checkUnitRateValidation[index].fixedAssets = true;
        }
    }

    /**
    * Delete fixed assets unit section
    *
    * @param {number} unitRateIndex
    * @memberof StockCreateEditComponent
    */
    public deleteVariantFixedAssetsUnitPrice(variant: any, unitRateIndex: number): void {
        let unitRates = variant.fixedAssetsInformation?.filter((data, index) => index !== unitRateIndex).map(data => { return data });
        variant.fixedAssetsInformation = unitRates;

        if (unitRates?.length === 0) {
            this.addNewVariantFixedAssetsUnitPrice(variant);
        }
    }

    /**
     * Add new purchase unit section
     *
     * @memberof StockCreateEditComponent
     */
    public addNewVariantPurchaseUnitPrice(variant: any, index = 0): void {
        if (this.checkUnitRateValidations(variant, 'purchaseInformation')) {
            this.checkUnitRateValidation[index].purchase = false;
            variant.purchaseInformation.push({
                rate: null,
                stockUnitCode: null,
                stockUnitUniqueName: null,
                stockUnitName: null,
                accountUniqueName: this.stockForm.purchaseAccountDetails?.accountUniqueName
            });
        } else {
            this.checkUnitRateValidation[index].purchase = true;
        }
    }

    /**
     * This will use for check unit rate validation
     *
     * @param {*} variant
     * @param {string} key
     * @return {*}  {boolean}
     * @memberof StockCreateEditComponent
     */
    public checkUnitRateValidations(variant: any, key: string): boolean {
        let isValid = true;
        variant[key].forEach(value => {
            if (!value.rate || !value.stockUnitName) {
                isValid = false;
                return false;
            }
        });
        return isValid;
    }

    /**
     * Delete purchase unit section
     *
     * @param {number} unitRateIndex
     * @memberof StockCreateEditComponent
     */
    public deleteVariantPurchaseUnitPrice(variant: any, unitRateIndex: number): void {
        let unitRates = variant.purchaseInformation?.filter((data, index) => index !== unitRateIndex).map(data => { return data });
        variant.purchaseInformation = unitRates;

        if (unitRates?.length === 0) {
            this.addNewVariantPurchaseUnitPrice(variant);
        }
    }

    /**
     * Add new sales unit section
     *
     * @memberof StockCreateEditComponent
     */
    public addNewVariantSalesUnitPrice(variant: any, index = 0): void {
        if (this.checkUnitRateValidations(variant, 'salesInformation')) {
            this.checkUnitRateValidation[index].sales = false;
            variant.salesInformation.push({
                rate: null,
                stockUnitCode: null,
                stockUnitUniqueName: null,
                stockUnitName: null,
                accountUniqueName: this.stockForm.salesAccountDetails?.accountUniqueName
            });
        } else {
            this.checkUnitRateValidation[index].sales = true;
        }
    }

    /**
     * Delete sales unit section
     *
     * @param {number} unitRateIndex
     * @memberof StockCreateEditComponent
     */
    public deleteVariantSalesUnitPrice(variant: any, unitRateIndex: number): void {
        let unitRates = variant.salesInformation?.filter((data, index) => index !== unitRateIndex).map(data => { return data });
        variant.salesInformation = unitRates;

        if (unitRates?.length === 0) {
            this.addNewVariantSalesUnitPrice(variant);
        }
    }

    /**
     * This will take the user back to last page
     *
     * @memberof StockCreateEditComponent
     */
    public backClicked(): void {
        this.location.back();
    }

    /**
    * This will use for translation complete
    *
    * @param {*} event
    * @memberof StockCreateEditComponent
    */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
        }
    }

    /**
     * This will use for on tab changes
     *
     * @param {*} event
     * @memberof StockCreateEditComponent
     */
    public onTabChange(event: any): void {
        this.activeTabIndex = event?.index;
    }

    /**
     * This will use for validation in name space
     *
     * @param {string} value
     * @memberof StockCreateEditComponent
     */
    public checkSpacingValidation(value: string): void {
        this.hasSpacingError = (value?.trim()) ? false : true;
    }

    /**
     * Lifecycle hook for destroy
     *
     * @memberof StockCreateEditComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        /** remove parent class from body after exiting new-inventory page */
        document.querySelector("body").classList.remove("stock-create-edit");
    }

    /**
     * Track by function for option values
     *
     * @param {string} value
     * @returns {string}
     * @memberof StockCreateEditComponent
     */
    public trackByFn(value: string): string {
        return value;
    }

    /**
     * Callback for variant options sort change event
     *
     * @param {CdkDragDrop<string[]>} event
     * @memberof StockCreateEditComponent
     */
    public dropOptions(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.stockForm.options, event.previousIndex, event.currentIndex);
        this.generateVariants();
    }

    /**
     * This will hold option values before edit
     *
     * @param {*} option
     * @memberof StockCreateEditComponent
     */
    public editOptionValues(option: any): void {
        this.optionEditing = cloneDeep(option);
    }

    /**
     * Callback for option value update
     *
     * @param {number} optionIndex
     * @memberof StockCreateEditComponent
     */
    public updateOptionValues(optionIndex: number): void {
        if (this.optionEditing) {
            this.stockForm.options[optionIndex]?.values?.forEach((value, index) => {
                const currentValue = value?.value?.trim();
                const previousValue = this.optionEditing?.values[value?.index]?.value?.trim();
                if (currentValue) {
                    this.stockForm.variants?.forEach(variant => {
                        let variantNames = variant?.name?.split("/");
                        variantNames?.forEach(name => {
                            if (name?.trim() === previousValue) {
                                variant.name = variant.name.replace(previousValue, currentValue);
                            }
                        });
                    });
                }
            });
        }

        this.generateVariants();
    }

    /**
     * This will update tax inclusive settings in all variants
     *
     * @param {string} moduleType
     * @param {boolean} status
     * @memberof StockCreateEditComponent
     */
    public updateTaxInclusiveStatus(moduleType: string, status: boolean): void {
        this.stockForm.variants?.forEach(variant => {
            if (moduleType === "fixedassets") {
                variant.fixedAssetTaxInclusive = status;
            } else if (moduleType === "sales") {
                variant.salesTaxInclusive = status;
            } else if (moduleType === "purchase") {
                variant.purchaseTaxInclusive = status;
            }
        });
    }
}
