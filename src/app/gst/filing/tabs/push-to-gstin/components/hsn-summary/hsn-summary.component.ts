import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { Observable, of } from 'rxjs';
import { HsnSummaryResponse } from 'app/store/GstR/GstR.reducer';
import { GstReconcileService } from 'app/services/GstReconcile.service';

@Component({
  selector: 'hsn-summary',
  templateUrl: './hsn-summary.component.html',
  styleUrls: ['hsn-summary.component.css'],
})
export class HsnSummaryComponent implements OnInit, OnChanges {

  @Input() public currentPeriod: string = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';

  public hsnSummaryResponse$: Observable<HsnSummaryResponse> = of(new HsnSummaryResponse());

  constructor(private _store: Store<AppState>, private gstrAction: GstReconcileActions, private gstService: GstReconcileService) {
    this.hsnSummaryResponse$ = this._store.select(p => p.gstR.hsnSummary);
    //
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

}
