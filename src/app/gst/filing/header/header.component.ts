import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AppState } from 'app/store';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToasterService } from 'app/services/toaster.service';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';

@Component({
  selector: 'filing-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css'],
})
export class FilingHeaderComponent implements OnInit, OnChanges {
  public selectedGst: number = 2;
  @Input() public selectedPeriod: string = null;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private _toasty: ToasterService,
    private _reconcileAction: GstReconcileActions
  ) {
    //
  }

  public ngOnInit() {
    //
  }

  /**
   * pullFromGstIn
   */
  public pullFromGstIn(ev) {
    console.log(ev);
    this.store.dispatch(this._reconcileAction.showPullFromGstInModal());
  }

  /**
   * ngOnChanges
   */
  public ngOnChanges() {
    //
  }

}
