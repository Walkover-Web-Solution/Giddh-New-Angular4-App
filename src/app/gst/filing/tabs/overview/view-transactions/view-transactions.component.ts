import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit, OnDestroy, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { Observable, ReplaySubject, of } from 'rxjs';
import { GstRReducerState, GstOverViewResponse, TransactionSummary } from 'app/store/GstR/GstR.reducer';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceActions } from 'app/actions/invoice/invoice.actions';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { DownloadOrSendInvoiceOnMailComponent } from 'app/invoice/preview/models/download-or-send-mail/download-or-send-mail.component';
import { ElementViewContainerRef } from 'app/shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { InvoiceReceiptActions } from 'app/actions/invoice/receipt/receipt.actions';

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
  {label: 'B2CL', value: 'b2cl'},
  {label: 'B2CS', value: 'b2cs'},
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
  @ViewChild('downloadOrSendMailModel') public downloadOrSendMailModel: ModalDirective;
  @ViewChild('downloadOrSendMailComponent') public downloadOrSendMailComponent: ElementViewContainerRef;
  @ViewChild('invoiceGenerateModel') public invoiceGenerateModel: ModalDirective;

  public viewTransaction$: Observable<TransactionSummary> = of(null);
  public entityType = TransactionType;
  public invoiceType = InvoiceType;
  public otherEntityType = Entitytype;
  public status = Status;
  public selectedEntityType: string = '';
  public companyGst$: Observable<string> = of('');
  public filterParam = filterTransaction;
  public imgPath: string = '';
  public modalRef: BsModalRef;
  public modalConfig = {
    animated: true,
    keyboard: false,
    backdrop: 'static',
    ignoreBackdropClick: true
  };
  public viewTransactionInProgress$: Observable<boolean> = of(null);

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private gstAction: GstReconcileActions, private _store: Store<AppState>, private _route: Router, private activatedRoute: ActivatedRoute, private invoiceActions: InvoiceActions, private componentFactoryResolver: ComponentFactoryResolver, private modalService: BsModalService, private invoiceReceiptActions: InvoiceReceiptActions) {
    this.viewTransaction$ = this._store.select(p => p.gstR.viewTransactionData).pipe(takeUntil(this.destroyed$));
    this.companyGst$ = this._store.select(p => p.gstR.activeCompanyGst).pipe(takeUntil(this.destroyed$));
    this.viewTransactionInProgress$ = this._store.select(p => p.gstR.viewTransactionInProgress).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.imgPath = isElectron ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';

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
   * onSelectInvoice
   */
  /**
   * onSelectInvoice
   */
  public onSelectInvoice(invoice) {
    // this.selectedInvoice = _.cloneDeep(invoice);
    let downloadVoucherRequestObject = {
      voucherNumber: [invoice.voucherNumber],
      voucherType: invoice.voucherType,
      accountUniqueName: invoice.account.uniqueName
    };
    this._store.dispatch(this.invoiceReceiptActions.VoucherPreview(downloadVoucherRequestObject, downloadVoucherRequestObject.accountUniqueName));
    // this.store.dispatch(this.invoiceActions.PreviewOfGeneratedInvoice(invoice.account.uniqueName, invoice.voucherNumber));
    this.loadDownloadOrSendMailComponent();
    this.downloadOrSendMailModel.show();
  }

  public loadDownloadOrSendMailComponent() {
    let transactionData = null;
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(DownloadOrSendInvoiceOnMailComponent);
    let viewContainerRef = this.downloadOrSendMailComponent.viewContainerRef;
    viewContainerRef.remove();

    let componentInstanceView = componentFactory.create(viewContainerRef.parentInjector);
    viewContainerRef.insert(componentInstanceView.hostView);

    let componentInstance = componentInstanceView.instance as DownloadOrSendInvoiceOnMailComponent;
    componentInstance.closeModelEvent.subscribe(e => this.closeDownloadOrSendMailPopup(e));
    // componentInstance.downloadOrSendMailEvent.subscribe(e => this.onDownloadOrSendMailEvent(e));
    // componentInstance.downloadInvoiceEvent.subscribe(e => this.ondownloadInvoiceEvent(e));
  }

  public closeDownloadOrSendMailPopup(userResponse: { action: string }) {
    this.downloadOrSendMailModel.hide();
    if (userResponse.action === 'update') {
      this._store.dispatch(this.invoiceActions.VisitToInvoiceFromPreview());
      this.invoiceGenerateModel.show();
    } else if (userResponse.action === 'closed') {
      this._store.dispatch(this.invoiceActions.ResetInvoiceData());
    }
  }

  public closeInvoiceModel(e) {
    this.invoiceGenerateModel.hide();
    setTimeout(() => {
      this._store.dispatch(this.invoiceActions.ResetInvoiceData());
    }, 2000);
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    this.destroyed$.next(true);
  }
}
