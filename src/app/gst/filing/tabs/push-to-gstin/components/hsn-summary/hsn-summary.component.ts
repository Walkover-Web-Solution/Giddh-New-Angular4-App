import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { Observable, of, ReplaySubject } from 'rxjs';
import { HsnSummaryResponse } from 'app/store/GstR/GstR.reducer';
import { GstReconcileService } from 'app/services/GstReconcile.service';
import { takeUntil } from 'rxjs/operators';

export const requestParam = {
      period: '',
      gstin: '',
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
  public hsnSummaryInProgress$: Observable<boolean>;
  public imgPath: string = '';

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _store: Store<AppState>, private gstrAction: GstReconcileActions, private gstService: GstReconcileService) {
    this.hsnSummaryResponse$ = this._store.select(p => p.gstR.hsnSummary);
    this.hsnSummaryInProgress$ = this._store.select(p => p.gstR.hsnSummaryInProgress).pipe(takeUntil(this.destroyed$));
    //
  }

  public ngOnInit() {
    this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
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
