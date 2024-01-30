import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { ToasterService } from '../services/toaster.service';
import { CompanyListComponent } from './company-list/company-list.component';
/** This will use for interface */
export interface GetSubscriptions {
    name: string;
    billingAccount: string;
    subscriber: string;
    country: string;
    subscriptionId: any;
    planSubName: string;
    status: string;
    monthYearly: string;
    renewalDate: any;
}
/** Hold information of activity logs */
const ELEMENT_DATA: GetSubscriptions[] = [
    {
        name: 'Walkover', billingAccount: 'HDFC', subscriber: 'Dilpreet', country: 'US', subscriptionId
            : 1234, planSubName: 'Sequa', status: 'Active', monthYearly: 'Monthly', renewalDate: '10-01-2023'
    },
    {
        name: 'MSG91', billingAccount: 'HDFC', subscriber: 'Ravinder', country: 'India', subscriptionId
            : 1234, planSubName: 'Vine', status: 'In trial', monthYearly: 'Yearly', renewalDate: '10-01-2023'
    },
    {
        name: 'Hello', billingAccount: 'HDFC', subscriber: 'Nisha', country: 'Nepal', subscriptionId
            : 1234, planSubName: 'Birch', status: 'Active', monthYearly: 'Yearly', renewalDate: '10-01-2023'
    },
    {
        name: 'Segmento', billingAccount: 'HDFC', subscriber: 'Divyanshu', country: 'Europe', subscriptionId
            : 1234, planSubName: 'Vine', status: 'Inactive', monthYearly: 'Monthly', renewalDate: '10-01-2023'
    },
    {
        name: 'Whatsapp', billingAccount: 'HDFC', subscriber: 'Ashish', country: 'UK', subscriptionId
            : 1234, planSubName: 'Vine', status: 'In trial', monthYearly: 'Monthly', renewalDate: '10-01-2023'
    },
];
@Component({
    selector: 'subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionComponent implements OnInit, OnDestroy {
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will use for table heading */
    public displayedColumns: string[] = ['name', 'billingAccount', 'subscriber', 'country', 'subscriptionId', 'planSubName', 'status', 'monthYearly', 'renewalDate'];
    /** Hold the data of activity logs */
    public dataSource = ELEMENT_DATA;
    /** Hold the list of mat menu  */
    public menuList: any[] = ['Change / Buy Plan', 'View Subscription', 'Change Billing', 'Transfer', 'Cancel'];
    /** True if translations loaded */
    public translationLoaded: boolean = false;

    constructor(public dialog: MatDialog,
        private toaster: ToasterService,
        private changeDetection: ChangeDetectorRef) { }

    public ngOnInit(): void {
        document.body?.classList?.add("subscription-page");
    }

    /**
    * This function will use for get log details
    *
    * @param {*} element
    * @memberof SubscriptionComponent
    */
    public getCompanyList(event: any, element: any): void {
        this.dialog.open(CompanyListComponent, {
            data: element,
            panelClass: 'subscription-sidebar'
        });
        this.addZindexCdkOverlay();
    }

    /**
 * Adds Z-index class to cdk-overlay element
 *
 * @memberof SubscriptionComponent
 */
    public addZindexCdkOverlay(): void {
        document.querySelector('.cdk-overlay-container')?.classList?.add('cdk-overlay-container-z-index');
    }

    /**
     * Removes Z-index class to cdk-overlay element
     *
     * @memberof SubscriptionComponent
     */
    public removeZindexCdkOverlay(): void {
        document.querySelector('.cdk-overlay-container')?.classList?.remove('cdk-overlay-container-z-index');
    }

    /**
 * Callback for translation response complete
 *
 * @param {*} event
 * @memberof ActivityLogsComponent
 */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
            // this.menuList = [
            //     {
            //         label: this.localeData?.log_date,
            //         value: "LOG_DATE",
            //     },
            //     {
            //         label: this.localeData?.entity,
            //         value: "ENTITY"
            //     },
            //     {
            //         label: this.localeData?.operation,
            //         value: "OPERATION"
            //     },
            //     {
            //         label: this.localeData?.users,
            //         value: "USERS"
            //     },
            //     {
            //         label: this.localeData?.entry_date,
            //         value: "ENTRY_DATE"
            //     },
            //     {
            //         label: this.localeData?.voucher_date,
            //         value: "VOUCHER_DATE"
            //     },
            //     {
            //         label: this.commonLocaleData?.app_import_type?.base_accounts,
            //         value: "ACCOUNTS"
            //     },
            // ];
            this.changeDetection.detectChanges();
        }
    }

    public ngOnDestroy(): void {
        document.body?.classList?.remove("subscription-page");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
