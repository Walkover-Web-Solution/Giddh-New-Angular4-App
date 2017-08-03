/**
 * Created by kunalsaxena on 6/29/17.
 */

import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'edit-invoice',

  templateUrl: 'edit.invoice.component.html'
})

export class EditInvoiceComponent implements OnInit {
  constructor() {
    console.log('edit-invoice-component');
  }

  public ngOnInit() {
    console.log('edit-invoice-component');

  }

}
