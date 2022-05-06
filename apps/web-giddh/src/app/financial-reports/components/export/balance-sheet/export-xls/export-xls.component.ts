import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { TBPlBsActions } from 'apps/web-giddh/src/app/actions/tl-pl.actions';
import { AppState } from 'apps/web-giddh/src/app/store';

@Component({
    selector: 'balance-sheet-export-xls',
    templateUrl: './export-xls.component.html'
})
export class BalanceSheetExportXlsComponent implements OnInit {
    @Input() public fy: number;
    @Input() public filters: any = {};
    /** This will hold expandAll values for balance sheet export */
    @Input() public expandAll : boolean;
    public enableDownload: boolean = true;
    public imgPath: string = '';
    @Output() public plBsExportPdfEvent = new EventEmitter<boolean>();
    /** This will hold local JSON data */
    public localeData: any = {};

    constructor(
        private store: Store<AppState>,
        private tbPlActions: TBPlBsActions) {

    }

    public downloadBsXls() {
        let expanded = this.expandAll;
        if(expanded === true){
            const expand = "expanded"
            let request = { from: this.filters.from, to: this.filters.to, branchUniqueName: this.filters.branchUniqueName, filename: this.localeData?.xls.balance_sheet.download_filename, view: expand };
            this.store.dispatch(this.tbPlActions.DownloadBalanceSheetExcel(request));
        }else if(expanded === false) {
            const collapse = "collapsed"
            let request = { from: this.filters.from, to: this.filters.to, branchUniqueName: this.filters.branchUniqueName, filename: this.localeData?.xls.balance_sheet.download_filename, view: collapse };
            this.store.dispatch(this.tbPlActions.DownloadBalanceSheetExcel(request));
        }
    }

    public ngOnInit() {
        this.imgPath = isElectron ? 'assets/images/xls-icon.svg' : AppUrl + APP_FOLDER + 'assets/images/xls-icon.svg';
    }
}
