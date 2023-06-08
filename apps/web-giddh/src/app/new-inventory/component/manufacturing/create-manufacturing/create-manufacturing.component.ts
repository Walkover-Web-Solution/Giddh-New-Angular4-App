import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { isEqual } from 'apps/web-giddh/src/app/lodash-optimized';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { CreateManufacturing, ManufacturingLinkedStock } from 'apps/web-giddh/src/app/models/api-models/Manufacturing';
import { InventoryService } from 'apps/web-giddh/src/app/services/inventory.service';
import { LedgerService } from 'apps/web-giddh/src/app/services/ledger.service';
import { ManufacturingService } from 'apps/web-giddh/src/app/services/manufacturing.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { WarehouseActions } from 'apps/web-giddh/src/app/settings/warehouse/action/warehouse.action';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { giddhRoundOff } from 'apps/web-giddh/src/app/shared/helpers/helperFunctions';
import { AppState } from 'apps/web-giddh/src/app/store';
import { ConfirmModalComponent } from 'apps/web-giddh/src/app/theme/new-confirm-modal/confirm-modal.component';
import * as dayjs from 'dayjs';
import { ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'create-manufacturing',
    templateUrl: './create-manufacturing.component.html',
    styleUrls: ['./create-manufacturing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateManufacturingComponent implements OnInit {
    /**  This will use for universal date */
    public universalDate: any;
    /** List of warehouses */
    public warehouses: any[] = [];
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Create Manufacturing form object */
    public manufacturingObject: CreateManufacturing = new CreateManufacturing();
    /** New Linked stocks object */
    public totals: any = { totalRate: 0, totalAmount: 0, costPerItem: 0 };
    /** Index of active linked item */
    public activeLinkedStockIndex: number = 0;
    /** List of required fields */
    public errorFields: any = { date: false, finishedStockName: false, finishedStockVariant: false, finishedQuantity: false };
    /** True if is loading */
    public isLoading: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds selected warehouse name */
    public selectedWarehouseName: string = "";
    /** Holds selected inventory type */
    public selectedInventoryType: string = "";
    /** This will hold api calls if one is already in progress */
    public preventStocksApiCall: boolean = false;
    /** True if recipe exists for finished stock */
    private recipeExists: boolean = false;
    /** Holds existing recipe */
    private existingRecipe: any = [];

    constructor(
        private store: Store<AppState>,
        private warehouseAction: WarehouseActions,
        private changeDetectionRef: ChangeDetectorRef,
        private ledgerService: LedgerService,
        private manufacturingService: ManufacturingService,
        private toasterService: ToasterService,
        private inventoryService: InventoryService,
        private dialog: MatDialog
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof CreateManufacturingComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj: Date[]) => {
            if (dateObj) {
                try {
                    this.manufacturingObject.manufacturingDetails[0].date = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                } catch (e) {
                    this.manufacturingObject.manufacturingDetails[0].date = dayjs().format(GIDDH_DATE_FORMAT);
                }

                this.universalDate = cloneDeep(this.manufacturingObject.manufacturingDetails[0].date);
            }
        });
        this.getProfile();
        this.getWarehouses();
        this.getStocks(this.manufacturingObject.manufacturingDetails[0], 1, "");
    }

    /**
     * Get warehouses
     *
     * @memberof CreateManufacturingComponent
     */
    public getWarehouses(): void {
        this.store.dispatch(this.warehouseAction.fetchAllWarehouses({ page: 1, count: 0 }));

        this.store.pipe(select(state => state.warehouse.warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
            if (warehouses?.results?.length) {
                this.warehouses = [];
                warehouses?.results?.forEach(warehouse => {
                    this.warehouses.push({ label: warehouse?.name, value: warehouse?.uniqueName });
                });
                this.selectedWarehouseName = this.warehouses[0].label;
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    /**
     * Get stocks
     *
     * @memberof CreateManufacturingComponent
     */
    public getStocks(stockObject: any, page: number = 1, q?: string, inventoryType?: string): void {
        if (page > stockObject.stocksTotalPages || this.preventStocksApiCall || q === undefined) {
            return;
        }

        this.preventStocksApiCall = true;

        if (q) {
            stockObject.stocksQ = q;
        } else if (stockObject.stocksQ) {
            q = stockObject.stocksQ;
        }

        stockObject.stocksPageNumber = page;
        this.inventoryService.getStocksV2({ inventoryType: inventoryType, page: page, q: q }).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === "success" && response?.body?.results?.length) {
                stockObject.stocksTotalPages = response.body.totalPages;
                if (page === 1) {
                    stockObject.stocks = [];
                }
                response?.body?.results?.forEach(stock => {
                    let unitsList = [];

                    stock?.stockUnits?.forEach(unit => {
                        unitsList.push({ label: unit.code, value: unit.uniqueName });
                    });

                    stockObject.stocks.push({ label: stock?.name, value: stock?.uniqueName, additional: { stockUnitCode: stock?.stockUnits[0]?.code, stockUnitUniqueName: stock?.stockUnits[0]?.uniqueName, inventoryType: stock.inventoryType, unitsList: unitsList } });
                });

                this.changeDetectionRef.detectChanges();
            }
            setTimeout(() => {
                this.preventStocksApiCall = false;
            }, 500);
        });
    }

    /**
     * Get stock variants
     *
     * @param {*} object
     * @param {*} event
     * @param {boolean} [loadRecipe=false]
     * @param {number} [index]
     * @returns {void}
     * @memberof CreateManufacturingComponent
     */
    public getStockVariants(object: any, event: any, loadRecipe: boolean = false, index?: number): void {
        object.stockUniqueName = event?.value;
        object.stockName = event?.label;

        if (!object.stockUniqueName) {
            return;
        }

        object.variants = [];

        this.ledgerService.loadStockVariants(object.stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(variants => {
            if (variants?.length) {
                variants?.forEach(variant => {
                    object.variants.push({ label: variant?.name, value: variant?.uniqueName });
                });

                if (object.variants?.length === 1) {
                    object.variant = {
                        name: object.variants[0].label,
                        uniqueName: object.variants[0].value
                    };

                    if (loadRecipe) {
                        this.getVariantRecipe();
                    } else {
                        this.getRateForStock(object, index);
                    }
                } else {
                    object.variant = {
                        name: "",
                        uniqueName: ""
                    };
                }
            }

            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * Get variant recipe
     *
     * @memberof CreateManufacturingComponent
     */
    public getVariantRecipe(): void {
        this.manufacturingObject.manufacturingDetails[0].linkedStocks = [];

        this.manufacturingService.getVariantRecipe(this.manufacturingObject.manufacturingDetails[0].stockUniqueName, [this.manufacturingObject.manufacturingDetails[0].variant.uniqueName], true).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.manufacturingDetails?.length) {
                this.recipeExists = true;
                this.manufacturingObject.manufacturingDetails[0].manufacturingUnitCode = response.body.manufacturingDetails[0].manufacturingUnitCode;
                this.manufacturingObject.manufacturingDetails[0].manufacturingUnitUniqueName = response.body.manufacturingDetails[0].manufacturingUnitUniqueName;
                this.manufacturingObject.manufacturingDetails[0].manufacturingMultipleOf = response.body.manufacturingDetails[0].manufacturingQuantity;
                this.manufacturingObject.manufacturingDetails[0].manufacturingQuantity = response.body.manufacturingDetails[0].manufacturingMultipleOf;

                response.body.manufacturingDetails[0].linkedStocks?.forEach(linkedStock => {
                    let amount = linkedStock.rate * linkedStock.quantity;

                    this.manufacturingObject.manufacturingDetails[0].linkedStocks.push(
                        {
                            selectedStock: { label: linkedStock.stockName, value: linkedStock.stockUniqueName, additional: { stockUnitCode: linkedStock.stockUnitCode, stockUnitUniqueName: linkedStock.stockUnitUniqueName, unitsList: linkedStock.unitsList } },
                            stockUniqueName: linkedStock.stockUniqueName,
                            quantity: linkedStock.quantity,
                            stockUnitUniqueName: linkedStock.stockUnitUniqueName,
                            stockUnitCode: linkedStock.stockUnitCode,
                            rate: linkedStock.rate,
                            amount: isNaN(amount) ? 0 : giddhRoundOff(amount, this.giddhBalanceDecimalPlaces),
                            variant: linkedStock.variant
                        }
                    );
                });
                this.existingRecipe = this.formatRecipeRequest();
            } else {
                this.recipeExists = false;
                this.manufacturingObject.manufacturingDetails[0].linkedStocks.push(
                    {
                        selectedStock: { label: "", value: "", additional: { stockUnitCode: "", stockUnitUniqueName: "", unitsList: [] } },
                        stockUniqueName: "",
                        quantity: 1,
                        stockUnitUniqueName: "",
                        stockUnitCode: "",
                        rate: 0,
                        amount: 0,
                        variant: { name: '', uniqueName: '' }
                    }
                );

                this.showBorder(this.manufacturingObject.manufacturingDetails[0].linkedStocks[0]);
            }

            this.preventStocksApiCall = false;
            this.getStocks(this.manufacturingObject.manufacturingDetails[0].linkedStocks[0], 1, '', this.selectedInventoryType);

            this.calculateTotals();
        });
    }

    /**
     * Get rate for stock
     *
     * @param {*} linkedStock
     * @memberof CreateManufacturingComponent
     */
    public getRateForStock(linkedStock: any, index: number): void {
        this.manufacturingService.getRateForStockV2(linkedStock.stockUniqueName, { quantity: 1, stockUnitUniqueName: (linkedStock?.stockUnitUniqueName || linkedStock.selectedStock?.additional?.stockUnitUniqueName), variant: { uniqueName: linkedStock.variant.uniqueName } }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response.body) {
                linkedStock.quantity = 1;
                linkedStock.rate = response.body.rate;

                if (!linkedStock.stockUnitUniqueName) {
                    linkedStock.stockUnitCode = linkedStock.selectedStock?.additional?.stockUnitCode;
                    linkedStock.stockUnitUniqueName = linkedStock.selectedStock?.additional?.stockUnitUniqueName;
                }

                let amount = linkedStock.rate * linkedStock.quantity;
                linkedStock.amount = isNaN(amount) ? 0 : giddhRoundOff(amount, this.giddhBalanceDecimalPlaces);
            }

            this.checkLinkedStockValidation(index);

            if (this.activeLinkedStockIndex === null) {
                this.hideBorder(linkedStock);
            }

            this.calculateTotals();
        });
    }

    /**
     * Removes the unnecessary keys
     *
     * @returns {*}
     * @memberof CreateManufacturingComponent
     */
    public formatRequest(): any {
        let manufacturingObject = cloneDeep(this.manufacturingObject);
        delete manufacturingObject.manufacturingDetails[0].stocks;
        delete manufacturingObject.manufacturingDetails[0].stocksPageNumber
        delete manufacturingObject.manufacturingDetails[0].stocksTotalPages
        delete manufacturingObject.manufacturingDetails[0].stocksQ
        delete manufacturingObject.manufacturingDetails[0].variants;
        delete manufacturingObject.manufacturingDetails[0].manufacturingUnitCode;
        delete manufacturingObject.manufacturingDetails[0].manufacturingUnitUniqueName;

        if (manufacturingObject.manufacturingDetails[0].date) {
            manufacturingObject.manufacturingDetails[0].date = (typeof manufacturingObject.manufacturingDetails[0].date === "object") ? dayjs(manufacturingObject.manufacturingDetails[0].date).format(GIDDH_DATE_FORMAT) : dayjs(manufacturingObject.manufacturingDetails[0].date, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
        }

        manufacturingObject.manufacturingDetails[0].linkedStocks = manufacturingObject.manufacturingDetails[0].linkedStocks?.filter(linkedStock => linkedStock?.variant?.uniqueName);

        manufacturingObject.manufacturingDetails[0].linkedStocks?.map(linkedStock => {
            delete linkedStock.stocks;
            delete linkedStock.stocksPageNumber;
            delete linkedStock.stocksTotalPages;
            delete linkedStock.stocksQ;
            delete linkedStock.stockUnitCode;
            delete linkedStock.variants;
            delete linkedStock.selectedStock;
            delete linkedStock.cssClass;
            return linkedStock;
        });

        return manufacturingObject;
    }

    /**
     * Creates recipe request
     *
     * @returns {*}
     * @memberof CreateManufacturingComponent
     */
    public formatRecipeRequest(): any {
        let recipeObject = { manufacturingDetails: [] };

        this.manufacturingObject.manufacturingDetails?.forEach(manufacturingDetail => {
            let linkedStocks = [];

            manufacturingDetail.linkedStocks?.forEach(linkedStock => {
                linkedStocks.push({
                    stockUniqueName: linkedStock.stockUniqueName,
                    stockUnitUniqueName: linkedStock.stockUnitUniqueName,
                    quantity: Number(linkedStock.quantity)
                });
            });

            recipeObject.manufacturingDetails.push({
                manufacturingQuantity: Number(manufacturingDetail.manufacturingQuantity),
                manufacturingUnitUniqueName: manufacturingDetail.manufacturingUnitUniqueName,
                variant: {
                    uniqueName: manufacturingDetail.variant.uniqueName
                },
                linkedStocks: linkedStocks
            });
        });


        return recipeObject;
    }

    /**
     * Save manufacturing
     *
     * @returns {void}
     * @memberof CreateManufacturingComponent
     */
    public createManufacturing(): void {
        const isFormValid = this.isFormValid();
        if (!isFormValid) {
            return;
        }

        this.isLoading = true;
        const manufacturingObject = this.formatRequest();
        const recipeObject = this.formatRecipeRequest();
        if (this.recipeExists) {
            if (!isEqual(this.existingRecipe, recipeObject)) {
                let dialogRef = this.dialog.open(ConfirmModalComponent, {
                    data: {
                        title: this.commonLocaleData?.app_confirmation,
                        body: this.localeData?.confirm_update_recipe,
                        ok: this.commonLocaleData?.app_yes,
                        cancel: this.commonLocaleData?.app_no
                    }
                });

                dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
                    if (response) {
                        this.saveRecipe(manufacturingObject, recipeObject, false);
                    }
                });
            }
        } else {
            let dialogRef = this.dialog.open(ConfirmModalComponent, {
                data: {
                    title: this.commonLocaleData?.app_confirmation,
                    body: this.localeData?.confirm_save_recipe,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no
                }
            });

            dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
                if (response) {
                    this.saveRecipe(manufacturingObject, recipeObject, true);
                }
            });
        }

        this.manufacturingService.saveManufacturing(manufacturingObject.manufacturingDetails[0].stockUniqueName, manufacturingObject).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toasterService.successToast(this.localeData?.manufacturing_saved);
                this.resetForm();
            } else {
                this.toasterService.errorToast(response?.body || response?.message);
            }
            this.isLoading = false;

            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * Save recipe
     *
     * @private
     * @param {*} manufacturingObject
     * @param {*} recipeObject
     * @param {boolean} isNewRecipe
     * @memberof CreateManufacturingComponent
     */
    private saveRecipe(manufacturingObject: any, recipeObject: any, isNewRecipe: boolean): void {
        this.manufacturingService.saveRecipe(manufacturingObject.manufacturingDetails[0].stockUniqueName, recipeObject).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toasterService.successToast(this.localeData?.recipe_saved);
            } else {
                this.toasterService.errorToast(response?.body || response?.message);
            }
        });
    }

    /**
     * Gets profile information
     *
     * @private
     * @memberof CreateManufacturingComponent
     */
    private getProfile(): void {
        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe(async (profile) => {
            if (profile) {
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
            }
        });
    }

    /**
     * Add new linked stock row
     *
     * @memberof CreateManufacturingComponent
     */
    public addNewLinkedStock(): void {
        this.manufacturingObject.manufacturingDetails[0].linkedStocks.push(new ManufacturingLinkedStock());
        this.preventStocksApiCall = false;
        this.getStocks(this.manufacturingObject.manufacturingDetails[0].linkedStocks[(this.manufacturingObject.manufacturingDetails[0].linkedStocks?.length - 1)], 1, '', this.selectedInventoryType);
    }

    /**
     * Remove linked stock row
     *
     * @param {number} index
     * @memberof CreateManufacturingComponent
     */
    public removeLinkedStock(index: number): void {
        this.manufacturingObject.manufacturingDetails[0].linkedStocks = this.manufacturingObject.manufacturingDetails[0].linkedStocks?.filter((linkedStock, i) => i !== index);
        this.calculateTotals();
    }

    /**
     * Calculates row total for linked stock
     *
     * @param {*} linkedStock
     * @memberof CreateManufacturingComponent
     */
    public calculateRowTotal(linkedStock: any): void {
        let amount = linkedStock.rate * linkedStock.quantity;
        linkedStock.amount = isNaN(amount) ? 0 : giddhRoundOff(amount, this.giddhBalanceDecimalPlaces);
        this.calculateTotals();
    }

    /**
     * Calculates grand total
     *
     * @memberof CreateManufacturingComponent
     */
    public calculateTotals(): void {
        let totalRate = 0;
        let totalAmount = 0;

        this.manufacturingObject.manufacturingDetails[0].linkedStocks?.forEach(linkedStock => {
            totalRate += Number(linkedStock.rate) || 0;
            totalAmount += Number(linkedStock.amount) || 0;
        });

        this.totals.totalRate = totalRate;
        this.totals.totalAmount = totalAmount;
        this.totals.costPerItem = giddhRoundOff((totalAmount / (this.manufacturingObject.manufacturingDetails[0].manufacturingQuantity * this.manufacturingObject.manufacturingDetails[0].manufacturingMultipleOf)), this.giddhBalanceDecimalPlaces);

        this.changeDetectionRef.detectChanges();
    }

    /**
     * Resets form
     *
     * @memberof CreateManufacturingComponent
     */
    public resetForm(): void {
        this.manufacturingObject = new CreateManufacturing();
        this.manufacturingObject.manufacturingDetails[0].date = cloneDeep(this.universalDate);

        this.selectedWarehouseName = (this.warehouses?.length) ? this.warehouses[0].label : "";
        this.selectedInventoryType = "";
        this.preventStocksApiCall = false;
        this.errorFields = { date: false, finishedStockName: false, finishedStockVariant: false, finishedQuantity: false };

        this.calculateTotals();
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Show border around linked fields on hover in
     *
     * @param {*} linkedStock
     * @memberof CreateManufacturingComponent
     */
    public showBorder(linkedStock: any): void {
        linkedStock.cssClass = 'form-control mat-field-border';
    }

    /**
     * Hide border around linked fields on hover out
     *
     * @param {*} linkedStock
     * @memberof CreateManufacturingComponent
     */
    public hideBorder(linkedStock: any): void {
        if (!linkedStock?.variant?.uniqueName) {
            linkedStock.cssClass = 'form-control mat-field-border';
        } else {
            linkedStock.cssClass = 'form-control';
        }
    }

    /**
     * Validates form
     *
     * @returns {boolean}
     * @memberof CreateManufacturingComponent
     */
    public isFormValid(): boolean {
        let isValidForm = true;
        if (!this.manufacturingObject.manufacturingDetails[0].date) {
            this.errorFields.date = true;
            isValidForm = false;
        }
        if (!this.manufacturingObject.manufacturingDetails[0].stockUniqueName) {
            this.errorFields.finishedStockName = true;
            isValidForm = false;
        }
        if (!this.manufacturingObject.manufacturingDetails[0].variant?.uniqueName) {
            this.errorFields.finishedStockVariant = true;
            isValidForm = false;
        }
        if (!this.manufacturingObject.manufacturingDetails[0].manufacturingQuantity) {
            this.errorFields.finishedQuantity = true;
            isValidForm = false;
        }
        if (!this.manufacturingObject.manufacturingDetails[0].linkedStocks?.length) {
            isValidForm = false;
        }
        if (this.manufacturingObject.manufacturingDetails[0].linkedStocks?.length) {
            this.manufacturingObject.manufacturingDetails[0].linkedStocks.forEach(linkedStock => {
                if (!linkedStock?.selectedStock?.value) {
                    linkedStock.stockNameError = true;
                    isValidForm = false;
                }
                if (!linkedStock?.variant?.uniqueName) {
                    linkedStock.variantNameError = true;
                    isValidForm = false;
                }
                if (!linkedStock?.quantity) {
                    linkedStock.quantityError = true;
                    isValidForm = false;
                }
            });
        }

        return isValidForm;
    }

    /**
     * Validates linked stock fields
     *
     * @param {number} index
     * @memberof CreateManufacturingComponent
     */
    public checkLinkedStockValidation(index: number): void {
        this.validateSelectedStock(index);
        this.validateSelectedVariant(index);
        this.validateQuantity(index);
    }

    /**
     * Validates linked stock
     *
     * @param {number} linkedStockIndex
     * @memberof CreateManufacturingComponent
     */
    public validateSelectedStock(linkedStockIndex: number): void {
        if (!this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].selectedStock?.value) {
            this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].stockNameError = true;
        } else {
            this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].stockNameError = false;
        }
    }

    /**
     * Validates linked variant
     *
     * @param {number} linkedStockIndex
     * @memberof CreateManufacturingComponent
     */
    public validateSelectedVariant(linkedStockIndex: number): void {
        if (!this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].variant?.uniqueName) {
            this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].variantNameError = true;
        } else {
            this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].variantNameError = false;
        }
    }

    /**
     * Validates linked quantity
     *
     * @param {number} linkedStockIndex
     * @memberof CreateManufacturingComponent
     */
    public validateQuantity(linkedStockIndex: number): void {
        if (!this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].quantity) {
            this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].quantityError = true;
        } else {
            this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].quantityError = false;
        }
    }

    /**
     * Callback for scroll end event
     *
     * @param {*} stockObject
     * @memberof CreateManufacturingComponent
     */
    public stockScrollEnd(stockObject: any): void {
        stockObject.stocksPageNumber = stockObject.stocksPageNumber + 1;
        this.getStocks(stockObject, stockObject.stocksPageNumber, stockObject.stocksQ ?? '', this.selectedInventoryType);
    }
}
