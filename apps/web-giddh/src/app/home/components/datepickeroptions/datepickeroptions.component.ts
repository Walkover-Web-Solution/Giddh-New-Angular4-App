import {Component, Input, Output, OnInit, ViewChild, ElementRef, EventEmitter} from '@angular/core';
import * as moment from 'moment/moment';
import * as _ from 'lodash';
import {GIDDH_DATE_FORMAT} from "../../../shared/helpers/defaultDateFormat";

@Component({
  selector: 'datepickeroptions',
  templateUrl: 'datepickeroptions.component.html',
  styleUrls: ['../../home.component.scss']
})

export class DatepickeroptionsComponent implements OnInit {

  @Output() public filterDates: EventEmitter<any> = new EventEmitter(null);
  @ViewChild('dateRangePickerCmp') public dateRangePickerCmp: ElementRef;
  public moment = moment;
  public datePickerOptions: any = {
    hideOnEsc: true,
    opens: 'left',
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
      'This Month to Date': [
        moment().startOf('month'),
        moment()
      ],
      'This Quarter to Date': [
        moment().quarter(moment().quarter()).startOf('quarter'),
        moment()
      ],
      'This Financial Year to Date': [
        moment().startOf('year').subtract(9, 'year'),
        moment()
      ],
      'This Year to Date': [
        moment().startOf('year'),
        moment()
      ],
      'Last Month': [
        moment().subtract(1, 'month').startOf('month'),
        moment().subtract(1, 'month').endOf('month')
      ],
      'Last Quarter': [
        moment().quarter(moment().quarter()).subtract(1, 'quarter').startOf('quarter'),
        moment().quarter(moment().quarter()).subtract(1, 'quarter').endOf('quarter')
      ],
      'Last Financial Year': [
        moment().startOf('year').subtract(10, 'year'),
        moment().endOf('year').subtract(10, 'year')
      ],
      'Last Year': [
        moment().subtract(1, 'year').startOf('year'),
        moment().subtract(1, 'year').endOf('year')
      ]
    },
    startDate: moment().subtract(30, 'days'),
    endDate: moment()
  };

  constructor() {

  }

  public ngOnInit() {

  }

  public setFilterDate(ev) {
    let data = ev ? _.cloneDeep(ev) : null;
    if (data && data.picker) {
      this.filterDates.emit([moment(data.picker.startDate._d).format(GIDDH_DATE_FORMAT), moment(data.picker.endDate._d).format(GIDDH_DATE_FORMAT)]);
    }
  }
}
