import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { GstReconcileActions }  from 'apps/web-giddh/src/app/actions/gst-reconcile/GstReconcile.actions';
import { Store } from '@ngrx/store';
import { AppState }  from 'apps/web-giddh/src/app/store';
import { Observable, ReplaySubject } from 'rxjs';
import { GstOverViewResponse, GstRReducerState }  from 'apps/web-giddh/src/app/store/GstR/GstR.reducer';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'filing-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['overview.component.css'],
})
export class FilingOverviewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public currentPeriod: any = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';
  @Input() public isTransactionSummary: boolean = false;

  public gstOverviewData$: Observable<GstOverViewResponse>;
  public showTransaction: boolean = false;
  public filters: any = {};

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

  public selectTxn(param) {
    this.filters = param;
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
