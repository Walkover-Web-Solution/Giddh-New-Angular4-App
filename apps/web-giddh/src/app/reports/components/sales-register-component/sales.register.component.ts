import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';


@Component({
    selector: 'sales-register-component',
    templateUrl: './sales.register.component.html',
    styleUrls: ['./sales.register.component.scss']
})
export class SalesRegisterComponent implements OnInit {

    bsValue = new Date();

    ngOnInit() {

    }
    constructor() {

    }
}
