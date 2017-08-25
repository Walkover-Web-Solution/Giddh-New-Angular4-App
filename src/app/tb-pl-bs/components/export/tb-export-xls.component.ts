import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'tb-export-xls',  // <home></home>
  template: `
    <div class="form-group xls-export" (clickOutside)="showTbXls=false;">
      <a href="" (click)="showTbXlsOptions($event)" *ngIf="enableDownload"><img
        src="/assets/images/xls-icon.png"/></a>
      <div class="export-options" *ngIf="showTbXls">
        <span class="arrow"></span>
        <ul class="list-unstyled">
          <li><a href="" (click)="downloadTbXls('main-group')">Main Group Report</a></li>
          <li><a href="" (click)="downloadTbXls('group')">All Group Report</a></li>
          <li><a href="" (click)="downloadTbXls('account')">All Account Report</a></li>
          <li><a href="" (click)="downloadTbXls('all')">Complete Report</a></li>
        </ul>
      </div>
    </div>
    <!--end form-group -->
  `
})
export class TbExportXlsComponent implements OnInit, OnDestroy {

  public enableDownload: boolean = true;

  public showTbXls: boolean;
  /**
   * TypeScript public modifiers
   */
  constructor(private fb: FormBuilder) {

  }

  public downloadTbXls(e: Event) {
    this.showTbXls = false;
    e.preventDefault();
    return false;
  }

  public showTbXlsOptions(e: Event) {
    this.showTbXls = !this.showTbXls;
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
