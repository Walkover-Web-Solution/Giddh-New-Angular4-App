import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { TBPlBsActions } from 'apps/web-giddh/src/app/actions/tl-pl.actions';
import { TrialBalanceExportExcelRequest, TrialBalanceRequest } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { AppState } from 'apps/web-giddh/src/app/store';

@Component({
selector: 'trial-balance-export-xls',
    templateUrl: './export-xls.component.html',
    standalone: false
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
        @Inject(ServiceConfig) private serviceConfig,
        private tbPlActions: TBPlBsActions) {

    }

    public downloadTbXls(value: string) {
        let request = { ...this.trialBalanceRequest, export: value, filename: this.localeData?.xls.trial_balance.download_filename } as TrialBalanceExportExcelRequest;
        this.store.dispatch(this.tbPlActions.DownloadTrialBalanceExcel(request));
        return false;
    }

    public ngOnInit() {
        this.imgPath = this.serviceConfig.IMG_PATH + 'xls-icon.svg';
    }
}
