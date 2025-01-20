import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { TBPlBsActions } from 'apps/web-giddh/src/app/actions/tl-pl.actions';
import { TrialBalanceExportExcelRequest, TrialBalanceRequest } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { AppState } from 'apps/web-giddh/src/app/store';

@Component({
    selector: 'trial-balance-export-xls',
    templateUrl: './export-xls.component.html'
})
export class TrialBalanceExportXlsComponent implements OnInit {
    @Input() public trialBalanceRequest: TrialBalanceRequest;
    public enableDownload: boolean = true;
    @Output() public tbExportXLSEvent = new EventEmitter<string>();
    public showTbXls: boolean;
    public imgPath: string = '';
    /** This will hold local JSON data */
    public localeData: any = {};

    constructor(
        private store: Store<AppState>,
        private tbPlActions: TBPlBsActions) {

    }

    public downloadTbXls(value: string) {
        let request = { ...this.trialBalanceRequest, export: value, filename: this.localeData?.xls.trial_balance.download_filename } as TrialBalanceExportExcelRequest;
        this.store.dispatch(this.tbPlActions.DownloadTrialBalanceExcel(request));
        return false;
    }

    public ngOnInit() {
        this.imgPath = isElectron ? 'assets/images/xls-icon.svg' : AppUrl + APP_FOLDER + 'assets/images/xls-icon.svg';
    }
}
