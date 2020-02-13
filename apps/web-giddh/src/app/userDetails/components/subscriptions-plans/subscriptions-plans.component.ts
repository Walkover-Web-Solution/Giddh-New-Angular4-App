import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
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
import { ToasterService } from '../../../services/toaster.service';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'subscriptions-plans',
    styleUrls: ['./subscriptions-plans.component.css'],
    templateUrl: './subscriptions-plans.component.html'
})

export class SubscriptionsPlansComponent implements OnInit, OnDestroy {

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

    @Output() public isSubscriptionPlanShow = new EventEmitter<boolean>();
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    modalRef: BsModalRef;
    constructor(private modalService: BsModalService, private _generalService: GeneralService,
        private _authenticationService: AuthenticationService, private store: Store<AppState>,
        private _route: Router, private companyActions: CompanyActions,
        private settingsProfileActions: SettingsProfileActions,
        private _toast: ToasterService) {
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.store.select(p => p.settings.profile).pipe(takeUntil(this.destroyed$)).subscribe((o) => {
            if (o && !_.isEmpty(o)) {
                let companyInfo = _.cloneDeep(o);
                this._authenticationService.getAllUserSubsciptionPlans(companyInfo.countryV2.alpha2CountryCode).subscribe(res => {
                    this.SubscriptionPlans = res.body;
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
        // this.isUpdateCompanySuccess$.subscribe(p => {
        //   if (p) {
        //     this._toast.successToast("Plan changed successfully");
        //   }
        // });
        this.isUpdateCompanyInProgress$.pipe(takeUntil(this.destroyed$)).subscribe(inProcess => {
            if (inProcess) {
                this.isSwitchPlanInProcess = inProcess;
            } else {
                this.isSwitchPlanInProcess = false;
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
