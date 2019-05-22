import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'proforma-last-invoices-component',
  templateUrl: './proforma-last-invoices.component.html',
  styleUrls: [`./proforma-last-invoices.component.scss`]
})

export class ProformaLastInvoicesComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }

  public clickInside(event) {
    event.preventDefault();
    event.stopPropagation();  // <- that will stop propagation on lower layers
  }
}
