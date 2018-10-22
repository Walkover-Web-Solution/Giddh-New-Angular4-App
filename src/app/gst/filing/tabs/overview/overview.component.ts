import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { Observable, ReplaySubject } from 'rxjs';
import { GstRReducerState, GstOverViewResponse } from 'app/store/GstR/GstR.reducer';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'filing-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['overview.component.css'],
})
export class FilingOverviewComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() public selectedPeriod: string = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';

  public gstOverviewData$: Observable<GstOverViewResponse>;
  public showTransaction: boolean = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private gstAction: GstReconcileActions, private _store: Store<AppState>, private _route: Router, private activatedRoute: ActivatedRoute) {
    this.gstOverviewData$ = this._store.select(p => p.gstR.overViewData).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params['transaction']) {
        this.showTransaction = true;
      } else {
        this.showTransaction = false;
      }
    });

    let model = {period: this.selectedPeriod, gstin: this.activeCompanyGstNumber };
    this._store.dispatch(this.gstAction.GetOverView(this.selectedGst, model));
    //
  }

  /**
   * ngOnChanges
   */
  public ngOnChanges(s: SimpleChanges) {
    // 23AAACW9768L1ZO
    // let model = {period: this.selectedPeriod, gstin: this.activeCompanyGstNumber };
    // this._store.dispatch(this.gstAction.GetOverView(this.selectedGst, model));
  }

  /**
   * ngViewAfterInit
   */
  public ngAfterViewInit() {
      //
  }
}
