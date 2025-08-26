import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { ReplaySubject } from "rxjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { ServiceConfig } from "../../../services/service.config";
import { MatTableDataSource } from "@angular/material/table";

export interface Category {
    name: string;
}


@Component({
    selector: "create-new-inventory",
    templateUrl: "./create-new-inventory.component.html",
    styleUrls: ["./create-new-inventory.component.scss"],

})

export class CreateNewInventoryComponent implements OnInit {
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    category: Category[] = [
        { name: "S" },
        { name: "M" },
        { name: "L" },
        { name: "LG" },
        { name: "XL" },
    ];

    /** Stores if bulk edit is enabled */
    public editBulk: boolean = false;
    /** Stores image path */
    public imgPath: string = "";
    /** Stores HSN boolean value */
    public isHSN: boolean = true;
    /** Stores product boolean value */
    public isProduct: boolean = true;
    public isService: boolean = false;
    public isCombo: boolean = false;
    public isBulkCreation: boolean = false;
    public formGroupRadio: UntypedFormGroup;
    /** Stores expense boolean value */
    public isExpense: boolean = true;
    /** Displayed columns for variant table */
    public variantDisplayedColumns: string[] = ['stockName', 'uniqueName', 'unit', 'costPrice', 'salePrice', 'skuCode', 'archive'];
    /** Data source for variant table */
    public variantDataSource = new MatTableDataSource<any>([]);
    /** Displayed columns for combo table */
    public comboDisplayedColumns: string[] = ['image', 'stockName', 'unit', 'quantity', 'sellingPrice', 'purchasePrice', 'actions'];
    /** Data source for combo table */
    public comboDataSource = new MatTableDataSource<any>([
        {
            id: 1,
            image: 'Login-Page-Image.png',
            stockName: 'Product Name/Service',
            unit: 'Unit',
            quantity: '2',
            sellingPrice: '0.00',
            purchasePrice: '0.00'
        }
    ]);
    /** Displayed columns for bulk creation table */
    public bulkDisplayedColumns: string[] = ['index', 'stockName', 'uniqueName', 'unit', 'costPrice', 'salePrice', 'skuCode', 'archive'];
    /** Data source for bulk creation table */
    public bulkDataSource = new MatTableDataSource<any>([
        {
            id: 1,
            stockName: 'Product Name 1',
            uniqueName: 'product-1',
            unit: 'Unit',
            costPrice: '100.00',
            salePrice: '150.00',
            skuCode: 'SKU001',
            archive: false
        },
        {
            id: 2,
            stockName: 'Product Name 2',
            uniqueName: 'product-2',
            unit: 'Unit',
            costPrice: '200.00',
            salePrice: '250.00',
            skuCode: 'SKU002',
            archive: false
        }
    ]);
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(@Inject(ServiceConfig) private serviceConfig,  private fb: UntypedFormBuilder,
    ) {
    }

    /**
     * Initializes component with form setup and image path
     *
     * @public
     * @memberof CreateNewInventoryComponent
     */
    public ngOnInit(): void {
        this.formGroupRadio = this.fb.group({
            radioType: [""],
        });
        this.formGroupRadio.controls["radioType"].valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
            if (value === "product") {
                this.isProduct = true;
                this.isService = false;
                this.isCombo = false;
                this.isBulkCreation = false;
                this.updateVariantDataSource();
            } else if (value === "service") {
                this.isProduct = false;
                this.isService = true;
                this.isCombo = false;
                this.isBulkCreation = false;
            } else if (value === "combo") {
                this.isProduct = false;
                this.isService = false;
                this.isCombo = true;
                this.isBulkCreation = false;
            } else if (value === "bulkCreation") {
                this.isProduct = false;
                this.isService = false;
                this.isCombo = false;
                this.isBulkCreation = true;
            }
        });
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
        this.updateVariantDataSource();
    }

    /**
     * Selects HSN or SAC code type
     *
     * @public
     * @param {any} isHSN - HSN code selection flag
     * @memberof CreateNewInventoryComponent
     */
    public selectCode(isHSN: any): void {
        this.isHSN = isHSN;
    }

    /**
     * Toggles expense type selection
     *
     * @public
     * @param {any} isExpense - Expense type flag
     * @memberof CreateNewInventoryComponent
     */
    public toggleExpense(isExpense: any): void {
        this.isExpense = isExpense;
    }

    /**
     * Adds new category chip
     *
     * @public
     * @param {MatChipInputEvent} event - Chip input event
     * @memberof CreateNewInventoryComponent
     */
    public add(event: MatChipInputEvent): void {
        const value = (event?.value || "").trim();

        if (value) {
            this.category.push({ name: value });
            this.updateVariantDataSource();
        }

        event.chipInput!.clear();
    }

    /**
     * Removes category chip
     *
     * @public
     * @param {Category} categorys - Category to remove
     * @memberof CreateNewInventoryComponent
     */
    public remove(categorys: Category): void {
        const index = this.category?.indexOf(categorys);

        if (index >= 0) {
            this.category.splice(index, 1);
            this.updateVariantDataSource();
        }
    }

    /**
     * Updates variant data source based on categories
     *
     * @private
     * @memberof CreateNewInventoryComponent
     */
    private updateVariantDataSource(): void {
        const variantData = this.category.map((cat, index) => ({
            id: index + 1,
            stockName: cat.name,
            uniqueName: '',
            unit: '',
            costPrice: '0.00',
            salePrice: '0.00',
            skuCode: '',
            archive: false
        }));
        this.variantDataSource.data = variantData;
    }

    /**
     * Cleans up component subscriptions
     *
     * @public
     * @memberof CreateNewInventoryComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
