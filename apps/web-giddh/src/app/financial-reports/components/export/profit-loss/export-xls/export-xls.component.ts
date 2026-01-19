import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { TBPlBsActions } from 'apps/web-giddh/src/app/actions/tl-pl.actions';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { AppState } from 'apps/web-giddh/src/app/store';
import { Configuration } from '../../../../../app.constant';
import { environment } from '../../../../../../environments/environment.generated';

/**
 * Handles Component functionality
 */
@Component({
selector: 'profit-loss-export-xls',
    templateUrl: './export-xls.component.html',
    standalone: false
})
/**
 * ProfitLossExportXlsComponent component
 * Handles profitlossexportxls functionality and user interactions
 */
export class ProfitLossExportXlsComponent implements OnInit {
    @Input() public fy: number;
    @Input() public filters: any = {};
    public enableDownload: boolean = true;
    public imgPath: string = '';
    @Output() public plBsExportPdfEvent = new EventEmitter<boolean>();
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
     * Handles downloadPlXls functionality
     */
    public downloadPlXls() {
        let request = { from: this.filters.from, to: this.filters.to, branchUniqueName: this.filters.branchUniqueName, filename: this.localeData?.xls.profit_loss.download_filename };
        this.store.dispatch(this.tbPlActions.DownloadProfitLossExcel(request));
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.imgPath = Configuration.isElectron ? 'assets/images/xls-icon.svg' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/xls-icon.svg';
    }
}
