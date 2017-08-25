import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { InvoiceActions } from '../../services/actions/invoice/invoice.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { PreviewAndGenerateInvoiceResponse, InvoiceTemplateDetailsResponse, ISection, IContent } from '../../models/api-models/Invoice';
import { InvoiceState } from '../../store/Invoice/invoice.reducer';
import { InvoiceService } from '../../services/invoice.service';

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
    field: 'tax'
  },
  {
    display: false,
    label: '',
    field: 'total'
  }
];

@Component({
  styleUrls: ['./invoice.create.component.css'],
  selector: 'invoice-create',
  templateUrl: './invoice.create.component.html'
})

export class InvoiceCreateComponent implements OnInit {

  public invFormData: PreviewAndGenerateInvoiceResponse;
  public tableCond: ISection;
  public invTempCond: InvoiceTemplateDetailsResponse;
  public customThead: IContent[] = THEAD;
  // public methods above
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private invoiceActions: InvoiceActions,
    private invoiceService: InvoiceService
  ) {}

  public ngOnInit() {
    this.store.select(p => p.invoice.generate.invoiceData)
      .takeUntil(this.destroyed$)
      .distinctUntilChanged()
      .subscribe((o: PreviewAndGenerateInvoiceResponse) => {
        if (o) {
          this.invFormData = _.cloneDeep(o);
        }else {
          this.invFormData = new PreviewAndGenerateInvoiceResponse();
        }
      }
    );

    this.store.select(p => p.invoice.generate.invoiceTemplateConditions)
      .takeUntil(this.destroyed$)
      .distinctUntilChanged()
      .subscribe((o: InvoiceTemplateDetailsResponse) => {
        if (o) {
          this.invTempCond =  _.cloneDeep(o);
          let obj =  _.cloneDeep(o);
          this.tableCond = _.find(obj.sections, ['sectionName', 'table']);
          console.log('bigo', this.tableCond);
          this.prepareThead();
        }
      }
    );
  }

  public prepareThead() {
    let obj =  _.cloneDeep(this.tableCond.content);
    _.map(this.customThead, (item: IContent) => {
      let res = _.find(this.tableCond.content, ['field', item.field ]);
      if (res) {
        item.display = res.display;
        item.label = res.label;
      }
    });
    console.log(this.customThead);
  }

  public onSubmitInvoiceForm(f: NgForm) {
    console.log (f, 'onSubmitInvoiceForm');
    console.log (this.invFormData, 'actual class object');
  }
}
