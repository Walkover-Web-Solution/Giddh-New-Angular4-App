import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { AppState } from 'app/store';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { GstReconcileService } from 'app/services/GstReconcile.service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { NilSummaryResponse } from 'app/store/GstR/GstR.reducer';
import { takeUntil } from 'rxjs/operators';

export const requestParam = {
      period: '',
      gstin: '',
      gstReturnType: 'failedtransactions',
      page: 1,
      count: 20
};

@Component({
  selector: 'failed-transactions',
  templateUrl: './failed-transactions.component.html',
  styleUrls: ['failed-transactions.component.css'],
})
export class FailedTransactionsComponent implements OnInit, OnChanges {

  @Input() public currentPeriod: string = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';

  public failedTransactionsSummary$: Observable<any> = of(null);
  public failedTransactionsSummaryInProgress$: Observable<boolean>;
  public request = requestParam;
  public imgPath: string = '';

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _store: Store<AppState>, private gstrAction: GstReconcileActions, private gstService: GstReconcileService) {
    this.failedTransactionsSummary$ = this._store.select(p => p.gstR.failedTransactionsSummary);
    this.failedTransactionsSummaryInProgress$ = this._store.select(p => p.gstR.failedTransactionsSummaryInProgress).pipe(takeUntil(this.destroyed$));

    //
  }

  public ngOnInit() {
    this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
  }

  public pageChanged(event) {
    this.request['page'] = event.page;
    this._store.dispatch(this.gstrAction.GetReturnSummary(this.selectedGst, this.request));
  }

  /**
   * ngOnChnages
  */
  public ngOnChanges(s: SimpleChanges) {

    //
  }

}
