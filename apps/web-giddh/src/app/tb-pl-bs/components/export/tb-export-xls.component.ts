import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TrialBalanceExportExcelRequest, TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import { TBPlBsActions } from '../../../actions/tl-pl.actions';
import { AppState } from '../../../store/roots';
import { Store } from '@ngrx/store';

@Component({
    selector: 'tb-export-xls',
    templateUrl: './tb-export-xls.component.html'
})

export class TbExportXlsComponent implements OnInit {
    @Input() public trialBalanceRequest: TrialBalanceRequest;
    public enableDownload: boolean = true;
    @Output() public tbExportXLSEvent = new EventEmitter<string>();

    public showTbXls: boolean;
    public imgPath: string = '';
    /* This will hold local JSON data */
    public localeData: any = {};

    constructor(private store: Store<AppState>, private _tbPlActions: TBPlBsActions) {

    }

    public downloadTbXls(value: string) {
        let request = { ...this.trialBalanceRequest, export: value, filename: this.localeData?.xls.trial_balance.download_filename } as TrialBalanceExportExcelRequest;
        this.store.dispatch(this._tbPlActions.DownloadTrialBalanceExcel(request));
        return false;
    }

    public ngOnInit() {
        this.imgPath = (isElectron || isCordova) ? 'assets/images/xls-icon.png' : AppUrl + APP_FOLDER + 'assets/images/xls-icon.png';
    }
}