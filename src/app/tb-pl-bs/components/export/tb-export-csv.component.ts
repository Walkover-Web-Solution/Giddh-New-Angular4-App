import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { RecTypePipe } from '../../../shared/helpers/pipes/recType.pipe';
import { ChildGroup } from '../../../models/api-models/Search';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ComapnyResponse } from '../../../models/api-models/Company';
import { saveAs } from 'file-saver';
import { DataFormatter } from './data-formatter.class';

export interface Total {
  ob: number;
  cb: number;
  cr: number;
  dr: number;
}

@Component({
  selector: 'tb-export-csv',  // <home></home>
  template: `
    <div class="form-group export" (clickOutside)="showCsvDownloadOptions=false;">
      <a title="" download="" (click)="showCsvDownloadOptions = !showCsvDownloadOptions" *ngIf="enableDownload"><img
        src="/assets/images/csv.png" class="csv"/></a>
      <div class="export-options" *ngIf="showCsvDownloadOptions">
        <span class="arrow"></span>
        <ul class="list-unstyled">
          <li><a (click)="downloadCSV('group-wise')" data-report="group-wise">Group Wise
            Report</a></li>
          <li><a (click)="downloadCSV('condensed')" data-report="condensed">Condensed
            Report</a></li>
          <li><a (click)="downloadCSV('account-wise')" data-report="account-wise">Account
            Wise
            Report</a></li>
        </ul>
      </div>
    </div>
    <!-- end form-group -->
  `,
  providers: [RecTypePipe]
})
export class TbExportCsvComponent implements OnInit, OnDestroy {
  @Input() selectedCompany: ComapnyResponse;
  @Output() public tbExportCsvEvent = new EventEmitter<string>();

  public showCsvDownloadOptions: boolean;
  public enableDownload: boolean = true;

  private dataFormatter: DataFormatter;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private exportData: ChildGroup[];
  private showOptions: boolean;
  private csvAW: any;

  constructor(private store: Store<AppState>, private recType: RecTypePipe) {
    this.store.select(p => p.tlPl.tb.exportData).subscribe(p => {
      this.exportData = p;
      this.dataFormatter = new DataFormatter(p, this.selectedCompany, recType);
    });
  }


  public downloadCSV(value: string) {
    this.showCsvDownloadOptions = false;
    let csv = '';
    let name = '';
    switch (value) {
      case 'group-wise':
        csv = this.dataFormatter.formatDataGroupWise();
        name = 'Trial_Balance_group-wise.csv';
        break;
      case 'condensed':
        csv = this.dataFormatter.formatDataCondensed();
        name = 'Trial_Balance_condensed.csv';
        break;
      case 'account-wise':
        csv = this.dataFormatter.formatDataAccountWise();
        name = 'Trial_Balance_account-wise.csv';
        break;
      default:
        break;
    }
    this.downLoadFile(name, csv);
  }

  private getIEVersion(): number {
    let Idx, sAgent;
    sAgent = window.navigator.userAgent;
    Idx = sAgent.indexOf('MSIE');
    if (Idx > 0) {
      return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf('.', Idx)));
    } else if (!!navigator.userAgent.match(/Trident\/7\./)) {
      return 11;
    } else {
      return 0;
    }
  }

  private downLoadFile(fileName: string, csv: string) {
    if (this.getIEVersion() > 0) {
      let win;
      win = window.open();
      win.document.write('sep=,\r\n', csv);
      win.document.close();
      win.document.execCommand('SaveAs', true, fileName);
      win.close();
    } else {
      let data = new Blob([csv], { type: 'data:text/csv;charset=utf-8' });
      saveAs(data, fileName);
    }
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    //
  }


}
