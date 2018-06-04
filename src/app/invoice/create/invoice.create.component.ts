import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { GenerateInvoiceRequestClass, GstEntry, ICommonItemOfTransaction, IContent, IInvoiceTax, IInvoiceTransaction, InvoiceTemplateDetailsResponse, ISection, PreviewInvoiceResponseClass } from '../../models/api-models/Invoice';
import { InvoiceService } from '../../services/invoice.service';
import { Observable } from 'rxjs/Observable';
import { ToasterService } from '../../services/toaster.service';
import { OtherSalesItemClass } from '../../models/api-models/Sales';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';

const THEAD = [
  {
    display: false,
    label: '',
    field: 'sNo'
  },
  {
    display: true,
    label: 'Date',
    field: 'date'
  },
  {
    display: false,
    label: '',
    field: 'item'
  },
  {
    display: false,
    label: '',
    field: 'hsnSac'
  },
  {
    display: false,
    label: '',
    field: 'quantity'
  },
  {
    display: false,
    label: '',
    field: 'description'
  },
  {
    display: false,
    label: '',
    field: 'rate'
  },
  {
    display: false,
    label: '',
    field: 'discount'
  },
  // {
  //   display: false,
  //   label: '',
  //   field: 'taxableAmount'
  // },
  {
    display: false,
    label: '',
    field: 'taxableValue'
  },
  {
    display: false,
    label: '',
    field: 'taxes'
  },
  {
    display: false,
    label: '',
    field: 'total'
  }
];

@Component({
  styleUrls: ['./invoice.create.component.scss'],
  selector: 'invoice-create',
  templateUrl: './invoice.create.component.html'
})

