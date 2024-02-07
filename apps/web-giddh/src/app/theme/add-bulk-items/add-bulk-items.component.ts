import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { AddBulkItemsComponentStore } from "./utility/add-bulk-items.store";
import { VouchersUtilityService } from "../../vouchers/utility/vouchers.utility.service";
import { cloneDeep } from "../../lodash-optimized";
import { SearchService } from "../../services/search.service";
import { Observable, ReplaySubject, of, takeUntil } from "rxjs";
import { OptionInterface } from "../../models/api-models/Voucher";
import { SearchType } from "../../vouchers/utility/vouchers.const";

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


    constructor(private vouchersUtilityService: VouchersUtilityService, private searchService: SearchService,) { }

    public ngOnInit(): void {
        this.searchStock();
    }

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
                const newResults = response?.body?.results?.map(res => { return { label: res.name, value: res.uniqueName, additional: res } });
                this.voucherStockResults$ = of(voucherStockResults.concat(...newResults));
            } else {
                this.stockSearchRequest.loadMore = false;
            }
            this.stockSearchRequest.isLoading = false;
        });
    }

    public ngOnDestroy(): void {

    }

}