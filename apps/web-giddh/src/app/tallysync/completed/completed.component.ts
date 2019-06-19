import {Observable, ReplaySubject} from 'rxjs';

import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';


import * as moment from 'moment/moment';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {ActivatedRoute} from '@angular/router';
import {ToasterService} from '../../services/toaster.service';
import {ActiveFinancialYear, CompanyResponse} from "../../../../../../Nativemobile/src/app/models/api-models/Company";

@Component({
  selector: 'app-completed-preview',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss'],
})
export class CompletedComponent implements OnInit, OnDestroy {

  public bsConfig: Partial<BsDatepickerConfig> = {
    showWeekNumbers: false,
    dateInputFormat: 'DD-MM-YYYY',
    rangeInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-green myDpClass'
  };
  public moment = moment;
  public startDate: Date;
  public endDate: Date;
  public activeFinancialYear: ActiveFinancialYear;
  public datePickerOptions: any = {
    hideOnEsc: true,
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
      'Last Quater': [
        moment().quarter(moment().quarter()).subtract(1, 'quarter').startOf('quarter'),
        moment().quarter(moment().quarter()).subtract(1, 'quarter').endOf('quarter')
      ],
      'Last Financial Year': [
        moment().startOf('year').subtract(10, 'year'),
        moment().endOf('year').subtract(10, 'year')
      ],
      'Last Year': [
        moment().startOf('year').subtract(1, 'year'),
        moment().endOf('year').subtract(1, 'year')
      ]
    },
    startDate: moment().subtract(30, 'days'),
    endDate: moment()
  };
  public companies$: Observable<CompanyResponse[]>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    private _toaster: ToasterService,
    private _activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {

  }

  public ngOnInit() {
    console.log("completed");
  }


  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
