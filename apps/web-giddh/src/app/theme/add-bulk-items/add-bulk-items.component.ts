import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { AddBulkItemsComponentStore } from "./utility/add-bulk-items.store";
import { VouchersUtilityService } from "../../vouchers/utility/vouchers.utility.service";
import { cloneDeep } from "../../lodash-optimized";
import { SearchService } from "../../services/search.service";
import { Observable, ReplaySubject, debounceTime, of, takeUntil } from "rxjs";
import { OptionInterface } from "../../models/api-models/Voucher";
import { SearchType } from "../../vouchers/utility/vouchers.const";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { SalesAddBulkStockItems } from "../../models/api-models/Sales";
import { ToasterService } from "../../services/toaster.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "add-bulk-items",
    templateUrl: "./add-bulk-items.component.html",
    styleUrls: ["./add-bulk-items.component.scss"],
    providers: [AddBulkItemsComponentStore]
})
export class AddBulkItemsComponent implements OnInit, OnDestroy {
    /** Stock search request */
    public stockSearchRequest: any;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stock results Observable */
    public stockResults$: Observable<OptionInterface[]> = of(null);
    /** Form Group for invoice form */
    public addBulkForm: FormGroup;
    /** List of stock variants */
    public stockVariants: any[] = [];
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** List of items in process to add */
    public itemsInProcess: any[] = [];

    constructor(
        private vouchersUtilityService: VouchersUtilityService,
        private searchService: SearchService,
        private formBuilder: FormBuilder,
        private toaster: ToasterService,
        private componentStore: AddBulkItemsComponentStore,
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>
    ) { }

