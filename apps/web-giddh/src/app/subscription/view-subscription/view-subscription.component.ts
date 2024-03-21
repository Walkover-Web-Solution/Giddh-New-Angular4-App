import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferComponent } from '../transfer/transfer.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewSubscriptionComponentStore } from './utility/view-subscription.store';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { Location } from '@angular/common';
import { SubscriptionComponentStore } from '../utility/subscription.store';
import { TransferDialogComponent } from '../transfer-dialog/transfer-dialog.component';

@Component({
    selector: 'view-subscription',
    templateUrl: './view-subscription.component.html',
    styleUrls: ['./view-subscription.component.scss'],
    providers: [ViewSubscriptionComponentStore, SubscriptionComponentStore]
})
export class ViewSubscriptionComponent implements OnInit, OnDestroy {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds View Subscription list observable*/
    public viewSubscriptionData$ = this.componentStore.select(state => state.viewSubscription);
    /** Holds View Subscription in progresss API success state as observable*/
    public viewSubscriptionDataInProgress$ = this.componentStore.select(state => state.viewSubscriptionInProgress);
    /** Hold the data of view  subscription */
    public viewSubscriptionData: any;
    /** Hold the data of subscription id */
    public subscriptionId: any;
    /** Holds cancel subscription observable*/
    public cancelSubscription$ = this.subscriptionComponentStore.select(state => state.cancelSubscription);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private componentStore: ViewSubscriptionComponentStore,
        private subscriptionComponentStore: SubscriptionComponentStore,
        private location: Location
    ) { }

    /**
   * Initializes the component by subscribing to route parameters and fetching subscription data.
   * Navigates to the subscription page upon subscription cancellation.
   *
   * @memberof ViewSubscriptionComponent
   */
    public ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe((params: any) => {
            if (params) {
                this.subscriptionId = params.id;
                this.getSubscriptionData(params.id);
            }
        });

        this.viewSubscriptionData$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.viewSubscriptionData = response;
        });

        this.cancelSubscription$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.router.navigate(['/pages/subscription']);
            }
        });
    }

    /**
     * Opens a dialog for transferring the subscription.
     *
     * @param subscriptionId - The ID of the subscription to be transferred.
     * @memberof ViewSubscriptionComponent
     */
    public transferSubscription(subscriptionId: any): void {
        let transferDialogRef = this.dialog.open(TransferDialogComponent, {
            data: subscriptionId,
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

    /**
     * Navigates back to the previous page.
     *
     * @memberof ViewSubscriptionComponent
     */
    public back(): void {
        this.location.back();
    }

    /**
     * Fetches subscription data by its ID.
     *
     * @param id - The ID of the subscription to fetch.
     * @memberof ViewSubscriptionComponent
     */
    public getSubscriptionData(id: any): void {
        this.componentStore.viewSubscriptionsById(id);
    }

    /**
     * Opens a dialog for confirming subscription cancellation.
     *
     * @memberof ViewSubscriptionComponent
     */
    public cancelSubscription(): void {
        let cancelDialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: 'Cancel Subscription',
                body: 'Subscription will be cancelled on Expiry Date',
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

    /**
     * Navigates to the page for changing billing information.
     *
     * @memberof ViewSubscriptionComponent
     */
    public changeBilling(): void {
        this.router.navigate(['/pages/subscription/change-billing']);
    }

    /**
     * Navigates to the page for purchasing a plan.
     *
     * @memberof ViewSubscriptionComponent
     */
    public buyPlan(): void {
        this.router.navigate(['/pages/subscription/buy-plan']);
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Completes the subject indicating component destruction.
     *
     * @memberof ViewSubscriptionComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
