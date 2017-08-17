import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { InvoiceActions } from '../../services/actions/invoice/invoice.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { PreviewAndGenerateInvoiceResponse, GetInvoiceTemplateDetailsResponse, ISection } from '../../models/api-models/Invoice';
import { InvoiceState } from '../../store/Invoice/invoice.reducer';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  styleUrls: ['./invoice.create.component.css'],
  selector: 'invoice-create',
  templateUrl: './invoice.create.component.html'
})

export class InvoiceCreateComponent implements OnInit, AfterViewInit {

  @Input() public actionType: string;
  @Output() public closeInvoiceModel: EventEmitter<boolean> = new EventEmitter(true);
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private invFormData: PreviewAndGenerateInvoiceResponse;
  private invTempCond: GetInvoiceTemplateDetailsResponse;
  private tableCond: ISection;

  constructor(
    private store: Store<AppState>,
    private invoiceActions: InvoiceActions,
    private invoiceService: InvoiceService
  ) {}

  public ngOnInit() {
    this.store.select(p => p.invoice).takeUntil(this.destroyed$).subscribe((o: InvoiceState) => {
      if (o && o.generate && o.generate.invoiceData) {
        this.invFormData = _.cloneDeep(o.generate.invoiceData);
      }else {
        this.invFormData = new PreviewAndGenerateInvoiceResponse();
      }
    });
    this.store.select(p => p.invoice).takeUntil(this.destroyed$).subscribe((o: InvoiceState) => {
      if (o && o.generate && o.generate.invoiceTemplateConditions) {
        this.invTempCond =  _.cloneDeep(o.generate.invoiceTemplateConditions);
        // find table condition in object and assign it to local var
        let obj =  _.cloneDeep(o.generate.invoiceTemplateConditions);
        this.tableCond = _.find(obj.sections, ['sectionName', 'table']);
      }
    });
  }

  public ngAfterViewInit() {
    // this.getInvoiceTemplateDetails('gst_template_a');
  }

  private onSubmitInvoiceForm(f: NgForm) {
    console.log (f, 'onSubmitInvoiceForm');
    console.log (this.invFormData, 'actual class object');
  }

  private onCancelModal(e) {
    this.closeInvoiceModel.emit(Object.assign({}, e, {message: 'hey from InvoiceCreateComponent'}));
  }
}
