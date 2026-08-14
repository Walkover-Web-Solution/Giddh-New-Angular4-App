import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { TBPlBsActions } from 'apps/web-giddh/src/app/actions/tl-pl.actions';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { AppState } from 'apps/web-giddh/src/app/store';

export enum ProfitLossExportView {
    Collapsed = 'collapsed',
    Expanded = 'expanded'
}

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

    public downloadPlXls(value: boolean): void {
        let request = { from: this.filters.from, to: this.filters.to, branchUniqueName: this.filters.branchUniqueName, filename: this.localeData?.xls.profit_loss.download_filename, view: (value === true) ? ProfitLossExportView.Expanded : ProfitLossExportView.Collapsed };
        this.store.dispatch(this.tbPlActions.DownloadProfitLossExcel(request));
    }

    public ngOnInit() {
        this.imgPath = this.serviceConfig.IMG_PATH + 'xls-icon.svg';
    }
}
