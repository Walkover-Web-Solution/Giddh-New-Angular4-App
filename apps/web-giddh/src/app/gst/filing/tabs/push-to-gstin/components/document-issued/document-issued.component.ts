import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DocumentIssuedResponse, GstOverViewResponse, TransactionSummary }  from 'apps/web-giddh/src/app/store/GstR/GstR.reducer';
import { Observable, ReplaySubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState }  from 'apps/web-giddh/src/app/store';
import { GstReconcileActions }  from 'apps/web-giddh/src/app/actions/gst-reconcile/GstReconcile.actions';
import { GstReconcileService }  from 'apps/web-giddh/src/app/services/GstReconcile.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'document-issued',
  templateUrl: './document-issued.component.html',
  styleUrls: ['./document-issued.component.css'],
})
export class DocumentIssuedComponent implements OnInit, OnChanges {

  @Input() public currentPeriod: string = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';

  public documentIssuedResponse$: Observable<DocumentIssuedResponse>;
  public documentIssuedRequestInProgress$: Observable<boolean>;
  public imgPath: string = '';

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _store: Store<AppState>, private gstrAction: GstReconcileActions, private gstService: GstReconcileService) {
    this.documentIssuedResponse$ = this._store.select(p => p.gstR.documentIssuedResponse);
    this.documentIssuedRequestInProgress$ = this._store.select(p => p.gstR.documentIssuedRequestInProgress).pipe(takeUntil(this.destroyed$));
    //
  }

  public ngOnInit() {
    this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
  }

  /**
   * ngOnChnages
  */
  public ngOnChanges(s: SimpleChanges) {
    //
  }

}
