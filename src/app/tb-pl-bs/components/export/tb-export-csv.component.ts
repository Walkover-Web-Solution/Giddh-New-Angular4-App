import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { RecTypePipe } from '../../../shared/helpers/pipes/recType.pipe';
import { AccountFlat, ChildGroup } from '../../../models/api-models/Search';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ComapnyResponse } from '../../../models/api-models/Company';
import { saveAs } from 'file-saver';

interface Total {
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

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private exportData: ChildGroup[];
  private fnGroupWise: string;
  private showOptions: boolean;
  private csvGroupWise: any;
  private uriGroupWise: any;
  private uriAccountWise: any;
  private uriCondensed: any;
  private fnAccountWise: string;
  private csvAW: any;
  private fnCondensed: string;
  private csvCond: any;
  private accounts: AccountFlat[];

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private recType: RecTypePipe) {
    this.store.select(p => p.tlPl.tb.exportData).subscribe(p => {
      console.log(p);
      this.exportData = p
    });
  }

  public formatDataGroupWise = (): string => {
    let csv;
    let header;
    let row;
    let title;
    let total: Total;
    total = {
      ob: 0,
      cb: 0,
      cr: 0,
      dr: 0
    };
    csv = '';
    row = '';
    title = '' + ',' + 'Opening Balance' + ',' + 'Debit' + ',' + 'Credit' + ',' + 'Closing Balance' + '\n';
    this.fnGroupWise = "Trial_Balance.csv";
    header = `${this.selectedCompany.name}\r\n"${this.selectedCompany.address}"\r\n${this.selectedCompany.city}-${this.selectedCompany.pincode}\r\nTrial Balance: fromDate  to toDate\r\n`;
    csv += `${header}\r\n${title}`;

    this.exportData.forEach(obj => {
      // if (obj.isVisible) {
      row += `${obj.groupName},${obj.forwardedBalance.amount} ${this.recType.transform(obj.forwardedBalance)},${obj.debitTotal},${obj.creditTotal},${obj.closingBalance.amount}${this.recType.transform(obj.closingBalance)}\r\n`;
      total = this.calculateTotal(obj, total);
      // }
    });
    csv += `${row}\r\n`;
    csv += `\r\nTotal,${this.suffixRecordType(total.ob)},${total.dr},${total.cr},${this.suffixRecordType(total.cb)}\n`;
    this.uriGroupWise = `data:text/csv;charset=utf-8,${csv}`;
    this.showOptions = true;
    return csv;
  };

  public formatDataAccountWise = (): string => {
    let body;
    let createCsv;
    let csv;
    let footer;
    let header;
    let row;
    let title;
    let total;
    total = {
      ob: 0,
      cb: 0,
      cr: 0,
      dr: 0
    };
    row = '';
    title = '';
    body = '';
    footer = '';
    header = `${this.selectedCompany.name}\r\n"${this.selectedCompany.address}"\r\n${this.selectedCompany.city}-${this.selectedCompany.pincode}\r\nTrial Balance: fromDate to toDate\r\n`;
    title += 'Name' + ',' + 'Opening Balance' + ',' + 'Debit' + ',' + 'Credit' + ',' + 'Closing Balance' + '\r\n';
    createCsv = (groups: ChildGroup[]) => {
      const addRow = (group: ChildGroup) => {
        if (group.accounts.length > 0) {
          group.accounts.forEach(account => {
            // if (account.isVisible === true) {
            row += `${account.name} (${group.groupName}),${account.openingBalance.amount} ${this.recType.transform(account.openingBalance)},${account.debitTotal},${account.creditTotal},${account.closingBalance.amount},${this.recType.transform(account.closingBalance)}\r\n`;
            total = this.calculateTotal(group, total);
            // }
          });
        }
      };
      groups.forEach(group => {
        if (group.accounts.length > 0) {
          addRow(group);
        }
        group.childGroups.forEach(childGroup => {
          if (childGroup.accounts.length > 0) {
            addRow(childGroup);
          }
          if (childGroup.childGroups.length > 0) {
            return createCsv(childGroup.childGroups);
          }
        });
      });
      return `${row}\r\n`;
    };
    body = createCsv(this.exportData);
    footer += `Total,${this.suffixRecordType(total.ob)},${total.dr},${total.cr},${this.suffixRecordType(total.cb)}\n`;
    csv = `${header}\r\n\r\n${title}\r\n${body}${footer}`;
    this.csvAW = csv;
    this.uriAccountWise = `data:text/csv;charset=utf-8,${(csv)}`;
    this.showOptions = true;
    return csv;
  };

  public formatDataCondensed = (): string => {
    let body;
    let csv;
    let footer;
    let header;
    let title;
    let total;
    total = {
      ob: 0,
      cb: 0,
      cr: 0,
      dr: 0
    };
    csv = '';
    title = '';
    footer = '';
    header = `${this.selectedCompany.name}\r\n"${this.selectedCompany.address}"\r\n${this.selectedCompany.city}-${this.selectedCompany.pincode}\r\nTrial Balance: fromDate to toDate\r\n`;
    title += 'Name' + ',' + 'Opening Balance' + ',' + 'Debit' + ',' + 'Credit' + ',' + 'Closing Balance' + '\r\n';
    const createCsv = (groupDetails: ChildGroup[], index) => {
      let bd;
      bd = '';
      groupDetails.forEach(group => {
        let i;
        let j;
        let ref;
        let row;
        let strIndex;
        row = '';
        strIndex = '';
        for (i = j = 0, ref = index; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          strIndex += '   ';
        }
        if (group.closingBalance.amount !== 0) {
          row += `${strIndex + group.groupName.toUpperCase()},${group.forwardedBalance.amount}${this.recType.transform(group.forwardedBalance)},${group.debitTotal},${group.creditTotal},${group.closingBalance.amount}${this.recType.transform(group.closingBalance)}\r\n`;
          if (group.accounts === void 0) {
            console.log(group);
          }
          if (group.accounts.length > 0) {
            group.accounts.forEach(acc => {
              if (acc.isVisible === true) {
                row += `${strIndex}   ${this.firstCapital(acc.name)} (${this.firstCapital(group.groupName)}),${acc.openingBalance.amount}${this.recType.transform(acc.openingBalance)},${acc.debitTotal},${acc.creditTotal},${acc.closingBalance.amount}${this.recType.transform(acc.closingBalance)}\r\n`;
                total = this.calculateTotal(group, total);
              }
            });
          }
          if (group.childGroups.length > 0) {
            row += createCsv(group.childGroups, index + 1);
          }
        }
        return bd += row;
      });
      return bd;
    };
    body = createCsv(this.exportData, 0);
    footer += `Total,${this.suffixRecordType(total.ob)},${total.dr},${total.cr},${this.suffixRecordType(total.cb)}\n`;
    csv = `${header}\r\n\r\n${title}\r\n${body}\r\n${footer}\r\n`;
    this.uriCondensed = `data:text/csv;charset=utf-8,${(csv)}`;
    this.showOptions = true;
    return csv;
  };

  public downloadCSV(value: string) {
    this.showCsvDownloadOptions = false;
    let csv = '';
    let name = '';
    switch (value) {
      case 'group-wise':
        csv = this.formatDataGroupWise();
        name = 'Trial_Balance_group-wise.csv';
        break;
      case 'condensed':
        csv = this.formatDataCondensed();
        name = 'Trial_Balance_condensed.csv';
        break;
      case 'account-wise':
        csv = this.formatDataAccountWise();
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

  private firstCapital(s: string) {
    return s[0].toUpperCase() + s.slice(1);
  }

  private suffixRecordType = (balance: number): string => {
    if (balance < 0) {
      balance = balance * -1;
      return `${balance} Cr`;
    } else {
      return `${balance} Dr`;
    }
  };
  private calculateTotal = (group: ChildGroup, total: Total): Total => {
    if (group.forwardedBalance.type === "DEBIT") {
      total.ob = total.ob + group.forwardedBalance.amount;
    } else {
      total.ob = total.ob - group.forwardedBalance.amount;
    }
    if (group.closingBalance.type === "DEBIT") {
      total.cb = total.cb + group.closingBalance.amount;
    } else {
      total.cb = total.cb - group.closingBalance.amount;
    }
    total.cr += group.creditTotal;
    total.dr += group.debitTotal;
    return total;
  };
}
