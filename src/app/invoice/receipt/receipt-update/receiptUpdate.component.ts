import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AppState } from '../../../store';
import { select, Store } from '@ngrx/store';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { Voucher } from '../../../models/api-models/recipt';
import { take, takeUntil } from 'rxjs/operators';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { SelectComponent } from '../../../theme/ng-select/select.component';
import * as _ from '../../../lodash-optimized';
import { ToasterService } from '../../../services/toaster.service';
import * as moment from 'moment';
import { GstEntry, ICommonItemOfTransaction, IContent, IInvoiceTax, IInvoiceTransaction } from '../../../models/api-models/Invoice';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { e } from '@angular/core/src/render3';

const THEAD = [
  {
    display: true,
    label: 'S no.',
    field: 'sNo'
  },
  {
    display: true,
    label: 'Date',
    field: 'date'
  },
  {
    display: true,
    label: 'Item',
    field: 'item'
  },
  {
    display: true,
    label: 'HSN/SAC',
    field: 'hsnSac'
  },
  {
    display: true,
    label: 'Qty.',
    field: 'quantity'
  },
  {
    display: true,
    label: 'Some label',
    field: 'description'
  },
  {
    display: true,
    label: 'Rate/ Item',
    field: 'rate'
  },
  {
    display: true,
    label: 'Dis./ Item',
    field: 'discount'
  },
  {
    display: true,
    label: 'Taxable Value',
    field: 'taxableValue'
  },
  {
    display: true,
    label: 'taxes',
    field: 'taxes'
  },
  {
    display: true,
    label: 'total',
    field: 'total'
  }
];

@Component({
  selector: 'app-receipt-update',
  templateUrl: 'receiptUpdate.component.html',
  styleUrls: [`receiptUpdate.component.scss`]
})

export class ReceiptUpdateComponent implements OnInit, OnDestroy {
  @Output() public closeModelEvent: EventEmitter<string> = new EventEmitter();
  public voucherFormDetails: Voucher;
  public voucher$: Observable<Voucher>;
  public giddhDateFormat: string = GIDDH_DATE_FORMAT;
  public giddhDateFormatUI: string = GIDDH_DATE_FORMAT_UI;
  public statesSource$: Observable<IOption[]> = observableOf([]);
  public customThead: IContent[] = THEAD;
  public autoFillShipping: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  @Input() public activatedInvoice: string;

  constructor(private store: Store<AppState>, private _toasty: ToasterService, private _cdRef: ChangeDetectorRef) {
    this.voucher$ = this.store.pipe(select((state: AppState) => state.receipt.voucher), takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.voucher$.subscribe(s => {
      if (s) {
        let voucherFormDetails: any = _.cloneDeep(s);

        if (voucherFormDetails.voucherDetails.voucherDate) {
          voucherFormDetails.voucherDetails.voucherDate =
            moment(voucherFormDetails.voucherDetails.voucherDate, GIDDH_DATE_FORMAT).toDate();
        }

        this.voucherFormDetails = voucherFormDetails;
        this._cdRef.detectChanges();
      }
    });

    // bind state sources
    this.store.select(p => p.general.states).pipe(takeUntil(this.destroyed$)).subscribe((states) => {
      let arr: IOption[] = [];
      if (states) {
        states.map(d => {
          arr.push({label: `${d.name}`, value: d.code});
        });
      }
      this.statesSource$ = observableOf(arr);
    });
  }

  public getStateCode(type: string, statesEle: SelectComponent) {
    let gstVal = _.cloneDeep(this.voucherFormDetails.accountDetails[type].gstNumber);
    if (gstVal && gstVal.length >= 2) {
      this.statesSource$.pipe(take(1)).subscribe(st => {
        let s = st.find(item => item.value === gstVal.substr(0, 2));
        if (s) {
          this.voucherFormDetails.accountDetails[type].stateCode = s.value;
        } else {
          this.voucherFormDetails.accountDetails[type].stateCode = null;
          this._toasty.clearAllToaster();
          this._toasty.warningToast('Invalid GSTIN.');
        }
        statesEle.disabled = true;
      });
    } else {
      statesEle.disabled = false;
      this.voucherFormDetails.accountDetails[type].stateCode = null;
    }
  }

  public autoFillShippingDetails() {
    // auto fill shipping address
    if (this.autoFillShipping) {
      this.voucherFormDetails.accountDetails.shippingDetails = _.cloneDeep(this.voucherFormDetails.accountDetails.billingDetails);
    }
  }

  public getSerialNos(entryIndex: number, transIndex: number) {
    // logic
    return entryIndex + 1 + transIndex;
  }

  public getEntryTotalDiscount(discountArr: ICommonItemOfTransaction[]): any {
    let count: number = 0;
    if (discountArr.length > 0) {
      _.forEach(discountArr, (item: ICommonItemOfTransaction) => {
        count += Math.abs(item.amount);
      });
    }
    if (count > 0) {
      return count;
    } else {
      return null;
    }
  }

  public getEntryTaxableAmount(transaction: IInvoiceTransaction, discountArr: ICommonItemOfTransaction[]): any {
    let count: number = 0;
    if (transaction.quantity && transaction.rate) {
      count = (transaction.rate * transaction.quantity) - this.getEntryTotalDiscount(discountArr);
    } else {
      count = transaction.amount - this.getEntryTotalDiscount(discountArr);
    }
    if (count > 0) {
      return count;
    } else {
      return null;
    }
  }

  public getTransactionTotalTax(taxArr: IInvoiceTax[]): any {
    let count: number = 0;
    if (taxArr.length > 0) {
      _.forEach(taxArr, (item: IInvoiceTax) => {
        count += item.amount;
      });
    }
    if (count > 0) {
      return count;
    } else {
      return null;
    }
  }

  public getEntryTotal(entry: GstEntry, idx: number): any {
    let count: number = 0;
    count = this.getEntryTaxableAmount(entry.transactions[idx], entry.discounts) + this.getTransactionTotalTax(entry.taxes);
    if (count > 0) {
      return count;
    } else {
      return null;
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
