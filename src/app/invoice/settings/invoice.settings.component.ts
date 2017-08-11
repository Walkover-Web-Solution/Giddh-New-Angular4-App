import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  templateUrl: './invoice.settings.component.html'
})
export class InvoiceSettingsComponent implements OnInit {

  constructor() {
    console.log('Hello');
  }

  public ngOnInit() {
    console.log('from  InvoiceSettingsComponent');
  }
}
