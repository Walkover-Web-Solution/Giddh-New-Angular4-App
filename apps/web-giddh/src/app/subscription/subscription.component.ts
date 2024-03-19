import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { ToasterService } from '../services/toaster.service';
import { CompanyListComponent } from './company-list/company-list.component';
import { TransferComponent } from './transfer/transfer.component';
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
import { cloneDeep, uniqBy } from '../lodash-optimized';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import { MatMenuTrigger } from '@angular/material/menu';
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
    /** Hold the data of activity logs */
    public dataSource: any;
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds Store Plan list observable*/
    public subscriptionList$ = this.componentStore.select(state => state.subscriptionList);
    /** Holds Store Plan list API success state as observable*/
    public subscriptionListInProgress$ = this.componentStore.select(state => state.subscriptionListInProgress);
    /** This will use for branch transer pagination logs object */
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
    /** Form Group for group form */
    public subscriptionListForm: FormGroup;
    /** True, if custom date filter is selected or custom searching or sorting is performed */
    public showClearFilter: boolean = false;
    /* True if show sender receiver show */
    public showBillingAccount = false;
    /* True if show from warehouse show */
    public showSubscriber = false;
    /* True if show to warehouse show */
    public showCountry = false;
    /* True if show sender show */
    public showName = false;
    /* True if show receiver show */
    public showPlanSubName = false;
    /* True if show receiver show */
    public showStatus = false;
    /* True if show receiver show */
    public showMonthlyYearly = false;
    /** Getter for show search element by type */
    public get shouldShowElement(): boolean {
        const hasResponse = this.dataSource?.filteredData?.length > 0;
        if (!hasResponse) {
            return false;
        }
        return (
            (hasResponse && this.inlineSearch !== 'name' || this.showClearFilter) ||
            (this.inlineSearch === 'name' && !hasResponse || this.showClearFilter) ||
            (hasResponse && this.inlineSearch === 'name' || this.showClearFilter) ||
            (hasResponse && this.inlineSearch !== 'billingAccountName' || this.showClearFilter) ||
            (this.inlineSearch === 'billingAccountName' && !hasResponse || this.showClearFilter) ||
            (hasResponse && this.inlineSearch === 'billingAccountName' || this.showClearFilter) ||
            (hasResponse && this.inlineSearch !== 'subscriber' || this.showClearFilter) ||
            (this.inlineSearch === 'subscriber' && !hasResponse || this.showClearFilter) ||
            (hasResponse && this.inlineSearch === 'subscriber' || this.showClearFilter) ||
            (hasResponse && this.inlineSearch !== 'country' || this.showClearFilter) ||
            (this.inlineSearch === 'country' && !hasResponse || this.showClearFilter) ||
            (hasResponse && this.inlineSearch === 'country' || this.showClearFilter) ||
            (hasResponse && this.inlineSearch !== 'planSubName' || this.showClearFilter) ||
            (this.inlineSearch === 'planSubName' && !hasResponse || this.showClearFilter) ||
            (hasResponse && this.inlineSearch === 'planSubName' || this.showClearFilter) ||
            (hasResponse && this.inlineSearch !== 'Status' || this.showClearFilter) ||
            (this.inlineSearch === 'Status' && !hasResponse || this.showClearFilter) ||
            (hasResponse && this.inlineSearch === 'Status' || this.showClearFilter) ||
            (hasResponse && this.inlineSearch !== 'monthYearly' || this.showClearFilter) ||
            (this.inlineSearch === 'monthYearly' && !hasResponse || this.showClearFilter) ||
            (hasResponse && this.inlineSearch === 'monthYearly' || this.showClearFilter)
        );
    }
    /** Holds Store Plan list observable*/
    public cancelSubscription$ = this.componentStore.select(state => state.cancelSubscription);
    /** Holds Store Plan list API success state as observable*/
    public subscribedCompanies$ = this.componentStore.select(state => state.subscribedCompanies);
    /** Holds Store Plan list API success state as observable*/
    public subscribedCompaniesInProgress$ = this.componentStore.select(state => state.subscribedCompaniesInProgress);
    /* This will hold list of subscriptions */
    public subscriptions: SubscriptionsUser[] = [];
    /** Observable to listen for subscriptions */
    public subscriptions$: Observable<SubscriptionsUser[]>;
    /* This will hold the companies to use in selected company */
    public selectedCompany: any;
    /** This will use for active company */
    public activeCompany: any = {};


    constructor(public dialog: MatDialog,
        private toaster: ToasterService,
        private changeDetection: ChangeDetectorRef,
        private generalService: GeneralService,
        private readonly componentStore: SubscriptionComponentStore,
        private store: Store<AppState>,
        private formBuilder: FormBuilder,
        private subscriptionsActions: SubscriptionsActions,
        private router: Router
    ) {
        this.subscriptions$ = this.store.pipe(select(state => state.subscriptions.subscriptions), takeUntil(this.destroyed$));
    }

    public ngOnInit(): void {
        document.body?.classList?.add("subscription-page");
        this.initAllForms();
        this.getAllSubscriptions(false);
        this.getCompanies();
        this.filterSubscriptions();

        /** Get Discount List */
        this.subscriptionList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.dataSource = new MatTableDataSource<any>(response?.body?.results);
                this.dataSource.paginator = this.paginator;
                this.subscriptionRequestParams.totalItems = response?.body?.totalItems;
            } else {
                this.dataSource = new MatTableDataSource<any>([]);
                this.subscriptionRequestParams.totalItems = 0;
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
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
        });
    }

    /**
 * This will use for init all forms value
 *
 * @memberof ListBranchTransfer
 */
    public initAllForms(): void {
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
   * @memberof ListBranchTransfer
   */
    public getSearchFieldText(title: any): string {
        let searchField = "Search [FIELD]";
        searchField = searchField?.replace("[FIELD]", title);
        return searchField;
    }

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
     * @memberof ListBranchTransferComponent
     */
    public toggleSearch(fieldName: string) {
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

    public getAllSubscriptions(resetPage: boolean): void {
        if (resetPage) {
            this.subscriptionRequestParams.page = 1;
        }
        let request = {
            pagination: this.subscriptionRequestParams,
            model:this.subscriptionListForm.value
        }
        this.componentStore.getAllSubscriptions(request);
    }

    /**
 * Handle page change
 *
 * @param {*} event
 * @memberof DiscountListComponent
 */
    public handlePageChange(event: any): void {
        this.pageIndex = event.pageIndex;
        this.subscriptionRequestParams.count = event.pageSize;
        this.subscriptionRequestParams.page = event.pageIndex + 1;
        this.getAllSubscriptions(false);
    }

    public createSubscription(): void {
        this.router.navigate(['/pages/subscription/buy-plan'])
    }

    /**
    * This function will use for get log details
    *
    * @param {*} element
    * @memberof SubscriptionComponent
    */
    public getCompanyList(event: any, element: any): void {
        this.menu.closeMenu();
        let data = {
            rowData: element,
            subscriptions: this.subscriptions,
            selectedCompany: this.selectedCompany,
            localData: this.localeData,
            commonLocaleData: this.commonLocaleData
        }
        this.dialog.open(CompanyListComponent, {
            data: data,
            panelClass: 'subscription-sidebar'
        });
    }

    /**
* This function will use for get log details
*
* @param {*} element
* @memberof SubscriptionComponent
*/
    public transferSubscription(subscriptionId: any): void {
        this.menu.closeMenu();
        this.dialog.open(TransferComponent, {
            data: subscriptionId,
            panelClass: 'transfer-popup',
            width: "630px"
        });
    }

    public cancelSubscription(id: any): void {
        this.menu.closeMenu();
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
                this.componentStore.cancelSubscription(id);
            } else {
                cancelDialogRef.close();
            }
        });
    }

    public moveSubscription(): void {
    }

    public changeBilling(data:any): void {
        // this.router.navigate(['/pages/subscription/change-billing/' + data?.subscriptionId]);
        this.router.navigate(['/pages/subscription/change-billing/vwz1709217636400']);
    }

    public viewSubscription(data: any): void {
        this.router.navigate(['/pages/subscription/view-subscription/' + data?.subscriptionId]);
    }

    public buyPlan(): void {
        this.router.navigate(['/pages/subscription/buy-plan']);
    }

    public changePlan(data:any): void {
        // this.router.navigate(['/pages/subscription/buy-plan' + data?.planDetails?.planUniqueName]);
        this.router.navigate(['/pages/subscription/buy-plan/cdy1710506146367']);
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

    /**
     *This function will open the move company popup
     *
     * @param {*} company
     * @memberof SubscriptionComponent
     */
    public openModalMove(company: any, event: any) {
        console.log(company);
        this.menu.closeMenu();
        this.selectedCompany = company.companies[0];
        this.dialog.open(this.moveCompany, { width: '40%' });
    }


    /**
   * This function will refresh the subscribed companies if move company was succesful and will close the popup
   *
   * @param {*} event
   * @memberof SubscriptionsComponent
   */
    public addOrMoveCompanyCallback(event: boolean): void {
        if (event === true) {
            this.getCompanies();
        }
    }

    /**
    * This function will use for get subscribed companies
    *
    * @memberof SubscriptionComponent
    */
    public getCompanies(): void {
        this.subscribedCompanies$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            this.store.dispatch(this.subscriptionsActions.SubscribedCompaniesResponse(res));
        });
    }

    /**
     *  This function will use for filter plans , withing and expiry in dropdown and searching subscriptions
     *
     * @memberof SubscriptionComponent
     */
    public filterSubscriptions(): void {
        this.subscriptions$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            let subscriptions = [];
            this.subscriptions = [];

            if (response?.length) {
                response.forEach(subscription => {
                    let subscriptionDetails = cloneDeep(subscription);

                    subscriptionDetails.remainingDays = Number(dayjs(subscriptionDetails.expiry, GIDDH_DATE_FORMAT).diff(dayjs(), 'day'));
                    subscriptionDetails.startedAt = dayjs(subscriptionDetails.startedAt, GIDDH_DATE_FORMAT).format("D MMM, YYYY");
                    subscriptionDetails.expiry = dayjs(subscriptionDetails.expiry, GIDDH_DATE_FORMAT).format("D MMM, YYYY");

                    subscriptions.push(subscriptionDetails);
                });
                if (subscriptions?.length > 0) {
                    this.subscriptions = subscriptions;
                    let loop = 0;
                    let activeCompanyIndex = -1;
                    this.subscriptions.forEach(res => {
                        if (res.subscriptionId === this.activeCompany?.subscription?.subscriptionId) {
                            activeCompanyIndex = loop;
                        }
                        loop++;
                    });
                    this.subscriptions = this.generalService.changeElementPositionInArray(this.subscriptions, activeCompanyIndex, 0);
                    this.subscriptions = uniqBy(this.subscriptions, "subscriptionId");
                }
            }
        });
    }

    public ngOnDestroy(): void {
        document.body?.classList?.remove("subscription-page");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
