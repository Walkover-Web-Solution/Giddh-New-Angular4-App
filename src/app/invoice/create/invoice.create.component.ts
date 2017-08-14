import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { InvoiceActions } from '../../services/actions/invoice/invoice.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { PreviewAndGenerateInvoiceResponse } from '../../models/api-models/Invoice';
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
  private invoiceFormData: PreviewAndGenerateInvoiceResponse;

  constructor(
    private store: Store<AppState>,
    private invoiceActions: InvoiceActions,
    private invoiceService: InvoiceService
  ) {}

  public ngOnInit() {
    this.store.select(p => p.invoice).takeUntil(this.destroyed$).subscribe((o: InvoiceState) => {
      if (o.generate && o.generate.invoiceData) {
        this.invoiceFormData = _.cloneDeep(o.generate.invoiceData);
      }else {
        this.invoiceFormData = new PreviewAndGenerateInvoiceResponse();
      }
    });
  }

  public ngAfterViewInit() {
    // this.getInvoiceTemplateDetails('gst_template_a');
  }

  private onSubmitInvoiceForm(f: NgForm) {
    console.log (f, 'onSubmitInvoiceForm');
    console.log (this.invoiceFormData, 'actual class object');
  }

  private onCancelModal(e) {
    this.closeInvoiceModel.emit(Object.assign({}, e, {message: 'hey from InvoiceCreateComponent'}));
  }

  private getInvoiceTemplateDetails(templateUniqueName: string) {
    console.log ('bingo call api with: ', templateUniqueName);
    // due to some api side issue calling api by static value
    // this.store.dispatch(this.invoiceActions.GetTemplateDetailsOfInvoice(templateUniqueName));
    this.invoiceService.GetInvoiceTemplateDetails(templateUniqueName).subscribe((data) => {
      console.log (data);
    });
  }
}
