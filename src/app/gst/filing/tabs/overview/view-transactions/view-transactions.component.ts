import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { Observable, ReplaySubject, of } from 'rxjs';
import { GstRReducerState, GstOverViewResponse } from 'app/store/GstR/GstR.reducer';
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

@Component({
  selector: 'view-transactions',
  templateUrl: './view-transactions.component.html',
  styleUrls: ['view-transactions.component.css'],
})

export class ViewTransactionsComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() public selectedPeriod: string = null;
  @Input() public selectedGst: string = null;
  @Input() public activeCompanyGstNumber: string = null;

  public gstOverviewData$: Observable<GstOverViewResponse>;
  public entityType = TransactionType;
  public invoiceType = InvoiceType;
  public otherEntityType = Entitytype;
  public status = Status;
  public selectedEntityType: string = '';
  public companyGst$: Observable<string> = of('');

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private gstAction: GstReconcileActions, private _store: Store<AppState>, private _route: Router, private activatedRoute: ActivatedRoute) {
    this.gstOverviewData$ = this._store.select(p => p.gstR.overViewData).pipe(takeUntil(this.destroyed$));
    this.companyGst$ = this._store.select(p => p.gstR.activeCompanyGst).pipe(takeUntil(this.destroyed$));

  }

  public ngOnInit() {
    this.companyGst$.subscribe(a => {
      if (a) {
        this.selectedGst = a;
      }
    });
    this.activatedRoute.params.subscribe(params => {
      this.selectedPeriod = params['period'];
      this.selectedGst = params['selectedGst'];
    });
    //
  }

  /**
   * viewFilteredTxn
   */
  public viewFilteredTxn() {

  }

  public goBack() {
    this._route.navigate(['pages', 'gstfiling', 'filing-return', this.selectedPeriod]);
  }

  /**
   * ngOnChanges
   */
  public ngOnChanges(s: SimpleChanges) {
    //
  }

  /**
   * ngViewAfterInit
   */
  public ngAfterViewInit() {
      //
  }
}
