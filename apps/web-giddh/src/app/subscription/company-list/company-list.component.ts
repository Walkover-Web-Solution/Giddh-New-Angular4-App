import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubscriptionReportRequest } from '../../models/api-models/Subscriptions';
export interface PeriodicElement {
    name: string;
    count: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { name: "Walkover", count: 2 },
    { name: "Hello", count: 5 },
    { name: "Segmento", count: 8 },
];
@Component({
    selector: 'company-list',
    templateUrl: './company-list.component.html',
    styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
    /** Instance of company list */
    @ViewChild('companyList', { static: false }) public companyList: ElementRef;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** Stock Transactional Object */
    public subscriptionReportRequest: SubscriptionReportRequest = new SubscriptionReportRequest();
    displayedColumns: string[] = ['name', 'count'];
    dataSource = ELEMENT_DATA;


    constructor(@Inject(MAT_DIALOG_DATA) public inputData, private changeDetection: ChangeDetectorRef,
        public dialogRef: MatDialogRef<any>) {
    }

    ngOnInit() {
        console.log(this.inputData);
        this.dialogRef.updatePosition({ top: '0px', right: '0px' });
        this.changeDetection.detectChanges();
    }


    /**
     * Callback for sorting change
     *
     * @param {*} event
     * @memberof CompanyListComponent
     */
    public sortChange(event: any): void {
        this.subscriptionReportRequest.sortBy = event?.active;
        this.subscriptionReportRequest.sort = event?.direction;
    }

}
