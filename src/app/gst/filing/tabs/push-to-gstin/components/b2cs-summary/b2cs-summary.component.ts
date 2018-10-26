import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { GstOverViewResponse, TransactionSummary } from 'app/store/GstR/GstR.reducer';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { GstReconcileService } from 'app/services/GstReconcile.service';

@Component({
  selector: 'b2cs-summary',
  templateUrl: './b2cs-summary.component.html',
  styleUrls: ['./b2cs-summary.component.css'],
})
export class B2csSummaryComponent implements OnInit, OnChanges {

  @Input() public currentPeriod: string = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';

  public b2csSummaryResponse$: Observable<TransactionSummary>;

  constructor(private _store: Store<AppState>, private gstrAction: GstReconcileActions, private gstService: GstReconcileService) {
    this.b2csSummaryResponse$ = this._store.select(p => p.gstR.b2csSummary);
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
