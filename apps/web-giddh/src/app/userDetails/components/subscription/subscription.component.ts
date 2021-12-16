import { Component, OnInit, ViewChild, Input, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, SimpleChanges, OnChanges, TemplateRef } from "@angular/core";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { MatAccordion } from "@angular/material/expansion";
import { MatDialog } from "@angular/material/dialog";
import { SubscriptionsActions } from '../../../actions/userSubscriptions/subscriptions.action';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SubscriptionsUser, UserDetails } from "../../../models/api-models/Subscriptions";
import { Observable, ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { uniqBy } from "../../../lodash-optimized";
import * as moment from "moment";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CreateCompanyUsersPlan, SubscriptionRequest } from "../../../models/api-models/Company";
import { CompanyActions } from "../../../actions/company.actions";
import { SettingsProfileActions } from "../../../actions/settings/profile/settings.profile.action";
import { GeneralService } from "../../../services/general.service";


export interface PeriodicElement {
    consumed: number;
    balance: number;
    dues: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
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
    /** This will change the search bar height dynamically */
    public menuBarHeight: Number = 40;
    public menuOneWidth: Number;
    public menuTwoWidth: Number;
    /** This will change the rowspan of main content and oak plan list dynamically */
    public sideBarBoxLength: Number = 15;
    public sideBarBoxWidth: Number;
    public mainContentWidth: Number;
    /** This will change the height of oak plan list dynamically */
    public rowLength: Number = 180;
    /** This will change the length of overall summary box dynamically */
    public overallSummaryTopRow: Number = 6;
    public overallSummaryBottomRow: Number = 4;
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /**  This will use for companies list expansion in accordian */
    @ViewChild(MatAccordion) accordion: MatAccordion;
    /** This will use for move company in to another company  */
    @ViewChild("moveCompany", { static: false }) public moveCompany: any;
    /* Object of bootstrap modal */
    public modalRef: BsModalRef;
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
    /** This will stores the seleceted user plans */
    public seletedUserPlans: SubscriptionsUser;
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
    public expiringList: any[] = [
        { name: '7 Days', value: 7 },
        { name: '15 Days', value: 15 },
        { name: '1 Month', value: 31 },
        { name: '6 Months', value: 180 },
        { name: '1 Year', value: 365 }
    ];

    /** This will store the static data in transaction balance list  */
    public transactionBalanceList: any[] = [
        { name: 'Less than 1,000', value: 1000 },
        { name: 'Less than 5,000', value: 5000 },
        { name: 'Less than 10,000', value: 10000 },
        { name: 'Less than 50,000', value: 50000 }
    ];
    
    /** This will displays the columns of consumed  */
    displayedColumns: string[] = ['consumed', 'balance', 'dues'];
    dataSource = ELEMENT_DATA;

    constructor(
        public dialog: MatDialog,
        public breakpointObserver:
            BreakpointObserver,
        private subscriptionsActions: SubscriptionsActions,
        private store: Store<AppState>,
        private subscriptionService: SubscriptionsService,
        private modalService: BsModalService,
        private activeRoute: ActivatedRoute,
        private changeDetectionRef: ChangeDetectorRef,
        private route: Router,
        private companyActions: CompanyActions,
        private settingsProfileActions: SettingsProfileActions,
        private generalService: GeneralService
    ) {

        this.subscriptions$ = this.store.pipe(select(state => state.subscriptions.subscriptions), takeUntil(this.destroyed$));
    }

