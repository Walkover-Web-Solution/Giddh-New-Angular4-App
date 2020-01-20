import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppState } from '../../../store/roots';
import { Store } from '@ngrx/store';
import { TBPlBsActions } from '../../../actions/tl-pl.actions';

@Component({
    selector: 'bs-export-xls',  // <home></home>
    template: `
    <div class="form-group xls-export cp" style="margin: 0;">
      <a (click)="downloadBsXls()" *ngIf="enableDownload"><img
        src="{{ imgPath }}"/></a>
      <!--end form-group -->
  `
})
export class BsExportXlsComponent implements OnInit, OnDestroy {
    @Input() public fy: number;
    @Input() public filters: any = {};

    public enableDownload: boolean = true;
    public imgPath: string = '';
    @Output() public plBsExportPdfEvent = new EventEmitter<boolean>();

    constructor(private store: Store<AppState>, private fb: FormBuilder, private _tbPlActions: TBPlBsActions) {

    }

    public downloadBsXls() {
        let request = { from: this.filters.from, to: this.filters.to };
        this.store.dispatch(this._tbPlActions.DownloadBalanceSheetExcel(request));
    }

    public ngOnInit() {
        this.imgPath = (isElectron|| isCordova) ? 'assets/images/xls-icon.png' : AppUrl + APP_FOLDER + 'assets/images/xls-icon.png';
    }

    public ngOnDestroy() {
        //
    }
}
