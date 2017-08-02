import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Component, OnInit } from '@angular/core';
import { ManufacturingActions } from '../../services/actions/manufacturing/manufacturing.actions';

@Component({
  templateUrl: './mf.report.component.html'
})

export class MfReportComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private manufacturingActions: ManufacturingActions
  ) {
  }

  public ngOnInit() {
    console.log('hello from MfReportComponent');
  }
}
