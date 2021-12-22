import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, OnDestroy, OnInit, TemplateRef, Output, EventEmitter, Input, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserDetails } from '../../../models/api-models/loginModels';
import { GeneralService } from '../../../services/general.service';
import { CreateCompanyUsersPlan, SubscriptionRequest } from '../../../models/api-models/Company';
import { AuthenticationService } from '../../../services/authentication.service';
import { AppState } from '../../../store';
import { SettingsProfileActions } from '../../../actions/settings/profile/settings.profile.action';
import { CompanyActions } from '../../../actions/company.actions';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DEFAULT_SIGNUP_TRIAL_PLAN, DEFAULT_POPULAR_PLAN } from '../../../app.constant';
import { SettingsProfileService } from '../../../services/settings.profile.service';
import { ToasterService } from '../../../services/toaster.service';
import { MatDialog } from '@angular/material/dialog';
import { AllFeaturesComponent } from '../all-features/all-features.component';
import { SubscriptionsUser } from '../../../models/api-models/Subscriptions';
import { uniqBy } from '../../../lodash-optimized';


/** This will use for static data for plan table  */
const TABLE_DATA: any[] = [
    { name: '', transactions: 0, amount: 0, companies: 0, consultant: '', unlimited_users: true, unlimited_customers: true, desktop_mobile_app: true, check_all_features: true },
    { name: '', transactions: 0, amount: 0, companies: 0, consultant: '', unlimited_users: true, unlimited_customers: true, desktop_mobile_app: true, check_all_features: true },
    { name: '', transactions: 0, amount: 0, companies: 0, consultant: '', unlimited_users: true, unlimited_customers: true, desktop_mobile_app: true, check_all_features: true },
    { name: '', transactions: 0, amount: 0, companies: 0, consultant: '', unlimited_users: true, unlimited_customers: true, desktop_mobile_app: true, check_all_features: true },
    { name: '', transactions: 0, amount: 0, companies: 0, consultant: '', unlimited_users: true, unlimited_customers: true, desktop_mobile_app: true, check_all_features: true },
    { name: '', transactions: 0, amount: 0, companies: 0, consultant: '', unlimited_users: true, unlimited_customers: true, desktop_mobile_app: true, check_all_features: true },
    { name: '', transactions: 0, amount: 0, companies: 0, consultant: '', unlimited_users: true, unlimited_customers: true, desktop_mobile_app: true, check_all_features: true },
    { name: '', transactions: 0, amount: 0, companies: 0, consultant: '', unlimited_users: true, unlimited_customers: true, desktop_mobile_app: true, check_all_features: true }
];
@Component({
    selector: 'subscriptions-plans',
    styleUrls: ['./subscriptions-plans.component.scss'],
    templateUrl: './subscriptions-plans.component.html'
})
export class SubscriptionsPlansComponent implements OnInit, OnDestroy {
    @Input() public subscriptions: any;
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** This will hold to show subscription plan */
    @Output() public isSubscriptionPlanShow = new EventEmitter<boolean>();
    /** This will use for table content scroll in mobile */
    @ViewChild('tableContent', { read: ElementRef }) public tableContent: ElementRef<any>;
    /** This will use for table columns */
    public inputColumns = ['benefits']; //['name', 'transactions', 'companies', 'consultant', 'unlimited_users', 'unlimited_customers', 'desktop_mobile_app', 'check_all_features'];
    /** This will use for hold table data */
    public inputData = TABLE_DATA;
    /** This will be use for display columns of plan table  */
    public displayColumns: any[];
    /** This will use for display data of plan table */
    public displayData: any[];
    /** This will hold the login user */
    public logedInUser: UserDetails;
    public subscriptionPlans: CreateCompanyUsersPlan[] = [];
    public currentCompany: any;
    public SubscriptionRequestObj: SubscriptionRequest = {
        planUniqueName: '',
        subscriptionId: '',
        userUniqueName: '',
        licenceKey: ''
    };
    public licenceKey = new FormControl();
    public isUpdateCompanyInProgress$: Observable<boolean>;
    public isUpdateCompanySuccess$: Observable<boolean>;
    public isSwitchPlanInProcess: boolean = false;
    public selectNewPlan: boolean = false;
    public isShow = true;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Ths reference will use for bootstrap model */
    public modalRef: BsModalRef;
    /** This will contain the type of plans we have to show */
    public showPlans: any = '';
    /** This will contain the number of plans with multiple companies */
    public totalMultipleCompanyPlans: number = 0;
    /** This will contain the number of plans with single company */
    public totalSingleCompanyPlans: number = 0;
    /** This will contain the number of plans with free plan */
    public totalFreePlans: number = 0;
    /** This will contain the default plans of multiple companies */
    public defaultMultipleCompanyPlan: any;
    /** This will contain the default plans of single companies */
    public defaultSingleCompanyPlan: any;
    /** This will contain the default plans of free companies */
    public defaultFreePlan: any;
    /** This will contain the tooltip content of transaction limit */
    public transactionLimitTooltipContent: string = "";
    /** This will contain the tooltip content of unlimited users */
    public unlimitedUsersTooltipContent: string = "";
    /** This will contain the tooltip content of unlimited customers */
    public unlimitedCustomersVendorsTooltipContent: string = "";
    /** This will contain the tooltip content of desktop_mobile_appp and mobile app */
    public desktop_mobile_apppMobileAppTooltipContent: string = "";
    /** This will contain the plan unique name of default trial plan */
    public defaultTrialPlan: string = DEFAULT_SIGNUP_TRIAL_PLAN;
    /** This will contain the plan name of popular plan */
    public defaultPopularPlan: string = DEFAULT_POPULAR_PLAN;
    /** This will hold if plans are showing */
    public isShowPlans: boolean = false;
    /** This will hold the object of active company */
    public activeCompany;
    /** This will stores the seleceted user plans */
    public seletedUserPlans: SubscriptionsUser;
    /** This will stores the subscription plans  */
    public subscriptionPlan: CreateCompanyUsersPlan;
    /** True if api call in progress */
    public showLoader: boolean = true;
    /**  This will be use for all subscription  */
    private allSubscriptions: any[] = [];

