import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IOption } from '../../theme/ng-select/ng-select';
import { NgForm } from '@angular/forms';
import { RecurringInvoice, RecurringInvoices } from '../../models/interfaces/RecurringInvoice';
import { Observable, ReplaySubject } from 'rxjs';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import * as moment from 'moment';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-recurring',
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.scss'],
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

export class RecurringComponent implements OnInit, OnDestroy {
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
  public modalConfig = {
    animated: true,
    keyboard: true,
    backdrop: 'static',
    ignoreBackdropClick: true
  };
  @ViewChild('advanceSearch') public advanceSearch: ModalDirective;
  public showInvoiceNumberSearch = false;
  public showCustomerNameSearch = false;
  public allItemsSelected: boolean = false;
  public recurringVoucherDetails: RecurringInvoice[];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>,
              private cdr: ChangeDetectorRef,
              private _invoiceActions: InvoiceActions) {
    this.recurringData$ = this.store.select(s => s.invoice.recurringInvoiceData.recurringInvoices);
    this.recurringData$.subscribe(p => {
      if (p) {
        this.recurringVoucherDetails = _.cloneDeep(p.recurringVoucherDetails);
      }
    });
  }

  public ngOnInit() {
    this.invoiceTypeOptions = [
      {label: 'Active', value: 'active'},
      {label: 'InActive', value: 'inactive'},
    ];

    this.intervalOptions = [
      {label: 'Weekly', value: 'weekly'},
      {label: 'Monthly', value: 'monthly'},
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

  public advanceSearchPopup() {
    this.advanceSearch.show();
  }

  public toggleAllItems(type: boolean) {
    this.allItemsSelected = type;
    if (this.recurringVoucherDetails && this.recurringVoucherDetails.length) {
      this.recurringVoucherDetails = _.map(this.recurringVoucherDetails, (item: RecurringInvoice) => {
        item.isSelected = this.allItemsSelected;
        return item;
      });
      // this.insertItemsIntoArr();
    }
  }

  public toggleItem(item: any, action: boolean) {
    item.isSelected = action;
    if (action) {
      // this.countAndToggleVar();
    } else {
      this.allItemsSelected = false;
    }
    // this.insertItemsIntoArr();
  }

  public clickedOutside(event, el, field: 'invoiceNumber' | 'accountUniqueName') {
    // if (this.invoiceSearchRequest[field] !== '') {
    //   return;
    // }
    //
    // if (this.childOf(event.target, el)) {
    //   return;
    // } else {
    //   if (field === 'invoiceNumber') {
    //     this.showInvoiceNoSearch = false;
    //   } else {
    //     this.showCustomerSearch = false;
    //   }
    // }
  }

  /* tslint:disable */
  public childOf(c, p) {
    while ((c = c.parentNode) && c !== p) {
    }
    return !!c;
  }

  public advanceSearchPopupClose() {
    this.advanceSearch.hide();
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

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
