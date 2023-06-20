import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { InventoryAction } from 'apps/web-giddh/src/app/actions/inventory/inventory.actions';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { CreateManufacturing, ManufacturingLinkedStock } from 'apps/web-giddh/src/app/models/api-models/Manufacturing';
import { LedgerService } from 'apps/web-giddh/src/app/services/ledger.service';
import { ManufacturingService } from 'apps/web-giddh/src/app/services/manufacturing.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { WarehouseActions } from 'apps/web-giddh/src/app/settings/warehouse/action/warehouse.action';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { giddhRoundOff } from 'apps/web-giddh/src/app/shared/helpers/helperFunctions';
import { AppState } from 'apps/web-giddh/src/app/store';
import * as dayjs from 'dayjs';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'create-manufacturing',
    templateUrl: './create-manufacturing.component.html',
    styleUrls: ['./create-manufacturing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateManufacturingComponent implements OnInit {
    /** Create Manufacturing dropdown items*/
    public product: any = [];
    /**  This will use for universal date */
    public universalDate: any;
    /** List of warehouses */
    public warehouses: any[] = [];
    /** List of stocks */
    public stocks: any[] = [];
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
    public errorFields: any = { date: false, finishedStockName: false, finishedStockVariant: false, finishedQuantity: false, linkedStockName: false, linkedVariantName: false, linkedQuantity: false };
    /** True if is loading */
    public isLoading: boolean = false;

    constructor(
        private store: Store<AppState>,
        private warehouseAction: WarehouseActions,
        private changeDetectionRef: ChangeDetectorRef,
        private inventoryAction: InventoryAction,
        private ledgerService: LedgerService,
        private manufacturingService: ManufacturingService,
        private toasterService: ToasterService
    ) {

    }

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
        this.getStocks();
    }

    /**
     * Get warehouses
     *
     * @memberof CreateManufacturingComponent
     */
    public getWarehouses(): void {
        this.store.pipe(select(state => state.warehouse.warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
            if (!warehouses?.results?.length) {
                this.store.dispatch(this.warehouseAction.fetchAllWarehouses({ page: 1, count: 0 }));
            } else {
                this.warehouses = [];

                warehouses?.results?.forEach(warehouse => {
                    this.warehouses.push({ label: warehouse?.name, value: warehouse?.uniqueName });
                });
            }
        });
    }

    /**
     * Get stocks
     *
     * @memberof CreateManufacturingComponent
     */
    public getStocks(): void {
        this.store.pipe(select(state => state.inventory.stocksList), takeUntil(this.destroyed$)).subscribe((stocks: any) => {
            if (!stocks?.results?.length) {
                this.store.dispatch(this.inventoryAction.GetStock());
            } else {
                this.stocks = [];

                stocks?.results?.forEach(stock => {
                    this.stocks.push({ label: stock?.name, value: stock?.uniqueName, additional: { stockUnitCode: stock?.stockUnit?.code, stockUnitUniqueName: stock?.stockUnit?.uniqueName } });
                });
            }
        });
    }

    public getStockVariants(object: any, event: any, loadRecipe: boolean = false): void {
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
                        this.getRateForStock(object);
                    }
                }
            }

            this.changeDetectionRef.detectChanges();
        });
    }

    public getVariantRecipe(): void {
        this.manufacturingObject.manufacturingDetails[0].linkedStocks = [];

        this.manufacturingService.getVariantRecipe(this.manufacturingObject.manufacturingDetails[0].stockUniqueName, [this.manufacturingObject.manufacturingDetails[0].variant.uniqueName], true).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.manufacturingDetails?.length) {
                this.manufacturingObject.manufacturingDetails[0].manufacturingUnitCode = response.body.manufacturingDetails[0].manufacturingUnitCode;
                this.manufacturingObject.manufacturingDetails[0].manufacturingMultipleOf = response.body.manufacturingDetails[0].manufacturingQuantity;
                this.manufacturingObject.manufacturingDetails[0].manufacturingQuantity = response.body.manufacturingDetails[0].manufacturingMultipleOf;

                response.body.manufacturingDetails[0].linkedStocks?.forEach(linkedStock => {
                    let amount = linkedStock.rate * linkedStock.quantity;

                    this.manufacturingObject.manufacturingDetails[0].linkedStocks.push(
                        {
                            selectedStock: { label: linkedStock.stockName, value: linkedStock.stockUniqueName, additional: { stockUnitCode: linkedStock.stockUnitCode, stockUnitUniqueName: linkedStock.stockUnitUniqueName } },
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
            } else {
                this.manufacturingObject.manufacturingDetails[0].linkedStocks.push(
                    {
                        selectedStock: { label: "", value: "", additional: { stockUnitCode: "", stockUnitUniqueName: "" } },
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

            this.calculateTotals();
        });
    }

    public getRateForStock(linkedStock: any): void {
        this.manufacturingService.getRateForStockV2(linkedStock.stockUniqueName, { quantity: 1, stockUnitUniqueName: linkedStock.selectedStock?.additional?.stockUnitUniqueName, variant: { uniqueName: linkedStock.variant.uniqueName } }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response.body) {
                linkedStock.quantity = 1;
                linkedStock.rate = response.body.rate;
                linkedStock.stockUnitCode = linkedStock.selectedStock?.additional?.stockUnitCode;
                linkedStock.stockUnitUniqueName = linkedStock.selectedStock?.additional?.stockUnitUniqueName;

                let amount = linkedStock.rate * linkedStock.quantity;
                linkedStock.amount = isNaN(amount) ? 0 : giddhRoundOff(amount, this.giddhBalanceDecimalPlaces);
            }

            this.checkLinkedStockValidation();

            if (this.activeLinkedStockIndex === null) {
                this.hideBorder(linkedStock);
            }

            this.calculateTotals();
        });
    }

    public formatRequest(): any {
        let manufacturingObject = cloneDeep(this.manufacturingObject);
        delete manufacturingObject.manufacturingDetails[0].variants;
        delete manufacturingObject.manufacturingDetails[0].manufacturingUnitCode;

        manufacturingObject.manufacturingDetails[0].linkedStocks?.map(linkedStock => {
            delete linkedStock.stockUnitCode;
            delete linkedStock.variants;
            delete linkedStock.selectedStock;
            delete linkedStock.cssClass;
            return linkedStock;
        });

        return manufacturingObject;
    }

    public createManufacturing(): void {
        const isFormValid = this.isFormValid();
        if (!isFormValid) {
            return;
        }

        this.isLoading = true;
        const manufacturingObject = this.formatRequest();
        this.manufacturingService.saveManufacturing(manufacturingObject.manufacturingDetails[0].stockUniqueName, manufacturingObject).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toasterService.successToast("Manufacturing has been created successfully.");
                this.resetForm();
            } else {
                this.toasterService.errorToast(response?.body || response?.message);
            }
            this.isLoading = false;

            this.changeDetectionRef.detectChanges();
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

    public addNewLinkedStock(): void {
        this.manufacturingObject.manufacturingDetails[0].linkedStocks.push(new ManufacturingLinkedStock());
    }

    public removeLinkedStock(index: number): void {
        this.manufacturingObject.manufacturingDetails[0].linkedStocks = this.manufacturingObject.manufacturingDetails[0].linkedStocks?.filter((linkedStock, i) => i !== index);
        this.calculateTotals();
    }

    public calculateRowTotal(linkedStock: any): void {
        let amount = linkedStock.rate * linkedStock.quantity;
        linkedStock.amount = isNaN(amount) ? 0 : giddhRoundOff(amount, this.giddhBalanceDecimalPlaces);
        this.calculateTotals();
    }

    public calculateTotals(): void {
        let totalRate = 0;
        let totalAmount = 0;

        this.manufacturingObject.manufacturingDetails[0].linkedStocks?.forEach(linkedStock => {
            totalRate += linkedStock.rate;
            totalAmount += linkedStock.amount;
        });

        this.totals.totalRate = totalRate;
        this.totals.totalAmount = totalAmount;
        this.totals.costPerItem = giddhRoundOff((totalAmount / (this.manufacturingObject.manufacturingDetails[0].manufacturingQuantity * this.manufacturingObject.manufacturingDetails[0].manufacturingMultipleOf)), this.giddhBalanceDecimalPlaces);

        this.changeDetectionRef.detectChanges();
    }

    public resetForm(): void {
        this.manufacturingObject = new CreateManufacturing();
        this.manufacturingObject.manufacturingDetails[0].date = cloneDeep(this.universalDate);

        this.errorFields = { date: false, finishedStockName: false, finishedStockVariant: false, finishedQuantity: false, linkedStockName: false, linkedVariantName: false, linkedQuantity: false };

        this.calculateTotals();
        this.changeDetectionRef.detectChanges();
    }

    public showBorder(linkedStock: any): void {
        linkedStock.cssClass = 'form-control mat-field-border';
    }

    public hideBorder(linkedStock: any): void {
        if (!linkedStock?.variant?.uniqueName) {
            linkedStock.cssClass = 'form-control mat-field-border';
        } else {
            linkedStock.cssClass = 'form-control';
        }
    }

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
            this.errorFields.linkedStockName = true;
            this.errorFields.linkedVariantName = true;
            this.errorFields.linkedQuantity = true;
            isValidForm = false;
        }
        if (this.manufacturingObject.manufacturingDetails[0].linkedStocks?.length && !this.manufacturingObject.manufacturingDetails[0].linkedStocks[0].selectedStock?.value) {
            this.errorFields.linkedStockName = true;
            isValidForm = false;
        }
        if (this.manufacturingObject.manufacturingDetails[0].linkedStocks?.length && !this.manufacturingObject.manufacturingDetails[0].linkedStocks[0].variant?.uniqueName) {
            this.errorFields.linkedVariantName = true;
            isValidForm = false;
        }
        if (this.manufacturingObject.manufacturingDetails[0].linkedStocks?.length && !this.manufacturingObject.manufacturingDetails[0].linkedStocks[0].quantity) {
            this.errorFields.linkedQuantity = true;
            isValidForm = false;
        }

        return isValidForm;
    }

    public checkLinkedStockValidation(): void {
        if (!this.manufacturingObject.manufacturingDetails[0].linkedStocks[0].selectedStock?.value) {
            this.errorFields.linkedStockName = true;
        } else {
            this.errorFields.linkedStockName = false;
        }
        if (!this.manufacturingObject.manufacturingDetails[0].linkedStocks[0].variant?.uniqueName) {
            this.errorFields.linkedVariantName = true;
        } else {
            this.errorFields.linkedVariantName = false;
        }
        if (!this.manufacturingObject.manufacturingDetails[0].linkedStocks[0].quantity) {
            this.errorFields.linkedQuantity = true;
        } else {
            this.errorFields.linkedQuantity = false;
        }
    }
}
