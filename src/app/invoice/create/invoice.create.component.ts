import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { InvoiceActions } from '../../services/actions/invoice/invoice.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import {
  GenerateInvoiceRequestClass,
  GstEntry,
  ICommonItemOfTransaction,
  IContent,
  IInvoiceTax,
  IInvoiceTransaction,
  InvoiceTemplateDetailsResponse,
  ISection,
  PreviewInvoiceResponseClass,
  OtherDetailsClass
} from '../../models/api-models/Invoice';
import { InvoiceService } from '../../services/invoice.service';
import { Observable } from 'rxjs/Observable';
import { ToasterService } from '../../services/toaster.service';

// {
//   field: 'description'
// },
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
    field: 'itemCode'
  },
  {
    display: false,
    label: '',
    field: 'quantity'
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
  {
    display: false,
    label: '',
    field: 'taxableAmount'
  },
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

export class InvoiceCreateComponent implements OnInit {
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
  // public methods above
  public isInvoiceGenerated$: Observable<boolean>;
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
          if (o) {
            this.invFormData = _.cloneDeep(o);
            this.invFormData.other = new OtherDetailsClass();
            this.invoiceDataFound = true;
          }else {
            this.invoiceDataFound = false;
          }
          // else {
          //   this.invFormData = new PreviewInvoiceResponseClass();
          // }
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
        this.closePopupEvent();
        this.store.dispatch(this.invoiceActions.InvoiceGenerationCompleted());
      }
    });
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

  public onSubmitInvoiceForm() {
    let model: GenerateInvoiceRequestClass = new GenerateInvoiceRequestClass();
    let accountUniqueName = this.invFormData.account.uniqueName;
    if (accountUniqueName) {
      model.invoice = _.cloneDeep(this.invFormData);
      model.uniqueNames = this.getEntryUniqueNames(this.invFormData.entries);
      model.validateTax = true;
      model.updateAccountDetails = this.updtFlag;
      this.store.dispatch(this.invoiceActions.GenerateInvoice(accountUniqueName, model));
      this.updtFlag = false;
    }else {
      this._toasty.warningToast('Something went wrong, please reload the page');
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

  public closePopupEvent() {
    this.closeEvent.emit();
  }

  public getSerialNos(entryIndex: number, transIndex: number) {
    // logic
    return entryIndex + 1 + transIndex;
  }

}
