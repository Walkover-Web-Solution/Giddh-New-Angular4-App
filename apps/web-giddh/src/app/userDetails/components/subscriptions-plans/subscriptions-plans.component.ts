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

@Component({
    selector: 'subscriptions-plans',
    styleUrls: ['./subscriptions-plans.component.scss'],
    templateUrl: './subscriptions-plans.component.html'
})

export class SubscriptionsPlansComponent implements OnInit, OnDestroy {
    @Input() public subscriptions: any;
    public logedInUser: UserDetails;
    public SubscriptionPlans: CreateCompanyUsersPlan[] = [];
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

    toggleDisplay() {
        this.isShow = !this.isShow;
    }

    @Output() public isSubscriptionPlanShow = new EventEmitter<boolean>();
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    modalRef: BsModalRef;
    public showPlans: any = '';
    public totalMultipleCompanyPlans: number = 0;
    public totalSingleCompanyPlans: number = 0;
    public totalFreePlans: number = 0;

    constructor(private modalService: BsModalService, private _generalService: GeneralService,
        private _authenticationService: AuthenticationService, private store: Store<AppState>,
        private _route: Router, private companyActions: CompanyActions,
        private settingsProfileActions: SettingsProfileActions) {
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.store.select(profile => profile.settings.profile).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && !_.isEmpty(response)) {
                let companyInfo = _.cloneDeep(response);
                this._authenticationService.getAllUserSubsciptionPlans(companyInfo.countryV2.alpha2CountryCode).subscribe(res => {
                    this.SubscriptionPlans = res.body;

                    if(this.SubscriptionPlans && this.SubscriptionPlans.length > 0) {
                        this.SubscriptionPlans.forEach(item => {
                            if(!item.subscriptionId && item.planDetails) {
                                if(item.planDetails.amount && item.planDetails.companiesLimit > 1) {
                                    this.totalMultipleCompanyPlans++;
                                } else if(item.planDetails.amount && item.planDetails.companiesLimit === 1) {
                                    this.totalSingleCompanyPlans++;
                                } else if(!item.planDetails.amount) {
                                    this.totalFreePlans++;
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

                if(this.selectNewPlan) {
                    this.backClicked();
                    this.selectNewPlan = false;
                }
            }
        });
    }
    public ngOnDestroy() { }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }
    openModalTwo(modalTwo: TemplateRef<any>) {
        this.modalRef = this.modalService.show(modalTwo);
    }

    allFeaturesModal(AllFeatures: TemplateRef<any>) {
        this.modalRef = this.modalService.show(AllFeatures, { class: 'modal-lg all-features-modal'});
    }

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

}
