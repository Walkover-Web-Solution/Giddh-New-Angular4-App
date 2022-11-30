import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { fromEvent, ReplaySubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { SalesAddBulkStockItems, VoucherTypeEnum } from '../../models/api-models/Sales';
import { SearchService } from '../../services/search.service';
import { ToasterService } from '../../services/toaster.service';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
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

    public normalData: SalesAddBulkStockItems[] = [];
    public filteredData: SalesAddBulkStockItems[] = [];
    public selectedItems: SalesAddBulkStockItems[] = [];

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
        private searchService: SearchService
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
                uniqueName: result.stock ? `${result.uniqueName}#${result.stock?.uniqueName}` : result.uniqueName,
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
            'operatingcost, indirectexpenses' : 'otherincome, revenuefromoperations';
        const requestObject = {
            q: encodeURIComponent(query),
            page,
            withStocks: true,
            group: encodeURIComponent(group)
        };
        return requestObject;
    }

    parseDataToDisplay(data: IOption[]) {
        let arr: SalesAddBulkStockItems[] = [];

        data
            ?.filter(f => f.additional && f.additional.stock)
            .forEach(option => {
                let item = new SalesAddBulkStockItems();
                item.name = option.label;
                item.uniqueName = option.value;
                item.rate = 0;

                if (option.additional.stock.accountStockDetails.unitRates && option.additional.stock.accountStockDetails.unitRates.length) {
                    item.rate = option.additional.stock.accountStockDetails.unitRates[0].rate;
                    item.stockUnitCode = option.additional.stock.accountStockDetails.unitRates[0].stockUnitCode;
                }
                arr.push(item);
            });

        this.normalData = arr;
        this.filteredData = arr;
    }

    addItemToSelectedArr(item: SalesAddBulkStockItems) {
        let index = this.selectedItems.findIndex(f => f.uniqueName === item.uniqueName);
        if (index > -1) {
            this.toaster.warningToast(this.localeData?.item_selected);
            return;
        }
        let requestObject = {
            stockUniqueName: item.additional && item.additional.stock ? item.additional.stock.uniqueName : ''
        };
        this.searchService.loadDetails(item.additional.uniqueName, requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
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
                    value: item.uniqueName,
                    applicableTaxes: taxes,
                    currency: data.body.currency,
                    currencySymbol: data.body.currencySymbol,
                    email: data.body.emails,
                    isFixed: data.body.isFixed,
                    mergedAccounts: data.body.mergedAccounts,
                    mobileNo: data.body.mobileNo,
                    nameStr: item.additional && item.additional.parentGroups ? item.additional.parentGroups.map(parent => parent.name).join(', ') : '',
                    stock: data.body.stock,
                    uNameStr: item.additional && item.additional.parentGroups ? item.additional.parentGroups.map(parent => parent.uniqueName).join(', ') : '',
                };
                item.rate = data.body.stock ? data.body.stock.rate || 0 : 0;
                item.quantity = 1;
                this.selectedItems.push({ ...item });
                this.changeDetectorRef.detectChanges();
            }
        }, () => { });
    }

    removeSelectedItem(uniqueName: string) {
        this.selectedItems = this.selectedItems?.filter(f => f.uniqueName !== uniqueName);
    }

    alterQuantity(item: SalesAddBulkStockItems, mode: 'plus' | 'minus' = 'plus') {
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
    onScrollEnd(): void {
        if (this.searchResultsPaginationData.page < this.searchResultsPaginationData.totalPages) {
            this.onSearchQueryChanged(this.searchResultsPaginationData.query, this.searchResultsPaginationData.page + 1);
        }
    }

    ngOnDestroy(): void {
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
                    map((e: any) => e.target.value),
                    takeUntil(this.destroyed$)
                ).subscribe((res: string) => {
                    if (res) {
                        this.onSearchQueryChanged(res, 1);
                    }
                });
            }, 100);
        }
    }
}
