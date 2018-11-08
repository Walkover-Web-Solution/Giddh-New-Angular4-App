import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { Observable, ReplaySubject, of } from 'rxjs';
import { GstRReducerState, GstOverViewResponse, TransactionSummary } from 'app/store/GstR/GstR.reducer';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

export const TransactionType = [
  {label: 'Invoices', value: 'invoices'},
  {label: 'Credit Notes', value: 'credit-notes'},
  {label: 'Advance Payments', value: 'advance-payments'},
  {label: 'Refund Vouchers', value: 'debit-notes'},
  {label: 'Debit Notes', value: 'debit-notes'},
];

export const InvoiceType = [
  {label: 'All', value: 'all'},
  {label: 'B2B', value: 'b2b'},
  {label: 'B2CL', value: 'b2cs'},
  {label: 'B2CS', value: 'b2cl'},
  {label: 'Export', value: 'export'},
  {label: 'Nil', value: 'nil'},
];

export const Entitytype = [
  {label: 'All', value: 'all'},
  {label: 'Registered', value: 'registered'},
  {label: 'Unregistered', value: 'unregistered'},
];

export const Status = [
  {label: 'All', value: 'all'},
  {label: 'Uploaded', value: 'uploaded'},
  {label: 'Unuploaded', value: 'unuploaded'},
];

export const filterTransaction = {
  entityType: '',
  type: 'all',
  status: 'all',
  page: '',
  count: ''
};

@Component({
  selector: 'view-transactions',
  templateUrl: './view-transactions.component.html',
  styleUrls: ['view-transactions.component.css'],
})

export class ViewTransactionsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public currentPeriod: any = null;
  @Input() public selectedGst: string = null;
  @Input() public activeCompanyGstNumber: string = null;
  @Input() public isTransactionSummary: boolean;

  public viewTransaction$: Observable<TransactionSummary> = of(null);
  public entityType = TransactionType;
  public invoiceType = InvoiceType;
  public otherEntityType = Entitytype;
  public status = Status;
  public selectedEntityType: string = '';
  public companyGst$: Observable<string> = of('');
  public filterParam = filterTransaction;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private gstAction: GstReconcileActions, private _store: Store<AppState>, private _route: Router, private activatedRoute: ActivatedRoute) {
    this.viewTransaction$ = this._store.select(p => p.gstR.viewTransactionData).pipe(takeUntil(this.destroyed$));
    this.companyGst$ = this._store.select(p => p.gstR.activeCompanyGst).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {

    this.activatedRoute.firstChild.params.subscribe(params => {
      this.filterParam['entityType'] = params.entityType;
    });

    this.filterParam['from'] = this.currentPeriod.from;
    this.filterParam['to'] = this.currentPeriod.to;
    this.filterParam['gstin'] = this.activeCompanyGstNumber;

    this.viewFilteredTxn('page', 1);
    //
  }

  /**
   * viewFilteredTxn
   */
  public viewFilteredTxn(filter, val) {
    this.filterParam[filter] = val;
    this._store.dispatch(this.gstAction.GetSummaryTransaction(this.selectedGst, this.filterParam));
  }

  public goBack() {
    this._route.navigate(['pages', 'gstfiling', 'filing-return', this.selectedGst, this.currentPeriod.from, this.currentPeriod.to]);
  }

  /**
   * pageChanged
   */
  public pageChanged(event) {
    this.viewFilteredTxn('page', event.page);
  }

  /**
   * ngOnChanges
   */
  public ngOnChanges(s: SimpleChanges) {
    //
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    this.destroyed$.next(true);
  }
}
