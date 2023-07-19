import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { fromEvent, ReplaySubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { SalesAddBulkStockItems, VoucherTypeEnum } from '../../models/api-models/Sales';
import { SearchService } from '../../services/search.service';
import { ToasterService } from '../../services/toaster.service';
import { LedgerService } from '../../services/ledger.service';
import { IVariant } from '../../models/api-models/Ledger';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { GeneralService } from '../../services/general.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
    selector: 'voucher-add-bulk-items-component',
    templateUrl: './voucher-add-bulk-items.component.html',
    styleUrls: [`./voucher-add-bulk-items.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class VoucherAddBulkItemsComponent implements OnDestroy {
    @Input() public invoiceType: string;

    @ViewChild('searchElement', { static: false }) public searchElement: ElementRef;
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();
    @Output() public saveItemsEvent: EventEmitter<SalesAddBulkStockItems[]> = new EventEmitter();
    /** Instance of cdk virtual scroller */
    @ViewChildren(CdkVirtualScrollViewport) virtualScroll: QueryList<CdkVirtualScrollViewport>;

    public normalData: SalesAddBulkStockItems[] = [];
    public filteredData: SalesAddBulkStockItems[] = [];
    public selectedItems: SalesAddBulkStockItems[] = [];
    /** True, if API is in progress, required to avoid multiple addition of same stock */
    private isLoading: boolean;

    /** Stores the search results pagination details */
    private searchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private toaster: ToasterService,
        private searchService: SearchService,
        private ledgerService: LedgerService,
        private generalService: GeneralService
    ) {
    }

    /**
     * Search query change handler
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @memberof VoucherAddBulkItemsComponent
     */
    public onSearchQueryChanged(query: string, page: number = 1): void {
        this.searchResultsPaginationData.query = query;
        const requestObject = this.getSearchRequestObject(query, page);
        this.searchAccount(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data && data.body && data.body.results) {
                this.prepareSearchLists(data.body.results, page);
                this.searchResultsPaginationData.page = data.body.page;
                this.searchResultsPaginationData.totalPages = data.body.totalPages;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    /**
     * Searches account
     *
     * @param {*} requestObject Request payload for search API
     * @returns {Observable<any>} Observable to carry out further operations
     * @memberof VoucherAddBulkItemsComponent
     */
    public searchAccount(requestObject: any): Observable<any> {
        return this.searchService.searchAccount(requestObject);
    }

    /**
     * Prepares the search list when the data is received
     *
     * @param {*} results Search results
     * @param {number} [currentPage=1] Current page requested
     * @memberof VoucherAddBulkItemsComponent
     */
    public prepareSearchLists(results: any, currentPage: number = 1): void {
        const searchResults = results.map(result => {
            return {
                rate: 0,
                stockUnitCode: '',
                uniqueName: result.stock ? `${result?.uniqueName}#${result.stock?.uniqueName}` : result?.uniqueName,
                name: result.stock ? `${result.name} (${result.stock.name})` : result.name,
                additional: result
            };
        }) || [];
        if (currentPage === 1) {
            this.filteredData = searchResults;
        } else {
            this.filteredData = [
                ...this.filteredData,
                ...searchResults
            ];
        }
    }

    /**
     * Returns the search request object
     *
     * @param {string} query Search Query
     * @param {number} [page=1]
     * @returns {*}
     * @memberof VoucherAddBulkItemsComponent
     */
    public getSearchRequestObject(query: string, page: number = 1): any {
        let group = (this.invoiceType === VoucherTypeEnum.debitNote || this.invoiceType === VoucherTypeEnum.purchase) ?
            `operatingcost, indirectexpenses${this.generalService.voucherApiVersion === 2 ? ', fixedassets' : ''}` : `otherincome, revenuefromoperations${this.generalService.voucherApiVersion === 2 ? ', fixedassets' : ''}`;
        const requestObject = {
            q: encodeURIComponent(query),
            page,
            withStocks: true,
            group: encodeURIComponent(group)
        };
        return requestObject;
    }

    public addItemToSelectedArr(item: SalesAddBulkStockItems) {
        let index;
        if (!item.additional.stock || this.generalService.voucherApiVersion === 1) {
            index = this.selectedItems?.findIndex(f => f?.uniqueName === item?.uniqueName);
        } else {
            if (this.generalService.voucherApiVersion === 2 && item.variants?.length === 1) {
                const variant = item.variants[0];
                index = this.selectedItems?.findIndex(f => f.additional.combinedUniqueName === `${item.uniqueName}#${variant.value}`);
            }
        }
        if (index > -1) {
            this.toaster.warningToast(this.localeData?.item_selected);
            return;
        }
        let requestObject = {
            stockUniqueName: item.additional?.stock?.uniqueName ?? ''
        };
        if (item.additional.stock) {
            this.loadStockVariants(item);
        } else {
            this.loadDetails(item, requestObject);
        }
    }

    public removeSelectedItem(uniqueName: string) {
        this.selectedItems = this.selectedItems?.filter(f => f?.uniqueName !== uniqueName && f?.additional.combinedUniqueName !== uniqueName);
    }

    public alterQuantity(item: SalesAddBulkStockItems, mode: 'plus' | 'minus' = 'plus') {
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
     * Scroll to bottom handler
     *
     * @memberof VoucherAddBulkItemsComponent
     */
    public onScrollEnd(): void {
        if (this.searchResultsPaginationData.page < this.searchResultsPaginationData.totalPages) {
            this.onSearchQueryChanged(this.searchResultsPaginationData.query, this.searchResultsPaginationData.page + 1);
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof VoucherAddBulkItemsComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.onSearchQueryChanged('');

            setTimeout(() => {
                fromEvent(this.searchElement?.nativeElement, 'input').pipe(
                    debounceTime(700),
                    distinctUntilChanged(),
                    map((e: any) => e.target?.value),
                    takeUntil(this.destroyed$)
                ).subscribe((res: string) => {
                    this.onSearchQueryChanged(res, 1);
                });
            }, 100);
        }
    }

    /**
     * Loads the details of selected entry
     *
     * @private
     * @param {SalesAddBulkStockItems} item Item details
     * @param {*} requestObject Request object for the API
     * @memberof VoucherAddBulkItemsComponent
     */
    private loadDetails(item: SalesAddBulkStockItems, requestObject: any): void {
        if (!this.isLoading) {
            this.isLoading = true;
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
                        this.selectedItems.unshift({ ...item });
                    }
                    this.isLoading = false;
                    this.changeDetectorRef.detectChanges();
                }
            }, () => {
                this.isLoading = false;
             });
        }
    }

    /**
     * Loads the stock variants
     *
     * @private
     * @param {SalesAddBulkStockItems} item Item details
     * @memberof VoucherAddBulkItemsComponent
     */
    private loadStockVariants(item: SalesAddBulkStockItems): void {
        this.ledgerService.loadStockVariants(item.additional?.stock?.uniqueName).pipe(
            map((variants: IVariant[]) => variants.map((variant: IVariant) => ({label: variant.name, value: variant.uniqueName})))).subscribe(res => {
                item.variants = res;
                if (res.length === 1) {
                    // Single variant stock, add to list after loading details
                    const defaultVariant: IVariant = {name: res[0].label, uniqueName: res[0].value};
                    item.variant = defaultVariant;
                    const requestObj = {
                        stockUniqueName: item.additional?.stock?.uniqueName ?? '',
                        variantUniqueName: defaultVariant.uniqueName
                    };
                    if (item.variants?.length === 1) {
                        const variant = item.variants[0];
                        const index = this.selectedItems?.findIndex(f => f.additional.combinedUniqueName === `${item.uniqueName}#${variant.value}`);
                        if (index > -1) {
                            this.toaster.warningToast(this.localeData?.item_selected);
                            return;
                        }
                    }
                    this.loadDetails(item, requestObj);
                }
                this.changeDetectorRef.detectChanges();
            });
    }

    /**
     * Variant change handler
     *
     * @param {SalesAddBulkStockItems} item Item details
     * @param {IOption} event Variant changed event
     * @memberof VoucherAddBulkItemsComponent
     */
    public variantChanged(item: SalesAddBulkStockItems, event: IOption): void {
        item.variant = {name: event.label, uniqueName: event.value};
        const index = this.selectedItems?.findIndex(f => f.additional.combinedUniqueName === `${item.uniqueName}#${event.value}`);
        if (index > -1) {
            this.toaster.warningToast(this.localeData?.item_selected);
            return;
        }
        const requestObj = {
            stockUniqueName: item.additional?.stock?.uniqueName ?? '',
            variantUniqueName: event.value
        };
        this.loadDetails(item, requestObj);
    }
}
