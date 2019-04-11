import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { AppState } from 'app/store';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { GstReconcileService } from 'app/services/GstReconcile.service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { NilSummaryResponse } from 'app/store/GstR/GstR.reducer';
import { takeUntil } from 'rxjs/operators';

export const requestParam = {
      period: '',
      gstin: '',
      gstReturnType: 'failedtransactions',
      page: 1,
      count: 20
};

@Component({
  selector: 'failed-transactions',
  templateUrl: './failed-transactions.component.html',
  styles: [`
  #content_wrapper {
    padding-bottom: 0px !important;
  }
    `],
  styleUrls: ['failed-transactions.component.css'],
})
export class FailedTransactionsComponent implements OnInit, OnChanges {

  @Input() public currentPeriod: string = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';


  salesInvoice = [
    {SerialNumber:1, InvoiceVoucherNumber: 20190210-36, Type : 'INVOICE', Messages: 'The Tax Rates Differ Between The B2CS Invoice And The Vouchers. Voucher Numbers: CR-20190210-17.'},{SerialNumber:2, InvoiceVoucherNumber: 20190210-28	, Type : 'INVOICE', Messages: 'The Tax Rates Differ Between The B2CS Invoice And The Vouchers. Voucher Numbers: DR-20190210-9, DR-20190210-7, DR-20190210-8, CR-20190210-14.'},{SerialNumber:3, InvoiceVoucherNumber: 20190210-19, Type : 'INVOICE', Messages: 'The Invoice Contains IGST When The Pos Of Company And Account Are Same.'},{SerialNumber:4, InvoiceVoucherNumber: 20190210-30, Type : 'INVOICE', Messages: 'The Invoice Does Not Have HSN.'},{SerialNumber:5, InvoiceVoucherNumber: 20190210-27, Type : 'INVOICE', Messages: 'The Voucher Value(S) For Nil Invoice Is More Than The Invoice Total. Voucher Numbers: CR-20190210-11, CR-20190210-12, DR-20190210-5, DR-20190210-6.'},
    {SerialNumber:6, InvoiceVoucherNumber: 'DR-20190210-2', Type: 'VOUCHER', Messages: 'GSTR1 Data Does Not Exist For The Voucher. Sync Data And Try Again.'},{SerialNumber:7, InvoiceVoucherNumber: 'CR-20190210-1', Type: 'VOUCHER', Messages: 'GSTR1 Data Does Not Exist For The Voucher. Sync Data And Try Again.'},{SerialNumber:8, InvoiceVoucherNumber: 'CR-20190210-13', Type: 'VOUCHER', Messages: 'GSTR1 Data Does Not Exist For The Voucher. Sync Data And Try Again.'},{SerialNumber:9, InvoiceVoucherNumber: 'CR-20190210-4', Type: 'VOUCHER', Messages: 'No Invoice Found Against Voucher With Invoice Number 123.'},{SerialNumber:10, InvoiceVoucherNumber: 'CR-20190210-2', Type: 'VOUCHER', Messages: 'GSTR1 Data Does Not Exist For The Voucher. Sync Data And Try Again.'},{SerialNumber:11, InvoiceVoucherNumber: 'CR-20190210-3', Type: 'VOUCHER', Messages: 'GSTR1 Data Does Not Exist For The Voucher. Sync Data And Try Again.'},{SerialNumber:12, InvoiceVoucherNumber: 'CR-20190210-5', Type: 'VOUCHER', Messages: 'The Invoice Contains IGST When The Pos Of Company And Account Are Same.'},{SerialNumber:13, InvoiceVoucherNumber: 'DR-20190210-1', Type: 'VOUCHER', Messages: 'GSTR1 Data Does Not Exist For The Voucher. Sync Data And Try Again.'},{SerialNumber:14, InvoiceVoucherNumber: 'CR-20190210-16', Type: 'VOUCHER', Messages: 'GSTR1 Data Does Not Exist For The Voucher. Sync Data And Try Again.'},
  ]

  public failedTransactionsSummary$: Observable<any> = of(null);
  public failedTransactionsSummaryInProgress$: Observable<boolean>;
  public request = requestParam;
  public imgPath: string = '';

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _store: Store<AppState>, private gstrAction: GstReconcileActions, private gstService: GstReconcileService) {
    this.failedTransactionsSummary$ = this._store.select(p => p.gstR.failedTransactionsSummary);
    this.failedTransactionsSummaryInProgress$ = this._store.select(p => p.gstR.failedTransactionsSummaryInProgress).pipe(takeUntil(this.destroyed$));

    //
  }

  public ngOnInit() {
    this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
  }

  public pageChanged(event) {
    this.request['page'] = event.page;
    this._store.dispatch(this.gstrAction.GetReturnSummary(this.selectedGst, this.request));
  }

  /**
   * ngOnChnages
  */
  public ngOnChanges(s: SimpleChanges) {

    //
  }

}
