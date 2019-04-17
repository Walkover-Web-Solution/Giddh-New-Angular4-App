import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { AppState } from 'app/store';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'push-to-gstin',
  templateUrl: './push-to-gstin.component.html',
  styleUrls: ['push-to-gstin.component.css'],
})
export class PushToGstInComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public currentPeriod: string = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';

  public showTransaction: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _store: Store<AppState>, private gstrAction: GstReconcileActions, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      this.showTransaction = !!params['transaction'];
    });
  }

  public ngOnInit() {
    //
  }

  /**
   * ngOnChnages
   */
  public ngOnChanges(s: SimpleChanges) {
    //
  }

  /**
   * selectTab
   */
  public selectTab() {
    //
  }

  public getSummary(type) {
    let requestParam = {
      period: this.currentPeriod,
      gstin: this.activeCompanyGstNumber,
      gstReturnType: type,
      page: 1,
      count: 20
    };
    this._store.dispatch(this.gstrAction.GetReturnSummary(this.selectedGst, requestParam));
  }

  public getDocumentIssuedTxn() {
    this._store.dispatch(this.gstrAction.GetDocumentIssued(this.currentPeriod, this.activeCompanyGstNumber));
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