    /**
     * This will be use for component initialization
     *
     * @memberof AddBulkItemsComponent
     */
    public ngOnInit(): void {
        this.initAddBulkForm();
        this.searchStock();

        this.addBulkForm.get('stock').valueChanges.pipe(debounceTime(100), takeUntil(this.destroyed$)).subscribe(response => {
            this.searchStock(response, 1);
        });

        this.componentStore.stockVariants$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.stockVariants[response.entryIndex] = of(response.results);
            }
        });
    }

    /**
     * Initializes add bulk form
     *
     * @private
     * @memberof AddBulkItemsComponent
     */
    private initAddBulkForm(): void {
        this.addBulkForm = this.formBuilder.group({
            stock: [''],
            data: this.formBuilder.array([]),
        })
    }

    /**
     * This will be use for return stock form group
     *
     * @private
     * @return {*}  {FormGroup}
     * @memberof AddBulkItemsComponent
     */
    private getStockFormGroup(item: SalesAddBulkStockItems): FormGroup {
        return this.formBuilder.group({
            quantity: [1],
            rate: [item?.rate || ""],
            name: [item?.name || ""],
            stockUniqueName: [item.additional?.stock?.uniqueName || ""],
            variantUniqueName: [item?.variant?.uniqueName || ""],
            customerUniqueName: [this.inputData.customerUniqueName],
            additional: [item.additional || ""],
            variantName: [item?.variant?.name || ""],
        });
    }

    /**
     * This will be use for getter of bulk form
     *
     * @readonly
     * @type {FormArray}
     * @memberof AddBulkItemsComponent
     */
    public get getDataControls(): FormArray {
        return this.addBulkForm.get("data") as FormArray;
    }

    /**
     * This will be use for search stock
     *
     * @param {string} [query='']
     * @param {number} [page=1]
     * @return {*}  {void}
     * @memberof AddBulkItemsComponent
     */
    public searchStock(query: string = '', page: number = 1): void {
        if (this.stockSearchRequest?.isLoading) {
            return;
        }

        let stockSearchRequest = this.vouchersUtilityService.getSearchRequestObject(this.inputData.voucherType, query, page, SearchType.ITEM);
        this.stockSearchRequest = cloneDeep(stockSearchRequest);
        this.stockSearchRequest.isLoading = true;

        this.searchService.searchAccountV3(stockSearchRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body?.results?.length) {
                this.stockSearchRequest.loadMore = true;
                let stockResults = [];
                if (page > 1) {
                    this.stockResults$.subscribe(res => stockResults = res);
                }
                const newResults = response?.body?.results?.map(result => {
                    return {
                        rate: 0,
                        stockUnitCode: '',
                        uniqueName: result.stock ? `${result?.uniqueName}#${result.stock?.uniqueName}` : result?.uniqueName,
                        name: result.stock ? `${result.name} (${result.stock.name})` : result.name,
                        additional: result
                    };
                }) || [];;
                this.stockResults$ = of(stockResults.concat(...newResults));
            } else {
                this.stockSearchRequest.loadMore = false;
            }
            this.stockSearchRequest.isLoading = false;
        });
    }

    /**
     * This will be use for add item
     *
     * @param {SalesAddBulkStockItems} item
     * @param {number} index
     * @return {*}  {void}
     * @memberof AddBulkItemsComponent
     */
    public addItem(item: SalesAddBulkStockItems, index: number): void {
        const dataArray = this.addBulkForm.get('data') as FormArray;
        const isAlreadySelected = dataArray?.value?.filter(data => data?.additional?.value === item.uniqueName);

        if (isAlreadySelected?.length || this.itemsInProcess[item.uniqueName]) {
            this.toaster.showSnackBar('warning', this.localeData?.item_selected);
            return;
        }

        let requestObject = {
            stockUniqueName: item.additional?.stock?.uniqueName ?? '',
            customerUniqueName: this.inputData.customerUniqueName
        };

        if (item?.additional?.hasVariants) {
            this.componentStore.getStockVariants({ q: item?.additional?.stock?.uniqueName, index: index });
        } else {
            this.itemsInProcess[item.uniqueName] = true;
            this.loadDetails(item, requestObject, index);
        }
    }

    /**
     * This will be use for load stock/variant details 
     *
     * @param {SalesAddBulkStockItems} item
     * @param {*} requestObject
     * @memberof AddBulkItemsComponent
     */
    public loadDetails(item: SalesAddBulkStockItems, requestObject: any, index: number): void {
        this.searchService.loadDetails(item.additional?.uniqueName, requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data && data.body) {
                // Take taxes of parent group and stock's own taxes
                const taxes = data.body.taxes || [];
                if (data.body.stock) {
                    taxes.push(...data.body.stock.taxes);
                }

                // directly assign additional property
                item.additional = {
                    ...item.additional,
                    label: item.additional?.name,
                    value: item?.uniqueName,
                    taxes: taxes,
                    currency: data.body.currency,
                    currencySymbol: data.body.currencySymbol,
                    stock: data.body.stock,
                    combinedUniqueName: data.body.stock?.variant ? `${item.uniqueName}#${data.body.stock.variant?.uniqueName}` : '',
                    skuCode: data.body.stock?.skuCode,
                    variants: this.stockVariants[index]
                };

                const unitRates = data.body?.stock?.variant?.unitRates ?? [];
                item.rate = unitRates?.length ? unitRates[0]?.rate : 0;
                item.quantity = 1;

                let itemFormGroup = this.getStockFormGroup(item);
                this.getDataControls.push(itemFormGroup);

                this.itemsInProcess[item.uniqueName] = false;
            }
        });
    }

    /**
     * This will be use for variant change
     *
     * @param {SalesAddBulkStockItems} item
     * @param {*} variant
     * @return {*}  {void}
     * @memberof AddBulkItemsComponent
     */
    public variantChanged(item: SalesAddBulkStockItems, variant: any, index: number): void {
        const dataArray = this.addBulkForm.get('data') as FormArray;
        const isAlreadySelected = dataArray?.value?.filter(data => data?.variantUniqueName === variant.value);
 
        if (isAlreadySelected?.length || this.itemsInProcess[item.uniqueName]) {
            this.toaster.showSnackBar('warning', this.localeData?.item_selected);
            return;
        }

        this.itemsInProcess[variant.value] = true;

        const requestObj = {
            stockUniqueName: item.additional?.stock?.uniqueName ?? '',
            variantUniqueName: variant.value,
            customerUniqueName: this.inputData.customerUniqueName
        };

        let selectedItem = cloneDeep(item);
        selectedItem.variant = { name: variant.label, uniqueName: variant.value };

        this.loadDetails(selectedItem, requestObj, index);
    }

    /**
     * Removes selected line
     *
     * @param {number} index
     * @memberof AddBulkItemsComponent
     */
    public deleteSelectedItem(index: number): void {
        const selectedItem = this.getDataControls;
        selectedItem.removeAt(index);
    }

    /**
     * This will be use for alter quantity
     *
     * @param {*} item
     * @param {string} [action='add']
     * @memberof AddBulkItemsComponent
     */
    public alterQuantity(item, action: string = 'add'): void {
        const quantityControl = item.get('quantity');
        let currentQuantity = quantityControl.value;

        if (action === 'add') {
            currentQuantity++;
        } else if (action === 'minus' && currentQuantity > 1) {
            currentQuantity--;
        }
        quantityControl.setValue(currentQuantity);
    }

    /**
     * Hook cycle for component destroy
     *
     * @memberof AddBulkItemsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Sends selected items to the parent module
     *
     * @memberof AddBulkItemsComponent
     */
    public saveBulkItems(): void {
        this.dialogRef.close(this.addBulkForm.value?.data);
    }
}