import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { Observable, ReplaySubject, of } from 'rxjs';
import { GstRReducerState, GstOverViewResponse } from 'app/store/GstR/GstR.reducer';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'overview-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['summary.component.css'],
})
export class OverviewSummaryComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() public currentPeriod: string = null;
  @Input() public selectedGst: string = null;
  @Input() public activeCompanyGstNumber: string = null;

  public gstOverviewData$: Observable<GstOverViewResponse>;
  public companyGst$: Observable<string> = of('');
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private gstAction: GstReconcileActions, private _store: Store<AppState>, private _route: Router, private activatedRoute: ActivatedRoute) {
    this.gstOverviewData$ = this._store.select(p => p.gstR.overViewData).pipe(takeUntil(this.destroyed$));
    this.companyGst$ = this._store.select(p => p.gstR.activeCompanyGst).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.companyGst$.subscribe(a => {
      if (a) {
        this.activeCompanyGstNumber = a;
      }
    });

    this.activatedRoute.params.subscribe(params => {
      this.currentPeriod = params['period'];
      this.selectedGst = params['selectedGst'];
    });

    //
  }

  /**
   * viewTransactions
   */
  public viewTransactions(obj) {
    console.log(obj);
    let param = {
      entity: 'invoices',
      gstin: this.activeCompanyGstNumber,
      type: obj.gstReturnType,
      monthYear: this.currentPeriod,
      status: ''
    };
    this._store.dispatch(this.gstAction.GetSummaryTransaction(this.selectedGst, param));
    this._route.navigate(['pages', 'gstfiling', 'filing-return', this.selectedGst, this.currentPeriod , 'transaction']);

  }

  /**
   * ngOnChanges
   */
  public ngOnChanges(s: SimpleChanges) {
    //
  }

  /**
   * ngViewAfterInit
   */
  public ngAfterViewInit() {
      //
  }
}
