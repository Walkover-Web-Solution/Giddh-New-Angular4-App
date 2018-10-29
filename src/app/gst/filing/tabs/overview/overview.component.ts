import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
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
export class FilingOverviewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public currentPeriod: string = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';
  @Input() public isTransactionSummary: boolean = false;

  public gstOverviewData$: Observable<GstOverViewResponse>;
  public showTransaction: boolean = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private gstAction: GstReconcileActions, private _store: Store<AppState>, private _route: Router, private activatedRoute: ActivatedRoute) {
    this.gstOverviewData$ = this._store.select(p => p.gstR.overViewData).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.activatedRoute.url.subscribe(params => {
      if (this._route.routerState.snapshot.url.includes('transaction')) {
        this.showTransaction = true;
      } else {
        this.showTransaction = false;
      }
    });

    let model = {
      period: this.currentPeriod,
      gstin: this.activeCompanyGstNumber,
      page: 1,
      count: 20
    };
    this._store.dispatch(this.gstAction.GetOverView(this.selectedGst, model));
    //
  }

  /**
   * ngOnChanges
   */
  public ngOnChanges(s: SimpleChanges) {
    //
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    this.destroyed$.next(true);
  }

}
