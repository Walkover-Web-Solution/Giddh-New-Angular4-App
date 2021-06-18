import { Component } from '@angular/core';

@Component({
    selector: 'reports-dashboard',
    templateUrl: './reports.dashboard.component.html',
    styleUrls: ['./reports.dashboard.component.scss']
})

export class ReportsDashboardComponent {

    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor() { }
}
