import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Gstr1SummaryErrors } from '../../../../../../models/api-models/GstReconcile';
import { orderBy } from '../../../../../../lodash-optimized';
import { PageEvent } from '@angular/material/paginator';
import { DROPDOWN_ITEMS_COUNT_LIMIT, PAGE_SIZE_OPTIONS } from '../../../../../../app.constant';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'failed-transactions',
    templateUrl: './failed-transactions.component.html',
    styleUrls: ['failed-transactions.component.scss'],
    standalone: false
})
export class FailedTransactionsComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public failedTransactions: Gstr1SummaryErrors[] = [];
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public filteredTransactions: Gstr1SummaryErrors[] = [];
    public imgPath: string = '';

    public itemsPerPage: number = DROPDOWN_ITEMS_COUNT_LIMIT;
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(@Inject(ServiceConfig) private serviceConfig ) {

    }

    public ngOnInit() {
        this.imgPath = this.serviceConfig.IMG_PATH;
    }

    /**
     * ngOnChnages
     */
    public ngOnChanges(s: SimpleChanges) {
        if (s['failedTransactions']?.currentValue && s['failedTransactions']?.currentValue !== s['failedTransactions']?.previousValue) {
            this.handlePageEvent({ pageIndex: 0, pageSize: this.itemsPerPage, length: this.failedTransactions?.length });
        }
    }

    public sortBy(col: string, order: string) {
        this.filteredTransactions = orderBy(this.filteredTransactions, [col], [order]);
    }


    /**
     * Handles pagination events for failed transactions
     *
     * @param {PageEvent} event - Contains pagination details
     * @memberof FailedTransactionsComponent
     */
    public handlePageEvent(event: PageEvent): void {
        this.itemsPerPage = event.pageSize;
        let startIndex = event.pageIndex * this.itemsPerPage;
        let endIndex = Math.min(startIndex + this.itemsPerPage - 1, this.failedTransactions?.length - 1);
        this.filteredTransactions = this.failedTransactions?.slice(startIndex, endIndex + 1);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
