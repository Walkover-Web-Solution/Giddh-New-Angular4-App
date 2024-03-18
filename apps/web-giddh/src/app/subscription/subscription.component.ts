import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, ReplaySubject, takeUntil } from 'rxjs';
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
@Component({
    selector: 'subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SubscriptionComponentStore]
})
export class SubscriptionComponent implements OnInit, OnDestroy {
    /** Holds Paginator Reference */
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will use for table heading */
    public displayedColumns: string[] = ['name', 'billingAccount', 'subscriber', 'country', 'planSubName', 'status', 'monthYearly', 'renewalDate'];
    /** Hold the data of activity logs */
    public dataSource: any;
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds Store Plan list observable*/
    public subscriptionList$ = this.componentStore.select(state => state.subscriptionList);
    /** Holds Store Plan list API success state as observable*/
    public subscriptionListInProgress$ = this.componentStore.select(state => state.subscriptionListInProgress);
    /** This will use for branch transer pagination logs object */
    public subscriptionPaginationObject = {
        page: 1,
        totalPages: 0,
        totalItems: 0,
        count: PAGINATION_LIMIT
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
            (hasResponse && this.inlineSearch !== 'billingAccount' || this.showClearFilter) ||
            (this.inlineSearch === 'billingAccount' && !hasResponse || this.showClearFilter) ||
            (hasResponse && this.inlineSearch === 'billingAccount' || this.showClearFilter) ||
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


    constructor(public dialog: MatDialog,
        private toaster: ToasterService,
        private changeDetection: ChangeDetectorRef,
        private generalService: GeneralService,
        private readonly componentStore: SubscriptionComponentStore,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
    }

    public ngOnInit(): void {
        document.body?.classList?.add("subscription-page");
        this.initAllForms();
        this.getAllSubscriptions(false);

        /** Get Discount List */
        this.subscriptionList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.length) {
                this.dataSource = new MatTableDataSource<any>(response);
                this.dataSource.paginator = this.paginator;
                this.subscriptionPaginationObject.totalItems = response?.totalItems;
            } else {
                this.dataSource = new MatTableDataSource<any>([]);
                this.subscriptionPaginationObject.totalItems = 0;
            }
        });

        this.cancelSubscription$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.router.navigate(['/pages/subscription']);
            }
        });

        this.subscriptionListForm?.controls['name'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
        });
        this.subscriptionListForm?.controls['billingAccount'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
        });
        this.subscriptionListForm?.controls['subscriber'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
        });
        this.subscriptionListForm?.controls['country'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.getAllSubscriptions(true);
            }
        });
        this.subscriptionListForm?.controls['planSubName'].valueChanges.pipe(
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

        this.subscriptionListForm?.controls['monthYearly'].valueChanges.pipe(
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
            name: null,
            billingAccount: null,
            subscriber: null,
            country: null,
            planSubName: null,
            status: null,
            monthYearly: null
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
        if (searchedFieldName === 'Name') {
            if (this.subscriptionListForm?.controls['name'].value !== null && this.subscriptionListForm?.controls['name'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'Billing Account') {
            if (this.subscriptionListForm?.controls['billingAccount'].value !== null && this.subscriptionListForm?.controls['billingAccount'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'Subscriber') {
            if (this.subscriptionListForm?.controls['subscriber'].value !== null && this.subscriptionListForm?.controls['subscriber'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'Country') {
            if (this.subscriptionListForm?.controls['country'].value !== null && this.subscriptionListForm?.controls['country'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'Plan Sub Name') {
            if (this.subscriptionListForm?.controls['planSubName'].value !== null && this.subscriptionListForm?.controls['planSubName'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'Status') {
            if (this.subscriptionListForm?.controls['status'].value !== null && this.subscriptionListForm?.controls['status'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'Monthly/Yearly') {
            if (this.subscriptionListForm?.controls['monthYearly'].value !== null && this.subscriptionListForm?.controls['monthYearly'].value !== '') {
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
        this.subscriptionListForm.reset();
        this.inlineSearch = '';
        this.getAllSubscriptions(true);
    }

    public getAllSubscriptions(resetPage: boolean): void {
        if (resetPage) {
            this.subscriptionPaginationObject.page = 1;
        }
        this.componentStore.getAllSubscriptions(null);
    }

    /**
 * Handle page change
 *
 * @param {*} event
 * @memberof DiscountListComponent
 */
    public handlePageChange(event: any): void {
        this.pageIndex = event.pageIndex;
        this.subscriptionPaginationObject.count = event.pageSize;
        this.subscriptionPaginationObject.page = event.pageIndex + 1;
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
    public transferSubscription(subscriptionId:any): void {
        this.dialog.open(TransferComponent, {
            data: subscriptionId,
            panelClass: 'transfer-popup',
            width: "630px"
        });
    }

    public cancelSubscription(id:any): void {
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

    public changeBilling(): void {
        this.router.navigate(['/pages/subscription/change-billing']);
    }

    public viewSubscription(data:any): void {
        this.router.navigate(['/pages/subscription/view-subscription/' + data?.subscriptionId]);
    }

    public buyPlan(): void {
        this.router.navigate(['/pages/subscription/buy-plan']);
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
