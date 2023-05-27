import { Component, OnInit, ViewChild, Input, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, OnChanges } from "@angular/core";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { MatAccordion } from "@angular/material/expansion";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { SubscriptionsActions } from '../../../actions/user-subscriptions/subscriptions.action';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { SubscriptionsUser, UserDetails } from "../../../models/api-models/Subscriptions";
import { Observable, ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { cloneDeep, uniqBy } from "../../../lodash-optimized";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CreateCompanyUsersPlan, SubscriptionRequest } from "../../../models/api-models/Company";
import { CompanyActions } from "../../../actions/company.actions";
import { SettingsProfileActions } from "../../../actions/settings/profile/settings.profile.action";
import { GeneralService } from "../../../services/general.service";


/** This interface will use for monthly data */
export interface MonthlyData {
    consumed: number;
    balance: number;
    dues: string;
}

/** This static dummy data will use for monthly tab  */
const MONTHLY_DATA: MonthlyData[] = [
    { consumed: 2000, balance: 8000, dues: '₹500' },
    { consumed: 6, balance: 14, dues: '₹4,000' },
    { consumed: 6, balance: 14, dues: '₹2,000' },
];

@Component({
    selector: 'subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionComponent implements OnInit, OnDestroy, OnChanges {
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /**  This will use for companies list expansion in accordian */
    @ViewChild(MatAccordion) accordion: MatAccordion;
    /** This will use for move company in to another company  */
    @ViewChild("moveCompany", { static: false }) public moveCompany: any;
    /** This will change the search bar width dynamically */
    public menuOneWidth: number = 4;
    public menuTwoWidth: number = 12;
    /** This will change the rowspan of main content and plan list dynamically */
    public sideBarBoxLength: number = 15;
    public sideBarBoxWidth: number = 4;
    public mainContentWidth: number = 12;
    /** This will change the height of plan list dynamically */
    public rowLength: number = 150;
    /** This will change the length of overall summary box dynamically */
    public overallSummaryTopRow: number = 6;
    public overallSummaryBottomRow: number = 4;
    /* This will hold list of subscriptions */
    public subscriptions: SubscriptionsUser[] = [];
    /** Observable to listen for subscriptions */
    public subscriptions$: Observable<SubscriptionsUser[]>;
    /* This will hold the Subscription to use in selected subscriptions */
    public selectedSubscription: any;
    /** This will hold the plan list */
    public plansList: any[] = [];
    /* This will hold the companies to use in selected company */
    public selectedCompany: any;
    /* This will hold if plan option is choosen */
    public isPlanShow: boolean = false;
    /** Stores the current searched subscription */
    public searchSubscription: FormControl = new FormControl();
    /** To destroy observers */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if api call in progress */
    public showLoader: boolean = false;
    /** Image path variable */
    public imgPath: string = '';
    /** This will filter the dropdowns of expiry and transaction balance in subscription list */
    public filters: any = { plan: '', expiration: '', transactionBalance: '' };
    /** This will stores the subscription plans  */
    public subscriptionPlan: CreateCompanyUsersPlan;
    /** This will send the subscription object for buy and renew plan */
    public subscriptionRequestObj: SubscriptionRequest = {
        planUniqueName: '',
        subscriptionId: '',
        userUniqueName: '',
        licenceKey: ''
    };
    /** This will hold the login user */
    public loggedInUser: UserDetails;
    /** This will store the static data in expiry list */
    public expiringList: any[] = [];
    /** This will store the static data in transaction balance list  */
    public transactionBalanceList: any[] = [];
    /** This will store the static data in transaction balance list  */
    public subscriptionsDummy: any[] = [1, 2, 3, 4, 5];
    /** This will displays the columns of consumed  */
    public displayedColumns: string[] = ['consumed', 'balance', 'dues'];
    /** This will use for static data for consumed */
    public dataSource = MONTHLY_DATA;
    /** This will use for expand collapse for companies */
    public isExpand: boolean = false;
    /** This will use for active company */
    public activeCompany: any = {};

    constructor(
        public dialog: MatDialog,
        public breakpointObserver: BreakpointObserver,
        private subscriptionsActions: SubscriptionsActions,
        private store: Store<AppState>,
        private subscriptionService: SubscriptionsService,
        private activeRoute: ActivatedRoute,
        private changeDetectionRef: ChangeDetectorRef,
        private route: Router,
        private companyActions: CompanyActions,
        private settingsProfileActions: SettingsProfileActions,
        private generalService: GeneralService
    ) {
        this.subscriptions$ = this.store.pipe(select(state => state.subscriptions.subscriptions), takeUntil(this.destroyed$));
    }

    /**
     * Initializes the component
     *
     * @memberof SubscriptionComponent
     */
    public ngOnInit(): void {
        /** This will use for by default plan div hide */
        this.isPlanShow = false;

        /** This condition will use for general service for logged in user */
        if (this.generalService.user) {
            this.loggedInUser = this.generalService.user;
        }

        /** This will hit the api of get companies */
        this.getCompanies();

        this.filterSubscriptions();

        /** listen for search field value changes */
        this.searchSubscription.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.filterSubscriptions();
        });

        /** This will get the activate routing by query params */
        this.activeRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
            if (val.showPlans) {
                this.isPlanShow = true;
            }
        });

        /** This will use for image format */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });

        /** This will use for responsive */
        this.breakpointObserver.observe([
            '(min-width: 768px)',
            '(min-width: 1024px)',
            '(min-width: 1536px)'
        ]).subscribe((state: BreakpointState) => {
            if (state.breakpoints['(min-width: 1536px)']) {
                this.rowLength = 150;
                this.sideBarBoxLength = 15;
                this.overallSummaryTopRow = 6;
                this.overallSummaryBottomRow = 4;
                this.sideBarBoxWidth = 4;
                this.mainContentWidth = 12;
                this.menuOneWidth = 4;
                this.menuTwoWidth = 12;
            } else
                if (state.breakpoints['(min-width: 768px)']) {
                    this.rowLength = 120;
                    this.sideBarBoxWidth = 5;
                    this.mainContentWidth = 11;
                    this.menuOneWidth = 5;
                    this.menuTwoWidth = 11;
                } else if (state.breakpoints['(min-width: 1024px)']) {
                    this.rowLength = 120;
                    this.sideBarBoxLength = 15;
                    this.overallSummaryTopRow = 5;
                    this.overallSummaryBottomRow = 3;
                    this.sideBarBoxWidth = 4;
                    this.mainContentWidth = 12;
                    this.menuOneWidth = 2;
                    this.menuTwoWidth = 14;
                }
        });
    }

    public ngOnChanges(): void {
        this.translationComplete();
    }
    /**
     * This function will use for get subscribed companies
     *
     * @memberof SubscriptionComponent
     */
    public getCompanies(): void {
        this.showLoader = true;

        //This service will use for get subscribed companies
        this.subscriptionService.getSubScribedCompanies().pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            this.showLoader = false;
            if (res && res.status === "success") {
                if (!res.body || !res.body[0]) {
                    this.isPlanShow = true;
                    this.changeDetectionRef.detectChanges();
                } else {
                    this.store.dispatch(this.subscriptionsActions.SubscribedCompaniesResponse(res));
                }
            }
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
            this.getCompanies();
        }
    }

    /**
     *This function will open the move company popup
     *
     * @param {*} company
     * @memberof SubscriptionComponent
     */
    public openModalMove(company: any, event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.selectedCompany = company;
        this.dialog.open(this.moveCompany, { height: '50%', width: '40%' });
    }

    /**
    * This function will use for destroy on next and complete
    *
    * @memberof SubscriptionComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     *  This function will use for select subscriptions
     *
     * @param {*} subscription
     * @memberof SubscriptionComponent
     */
    public selectSubscription(subscription: any): void {
        this.selectedSubscription = subscription;
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

                    let flag = true;
                    if (
                        (this.searchSubscription?.value && (subscriptionDetails?.subscriptionId?.toLowerCase()?.indexOf(this.searchSubscription?.value?.toLowerCase()) === -1 && !(subscriptionDetails?.companiesWithTransactions?.filter(company => company?.name?.toLowerCase()?.indexOf(this.searchSubscription?.value?.toLowerCase()) > -1)?.length)) ||
                        (this.filters?.plan && subscriptionDetails?.planDetails?.uniqueName !== this.filters?.plan) ||
                        (this.filters?.expiration && (subscriptionDetails?.remainingDays < 0 || subscriptionDetails?.remainingDays > this.filters?.expiration)) ||
                        (this.filters?.transactionBalance && (subscriptionDetails?.remainingTransactions < 0 || subscriptionDetails?.remainingTransactions > this.filters?.transactionBalance))
                    ) ||
                        (this.filters?.plan && subscriptionDetails?.planDetails?.uniqueName !== this.filters?.plan) ||
                        (this.filters?.expiration && (subscriptionDetails?.remainingDays < 0 || subscriptionDetails?.remainingDays > this.filters?.expiration)) ||
                        (this.filters?.transactionBalance && (subscriptionDetails?.remainingTransactions < 0 || subscriptionDetails?.remainingTransactions > this.filters?.transactionBalance))
                    ) {
                        flag = false;
                    }
                    if (flag) {
                        subscriptions.push(subscriptionDetails);
                    }
                });

                this.plansList = uniqBy(response.map(subscription => { return { name: subscription.planDetails?.name, uniqueName: subscription.planDetails?.uniqueName } }), "uniqueName");
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

                if (!this.showLoader) {
                    this.selectSubscription((this.subscriptions?.length) ? this.subscriptions[0] : null);
                }
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    /**
     * This function will use for reset filter plans , withing and expiry in dropdown and searching subscriptions
     *
     * @memberof SubscriptionComponent
     */
    public clearFilters(): void {
        this.searchSubscription.setValue('');
        this.filters.plan = '';
        this.filters.expiration = '';
        this.filters.transactionBalance = '';
        this.filterSubscriptions();
    }

    /**
     * This function will use for hold the subscription plan show
     *
     * @param {*} event
     * @memberof SubscriptionComponent
     */
    public isSubscriptionPlanShow(event: any): void {
        if (event) {
            this.isPlanShow = !event;
            this.selectSubscription(null);
            this.getCompanies();
        }
    }

    /**
     * This function will use for renew plan
     *
     * @memberof SubscriptionComponent
     */
    public renewPlan(): void {
        if (this.selectedSubscription?.planDetails?.amount > 0) {
            this.subscriptionPlan = {
                companies: this.selectedSubscription.companies,
                totalCompanies: this.selectedSubscription.totalCompanies,
                userDetails: {
                    name: this.selectedSubscription.userDetails?.name,
                    uniqueName: this.selectedSubscription.userDetails?.uniqueName,
                    email: this.selectedSubscription.userDetails?.email,
                    signUpOn: this.selectedSubscription.userDetails?.signUpOn,
                    mobileno: this.selectedSubscription.userDetails?.mobileno
                },
                additionalTransactions: this.selectedSubscription.additionalTransactions,
                createdAt: this.selectedSubscription.createdAt,
                planDetails: this.selectedSubscription.planDetails,
                additionalCharges: this.selectedSubscription.additionalCharges,
                status: this.selectedSubscription?.status,
                subscriptionId: this.selectedSubscription.subscriptionId,
                balance: this.selectedSubscription.balance,
                expiry: this.selectedSubscription.expiry,
                startedAt: this.selectedSubscription.startedAt,
                companiesWithTransactions: this.selectedSubscription.companiesWithTransactions,
                companyTotalTransactions: this.selectedSubscription.companyTotalTransactions,
                totalTransactions: this.selectedSubscription.totalTransactions
            };
            this.route.navigate(['pages', 'billing-detail', 'buy-plan']);
            this.store.dispatch(this.companyActions.selectedPlan(this.subscriptionPlan));
        } else {
            this.subscriptionRequestObj.userUniqueName = this.loggedInUser?.uniqueName;
            if (this.selectedSubscription?.subscriptionId) {
                this.subscriptionRequestObj.subscriptionId = this.selectedSubscription?.subscriptionId;
                this.patchProfile({ subscriptionRequest: this.subscriptionRequestObj, callNewPlanApi: true });
            } else if (!this.selectedSubscription?.subscriptionId) {
                this.subscriptionRequestObj.planUniqueName = this.selectedSubscription?.planDetails?.uniqueName;
                this.patchProfile({ subscriptionRequest: this.subscriptionRequestObj, callNewPlanApi: true });
            }
        }
        this.changeDetectionRef.detectChanges();
    }

    /**
     * This function will use for patch profile
     *
     * @param {*} obj
     * @memberof SubscriptionComponent
     */
    public patchProfile(obj: any): void {
        this.store.dispatch(this.settingsProfileActions.PatchProfile(obj));
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof SubscriptionComponent
     */
    public translationComplete(): void {
        this.expiringList = [
            { name: this.localeData?.expiring_list?.seven_days, value: 7 },
            { name: this.localeData?.expiring_list?.fifteen_days, value: 15 },
            { name: this.localeData?.expiring_list?.one_month, value: 31 },
            { name: this.localeData?.expiring_list?.six_months, value: 180 },
            { name: this.localeData?.expiring_list?.one_year, value: 365 }
        ];
        this.transactionBalanceList = [
            { name: this.localeData?.transaction_balance_list?.less_than_1k, value: 1000 },
            { name: this.localeData?.transaction_balance_list?.less_than_5k, value: 5000 },
            { name: this.localeData?.transaction_balance_list?.less_than_10k, value: 10000 },
            { name: this.localeData?.transaction_balance_list?.less_than_50k, value: 50000 }
        ];
    }
}
