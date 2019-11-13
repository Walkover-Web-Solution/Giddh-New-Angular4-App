
import {Component, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vat-report',
  styles: [`
    .invoice-bg {
        padding-top: 15px;
    }

    .invoce-controll ::ng-deep.nav > li > a {
        padding: 2px 0px !important;
        margin-right: 35px !important;
          padding-bottom: 7px !important;
          font-size:16px;
              color: #262626 !important;
    }

    .invoce-controll ::ng-deep.nav-tabs > li.active > a {
        border-bottom: 4px solid #01A9F4 !important;
        color:#262626 !important;
    }

    .invoce-controll ::ng-deep.nav.nav-tabs {
        margin-bottom: 20px;
        padding: 12px 0px 0 15px !important;
        background-color: #F7F8FD;
        z-index: 9;
        position: relative;
        top: -4px;
    }

    .invoce-controll .invoice-nav.navbar-nav > li > a:hover {
        background-color: #ff5f00;
        color: #fff;
    }

    .invoce-controll .invoice-nav.navbar-nav > li > a.active {
        background-color: #fff;
        color: #ff5f00;
    }

    .navbar {
        min-height: auto;
        margin-bottom: 10px;
    }

    @media (max-width: 768px) {
        .invoce-controll ::ng-deep.nav.nav-tabs {
            margin-bottom: 28px;
            padding: 10px 0px 0 15px !important;
        }
    }

    @media (max-width: 500px) {
        .invoce-controll ::ng-deep.nav.nav-tabs {
            margin-bottom: 28px;
            padding: 10px 0px 0 0 !important;
            border-bottom: 1px solid #ddd;
            overflow-x: auto;
            white-space: nowrap;
            display: inline-block;
            width: 100%;
            overflow-y: hidden;
            cursor: pointer !important;
        }

        .invoce-controll ::ng-deep.nav-tabs > li {
            display: inline-block;
        }
    }

`],
  styleUrls: ['./vatReport.component.css'],
  templateUrl: './vatReport.component.html'
})
// VatReportComponent
// InvoiceComponent
export class VatReportComponent {

  vatReports = [
    { No: '1a', items: 'Standard rated supplies in Abu Dhabi', info: 'icon-info', amount: 213, vatAmount: 123, Adjustment: 1000 },
    { No: '1a', items: 'Standard rated supplies in Abu Dhabi', info: 'icon-info', amount: 213, vatAmount: 123, Adjustment: 1000 },
    { No: '1a', items: 'Standard rated supplies in Abu Dhabi', info: 'icon-info', amount: 213, vatAmount: 123, Adjustment: 1000 },
    { No: '1a', items: 'Standard rated supplies in Abu Dhabi', info: 'icon-info', amount: 213, vatAmount: 123, Adjustment: 1000 },
    { No: '1a', items: 'Standard rated supplies in Abu Dhabi', info: 'icon-info', amount: 213, vatAmount: 123, Adjustment: 1000 },
    { No: '1a', items: 'Standard rated supplies in Abu Dhabi', info: 'icon-info', amount: 213, vatAmount: 123, Adjustment: 1000 },
  ]


  constructor() { }
   ngOnInit() { }
}
