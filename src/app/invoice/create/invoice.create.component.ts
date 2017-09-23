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
    field: 'tax'
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
  // public methods above
  public isInvoiceGenerated$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private invoiceActions: InvoiceActions,
    private invoiceService: InvoiceService
  ) {
    this.isInvoiceGenerated$ = this.store.select(state => state.invoice.generate.isInvoiceGenerated).takeUntil(this.destroyed$).distinctUntilChanged();
  }

  public ngOnInit() {
    this.store.select(p => p.invoice.generate.invoiceData)
      .takeUntil(this.destroyed$)
      .distinctUntilChanged()
      .subscribe((o: PreviewInvoiceResponseClass) => {
          if (o) {
            this.invFormData = _.cloneDeep(o);
          } else {
            this.invFormData = new PreviewInvoiceResponseClass();
          }
          this.invFormData.other = new OtherDetailsClass();
        }
      );

    this.store.select(p => p.invoice.generate.invoiceTemplateConditions)
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
    model.invoice = _.cloneDeep(this.invFormData);
    model.uniqueNames = this.getEntryUniqueNames(this.invFormData.entries);
    model.validateTax = true;
    model.updateAccountDetails = this.updtFlag;
    this.store.dispatch(this.invoiceActions.GenerateInvoice(accountUniqueName, model));
    this.updtFlag = false;
  }

  public getEntryUniqueNames(entryArr: GstEntry[]): string[] {
    let arr: string[] = [];
    _.forEach(entryArr, (item: GstEntry) => {
      arr.push(item.uniqueName);
    });
    return arr;
  }

  public getTransactionTotalTax(taxArr: IInvoiceTax[]): number {
    let count: number = 0;
    if (taxArr.length > 0) {
      _.forEach(taxArr, (item: IInvoiceTax) => {
        count += item.amount;
      });
    }
    return count;
  }

  public getEntryTotal(entry: GstEntry, idx: number): number {
    let count: number = 0;
    count = this.getEntryTaxableAmount(entry.transactions[idx], entry.discounts) + this.getTransactionTotalTax(entry.taxes);
    return count;
  }

  public getEntryTaxableAmount(transaction: IInvoiceTransaction, discountArr: ICommonItemOfTransaction[]): number {
    let count: number = 0;
    if (transaction.quantity && transaction.rate) {
      count = (transaction.rate * transaction.quantity) - this.getEntryTotalDiscount(discountArr);
    } else {
      count = transaction.amount + this.getEntryTotalDiscount(discountArr);
    }
    return count;
  }

  public getEntryTotalDiscount(discountArr: ICommonItemOfTransaction[]): number {
    let count: number = 0;
    if (discountArr.length > 0) {
      _.forEach(discountArr, (item: ICommonItemOfTransaction) => {
        count += Math.abs(item.amount);
      });
    }
    return count;
  }

  public closePopupEvent() {
    this.closeEvent.emit();
  }

  public getSerialNos(entryIndex: number, transIndex: number) {
    // logic
    return entryIndex + 1 + transIndex;
  }

}
