import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'tb-export-pdf',  // <home></home>
  template: `
    <div class="form-group pdf-export" (clickOutside)="showpdf=false;">
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
export class TbExportPdfComponent implements OnInit, OnDestroy {

  public enableDownload: boolean = true;

  public showpdf: boolean;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private fb: FormBuilder) {

  }

  public hideOptions(e: Event) {
    this.showpdf = false;
    e.preventDefault();
    return false;
  }

  public showPdfOptions(e: Event) {
    this.showpdf = !this.showpdf;
    e.preventDefault();
    return false;
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    //
  }

  public filterData() {
    //
  }
}
