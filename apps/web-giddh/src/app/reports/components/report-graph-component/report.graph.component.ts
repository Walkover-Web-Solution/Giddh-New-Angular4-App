import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'reports-graph-component',
    templateUrl: './report.graph.component.html',
    styleUrls: ['./report.graph.component.scss']
})
export class ReportsGraphComponent implements OnInit {

    bsValue = new Date();

    ngOnInit() {

    }

    constructor() {

    }
}
