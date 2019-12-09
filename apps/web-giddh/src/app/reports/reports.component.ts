import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'reports',
    //templateUrl: './reports.component.html',
    template: '<router-outlet></router-outlet>',
    styleUrls: ['./components/report-dashboard/reports.dashboard.component.scss']
})
export class ReportsComponent implements OnInit {
    constructor() {
    }

    ngOnInit() {
    }
}
