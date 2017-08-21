import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { InvoiceActions } from '../../services/actions/invoice/invoice.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoiceFormClass } from '../../models/api-models/Sales';
import { InvoiceState } from '../../store/Invoice/invoice.reducer';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  styleUrls: ['./invoice.create.component.css'],
  selector: 'invoice-create',
  templateUrl: './invoice.create.component.html'
})

export class InvoiceCreateComponent implements OnInit {

  public invFormData: InvoiceFormClass;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>
  ) {}

  public ngOnInit() {
    // this.store.select(p => p.invoice.generate.invoiceData)
    //   .takeUntil(this.destroyed$)
    //   .distinctUntilChanged()
    //   .subscribe((o: PreviewAndGenerateInvoiceResponse) => {
    //     if (o) {
    //       this.invFormData = _.cloneDeep(o);
    //     }else {
    //       this.invFormData = new PreviewAndGenerateInvoiceResponse();
    //     }
    //   }
    // );
  }

  public onSubmitInvoiceForm(f: NgForm) {
    console.log (f, 'onSubmitInvoiceForm');
    console.log (this.invFormData, 'actual class object');
  }
}
