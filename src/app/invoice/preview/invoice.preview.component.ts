import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  templateUrl: './invoice.preview.component.html'
})
export class InvoicePreviewComponent implements OnInit {

  constructor() {
    console.log('hello');
  }

  public ngOnInit() {
    console.log('from InvoicePreviewComponent');
  }
}
