import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SubscriptionReportRequest } from '../../models/api-models/Subscriptions';
import { ReplaySubject } from 'rxjs';
import { TransferComponent } from '../transfer/transfer.component';
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
    styleUrls: ['./company-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyListComponent implements OnInit {
    /** Instance of company list */
    @ViewChild('companyList', { static: false }) public companyList: ElementRef;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** Subscritpion Report Request Object */
    public subscriptionReportRequest: SubscriptionReportRequest = new SubscriptionReportRequest();
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    displayedColumns: string[] = ['name', 'count'];
    dataSource = ELEMENT_DATA;


    constructor(@Inject(MAT_DIALOG_DATA) public inputData, private changeDetection: ChangeDetectorRef, public dialog: MatDialog,
        public dialogRef: MatDialogRef<any>) {
    }

    public ngOnInit(): void {
        this.dialogRef.updatePosition({ top: '0px', right: '0px' });
        document.body?.classList?.add("subscription-sidebar");
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

    /**
   * This function will use for get log details
   *
   * @param {*} element
   * @memberof SubscriptionComponent
   */
    public transferSubscription(event: any, element: any): void {
        this.dialog.open(TransferComponent, {
            data: element,
            panelClass: 'transfer-popup',
            width: "630px"
        });
    }

    public ngOnDestroy(): void {
        document.body?.classList?.remove("subscription-sidebar");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
