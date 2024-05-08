import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { GeneralService } from '../services/general.service';
import { ConfirmModalComponent } from "../theme/new-confirm-modal/confirm-modal.component";
import { Router } from '@angular/router';
import { SubscriptionComponentStore } from './utility/subscription.store';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PAGINATION_LIMIT } from '../app.constant';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppState } from '../store';
import { Store } from '@ngrx/store';
import { SubscriptionsUser } from '../models/api-models/Subscriptions';
import { MatMenuTrigger } from '@angular/material/menu';
import { CompanyListDialogComponent } from './company-list-dialog/company-list-dialog.component';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { GeneralActions } from '../actions/general/general.actions';
import { BuyPlanComponentStore } from './buy-plan/utility/buy-plan.store';
@Component({
    selector: 'subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SubscriptionComponentStore, BuyPlanComponentStore]
})
export class SubscriptionComponent implements OnInit, OnDestroy {
    /** Mat menu instance reference */
    @ViewChild(MatMenuTrigger) menu: MatMenuTrigger;
    /** Holds Paginator Reference */
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    /** This will use for move company in to another company  */
    @ViewChild("moveCompany", { static: false }) public moveCompany: any;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will use for table heading */
    public displayedColumns: string[] = ['companyName', 'billingAccountName', 'subscriberName', 'countryName', 'planName', 'status', 'renewalDate'];
    /** Hold the data of subscriptions */
    public dataSource: any;
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds Store Subscription list observable*/
    public subscriptionList$ = this.componentStore.select(state => state.subscriptionList);
    /** Holds Store Subscription list in progress API success state as observable*/
    public subscriptionListInProgress$ = this.componentStore.select(state => state.subscriptionListInProgress);
    /** Holds Store Plan list API success state as observable*/
    public subscriptionRazorpayOrderDetails$ = this.componentStoreBuyPlan.select(state => state.subscriptionRazorpayOrderDetails);
    /** Holds Store Apply Promocode API response state as observable*/
    public updateSubscriptionPaymentIsSuccess$ = this.componentStoreBuyPlan.select(state => state.updateSubscriptionPaymentIsSuccess);
    /** This will use for subscription pagination logs object */
    public subscriptionRequestParams = {
        page: 1,
        totalPages: 0,
        totalItems: 0,
        count: PAGINATION_LIMIT,
    }
    /** Hold table page index number*/
    public pageIndex: number = 0;
    /** Holds page size options */
    public pageSizeOptions: any[] = [20,
        50,
        100];
    /** Holds Total number of discounts */
    public totalDiscountCount: number = 0;
    /* Hold list searching value */
    public inlineSearch: any = '';
    /** Form Group for subscription form */
    public subscriptionListForm: FormGroup;
    /** True, if custom date filter is selected or custom searching or sorting is performed */
    public showClearFilter: boolean = false;
    /* True if billing account show */
    public showBillingAccount = false;
    /* True if  subscriber show */
    public showSubscriber = false;
    /* True if  country show */
    public showCountry = false;
    /* True if  name show */
    public showName = false;
    /* True if Plan Name show */
    public showPlanSubName = false;
    /* True if status show */
    public showStatus = false;
    /* True if duration show */
    public showMonthlyYearly = false;
    /* True if show header */
    public showData: boolean = true;
    /** Razorpay instance */
    public razorpay: any;

    /** Getter for show search element by type */
    public get shouldShowElement(): boolean {
        const shouldShow = (
            this.subscriptionListForm?.controls['companyName']?.value ||
            this.subscriptionListForm?.controls['billingAccountName']?.value ||
            this.subscriptionListForm?.controls['subscriberName']?.value ||
            this.subscriptionListForm?.controls['countryName']?.value ||
            this.subscriptionListForm?.controls['planName']?.value ||
            this.subscriptionListForm?.controls['status']?.value ||
            this.subscriptionListForm?.controls['duration']?.value
        );
        this.showData = shouldShow;
        return shouldShow;
    }
    /** Holds Store Cancel Subscription observable*/
    public cancelSubscription$ = this.componentStore.select(state => state.cancelSubscription);
    /** Holds Store Subscribed companies API success state as observable*/
    public subscribedCompanies$ = this.componentStore.select(state => state.subscribedCompanies);
    /** Holds Store Subscribe companies in progress API success state as observable*/
    public subscribedCompaniesInProgress$ = this.componentStore.select(state => state.subscribedCompaniesInProgress);
    /* This will hold list of subscriptions */
    public subscriptions: SubscriptionsUser[] = [];
    /* This will hold the companies to use in selected company */
    public selectedCompany: any;
    /** This will use for active company */
    public activeCompany: any = {};
    /** True if subscription will move */
    public subscriptionMove: boolean = false;

