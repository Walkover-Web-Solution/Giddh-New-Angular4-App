import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { ToasterService } from '../services/toaster.service';
import { CompanyListComponent } from './company-list/company-list.component';
import { TransferComponent } from './transfer/transfer.component';
import { GeneralService } from '../services/general.service';
import { ConfirmModalComponent } from "../theme/new-confirm-modal/confirm-modal.component";
import { Router } from '@angular/router';
/** This will use for interface */
export interface GetSubscriptions {
    name: string;
    count: number;
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
        name: 'Walkover', count: 10, billingAccount: 'HDFC', subscriber: 'Dilpreet', country: 'US', subscriptionId
            : 1234, planSubName: 'Sequa', status: 'Active', monthYearly: 'Monthly', renewalDate: '10-01-2023'
    },
    {
        name: 'MSG91', count: 10, billingAccount: 'HDFC', subscriber: 'Ravinder', country: 'India', subscriptionId
            : 1234, planSubName: 'Vine', status: 'In trial', monthYearly: 'Yearly', renewalDate: '10-01-2023'
    },
    {
        name: 'Hello', count: 10, billingAccount: 'HDFC', subscriber: 'Nisha', country: 'Nepal', subscriptionId
            : 1234, planSubName: 'Birch', status: 'Active', monthYearly: 'Yearly', renewalDate: '10-01-2023'
    },
    {
        name: 'Segmento', count: 10, billingAccount: 'HDFC', subscriber: 'Divyanshu', country: 'Europe', subscriptionId
            : 1234, planSubName: 'Vine', status: 'Inactive', monthYearly: 'Monthly', renewalDate: '10-01-2023'
    },
    {
        name: 'Whatsapp', count: 10, billingAccount: 'HDFC', subscriber: 'Ashish', country: 'UK', subscriptionId
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
    public displayedColumns: string[] = ['name', 'count', 'billingAccount', 'subscriber', 'country', 'planSubName', 'status', 'monthYearly', 'renewalDate'];
    /** Hold the data of activity logs */
    public dataSource = ELEMENT_DATA;
    /** True if translations loaded */
    public translationLoaded: boolean = false;

    constructor(public dialog: MatDialog,
        private toaster: ToasterService,
        private changeDetection: ChangeDetectorRef,
        private generalService: GeneralService,
        private router: Router
    ) { }

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
    }

    /**
* This function will use for get log details
*
* @param {*} element
* @memberof SubscriptionComponent
*/
    public transferSubscription(): void {
        this.dialog.open(TransferComponent, {
            data: 'element',
            panelClass: 'transfer-popup',
            width: "630px"
        });
    }

    public cancelSubscription(): void {
        let cancelDialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: 'Cancel Subscription',
                body: 'Subscription will be cancel on Expiry Date',
                ok: 'Proceed',
                cancel: 'Cancel'
            },
            panelClass: 'cancel-confirmation-modal',
            width: '585px'
        });

        cancelDialogRef.afterClosed().subscribe((action) => {
            if (action) {
                console.log('cancelDialogRef');
            } else {
                cancelDialogRef.close();
            }
        });
    }

    public moveSubscription(): void {
    }
    public changeBilling(): void {
        this.router.navigate(['/pages/subscription/change-billing']);
    }
    public viewSubscription(): void {
    }
    public buyPlan(): void {
        this.router.navigate(['/pages/subscription/buy-plan']);
    }
    public subscriptionAdd():void {
        this.router.navigate(['/pages/new-company'])
    }
    public changePlan(): void {
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
