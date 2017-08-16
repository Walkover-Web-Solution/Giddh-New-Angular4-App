/**
 * Created by kunalsaxena on 8/16/17.
 */
import { FontPickerModule } from 'ngx-font-picker';
import { FontPickerConfigInterface } from 'ngx-font-picker';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store/roots';
import { InvoiceAction } from '../../../../../services/actions/invoice/invoice.actions';
import { InvoiceService } from '../../../../../services/invoice.services';
import { Component, OnInit } from '@angular/core';

const FONT_PICKER_CONFIG: FontPickerConfigInterface = {
  apiKey: 'AIzaSyAPcvNvidnjQL-a_2xW2QYox3hT7DQBWyo'
};

@Component({
  selector: 'font-selector',
  templateUrl: 'select.font.component.html'
})
export class SelectFontComponent implements OnInit {

  constructor(private store: Store<AppState>, private invoiceAction: InvoiceAction, private invoiceService: InvoiceService) {
  }

  public ngOnInit() {}
}
