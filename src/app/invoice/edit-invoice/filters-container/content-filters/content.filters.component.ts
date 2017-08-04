import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../../store/roots';
import { InvoiceAction } from '../../../../services/actions/invoice/invoice.actions';
import { Content } from '../../../../models/api-models/invoice';

@Component({
  selector: 'content-selector',

  templateUrl: 'content.filters.component.html'
})

export class ContentFilterComponent  {
  @Input() public content: boolean;
  @Input() public contentData: Content;
  public enableheading: boolean = true;
  // public data: Content = null;

  constructor(private store: Store<AppState>, public invoiceAction: InvoiceAction) {
    // console.log('design-filters-container constructor called');
  }

  public showTemplate(id) {
    this.store.dispatch(this.invoiceAction.setTemplateId(id));
  }

  public onEditChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.setHeading(data));
    console.log(data);
  }
  public onClickHeadingCheck(check) {
    if (check === 'false') {
      this.enableheading = false;
    }
  }
}
