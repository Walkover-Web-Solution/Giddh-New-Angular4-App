import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GstOverViewResponse, TransactionSummary }  from 'apps/web-giddh/src/app/store/GstR/GstR.reducer';
import { Observable, ReplaySubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState }  from 'apps/web-giddh/src/app/store';
import { GstReconcileActions }  from 'apps/web-giddh/src/app/actions/gst-reconcile/GstReconcile.actions';
import { GstReconcileService }  from 'apps/web-giddh/src/app/services/GstReconcile.service';
import { takeUntil } from 'rxjs/operators';

export const requestParam = {
      period: '',
      gstin: '',
      gstReturnType: 'b2cs',
      page: 1,
      count: 20
};

@Component({
  selector: 'b2cs-summary',
  templateUrl: './b2cs-summary.component.html',
  styleUrls: ['./b2cs-summary.component.css'],
})
export class B2csSummaryComponent implements OnInit, OnChanges {

  @Input() public currentPeriod: string = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';

  public b2csSummaryResponse$: Observable<TransactionSummary>;
  public request = requestParam;
  public b2csSummaryInProgress$: Observable<boolean>;
  public imgPath: string = '';

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _store: Store<AppState>, private gstrAction: GstReconcileActions, private gstService: GstReconcileService) {
    this.b2csSummaryResponse$ = this._store.select(p => p.gstR.b2csSummary);
    this.b2csSummaryInProgress$ = this._store.select(p => p.gstR.b2csSummaryInProgress).pipe(takeUntil(this.destroyed$));
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
