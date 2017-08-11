import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  templateUrl: './invoice.generate.component.html'
})
export class InvoiceGenerateComponent implements OnInit {

  // private navItems: INameUniqueName[] = INV_PAGE;
  // private selectedPage: string = null;

  constructor() {
    console.log('jingo');
  }

  public ngOnInit() {
    console.log('bingo');
  }
}
