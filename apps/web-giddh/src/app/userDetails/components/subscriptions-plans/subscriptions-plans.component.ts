import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit, TemplateRef, Output, EventEmitter, Input } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserDetails } from '../../../models/api-models/loginModels';
import { GeneralService } from '../../../services/general.service';
import { CreateCompanyUsersPlan, SubscriptionRequest } from '../../../models/api-models/Company';
import { AuthenticationService } from '../../../services/authentication.service';
import { AppState } from '../../../store';
import { SettingsProfileActions } from '../../../actions/settings/profile/settings.profile.action';
import { CompanyActions } from '../../../actions/company.actions';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DEFAULT_SIGNUP_TRIAL_PLAN, DEFAULT_POPULAR_PLAN } from '../../../app.constant';

@Component({
    selector: 'subscriptions-plans',
    styleUrls: ['./subscriptions-plans.component.scss'],
    templateUrl: './subscriptions-plans.component.html'
})

export class SubscriptionsPlansComponent implements OnInit, OnDestroy {
    @Input() public subscriptions: any;
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
    /* This will contain the type of plans we have to show */
    public showPlans: any = '';
    /* This will contain the number of plans with multiple companies */
    public totalMultipleCompanyPlans: number = 0;
    /* This will contain the number of plans with single company */
    public totalSingleCompanyPlans: number = 0;
    /* This will contain the number of plans with free plan */
    public totalFreePlans: number = 0;
    /* This will contain the default plans of multiple companies */
    public defaultMultipleCompanyPlan: any;
    /* This will contain the default plans of single companies */
    public defaultSingleCompanyPlan: any;
    /* This will contain the default plans of free companies */
    public defaultFreePlan: any;
    /* This will contain the tooltip content of transaction limit */
    public transactionLimitTooltipContent: string = "It is the maximum number of transactions (each contains a debit entry and a credit entry) allowed in a plan. Beyond this, charges apply (0.10 INR/transaction).";
    /* This will contain the tooltip content of unlimited users */
    public unlimitedUsersTooltipContent: string = "No limit on the number of users you can add for any role.";
    /* This will contain the tooltip content of unlimited customers */
    public unlimitedCustomersVendorsTooltipContent: string = "No limit on the number of customers or vendors you add in your books.";
    /* This will contain the tooltip content of desktop and mobile app */
    public desktopMobileAppTooltipContent: string = "Other than cloud access, install Giddh desktop app for Mac and Windows; mobile app for Android and iPhone.";
    /* This will contain the plan unique name of default trial plan */
    public defaultTrialPlan: string = DEFAULT_SIGNUP_TRIAL_PLAN;
    /* This will contain the plan name of popular plan */
    public defaultPopularPlan: string = DEFAULT_POPULAR_PLAN;

    constructor(private modalService: BsModalService, private _generalService: GeneralService,
        private _authenticationService: AuthenticationService, private store: Store<AppState>,
        private _route: Router, private companyActions: CompanyActions,
        private settingsProfileActions: SettingsProfileActions) {

        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.store.select(profile => profile.settings.profile).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && !_.isEmpty(response)) {
                let companyInfo = _.cloneDeep(response);
                this._authenticationService.getAllUserSubsciptionPlans(companyInfo.countryV2.alpha2CountryCode).subscribe(res => {
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
                this.currentCompany = companyInfo.name;
            }
        });
        this.isUpdateCompanyInProgress$ = this.store.select(s => s.settings.updateProfileInProgress).pipe(takeUntil(this.destroyed$));
        this.isUpdateCompanySuccess$ = this.store.select(s => s.settings.updateProfileSuccess).pipe(takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        if (this._generalService.user) {
            this.logedInUser = this._generalService.user;
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
    }

    public ngOnDestroy() { }

    /**
     * This will open the all features popup
     *
     * @param {TemplateRef<any>} AllFeatures
     * @memberof SubscriptionsPlansComponent
     */
    public allFeaturesModal(AllFeatures: TemplateRef<any>) {
        this.modalRef = this.modalService.show(AllFeatures, { class: 'modal-lg all-features-modal' });
    }

    /**
     * This will take the user back to last page
     *
     * @memberof SubscriptionsPlansComponent
     */
    public backClicked() {
        this.isSubscriptionPlanShow.emit(true);
    }

    public buyPlanClicked(plan: any) {
        let activationKey = this.licenceKey.value;
        if (activationKey) {
            this.SubscriptionRequestObj.licenceKey = activationKey;
        } else {
            this.SubscriptionRequestObj.licenceKey = "";
        }
        this._route.navigate(['billing-detail', 'buy-plan']);
        this.store.dispatch(this.companyActions.selectedPlan(plan));
    }

    public patchProfile(obj) {
        this.store.dispatch(this.settingsProfileActions.PatchProfile(obj));
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
            this.patchProfile({ subscriptionRequest: this.SubscriptionRequestObj });
            this.licenceKey.setValue('');
        } else {
            this.SubscriptionRequestObj.licenceKey = '';
            this.patchProfile({ subscriptionRequest: this.SubscriptionRequestObj });
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
    navigate(element: HTMLElement): void {
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
}
