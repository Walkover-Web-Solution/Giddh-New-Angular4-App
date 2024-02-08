import { Component, Input, OnDestroy, OnInit } from "@angular/core";
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

@Component({
    selector: "add-bulk-items",
    templateUrl: "./add-bulk-items.component.html",
    styleUrls: ["./add-bulk-items.component.scss"],
    providers: [AddBulkItemsComponentStore]
})
export class AddBulkItemsComponent implements OnInit, OnDestroy {
    /** Holds current voucher type */
    @Input() public voucherType: string;
    /** Account search request */
    @Input() public stockSearchRequest: any;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Voucher account results Observable */
    public voucherStockResults$: Observable<OptionInterface[]> = of(null);
    /** Form Group for invoice form */
    public addBulkForm: FormGroup;
    /** Hold selected items */
    public selectedItems: SalesAddBulkStockItems[] = [];
    /** List of stock variants */
    public stockVariants: any[] = [];

    constructor(
        private vouchersUtilityService: VouchersUtilityService,
        private searchService: SearchService,
        private formBuilder: FormBuilder,
        private toaster: ToasterService,
        private componentStore: AddBulkItemsComponentStore,
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

        /** Stock Variants */
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
     * This will be use for return item
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
            customerUniqueName: ["sales"],
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
    public get dataControls(): FormArray {
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

        let stockSearchRequest = this.vouchersUtilityService.getSearchRequestObject(this.voucherType, query, page, SearchType.ITEM);
        this.stockSearchRequest = cloneDeep(stockSearchRequest);
        this.stockSearchRequest.isLoading = true;

        this.searchService.searchAccountV3(stockSearchRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body?.results?.length) {
                this.stockSearchRequest.loadMore = true;
                let voucherStockResults = [];
                if (page > 1) {
                    this.voucherStockResults$.subscribe(res => voucherStockResults = res);
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
                this.voucherStockResults$ = of(voucherStockResults.concat(...newResults));
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
        let selectedIndex;
        if (!item.additional.stock) {
            selectedIndex = this.selectedItems?.findIndex(f => f?.uniqueName === item?.uniqueName);
        } else {
            if (item.variants?.length === 1) {
                const variant = item.variants[0];
                selectedIndex = this.selectedItems?.findIndex(f => f.additional.combinedUniqueName === `${item.uniqueName}#${variant.value}`);
            }
        }
        if (selectedIndex > -1) {
            this.toaster.warningToast('Stock is already selected');
            return;
        }
        let requestObject = {
            stockUniqueName: item.additional?.stock?.uniqueName ?? '',
            customerUniqueName: 'sales'
        };
        if (item?.additional?.stock?.uniqueName) {
            this.componentStore.getStockVariants({ q: item?.additional?.stock?.uniqueName, index: index });
        } else {
            this.loadDetails(item, requestObject);
        }
    }

    /**
     * This will be use for load stock/variant details 
     *
     * @param {SalesAddBulkStockItems} item
     * @param {*} requestObject
     * @memberof AddBulkItemsComponent
     */
    public loadDetails(item: SalesAddBulkStockItems, requestObject: any): void {
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
                    label: item.name,
                    value: item?.uniqueName,
                    applicableTaxes: taxes,
                    currency: data.body.currency,
                    currencySymbol: data.body.currencySymbol,
                    email: data.body.emails,
                    isFixed: data.body.isFixed,
                    mergedAccounts: data.body.mergedAccounts,
                    mobileNo: data.body.mobileNo,
                    nameStr: item.additional && item.additional.parentGroups ? item.additional.parentGroups.map(parent => parent.name).join(', ') : '',
                    stock: data.body.stock,
                    uNameStr: item.additional && item.additional.parentGroups ? item.additional.parentGroups.map(parent => parent?.uniqueName).join(', ') : '',
                    category: data.body.category,
                    combinedUniqueName: data.body.stock?.variant ? `${item.uniqueName}#${data.body.stock.variant?.uniqueName}` : '',
                    skuCode: data.body.stock?.skuCode,
                };
                const unitRates = data.body?.stock?.variant?.unitRates ?? [];
                item.rate = unitRates[0]?.rate ?? 0;
                item.quantity = 1;
                if (!data.body.stock || item.variants?.length === 1 || item.variant?.uniqueName) {
                    this.selectedItems = [...this.selectedItems, item];
                }
                // Patch values directly to the form controls
                const itemFormGroup = this.getStockFormGroup(item);
                console.log(itemFormGroup.value);
                this.dataControls.push(itemFormGroup);
            }
        });
    }

    /**
     * This will be use for variant change
     *
     * @param {SalesAddBulkStockItems} item
     * @param {*} event
     * @return {*}  {void}
     * @memberof AddBulkItemsComponent
     */
    public variantChanged(item: SalesAddBulkStockItems, event: any): void {
        let selectedItem = cloneDeep(item);
        selectedItem.variant = { name: event.label, uniqueName: event.value };
        // const index = this.selectedItems?.findIndex(f => f.additional.combinedUniqueName === `${selectedItem.uniqueName}#${event.value}`);
        // if (index > -1) {
        //     this.toaster.warningToast("Variant is already selected");
        //     return;
        // }
        const requestObj = {
            stockUniqueName: selectedItem.additional?.stock?.uniqueName ?? '',
            variantUniqueName: event.value,
            customerUniqueName: 'sales'
        };
        this.loadDetails(selectedItem, requestObj);
    }


    /**
     * Removes selected line
     *
     * @param {number} index
     * @memberof AddBulkItemsComponent
     */
    public deleteLineEntry(index: number): void {
        const selectedItem = this.dataControls;
        selectedItem.removeAt(index);
    }

    /**
     * This will be use for alter quantity
     *
     * @param {SalesAddBulkStockItems} item
     * @param {('plus' | 'minus')} [mode='plus']
     * @return {*}  {void}
     * @memberof AddBulkItemsComponent
     */
    public alterQuantity(item: SalesAddBulkStockItems, mode: 'plus' | 'minus' = 'plus'): void {
        if (mode === 'plus') {
            item.quantity++;
        } else {
            if (item.quantity === 1) {
                return;
            }
            item.quantity--;
        }
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

}