    public ngOnInit(): void {

        this.isPlanShow = false;

        /** This condition will use for general service for logged in user */
        if (this.generalService.user) {
            this.loggedInUser = this.generalService.user;
        }

        /** This will hit the api of get companies */
        this.getCompanies();

        /** This subscription subscribes and get the response */
        this.subscriptions$.subscribe(response => {
            if (response) {
                this.subscriptions = response.map(subscription => {
                    subscription.remainingDays = Number(moment(subscription.expiry, GIDDH_DATE_FORMAT).diff(moment(), 'days'));
                    subscription.startedAt = moment(subscription.startedAt, GIDDH_DATE_FORMAT).format("D MMM, y");
                    subscription.expiry = moment(subscription.expiry, GIDDH_DATE_FORMAT).format("D MMM, y");
                    return subscription;
                });
                this.plansList = uniqBy(response.map(subscription => { return { name: subscription.planDetails?.name, uniqueName: subscription.planDetails?.uniqueName } }), "uniqueName");
                this.changeDetectionRef.detectChanges();
            }
        });

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
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';


        /** This will use for responsive */
        this.breakpointObserver.observe([
            '(min-width: 768px)',
            '(min-width: 1024px)',
            '(min-width: 1536px)'
        ]).subscribe((state: BreakpointState) => {

            if (state.breakpoints['(min-width: 768px)']) {
                this.rowLength = 120;
                //         this.menuBarHeight = 5.5;
                //         this.sideBarBoxLength = 13;
                this.sideBarBoxWidth = 5;
                this.mainContentWidth = 11;
                this.menuOneWidth = 5;
                this.menuTwoWidth = 11;
            }
            if (state.breakpoints['(min-width: 1024px)']) {
                this.rowLength = 120;
                this.menuBarHeight = 40;
                this.sideBarBoxLength = 15;
                this.overallSummaryTopRow = 5;
                this.overallSummaryBottomRow = 3;
                this.sideBarBoxWidth = 4;
                this.mainContentWidth = 12;
                this.menuOneWidth = 4;
                this.menuTwoWidth = 12;
            }
            if (state.breakpoints['(min-width: 1536px)']) {
                this.rowLength = 150;
                this.menuBarHeight = 40;
                this.sideBarBoxLength = 15;
                this.overallSummaryTopRow = 6;
                this.overallSummaryBottomRow = 4;
                this.sideBarBoxWidth = 4;
                this.mainContentWidth = 12;
                this.menuOneWidth = 4;
                this.menuTwoWidth = 12;
            }
        })
    }

