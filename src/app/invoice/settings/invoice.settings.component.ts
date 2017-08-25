import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { InvoiceSetting, InvoiceISetting, InvoiceWebhooks } from '../../models/interfaces/invoice.setting.interface';
import { AppState } from '../../store/roots';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoiceActions } from '../../services/actions/invoice/invoice.actions';

@Component({
  templateUrl: './invoice.settings.component.html'
})
export class InvoiceSettingComponent implements OnInit {
  
  public invoiceSetting: InvoiceISetting;
  public invoiceWebhook: InvoiceWebhooks[];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private invoiceActions: InvoiceActions) {
    this.store.dispatch(this.invoiceActions.getInvoiceSetting())  ;
    console.log('Hello');
    this.store.select(p => p.invoice.settings).takeUntil(this.destroyed$).subscribe((setting: InvoiceSetting) => {
      if (setting && setting.invoiceSettings && setting.webhooks) {
        this.invoiceSetting = _.cloneDeep(setting.invoiceSettings);
        this.invoiceWebhook = _.cloneDeep(setting.webhooks);
      }
    }
  );
  }

  public ngOnInit() {
    console.log('from InvoiceSettingComponent');
  }
}
