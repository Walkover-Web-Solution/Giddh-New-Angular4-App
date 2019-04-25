import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Gstr1SummaryErrors } from '../../../../../../models/api-models/GstReconcile';
import { orderBy } from '../../../../../../lodash-optimized';
import { PageChangedEvent } from 'ngx-bootstrap';

@Component({
  selector: 'failed-transactions',
  templateUrl: './failed-transactions.component.html',
  styles: [`
    #content_wrapper {
      padding-bottom: 0px !important;
    }
  `],
  styleUrls: ['failed-transactions.component.css'],
})
export class FailedTransactionsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public failedTransactions: Gstr1SummaryErrors[] = [];
  public filteredTransactions: Gstr1SummaryErrors[] = [];
  public imgPath: string = '';

  public invoiceCount: number = 0;
  public voucherCount: number = 0;
  public itemsPerPage: number = 10;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {
    //
  }

  public ngOnInit() {
    this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
  }

  /**
   * ngOnChnages
   */
  public ngOnChanges(s: SimpleChanges) {
    if (s['failedTransactions'].currentValue && s['failedTransactions'].currentValue !== s['failedTransactions'].previousValue) {
      this.pageChanged({page: 1, itemsPerPage: this.itemsPerPage});
      this.invoiceCount = this.failedTransactions.filter(f => f.type === 'INVOICE').length;
      this.voucherCount = this.failedTransactions.filter(f => f.type === 'VOUCHER').length;
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
