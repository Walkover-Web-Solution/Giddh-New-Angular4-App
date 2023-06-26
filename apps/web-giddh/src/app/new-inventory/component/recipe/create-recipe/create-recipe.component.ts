import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep, isEqual } from 'apps/web-giddh/src/app/lodash-optimized';
import { InventoryService } from 'apps/web-giddh/src/app/services/inventory.service';
import { LedgerService } from 'apps/web-giddh/src/app/services/ledger.service';
import { ManufacturingService } from 'apps/web-giddh/src/app/services/manufacturing.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { ConfirmModalComponent } from 'apps/web-giddh/src/app/theme/new-confirm-modal/confirm-modal.component';
import { ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'create-recipe',
    templateUrl: './create-recipe.component.html',
    styleUrls: ['./create-recipe.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRecipeComponent implements OnChanges, OnDestroy {
    /** Stock object */
    @Input() public stock: any = {};
    /** List of variants in stock form */
    @Input() public variants: any[] = [];
    /** Emits true once recipe is saved */
    @Output() public recipeSaved: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Recipe object */
    public recipeObject: any = { manufacturingDetails: [] };
    /** List of variants */
    public variantsList: any[] = [];
    /** This will hold api calls if one is already in progress */
    public preventStocksApiCall: boolean = false;
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

    constructor(
        private inventoryService: InventoryService,
        private ledgerService: LedgerService,
        private manufacturingService: ManufacturingService,
        private toasterService: ToasterService,
        private changeDetectionRef: ChangeDetectorRef,
        private dialog: MatDialog
    ) {

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
            // const existingVariants = changes?.variants?.currentValue?.filter(variant => variant?.uniqueName);

            // this.recipeObject.manufacturingDetails?.forEach(manufacturingDetail => {
            //     if (manufacturingDetail?.variant?.uniqueName && !existingVariants.includes(manufacturingDetail?.variant?.uniqueName)) {
            //         manufacturingDetail.variantError = true;

            //         manufacturingDetail?.linkedStocks?.forEach(linkedStock => {
            //             if (linkedStock?.variant?.uniqueName && !existingVariants.includes(linkedStock?.variant?.uniqueName)) {
            //                 linkedStock.variantError = true;
            //             }
            //         });
            //     }
            // });
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
                    }
                }
            ],
            isEdit: true
        });

        this.getStocks(this.recipeObject.manufacturingDetails[this.recipeObject.manufacturingDetails?.length - 1].linkedStocks[0], 1, "");

        if (!this.recipeObject.manufacturingDetails[this.recipeObject.manufacturingDetails?.length - 1]?.units?.length) {
            this.getStockUnits(this.recipeObject.manufacturingDetails[this.recipeObject.manufacturingDetails?.length - 1], this.stock.uniqueName, true);
        }

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
                }
            }
        );

        this.getStocks(recipe.linkedStocks[recipe.linkedStocks?.length - 1], 1, "");
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
    public getStocks(stockObject: any, page: number = 1, q?: string, callback?: Function): void {
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
        this.inventoryService.getStocksV2({ inventoryType: this.stock.type, page: page, q: q }).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === "success" && response?.body?.results?.length) {
                if (!callback) {
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

        if (!object.stockUniqueName) {
            return;
        }

        if (!isEdit) {
            object.stockUnitCode = event?.additional?.stockUnitCode;
            object.stockUnitUniqueName = event?.additional?.stockUnitUniqueName;
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
            }
        });
    }

    /**
     * Get stock units
     *
     * @param {*} object
     * @param {string} stockUniqueName
     * @param {boolean} isFinishedStock
     * @param {boolean} [isEdit=false]
     * @returns {void}
     * @memberof CreateRecipeComponent
     */
    public getStockUnits(object: any, stockUniqueName: string, isFinishedStock: boolean, isEdit: boolean = false): void {
        if (!stockUniqueName) {
            return;
        }

        object.units = [];

        if (isFinishedStock && this.recipeObject.manufacturingDetails[0]?.units?.length) {
            object.units = cloneDeep(this.recipeObject.manufacturingDetails[0]?.units);

            if (!isEdit) {
                if (object.units?.length === 1) {
                    object.manufacturingUnitCode = object.units[0].label;
                    object.manufacturingUnitUniqueName = object.units[0].value;
                } else {
                    object.manufacturingUnitCode = "";
                    object.manufacturingUnitUniqueName = "";
                }
            }
            return;
        }

        this.manufacturingService.loadStockUnits(stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(units => {
            if (units?.length) {
                units?.forEach(unit => {
                    object.units.push({ label: unit?.code, value: unit?.uniqueName });
                });

                if (!isEdit) {
                    if (object.units?.length === 1) {
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
        });
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
                let index = 0;
                response?.body?.manufacturingDetails?.forEach(manufacturingDetail => {
                    this.recipeObject.manufacturingDetails[index] = [];

                    this.recipeObject.manufacturingDetails[index].manufacturingUnitCode = manufacturingDetail.manufacturingUnitCode;
                    this.recipeObject.manufacturingDetails[index].manufacturingUnitUniqueName = manufacturingDetail.manufacturingUnitUniqueName;
                    this.recipeObject.manufacturingDetails[index].manufacturingQuantity = manufacturingDetail.manufacturingQuantity;
                    this.recipeObject.manufacturingDetails[index].variant = manufacturingDetail.variant;
                    this.recipeObject.manufacturingDetails[index].linkedStocks = [];

                    this.getStockUnits(this.recipeObject.manufacturingDetails[index], this.stock.uniqueName, true, true);

                    let linkedStockIndex = 0;
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
                            units: unitsList
                        };

                        this.getStocks(this.recipeObject.manufacturingDetails[index].linkedStocks[linkedStockIndex], 1, "");
                        this.getStockVariants(this.recipeObject.manufacturingDetails[index].linkedStocks[linkedStockIndex], { label: linkedStock.stockName, value: linkedStock.stockUniqueName }, true);

                        linkedStockIndex++;
                    });

                    index++;
                });

                this.existingRecipe = this.formatRecipeRequest();
                this.changeDetectionRef.detectChanges();
            } else {
                this.recipeExists = false;
                this.existingRecipe = [];
                this.addNewRecipe();
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

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.recipeObject.manufacturingDetails[recipeIndex].linkedStocks = this.recipeObject.manufacturingDetails[recipeIndex].linkedStocks?.filter((linkedStock, i) => i !== index);
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

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.recipeObject.manufacturingDetails = this.recipeObject.manufacturingDetails?.filter((recipe, i) => i !== index);
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

        this.recipeObject.manufacturingDetails?.forEach(manufacturingDetail => {
            if (manufacturingDetail?.variant?.uniqueName && manufacturingDetail?.linkedStocks?.length > 0 && manufacturingDetail.linkedStocks?.filter(linkedStock => linkedStock?.variant?.uniqueName)?.length > 0) {
                let linkedStocks = [];

                manufacturingDetail.linkedStocks?.forEach(linkedStock => {
                    linkedStocks.push({
                        stockUniqueName: linkedStock.stockUniqueName,
                        stockUnitUniqueName: linkedStock.stockUnitUniqueName,
                        quantity: Number(linkedStock.quantity),
                        variant: {
                            uniqueName: linkedStock.variant?.uniqueName
                        }
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
        const recipeObject = this.formatRecipeRequest();
        if (!recipeObject?.manufacturingDetails?.length) {
            return;
        }
        this.manufacturingService.saveRecipe(this.stock.uniqueName, recipeObject).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toasterService.showSnackBar("success", this.localeData?.recipe_saved);
                this.recipeSaved.emit(true);
            } else {
                this.toasterService.showSnackBar("error", response?.body || response?.message);
            }
        });
    }
}
