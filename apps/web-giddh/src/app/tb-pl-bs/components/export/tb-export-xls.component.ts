import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TrialBalanceExportExcelRequest, TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import { TBPlBsActions } from '../../../actions/tl-pl.actions';
import { AppState } from '../../../store/roots';
import { Store } from '@ngrx/store';

@Component({
    selector: 'tb-export-xls',  // <home></home>
    template: `

<div class="btn-group" dropdown>
   <a dropdownToggle class="cp"><img src="{{ imgPath }}"/></a>
   <ul id="dropdown-xls" *dropdownMenu class="dropdown-menu dropdown-menu-right cp tbpl-dropdown" role="menu" aria-labelledby="button-basic">
      <span class="caret"></span>
      <li><a (click)="downloadTbXls('main-group')">Main Group Report</a></li>
      <li><a (click)="downloadTbXls('group')">All Group Report</a></li>
      <li><a (click)="downloadTbXls('account')">All Account Report</a></li>
      <li><a (click)="downloadTbXls('all')">Complete Report</a></li>
   </ul>
</div>
    <!--end form-group -->
  `
})

export class TbExportXlsComponent implements OnInit, OnDestroy {
    @Input() public trialBalanceRequest: TrialBalanceRequest;
    public enableDownload: boolean = true;
    @Output() public tbExportXLSEvent = new EventEmitter<string>();

    public showTbXls: boolean;
    public imgPath: string = '';

    constructor(private store: Store<AppState>, private _tbPlActions: TBPlBsActions) {

    }

    public downloadTbXls(value: string) {
        let request = { ...this.trialBalanceRequest, export: value } as TrialBalanceExportExcelRequest;
        this.store.dispatch(this._tbPlActions.DownloadTrialBalanceExcel(request));
        return false;
    }

    public ngOnInit() {
        this.imgPath = (isElectron || isCordova) ? 'assets/images/xls-icon.png' : AppUrl + APP_FOLDER + 'assets/images/xls-icon.png';
    }

    public ngOnDestroy() {
        //
    }
}
