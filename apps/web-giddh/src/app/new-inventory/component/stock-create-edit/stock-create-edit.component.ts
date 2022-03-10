import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ReplaySubject, Observable } from "rxjs";
import { takeUntil, map, startWith } from "rxjs/operators";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";

@Component({
    selector: "stock-create-edit",
    templateUrl: "./stock-create-edit.component.html",
    styleUrls: ["./stock-create-edit.component.scss"]
})
export class StockCreateEditComponent implements OnInit, OnDestroy {
    public separatorKeysCodes: any[] = [ENTER, COMMA];
    /* this will store image path*/
    public imgPath: string = "";
    // Variables for Product Unit Dropdown Under Product Radio Button
    productUnitControl = new FormControl();
    productUnitOptions: string[] = ['Dummy One', 'Dummy Two', 'Dummy Three'];
    productUnitFilteredOptions: Observable<string[]>;
    // Variables for Under Control Dropdown Under Product Radio Button
    productUnderGroupControl = new FormControl();
    productUnderGroupOptions: string[] = ['Dummy Four', 'Dummy Five', 'Dummy Six'];
    productUnderGroupFilteredOptions: Observable<string[]>;
    // Variables for Linked Account/s Dropdown Under Product Radio Button > Account Tab > Purchase Information
    productPurchaseLinkedGroupControl = new FormControl();
    productPurchaseLinkedGroupOptions: string[] = ['Dummy Four', 'Dummy Five', 'Dummy Six'];
    productPurchaseLinkedGroupFilteredOptions: Observable<string[]>;
    // Variables for Linked Account/s Dropdown Under Product Radio Button > Account Tab > Sales Information
    productSalesLinkedControl = new FormControl();
    productSalesLinkedOptions: string[] = ['Dummy Four', 'Dummy Five', 'Dummy Six'];
    productSalesLinkedFilteredOptions: Observable<string[]>;
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
        variants: null,
        options: [
            {
                name: null,
                values: null,
                order: 1
            }
        ]
    };

    constructor(
    ) {
    }

    public ngOnInit(): void {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        this.productUnitFilteredOptions = this.productUnitControl.valueChanges.pipe(
            startWith(''),
            map(value => this._productUnitfilter(value)),
        );

        this.productUnderGroupFilteredOptions = this.productUnderGroupControl.valueChanges.pipe(
            startWith(''),
            map(value => this._productUnderGroupfilter(value)),
        );

        this.serviceUnitGroupFilteredOptions = this.serviceUnitGroupControl.valueChanges.pipe(
            startWith(''),
            map(value => this._serviceUnitGroupfilter(value)),
        );

        this.serviceUnderGroupFilteredOptions = this.serviceUnderGroupControl.valueChanges.pipe(
            startWith(''),
            map(value => this._serviceUnderGroupfilter(value)),
        );

        this.productPurchaseLinkedGroupFilteredOptions = this.productPurchaseLinkedGroupControl.valueChanges.pipe(
            startWith(''),
            map(value => this._productPurchaseLinkedGroupfilter(value)),
        );

        this.productSalesLinkedFilteredOptions = this.productSalesLinkedControl.valueChanges.pipe(
            startWith(''),
            map(value => this._productSalesLinkedfilter(value)),
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

    public addOption(event: MatChipInputEvent): void {
        const value = (event.value || "").trim();

        // Clear the input value
        // tslint:disable-next-line:no-non-null-assertion
        event.chipInput!.clear();
    }

    public removeOption(value: any): void {
        // const index = this.category.indexOf(categorys);

        // if (index >= 0) {
        //     this.category.splice(index, 1);
        // }
    }

    private _productUnitfilter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.productUnitOptions.filter(productUnitOption => productUnitOption.toLowerCase().includes(filterValue));
    }

    private _productUnderGroupfilter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.productUnderGroupOptions.filter(productUnderGroupOption => productUnderGroupOption.toLowerCase().includes(filterValue));
    }

    private _serviceUnitGroupfilter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.serviceUnitGroupOptions.filter(serviceUnitGroupOption => serviceUnitGroupOption.toLowerCase().includes(filterValue));
    }

    private _serviceUnderGroupfilter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.serviceUnderGroupOptions.filter(serviceUnderGroupOption => serviceUnderGroupOption.toLowerCase().includes(filterValue));
    }

    private _productPurchaseLinkedGroupfilter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.productPurchaseLinkedGroupOptions.filter(productPurchaseLinkedGroupOption => productPurchaseLinkedGroupOption.toLowerCase().includes(filterValue));
    }

    private _productSalesLinkedfilter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.productSalesLinkedOptions.filter(productSalesLinkedGroupOption => productSalesLinkedGroupOption.toLowerCase().includes(filterValue));
    }

    private _servicePurchaseLinkedfilter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.servicePurchaseLinkedGroupOptions.filter(servicePurchaseLinkedGroupOption => servicePurchaseLinkedGroupOption.toLowerCase().includes(filterValue));
    }

    private _serviceSalesLinkedfilter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.serviceSalesLinkedGroupOptions.filter(serviceSalesLinkedGroupOption => serviceSalesLinkedGroupOption.toLowerCase().includes(filterValue));
    }
}
