/**
 * Created by kunalsaxena on 9/1/17.
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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
  templateUrl: './purchase.component.html'
})
export class PurchaseComponent {
  constructor(
    private router: Router,
    private location: Location
  ) {
    console.log('Hi this is purchase component');
  }

}
