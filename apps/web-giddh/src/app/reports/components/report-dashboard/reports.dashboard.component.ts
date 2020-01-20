import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
    selector: 'reports-dashboard',
    templateUrl: './reports.dashboard.component.html',
    styleUrls: ['./reports.dashboard.component.scss']
})
export class ReportsDashboardComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
    }
}
