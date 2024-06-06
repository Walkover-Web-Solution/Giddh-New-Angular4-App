import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewSubscriptionComponentStore } from './utility/view-subscription.store';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { Location } from '@angular/common';
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
    /** Holds Store Plan list API success state as observable*/
    public subscriptionRazorpayOrderDetails$ = this.componentStoreBuyPlan.select(state => state.subscriptionRazorpayOrderDetails);
    /** Holds Store Apply Promocode API response state as observable*/
    public updateSubscriptionPaymentIsSuccess$ = this.componentStoreBuyPlan.select(state => state.updateSubscriptionPaymentIsSuccess);
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
    /** Razorpay instance */
    public razorpay: any;
    /** Holds Store Buy Plan Success observable*/
    public buyPlanSuccess$ = this.subscriptionComponentStore.select(state => state.buyPlanSuccess);
    /** This will use for open window */
    private openedWindow: Window | null = null;
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


        this.buyPlanSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.redirectLink) {
                this.openWindow(response.redirectLink);
            }
        });

        this.cancelSubscription$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.router.navigate(['/pages/subscription']);
            }
        });

        this.subscriptionRazorpayOrderDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.dueAmount > 0) {
                    this.initializePayment(response);
                } else {
                    if (response.status === 'trial') {
                        this.router.navigate(['/pages/subscription/buy-plan']);
                    } else {
                        this.router.navigate(['/pages/subscription/buy-plan/' + response.subscriptionId]);
                    }
                }
            }
        });

        this.updateSubscriptionPaymentIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.router.navigate(['/pages/subscription']);
                this.getSubscriptionData(this.subscriptionId);
            }
        });

        this.componentStore.isUpdateCompanySuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.selectedMoveCompany) {
                this.getSubscriptionData(this.subscriptionId);
                this.router.navigate(['/pages/subscription']);
            }
        });

        if (this.router.url === '/pages/subscription/view-subscription/' + this.subscriptionId) {
            window.addEventListener('message', event => {
                if (event?.data && typeof event?.data === "string" && event?.data === "GOCARDLESS") {
                    this.toasterService.showSnackBar("success", this.localeData?.plan_purchased_success_message);
                    this.closeWindow();
                    this.getSubscriptionData(this.subscriptionId);
                }
            });
        }
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
        this.router.navigate([`/pages/subscription/change-billing/${this.viewSubscriptionData?.billingAccountUniqueName}`]);
    }

    /**
     * Navigates to the page for purchasing a plan.
     *
     * @memberof ViewSubscriptionComponent
     */
    public buyPlan(subscription: any): void {
        if (subscription?.region?.code === 'GBR') {
            let model = {
                planUniqueName: subscription?.planUniqueName,
                paymentProvider: "GOCARDLESS",
                subscriptionId: this.subscriptionId,
                duration: subscription?.period
            };
            this.subscriptionComponentStore.buyPlanByGoCardless(model);
        } else {
            this.componentStoreBuyPlan.generateOrderBySubscriptionId(this.subscriptionId);
        }
    }

    /**
     * Navigates to the page for purchasing a plan.
     *
     * @memberof ViewSubscriptionComponent
     */
    public changePlan(): void {
        this.router.navigate([`/pages/subscription/buy-plan/` + this.subscriptionId]);
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

    /**
     * Initializes razorpay payment
     *
     * @param {*} request
     * @memberof ViewSubscriptionComponent
     */
    public initializePayment(request: any): void {
        let that = this;

        let options = {
            key: RAZORPAY_KEY,
            image: 'data:image/png;base64,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',
            handler: function (res) {
                that.updateSubscriptionPayment(res, request);
            },
            order_id: request.razorpayOrderId,
            theme: {
                color: '#F37254'
            },
            amount: request.dueAmount,
            currency: request.planDetails?.currency?.code,
            name: 'GIDDH',
            description: 'Walkover Technologies Private Limited.'
        };
        try {
            this.razorpay = new window['Razorpay'](options);
            setTimeout(() => {
                this.razorpay?.open();
            }, 100);
        } catch (exception) { }
    }

    /**
     * Updates payment in subscription
     *
     * @param {*} razorPayResponse
     * @memberof ViewSubscriptionComponent
     */
    public updateSubscriptionPayment(razorPayResponse: any, subscription: any): void {
        let request;
        if (razorPayResponse) {
            request = {
                paymentId: razorPayResponse.razorpay_payment_id,
                razorpaySignature: razorPayResponse.razorpay_signature,
                amountPaid: subscription?.dueAmount,
                callNewPlanApi: true,
                razorpayOrderId: razorPayResponse?.razorpay_order_id,
                duration: subscription?.duration,
                subscriptionId: subscription?.subscriptionId,
                planUniqueName: subscription?.planDetails?.uniqueName
            };

            this.componentStoreBuyPlan.updateNewLoginSubscriptionPayment({ request: request });
        }
    }

    /**
     * This will be open window by url
     *
     * @param {string} url
     * @memberof ViewSubscriptionComponent
     */
    public openWindow(url: string): void {
        const width = 700;
        const height = 900;

        this.openedWindow = this.generalService.openCenteredWindow(url, '', width, height);
    }

    /**
     * This will close the current window
     *
     * @memberof ViewSubscriptionComponent
     */
    public closeWindow(): void {
        if (this.openedWindow) {
            this.openedWindow.close();
            this.openedWindow = null;
        }
    }
}
