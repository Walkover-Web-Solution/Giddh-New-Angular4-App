import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AppState } from 'app/store';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { ReplaySubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { NilSummary } from '../../../../../../models/api-models/GstReconcile';

@Component({
  selector: 'nil-summary',
  templateUrl: './nil-summary.component.html',
  styleUrls: ['nil-summary.component.css'],
})
export class NilSummaryComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public nilSummary: NilSummary = new NilSummary();
  public imgPath: string = '';

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _store: Store<AppState>, private gstrAction: GstReconcileActions) {

    //
  }

  public ngOnInit() {
    this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
  }

  public pageChanged(event) {
    // this.request['page'] = event.page;
    // this._store.dispatch(this.gstrAction.GetReturnSummary(this.selectedGst, this.request));
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
