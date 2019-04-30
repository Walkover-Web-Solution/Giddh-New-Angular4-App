import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs';
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

  constructor() {
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
