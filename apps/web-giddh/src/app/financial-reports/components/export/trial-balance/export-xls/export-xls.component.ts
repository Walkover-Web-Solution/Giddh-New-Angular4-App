import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { TBPlBsActions } from 'apps/web-giddh/src/app/actions/tl-pl.actions';
import { TrialBalanceExportExcelRequest, TrialBalanceRequest } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { AppState } from 'apps/web-giddh/src/app/store';
import { Configuration } from '../../../../../app.constant';
import { environment } from '../../../../../../environments/environment.generated';

/**
 * Handles Component functionality
 */
@Component({
selector: 'trial-balance-export-xls',
    templateUrl: './export-xls.component.html',
    standalone: false
})
/**
 * TrialBalanceExportXlsComponent component
 * Handles trialbalanceexportxls functionality and user interactions
 */
export class TrialBalanceExportXlsComponent implements OnInit {
    @Input() public trialBalanceRequest: TrialBalanceRequest;
    public enableDownload: boolean = true;
    @Output() public tbExportXLSEvent = new EventEmitter<string>();
    public showTbXls: boolean;
    public imgPath: string = '';
    /** This will hold local JSON data */
    public localeData: any = {};

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>,
        @Inject(ServiceConfig) private serviceConfig,
        private tbPlActions: TBPlBsActions) {

    }

    /**
     * Handles downloadTbXls functionality
     */
    public downloadTbXls(value: string) {
        let request = { ...this.trialBalanceRequest, export: value, filename: this.localeData?.xls.trial_balance.download_filename } as TrialBalanceExportExcelRequest;
        this.store.dispatch(this.tbPlActions.DownloadTrialBalanceExcel(request));
        return false;
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.imgPath = Configuration.isElectron ? 'assets/images/xls-icon.svg' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/xls-icon.svg';
    }
}
