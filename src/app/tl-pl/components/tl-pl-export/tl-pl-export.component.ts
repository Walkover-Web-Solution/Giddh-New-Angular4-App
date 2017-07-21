import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'tl-pl-export',  // <home></home>
  templateUrl: './tl-pl-export.component.html'
})
export class TlPlExportComponent implements OnInit, OnDestroy {
  public showFromDatePicker: boolean;
  public showToDatePicker: boolean;
  public toDate: Date;
  public fromDate: Date;
  public moment = moment;

  /**
   * TypeScript public modifiers
   */
  constructor(private fb: FormBuilder) {

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
