import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import * as moment from 'moment/moment';
import { TransactionsRequest } from 'app/models/api-models/Ledger';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'daybook',
  templateUrl: './daybook.component.html'
})
export class DaybookComponent {
  // public trxRequest: TransactionsRequest;
  public dateRange: string;
public companyName:string;
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
  constructor(private store: Store<AppState>) {
    // this.trxRequest = new TransactionsRequest();
    let companyUniqueName, company;
    store.select(p => p.session.companyUniqueName)
      .subscribe(p => companyUniqueName = p);

    store.select(p => p.session.companies)
      .subscribe(p => {
        company = p.find(q => q.uniqueName === companyUniqueName)
      });
      this.companyName=company.name;
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
  public closeAdvanceSearchPopup() {
    this.advanceSearchModel.hide();
  }
}
