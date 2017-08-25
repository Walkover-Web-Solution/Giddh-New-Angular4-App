import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'tl-pl-export-csv',  // <home></home>
  template: `
    <div class="form-group export">
      <a title="" download="" (click)="formatCsvData($event)" *ngIf="enableDownload"><img
        src="/assets/images/csv.png" class="csv"/></a>
      <div class="export-options" *ngIf="showCsvDownloadOptions">
        <span class="arrow"></span>
        <ul class="list-unstyled">
          <li><a href="" (click)="hideOptions($event)" export-report data-report="group-wise">Group Wise
            Report</a></li>
          <li><a href="" (click)="hideOptions($event)" export-report data-report="condensed">Condensed
            Report</a></li>
          <li><a href="" (click)="hideOptions($event)" export-report data-report="account-wise">Account Wise
            Report</a></li>
        </ul>
      </div>
    </div>
    <!-- end form-group -->
  `
})
export class TlPlExportCsvComponent implements OnInit, OnDestroy {
  public showFromDatePicker: boolean;
  public showToDatePicker: boolean;
  public toDate: Date;
  public fromDate: Date;
  public moment = moment;
  public showTbplLoader: boolean;
  public noData: boolean;
  public showClearSearch: boolean;
  public enableDownload: boolean = true;
  public showCsvDownloadOptions: boolean;
  public showpdf: boolean;
  public showTbXls: boolean;
  public showBSLoader = true;
  public showPLLoader = true;
  public inProfit = true;
  public expanded = false;
  public today = new Date();

  public fromDatePickerIsOpen = false;
  public toDatePickerIsOpen = false;
  public plShowOptions = false;
  public sendRequest = true;
  public showChildren = false;
  public showNLevel = false;
  public cmpViewShow = true;
  public keyWord = {
    query: ''
  };
  public dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1,
    'showWeeks': false,
    'show-button-bar': false,
    'year-range': 1,
    'todayBtn': false
  };
  public plData = {
    closingBalance: 0,
    incomeTotal: 0,
    expenseTotal: 0
  };
  public format = 'dd-MM-yyyy';
  public exportData = [];
  public filteredTotal = {
    exportingFiltered: false,
    openingBalance: 0,
    creditTotal: 0,
    debitTotal: 0,
    closingBalance: 0
  };
  public balSheet = {
    liabilities: [],
    assets: [],
    assetTotal: 0,
    liabTotal: 0
  };
  public fy = {
    fromYear: '',
    toYear: ''
  };
  public hardRefresh = false;
  public bsHardRefresh = false;
  public plHardRefresh = false;
  public fyChecked = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private fnGroupWise: string;
  private selectedCompany: any;
  private csvGW: any;
  private uriGroupWise: string;

  /**
   * TypeScript public modifiers
   */
  constructor(private fb: FormBuilder) {

  }

  public formatCsvData(e) {
    // this.formatCsvDataGroupWise();
    // this.formatCsvDataCondensed();
    //   this.formatCsvDataAccountWise();
  }

  //
  // public formatCsvDataGroupWise() {
  //   let companyDetails;
  //   let csv;
  //   let groups;
  //   let header;
  //   let rawData;
  //   let row;
  //   let title;
  //   let total;
  //   groups = [];
  //   rawData = this.exportData;
  //   total = {
  //     ob: 0,
  //     cb: 0,
  //     cr: 0,
  //     dr: 0
  //   };
  //   csv = '';
  //   row = '';
  //   header = '';
  //   title = '' + ',' + 'Opening Balance' + ',' + 'Debit' + ',' + 'Credit' + ',' + 'Closing Balance' + '\n';
  //   this.fnGroupWise = 'Trial_Balance.csv';
  //   companyDetails = this.selectedCompany;
  //   header = companyDetails.name + '\r\n' + '"' + companyDetails.address + '"' + '\r\n' + companyDetails.city + '-' + companyDetails.pincode + '\r\n' + 'Trial Balance' + ': ' + this.fromDate.date + ' to ' + this.toDate.date + '\r\n';
  //   csv += header + '\r\n' + title;
  //   _.each(rawData, function(obj) {
  //     let group;
  //     group = {};
  //     group.name = obj.groupName;
  //     group.openingBalance = obj.forwardedBalance.amount;
  //     group.openingBalanceType = obj.forwardedBalance.type;
  //     group.credit = obj.creditTotal;
  //     group.debit = obj.debitTotal;
  //     group.closingBalance = obj.closingBalance.amount;
  //     group.closingBalanceType = obj.closingBalance.type;
  //     group.isVisible = obj.isVisible;
  //     return groups.push(group);
  //   });
  //   _.each(groups, function(obj) {
  //     if (obj.isVisible) {
  //       row += obj.name + ',' + obj.openingBalance + ' ' + obj.openingBalanceType + ' ' + obj.openingBalance + ',' + obj.debit + ',' + obj.credit + ',' + obj.closingBalance + obj.closingBalanceType + ' ' + obj.closingBalance + '\r\n';
  //       if (obj.openingBalanceType === 'DEBIT') {
  //         total.ob = total.ob + obj.openingBalance;
  //       } else {
  //         total.ob = total.ob - obj.openingBalance;
  //       }
  //       if (obj.closingBalanceType === 'DEBIT') {
  //         total.cb = total.cb + obj.closingBalance;
  //       } else {
  //         total.cb = total.cb - obj.closingBalance;
  //       }
  //       total.cr += obj.credit;
  //       return total.dr += obj.debit;
  //     }
  //   });
  //   if (total.ob < 0) {
  //     total.ob = total.ob * -1;
  //     total.ob = total.ob + ' Cr';
  //   } else {
  //     total.ob = total.ob + ' Dr';
  //   }
  //   if (total.cb < 0) {
  //     total.cb = total.cb * -1;
  //     total.cb = total.cb + ' Cr';
  //   } else {
  //     total.cb = total.cb + ' Dr';
  //   }
  //   csv += row + '\r\n';
  //   csv += '\r\n' + 'Total' + ',' + total.ob + ',' + total.dr + ',' + total.cr + ',' + total.cb + '\n';
  //   this.csvGW = csv;
  //   this.uriGroupWise = 'data:text/csv;charset=utf-8,' + (csv);
  //   this.showCsvDownloadOptions = true;
  // }
  //
  // public formatCsvDataCondensed() {
  // }
  //
  // public formatCsvDataAccountWise() {
  //
  // }
  //
  //
  public hideOptions() {
    this.showCsvDownloadOptions = false;
    this.showpdf = false;
    return false;
  }

  //
  // public showPdfOptions() {
  //
  // }
  //
  // public showTbXlsOptions() {
  //   this.showTbXls = true;
  //   return false;
  // }
  //
  // public downloadTbXls() {
  //   this.showCsvDownloadOptions = false;
  //   this.showTbXls = false;
  //   return false;
  //
  // }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    //
  }

}
