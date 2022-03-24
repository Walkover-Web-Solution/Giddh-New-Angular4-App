import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { filter, take, takeUntil } from "rxjs/operators";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { InventoryService } from "../../../services/inventory.service";
import { IOption } from "../../../theme/ng-virtual-select/sh-options.interface";
import { IGroupsWithStocksHierarchyMinItem } from "../../../models/interfaces/groupsWithStocks.interface";
import { SalesService } from "../../../services/sales.service";
import { ToasterService } from "../../../services/toaster.service";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../store";
import { CompanyActions } from "../../../actions/company.actions";
import { WarehouseActions } from "../../../settings/warehouse/action/warehouse.action";

@Component({
    selector: "stock-create-edit",
    templateUrl: "./stock-create-edit.component.html",
    styleUrls: ["./stock-create-edit.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockCreateEditComponent implements OnInit, OnDestroy {
    public separatorKeysCodes: any[] = [ENTER, COMMA];
    /* this will store image path*/
    public imgPath: string = "";
    /** Stock units list */
    public stockUnits: IOption[] = [];
    /** Stock groups list */
    public stockGroups: IOption[] = [];
    /** Purchase accounts list */
    public purchaseAccounts: IOption[] = [];
    /** Sales accounts list */
    public salesAccounts: IOption[] = [];
    /** Taxes list */
    public taxes: IOption[] = [];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public stockForm: any = {
        type: 'PRODUCT',
        name: null,
        uniqueName: null,
        stockUnitCode: null,
        hsnNumber: null,
        sacNumber: null,
        taxes: null,
        skuCode: null,
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
                    stockUnitCode: null
                }
            ]
        },
        salesAccountDetails: {
            accountUniqueName: null,
            unitRates: [
                {
                    rate: null,
                    stockUnitCode: null
                }
            ]
        },
        isFsStock: null,
        manufacturingDetails: null,
        accountGroup: null,
        lowStockAlertCount: 0,
        outOfStockSelling: true,
        variants: [],
        options: [
            {
                name: null,
                values: null,
                order: 1
            }
        ]
    };
    public stockGroupUniqueName: string = "";
    public variantOptions: any[] = [];
    public isPurchaseInformationEnabled: boolean = false;
    public isSalesInformationEnabled: boolean = false;
    public isVariantAvailable: boolean = false;
    public inlineEditCustomField: number = 0;
    public warehouses: any[] = [];
    public stockUnitName: string = "";

    constructor(
        private inventoryService: InventoryService,
        private salesService: SalesService,
        private toaster: ToasterService,
        private store: Store<AppState>,
        private companyAction: CompanyActions,
        private warehouseAction: WarehouseActions
    ) {
    }

    public ngOnInit(): void {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        this.addVariantOption();
        this.getStockUnits();
        this.getStockGroups();
        this.getPurchaseAccounts();
        this.getSalesAccounts();
        this.getTaxes();
        this.getWarehouses();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public addOption(event: MatChipInputEvent, index: number): void {
        const value = (event.value || "").trim();
        const valueIndex = this.variantOptions[index]['values'].indexOf(value);
        if (valueIndex === -1) {
            if (value) {
                this.variantOptions[index]['values'].push(value);
            }
            // tslint:disable-next-line:no-non-null-assertion
            event.chipInput!.clear();

            this.generateVariants();
        } else {
            this.toaster.showSnackBar("warning", "You've already used the option value " + value);
        }
    }

    public removeOption(value: any, index: number): void {
        const valueIndex = this.variantOptions[index]['values'].indexOf(value);
        if (valueIndex > -1) {
            this.variantOptions[index]['values'].splice(valueIndex, 1);
        }
        this.generateVariants();
    }

    public getStockUnits(): void {
        this.inventoryService.GetStockUnit().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.stockUnits = response?.body?.map(result => {
                    return {
                        value: result.code,
                        label: result.name,
                        additional: result
                    };
                }) || [];
            }
        });
    }

    public getStockGroups(): void {
        this.inventoryService.GetGroupsWithStocksFlatten().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                let stockGroups: IOption[] = [];
                this.arrangeStockGroups(response.body?.results, stockGroups);
                this.stockGroups = stockGroups;
            }
        });
    }

    private arrangeStockGroups(groups: IGroupsWithStocksHierarchyMinItem[], parents: IOption[] = []): void {
        groups.map(group => {
            if (group) {
                let newOption: IOption = { label: '', value: '', additional: {} };
                newOption.label = group.name;
                newOption.value = group.uniqueName;
                newOption.additional = group;
                parents.push(newOption);
                if (group.childStockGroups?.length > 0) {
                    this.arrangeStockGroups(group.childStockGroups, parents);
                }
            }
        });
    }

    public getPurchaseAccounts(): void {
        this.salesService.getAccountsWithCurrency('operatingcost, indirectexpenses').pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data.status === 'success') {
                let purchaseAccounts: IOption[] = [];
                data.body.results.map(account => {
                    purchaseAccounts.push({ label: `${account.name} (${account.uniqueName})`, value: account.uniqueName, additional: account });
                });

                this.purchaseAccounts = purchaseAccounts;
            }
        });
    }

    public getSalesAccounts(): void {
        this.salesService.getAccountsWithCurrency('revenuefromoperations, otherincome').pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data.status === 'success') {
                let salesAccounts: IOption[] = [];
                data.body.results.map(account => {
                    salesAccounts.push({ label: `${account.name} (${account.uniqueName})`, value: account.uniqueName, additional: account });
                });

                this.salesAccounts = salesAccounts;
            }
        });
    }

    public addVariantOption(): void {
        const optionIndex = this.variantOptions.length + 1;
        this.variantOptions.push({ name: "Option " + optionIndex, values: [], order: optionIndex });
    }

    public deleteVariantOption(index: number): void {
        this.variantOptions = this.variantOptions.filter((data, optionIndex) => optionIndex !== index).map(data => { return data });
    }

    public generateVariants(): void {
        let attributes = [];

        this.variantOptions?.forEach((option, index) => {
            if (option?.values?.length > 0) {
                attributes[index] = [];
                let optionName = option?.name;
                option?.values?.forEach(value => {
                    attributes[index].push({ [optionName]: value })
                });
            }
        });

        attributes = attributes.reduce((previous, current) => previous.flatMap(currentValue => current.map(finalValue => ({ ...currentValue, ...finalValue }))));

        let variants = [];
        attributes.forEach(attribute => {
            let variantValues = [];
            Object.keys(attribute).forEach(key => {
                variantValues.push(attribute[key]);
            });

            variants.push(variantValues.join(" / "));
        });

        this.stockForm.variants = [];

        let defaultWarehouse = null;
        if (this.warehouses?.length > 0) {
            defaultWarehouse = this.warehouses?.filter(warehouse => warehouse.isDefault);
        }

        variants?.forEach(variant => {
            this.stockForm.variants.push({
                name: variant,
                archive: false,
                uniqueName: undefined,
                skuCode: undefined,
                warehouseBalance: [
                    {
                        warehouse: {
                            name: (defaultWarehouse) ? defaultWarehouse[0]?.name : undefined,
                            uniqueName: (defaultWarehouse) ? defaultWarehouse[0]?.uniqueName : undefined
                        },
                        stockUnit: {
                            name: this.stockUnitName,
                            code: this.stockForm.stockUnitCode
                        },
                        openingQuantity: 0,
                        openingAmount: 0
                    }
                ]
            });
        });
    }

    public addNewPurchaseUnitPrice(): void {
        this.stockForm.purchaseAccountDetails.unitRates.push({
            rate: null,
            stockUnitCode: null
        });
    }

    public deletePurchaseUnitPrice(unitRateIndex: number): void {
        let unitRates = this.stockForm.purchaseAccountDetails.unitRates?.filter((data, index) => index !== unitRateIndex).map(data => { return data });
        this.stockForm.purchaseAccountDetails.unitRates = unitRates;

        if (unitRates?.length === 0) {
            this.addNewPurchaseUnitPrice();
        }
    }

    public addNewSalesUnitPrice(): void {
        this.stockForm.salesAccountDetails.unitRates.push({
            rate: null,
            stockUnitCode: null
        });
    }

    public deleteSalesUnitPrice(unitRateIndex: number): void {
        let unitRates = this.stockForm.salesAccountDetails.unitRates?.filter((data, index) => index !== unitRateIndex).map(data => { return data });
        this.stockForm.salesAccountDetails.unitRates = unitRates;

        if (unitRates?.length === 0) {
            this.addNewSalesUnitPrice();
        }
    }

    public selectVariantUnit(variant: any, event: any): void {
        variant.warehouseBalance[0].stockUnit = { name: event.label, code: event.value };
    }

    public getTaxes(): void {
        this.store.pipe(select(state => state?.company?.taxes), takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.length > 0) {
                this.taxes = response?.map(result => {
                    return {
                        value: result.uniqueName,
                        label: result.name,
                        additional: result
                    };
                }) || [];
            } else {
                this.store.dispatch(this.companyAction.getTax());
            }
        });
    }

    public showCustomFieldLabelInlineEdit(field: number): void {
        this.inlineEditCustomField = field;
    }

    public getWarehouses(): void {
        this.store.pipe(select(state => state.warehouse.warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
            if (warehouses) {
                this.warehouses = warehouses.results;
            } else {
                this.store.dispatch(this.warehouseAction.fetchAllWarehouses({ page: 1, count: 0 }));
            }
        });
    }

    public createStock(): void {
        
    }
}
