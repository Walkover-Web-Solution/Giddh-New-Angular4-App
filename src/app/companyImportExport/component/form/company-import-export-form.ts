import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { IOption } from '../../../theme/ng-select/option.interface';
import * as moment from 'moment';
import { AccountResponse } from '../../../models/api-models/Account';

@Component({
  selector: 'company-import-export-form-component',
  templateUrl: 'company-import-export-form.html',
})

export class CompanyImportExportFormComponent implements OnInit {
  @Input('mode') public mode: 'export' | 'import' = 'export';
  @Output('backPressed') public backPressed: EventEmitter<boolean> = new EventEmitter();
  public fileTypes: IOption[] = [
    { label: 'Accounting Entries', value: 'Accounting Entries' },
    { label: 'Master Except Accounts', value: 'Master Except Accounts' },
  ];
  public fileType: string = '';
  public datePickerOptions: any = {
    locale: {
      applyClass: 'btn-green',
      applyLabel: 'Go',
      fromLabel: 'From',
      format: 'D-MMM-YY',
      toLabel: 'To',
      cancelLabel: 'Cancel',
      customRangeLabel: 'Custom range'
    },
    ranges: {
      'Last 1 Day': [
        moment().subtract(1, 'days'),
        moment()
      ],
      'Last 7 Days': [
        moment().subtract(6, 'days'),
        moment()
      ],
      'Last 30 Days': [
        moment().subtract(29, 'days'),
        moment()
      ],
      'Last 6 Months': [
        moment().subtract(6, 'months'),
        moment()
      ],
      'Last 1 Year': [
        moment().subtract(12, 'months'),
        moment()
      ]
    },
    startDate: moment().subtract(30, 'days'),
    endDate: moment()
  };

  constructor() {
    //
  }

  public ngOnInit() {
    //
  }

  public selectedDate(value: any) {
    let from = moment(value.picker.startDate, 'DD-MM-YYYY').toDate();
    let to = moment(value.picker.endDate, 'DD-MM-YYYY').toDate();
  }

  public save() {
    if (this.mode === 'export') {
      //
    } else {
      //
    }
  }
}
