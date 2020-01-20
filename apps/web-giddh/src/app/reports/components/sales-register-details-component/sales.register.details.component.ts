import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';


@Component({
    selector: 'sales-ragister-details',
    templateUrl: './sales.register.details.component.html',
    styleUrls: ['./sales.register.details.component.scss']
})
export class SalesRegisterDetailsComponent implements OnInit {

    bsValue = new Date();

    items = [
        { date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', Number: 201902043, sales: 2300, return: 2300, netSales: 2300 },
        { date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', Number: 201902043, sales: 2300, return: 2300, netSales: 2300 },
        { date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', Number: 201902043, sales: 2300, return: 2300, netSales: 2300 },
        { date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', Number: 201902043, sales: 2300, return: 2300, netSales: 2300 },
        { date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', Number: 201902043, sales: 2300, return: 2300, netSales: 2300 },
        { date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', Number: 201902043, sales: 2300, return: 2300, netSales: 2300 },
        { date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', Number: 201902043, sales: 2300, return: 2300, netSales: 2300 },
        { date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', Number: 201902043, sales: 2300, return: 2300, netSales: 2300 },
    ];
    public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {

        // add sorting code here...
    }



    constructor() {

    }
    ngOnInit() {

    }
}
