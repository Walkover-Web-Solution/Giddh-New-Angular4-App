import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewSubscriptionComponentStore } from './utility/view-subscription.store';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { SubscriptionComponentStore } from '../utility/subscription.store';
import { TransferDialogComponent } from '../transfer-dialog/transfer-dialog.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { BuyPlanComponentStore } from '../buy-plan/utility/buy-plan.store';
import { GeneralService } from '../../services/general.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
    selector: 'view-subscription',
    templateUrl: './view-subscription.component.html',
    styleUrls: ['./view-subscription.component.scss'],
    providers: [ViewSubscriptionComponentStore, SubscriptionComponentStore, BuyPlanComponentStore]
})
export class ViewSubscriptionComponent implements OnInit, OnDestroy {
    /** Mat menu instance reference */
    @ViewChild(MatMenuTrigger) menu: MatMenuTrigger;
    /** This will use for move company in to another company  */
    @ViewChild("moveCompany", { static: false }) public moveCompany: any;
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
    /* This will hold the companies to use in selected company */
    public selectedCompany: any;
    /** True if subscription will move */
    public subscriptionMove: boolean = false;
    /** True if subscription will move */
    public selectedMoveCompany: boolean = false;
    /** This will use for active company */
    public activeCompany: any = {};

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private componentStore: ViewSubscriptionComponentStore,
        private readonly componentStoreBuyPlan: BuyPlanComponentStore,
        private subscriptionComponentStore: SubscriptionComponentStore,
        private generalService: GeneralService,
        private toasterService: ToasterService
    ) {
    }

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

        this.subscriptionComponentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.activeCompany?.uniqueName !== response?.uniqueName) {
                this.activeCompany = response;
            }
        });

        this.viewSubscriptionData$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.viewSubscriptionData = response;
        });

        this.cancelSubscription$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.router.navigate(['/pages/user-details/subscription']);
            }
        });

        this.componentStore.isUpdateCompanySuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.selectedMoveCompany) {
                this.getSubscriptionData(this.subscriptionId);
                this.router.navigate(['/pages/user-details/subscription']);
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
                transferDialogRef?.close();
            }
        });
    }

    /**
    * This function will refresh the subscribed companies if move company was succesful and will close the popup
    *
    * @param {*} event
    * @memberof ViewSubscriptionComponent
    */
    public addOrMoveCompanyCallback(event: boolean): void {
        if (event) {
            this.selectedMoveCompany = true;
        }
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
  *This function will open the move company popup
  *
  * @param {*} company
  * @memberof CompanyListDialogComponent
  */
    public openModalMove(): void {
        this.menu.closeMenu();
        this.selectedCompany = this.viewSubscriptionData;
        this.subscriptionMove = true;
        this.dialog.open(this.moveCompany, {
            width: '40%',
            role: 'alertdialog',
            ariaLabel: 'moveDialog'
        });
    }


    /**
     * Opens a dialog for confirming subscription cancellation.
     *
     * @memberof ViewSubscriptionComponent
     */
    public cancelSubscription(): void {
        let cancelDialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: this.localeData?.cancel_subscription,
                body: this.localeData?.subscription_cancel_message,
                ok: this.commonLocaleData?.app_proceed,
                cancel: this.commonLocaleData?.app_cancel
            },
            panelClass: 'cancel-confirmation-modal',
            width: '585px'
        });

        cancelDialogRef.afterClosed().subscribe((action) => {
            if (action) {
                this.subscriptionComponentStore.cancelSubscription(this.subscriptionId);
            } else {
                cancelDialogRef?.close();
            }
        });
    }

    /**
     * Navigates to the page for changing billing information.
     *
     * @memberof ViewSubscriptionComponent
     */
    public changeBilling(): void {
        this.router.navigate([`/pages/user-details/subscription/change-billing/${this.viewSubscriptionData?.billingAccountUniqueName}`]);
    }

    /**
     * Navigates to the page for purchasing a plan.
     *
     * @memberof ViewSubscriptionComponent
     */
    public buyPlan(): void {
        this.router.navigate([`/pages/user-details/subscription/buy-plan/` + this.subscriptionId]);
    }

    /**
     * Navigates to the page for purchasing a plan.
     *
     * @memberof ViewSubscriptionComponent
     */
    public changePlan(): void {
        this.router.navigate([`/pages/user-details/subscription/buy-plan/` + this.subscriptionId]);
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
