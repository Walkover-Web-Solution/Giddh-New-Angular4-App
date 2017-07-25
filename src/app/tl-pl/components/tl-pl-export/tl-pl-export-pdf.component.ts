import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'tl-pl-export-pdf',  // <home></home>
  template: `
    <div class="form-group pdf-export">
      <a href="" (click)="showPdfOptions($event)" *ngIf="enableDownload"><img
        src="/assets/images/pdf-icon.png"/></a>
      <div class="export-options" *ngIf="showpdf">
        <span class="arrow"></span>
        <ul class="list-unstyled">
          <li><a href="" (click)="hideOptions($event)" export-pdfgroupwise>Group Wise
            Report</a></li>
          <li><a href="" (click)="hideOptions($event)" export-pdfcondensed>Condensed
            Report</a></li>
          <li><a href="" (click)="hideOptions($event)" export-pdfaccountwise>Account Wise
            Report</a></li>
        </ul>
      </div>
    </div>
    <!-- end form-group -->
  `
})
export class TlPlExportPdfComponent implements OnInit, OnDestroy {
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


  public hideOptions() {
    this.showCsvDownloadOptions = false;
    this.showpdf = false;
    return false;
  }

  public showPdfOptions() {
  }

  public showTbXlsOptions() {
    this.showTbXls = true;
    return false;
  }

  public downloadTbXls() {
    this.showCsvDownloadOptions = false;
    this.showTbXls = false;
    return false;

  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    //
  }

  public filterData() {

  }
}
