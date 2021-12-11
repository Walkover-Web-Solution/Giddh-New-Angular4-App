import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, OnDestroy, OnInit, TemplateRef, Output, EventEmitter, Input } from '@angular/core';
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
    @Output() public isSubscriptionPlanShow = new EventEmitter<boolean>();
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    modalRef: BsModalRef;
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
    /** This will contain the tooltip content of desktop and mobile app */
    public desktopMobileAppTooltipContent: string = "";
    /** This will contain the plan unique name of default trial plan */
    public defaultTrialPlan: string = DEFAULT_SIGNUP_TRIAL_PLAN;
    /** This will contain the plan name of popular plan */
    public defaultPopularPlan: string = DEFAULT_POPULAR_PLAN;
    /** This will hold if plans are showing */
    public isShowPlans: boolean = false;

    constructor(private modalService: BsModalService, private generalService: GeneralService,
        private authenticationService: AuthenticationService, private store: Store<AppState>,
        private router: Router, private companyActions: CompanyActions,
        private settingsProfileActions: SettingsProfileActions, private settingsProfileService: SettingsProfileService, private toasty: ToasterService, public route: ActivatedRoute) {

        this.store.pipe(select(profile => profile.settings.profile), takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && !_.isEmpty(response)) {
                let companyInfo = _.cloneDeep(response);

                if(companyInfo?.countryV2?.alpha2CountryCode) {
                    this.authenticationService.getAllUserSubsciptionPlans(companyInfo?.countryV2?.alpha2CountryCode).pipe(takeUntil(this.destroyed$)).subscribe(res => {
                        this.subscriptionPlans = res.body;

                        this.totalMultipleCompanyPlans = 0;
                        this.totalSingleCompanyPlans = 0;
                        this.totalFreePlans = 0;

                        if (this.subscriptionPlans && this.subscriptionPlans.length > 0) {
                            this.subscriptionPlans.forEach(item => {
                                if (!item.subscriptionId && item.planDetails) {
                                    if (item.planDetails.uniqueName !== this.defaultTrialPlan) {
                                        if (item.planDetails.amount && item.planDetails.companiesLimit > 1) {

                                            if (!this.defaultMultipleCompanyPlan) {
                                                this.defaultMultipleCompanyPlan = item;
                                            }

                                            this.totalMultipleCompanyPlans++;
                                        } else if (item.planDetails.amount && item.planDetails.companiesLimit === 1) {

                                            if (!this.defaultSingleCompanyPlan && item.planDetails.name === this.defaultPopularPlan) {
                                                this.defaultSingleCompanyPlan = item;
                                            }

                                            this.totalSingleCompanyPlans++;
                                        } else if (!item.planDetails.amount) {

                                            if (!this.defaultFreePlan) {
                                                this.defaultFreePlan = item;
                                            }

                                            this.totalFreePlans++;
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
                this.currentCompany = companyInfo?.name;
            }
        });
        this.isUpdateCompanyInProgress$ = this.store.pipe(select(s => s.settings.updateProfileInProgress), takeUntil(this.destroyed$));
        this.isUpdateCompanySuccess$ = this.store.pipe(select(s => s.settings.updateProfileSuccess), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        
        this.transactionLimitTooltipContent = this.localeData?.subscription?.transaction_limit_content;
        this.unlimitedUsersTooltipContent = this.localeData?.subscription?.unlimited_users_content;
        this.unlimitedCustomersVendorsTooltipContent = this.localeData?.subscription?.unlimited_customers_content;
        this.desktopMobileAppTooltipContent = this.localeData?.subscription?.desktop_mobile_app_content;

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
     * @param {TemplateRef<any>} AllFeatures
     * @memberof SubscriptionsPlansComponent
     */
    public allFeaturesModal(AllFeatures: TemplateRef<any>) {
        this.modalRef = this.modalService.show(AllFeatures, { class: 'modal-xl all-features-modal' });
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
        this.store.dispatch(this.companyActions.selectedPlan(plan));
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
}
