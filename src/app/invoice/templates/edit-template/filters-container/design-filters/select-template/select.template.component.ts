import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../../store/roots';
import { InvoiceActions } from '../../../../../../services/actions/invoice/invoice.actions';

@Component({
  selector: 'template-selector',

  templateUrl: 'select.template.component.html'
})

export class SelectTemplateComponent  {
  constructor(private store: Store<AppState>, public invoiceAction: InvoiceActions) {
  }

  public showTemplate(id) {
    this.store.dispatch(this.invoiceAction.setTemplateId(id));
  }
}
