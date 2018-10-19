import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { Observable, ReplaySubject } from 'rxjs';
import { GstRReducerState, GstOverViewResponse } from 'app/store/GstR/GstR.reducer';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'filing-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['overview.component.css'],
})
export class FilingOverviewComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() public selectedPeriod: string = null;
  @Input() public gstNumber: string = null;

  public gstOverviewData$: Observable<GstOverViewResponse>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private gstAction: GstReconcileActions, private _store: Store<AppState>) {
    this.gstOverviewData$ = this._store.select(p => p.gstR.overViewData).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    //
  }

  /**
   * ngOnChanges
   */
  public ngOnChanges(s: SimpleChanges) {
    let model = {period: this.selectedPeriod, gstin: '23AAACW9768L1ZO' };
    this._store.dispatch(this.gstAction.GetOverView(model));
  }

  /**
   * ngViewAfterInit
   */
  public ngAfterViewInit() {
      //
  }
}
