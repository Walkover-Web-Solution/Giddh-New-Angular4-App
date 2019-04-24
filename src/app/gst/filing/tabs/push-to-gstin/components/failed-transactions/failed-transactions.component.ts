import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Gstr1SummaryErrors } from '../../../../../../models/api-models/GstReconcile';

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
  public imgPath: string = '';

  public invoiceCount: number = 0;
  public voucherCount: number = 0;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {
    //
  }

  public ngOnInit() {
    this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
  }

  public pageChanged(event) {
    // this.request['page'] = event.page;
    // this._store.dispatch(this.gstrAction.GetReturnSummary(this.selectedGst, this.request));
  }

  /**
   * ngOnChnages
   */
  public ngOnChanges(s: SimpleChanges) {
    if (s['failedTransactions'].currentValue && s['failedTransactions'].currentValue && s['failedTransactions'].previousValue) {
      this.invoiceCount = this.failedTransactions.filter(f => f.type === 'INVOICE').length;
      this.voucherCount = this.failedTransactions.filter(f => f.type === 'VOUCHER').length;
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
