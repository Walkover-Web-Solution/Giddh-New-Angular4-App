import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  templateUrl: './purchase.invoice.component.html',
  styleUrls: ['purchase.invoice.component.css']
})
export class PurchaseInvoiceComponent {
  constructor(
    private router: Router,
    private location: Location
  ) {
    console.log('Hi this is purchase invoice component');
  }

}
