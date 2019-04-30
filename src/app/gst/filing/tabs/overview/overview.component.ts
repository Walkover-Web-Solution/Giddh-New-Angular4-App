import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GstDatePeriod } from '../../../../models/api-models/GstReconcile';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'filing-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['overview.component.css'],
})
export class FilingOverviewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public currentPeriod: GstDatePeriod = new GstDatePeriod();
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';
  @Input() public isTransactionSummary: boolean = false;

  public showTransaction: boolean = false;
  public filters: any = {};

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private gstAction: GstReconcileActions, private _store: Store<AppState>, private _route: Router, private activatedRoute: ActivatedRoute) {
  }

  public ngOnInit() {
    this.activatedRoute.url.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      this.showTransaction = this._route.routerState.snapshot.url.includes('transaction');
    });
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
    this.destroyed$.complete();
  }

}