    constructor(public dialog: MatDialog,
        private changeDetection: ChangeDetectorRef,
        private generalService: GeneralService,
        private componentStore: SubscriptionComponentStore,
        private store: Store<AppState>,
        private formBuilder: FormBuilder,
        private readonly componentStoreBuyPlan: BuyPlanComponentStore,
        private generalActions: GeneralActions,
        private router: Router
    ) {
        this.store.dispatch(this.generalActions.openSideMenu(true));
    }

    /**
     * Initializes the component by subscribing to route parameters and fetching subscription data.
     * Navigates to the subscription page upon subscription cancellation.
     *
     * @memberof SubscriptionComponent
     */
    public ngOnInit(): void {
        document.body?.classList?.add("subscription-page");
        this.initForm();
        this.getAllSubscriptions(false);

        /** Get Discount List */
        this.subscriptionList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.subscriptions = response?.body?.results;
                this.dataSource = new MatTableDataSource<any>(response?.body?.results);
                if (this.dataSource?.filteredData?.length || this.subscriptionListForm?.controls['companyName']?.value ||
                    this.subscriptionListForm?.controls['billingAccountName']?.value ||
                    this.subscriptionListForm?.controls['subscriberName']?.value ||
                    this.subscriptionListForm?.controls['countryName']?.value ||
                    this.subscriptionListForm?.controls['planName']?.value ||
                    this.subscriptionListForm?.controls['status']?.value ||
                    this.subscriptionListForm?.controls['duration']?.value) {
                    this.showData = true;
                } else {
                    this.showData = false;
                }
                this.dataSource.paginator = this.paginator;
                this.subscriptionRequestParams.totalItems = response?.body?.totalItems;
            } else {
                this.dataSource = new MatTableDataSource<any>([]);
                this.subscriptions = [];
                this.showData = false;
                this.subscriptionRequestParams.totalItems = 0;
            }
        });

        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.activeCompany = response;
            }
        });

        this.cancelSubscription$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.router.navigate(['/pages/subscription']);
            }
        });

        this.subscriptionRazorpayOrderDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.initializePayment(response);
            }
        });

        this.updateSubscriptionPaymentIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getAllSubscriptions(false);
            }
        });

        this.subscriptionListForm?.controls['companyName'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showName = false;
            }
        });
        this.subscriptionListForm?.controls['billingAccountName'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showBillingAccount = false;
            }
        });
        this.subscriptionListForm?.controls['subscriberName'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showSubscriber = false;
            }
        });
        this.subscriptionListForm?.controls['countryName'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showCountry = false;
            }
        });
        this.subscriptionListForm?.controls['planName'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showPlanSubName = false;
            }
        });

        this.subscriptionListForm?.controls['status'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showStatus = false;
            }
        });

        this.subscriptionListForm?.controls['duration'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showMonthlyYearly = false;
            }
        });
    }

    /**
     * This will use for init subscription form
     *
     * @memberof SubscriptionComponent
     */
    public initForm(): void {
        this.subscriptionListForm = this.formBuilder.group({
            companyName: null,
            billingAccountName: null,
            subscriberName: null,
            countryName: null,
            planName: null,
            status: null,
            duration: null
        });
    }

    /**
   * Returns the search field text
   *
   * @param {*} title
   * @returns {string}
   * @memberof SubscriptionComponent
   */
    public getSearchFieldText(title: any): string {
        let searchField = this.localeData?.search_field;
        searchField = searchField?.replace("[FIELD]", title);
        return searchField;
    }

    /**
     * Handles clicks outside the specified element for filtering in the SubscriptionComponent.
     *
     * @param event - The event triggered by the click.
     * @param element - The element outside of which the click occurred.
     * @param searchedFieldName - The name of the field being searched for.
     * @memberof SubscriptionComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        if (searchedFieldName === 'companyName') {
            if (this.subscriptionListForm?.controls['companyName'].value !== null && this.subscriptionListForm?.controls['companyName'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'Billing Account') {
            if (this.subscriptionListForm?.controls['billingAccountName'].value !== null && this.subscriptionListForm?.controls['billingAccountName'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'Subscriber') {
            if (this.subscriptionListForm?.controls['subscriberName'].value !== null && this.subscriptionListForm?.controls['subscriberName'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'Country') {
            if (this.subscriptionListForm?.controls['countryName'].value !== null && this.subscriptionListForm?.controls['countryName'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'Plan Name') {
            if (this.subscriptionListForm?.controls['planName'].value !== null && this.subscriptionListForm?.controls['planName'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'Status') {
            if (this.subscriptionListForm?.controls['status'].value !== null && this.subscriptionListForm?.controls['status'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'Monthly/Yearly') {
            if (this.subscriptionListForm?.controls['duration'].value !== null && this.subscriptionListForm?.controls['duration'].value !== '') {
                return;
            }
        }

        if (this.generalService.childOf(event?.target, element)) {
            return;
        } else {
            if (searchedFieldName === 'Name') {
                this.showName = false;
            } else if (searchedFieldName === 'Billing Account') {
                this.showBillingAccount = false;
            } else if (searchedFieldName === 'Subscriber') {
                this.showSubscriber = false;
            }
            else if (searchedFieldName === 'Country') {
                this.showCountry = false;
            } else if (searchedFieldName === 'Plan Name') {
                this.showPlanSubName = false;
            } else if (searchedFieldName === 'Monthly/Yearly') {
                this.showMonthlyYearly = false;
            } else if (searchedFieldName === 'Status') {
                this.showStatus = false;
            }
        }
    }

    /**
     * This will be use for toggle search field
     *
     * @param {string} fieldName
     * @param {*} el
     * @memberof SubscriptionComponent
     */
    public toggleSearch(fieldName: string): void {
        if (fieldName === 'Name') {
            this.showName = true;
        }
        if (fieldName === 'Billing Account') {
            this.showBillingAccount = true;
        }
        if (fieldName === 'Subscriber') {
            this.showSubscriber = true;
        }
        if (fieldName === 'Country') {
            this.showCountry = true;
        }
        if (fieldName === 'Plan Name') {
            this.showPlanSubName = true;
        }
        if (fieldName === 'Monthly/Yearly') {
            this.showMonthlyYearly = true;
        }
        if (fieldName === 'Status') {
            this.showStatus = true;
        }
    }

    /**
     * Handle page change
     *
     * @param {*} event
     * @memberof SubscriptionComponent
     */
    public handlePageChange(event: any): void {
        this.pageIndex = event.pageIndex;
        this.subscriptionRequestParams.count = event.pageSize;
        this.subscriptionRequestParams.page = event.pageIndex + 1;
        this.getAllSubscriptions(false);
    }


    /**
    * This function will use for get company details
    *
    * @param {*} element
    * @memberof SubscriptionComponent
    */
    public openCompanyDialog(element: any): void {
        this.menu?.closeMenu();
        this.subscriptionMove = true;
        let data = {
            rowData: element,
            subscriptions: this.subscriptions,
            selectedCompany: this.selectedCompany,
            localeData: this.localeData,
            commonLocaleData: this.commonLocaleData,
            subscriptionMove: this.subscriptionMove
        }
        this.dialog.open(CompanyListDialogComponent, {
            data: data,
            panelClass: 'subscription-sidebar',
            role: 'alertdialog',
            ariaLabel: 'companyDialog'
        });
    }

    /**
    * This function will use for transfer subscription
    *
    * @param {*} element
    * @memberof SubscriptionComponent
    */
    public transferSubscription(subscriptionId: any): void {
        this.menu.closeMenu();
        this.dialog.open(TransferDialogComponent, {
            data: subscriptionId,
            panelClass: 'transfer-popup',
            width: "630px",
            role: 'alertdialog',
            ariaLabel: 'transferDialog'
        });
    }


    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof SubscriptionComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
            this.changeDetection.detectChanges();
        }
    }

    /**
     *This function will open the move company popup
     *
     * @param {*} company
     * @memberof SubscriptionComponent
     */
    public openModalMove(company: any): void {
        this.menu.closeMenu();
        this.subscriptionMove = true;
        this.selectedCompany = company;
        this.dialog.open(this.moveCompany, {
            width: '40%',
            role: 'alertdialog',
            ariaLabel: 'moveDialog'
        });
    }


    /**
   * This function will refresh the subscribed companies if move company was succesful and will close the popup
   *
   * @param {*} event
   * @memberof SubscriptionsComponent
   */
    public addOrMoveCompanyCallback(event: boolean): void {
        if (event === true) {
            this.getAllSubscriptions(null);
        }
    }

    /**
     * Clears the filters and resets the form in the SubscriptionComponent.
     *
     * @memberof SubscriptionComponent
     */
    public clearFilter(): void {
        this.showClearFilter = false;
        this.showName = false;
        this.showBillingAccount = false;
        this.showSubscriber = false;
        this.showCountry = false;
        this.showPlanSubName = false;
        this.showMonthlyYearly = false;
        this.showStatus = false;
        this.subscriptionListForm.reset();
        this.inlineSearch = '';
        this.getAllSubscriptions(true);
    }

    /**
     * Retrieves all subscriptions in the SubscriptionComponent.
     *
     * @param resetPage - Indicates whether to reset the pagination page.
     * @memberof SubscriptionComponent
     */
    public getAllSubscriptions(resetPage: boolean): void {
        if (resetPage) {
            this.subscriptionRequestParams.page = 1;
        }
        let request = {
            pagination: this.subscriptionRequestParams,
            model: this.subscriptionListForm.value
        };
        this.componentStore.getAllSubscriptions(request);
    }

    /**
     * Navigates to the page for purchasing a new plan in the SubscriptionComponent.
     *
     * @memberof SubscriptionComponent
     */
    public createSubscription(): void {
        this.router.navigate(['/pages/subscription/buy-plan']);
    }

    /**
     * Cancels a subscription in the SubscriptionComponent.
     *
     * @param id - The ID of the subscription to cancel.
     * @memberof SubscriptionComponent
     */
    public cancelSubscription(id: any): void {
        this.menu.closeMenu();
        let cancelDialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: this.localeData?.cancel_subscription,
                body: this.localeData?.subscription_cancel_message,
                ok: this.commonLocaleData?.app_proceed,
                cancel: this.commonLocaleData?.app_cancel
            },
            panelClass: 'cancel-confirmation-modal',
            width: '585px',
            role: 'alertdialog',
            ariaLabel: 'confirmDialog'
        });

        cancelDialogRef.afterClosed().subscribe((action) => {
            if (action) {
                this.componentStore.cancelSubscription(id);
            } else {
                cancelDialogRef.close();
            }
        });
    }

    /**
     * Navigates to the page for changing billing information in the SubscriptionComponent.
     *
     * @param data - The subscription data for which billing information is to be changed.
     * @memberof SubscriptionComponent
     */
    public changeBilling(data: any): void {
        this.router.navigate(['/pages/subscription/change-billing/' + data]);
    }

    /**
     * Navigates to the page for viewing a subscription in the SubscriptionComponent.
     *
     * @param data - The subscription data to view.
     * @memberof SubscriptionComponent
     */
    public viewSubscription(data: any): void {
        this.router.navigate(['/pages/subscription/view-subscription/' + data?.subscriptionId]);
    }

    /**
     * Navigates to the page for purchasing a plan in the SubscriptionComponent.
     *
     * @memberof SubscriptionComponent
     */
    public buyPlan(subscription: any): void {
        this.componentStoreBuyPlan.generateOrderBySubscriptionId(subscription?.subscriptionId);
    }

    /**
     * Navigates to the page for changing a plan in the SubscriptionComponent.
     *
     * @param data - The subscription data for which the plan is to be changed.
     * @memberof SubscriptionComponent
     */
    public changePlan(): void {
        this.router.navigate(['/pages/subscription/buy-plan/change']);
    }

    /**
     * Navigates to the page for creating a new company.
     *
     * @memberof SubscriptionComponent
     */
    public createCompanyInSubscription(subscriptionId): void {
        this.router.navigate(['/pages/new-company/' + subscriptionId]);
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Removes "subscription-page" class from body, and completes the subject indicating component destruction.
     *
     * @memberof SubscriptionComponent
     */
    public ngOnDestroy(): void {
        document.body?.classList?.remove("subscription-page");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Initializes razorpay payment
     *
     * @param {*} request
     * @memberof SubscriptionComponent
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
            currency: request.planDetails?.currency?.code || this.activeCompany?.baseCurrency,
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
     * @memberof SubscriptionComponent
     */
    public updateSubscriptionPayment(razorPayResponse: any, subscription: any): void {
        let request;
        if (razorPayResponse) {
            request = {
                subscriptionRequest: {
                    subscriptionId: subscription?.subscriptionId
                },
                paymentId: razorPayResponse.razorpay_payment_id,
                razorpaySignature: razorPayResponse.razorpay_signature,
                amountPaid: subscription?.dueAmount,
                callNewPlanApi: true,
                razorpayOrderId: razorPayResponse?.razorpay_order_id
            };

            this.componentStoreBuyPlan.updateNewLoginSubscriptionPayment({ request: request });
        }
    }
}
