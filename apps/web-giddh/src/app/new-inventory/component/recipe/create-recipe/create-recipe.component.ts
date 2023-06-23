import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { InventoryService } from 'apps/web-giddh/src/app/services/inventory.service';
import { LedgerService } from 'apps/web-giddh/src/app/services/ledger.service';
import { ManufacturingService } from 'apps/web-giddh/src/app/services/manufacturing.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'create-recipe',
    templateUrl: './create-recipe.component.html',
    styleUrls: ['./create-recipe.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRecipeComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public stock: any = {};
    @Input() public variants: any[] = [];
    @Input() public inventoryType: string = "";
    public receiptObject: any = { manufacturingDetails: [] };
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

    constructor(
        private inventoryService: InventoryService,
        private ledgerService: LedgerService,
        private manufacturingService: ManufacturingService,
        private toaster: ToasterService,
        private changeDetectionRef: ChangeDetectorRef
    ) {

    }

    public ngOnInit(): void {

    }

    public ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
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

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public addNewRecipe(): void {
        this.receiptObject.manufacturingDetails.push({
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

        this.getStocks(this.receiptObject.manufacturingDetails[this.receiptObject.manufacturingDetails?.length - 1].linkedStocks[0], 1, "");

        if (!this.receiptObject.manufacturingDetails[this.receiptObject.manufacturingDetails?.length - 1]?.units?.length) {
            this.getStockUnits(this.receiptObject.manufacturingDetails[this.receiptObject.manufacturingDetails?.length - 1], this.stock.uniqueName, true);
        }

        this.changeDetectionRef.detectChanges();
    }

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
        this.inventoryService.getStocksV2({ inventoryType: this.inventoryType, page: page, q: q }).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
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
     * @memberof CreateManufacturingComponent
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

    public getStockUnits(object: any, stockUniqueName: string, isFinishedStock: boolean, isEdit: boolean = false): void {
        if (!stockUniqueName) {
            return;
        }

        object.units = [];

        if (isFinishedStock && this.receiptObject.manufacturingDetails[0]?.units?.length) {
            object.units = cloneDeep(this.receiptObject.manufacturingDetails[0]?.units);

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

    public checkIfVariantIsAlreadyUsed(selectedRecipe: any, event: any, index: number): void {
        setTimeout(() => {
            const isSelected = this.receiptObject.manufacturingDetails?.filter((recipe, i) => { recipe?.variant?.uniqueName === event.value && i !== index });
            if (isSelected?.length) {
                selectedRecipe.variant.name = "";
                selectedRecipe.variant.uniqueName = "";
                this.toaster.showSnackBar("warning", this.localeData?.variant_already_selected);
            }
        }, 10);
    }

    public getVariantRecipe(): void {
        this.manufacturingService.getVariantRecipe(this.stock.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.manufacturingDetails?.length) {
                console.log(cloneDeep(response?.body?.manufacturingDetails));
                let index = 0;
                response?.body?.manufacturingDetails?.forEach(manufacturingDetail => {
                    this.receiptObject.manufacturingDetails[index] = [];

                    this.receiptObject.manufacturingDetails[index].manufacturingUnitCode = manufacturingDetail.manufacturingUnitCode;
                    this.receiptObject.manufacturingDetails[index].manufacturingUnitUniqueName = manufacturingDetail.manufacturingUnitUniqueName;
                    this.receiptObject.manufacturingDetails[index].manufacturingQuantity = manufacturingDetail.manufacturingQuantity;
                    this.receiptObject.manufacturingDetails[index].variant = manufacturingDetail.variant;
                    this.receiptObject.manufacturingDetails[index].linkedStocks = [];

                    this.getStockUnits(this.receiptObject.manufacturingDetails[index], this.stock.uniqueName, true, true);

                    let linkedStockIndex = 0;
                    manufacturingDetail.linkedStocks?.forEach(linkedStock => {
                        let unitsList = [];
                        linkedStock?.stockUnits?.forEach(unit => {
                            unitsList.push({ label: unit.code, value: unit.uniqueName });
                        });

                        this.receiptObject.manufacturingDetails[index].linkedStocks[linkedStockIndex] = {
                            stockName: linkedStock.stockName,
                            stockUniqueName: linkedStock.stockUniqueName,
                            stockUnitCode: linkedStock.stockUnitCode,
                            stockUnitUniqueName: linkedStock.stockUnitUniqueName,
                            quantity: linkedStock.quantity,
                            variant: linkedStock.variant,
                            units: unitsList
                        };

                        this.getStocks(this.receiptObject.manufacturingDetails[index].linkedStocks[linkedStockIndex], 1, "");
                        this.getStockVariants(this.receiptObject.manufacturingDetails[index].linkedStocks[linkedStockIndex], { label: linkedStock.stockName, value: linkedStock.stockUniqueName }, true);

                        linkedStockIndex++;
                    });

                    index++;
                });
                
                console.log(this.receiptObject.manufacturingDetails);
                this.changeDetectionRef.detectChanges();
            } else {
                this.addNewRecipe();
            }
        });
    }

    public removeLinkedStock(recipeIndex: number, index: number): void {
        this.receiptObject.manufacturingDetails[recipeIndex].linkedStocks = this.receiptObject.manufacturingDetails[recipeIndex].linkedStocks?.filter((linkedStock, i) => i !== index);
    }

    public removeRecipe(index: number): void {
        this.receiptObject.manufacturingDetails = this.receiptObject.manufacturingDetails?.filter((recipe, i) => i !== index);
    }
}
