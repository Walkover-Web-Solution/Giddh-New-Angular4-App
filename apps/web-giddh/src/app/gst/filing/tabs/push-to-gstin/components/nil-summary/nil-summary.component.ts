import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AppState }  from 'apps/web-giddh/src/app/store';
import { GstReconcileActions }  from 'apps/web-giddh/src/app/actions/gst-reconcile/GstReconcile.actions';
import { GstReconcileService }  from 'apps/web-giddh/src/app/services/GstReconcile.service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { NilSummaryResponse }  from 'apps/web-giddh/src/app/store/GstR/GstR.reducer';
import { takeUntil } from 'rxjs/operators';

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
export class NilSummaryComponent implements OnInit, OnChanges {

  @Input() public currentPeriod: string = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';

  public nilSummaryResponse$: Observable<NilSummaryResponse> = of(new NilSummaryResponse());
  public nilSummaryInProgress$: Observable<boolean>;
  public request = requestParam;
  public imgPath: string = '';

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _store: Store<AppState>, private gstrAction: GstReconcileActions, private gstService: GstReconcileService) {
    this.nilSummaryResponse$ = this._store.select(p => p.gstR.nilSummary);
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

}
