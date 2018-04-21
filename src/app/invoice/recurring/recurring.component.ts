import { Component, OnInit } from '@angular/core';
import { IOption } from '../../theme/ng-select/ng-select';
import { NgForm } from '@angular/forms';
import { RecurringInvoice } from '../../models/interfaces/RecurringInvoice';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-recurring',
  templateUrl: './recurring.component.html'
})

export class RecurringComponent implements OnInit {
  public invoiceTypeOptions: IOption[];
  public intervalOptions: IOption[];
  public recurringData$: Observable<RecurringInvoice[]>;
  constructor(private store: Store<AppState>) {
    this.recurringData$ = this.store.select(s => s.invoice.recurringInvoiceData);
  }

  public ngOnInit() {
    this.invoiceTypeOptions = [
      { label: 'Active', value: 'active' },
      { label: 'Stopped', value: 'stopped' },
      { label: 'Expired', value: 'expired' }
    ];

    this.intervalOptions = [
      { label: 'Weekly', value: 'weekly' },
      { label: 'Quarterly', value: 'qarterly' },
      { label: 'Halfyearly', value: 'halfyearly' },
      { label: 'Yearly', value: 'yearly' }
    ];
  }

  public submit(f: NgForm) {
    if (f.valid) {
      //
    } else {
      return;
    }
  }
}
