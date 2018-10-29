import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { Observable, of } from 'rxjs';
import { HsnSummaryResponse } from 'app/store/GstR/GstR.reducer';
import { GstReconcileService } from 'app/services/GstReconcile.service';

export const requestParam = {
      period: this.currentPeriod,
      gstin: this.activeCompanyGstNumber,
      gstReturnType: 'hsnsac',
      page: 1,
      count: 20
};

@Component({
  selector: 'hsn-summary',
  templateUrl: './hsn-summary.component.html',
  styleUrls: ['hsn-summary.component.css'],
})
export class HsnSummaryComponent implements OnInit, OnChanges {

  @Input() public currentPeriod: string = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';
  public request = requestParam;

  public hsnSummaryResponse$: Observable<HsnSummaryResponse> = of(new HsnSummaryResponse());

  constructor(private _store: Store<AppState>, private gstrAction: GstReconcileActions, private gstService: GstReconcileService) {
    this.hsnSummaryResponse$ = this._store.select(p => p.gstR.hsnSummary);
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
