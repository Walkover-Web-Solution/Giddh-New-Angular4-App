import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { takeUntil } from 'rxjs/operators';
import { DocumentIssuedResponse } from '../../../../../../models/api-models/GstReconcile';

@Component({
  selector: 'document-issued',
  templateUrl: './document-issued.component.html',
  styleUrls: ['./document-issued.component.css'],
})
export class DocumentIssuedComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public currentPeriod: string = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';

  public documentIssuedResponse$: Observable<DocumentIssuedResponse>;
  public documentIssuedRequestInProgress$: Observable<boolean>;
  public imgPath: string = '';

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _store: Store<AppState>) {
    this.documentIssuedResponse$ = this._store.select(p => p.gstR.documentIssuedResponse).pipe(takeUntil(this.destroyed$));
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

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
