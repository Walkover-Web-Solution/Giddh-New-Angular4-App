import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatMenuTrigger } from '@angular/material/menu';
import { SubscriptionsUser } from '../../models/api-models/Subscriptions';
import { GeneralService } from '../../services/general.service';
import { SubscriptionComponentStore } from '../utility/subscription.store';
import { AppState } from '../../store';
import { BuyPlanComponentStore } from '../buy-plan/utility/buy-plan.store';
import { GeneralActions } from '../../actions/general/general.actions';
import { ToasterService } from '../../services/toaster.service';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { API_COUNT_LIMIT, PAGE_SIZE_OPTIONS } from '../../app.constant';
import { CompanyListDialogComponent } from '../company-list-dialog/company-list-dialog.component';
import { TransferDialogComponent } from '../transfer-dialog/transfer-dialog.component';
import { PaymentMethodDialogComponent } from '../payment-method-dialog/payment-method-dialog.component';
import { CompanyListDialogComponentStore } from '../company-list-dialog/utility/company-list-dialog.store';
@Component({
    selector: 'subscription-list',
    templateUrl: './subscription-list.component.html',
    styleUrls: ['./subscription-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SubscriptionComponentStore, BuyPlanComponentStore, CompanyListDialogComponentStore]
})
export class SubscriptionListComponent implements OnInit, OnDestroy {
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
    public subscriptionList$: Observable<any> = this.componentStore.select(state => state.subscriptionList);
    /** Holds Store Subscription list in progress API success state as observable*/
    public subscriptionListInProgress$: Observable<any> = this.componentStore.select(state => state.subscriptionListInProgress);
    /** This will use for subscription pagination logs object */
    public subscriptionRequestParams: any = {
        page: 1,
        totalPages: 0,
        totalItems: 0,
        count: API_COUNT_LIMIT,
    }
    /** Hold table page index number*/
    public pageIndex: number = 0;
    /** Holds page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
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
    /* True if subscriber show */
    public showSubscriber = false;
    /* True if country show */
    public showCountry = false;
    /* True if name show */
    public showName = false;
    /* True if Plan Name show */
    public showPlanSubName = false;
    /* True if status show */
    public showStatus = false;
    /* True if duration show */
    public showMonthlyYearly = false;
    /* True if show header */
    public showData: boolean = true;

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
    /** Holds Store Archive company API success state as observable*/
    public archiveCompanySuccess$ = this.componentStoreCompanyListDialog.select(state => state.archiveCompanySuccess);

    constructor(public dialog: MatDialog,
        private changeDetection: ChangeDetectorRef,
        private generalService: GeneralService,
        private componentStore: SubscriptionComponentStore,
        private store: Store<AppState>,
        private formBuilder: FormBuilder,
        private readonly componentStoreBuyPlan: BuyPlanComponentStore,
        private readonly componentStoreCompanyListDialog: CompanyListDialogComponentStore,
        private generalActions: GeneralActions,
        private router: Router,
        private toasterService: ToasterService
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
            if (response && this.activeCompany?.uniqueName !== response?.uniqueName) {
                this.activeCompany = response;
            }
        });

        this.cancelSubscription$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.router.navigate(['/pages/user-details/subscription']);
            }
        });

        this.subscriptionListForm?.controls['companyName'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (this.isNotNullOrUndefined(searchedText)) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
            if (this.isNullOrEmpty(searchedText)) {
                this.showClearFilter = false;
                this.showName = false;
            }
        });
        this.subscriptionListForm?.controls['billingAccountName'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (this.isNotNullOrUndefined(searchedText)) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
            if (this.isNullOrEmpty(searchedText)) {
                this.showClearFilter = false;
                this.showBillingAccount = false;
            }
        });
        this.subscriptionListForm?.controls['subscriberName'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (this.isNotNullOrUndefined(searchedText)) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
            if (this.isNullOrEmpty(searchedText)) {
                this.showClearFilter = false;
                this.showSubscriber = false;
            }
        });
        this.subscriptionListForm?.controls['countryName'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (this.isNotNullOrUndefined(searchedText)) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
            if (this.isNullOrEmpty(searchedText)) {
                this.showClearFilter = false;
                this.showCountry = false;
            }
        });
        this.subscriptionListForm?.controls['planName'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (this.isNotNullOrUndefined(searchedText)) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
            if (this.isNullOrEmpty(searchedText)) {
                this.showClearFilter = false;
                this.showPlanSubName = false;
            }
        });

        this.subscriptionListForm?.controls['status'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (this.isNotNullOrUndefined(searchedText)) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
            if (this.isNullOrEmpty(searchedText)) {
                this.showClearFilter = false;
                this.showStatus = false;
            }
        });

        this.subscriptionListForm?.controls['duration'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (this.isNotNullOrUndefined(searchedText)) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
            if (this.isNullOrEmpty(searchedText)) {
                this.showClearFilter = false;
                this.showMonthlyYearly = false;
            }
        });

        this.componentStore.isUpdateCompanySuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getAllSubscriptions(null);
            }
        });

        this.archiveCompanySuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let text = this.localeData?.company_message;
                text = text?.replace("[TYPE]", response?.archiveStatus === 'USER_ARCHIVED' ? this.commonLocaleData?.app_unarchive : this.commonLocaleData?.app_archive);
                this.toasterService.showSnackBar('success', text);
                this.getAllSubscriptions(null);
            }
        });

    }
    /**
     * This will be use for check null or undefined values
     *
     * @param {*} value
     * @return {*}  {boolean}
     * @memberof SubscriptionListComponent
     */
    public isNotNullOrUndefined(value: any): boolean {
        return value !== null && value !== undefined;
    }

    /**
     * This will be use for check null or space values
     *
     * @param {*} value
     * @return {*}  {boolean}
     * @memberof SubscriptionListComponent
     */
    public isNullOrEmpty(value: any): boolean {
        return value === null || value === "";
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
        return this.localeData?.search_field?.replace("[FIELD]", title);
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
            if (searchedFieldName === 'Company') {
                this.showName = false;
            } else if (searchedFieldName === 'Billing Account') {
                this.showBillingAccount = false;
            } else if (searchedFieldName === 'Subscriber') {
                this.showSubscriber = false;
            } else if (searchedFieldName === 'Country') {
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
        if (fieldName === 'Company') {
            this.showName = true;
        } else if (fieldName === 'Billing Account') {
            this.showBillingAccount = true;
        } else if (fieldName === 'Subscriber') {
            this.showSubscriber = true;
        } else if (fieldName === 'Country') {
            this.showCountry = true;
        } else if (fieldName === 'Plan Name') {
            this.showPlanSubName = true;
        } else if (fieldName === 'Monthly/Yearly') {
            this.showMonthlyYearly = true;
        } else if (fieldName === 'Status') {
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
     * @param {*} subscriptionId
     * @memberof SubscriptionListComponent
     */
    public transferSubscription(subscriptionId: any): void {
        this.menu.closeMenu();
        this.dialog.open(TransferDialogComponent, {
            data: subscriptionId,
            panelClass: 'transfer-popup',
            width: 'var(--aside-pane-width)',
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
            width: 'var(--aside-pane-width)',
            role: 'alertdialog',
            ariaLabel: 'moveDialog'
        });
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
        this.router.navigate(['/pages/user-details/subscription/buy-plan']);
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
            width: 'var(--aside-pane-width)',
            role: 'alertdialog',
            ariaLabel: 'confirmDialog'
        });

        cancelDialogRef.afterClosed().subscribe((action) => {
            if (action) {
                this.componentStore.cancelSubscription(id);
            } else {
                cancelDialogRef?.close();
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
        this.router.navigate(['/pages/user-details/subscription/change-billing/' + data]);
    }

    /**
     * Navigates to the page for viewing a subscription in the SubscriptionComponent.
     *
     * @param data - The subscription data to view.
     * @memberof SubscriptionComponent
     */
    public viewSubscription(data: any): void {
        this.router.navigate(['/pages/user-details/subscription/view-subscription/' + data?.subscriptionId]);
    }

    /**
     * Navigates to the page for purchasing a plan in the SubscriptionComponent.
     *
     * @memberof SubscriptionComponent
     */
    public buyPlan(subscription: any, type: string): void {
        if (type === 'renew') {
            this.router.navigate(
                ['/pages/user-details/subscription/buy-plan/' + subscription?.subscriptionId],
                { queryParams: { renew: 'true' } }
            );
        } else if (type === 'trial') {
            this.router.navigate(
                ['/pages/user-details/subscription/buy-plan/' + subscription?.subscriptionId],
                { queryParams: { trial: 'true' } }
            );
        } else {
            this.router.navigate(['/pages/user-details/subscription/buy-plan/' + subscription?.subscriptionId]);
        }
    }

    /**
     * Navigates to the page for changing a plan in the SubscriptionComponent.
     *
     * @param data - The subscription data for which the plan is to be changed.
     * @memberof SubscriptionComponent
     */
    public changePlan(subscription: any): void {
        this.router.navigate(['/pages/user-details/subscription/buy-plan/' + subscription.subscriptionId]);
    }

    /**
     * Navigates to the page for creating a new company.
     *
     * @param {string} subscriptionId
     * @memberof SubscriptionListComponent
     */
    public createCompanyInSubscription(subscriptionId: string): void {
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
     * This will be use for add company in subscription
     *
     * @param {*} company
     * @memberof SubscriptionListComponent
     */
    public addCompanyInSubscription(company: any): void {
        this.menu.closeMenu();
        this.subscriptionMove = false;
        this.selectedCompany = company;
        this.dialog.open(this.moveCompany, {
            width: 'var(--aside-pane-width)',
            role: 'alertdialog',
            ariaLabel: 'moveDialog'
        });
    }

    /**
     * This will be use for manage payment methods
     *
     * @param {*} event
     * @memberof SubscriptionListComponent
     */
    public managePaymentMethod(event: any): void {
        this.menu?.closeMenu();
        this.subscriptionMove = true;
        let data = {
            rowData: event,
            subscriptions: this.subscriptions,
            selectedCompany: this.selectedCompany,
            localeData: this.localeData,
            commonLocaleData: this.commonLocaleData,
            subscriptionMove: this.subscriptionMove
        }
        this.dialog.open(PaymentMethodDialogComponent, {
            data: data,
            panelClass: 'subscription-sidebar',
            role: 'alertdialog',
            ariaLabel: 'paymentDialog'
        });
    }

    /**
    *  This will be use for get all subscriptions for add company and move company
    *
    * @param {*} event
    * @memberof SubscriptionListComponent
    */
    public addOrMoveCompanyCallback(event: boolean): void {
        if (event) {
            this.getAllSubscriptions(false);
        }
    }

    /**
     * Archives or unarchives a company in the SubscriptionListComponent.
     *
     * @param data - The data of the company to be archived or unarchived.
     * @param type - The type of action, whether to archive or unarchive.
     * @memberof SubscriptionListComponent
     */
    public archiveCompany(data: any, type: string): void {
        let request = {
            companyUniqueName: data?.companies[0]?.uniqueName,
            status: { archiveStatus: type }
        };
        this.openConfirmationDialog(request);
    }

    /**
     * Open confirmation dialog for archive company
     *
     * @private
     * @param {*} request
     * @memberof SubscriptionListComponent
     */
    private openConfirmationDialog(request: any): void {
        let text = this.localeData?.confirm_archive_message;
        text = text?.replace("[TYPE]", request.status.archiveStatus === 'UNARCHIVED' ? this.commonLocaleData?.app_unarchive : this.commonLocaleData?.app_archive);
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '540px',
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: text,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.componentStoreCompanyListDialog.archiveCompany(request);
            }
        });
    }
}
