import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { AppState } from 'app/store';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'push-to-gstin',
  templateUrl: './push-to-gstin.component.html',
  styleUrls: ['push-to-gstin.component.css'],
})
export class PushToGstInComponent implements OnInit, OnChanges {

  @Input() public currentPeriod: string = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';

  public showTransaction: boolean = false;

  constructor(private _store: Store<AppState>, private gstrAction: GstReconcileActions, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      if (params['transaction']) {
        this.showTransaction = true;
      } else {
        this.showTransaction = false;
      }
    });
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

  /**
   * selectTab
   */
  public selectTab() {
    //
  }

 public getSummary(type) {
    debugger;
    let requestParam = {
      period: this.currentPeriod,
      gstin: this.activeCompanyGstNumber,
      gstReturnType: type,
      page: 1,
      count: 20
    };
    this._store.dispatch(this.gstrAction.GetReturnSummary(this.selectedGst, requestParam));
  }

}
