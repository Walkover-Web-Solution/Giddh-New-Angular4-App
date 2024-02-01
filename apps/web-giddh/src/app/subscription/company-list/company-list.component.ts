import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SubscriptionReportRequest } from '../../models/api-models/Subscriptions';
import { ReplaySubject, debounceTime, takeUntil } from 'rxjs';
import { TransferComponent } from '../transfer/transfer.component';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
export interface PeriodicElement {
    name: string;
    count: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { name: "Walkover technologies", count: 2 },
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
    public displayedColumns: string[] = ['name', 'count'];
    public dataSource = ELEMENT_DATA;
    public companyListForm: UntypedFormGroup;


    constructor(@Inject(MAT_DIALOG_DATA) public inputData, private changeDetection: ChangeDetectorRef, public dialog: MatDialog, private fb: UntypedFormBuilder,
        public dialogRef: MatDialogRef<any>) {
    }

    public ngOnInit(): void {
        this.dialogRef.updatePosition({ top: '0px', right: '0px' });
        document.body?.classList?.add("subscription-sidebar");
        this.initFrom();
        this.companyListForm.get('companyName').valueChanges.pipe(
            debounceTime(700), takeUntil(this.destroyed$))
            .subscribe((value) => {
                console.log('Name value changed (debounced):', value);
            });
        this.changeDetection.detectChanges();
    }

    public initFrom(): void {
        this.companyListForm = this.fb.group({
            companyName: [''],
        });
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



    public ngOnDestroy(): void {
        document.body?.classList?.remove("subscription-sidebar");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
