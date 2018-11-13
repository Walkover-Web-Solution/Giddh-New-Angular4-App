import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
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
export class OverviewSummaryComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @Input() public currentPeriod: any = null;
  @Input() public selectedGst: string = null;
  @Input() public activeCompanyGstNumber: string = null;
  @Input() public isTransactionSummary: boolean = false;

  public gstOverviewData$: Observable<GstOverViewResponse>;
  public companyGst$: Observable<string> = of('');
  public gstOverviewDataInProgress$: Observable<boolean>;
  public imgPath: string = '';

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private gstAction: GstReconcileActions, private _store: Store<AppState>, private _route: Router, private activatedRoute: ActivatedRoute) {
    this.gstOverviewData$ = this._store.select(p => p.gstR.overViewData).pipe(takeUntil(this.destroyed$));
    this.companyGst$ = this._store.select(p => p.gstR.activeCompanyGst).pipe(takeUntil(this.destroyed$));
    this.gstOverviewDataInProgress$ = this._store.select(p => p.gstR.overViewDataInProgress).pipe(takeUntil(this.destroyed$));

  }

  public ngOnInit() {
    this.imgPath = isElectron ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';
    this.companyGst$.subscribe(a => {
      if (a) {
        this.activeCompanyGstNumber = a;
      }
    });
  }

  /**
   * viewTransactions
   */
  public viewTransactions(obj) {
    let param = {
      page: 1,
      count: 20,
      entity: obj.type,
      gstin: this.activeCompanyGstNumber,
      type: obj.gstReturnType,
      from: this.currentPeriod.from,
      to: this.currentPeriod.to,
      status: ''
    };
    this._store.dispatch(this.gstAction.GetSummaryTransaction(this.selectedGst, param));
    this._route.navigate(['pages', 'gstfiling', 'filing-return', this.selectedGst, this.currentPeriod.from, this.currentPeriod.to , 'transaction', param.entity]);
  }

  public ngOnChanges(s: SimpleChanges) {
    //
  }

  public ngAfterViewInit() {
      //
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
  }
}
