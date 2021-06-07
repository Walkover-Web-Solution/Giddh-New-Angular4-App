import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppState } from '../../../store/roots';
import { Store } from '@ngrx/store';
import { TBPlBsActions } from '../../../actions/tl-pl.actions';

@Component({
    selector: 'bs-export-xls',
    templateUrl: './bs-export-xls.component.html'
})

export class BsExportXlsComponent implements OnInit {
    @Input() public fy: number;
    @Input() public filters: any = {};

    public enableDownload: boolean = true;
    public imgPath: string = '';
    @Output() public plBsExportPdfEvent = new EventEmitter<boolean>();
    /* This will hold local JSON data */
    public localeData: any = {};

    constructor(private store: Store<AppState>, private _tbPlActions: TBPlBsActions) {

    }

    public downloadBsXls() {
        let request = { from: this.filters.from, to: this.filters.to, branchUniqueName: this.filters.branchUniqueName, filename: this.localeData?.xls.profit_loss.download_filename };
        this.store.dispatch(this._tbPlActions.DownloadBalanceSheetExcel(request));
    }

    public ngOnInit() {
        this.imgPath = (isElectron || isCordova) ? 'assets/images/xls-icon.svg' : AppUrl + APP_FOLDER + 'assets/images/xls-icon.svg';
    }
}
