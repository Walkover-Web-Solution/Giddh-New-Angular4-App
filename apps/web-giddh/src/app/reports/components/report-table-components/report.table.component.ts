import {Component, Input, OnInit} from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import {ILedgersInvoiceResult} from "../../../models/api-models/Invoice";
import {ReportsModel} from "../../../models/api-models/Reports";


@Component({
  selector: 'reports-table-component',
  templateUrl: './report.table.component.html',
  styleUrls: ['./report.table.component.scss']
})
export class ReportsTableComponent implements OnInit {
  @Input() public reportRespone: ReportsModel[];
  @Input() public activeFinacialYr: any;
  @Input()salesRegisterTotal: any;

  ngOnInit() {
   }

  constructor() {
  }
}
