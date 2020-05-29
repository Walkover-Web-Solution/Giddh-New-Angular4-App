import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'cash-flow-statement-component',
    templateUrl: './cash.flow.statement.component.html',
    styleUrls: ['./cash.flow.statement.component.scss']
})
export class CashFlowStatementComponent implements OnInit {

    bsValue = new Date();

    ngOnInit() {

    }
    constructor() {

    }
}
