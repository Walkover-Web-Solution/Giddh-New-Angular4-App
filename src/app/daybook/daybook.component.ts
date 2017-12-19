import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import * as moment from 'moment/moment';
import { TransactionsRequest } from 'app/models/api-models/Ledger';
import { ModalDirective } from 'ngx-bootstrap';
import { DaybookActions } from 'app/actions/daybook/daybook.actions';

@Component({
  selector: 'daybook',
  templateUrl: './daybook.component.html'
})
export class DaybookComponent {
  public trxRequest: TransactionsRequest;
  public dateRange: string;
  public companyName: string;
  @ViewChild('advanceSearchModel') public advanceSearchModel: ModalDirective;
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
  constructor(private store: Store<AppState>, private _daybookActions: DaybookActions) {
    // this.trxRequest = new TransactionsRequest();
    let companyUniqueName;
    let company;
    store.select(p => p.session.companyUniqueName)
      .subscribe(p => companyUniqueName = p);

    store.select(p => p.session.companies)
      .subscribe(p => {
        company = p.find(q => q.uniqueName === companyUniqueName);
      });
    this.companyName = company.name;
  }
  public selectedDate(value: any) {
    this.dateRange = `${moment(value.picker.startDate).format('DD-MM-YYYY')} - ${moment(value.picker.endDate).format('DD-MM-YYYY')}`;
    // this.trxRequest.from = moment(value.picker.startDate).format('DD-MM-YYYY');
    // this.trxRequest.to = moment(value.picker.endDate).format('DD-MM-YYYY');
    // this.trxRequest.page = 0;

    // this.getTransactionData();
  }
  public onOpenAdvanceSearch() {
    this.advanceSearchModel.show();
  }
  public closeAdvanceSearchPopup(obj) {
    if (!obj.cancle) {
      this.datePickerOptions.startDate = obj.fromDate;
      this.datePickerOptions.endDate = obj.toDate;
      this.store.dispatch(this._daybookActions.GetDaybook(obj.dataToSend, obj.fromDate, obj.toDate));
      this.advanceSearchModel.hide();
    }
  }
  public go(obj) {
    this.datePickerOptions.startDate = obj.fromDate;
    this.datePickerOptions.endDate = obj.toDate;
    this.store.dispatch(this._daybookActions.GetDaybook(obj.dataToSend, obj.fromDate, obj.toDate));
  }
}
