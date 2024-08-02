import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { SubscriptionComponentStore } from '../../subscription/utility/subscription.store';
import { SearchCompanyRequest, SubscriptionRequest } from '../../models/api-models/Company';
import { AppState } from '../../store';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { PAGINATION_LIMIT } from '../../app.constant';
import { cloneDeep } from '../../lodash-optimized';

@Component({
    selector: 'move-company',
    styleUrls: ['./move-company.component.scss'],
    templateUrl: './move-company.component.html',
    providers: [SubscriptionComponentStore],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class MoveCompanyComponent implements OnInit, OnDestroy {
    /* Emit move company response */
    @Output() public moveCompany = new EventEmitter<boolean>();
    /* Hold subscriptions data */
    @Input() public subscriptions: any[] = [];
    /* Hold move selected company*/
    @Input() public moveSelectedCompany: any;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /* Hold available plans data */
    public availablePlans: any[] = [];
    /* Hold available plan options data */
    public availablePlansOption: IOption[] = [];
    /* Hold selected plan data */
    public selectedPlan: any;
    /* Hold subscription api request */
    public subscriptionRequestObj: SubscriptionRequest = {
        planUniqueName: '',
        subscriptionId: '',
        userUniqueName: '',
        licenceKey: ''
    };
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Control for the MatSelect filter keyword */
    public searchPlan: UntypedFormControl = new UntypedFormControl();
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** True if api call in progress */
    @Input() public subscriptionMove: boolean;
    /** Holds Store Subscription list observable*/
    public subscriptionList$ = this.componentStore.select(state => state.subscriptionList);
    /** Holds Store Companies list observable*/
    public companiesList$ = this.componentStore.select(state => state.companiesList);
    /** Stores the default search results pagination details */
    public companyName: string;
    /** Inventory Observable */
    public companyList$: Observable<any[]> = observableOf(null);
    /** Stock Transactional Object */
    public searchRequest: SearchCompanyRequest = new SearchCompanyRequest();
    /** Filtered options to show in autocomplete list */
    public fieldFilteredOptions: any[] = [];
    /** Stores the company details */
    public companyDetails: {
        name: '',
        uniqueName: '',
        additional: ''
    };

    constructor(
        private store: Store<AppState>,
        private settingsProfileActions: SettingsProfileActions,
        private componentStore: SubscriptionComponentStore,
        private changeDetection: ChangeDetectorRef
    ) { }

    /**
     * Initializes the component
     *
     * @memberof MoveCompanyComponent
     */
    public ngOnInit(): void {
        this.companyList$ = observableOf([]);
        if (this.subscriptionMove) {
            this.isLoading = true;
            let reqObj = {
                model: {
                    region: this.moveSelectedCompany?.region?.code,
                },
                pagination: {
                    page: 1,
                    count: PAGINATION_LIMIT
                }
            }
            this.componentStore.getAllSubscriptions(reqObj);
            this.subscriptionList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.isLoading = false;
                if (response) {
                    response?.body?.results.forEach(subscription => {
                        this.availablePlansOption.push({ label: `${subscription.plan?.name} -${subscription?.subscriptionId} (${subscription?.totalCompanies - subscription?.companyCount})`, value: `${subscription.subscriptionId}` });
                    });
                }
                this.changeDetection.detectChanges();
            });
        } else {
            this.isLoading = true;
            this.searchCompany(false);
            this.componentStore.companyList$.pipe(debounceTime(700),
                distinctUntilChanged(),
                takeUntil(this.destroyed$)).subscribe(data => {
                    if (data) {
                        this.isLoading = false;
                        const mappedCompanyWise = data?.results.map(item => ({
                            value: item.uniqueName,
                            label: item.name,
                            additional: item
                        }));
                        this.companyList$ = observableOf(mappedCompanyWise);
                    }
                    this.changeDetection.detectChanges();
                });
        }
    }

    /**
    * Searches the companies
    *
    * @param {boolean} [loadMore]
    * @memberof MoveCompanyComponent
    */
    public searchCompany(searchedText: any, loadMore: boolean = false): void {
        if (this.searchRequest.loadMore) {
            return;
        }
        if (searchedText !== null && searchedText !== undefined && typeof searchedText === 'string') {
            this.searchRequest.q = searchedText;
        }

        if (loadMore) {
            this.searchRequest.page++;
        } else {
            this.searchRequest.page = 1;
        }
        if (this.searchRequest.page === 1 || this.searchRequest.page <= this.searchRequest.totalPages) {
            delete this.searchRequest.totalItems;
            delete this.searchRequest.totalPages;
            this.searchRequest.subscriptionId = this.moveSelectedCompany?.subscriptionId;
            this.componentStore.getAllCompaniesBySubscriptionId(this.searchRequest);
            this.searchRequest.loadMore = true;
            let initialData = cloneDeep(this.fieldFilteredOptions);
            this.componentStore.companyList$.pipe(debounceTime(700),
                distinctUntilChanged(),
                takeUntil(this.destroyed$)).subscribe(response => {
                    this.isLoading = false;
                    this.searchRequest.loadMore = false;
                    if (response) {
                        if (loadMore) {
                            let nextPaginatedData = response.results.map(item => ({
                                value: item.uniqueName,
                                label: item.name,
                                additional: item
                            }));
                            let concatData = [...initialData, ...nextPaginatedData]
                            this.fieldFilteredOptions = concatData;
                            this.companyList$ = observableOf(concatData);
                        } else {
                            this.fieldFilteredOptions = response.results.map(item => ({
                                value: item.uniqueName,
                                label: item.name,
                                additional: item
                            }));
                            this.companyList$ = observableOf(this.fieldFilteredOptions);
                        }
                        this.searchRequest.totalItems = response.totalItems;
                        this.searchRequest.totalPages = response.totalPages;
                    } else {
                        this.companyList$ = observableOf([]);
                    }
                });
            this.changeDetection.detectChanges();
        }
    }

    /**
     * This will be use for select company
     *
     * @param {*} company
     * @memberof MoveCompanyComponent
     */
    public selectCompany(company: any): void {
        if (company) {
            this.companyDetails = company.additional;
            this.getMovePlanText();
        }
    }

    /**
    * Callback for company scroll end
    *
    * @memberof MoveCompanyComponent
    */
    public handleSearchCompanyScrollEnd(): void {
        this.searchCompany(this.searchRequest.q, true);
    }

    /**
     * This will initiate the update plan
     *
     * @memberof MoveCompanyComponent
     */
    public moveCompanyInNewPlan(): void {
        this.subscriptionRequestObj = {
            planUniqueName: '',
            subscriptionId: this.subscriptionMove ? this.selectedPlan : this.moveSelectedCompany.subscriptionId,
            userUniqueName: this.moveSelectedCompany?.createdBy?.uniqueName,
            licenceKey: ''
        };
        if (this.subscriptionMove) {
            this.patchProfile({ subscriptionRequest: this.subscriptionRequestObj, callNewPlanApi: true, moveCompany: this.moveSelectedCompany?.uniqueName });
        } else {
            this.patchProfile({ subscriptionRequest: this.subscriptionRequestObj, callNewPlanApi: true, moveCompany: this.moveSelectedCompany?.uniqueName, companyUniqueName: this.companyDetails.uniqueName });
        }
    }

    /**
     * This will dispatch the update plan api and will close popup
     *
     * @param {*} obj
     * @memberof MoveCompanyComponent
     */
    public patchProfile(obj: any): void {
        this.moveCompany.emit(true);
        this.store.dispatch(this.settingsProfileActions.PatchProfile(obj));
    }

    /**
    * Releases memory
    *
    * @memberof MoveCompanyComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will return move plan text
     *
     * @returns {string}
     * @memberof MoveCompanyComponent
     */
    public getMovePlanText(): string {
        let text = '';
        if (this.subscriptionMove) {
            text = this.localeData?.subscription?.move_plan_note ? this.localeData?.subscription?.move_plan_note : this.localeData?.move_plan_note;
            text = text?.replace("[COMPANY_NAME]", this.moveSelectedCompany?.name ? this.moveSelectedCompany?.name : (this.moveSelectedCompany?.companies && this.moveSelectedCompany?.companies[0]?.name ? this.moveSelectedCompany?.companies[0]?.name : this.moveSelectedCompany?.companiesList[0]?.name))?.replace("[PLAN_NAME]", this.moveSelectedCompany?.subscription?.planDetails?.name ? this.moveSelectedCompany?.subscription?.planDetails?.name : this.moveSelectedCompany?.plan?.name);
        } else {
            text = this.localeData.company_note;
            text = text?.replace("[COMPANY_NAME]", this.companyDetails?.name ?? '');
        }
        return text;
    }
}
