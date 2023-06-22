import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { InventoryService } from 'apps/web-giddh/src/app/services/inventory.service';
import { LedgerService } from 'apps/web-giddh/src/app/services/ledger.service';
import { ManufacturingService } from 'apps/web-giddh/src/app/services/manufacturing.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'create-recipe',
    templateUrl: './create-recipe.component.html',
    styleUrls: ['./create-recipe.component.scss']
})
export class CreateRecipeComponent implements OnInit, OnChanges {
    @Input() public stock: any = {};
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

    constructor(
        private inventoryService: InventoryService,
        private ledgerService: LedgerService,
        private manufacturingService: ManufacturingService,
        private toaster: ToasterService
    ) {

    }

    public ngOnInit(): void {
        this.addNewRecipe();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.stock?.currentValue) {
            this.variantsList = [];

            changes?.stock?.currentValue?.variants?.forEach(variant => {
                this.variantsList.push({
                    label: variant.name,
                    value: variant.uniqueName
                });
            });
        }
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
            ]
        });

        this.getStocks(this.receiptObject.manufacturingDetails[this.receiptObject.manufacturingDetails?.length - 1].linkedStocks[0], 1, "");

        if (!this.receiptObject.manufacturingDetails[this.receiptObject.manufacturingDetails?.length - 1]?.units?.length) {
            this.getStockUnits(this.receiptObject.manufacturingDetails[this.receiptObject.manufacturingDetails?.length - 1], this.stock?.uniqueName, true);
        }
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
    public getStockVariants(object: any, event: any): void {
        object.stockUniqueName = event?.value;
        object.stockName = event?.label;
        object.stockUnitCode = event?.additional?.stockUnitCode;
        object.stockUnitUniqueName = event?.additional?.stockUnitUniqueName;

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
                } else {
                    object.variant = {
                        name: "",
                        uniqueName: ""
                    };
                }
            }
        });
    }

    public getStockUnits(object: any, stockUniqueName: string, isFinishedStock: boolean): void {
        if (!stockUniqueName) {
            return;
        }

        object.units = [];

        this.manufacturingService.loadStockUnits(stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(units => {
            if (units?.length) {
                units?.forEach(unit => {
                    object.units.push({ label: unit?.code, value: unit?.uniqueName });
                });

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
}
