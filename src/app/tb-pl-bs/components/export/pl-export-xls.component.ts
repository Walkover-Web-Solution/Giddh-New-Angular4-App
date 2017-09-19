import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppState } from '../../../store/roots';
import { Store } from '@ngrx/store';
import { TBPlBsActions } from '../../../services/actions/tl-pl.actions';
import { ProfitLossRequest } from '../../../models/api-models/tb-pl-bs';

@Component({
  selector: 'pl-export-xls',  // <home></home>
  template: `
    <div class="form-group xls-export">
      <a  (click)="downloadPlXls()" *ngIf="enableDownload"><img
        src="/assets/images/xls-icon.png"/></a>
      <!--end form-group -->
  `
})
export class PlExportXlsComponent implements OnInit, OnDestroy {
  @Input() public fy: number;
  public enableDownload: boolean = true;
  @Output() public plBsExportPdfEvent = new EventEmitter<boolean>();

  constructor(private store: Store<AppState>, private fb: FormBuilder, private _tbPlActions: TBPlBsActions) {

  }

  public downloadPlXls() {
    let request = { fy: this.fy } as ProfitLossRequest;
    this.store.dispatch(this._tbPlActions.DownloadProfitLossExcel(request));
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    //
  }
}
