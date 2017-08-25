import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'pl-bs-export-xls',  // <home></home>
  template: `
    <div class="form-group xls-export">
      <a href="" (click)="downloadTbXls($event)" *ngIf="enableDownload"><img
        src="/assets/images/xls-icon.png"/></a>
    <!--end form-group -->
  `
})
export class PlBsExportXlsComponent implements OnInit, OnDestroy {

  public enableDownload: boolean = true;
  /**
   * TypeScript public modifiers
   */
  constructor(private fb: FormBuilder) {

  }

  public downloadTbXls(e: Event) {
    // this.showpdf = false;
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
