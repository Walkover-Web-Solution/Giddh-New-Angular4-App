import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferComponent } from '../transfer/transfer.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewSubscriptionComponentStore } from './utility/view-subscription.store';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { Location } from '@angular/common';
import { SubscriptionComponentStore } from '../utility/subscription.store';

@Component({
    selector: 'app-view-subscription',
    templateUrl: './view-subscription.component.html',
    styleUrls: ['./view-subscription.component.scss'],
    providers: [ViewSubscriptionComponentStore,SubscriptionComponentStore]
})
export class ViewSubscriptionComponent implements OnInit {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds Store Plan list observable*/
    public viewSubscriptionData$ = this.componentStore.select(state => state.viewSubscription);
    /** Holds Store Plan list API success state as observable*/
    public viewSubscriptionDataInProgress$ = this.componentStore.select(state => state.viewSubscriptionInProgress);
    /** Hold the data of activity logs */
    public viewSubscriptionData: any;
    /** Hold the data of activity logs */
    public subscriptionId: any;
    /** Holds Store Plan list observable*/
    public cancelSubscription$ = this.subscriptionComponentStore.select(state => state.cancelSubscription);

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private readonly componentStore: ViewSubscriptionComponentStore,
        private readonly subscriptionComponentStore: SubscriptionComponentStore,
        private location: Location
    ) { }

    ngOnInit() {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe((params: any) => {
            console.log(params);
            if (params) {
                this.subscriptionId = params.id;
                this.getSubscriptionData(params.id);
            }
        });

        this.viewSubscriptionData$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            console.log(response);
            this.viewSubscriptionData = response;
        });

        this.cancelSubscription$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.router.navigate(['/pages/subscription']);
            }
        });

    }
    public transferSubscription(susbscriptionId:any): void {
        let transferDialogRef = this.dialog.open(TransferComponent, {
            data: susbscriptionId,
            panelClass: 'transfer-popup',
            width: "630px"
        });

        transferDialogRef.afterClosed().subscribe((action) => {
            if (action) {
            } else {
                transferDialogRef.close();
            }
        });
    }

    public back(): void {
        this.location.back();
    }

    public getSubscriptionData(id:any): void {
        this.componentStore.viewSubscriptions(id);
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
                this.subscriptionComponentStore.cancelSubscription(this.subscriptionId);
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


    public buyPlan(): void {
        this.router.navigate(['/pages/subscription/buy-plan']);
    }

}
