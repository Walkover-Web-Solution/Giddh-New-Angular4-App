import { Component, Inject, OnDestroy, OnInit, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { AddBulkItemsComponentStore } from "./utility/add-bulk-items.store";
import { VouchersUtilityService } from "../../vouchers/utility/vouchers.utility.service";
import { cloneDeep } from "../../lodash-optimized";
import { SearchService } from "../../services/search.service";
import { Observable, ReplaySubject, debounceTime, of, takeUntil, BehaviorSubject } from "rxjs";
import { OptionInterface } from "../../models/api-models/Voucher";
import { SearchType } from "../../vouchers/utility/vouchers.const";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { SalesAddBulkStockItems } from "../../models/api-models/Sales";
import { ToasterService } from "../../services/toaster.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GiddhNumberFormatPipe } from "../../shared/helpers/pipes/number-format/number-format.pipe";

@Component({
    selector: "add-bulk-items",
    templateUrl: "./add-bulk-items.component.html",
    styleUrls: ["./add-bulk-items.component.scss"],
    providers: [AddBulkItemsComponentStore],
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false
})
export class AddBulkItemsComponent implements OnInit, OnDestroy {
    /** Stock search request */
    public stockSearchRequest: any;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stock results Observable */
    public stockResults$: BehaviorSubject<OptionInterface[]> = new BehaviorSubject<OptionInterface[]>([]);
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
    /** Current focused item index for keyboard navigation */
    private currentFocusIndex: number = 0;
    /** Total number of focusable items */
    private totalFocusableItems: number = 0;

    constructor(
        private vouchersUtilityService: VouchersUtilityService,
        private searchService: SearchService,
        private formBuilder: FormBuilder,
        private toaster: ToasterService,
        private componentStore: AddBulkItemsComponentStore,
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>,
        private giddhCurrencyPipe: GiddhNumberFormatPipe,
        private changeDetectorRef: ChangeDetectorRef
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
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    /**
     * Handles global escape key press to close the dialog
     *
     * @memberof AddBulkItemsComponent
     */
    public handleGlobalEscape(): void {
        this.dialogRef?.close();
    }

    /**
     * Handles escape key press on individual list elements
     *
     * @param {KeyboardEvent} event - The keyboard event
     * @memberof AddBulkItemsComponent
     */
    public handleEscapeKey(event: KeyboardEvent): void {
        event.preventDefault();
        event.stopPropagation();
        // Remove focus from current element and close dialog
        (event.target as HTMLElement)?.blur();
        this.dialogRef?.close();
    }

    /**
     * Handles arrow key navigation for list items when focus is within the list area
     *
     * @param {KeyboardEvent} event - The keyboard event
     * @memberof AddBulkItemsComponent
     */
    @HostListener('keydown', ['$event'])
    public handleKeyboardNavigation(event: KeyboardEvent): void {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            // Check if the focus is within the list area
            const target = event.target as HTMLElement;
            const listContainer = target.closest('.list-viewport') || target.closest('mat-list-item');

            if (listContainer) {
                event.preventDefault();
                event.stopPropagation();

                const direction = event.key === 'ArrowDown' ? 1 : -1;
                this.navigateList(direction);
            }
        }
    }

    /**
     * Navigates through the list items using arrow keys
     *
     * @param {number} direction - Direction to navigate (1 for down, -1 for up)
     * @memberof AddBulkItemsComponent
     */
    public navigateList(direction: number): void {
        const listContainer = document.querySelector('.list-viewport');
        if (!listContainer) return;

        const focusableElements = listContainer.querySelectorAll('mat-list-item[role="button"]');
        this.totalFocusableItems = focusableElements.length;

        if (this.totalFocusableItems === 0) return;

        // Calculate new focus index
        this.currentFocusIndex += direction;

        // Handle wrapping
        if (this.currentFocusIndex >= this.totalFocusableItems) {
            this.currentFocusIndex = 0; // Wrap to first item
        } else if (this.currentFocusIndex < 0) {
            this.currentFocusIndex = this.totalFocusableItems - 1; // Wrap to last item
        }

        // Update tabindex and focus
        this.updateFocusStates(focusableElements);
        (focusableElements[this.currentFocusIndex] as HTMLElement)?.focus();
    }

    /**
     * Updates tabindex attributes for proper keyboard navigation
     *
     * @param {NodeListOf<Element>} elements - List of focusable elements
     * @memberof AddBulkItemsComponent
     */
    private updateFocusStates(elements: NodeListOf<Element>): void {
        elements.forEach((element, index) => {
            if (index === this.currentFocusIndex) {
                element.setAttribute('tabindex', '0');
            } else {
                element.setAttribute('tabindex', '-1');
            }
        });
    }

    /**
     * Handles item click and updates current focus index
     *
     * @param {SalesAddBulkStockItems} item - The selected item
     * @param {number} index - The index of the clicked item
     * @memberof AddBulkItemsComponent
     */
    public onItemClick(item: SalesAddBulkStockItems, index: number): void {
        this.currentFocusIndex = index;
        this.addItem(item, index);
    }

    /**
     * Handles variant click and updates focus
     *
     * @param {SalesAddBulkStockItems} item - The parent item
     * @param {any} variant - The selected variant
     * @param {number} index - The index of the parent item
     * @memberof AddBulkItemsComponent
     */
    public onVariantClick(item: SalesAddBulkStockItems, variant: any, index: number): void {
        // Find the actual index of the variant in the flattened list
        const listContainer = document.querySelector('.list-viewport');
        if (listContainer) {
            const focusableElements = listContainer.querySelectorAll('mat-list-item[role="button"]');
            const variantElement = Array.from(focusableElements).find(el =>
                el.textContent?.trim() === variant?.label
            );
            if (variantElement) {
                this.currentFocusIndex = Array.from(focusableElements).indexOf(variantElement);
            }
        }
        this.variantChanged(item, variant, index);
    }

    /**
     * TrackBy function for stock items to improve virtual scrolling performance
     *
     * @param {number} index - The index of the item
     * @param {OptionInterface} item - The stock item
     * @returns {string} Unique identifier for the item
     * @memberof AddBulkItemsComponent
     */
    public trackByStockItem(index: number, item: OptionInterface): string {
        return item?.value || index.toString();
    }

    /**
     * Initializes the focus state for keyboard navigation
     *
     * @memberof AddBulkItemsComponent
     */
    public initializeFocusState(): void {
        const listContainer = document.querySelector('.list-viewport');
        if (!listContainer) return;

        const focusableElements = listContainer.querySelectorAll('mat-list-item[role="button"]');
        this.totalFocusableItems = focusableElements.length;
        this.currentFocusIndex = 0;

        // Set initial tabindex states
        this.updateFocusStates(focusableElements);
    }

    /**
     * Focuses the next available element in the list after selection
     *
     * @param {HTMLElement} currentElement - The currently focused element
     * @memberof AddBulkItemsComponent
     */
    public focusNextElement(currentElement: HTMLElement): void {
        setTimeout(() => {
            // Find the next focusable element in the list
            const listContainer = currentElement.closest('.list-viewport');
            if (listContainer) {
                const focusableElements = listContainer.querySelectorAll('[tabindex="0"]');
                const currentIndex = Array.from(focusableElements).indexOf(currentElement);
                if (currentIndex >= 0 && currentIndex < focusableElements.length - 1) {
                    // Focus next element
                    (focusableElements[currentIndex + 1] as HTMLElement)?.focus();
                } else if (focusableElements.length > 0) {
                    // If at the end, focus the first element
                    (focusableElements[0] as HTMLElement)?.focus();
                }
            }
        }, 100);
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
                    stockResults = this.stockResults$.value;
                }
                const newResults = response?.body?.results?.map(result => {
                    return {
                        rate: 0,
                        stockUnitCode: '',
                        uniqueName: result.stock ? `${result?.uniqueName}#${result.stock?.uniqueName}` : result?.uniqueName,
                        name: result.stock ? `${result.name} (${result.stock.name})` : result.name,
                        additional: result
                    };
                }) || [];
                this.stockResults$.next(stockResults.concat(...newResults));
            } else {
                this.stockSearchRequest.loadMore = false;
                // Clear results when no data is found for new search (page 1)
                if (page === 1) {
                    this.stockResults$.next([]);
                }
            }
            this.stockSearchRequest.isLoading = false;
            this.changeDetectorRef.detectChanges();
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

                let baseRate: number;
                if (data.body.stock?.variant?.unitRates?.length) {
                    baseRate = this.getRateByUnit(data.body.stock.variant.unitRates[0]?.stockUnitUniqueName, data.body.stock.variant.unitRates) || 0;
                } else {
                    baseRate = data.body.stock?.rate || 0;
                }
                const exchangeRateValue = this.inputData.exchangeRate ?? 1;
                const rate = Number((baseRate / exchangeRateValue).toFixed(this.inputData.highPrecisionRate));
                item.rate = this.giddhCurrencyPipe.transform(rate);
                item.quantity = 1;

                let itemFormGroup = this.getStockFormGroup(item);
                this.getDataControls.push(itemFormGroup);

                this.itemsInProcess[item.uniqueName] = false;
                this.changeDetectorRef.detectChanges();
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

    /**
    * Get rate by unit
    *
    * @param {string} stockUnitUniqueName
    * @param {any[]} unitRates
    * @returns {number}
    * @memberof AddBulkItemsComponent
    */
    private getRateByUnit(stockUnitUniqueName: string, unitRates: any[]): number {
        return unitRates.find((unitRate) => unitRate.stockUnitUniqueName === stockUnitUniqueName || unitRate.stockUnitCode === stockUnitUniqueName)?.rate;
    }
}
