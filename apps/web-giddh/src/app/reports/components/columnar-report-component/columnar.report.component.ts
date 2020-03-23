import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../store";


@Component({
    selector: 'columnar-report-component',
    templateUrl: './columnar.report.component.html',
    styleUrls: ['./columnar.report.component.scss']
})
export class ColumnarReportComponent implements OnInit {
    public selectedType = 'monthly';
    public monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    selectYear = [{ label: 'FY-APR2018-MAR2019', value: 'FY-APR2018-MAR2019' },
     { label: 'FY-APR2019-MAR2020', value: 'FY-APR2019-MAR2020' }]

     selectMonth = [{ label: 'Select All', value: 'Select All' },
     { label: 'Decemeber', value: 'Decemeber' },
     { label: 'Novmber', value: 'Novmber' }]

     selectEntryData = [{ label: 'Yes', value: 'Yes' },
     { label: 'No', value: 'No' }]

     selectCrDr = [{ label: 'Yes', value: 'Yes' },
     { label: 'No', value: 'No' }]
     

     constructor(private router: Router,) {

    }
    ngOnInit() {

    }
    
    public goToDashboard() {
        this.router.navigate(['/pages/reports']);
    }
    public populateRecords(interval, month?) {
        this.interval = interval;
        if (this.activeFinacialYr) {
            let startDate = this.activeFinacialYr.financialYearStarts.toString();
            let endDate = this.activeFinacialYr.financialYearEnds.toString();
            if (month) {
                this.selectedMonth = month;
                let startEndDate = this.getDateFromMonth(this.monthNames.indexOf(this.selectedMonth) + 1);
                startDate = startEndDate.firstDay;
                endDate = startEndDate.lastDay;
            } else {
                this.selectedMonth = null;
            }
            this.selectedType = interval.charAt(0).toUpperCase() + interval.slice(1);
            let request: ReportsRequestModel = {
                to: endDate,
                from: startDate,
                interval: interval,
            }
            this.companyService.getPurchaseRegister(request).subscribe((res) => {
                if (res.status === 'error') {
                    this._toaster.errorToast(res.message);
                } else {
                    this.purchaseRegisterTotal = new PurchaseReportsModel();
                    this.purchaseRegisterTotal.particular = this.activeFinacialYr.uniqueName;
                    this.reportRespone = this.filterReportResp(res.body);
                }
            });
        }
    }



}