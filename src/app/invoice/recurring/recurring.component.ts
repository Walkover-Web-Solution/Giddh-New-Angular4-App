import { animate, ChangeDetectorRef, Component, OnInit, state, style, transition, trigger } from '@angular/core';
import { IOption } from '../../theme/ng-select/ng-select';
import { NgForm } from '@angular/forms';
import { RecurringInvoice, RecurringInvoices } from '../../models/interfaces/RecurringInvoice';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import * as moment from 'moment';

@Component({
  selector: 'app-recurring',
  templateUrl: './recurring.component.html',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})

export class RecurringComponent implements OnInit {
  public currentPage = 1;
  public asideMenuStateForRecurringEntry: string = 'out';
  public invoiceTypeOptions: IOption[];
  public intervalOptions: IOption[];
  public recurringData$: Observable<RecurringInvoices>;
  public selectedInvoice: RecurringInvoice;
  public filter = {
    status: '',
    customerName: '',
    duration: '',
    lastInvoiceDate: ''
  };

  constructor(private store: Store<AppState>,
              private cdr: ChangeDetectorRef,
              private _invoiceActions: InvoiceActions) {
    this.recurringData$ = this.store.select(s => s.invoice.recurringInvoiceData.recurringInvoices);
    this.recurringData$.subscribe(p => this.cdr.reattach());
  }

  public ngOnInit() {
    this.invoiceTypeOptions = [
      {label: 'Active', value: 'active'},
      {label: 'InActive', value: 'inactive'},
    ];

    this.intervalOptions = [
      {label: 'Weekly', value: 'weekly'},
      {label: 'Quarterly', value: 'quarterly'},
      {label: 'Halfyearly', value: 'halfyearly'},
      {label: 'Yearly', value: 'yearly'}
    ];
    this.store.dispatch(this._invoiceActions.GetAllRecurringInvoices());
  }

  public openUpdatePanel(invoice: RecurringInvoice) {
    this.selectedInvoice = invoice;
    this.toggleRecurringAsidePane();
  }

  public pageChanged({page}) {
    this.cdr.detach();
    this.currentPage = page;
    this.store.dispatch(this._invoiceActions.GetAllRecurringInvoices(undefined, page));
  }

  public toggleRecurringAsidePane(toggle?: string): void {
    if (toggle) {
      this.asideMenuStateForRecurringEntry = toggle;
    } else {
      this.asideMenuStateForRecurringEntry = this.asideMenuStateForRecurringEntry === 'out' ? 'in' : 'out';
    }
    this.toggleBodyClass();
  }

  public toggleBodyClass() {
    if (this.asideMenuStateForRecurringEntry === 'in') {
      document.querySelector('body').classList.add('fixed');
    } else {
      document.querySelector('body').classList.remove('fixed');
    }
  }

  public submit(f: NgForm) {
    const filter = {...this.filter};
    if (filter.lastInvoiceDate) {
      filter.lastInvoiceDate = moment(filter.lastInvoiceDate).format('DD-MM-YYYY');
    }
    if (Object.keys(filter).some(p => filter[p])) {
      this.store.dispatch(this._invoiceActions.GetAllRecurringInvoices(filter));
    } else {
      this.store.dispatch(this._invoiceActions.GetAllRecurringInvoices());
    }
  }
}
