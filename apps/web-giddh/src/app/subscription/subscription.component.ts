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
import { select, Store } from '@ngrx/store';
import { SubscriptionsActions } from '../actions/user-subscriptions/subscriptions.action';
import { SubscriptionsUser } from '../models/api-models/Subscriptions';
import { MatMenuTrigger } from '@angular/material/menu';
import { CompanyListDialogComponent } from './company-list-dialog/company-list-dialog.component';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
@Component({
    selector: 'subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SubscriptionComponentStore]
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
    public displayedColumns: string[] = ['companyName', 'billingAccountName', 'subscriberName', 'countryName', 'planName', 'status', 'period', 'renewalDate'];
    /** Hold the data of subscriptions */
    public dataSource: any;
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds Store Subscription list observable*/
    public subscriptionList$ = this.componentStore.select(state => state.subscriptionList);
    /** Holds Store Subscription list in progress API success state as observable*/
    public subscriptionListInProgress$ = this.componentStore.select(state => state.subscriptionListInProgress);
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
    /* True if plan sub name show */
    public showPlanSubName = false;
    /* True if status show */
    public showStatus = false;
    /* True if duration show */
    public showMonthlyYearly = false;
    /** Getter for show search element by type */
    public get shouldShowElement(): boolean {
        const hasResponse = this.dataSource?.filteredData?.length > 0;
        if (!hasResponse) {
            return false;
        }
        return (
            (hasResponse && this.inlineSearch !== 'companyName' || this.showClearFilter) ||
            (this.inlineSearch === 'companyName' && !hasResponse || this.showClearFilter) ||
            (hasResponse && this.inlineSearch === 'companyName' || this.showClearFilter) ||
            (hasResponse && this.inlineSearch !== 'billingAccountName' || this.showClearFilter) ||
            (this.inlineSearch === 'billingAccountName' && !hasResponse || this.showClearFilter) ||
            (hasResponse && this.inlineSearch === 'billingAccountName' || this.showClearFilter) ||
            (hasResponse && this.inlineSearch !== 'subscriberName' || this.showClearFilter) ||
            (this.inlineSearch === 'subscriberName' && !hasResponse || this.showClearFilter) ||
            (hasResponse && this.inlineSearch === 'subscriberName' || this.showClearFilter) ||
            (hasResponse && this.inlineSearch !== 'countryName' || this.showClearFilter) ||
            (this.inlineSearch === 'countryName' && !hasResponse || this.showClearFilter) ||
            (hasResponse && this.inlineSearch === 'countryName' || this.showClearFilter) ||
            (hasResponse && this.inlineSearch !== 'planName' || this.showClearFilter) ||
            (this.inlineSearch === 'planName' && !hasResponse || this.showClearFilter) ||
            (hasResponse && this.inlineSearch === 'planName' || this.showClearFilter) ||
            (hasResponse && this.inlineSearch !== 'status' || this.showClearFilter) ||
            (this.inlineSearch === 'status' && !hasResponse || this.showClearFilter) ||
            (hasResponse && this.inlineSearch === 'status' || this.showClearFilter) ||
            (hasResponse && this.inlineSearch !== 'period' || this.showClearFilter) ||
            (this.inlineSearch === 'period' && !hasResponse || this.showClearFilter) ||
            (hasResponse && this.inlineSearch === 'period' || this.showClearFilter)
        );
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
        private subscriptionsActions: SubscriptionsActions,
        private router: Router
    ) {

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
                this.dataSource.paginator = this.paginator;
                this.subscriptionRequestParams.totalItems = response?.body?.totalItems;
            } else {
                this.dataSource = new MatTableDataSource<any>([]);
                this.subscriptions = [];
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

        this.subscriptionListForm?.controls['period'].valueChanges.pipe(
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
            period: null
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
        } else if (searchedFieldName === 'Plan Sub Name') {
            if (this.subscriptionListForm?.controls['planName'].value !== null && this.subscriptionListForm?.controls['planName'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'Status') {
            if (this.subscriptionListForm?.controls['status'].value !== null && this.subscriptionListForm?.controls['status'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'Monthly/Yearly') {
            if (this.subscriptionListForm?.controls['period'].value !== null && this.subscriptionListForm?.controls['period'].value !== '') {
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
            } else if (searchedFieldName === 'Plan Sub Name') {
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
        if (fieldName === 'Plan Sub Name') {
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
    public buyPlan(): void {
        this.router.navigate(['/pages/subscription/buy-plan']);
    }

    /**
     * Navigates to the page for changing a plan in the SubscriptionComponent.
     *
     * @param data - The subscription data for which the plan is to be changed.
     * @memberof SubscriptionComponent
     */
    public changePlan(data: any): void {
        this.router.navigate(['/pages/subscription/buy-plan/' + data?.plan?.uniqueName]);
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

}
