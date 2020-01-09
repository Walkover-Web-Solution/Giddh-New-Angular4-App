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

    openDetailedSalesReport() {
        this.router.navigate(['/pages/reports/reports-details']);
    }

    openReverseChargeReport() {
        this.router.navigate(['/pages/reports/reverse-charge']);
    }
}