    /**
     * This function will use for get subscribed companies 
     *
     * @memberof SubscriptionComponent
     */
    public getCompanies(): void {
        this.isPlanShow = false;
        this.showLoader = true;
        //This service will use for get subscribed companies
        this.subscriptionService.getSubScribedCompanies().pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            this.showLoader = false;
            // this.isPlanShow = true;
            if (res?.status === "success" && res?.body) {
                this.store.dispatch(this.subscriptionsActions.SubscribedCompaniesResponse(res));
            } else {
                // this.isPlanShow = true;
                this.showLoader = false;
            }
        });
    }

    /**
     * This function will use foe open dialog
     *
     * @memberof SubscriptionComponent
     */
    public openDialog() {
        const dialogRef = this.dialog.open(this.moveCompany, { height: '50%', width: '40%' });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    /**
   * This function will refresh the subscribed companies if move company was succesful and will close the popup
   *
   * @param {*} event
   * @memberof SubscriptionsComponent
   */
    public addOrMoveCompanyCallback(event): void {
        if (event === true) {
            this.store.dispatch(this.subscriptionsActions.SubscribedCompanies());
        }
        this.modalRef.hide();
    }

    /**
     *  This function will open the deactive company popup
     *
     * @param {TemplateRef<any>} MoveCompany
     * @memberof SubscriptionComponent
     */
    public openModal(MoveCompany: TemplateRef<any>) {
        this.modalRef = this.modalService.show(MoveCompany);
    }

    /**
     *This function will open the move company popup
     *
     * @param {TemplateRef<any>} deactivateCompany
     * @param {*} company
     * @memberof SubscriptionComponent
     */
    public openModalMove(deactivateCompany: TemplateRef<any>, company: any) {
        this.selectedCompany = company;
        this.modalRef = this.modalService.show(deactivateCompany);
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
     *  This function will use for on changes
     *
     * @param {SimpleChanges} changes
     * @memberof SubscriptionComponent
     */
    public ngOnChanges(changes: SimpleChanges): void { }

    /**
     *  This function will use for filter plans , withing and expiry in dropdown and searching subscriptions
     *
     * @memberof SubscriptionComponent
     */
    public filterSubscriptions(): void {
        let subscriptions = [];
        this.subscriptions = [];
        this.subscriptions$.subscribe(response => {
            if (response) {
                response.forEach(subscription => {
                    let flag = true;
                    if (
                        (this.searchSubscription?.value && subscription?.planDetails?.name?.toLowerCase()?.indexOf(this.searchSubscription?.value?.toLowerCase()) === -1) ||
                        (this.filters?.plan && subscription?.planDetails?.uniqueName !== this.filters?.plan) ||
                        (this.filters?.expiration && (subscription?.remainingDays < 0 || subscription?.remainingDays > this.filters?.expiration)) ||
                        (this.filters?.transactionBalance && (subscription?.remainingTransactions < 0 || subscription?.remainingTransactions > this.filters?.transactionBalance))
                    ) {
                        flag = false;
                    }
                    if (flag) {
                        subscriptions.push(subscription);
                    }
                });
                this.subscriptions = subscriptions;
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
        this.searchSubscription = new FormControl();
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
    public isSubscriptionPlanShow(event: any) {
        if (event) {
            this.isPlanShow = !event;
        }
    }

    /**
     * This function will use for renew plan
     *
     * @memberof SubscriptionComponent
     */
    public renewPlan(): void {
        if (this.seletedUserPlans && this.seletedUserPlans.planDetails && this.seletedUserPlans.planDetails.amount > 0) {

            this.subscriptionPlan = {
                companies: this.seletedUserPlans.companies,
                totalCompanies: this.seletedUserPlans.totalCompanies,
                userDetails: {
                    name: this.seletedUserPlans.userDetails?.name,
                    uniqueName: this.seletedUserPlans.userDetails?.uniqueName,
                    email: this.seletedUserPlans.userDetails?.email,
                    signUpOn: this.seletedUserPlans.userDetails?.signUpOn,
                    mobileno: this.seletedUserPlans.userDetails?.mobileno
                },
                additionalTransactions: this.seletedUserPlans.additionalTransactions,
                createdAt: this.seletedUserPlans.createdAt,
                planDetails: this.seletedUserPlans.planDetails,
                additionalCharges: this.seletedUserPlans.additionalCharges,
                status: this.seletedUserPlans.status,
                subscriptionId: this.seletedUserPlans.subscriptionId,
                balance: this.seletedUserPlans.balance,
                expiry: this.seletedUserPlans.expiry,
                startedAt: this.seletedUserPlans.startedAt,
                companiesWithTransactions: this.seletedUserPlans.companiesWithTransactions,
                companyTotalTransactions: this.seletedUserPlans.companyTotalTransactions,
                totalTransactions: this.seletedUserPlans.totalTransactions
            };

            this.route.navigate(['pages', 'billing-detail', 'buy-plan']);
            this.store.dispatch(this.companyActions.selectedPlan(this.subscriptionPlan));
        } else {
            this.subscriptionRequestObj.userUniqueName = this.loggedInUser.uniqueName;
            if (this.seletedUserPlans?.subscriptionId) {
                this.subscriptionRequestObj.subscriptionId = this.seletedUserPlans?.subscriptionId;
                this.patchProfile({ subscriptionRequest: this.subscriptionRequestObj, callNewPlanApi: true });
            } else if (!this.seletedUserPlans?.subscriptionId) {
                this.subscriptionRequestObj.planUniqueName = this.seletedUserPlans?.planDetails?.uniqueName;
                this.patchProfile({ subscriptionRequest: this.subscriptionRequestObj, callNewPlanApi: true });
            }
        }
    }

    /**
     * This function will use for patch profile 
     *
     * @param {*} obj
     * @memberof SubscriptionComponent
     */
    public patchProfile(obj): void {
        this.store.dispatch(this.settingsProfileActions.PatchProfile(obj));
    }
}