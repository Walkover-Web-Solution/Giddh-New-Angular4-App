import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ReplaySubject, Observable } from "rxjs";
import { takeUntil, map, startWith } from "rxjs/operators";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { InventoryService } from "../../../services/inventory.service";
import { IOption } from "../../../theme/ng-virtual-select/sh-options.interface";
import { IGroupsWithStocksHierarchyMinItem } from "../../../models/interfaces/groupsWithStocks.interface";
import { SalesService } from "../../../services/sales.service";

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
    // Variables for Service Unit Dropdown Under Service Radio Button
    serviceUnitGroupControl = new FormControl();
    serviceUnitGroupOptions: string[] = ['Dummy One', 'Dummy Two', 'Dummy Three'];
    serviceUnitGroupFilteredOptions: Observable<string[]>;
    // Variables for Under Group Dropdown Under Service Radio Button
    serviceUnderGroupControl = new FormControl();
    serviceUnderGroupOptions: string[] = ['Dummy Four', 'Dummy Five', 'Dummy Six'];
    serviceUnderGroupFilteredOptions: Observable<string[]>;
    // Variables for Linked Account/s Dropdown Under Service Radio Button > Account Tab > Purchase Information
    servicePurchaseLinkedGroupControl = new FormControl();
    servicePurchaseLinkedGroupOptions: string[] = ['Dummy Four', 'Dummy Five', 'Dummy Six'];
    servicePurchaseLinkedGroupFilteredOptions: Observable<string[]>;
    // Variables for Linked Account/s Dropdown Under Service Radio Button > Account Tab > Sales Information
    serviceSalesLinkedGroupControl = new FormControl();
    serviceSalesLinkedGroupOptions: string[] = ['Dummy Four', 'Dummy Five', 'Dummy Six'];
    serviceSalesLinkedGroupFilteredOptions: Observable<string[]>;

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
        customField1Heading: null,
        customField1Value: null,
        customField2Heading: null,
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

    constructor(
        private inventoryService: InventoryService,
        private salesService: SalesService
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

        this.serviceUnitGroupFilteredOptions = this.serviceUnitGroupControl.valueChanges.pipe(
            startWith(''),
            map(value => this._serviceUnitGroupfilter(value)),
        );

        this.serviceUnderGroupFilteredOptions = this.serviceUnderGroupControl.valueChanges.pipe(
            startWith(''),
            map(value => this._serviceUnderGroupfilter(value)),
        );

        this.servicePurchaseLinkedGroupFilteredOptions = this.servicePurchaseLinkedGroupControl.valueChanges.pipe(
            startWith(''),
            map(value => this._servicePurchaseLinkedfilter(value)),
        );

        this.serviceSalesLinkedGroupFilteredOptions = this.serviceSalesLinkedGroupControl.valueChanges.pipe(
            startWith(''),
            map(value => this._serviceSalesLinkedfilter(value)),
        );

    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public addOption(event: MatChipInputEvent, index: number): void {
        const value = (event.value || "").trim();

        if (value) {
            this.variantOptions[index]['values'].push(value);
        }
        // tslint:disable-next-line:no-non-null-assertion
        event.chipInput!.clear();

        this.generateVariants();
    }

    public removeOption(value: any, index: number): void {
        const valueIndex = this.variantOptions[index]['values'].indexOf(value);

        if (valueIndex > -1) {
            this.variantOptions[index]['values'].splice(valueIndex, 1);
        }
    }

    private _serviceUnitGroupfilter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.serviceUnitGroupOptions.filter(serviceUnitGroupOption => serviceUnitGroupOption.toLowerCase().includes(filterValue));
    }

    private _serviceUnderGroupfilter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.serviceUnderGroupOptions.filter(serviceUnderGroupOption => serviceUnderGroupOption.toLowerCase().includes(filterValue));
    }

    private _servicePurchaseLinkedfilter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.servicePurchaseLinkedGroupOptions.filter(servicePurchaseLinkedGroupOption => servicePurchaseLinkedGroupOption.toLowerCase().includes(filterValue));
    }

    private _serviceSalesLinkedfilter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.serviceSalesLinkedGroupOptions.filter(serviceSalesLinkedGroupOption => serviceSalesLinkedGroupOption.toLowerCase().includes(filterValue));
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

    public generateVariants(): void {
        let attributes = [];

        this.variantOptions?.forEach((option, index) => {
            attributes[index] = [];
            let optionName = option?.name;
            option?.values?.forEach(value => {
                attributes[index].push({ [optionName]: value })
            });
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

        variants?.forEach(variant => {
            this.stockForm.variants.push({
                name: variant,
                archive: false,
                uniqueName: undefined,
                skuCode: undefined,
                warehouseBalance: [
                    {
                        warehouse: {
                            name: undefined,
                            uniqueName: undefined
                        },
                        stockUnit: {
                            name: "nos",
                            code: "nos"
                        },
                        openingQuantity: 0,
                        openingAmount: 0
                    }
                ]
            });
        });
    }

    public selectUnit(event: any): void {
        this.stockForm.stockUnitCode = event?.value;
    }

    public selectGroup(event: any): void {
        this.stockGroupUniqueName = event?.value;
    }

    public selectPurchaseAccount(event: any): void {
        this.stockForm.purchaseAccountDetails.accountUniqueName = event?.value;
    }

    public selectSalesAccount(event: any): void {
        this.stockForm.salesAccountDetails.accountUniqueName = event?.value;
    }
}
