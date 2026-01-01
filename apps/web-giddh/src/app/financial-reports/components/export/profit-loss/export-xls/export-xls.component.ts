import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { TBPlBsActions } from 'apps/web-giddh/src/app/actions/tl-pl.actions';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { AppState } from 'apps/web-giddh/src/app/store';
import { Configuration } from '../../../../../app.constant';
import { environment } from '../../../../../../environments/environment.generated';

@Component({
selector: 'profit-loss-export-xls',
    templateUrl: './export-xls.component.html',
    standalone: false
})
export class ProfitLossExportXlsComponent implements OnInit {
    @Input() public fy: number;
    @Input() public filters: any = {};
    public enableDownload: boolean = true;
    public imgPath: string = '';
    @Output() public plBsExportPdfEvent = new EventEmitter<boolean>();
    /** This will hold local JSON data */
    public localeData: any = {};

    constructor(
        private store: Store<AppState>,
        @Inject(ServiceConfig) private serviceConfig,
        private tbPlActions: TBPlBsActions) {

    }

    public downloadPlXls() {
        let request = { from: this.filters.from, to: this.filters.to, branchUniqueName: this.filters.branchUniqueName, filename: this.localeData?.xls.profit_loss.download_filename };
        this.store.dispatch(this.tbPlActions.DownloadProfitLossExcel(request));
    }

    public ngOnInit() {
        this.imgPath = Configuration.isElectron ? 'assets/images/xls-icon.svg' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/xls-icon.svg';
    }
}
