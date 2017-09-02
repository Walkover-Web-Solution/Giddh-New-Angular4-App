import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BsDropdownConfig } from 'ngx-bootstrap';
import { Daterangepicker } from 'ng2-daterangepicker';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import * as  moment from 'moment';

const otherFiltersOptions = [
  { name: 'GSTIN Empty', uniqueName: 'GSTIN Empty' },
  { name: 'GSTIN Filled', uniqueName: 'GSTIN Filled' },
  { name: 'Invoice Empty', uniqueName: 'Invoice Empty' },
  { name: 'Invoice Filled', uniqueName: 'Invoice Filled' }
];

@Component({
  selector: 'invoice-purchase',
  templateUrl: './purchase.invoice.component.html',
  styleUrls: ['purchase.invoice.component.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { autoClose: false } }]
})
export class PurchaseInvoiceComponent {

  public otherFilters: any[] = otherFiltersOptions;
  //  public dateInputs: any = [
  //       {
  //           start: moment().subtract(12, 'month'),
  //           end: moment().subtract(6, 'month')
  //       },
  //       {
  //           start: moment().subtract(9, 'month'),
  //           end: moment().subtract(6, 'month')
  //       },
  //       {
  //           start: moment().subtract(4, 'month'),
  //           end: moment()
  //       },
  //       {
  //           start: moment(),
  //           end: moment().add(5, 'month'),
  //       }
  //   ];

    public mainInput = {
        start: moment().subtract(12, 'month'),
        end: moment().subtract(6, 'month')
    };

    public singleDate: any;

    public eventLog = '';

  constructor(
    private router: Router,
    private location: Location,
    private daterangepickerOptions: DaterangepickerConfig
  ) {
    console.log('Hi this is purchase invoice component');
    this.daterangepickerOptions.settings = {
        locale: { format: 'YYYY-MM-DD' },
        alwaysShowCalendars: false,
        ranges: {
            'Last Month': [moment().subtract(1, 'month'), moment()],
            'Last 3 Months': [moment().subtract(4, 'month'), moment()],
            'Last 6 Months': [moment().subtract(6, 'month'), moment()],
            'Last 12 Months': [moment().subtract(12, 'month'), moment()],
        }
    };

    // this.singleDate = Date.now();
  }

  public calendarEventsHandler(e: any) {
        console.log(e);
        this.eventLog += '\nEvent Fired: ' + e.event.type;
  }
  private selectedDate(value: any, dateInput: any) {
        dateInput.start = value.start;
        dateInput.end = value.end;
    }

    private singleSelect(value: any) {
        this.singleDate = value.start;
    }

    private applyDate(value: any, dateInput: any) {
        dateInput.start = value.start;
        dateInput.end = value.end;
    }

}
