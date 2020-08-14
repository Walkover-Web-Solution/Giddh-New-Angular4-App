import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { fromEvent, ReplaySubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { SalesAddBulkStockItems, VoucherTypeEnum } from '../../../models/api-models/Sales';
import { ToasterService } from '../../../services/toaster.service';
import { SearchService } from '../../../services/search.service';

@Component({
    selector: 'proforma-add-bulk-items-component',
    templateUrl: './proforma-add-bulk-items.component.html',
    styleUrls: [`./proforma-add-bulk-items.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProformaAddBulkItemsComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public invoiceType: string;

    @ViewChild('searchElement') public searchElement: ElementRef;
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

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private toaster: ToasterService,
        private searchService: SearchService
    ) {
    }

    ngOnInit() {
        fromEvent(this.searchElement.nativeElement, 'input').pipe(
            debounceTime(700),
            distinctUntilChanged(),
            map((e: any) => e.target.value),
            takeUntil(this.destroyed$)
        ).subscribe((res: string) => {
            // this.filteredData = this.normalData.filter(item => {
            // 	return item.name.toLowerCase().includes(res.toLowerCase()) || item.uniqueName.toLowerCase().includes(res.toLowerCase());
            // });
            if (res && res.length > 1) {
                this.onSearchQueryChanged(res, 1);
            }
        });

        // this.parseDataToDisplay(this.data);
    }

    /**
     * Search query change handler
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @memberof ProformaAddBulkItemsComponent
     */
    public onSearchQueryChanged(query: string, page: number = 1) {
        this.searchResultsPaginationData.query = query;
        const requestObject = this.getSearchRequestObject(query, page);
        this.searchAccount(requestObject).subscribe(data => {
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
     * @memberof ProformaAddBulkItemsComponent
     */
    public searchAccount(requestObject: any): Observable<any> {
        return this.searchService.searchAccount(requestObject);
    }

    /**
     * Prepares the search list when the data is received
     *
     * @param {*} results Search results
     * @param {number} [currentPage=1] Current page requested
     * @memberof ProformaAddBulkItemsComponent
     */
    public prepareSearchLists(results: any, currentPage: number = 1): void {
        const searchResults = results.map(result => {
            return {
                rate: 0,
                stockUnitCode: '',
                uniqueName: result.stock ? `${result.uniqueName}#${result.stock.uniqueName}` : result.uniqueName,
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
     * @memberof ProformaAddBulkItemsComponent
     */
    public getSearchRequestObject(query: string, page: number = 1): any {
        let group = (this.invoiceType === VoucherTypeEnum.debitNote || this.invoiceType === VoucherTypeEnum.purchase) ?
            'operatingcost, indirectexpenses' : 'otherincome, revenuefromoperations';
        const requestObject = {
            q: query,
            page,
            withStocks: true,
            group: encodeURIComponent(group)
        };
        return requestObject;
    }

    parseDataToDisplay(data: IOption[]) {
        let arr: SalesAddBulkStockItems[] = [];

        data
            .filter(f => f.additional && f.additional.stock)
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
            this.toaster.warningToast('this item is already selected please increase it\'s quantity');
            return;
        }
        let requestObject = {
            stockUniqueName: item.additional.stock.uniqueName
        };
        this.searchService.loadDetails(item.additional.uniqueName, requestObject).subscribe(data => {
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
        }, () => {});
    }

    removeSelectedItem(uniqueName: string) {
        this.selectedItems = this.selectedItems.filter(f => f.uniqueName !== uniqueName);
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
     * @memberof ProformaAddBulkItemsComponent
     */
    onScrollEnd(): void {
        if (this.searchResultsPaginationData.page < this.searchResultsPaginationData.totalPages) {
            this.onSearchQueryChanged(this.searchResultsPaginationData.query, this.searchResultsPaginationData.page + 1);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        //
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
