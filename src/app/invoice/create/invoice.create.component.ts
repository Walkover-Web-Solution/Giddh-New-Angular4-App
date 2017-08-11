import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';

@Component({
  styleUrls: ['./invoice.create.component.css'],
  selector: 'invoice-create',
  templateUrl: './invoice.create.component.html'
})

export class InvoiceCreateComponent implements OnInit {

  @Input() public actionType: string;
  @Output() public closeInvoiceModel: EventEmitter<boolean> = new EventEmitter(true);

  constructor() {
    console.log('Hello');
  }

  public ngOnInit() {
    console.log('From InvoiceCreateComponent');
  }

  private onSubmitInvoiceForm(f: NgForm) {
    console.log (f, 'onSubmitInvoiceForm');
  }

  private onCancelModal(e) {
    this.closeInvoiceModel.emit(Object.assign({}, e, {message: 'hey from InvoiceCreateComponent'}));
  }
}
