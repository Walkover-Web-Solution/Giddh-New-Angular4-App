import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';


@Component({
  selector: 'sales-register-expand',
  templateUrl: './sales.register.expand.component.html',
  styleUrls: ['./sales.register.expand.component.scss']
})
export class SalesRegisterExpandComponent implements OnInit {

  bsValue = new Date();

  items = [
    {date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', VoucherNumber: 201902043, sales: 2300, return: 2300, discount: 2300, tax: 290},
    {date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', VoucherNumber: 201902043, sales: 2300, return: 2300, discount: 2300, tax: 290},
    {date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', VoucherNumber: 201902043, sales: 2300, return: 2300, discount: 2300, tax: 290},
    {date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', VoucherNumber: 201902043, sales: 2300, return: 2300, discount: 2300, tax: 290},
    {date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', VoucherNumber: 201902043, sales: 2300, return: 2300, discount: 2300, tax: 290},
    {date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', VoucherNumber: 201902043, sales: 2300, return: 2300, discount: 2300, tax: 290},
    {date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', VoucherNumber: 201902043, sales: 2300, return: 2300, discount: 2300, tax: 290},
    {date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', VoucherNumber: 201902043, sales: 2300, return: 2300, discount: 2300, tax: 290},
    {date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', VoucherNumber: 201902043, sales: 2300, return: 2300, discount: 2300, tax: 290},
    {date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', VoucherNumber: 201902043, sales: 2300, return: 2300, discount: 2300, tax: 290},
  ];
  
  ngOnInit() {
   
  }
  constructor() {
    
  }
}