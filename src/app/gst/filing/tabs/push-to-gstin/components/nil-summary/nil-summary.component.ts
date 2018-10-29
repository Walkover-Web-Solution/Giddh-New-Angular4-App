import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { AppState } from 'app/store';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { GstReconcileService } from 'app/services/GstReconcile.service';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { NilSummaryResponse } from 'app/store/GstR/GstR.reducer';

export const requestParam = {
      period: this.currentPeriod,
      gstin: this.activeCompanyGstNumber,
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
  public request = requestParam;

  constructor(private _store: Store<AppState>, private gstrAction: GstReconcileActions, private gstService: GstReconcileService) {
    this.nilSummaryResponse$ = this._store.select(p => p.gstR.nilSummary);
    //
  }

  public ngOnInit() {
    //
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
