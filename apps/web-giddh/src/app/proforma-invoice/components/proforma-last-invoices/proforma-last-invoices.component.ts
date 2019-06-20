import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'proforma-last-invoices-component',
  templateUrl: './proforma-last-invoices.component.html',
  styleUrls: [`./proforma-last-invoices.component.scss`]
})

export class ProformaLastInvoicesComponent implements OnInit {
  @Output() public invoiceSelected: EventEmitter<{ accountUniqueName: string, invoiceNo: string }> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onInvoiceSelected() {
    this.invoiceSelected.emit({accountUniqueName: 'customer1', invoiceNo: 'EST-20190620-3'});
  }

  public clickInside(event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