    constructor(private modalService: BsModalService, private generalService: GeneralService,
        private changeDetectionRef: ChangeDetectorRef, private authenticationService: AuthenticationService, private store: Store<AppState>,
        private router: Router, private companyActions: CompanyActions, public dialog: MatDialog,
        private settingsProfileActions: SettingsProfileActions, private settingsProfileService: SettingsProfileService, private toasty: ToasterService, public route: ActivatedRoute) {

        this.store.pipe(select(profile => profile.settings.profile), takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && !_.isEmpty(response)) {
                let companyInfo = _.cloneDeep(response);
                if (companyInfo?.countryV2?.alpha2CountryCode) { }
                this.currentCompany = companyInfo?.name;
            }
        });
        this.isUpdateCompanyInProgress$ = this.store.pipe(select(s => s.settings.updateProfileInProgress), takeUntil(this.destroyed$));
        this.isUpdateCompanySuccess$ = this.store.pipe(select(s => s.settings.updateProfileSuccess), takeUntil(this.destroyed$));

    }

    public ngOnInit() {

        /** This will use for get the active company from store  */
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                if (!this.activeCompany) {
                    this.getPlans(activeCompany);
                }
                this.activeCompany = activeCompany;
            }
        });

        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());

        this.transactionLimitTooltipContent = this.localeData?.subscription?.transaction_limit_content;
        this.unlimitedUsersTooltipContent = this.localeData?.subscription?.unlimited_users_content;
        this.unlimitedCustomersVendorsTooltipContent = this.localeData?.subscription?.unlimited_customers_content;
        this.desktop_mobile_apppMobileAppTooltipContent = this.localeData?.subscription?.desktop_mobile_appp_mobile_app_content;

        this.router.navigate(['/pages', 'user-details', 'subscription'], {
            queryParams: {
                showPlans: true
            }
        });

        if (this.generalService.user) {
            this.logedInUser = this.generalService.user;
        }

        this.isUpdateCompanyInProgress$.pipe(takeUntil(this.destroyed$)).subscribe(inProcess => {
            if (inProcess) {
                this.isSwitchPlanInProcess = inProcess;
            } else {
                this.isSwitchPlanInProcess = false;

                if (this.selectNewPlan) {
                    this.backClicked();
                    this.selectNewPlan = false;
                }
            }
        });

        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
            if (val && val.showPlans === "true") {
                this.isShowPlans = true;
            }

            if ((!val || val.showPlans !== "true") && this.isShowPlans) {
                this.backClicked();
                this.isShowPlans = false;
                this.selectNewPlan = false;
            }
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will open the all features popup
     *
     *
     * @memberof SubscriptionsPlansComponent
     */
    public openDialog() {
        this.dialog.open(AllFeaturesComponent, {
            panelClass: 'custom-modalbox',
            height: '40%',
            width: '60%'
        });
    }


    /**
     * This will take the user back to last page
     *
     * @memberof SubscriptionsPlansComponent
     */
    public backClicked() {
        this.isSubscriptionPlanShow.emit(true);
        this.router.navigate(['/pages', 'user-details', 'subscription']);
    }

    public buyPlanClicked(plan: any) {
        let activationKey = this.licenceKey.value;
        if (activationKey) {
            this.SubscriptionRequestObj.licenceKey = activationKey;
        } else {
            this.SubscriptionRequestObj.licenceKey = "";
        }
        this.router.navigate(['pages', 'billing-detail', 'buy-plan']);
        this.store.dispatch(this.companyActions.selectedPlan(this.allSubscriptions[plan.uniqueName]));

    }

    public patchProfile(obj) {
        this.settingsProfileService.PatchProfile(obj).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === "error") {
                this.toasty.errorToast(response.message);
            } else {
                this.store.dispatch(this.settingsProfileActions.handleFreePlanSubscribed(true));
                this.toasty.successToastWithHtml(this.commonLocaleData?.app_messages?.welcome_onboard);
                this.backClicked();
            }
        });
    }

    public choosePlan(plan: CreateCompanyUsersPlan) {
        this.selectNewPlan = true;
        let activationKey = this.licenceKey.value;
        if (activationKey) {
            this.SubscriptionRequestObj.licenceKey = activationKey;
        } else {
            this.SubscriptionRequestObj.licenceKey = "";
        }
        this.SubscriptionRequestObj.userUniqueName = this.logedInUser.uniqueName;
        if (plan.subscriptionId) { // bought plan
            this.SubscriptionRequestObj.subscriptionId = plan.subscriptionId;
            this.patchProfile({ subscriptionRequest: this.SubscriptionRequestObj, callNewPlanApi: true });
        } else if (!plan.subscriptionId) { // free plan
            this.SubscriptionRequestObj.planUniqueName = plan.planDetails.uniqueName;
            this.patchProfile({ subscriptionRequest: this.SubscriptionRequestObj, callNewPlanApi: true });
        }
    }

    public createCompanyViaActivationKey() {
        let activationKey = this.licenceKey.value;
        this.SubscriptionRequestObj.userUniqueName = this.logedInUser.uniqueName;
        if (activationKey) {
            this.SubscriptionRequestObj.licenceKey = activationKey;
            this.patchProfile({ subscriptionRequest: this.SubscriptionRequestObj, callNewPlanApi: true });
            this.licenceKey.setValue('');
        } else {
            this.SubscriptionRequestObj.licenceKey = '';
            this.patchProfile({ subscriptionRequest: this.SubscriptionRequestObj, callNewPlanApi: true });
            this.licenceKey.setValue('');
        }
    }

    /**
     * This function will show plans based on type (multiple company, single company and free plans)
     *
     * @param {string} type
     * @memberof SubscriptionsPlansComponent
     */
    public showPlansByType(type: string): void {
        if (!this.showPlans) {
            this.showPlans = type;
        }
    }

    /**
     * This function smooth scroller for all plans section
     * @param {string} type
     * @memberof SubscriptionsPlansComponent
     */
    public navigate(element: HTMLElement): void {
        element.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * This is callback for all features popup
     *
     * @memberof SubscriptionsPlansComponent
     */
    public closeFeaturesModal(): void {
        this.modalRef.hide();
    }

    /**
     * This will return welcome user text
     *
     * @returns {string}
     * @memberof SubscriptionsPlansComponent
     */
    public getWelcomeUserText(): string {
        let text = this.localeData?.subscription?.hi_user;
        text = text?.replace("[USER_NAME]", this.logedInUser?.name);
        return text;
    }

    /**
    * This function will use for renew plan
    *
    * @memberof SubscriptionsPlansComponent
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

            this.router.navigate(['pages', 'billing-detail', 'buy-plan']);
            this.store.dispatch(this.companyActions.selectedPlan(this.subscriptionPlan));
        } else {
            this.SubscriptionRequestObj.userUniqueName = this.logedInUser.uniqueName;
            if (this.seletedUserPlans?.subscriptionId) {
                this.SubscriptionRequestObj.subscriptionId = this.seletedUserPlans?.subscriptionId;
                this.patchProfile({ subscriptionRequest: this.SubscriptionRequestObj, callNewPlanApi: true });
            } else if (!this.seletedUserPlans?.subscriptionId) {
                this.SubscriptionRequestObj.planUniqueName = this.seletedUserPlans?.planDetails?.uniqueName;
                this.patchProfile({ subscriptionRequest: this.SubscriptionRequestObj, callNewPlanApi: true });
            }
        }
    }


    /**
     * This function will use for get plans
     *
     * @private
     * @param {*} activeCompany
     * @memberof SubscriptionsPlansComponent
     */
    private getPlans(activeCompany: any): void {
        this.authenticationService.getAllUserSubsciptionPlans(activeCompany?.countryV2?.alpha2CountryCode).pipe(takeUntil(this.destroyed$)).subscribe(res => {
            let subscriptions = res.body;

            subscriptions.forEach(subscription => {
                this.allSubscriptions[subscription.planDetails.uniqueName] = [];
                this.allSubscriptions[subscription.planDetails.uniqueName] = subscription;
            });
            this.inputData = [];
            let loop = 0;
            let allPlans = uniqBy(subscriptions.map(subscription => { return subscription.planDetails }), "name");
            allPlans.forEach(plan => {
                this.inputData.push(plan);
                loop++;
            });

            this.showLoader = false;
            this.changeDetectionRef.detectChanges();
        });
    }
    /**
     * This function will use for format table input row for plans
     *
     * @param {*} row
     * @return {*}
     * @memberof SubscriptionsPlansComponent
     */
    public formatInputRow(row) {
        const output = {};
        for (let i = 0; i < this.inputData.length; ++i) {
            output[this.inputData[i].name] = this.inputData[i][row];
        }
        return output;
    }

    /**
    * This will scroll the right slide in mobile view for table
    *
    * @memberof SubscriptionsPlansComponent
    */
    public scrollRight(): void {
        this.tableContent.nativeElement.scrollTo({ left: (this.tableContent.nativeElement.scrollLeft + 150), behavior: 'smooth' });
    }

    /**
     *This will scroll the left slide in mobile view for table
     *
     * @memberof SubscriptionsPlansComponent
     */
    public scrollLeft(): void {
        this.tableContent.nativeElement.scrollTo({ left: (this.tableContent.nativeElement.scrollLeft - 150), behavior: 'smooth' });
    }
}