export class InvoiceCreateComponent implements OnInit, OnDestroy {
  @Input() public showCloseButton: boolean;
  @Output() public closeEvent: EventEmitter<string> = new EventEmitter<string>();
  public invFormData: PreviewInvoiceResponseClass;
  public tableCond: ISection;
  public headerCond: ISection;
  public templateHeader: any = {};
  public invTempCond: InvoiceTemplateDetailsResponse;
  public customThead: IContent[] = THEAD;
  public updtFlag: boolean = false;
  public totalBalance: number = null;
  public invoiceDataFound: boolean = false;
  public isInvoiceGenerated$: Observable<boolean>;
  public updateMode: boolean;
  public giddhDateFormat: string = GIDDH_DATE_FORMAT;
  public giddhDateFormatUI: string = GIDDH_DATE_FORMAT_UI;
  // public methods above
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private invoiceActions: InvoiceActions,
    private _toasty: ToasterService,
    private invoiceService: InvoiceService
  ) {
    this.isInvoiceGenerated$ = this.store.select(state => state.invoice.isInvoiceGenerated).takeUntil(this.destroyed$).distinctUntilChanged();
  }

  public ngOnInit() {
    this.store.select(p => p.invoice.invoiceData)
      .takeUntil(this.destroyed$)
      .distinctUntilChanged()
      .subscribe((o: PreviewInvoiceResponseClass) => {
        if (o && o.invoiceDetails) {
          this.invFormData = _.cloneDeep(o);
          if (o.invoiceDetails.invoiceDate) {
            let d = o.invoiceDetails.invoiceDate.split('-');
            if (d.length === 3) {
              this.invFormData.invoiceDetails.invoiceDate = new Date(d[2], d[1] - 1, d[0]);
            } else {
              this.invFormData.invoiceDetails.invoiceDate = '';
            }
            if (this.invFormData.invoiceDetails.invoiceNumber === '##########') {
              this.invFormData.invoiceDetails.invoiceNumber = null;
            }
          }
          if (o.invoiceDetails.dueDate) {
            let d = o.invoiceDetails.dueDate.split('-');
            if (d.length === 3) {
              this.invFormData.invoiceDetails.dueDate = new Date(d[2], d[1] - 1, d[0]);
            } else {
              this.invFormData.invoiceDetails.dueDate = '';
            }
          }
          // if address found prepare local var due to array and string issue
          this.prepareAddressForUI('billingDetails');
          this.prepareAddressForUI('shippingDetails');
          if (!this.invFormData.other) {
            this.invFormData.other = new OtherSalesItemClass();
          }

          // replace br to /n in case of message
          if (this.invFormData.other.message2 && this.invFormData.other.message2.length > 0) {
            this.invFormData.other.message2 = this.invFormData.other.message2.replace(/<br \/>/g, '\n');
          }

          this.invoiceDataFound = true;
        }else {
          this.invoiceDataFound = false;
        }
      }
    );

    this.store.select(p => p.invoice.invoiceTemplateConditions)
      .takeUntil(this.destroyed$)
      .distinctUntilChanged()
      .subscribe((o: InvoiceTemplateDetailsResponse) => {
        if (o) {
          this.invTempCond = _.cloneDeep(o);
          let obj = _.cloneDeep(o);
          this.tableCond = _.find(obj.sections, {sectionName: 'table'});
          this.headerCond = _.find(obj.sections, {sectionName: 'header'});
          this.prepareThead();
          this.prepareTemplateHeader();
        }
      }
    );

    this.isInvoiceGenerated$.subscribe((o) => {
      if (o) {
        let action = (this.updateMode) ? 'update' : 'generate';
        this.closePopupEvent({action});
      }
    });

    this.store.select(state => state.invoice.visitedFromPreview)
      .takeUntil(this.destroyed$)
      .distinctUntilChanged()
      .subscribe((val: boolean) => {
        this.updateMode = val;
      }
    );
  }

  public getArrayFromString(str) {
    if (str && str.length > 0 ) {
      return str.split('\n');
    }else {
      return [];
    }
  }

  public getStringFromArr(arr) {
    if (Array.isArray(arr) && arr.length > 0 ) {
      return arr.toString().replace(RegExp(',', 'g'), '\n');
    }else {
      return null;
    }
  }

  public prepareAddressForUI(type: string) {
    this.invFormData.account[type].addressStr = this.getStringFromArr(this.invFormData.account[type].address);
  }

  public prepareAddressForAPI(type: string) {
    this.invFormData.account[type].address = this.getArrayFromString(this.invFormData.account[type].addressStr);
  }

  public prepareTemplateHeader() {
    let obj = _.cloneDeep(this.headerCond.content);
    let dummyObj = {};
    _.forEach(obj, (item: IContent) => {
      dummyObj[item.field] = item;
    });
    // sorting object
    Object.keys(dummyObj).sort().forEach( (key) => {
      this.templateHeader[key] = dummyObj[key];
    });
  }

  public prepareThead() {
    let obj = _.cloneDeep(this.tableCond.content);
    _.map(this.customThead, (item: IContent) => {
      let res = _.find(this.tableCond.content, {field: item.field});
      if (res) {
        item.display = res.display;
        item.label = res.label;
      }
    });
  }

  public setUpdateAccFlag() {
    this.updtFlag = true;
    this.onSubmitInvoiceForm();
  }

  public convertDateForAPI(val: any): string {
    if (val) {
      try {
        return moment(val).format(GIDDH_DATE_FORMAT);
      } catch (error) {
        return '';
      }
    }else {
      return '';
    }
  }

  public onSubmitInvoiceForm() {
    let model: GenerateInvoiceRequestClass = new GenerateInvoiceRequestClass();
    let data: PreviewInvoiceResponseClass = _.cloneDeep(this.invFormData);

    // replace /n to br in case of message
    if (data.other.message2 && data.other.message2.length > 0) {
      data.other.message2 = data.other.message2.replace(/\n/g, '<br />');
    }

    // convert address string to array
    data.account['billingDetails'].address = this.getArrayFromString(data.account['billingDetails'].addressStr);
    data.account['shippingDetails'].address = this.getArrayFromString(data.account['shippingDetails'].addressStr);

    // convert date object
    data.invoiceDetails.invoiceDate = this.convertDateForAPI(data.invoiceDetails.invoiceDate);
    data.invoiceDetails.dueDate = this.convertDateForAPI(data.invoiceDetails.dueDate);
    data.other.shippingDate = this.convertDateForAPI(data.other.shippingDate);

    let accountUniqueName = this.invFormData.account.uniqueName;
    if (accountUniqueName) {
      model.invoice = data;
      model.uniqueNames = this.getEntryUniqueNames(this.invFormData.entries);
      model.validateTax = true;
      model.updateAccountDetails = this.updtFlag;
      if (this.updateMode) {
        this.store.dispatch(this.invoiceActions.UpdateGeneratedInvoice(accountUniqueName, model));
      }else {
        this.store.dispatch(this.invoiceActions.GenerateInvoice(accountUniqueName, model));
      }
      this.updtFlag = false;
    }else {
      // this._toasty.warningToast('Something went wrong, please reload the page');
    }
  }

  public getEntryUniqueNames(entryArr: GstEntry[]): string[] {
    let arr: string[] = [];
    _.forEach(entryArr, (item: GstEntry) => {
      arr.push(item.uniqueName);
    });
    return arr;
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
    }else {
      return null;
    }
  }

  public getEntryTotal(entry: GstEntry, idx: number): any {
    let count: number = 0;
    count = this.getEntryTaxableAmount(entry.transactions[idx], entry.discounts) + this.getTransactionTotalTax(entry.taxes);
    if (count > 0) {
      return count;
    }else {
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
    }else {
      return null;
    }
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
    }else {
      return null;
    }
  }

  public closePopupEvent(o) {
    this.closeEvent.emit(o);
  }

  public getSerialNos(entryIndex: number, transIndex: number) {
    // logic
    return entryIndex + 1 + transIndex;
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
