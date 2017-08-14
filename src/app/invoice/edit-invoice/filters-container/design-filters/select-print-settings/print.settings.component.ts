import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store/roots';
import { InvoiceAction } from '../../../../../services/actions/invoice/invoice.actions';

@Component({
  selector: 'print-settings',

  templateUrl: 'print.settings.component.html'
})

export class PrintSettingsComponent implements OnInit {
  constructor( private store: Store<AppState>, private invoiceAction: InvoiceAction, private invoiceService: InvoiceService) {
  }

  public ngOnInit() {
    console.log('design-filters-container initialised');

  }
  public onPageMarginChange(margin){
    if (margin === 'Top') {
      this.store.dispatch(this.invoiceAction.setTopPageMargin(margin));
    }
    if (margin === 'Left') {
      this.store.dispatch(this.invoiceAction.setLeftPageMargin(margin));
    }
    if (margin === 'Bottom') {
      this.store.dispatch(this.invoiceAction.setBottomPageMargin(margin));
    }
    if (margin === 'Right') {
      this.store.dispatch(this.invoiceAction.setRightPageMargin(margin));
    }
  }

}
