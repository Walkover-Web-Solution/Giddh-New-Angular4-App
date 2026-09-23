import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { ASIDE_PANE_CONFIG } from 'apps/web-giddh/src/app/app.constant';
import { BatchSelectDialogResult, VoucherSelectedBatch } from 'apps/web-giddh/src/app/models/interfaces/batch-report.interface';
import { InventoryService } from 'apps/web-giddh/src/app/services/inventory.service';
import { LedgerService } from 'apps/web-giddh/src/app/services/ledger.service';
import { ManufacturingService } from 'apps/web-giddh/src/app/services/manufacturing.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { WarehouseActions } from 'apps/web-giddh/src/app/settings/warehouse/action/warehouse.action';
import { AppState } from 'apps/web-giddh/src/app/store';
import { ConfirmModalComponent } from 'apps/web-giddh/src/app/theme/new-confirm-modal/confirm-modal.component';
import { BatchSelectDialogComponent } from 'apps/web-giddh/src/app/vouchers/batch-select-dialog/batch-select-dialog.component';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map, take, takeUntil, tap } from 'rxjs/operators';
import { cloneDeep, isEqual } from '../../../../lodash-optimized';

@Component({
    selector: 'create-recipe',

    templateUrl: './create-recipe.component.html',
    standalone: false,
    styleUrls: ['./create-recipe.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRecipeComponent implements OnInit, OnChanges, OnDestroy {
    /** Stock object */
    @Input() public stock: any = {};
    /** List of variants in stock form */
    @Input() public variants: any[] = [];
    /** Recipe object */
    public recipeObject: any = { manufacturingDetails: [] };
    /** List of variants */
    public variantsList: any[] = [];
    /** This will hold api calls if one is already in progress */
    public preventStocksApiCall: boolean = false;
    /** This will hold api calls if one is already in progress for by product */
    public preventByProductStocksApiCall: boolean = false;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds if there are any unsaved variants */
    public newVariants: any[] = [];
    /** True if recipe exists for the stock */
    private recipeExists: boolean = false;
    /** Holds existing recipe */
    private existingRecipe: any = [];
    /** True ifi is by product expanded*/
    private isByProductExpanded: boolean;
    /** True ifi is by product link expanded*/
    private isByLinkedStockExpanded: boolean;
    /** True when company has batch tracking enabled. */
    public batchTrackingEnabled: boolean = false;
    /** Company warehouses for availability. */
    public warehouses: any[] = [];

    constructor(
        private inventoryService: InventoryService,
        private ledgerService: LedgerService,
        private manufacturingService: ManufacturingService,
        private toasterService: ToasterService,
        private changeDetectionRef: ChangeDetectorRef,
        private dialog: MatDialog,
        private store: Store<AppState>,
        private warehouseAction: WarehouseActions
    ) {

    }

    /**
     * Loads company and warehouses used by batch selection.
     *
     * @memberof CreateRecipeComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.batchTrackingEnabled = !!activeCompany.batchTrackingEnabled;
            }
        });
        this.store.dispatch(this.warehouseAction.fetchAllWarehouses({ page: 1, count: 0 }));
        this.store.pipe(select(state => state.warehouse.warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
            if (warehouses?.results?.length) {
                this.warehouses = warehouses.results
                    .filter(warehouse => !warehouse.isArchived)
                    .map(warehouse => ({ label: warehouse?.name, value: warehouse?.uniqueName }));
            }
        });
    }

    /**
     * Lifecycle hook for change event
     *
     * @param {SimpleChanges} changes
     * @memberof CreateRecipeComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.stock?.currentValue && changes?.stock?.firstChange) {
            this.variantsList = [];

            changes?.stock?.currentValue?.variants?.forEach(variant => {
                if (variant?.uniqueName) {
                    this.variantsList.push({
                        label: variant.name,
                        value: variant.uniqueName
                    });
                }
            });

            this.getVariantRecipe();
        }

        if (changes?.variants?.currentValue) {
            this.newVariants = changes?.variants?.currentValue?.filter(variant => !variant?.uniqueName);
        }
    }

    /**
     * Lifcycle hook for destroy event
     *
     * @memberof CreateRecipeComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Adds new recipe section
     *
     * @memberof CreateRecipeComponent
     */
    public addNewRecipe(): void {
        this.recipeObject.manufacturingDetails.push({
            manufacturingQuantity: 1,
            manufacturingUnitUniqueName: '',
            batches: [],
            variant: {
                name: '',
                uniqueName: ''
            },
            linkedStocks: [
                {
                    stockName: '',
                    stockUniqueName: '',
                    stockUnitCode: '',
                    stockUnitUniqueName: '',
                    quantity: 1,
                    variant: {
                        name: '',
                        uniqueName: ''
                    },
                    batches: []
                }
            ],
            byProducts: [
                {
                    stockName: '',
                    stockUniqueName: '',
                    stockUnitCode: '',
                    stockUnitUniqueName: '',
                    quantity: 1,
                    variant: {
                        name: '',
                        uniqueName: ''
                    },
                    batches: []
                }
            ],
            isEdit: true
        });

        if (this.variantsList?.length === 1) {
            this.recipeObject.manufacturingDetails[0].variant.name = this.variantsList[0].label;
            this.recipeObject.manufacturingDetails[0].variant.uniqueName = this.variantsList[0].value;
        }
        this.getStocks(this.recipeObject.manufacturingDetails[this.recipeObject.manufacturingDetails?.length - 1].linkedStocks[0], 1, "");
        this.getAllStocks(this.recipeObject.manufacturingDetails[this.recipeObject.manufacturingDetails?.length - 1].byProducts[0], 1, "");

        if (!this.recipeObject.manufacturingDetails[this.recipeObject.manufacturingDetails?.length - 1]?.units?.length) {
            this.getStockUnits(this.recipeObject.manufacturingDetails[this.recipeObject.manufacturingDetails?.length - 1], this.stock.stockUnitUniqueName, true).subscribe(updatedObject => {
                this.recipeObject.manufacturingDetails[this.recipeObject.manufacturingDetails?.length - 1] = updatedObject;
            });
        }

        (Array.isArray(this.recipeObject.manufacturingDetails) ? this.recipeObject.manufacturingDetails : []).forEach(data => {
            if (data?.linkedStocks[0]
                ?.variant.uniqueName || data?.byProducts[0]
                    ?.variant.uniqueName) {
                this.isByProductExpanded = data?.byProducts[0]
                    ?.variant.uniqueName ? true : false;
                this.isByLinkedStockExpanded = data?.linkedStocks[0]
                    ?.variant.uniqueName ? true : false;
            } else {
                this.isByProductExpanded = false
                this.isByLinkedStockExpanded = true;
            }
        });

        this.changeDetectionRef.detectChanges();
    }

    /**
     * Adds new linked stock in recipe
     *
     * @param {*} recipe
     * @memberof CreateRecipeComponent
     */
    public addNewLinkedStockInRecipe(recipe: any): void {
        recipe.linkedStocks.push(
            {
                stockName: '',
                stockUniqueName: '',
                stockUnitCode: '',
                stockUnitUniqueName: '',
                quantity: 1,
                variant: {
                    name: '',
                    uniqueName: ''
                },
                batches: []
            }
        );

        this.getStocks(recipe.linkedStocks[recipe.linkedStocks?.length - 1], 1, "");
    }

    /**
 * Adds new by product linked stock in recipe
 *
 * @param {*} recipe
 * @memberof CreateRecipeComponent
 */
    public addNewByProductLinkedStockInRecipe(recipe: any): void {
        recipe.byProducts.push(
            {
                stockName: '',
                stockUniqueName: '',
                stockUnitCode: '',
                stockUnitUniqueName: '',
                quantity: 1,
                variant: {
                    name: '',
                    uniqueName: ''
                },
                batches: []
            }
        );

        this.getAllStocks(recipe.byProducts[recipe.byProducts?.length - 1], 1, "");
    }

    /**
     * Get list of stocks
     *
     * @param {*} stockObject
     * @param {number} [page=1]
     * @param {string} [q]
     * @param {Function} [callback]
     * @returns {void}
     * @memberof CreateRecipeComponent
     */
    public getStocks(stockObject: any, page: number = 1, q?: string, callback?: Function, assignDataAndCallback: boolean = false): void {
        if (page > stockObject?.stocksTotalPages || this.preventStocksApiCall || q === undefined) {
            return;
        }

        this.preventStocksApiCall = true;

        if (q) {
            stockObject.stocksQ = q;
        } else if (stockObject.stocksQ) {
            q = stockObject.stocksQ;
        }

        stockObject.stocksPageNumber = page;
        this.inventoryService.getStocksV2({ inventoryType: this.stock.type, page: page, q: q }).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === "success" && response?.body?.results?.length) {
                if (!callback || assignDataAndCallback) {
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
                    if (assignDataAndCallback) {
                        callback(response);
                    }
                } else {
                    callback(response);
                }
            } else {
                stockObject.stocks = [];
                stockObject.stocksTotalPages = 1;
            }

            setTimeout(() => {
                this.preventStocksApiCall = false;
                this.changeDetectionRef.detectChanges();
            }, 500);
        });
    }

    /**
   * Get all stocks
   *
   * @param {*} stockObject
   * @param {number} [page=1]
   * @param {string} [q]
   * @param {Function} [callback]
   * @returns {void}
   * @memberof CreateRecipeComponent
   */
    public getAllStocks(stockObject: any, page: number = 1, q?: string, callback?: Function, assignDataAndCallback: boolean = false): void {
        if (page > stockObject?.stocksTotalPages || this.preventByProductStocksApiCall || q === undefined) {
            return;
        }

        this.preventByProductStocksApiCall = true;

        if (q) {
            stockObject.stocksQ = q;
        } else if (stockObject.stocksQ) {
            q = stockObject.stocksQ;
        }

        stockObject.stocksPageNumber = page;
        this.inventoryService.getStocksV2({ inventoryType: '', page: page, q: q }).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === "success" && response?.body?.results?.length) {
                if (!callback || assignDataAndCallback) {
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
                    if (assignDataAndCallback) {
                        callback(response);
                    }
                } else {
                    callback(response);
                }
            } else {
                stockObject.stocks = [];
                stockObject.stocksTotalPages = 1;
            }

            setTimeout(() => {
                this.preventByProductStocksApiCall = false;
                this.changeDetectionRef.detectChanges();
            }, 500);
        });
    }

    /**
     * Callback for scroll end event
     *
     * @param {*} stockObject
     * @memberof CreateRecipeComponent
     */
    public stockScrollEnd(stockObject: any): void {
        stockObject.stocksPageNumber = stockObject.stocksPageNumber + 1;
        this.getStocks(stockObject, stockObject.stocksPageNumber, stockObject.stocksQ ?? '');
    }


    /**
     * Callback for scroll end event for by products
     *
     * @param {*} stockObject
     * @memberof CreateRecipeComponent
     */
    public byProductStockScrollEnd(stockObject: any): void {
        stockObject.stocksPageNumber = stockObject.stocksPageNumber + 1;
        this.getAllStocks(stockObject, stockObject.stocksPageNumber, stockObject.stocksQ ?? '');
    }

    /**
     * Get stock variants
     *
     * @param {*} object
     * @param {*} event
     * @param {boolean} [loadRecipe=false]
     * @param {number} [index]
     * @returns {void}
     * @memberof CreateRecipeComponent
     */
    public getStockVariants(object: any, event: any, isEdit: boolean = false): void {
        object.stockUniqueName = event?.value;
        object.stockName = event?.label;

        if (!isEdit) {
            object.batches = [];
        }

        if (!object.stockUniqueName) {
            return;
        }


        object.variants = [];

        this.ledgerService.loadStockVariants(object.stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(variants => {
            if (variants?.length) {
                variants?.forEach(variant => {
                    object.variants.push({ label: variant?.name, value: variant?.uniqueName });
                });

                if (!isEdit) {
                    if (object.variants?.length === 1) {
                        object.variant = {
                            name: object.variants[0].label,
                            uniqueName: object.variants[0].value
                        };
                    } else {
                        object.variant = {
                            name: "",
                            uniqueName: ""
                        };
                    }
                }
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    /**
     * Handles the unit change event
     *
     * @param {*} object The object to update
     * @param {string} stockUnitUniqueName The unique name of the stock unit
     * @param {boolean} isFinishedStock True if the stock is a finished stock
     * @memberof CreateRecipeComponent
     */
    public onUnitChange(object: any, stockUnitUniqueName: string, isFinishedStock: boolean): void {
        this.getStockUnits(object, stockUnitUniqueName, isFinishedStock).subscribe(() => {
            this.changeDetectionRef.detectChanges();
        });
    }


    /**
     * Get stock units
     *
     * @param {*} object
     * @param {string} stockUnitUniqueName
     * @param {boolean} isFinishedStock
     * @param {boolean} [isEdit=false]
     * @returns {void}
     * @memberof CreateRecipeComponent
     */
    public getStockUnits(object: any, stockUnitUniqueName: string, isFinishedStock: boolean, isEdit: boolean = false): Observable<any> {
        if (!stockUnitUniqueName) {
            return of(null);
        }

        object.units = [];

        // Finished stock case (sync)
        if (isFinishedStock && this.recipeObject.manufacturingDetails[0]?.units?.length) {
            object.units = cloneDeep(this.recipeObject.manufacturingDetails[0]?.units);

            if (!isEdit) {
                if (object.units.length === 1) {
                    object.manufacturingUnitCode = object.units[0].label;
                    object.manufacturingUnitUniqueName = object.units[0].value;
                } else {
                    object.manufacturingUnitCode = "";
                    object.manufacturingUnitUniqueName = "";
                }
            }

            return of(object); // sync return
        }

        // async case
        return this.manufacturingService.loadStockUnits(stockUnitUniqueName).pipe(
            tap(units => {
                if (units?.length) {
                    object.units = units.map(unit => ({
                        label: unit.code,
                        value: unit.uniqueName
                    }));

                    if (!isEdit) {
                        if (object.units.length === 1) {
                            if (isFinishedStock) {
                                object.manufacturingUnitCode = object.units[0].label;
                                object.manufacturingUnitUniqueName = object.units[0].value;
                            } else {
                                object.stockUnitCode = object.units[0].label;
                                object.stockUnitUniqueName = object.units[0].value;
                            }
                        } else {
                            if (isFinishedStock) {
                                object.manufacturingUnitCode = "";
                                object.manufacturingUnitUniqueName = "";
                            } else {
                                object.stockUnitCode = "";
                                object.stockUnitUniqueName = "";
                            }
                        }
                    }
                }
            }),
            map(() => object)
        );
    }


    /**
     * Checks if variant is already selected to restrict from getting selected again
     *
     * @param {*} selectedRecipe
     * @param {*} event
     * @param {number} index
     * @memberof CreateRecipeComponent
     */
    public checkIfVariantIsAlreadyUsed(selectedRecipe: any, event: any, index: number): void {
        setTimeout(() => {
            let isSelected = this.recipeObject.manufacturingDetails?.filter((recipe, i) => { return recipe?.variant?.uniqueName === event.value && i !== index });
            if (isSelected?.length) {
                selectedRecipe.variant.name = "";
                selectedRecipe.variant.uniqueName = "";
                this.toasterService.showSnackBar("warning", this.localeData?.variant_already_selected);
            }
        }, 10);
    }

    /**
     * Gets recipe of variant
     *
     * @memberof CreateRecipeComponent
     */
    public getVariantRecipe(): void {
        this.manufacturingService.getVariantRecipe(this.stock.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.manufacturingDetails?.length) {
                this.recipeExists = true;
                this.getStocks({}, 1, "", (data: any) => {
                    let stocks = [];
                    data?.body?.results?.forEach(stock => {
                        let stockUnitsList = [];
                        stock?.stockUnits?.forEach(unit => {
                            stockUnitsList.push({ label: unit.code, value: unit.uniqueName });
                        });

                        stocks.push({ label: stock?.name, value: stock?.uniqueName, additional: { stockUnitCode: stock?.stockUnits[0]?.code, stockUnitUniqueName: stock?.stockUnits[0]?.uniqueName, inventoryType: stock.inventoryType, unitsList: stockUnitsList } });
                    });

                    response?.body?.manufacturingDetails?.forEach((manufacturingDetail, index) => {
                        if (!this.recipeObject.manufacturingDetails) {
                            this.recipeObject.manufacturingDetails = [];
                            this.recipeObject.manufacturingDetails[index] = [];
                        }
                        if (!this.recipeObject.manufacturingDetails[index]) {
                            this.recipeObject.manufacturingDetails[index] = [];
                        }

                        this.recipeObject.manufacturingDetails[index].manufacturingUnitCode = manufacturingDetail.manufacturingUnitCode;
                        this.recipeObject.manufacturingDetails[index].manufacturingUnitUniqueName = manufacturingDetail.manufacturingUnitUniqueName;
                        this.recipeObject.manufacturingDetails[index].manufacturingQuantity = manufacturingDetail.manufacturingQuantity;
                        this.recipeObject.manufacturingDetails[index].variant = manufacturingDetail.variant;
                        this.recipeObject.manufacturingDetails[index].batches = this.normalizeRecipeBatches(manufacturingDetail.batches);
                        this.recipeObject.manufacturingDetails[index].linkedStocks = [];

                        this.getStockUnits(this.recipeObject.manufacturingDetails[index], this.stock.stockUnitUniqueName, true, true).subscribe(updatedObject => {
                            this.recipeObject.manufacturingDetails[index] = updatedObject;
                        });

                        let linkedStockIndex = 0;
                        if (!manufacturingDetail?.linkedStocks?.length) {
                            this.recipeObject.manufacturingDetails[index].linkedStocks?.push(
                                {
                                    stockName: '',
                                    stockUniqueName: '',
                                    stockUnitCode: '',
                                    stockUnitUniqueName: '',
                                    quantity: 1,
                                    variant: {
                                        name: '',
                                        uniqueName: ''
                                    },
                                    batches: [],
                                    stocks: stocks,
                                    stocksPageNumber: data.body.page,
                                    stocksTotalPages: data.body.totalPages
                                });
                        } else {
                            manufacturingDetail.linkedStocks?.forEach(linkedStock => {
                                let unitsList = [];
                                linkedStock?.stockUnits?.forEach(unit => {
                                    unitsList.push({ label: unit.code, value: unit.uniqueName });
                                });
                                this.recipeObject.manufacturingDetails[index].linkedStocks[linkedStockIndex] = {
                                    stockName: linkedStock.stockName,
                                    stockUniqueName: linkedStock.stockUniqueName,
                                    stockUnitCode: linkedStock.stockUnitCode,
                                    stockUnitUniqueName: linkedStock.stockUnitUniqueName,
                                    quantity: linkedStock.quantity,
                                    variant: linkedStock.variant,
                                    batches: this.normalizeRecipeBatches(linkedStock.batches),
                                    units: unitsList,
                                    stocks: stocks,
                                    stocksPageNumber: data.body.page,
                                    stocksTotalPages: data.body.totalPages
                                };
                                this.getStockVariants(this.recipeObject.manufacturingDetails[index].linkedStocks[linkedStockIndex], { label: linkedStock.stockName, value: linkedStock.stockUniqueName }, true);

                                linkedStockIndex++;
                            });
                        }
                    });
                    this.existingRecipe = this.formatRecipeRequest();
                    this.isByLinkedStockExpanded = this.recipeObject.manufacturingDetails[0]?.linkedStocks[0]
                        ?.variant.uniqueName ? true : false;
                });

                this.getAllStocks({}, 1, "", (data: any) => {
                    let stocks = [];
                    data?.body?.results?.forEach(stock => {
                        let stockUnitsList = [];
                        stock?.stockUnits?.forEach(unit => {
                            stockUnitsList.push({ label: unit.code, value: unit.uniqueName });
                        });

                        stocks.push({ label: stock?.name, value: stock?.uniqueName, additional: { stockUnitCode: stock?.stockUnits[0]?.code, stockUnitUniqueName: stock?.stockUnits[0]?.uniqueName, inventoryType: stock.inventoryType, unitsList: stockUnitsList } });
                    });

                    response?.body?.manufacturingDetails?.forEach((manufacturingDetail, index) => {
                        if (!this.recipeObject.manufacturingDetails) {
                            this.recipeObject.manufacturingDetails = [];
                            this.recipeObject.manufacturingDetails[index] = [];
                        }
                        if (!this.recipeObject.manufacturingDetails[index]) {
                            this.recipeObject.manufacturingDetails[index] = [];
                        }

                        this.recipeObject.manufacturingDetails[index].byProducts = [];
                        this.getStockUnits(this.recipeObject.manufacturingDetails[index], this.stock.stockUnitUniqueName, true, true).subscribe(updatedObject => {
                            this.recipeObject.manufacturingDetails[index] = updatedObject;
                        });

                        if (!manufacturingDetail?.byProducts?.length) {
                            this.recipeObject.manufacturingDetails[index].byProducts?.push(
                                {
                                    stockName: '',
                                    stockUniqueName: '',
                                    stockUnitCode: '',
                                    stockUnitUniqueName: '',
                                    quantity: 1,
                                    variant: {
                                        name: '',
                                        uniqueName: ''
                                    },
                                    batches: [],
                                    stocks: stocks,
                                    stocksPageNumber: data.body.page,
                                    stocksTotalPages: data.body.totalPages
                                });
                        } else {
                            let byProductlinkedStockIndex = 0;
                            manufacturingDetail?.byProducts?.forEach(linkedStock => {
                                let unitsList = [];
                                linkedStock?.stockUnits?.forEach(unit => {
                                    unitsList.push({ label: unit.code, value: unit.uniqueName });
                                });

                                this.recipeObject.manufacturingDetails[index].byProducts[byProductlinkedStockIndex] = {
                                    stockName: linkedStock.stockName,
                                    stockUniqueName: linkedStock.stockUniqueName,
                                    stockUnitCode: linkedStock.stockUnitCode,
                                    stockUnitUniqueName: linkedStock.stockUnitUniqueName,
                                    quantity: linkedStock.quantity,
                                    variant: linkedStock.variant,
                                    batches: this.normalizeRecipeBatches(linkedStock.batches),
                                    units: unitsList,
                                    stocks: stocks,
                                    stocksPageNumber: data.body.page,
                                    stocksTotalPages: data.body.totalPages
                                };
                                this.getStockVariants(this.recipeObject.manufacturingDetails[index].byProducts[byProductlinkedStockIndex], { label: linkedStock.stockName, value: linkedStock.stockUniqueName }, true);

                                byProductlinkedStockIndex++;
                            });
                        }
                    });
                    this.existingRecipe = this.formatRecipeRequest();
                    this.isByProductExpanded = this.recipeObject.manufacturingDetails[0]?.byProducts[0]
                        ?.variant?.uniqueName ? true : false;
                });
                this.changeDetectionRef.detectChanges();
            } else {
                this.recipeExists = false;
                this.existingRecipe = [];
                this.addNewRecipe();

                if (this.variantsList?.length === 1) {
                    this.recipeObject.manufacturingDetails[0].variant.name = this.variantsList[0].label;
                    this.recipeObject.manufacturingDetails[0].variant.uniqueName = this.variantsList[0].value;
                }
            }
        });
    }

    /**
     * Removes linked stock from recipe
     *
     * @param {number} recipeIndex
     * @param {number} index
     * @memberof CreateRecipeComponent
     */
    public removeLinkedStock(recipeIndex: number, index: number): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '585px',
                    data: {
                title: this.commonLocaleData?.app_confirmation,
                    body: this.localeData?.confirm_delete_recipe_linked_stock,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no,
                    permanentlyDeleteMessage: ' '
                }
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                this.recipeObject.manufacturingDetails[recipeIndex].linkedStocks = this.recipeObject.manufacturingDetails[recipeIndex].linkedStocks?.filter((linkedStock, i) => i !== index);
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    /**
    * Removes linked stock from recipe
    *
    * @param {number} recipeIndex
    * @param {number} index
    * @memberof CreateRecipeComponent
    */
    public removeByProductLinkedStock(recipeIndex: number, index: number): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '585px',
                    data: {
                title: this.commonLocaleData?.app_confirmation,
                    body: this.localeData?.confirm_delete_recipe_byproduct_stock,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no,
                    permanentlyDeleteMessage: ' '
                }
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                if (this.recipeObject.manufacturingDetails[0].byProducts.length === 1) {
                    this.recipeObject.manufacturingDetails[0].byProducts = [
                        {
                            stockName: '',
                            stockUniqueName: '',
                            stockUnitCode: '',
                            stockUnitUniqueName: '',
                            quantity: 1,
                            variant: {
                                name: '',
                                uniqueName: ''
                            },
                            batches: []
                        }
                    ];
                } else {
                    this.recipeObject.manufacturingDetails[recipeIndex].byProducts = this.recipeObject.manufacturingDetails[recipeIndex].byProducts?.filter((linkedStock, i) => i !== index);
                }
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    /**
     * Removes recipe
     *
     * @param {number} index
     * @memberof CreateRecipeComponent
     */
    public removeRecipe(index: number): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '585px',
                    data: {
                title: this.commonLocaleData?.app_confirmation,
                    body: this.localeData?.confirm_delete_recipe,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no,
                    permanentlyDeleteMessage: ' '
                }
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                this.recipeObject.manufacturingDetails = this.recipeObject.manufacturingDetails?.filter((recipe, i) => i !== index);
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    /**
     * Formats recipe request
     *
     * @returns {*}
     * @memberof CreateRecipeComponent
     */
    public formatRecipeRequest(): any {
        let recipeObject = { manufacturingDetails: [] };
        if (!this.recipeObject?.manufacturingDetails) {
            return recipeObject; // Return empty recipeObject if manufacturingDetails is missing
        }
        this.recipeObject.manufacturingDetails?.forEach(manufacturingDetail => {
            if (manufacturingDetail?.variant?.uniqueName && ((manufacturingDetail?.linkedStocks?.length > 0 && manufacturingDetail.linkedStocks?.filter(linkedStock => linkedStock?.variant?.uniqueName)?.length > 0) || (manufacturingDetail.byProducts?.length > 0 && manufacturingDetail.byProducts?.filter(linkedStock => linkedStock?.variant?.uniqueName)?.length > 0))) {
                let linkedStocks = [];
                let byProductLinkedStocks = [];

                manufacturingDetail.linkedStocks?.forEach(linkedStock => {
                    const row: any = {
                        stockUniqueName: linkedStock.stockUniqueName,
                        stockUnitUniqueName: linkedStock.stockUnitUniqueName,
                        quantity: Number(linkedStock.quantity),
                        variant: {
                            uniqueName: linkedStock.variant?.uniqueName
                        }
                    };
                    const batches = this.mapBatchesForPayload(linkedStock.batches);
                    if (batches?.length) {
                        row.batches = batches;
                    }
                    linkedStocks.push(row);
                });
                manufacturingDetail.byProducts?.forEach(byProduct => {
                    if (byProduct.stockUniqueName) {
                        const row: any = {
                            stockUniqueName: byProduct.stockUniqueName,
                            stockUnitUniqueName: byProduct.stockUnitUniqueName,
                            quantity: Number(byProduct.quantity),
                            variant: {
                                uniqueName: byProduct.variant?.uniqueName
                            }
                        };
                        const batches = this.mapBatchesForPayload(byProduct.batches);
                        if (batches?.length) {
                            row.batches = batches;
                        }
                        byProductLinkedStocks.push(row);
                    }
                    else {
                        byProductLinkedStocks = [];
                    }
                });

                const finished: any = {
                    manufacturingQuantity: Number(manufacturingDetail.manufacturingQuantity),
                    manufacturingUnitUniqueName: manufacturingDetail.manufacturingUnitUniqueName,
                    variant: {
                        uniqueName: manufacturingDetail.variant?.uniqueName
                    },
                    linkedStocks: linkedStocks,
                    byProducts: byProductLinkedStocks
                };
                const finishedBatches = this.mapBatchesForPayload(manufacturingDetail.batches);
                if (finishedBatches?.length) {
                    finished.batches = finishedBatches;
                }
                recipeObject.manufacturingDetails.push(finished);
            }
        });
        return recipeObject;
    }

    /**
     * Return true if stock has recipe and false if not available
     *
     * @returns {boolean}
     * @memberof CreateRecipeComponent
     */
    public hasRecipeForStock(): boolean {
        const recipeObject = this.formatRecipeRequest();
        if ((this.recipeExists || recipeObject?.manufacturingDetails?.length) && !isEqual(this.existingRecipe, recipeObject)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Save recipe
     *
     * @private
     * @memberof CreateRecipeComponent
     */
    public saveRecipeFromStock(): void {
        let recipeObject = this.formatRecipeRequest();

        if (this.existingRecipe?.manufacturingDetails?.length) {
            this.existingRecipe?.manufacturingDetails?.forEach(existingRecipe => {
                let recipeExists = recipeObject?.manufacturingDetails?.filter(recipe => recipe?.variant?.uniqueName === existingRecipe?.variant?.uniqueName);
                if (!recipeExists?.length) {
                    recipeObject.manufacturingDetails.push({ variant: existingRecipe?.variant, manufacturingQuantity: existingRecipe.manufacturingQuantity, manufacturingUnitUniqueName: existingRecipe.manufacturingUnitUniqueName, linkedStocks: [], byProducts: [] });
                }
            });
        }

        if (!recipeObject?.manufacturingDetails?.length) {
            return;
        }

        this.manufacturingService.saveRecipe(this.stock.uniqueName, recipeObject).subscribe(response => {
            if (response?.status === "success") {
                this.toasterService.showSnackBar("success", this.localeData?.recipe_saved);
            } else {
                this.toasterService.showSnackBar("error", response?.body || response?.message);
            }
        });
    }

    /**
     * Refreshes list of variants from stock create/update page
     *
     * @memberof CreateRecipeComponent
     */
    public refreshVariantsList(): void {
        this.variantsList = [];

        this.stock?.variants?.forEach(variant => {
            if (variant?.uniqueName) {
                this.variantsList.push({
                    label: variant.name,
                    value: variant.uniqueName
                });
            }
        });

        this.changeDetectionRef.detectChanges();
    }

    /**
     * Selected batches for a raw or by-product row.
     *
     * @param {any[]} [batches]
     * @return {*}  {VoucherSelectedBatch[]}
     * @memberof CreateRecipeComponent
     */
    public getRecipeBatches(batches?: any[]): VoucherSelectedBatch[] {
        return Array.isArray(batches) ? batches : [];
    }

    /**
     * Open Select Batches for finished stock, raw stock, or by-product.
     *
     * @param {("finished" | "raw" | "byProduct")} source
     * @param {number} recipeIndex
     * @param {number} [rowIndex]
     * @param {Event} [event]
     * @memberof CreateRecipeComponent
     */
    public openBatchSelectDialog(source: "finished" | "raw" | "byProduct", recipeIndex: number, rowIndex?: number, event?: Event): void {
        event?.preventDefault();
        event?.stopPropagation();
        if (!this.batchTrackingEnabled) {
            return;
        }

        const recipe = this.recipeObject.manufacturingDetails?.[recipeIndex];
        if (!recipe) {
            return;
        }

        let stockUniqueName = "";
        let stockName = "";
        let variantUniqueName = "";
        let variantName = "";
        let hasVariants = false;
        let unitCode = "";
        let lineQuantity = 0;
        let selectedBatches: VoucherSelectedBatch[] = [];

        if (source === "finished") {
            stockUniqueName = this.stock?.uniqueName;
            stockName = this.stock?.name;
            variantUniqueName = recipe.variant?.uniqueName;
            variantName = recipe.variant?.name;
            hasVariants = this.variantsList?.length > 1;
            unitCode = recipe.manufacturingUnitCode;
            lineQuantity = Number(recipe.manufacturingQuantity) || 0;
            selectedBatches = this.getRecipeBatches(recipe.batches);
        } else {
            const row = source === "raw" ? recipe.linkedStocks?.[rowIndex] : recipe.byProducts?.[rowIndex];
            if (!row?.stockUniqueName) {
                return;
            }
            stockUniqueName = row.stockUniqueName;
            stockName = row.stockName;
            variantUniqueName = row.variant?.uniqueName;
            variantName = row.variant?.name;
            hasVariants = row.variants?.length > 1;
            unitCode = row.stockUnitCode;
            lineQuantity = Number(row.quantity) || 0;
            selectedBatches = this.getRecipeBatches(row.batches);
        }

        if (!stockUniqueName) {
            return;
        }
        if (hasVariants && !variantUniqueName) {
            this.toasterService.showSnackBar("warning", this.localeData?.select_variant_first);
            return;
        }

        const warehouse = this.warehouses?.[0];
        this.dialog.open(BatchSelectDialogComponent, {
            ...ASIDE_PANE_CONFIG,
            data: {
                stockName,
                stockUniqueName,
                variantUniqueName,
                variantName,
                hasVariants,
                inventoryType: this.stock?.type || "PRODUCT",
                warehouseName: warehouse?.label,
                warehouseUniqueName: warehouse?.value,
                unitCode,
                lineQuantity,
                selectedBatches: cloneDeep(selectedBatches),
                localeData: this.localeData,
                commonLocaleData: this.commonLocaleData,
                isInbound: source === "finished" || source === "byProduct"
            }
        }).afterClosed().pipe(take(1)).subscribe((result?: BatchSelectDialogResult) => {
            if (!result) {
                return;
            }
            if (source === "finished") {
                recipe.batches = result.batches ?? [];
                if (result.overrideLineQuantity) {
                    recipe.manufacturingQuantity = result.allocatedQuantity;
                }
            } else {
                const row = source === "raw" ? recipe.linkedStocks?.[rowIndex] : recipe.byProducts?.[rowIndex];
                if (row) {
                    row.batches = result.batches ?? [];
                    if (result.overrideLineQuantity) {
                        row.quantity = result.allocatedQuantity;
                    }
                }
            }
            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * Payload batches: uniqueName + quantity only.
     *
     * @private
     * @param {any[]} [batches]
     * @return {*}  {{ uniqueName: string; quantity: number }[]}
     * @memberof CreateRecipeComponent
     */
    private mapBatchesForPayload(batches?: any[]): { uniqueName: string; quantity: number }[] {
        return (Array.isArray(batches) ? batches : [])
            .filter(batch => batch?.uniqueName && Number(batch.quantity) > 0)
            .map(batch => ({ uniqueName: batch.uniqueName, quantity: Number(batch.quantity) }));
    }

    /**
     * Normalize API batches for chips / the select dialog.
     *
     * @private
     * @param {any[]} [batches]
     * @return {*}  {VoucherSelectedBatch[]}
     * @memberof CreateRecipeComponent
     */
    private normalizeRecipeBatches(batches?: any[]): VoucherSelectedBatch[] {
        return (Array.isArray(batches) ? batches : []).reduce((list: VoucherSelectedBatch[], batch: any) => {
            const uniqueName = String(batch?.uniqueName ?? batch?.batchUniqueName ?? "").trim();
            if (!uniqueName) {
                return list;
            }
            list.push({
                uniqueName,
                name: batch?.name ?? "",
                batchNumber: batch?.batchNumber ?? "",
                quantity: Number(batch?.quantity) || 0,
                availableQuantity: Number(batch?.availableQuantity) || 0,
                expiryDate: batch?.expiryDate,
                manufacturingDate: batch?.manufacturingDate,
                warehouse: batch?.warehouse
            });
            return list;
        }, []);
    }
}
