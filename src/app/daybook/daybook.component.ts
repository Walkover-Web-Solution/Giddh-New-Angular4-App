import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import * as moment from 'moment/moment';
import { TransactionsRequest } from 'app/models/api-models/Ledger';
import { ModalDirective } from 'ngx-bootstrap';
import { DaybookActions } from 'app/actions/daybook/daybook.actions';
import { DayBookResponseModel } from '../models/api-models/Daybook';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs';
import { createSelector } from 'reselect';
import { DaybookQueryRequest } from '../models/api-models/DaybookRequest';
import { DaterangePickerComponent } from '../theme/ng2-daterangepicker/daterangepicker.component';

@Component({
  selector: 'daybook',
  templateUrl: './daybook.component.html'
})
export class DaybookComponent implements OnDestroy {
  public companyName: string;
  public daybookQueryRequest: DaybookQueryRequest;
  public daybookData$: Observable<DayBookResponseModel>;
  @ViewChild('advanceSearchModel') public advanceSearchModel: ModalDirective;
  @ViewChild('dateRangePickerCmp', { read: DaterangePickerComponent }) public dateRangePickerCmp: DaterangePickerComponent;
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
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>, private _daybookActions: DaybookActions) {
    this.daybookQueryRequest = new DaybookQueryRequest();
    this.store.select(s => s.daybook.data).takeUntil(this.destroyed$).subscribe((data) => {
      if (data && data.entries.length) {
        data.entries.map(a => {
          a.isExpanded = false;
        });
      }
      this.daybookData$ = Observable.of(data);
    });
    let companyUniqueName;
    let company;
    store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$)
      .subscribe(p => companyUniqueName = p);

    store.select(p => p.session.companies).takeUntil(this.destroyed$)
      .subscribe(p => {
        company = p.find(q => q.uniqueName === companyUniqueName);
      });
    this.companyName = company.name;

    this.initialRequest();
  }
  public selectedDate(value: any) {
    this.daybookQueryRequest.from = moment(value.picker.startDate).format('DD-MM-YYYY');
    this.daybookQueryRequest.to = moment(value.picker.endDate).format('DD-MM-YYYY');
    this.daybookQueryRequest.page = 0;

    // this.getTransactionData();
  }
  public onOpenAdvanceSearch() {
    this.advanceSearchModel.show();
  }
  public closeAdvanceSearchPopup(obj) {
    if (!obj.cancle) {

      this.datePickerOptions.startDate = obj.fromDate;
      this.datePickerOptions.endDate = obj.toDate;
      this.dateRangePickerCmp.render();

      this.daybookQueryRequest.from = obj.fromDate;
      this.daybookQueryRequest.to = obj.toDate;
      this.store.dispatch(this._daybookActions.GetDaybook(obj.dataToSend, this.daybookQueryRequest));
    }
    this.advanceSearchModel.hide();
  }
  public go() {
    this.store.dispatch(this._daybookActions.GetDaybook(null, this.daybookQueryRequest));
  }

  public initialRequest() {
    this.daybookQueryRequest.from = this.daybookQueryRequest.from || this.datePickerOptions.startDate.format('DD-MM-YYYY');
    this.daybookQueryRequest.to = this.daybookQueryRequest.to || this.datePickerOptions.endDate.format('DD-MM-YYYY');
    this.go();
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
