import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { GeneralService } from '../services/general.service';
import { Route } from '@angular/compiler/src/core';
import { CompanyActions } from '../actions/company.actions';
import { ToasterService } from '../services/toaster.service';
import { AuthenticationService } from '../services/authentication.service';
import { CompanyCreateRequest, CreateCompanyUsersPlan, SubscriptionRequest, CompanyResponse } from '../models/api-models/Company';
import { ReplaySubject, Observable } from 'rxjs';
import { UserDetails } from '../models/api-models/loginModels';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CompanyService } from '../services/companyService.service';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-select-plan',
    templateUrl: './selectPlan.component.html',
    styleUrls: [`./selectPlan.component.scss`],
})
export class SelectPlanComponent implements OnInit, OnDestroy {

    public createNewCompanyPreObj: CompanyCreateRequest;
    public logedInUser: UserDetails;
    public SubscriptionRequestObj: SubscriptionRequest = {
        planUniqueName: '',
        subscriptionId: '',
        userUniqueName: '',
        licenceKey: ''
    };
    public licenceKey = new FormControl();
    public SubscriptionPlans: CreateCompanyUsersPlan[] = [];
    public subscriptionPrice: any = '';
    public UserCurrency: string = '';

    public companies$: Observable<CompanyResponse[]>;
    public isCompanyCreationInProcess$: Observable<boolean>;
    public isRefreshing$: Observable<boolean>;
    public isCompanyCreated$: Observable<boolean>;
    public isCreateAndSwitchCompanyInProcess: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private _generalService: GeneralService, private _companyService: CompanyService, private _route: Router, private _authenticationService: AuthenticationService, private companyActions: CompanyActions, private _toasty: ToasterService) {

    }

    public ngOnInit() {

        this.store.pipe(select(s => s.session.createCompanyUserStoreRequestObj), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.createNewCompanyPreObj = res;
                this.getSubscriptionPlans();
                if (this.createNewCompanyPreObj.baseCurrency) {
                    this.UserCurrency = this.createNewCompanyPreObj.baseCurrency;
                }
            }
        });

        this.store.pipe(select(s => s.session.createBranchUserStoreRequestObj), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.isBranch && res.city) {
                    this.createNewCompanyPreObj = res;
                    this.getSubscriptionPlans();
                    if (this.createNewCompanyPreObj.baseCurrency) {
                        this.UserCurrency = this.createNewCompanyPreObj.baseCurrency;
                    }
                }
            }
        });

        this.logedInUser = this._generalService.user;
        this.SubscriptionRequestObj.userUniqueName = this.logedInUser.uniqueName;

        this.companies$ = this.store.select(s => s.session.companies).pipe(takeUntil(this.destroyed$));
        this.isCompanyCreationInProcess$ = this.store.select(s => s.session.isCompanyCreationInProcess).pipe(takeUntil(this.destroyed$));
        this.isRefreshing$ = this.store.select(s => s.session.isRefreshing).pipe(takeUntil(this.destroyed$));

        this.isCompanyCreated$ = this.store.select(s => s.session.isCompanyCreated).pipe(takeUntil(this.destroyed$));
        this.isCompanyCreationInProcess$.pipe(takeUntil(this.destroyed$)).subscribe(isINprocess => {
            this.isCreateAndSwitchCompanyInProcess = isINprocess;
        });
        this.isRefreshing$.pipe(takeUntil(this.destroyed$)).subscribe(isInpro => {
            this.isCreateAndSwitchCompanyInProcess = isInpro;
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public buyPlanClicked(plan: any) {
        this.subscriptionPrice = plan.planDetails.amount;
        this.SubscriptionRequestObj.userUniqueName = this.logedInUser.uniqueName;
        this.SubscriptionRequestObj.planUniqueName = plan.planDetails.uniqueName;
        if (this.subscriptionPrice && this.UserCurrency) {
            this._companyService.getRazorPayOrderId(this.subscriptionPrice, this.UserCurrency).subscribe((res: any) => {
                if (res.status === 'success') {
                    this.createNewCompanyPreObj.amountPaid = res.body.amount;
                    this.createNewCompanyPreObj.orderId = res.body.id;

                    if (this.createNewCompanyPreObj) {
                        this.createNewCompanyPreObj.subscriptionRequest = this.SubscriptionRequestObj;
                    }
                    if (!this.createNewCompanyPreObj.isBranch && !this.createNewCompanyPreObj.city) {
                        this.store.dispatch(this.companyActions.selectedPlan(plan));
                        this.store.dispatch(this.companyActions.userStoreCreateCompany(this.createNewCompanyPreObj));
                        this._generalService.createNewCompany = this.createNewCompanyPreObj;
                    }
                    this._route.navigate(['billing-detail']);
                } else {
                    this._toasty.errorToast(res.message);
                }
            });
        }
    }

    public createCompany(item: CreateCompanyUsersPlan) {
        let activationKey = this.licenceKey.value;
        if (activationKey) {
            this.SubscriptionRequestObj.licenceKey = activationKey;
        } else {
            this.SubscriptionRequestObj.licenceKey = "";
        }
        this.store.dispatch(this.companyActions.selectedPlan(item));
        if (!this.createNewCompanyPreObj) {
            this._route.navigate(['new-user']);
        } else {
            if (item.subscriptionId) {
                this.SubscriptionRequestObj.subscriptionId = item.subscriptionId;
                this.createNewCompanyPreObj.subscriptionRequest = this.SubscriptionRequestObj;
                this.store.dispatch(this.companyActions.CreateNewCompany(this.createNewCompanyPreObj));
            } else {
                this.SubscriptionRequestObj.planUniqueName = item.planDetails.uniqueName;
                this.createNewCompanyPreObj.subscriptionRequest = this.SubscriptionRequestObj;
                this.store.dispatch(this.companyActions.CreateNewCompany(this.createNewCompanyPreObj));
            }
        }
    }

    public createCompanyViaActivationKey() {
        let activationKey = this.licenceKey.value;
        if (activationKey) {
            this.SubscriptionRequestObj.licenceKey = activationKey;
            this.createNewCompanyPreObj.subscriptionRequest = this.SubscriptionRequestObj;
            this.store.dispatch(this.companyActions.CreateNewCompany(this.createNewCompanyPreObj));
        } else {
            this.SubscriptionRequestObj.licenceKey = "";
        }
    }

    public getSubscriptionPlans() {
        this._authenticationService.getAllUserSubsciptionPlans(this.createNewCompanyPreObj.country).subscribe(res => {
            this.SubscriptionPlans = res.body;
        });
    }
}
