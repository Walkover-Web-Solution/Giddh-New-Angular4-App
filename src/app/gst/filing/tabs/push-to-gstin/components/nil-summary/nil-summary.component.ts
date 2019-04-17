import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AppState } from 'app/store';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { Observable, of, ReplaySubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { NilSummaryResponse } from '../../../../../../models/api-models/GstReconcile';

export const requestParam = {
  period: '',
  gstin: '',
  gstReturnType: 'nil',
  page: 1,
  count: 20
};

@Component({
  selector: 'nil-summary',
  templateUrl: './nil-summary.component.html',
  styleUrls: ['nil-summary.component.css'],
})
export class NilSummaryComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public currentPeriod: string = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';

  public nilSummaryResponse$: Observable<NilSummaryResponse> = of(new NilSummaryResponse());
  public nilSummaryInProgress$: Observable<boolean>;
  public request = requestParam;
  public imgPath: string = '';

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _store: Store<AppState>, private gstrAction: GstReconcileActions) {
    this.nilSummaryResponse$ = this._store.select(p => p.gstR.nilSummary).pipe(takeUntil(this.destroyed$));
    this.nilSummaryInProgress$ = this._store.select(p => p.gstR.nilSummaryInProgress).pipe(takeUntil(this.destroyed$));

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

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
