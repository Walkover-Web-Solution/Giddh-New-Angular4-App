import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TrialBalanceExportExcelRequest, TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import { TBPlBsActions } from '../../../services/actions/tl-pl.actions';
import { AppState } from '../../../store/roots';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tb-export-xls',  // <home></home>
  template: `
    <div class="form-group xls-export" (clickOutside)="showTbXls=false;">
      <a (click)="showTbXls = !showTbXls" *ngIf="enableDownload"><img
        src="/assets/images/xls-icon.png"/></a>
      <div class="export-options" *ngIf="showTbXls">
        <span class="arrow"></span>
        <ul class="list-unstyled">
          <li><a (click)="downloadTbXls('main-group')">Main Group Report</a></li>
          <li><a (click)="downloadTbXls('group')">All Group Report</a></li>
          <li><a (click)="downloadTbXls('account')">All Account Report</a></li>
          <li><a (click)="downloadTbXls('all')">Complete Report</a></li>
        </ul>
      </div>
    </div>
    <!--end form-group -->
  `
})
export class TbExportXlsComponent implements OnInit, OnDestroy {
  @Input() public trialBalanceRequest: TrialBalanceRequest;
  public enableDownload: boolean = true;
  @Output() public tbExportXLSEvent = new EventEmitter<string>();

  public showTbXls: boolean;

  constructor(private store: Store<AppState>, private _tbPlActions: TBPlBsActions) {

  }

  public downloadTbXls(value: string) {
    // console.log(this.trialBalanceRequest);
    let request = { ...this.trialBalanceRequest, export: value } as TrialBalanceExportExcelRequest;
    this.store.dispatch(this._tbPlActions.DownloadTrialBalanceExcel(request));
    return false;
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    //
  }
}
