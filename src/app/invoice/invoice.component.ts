import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { INameUniqueName } from '../models/interfaces/nameUniqueName.interface';
import * as _ from 'lodash';

@Component({
  styles: [`
    .invoice-bg{
      background-color: #f4f5f8;
      padding: 20px;
    }
    .invoice-nav.navbar-nav>li>a{
      padding: 6px 30px;
      font-size:14px;
      color:#333;
      background-color: #e6e6e6
    }
    .invoice-nav.navbar-nav>li>a:hover{
      background-color: #ff5f00;
      color: #fff;
    }
    .invoice-nav.navbar-nav>li>a.active{
      background-color: #fff;
      color: #ff5f00;
    }
  `],
  templateUrl: './invoice.component.html'
})
export class InvoiceComponent {

  // private navItems: INameUniqueName[] = INV_PAGE;
  // private selectedPage: string = null;

  constructor(
    private router: Router,
    private location: Location
  ) {}

}
