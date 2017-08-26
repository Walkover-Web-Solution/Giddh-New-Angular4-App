import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'tb-export-csv',  // <home></home>
  template: `
    <div class="form-group export" (clickOutside)="showCsvDownloadOptions=false;">
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
export class TbExportCsvComponent implements OnInit, OnDestroy {
  public showCsvDownloadOptions: boolean;
  public enableDownload: boolean = true;


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

  public formatCsvData(e: Event) {
    this.showCsvDownloadOptions = !this.showCsvDownloadOptions;
    e.preventDefault();
    return false;
  }

  public hideOptions(e: Event) {
    this.showCsvDownloadOptions = false;
    e.preventDefault();
    return false;
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    //
  }

}
