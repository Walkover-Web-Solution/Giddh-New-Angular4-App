import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Gstr1SummaryErrors } from '../../../../../../models/api-models/GstReconcile';
import { orderBy } from '../../../../../../lodash-optimized';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'failed-transactions',
    templateUrl: './failed-transactions.component.html',
    styleUrls: ['failed-transactions.component.scss'],
})
export class FailedTransactionsComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public failedTransactions: Gstr1SummaryErrors[] = [];
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public filteredTransactions: Gstr1SummaryErrors[] = [];
    public imgPath: string = '';

    public itemsPerPage: number = 10;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor() {

    }

    public ngOnInit() {
        this.imgPath = isElectron ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';
    }

    /**
     * ngOnChnages
     */
    public ngOnChanges(s: SimpleChanges) {
        if (s['failedTransactions']?.currentValue && s['failedTransactions']?.currentValue !== s['failedTransactions']?.previousValue) {
            this.pageChanged({ page: 1, itemsPerPage: this.itemsPerPage });
        }
    }

    public sortBy(col: string, order: string) {
        this.filteredTransactions = orderBy(this.filteredTransactions, [col], [order]);
    }


    public pageChanged(event: PageChangedEvent) {
        let startIndex = (event.page - 1) * this.itemsPerPage;
        let endIndex = Math.min(startIndex + this.itemsPerPage - 1, this.failedTransactions.length - 1);
        this.filteredTransactions = this.failedTransactions.slice(startIndex, endIndex + 1);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
