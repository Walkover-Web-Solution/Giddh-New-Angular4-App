import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { GeneralService } from '../services/general.service';
import { Route } from '@angular/compiler/src/core';
import { CompanyActions } from '../actions/company.actions';
import { ToasterService } from '../services/toaster.service';
import { AuthenticationService } from '../services/authentication.service';
import { CompanyCreateRequest, CreateCompanyUsersPlan, SubscriptionRequest, SocketNewCompanyRequest, CompanyResponse  } from '../models/api-models/Company';
import { ReplaySubject, Observable } from 'rxjs';
import { UserDetails } from '../models/api-models/loginModels';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-select-plan',
    templateUrl: './selectPlan.component.html',
    styleUrls: [`./selectPlan.component.scss`],
  })
export class SelectPlanComponent implements OnInit, OnDestroy {

public createNewCompanyPreObj: CompanyCreateRequest;
public logedInUser: UserDetails;
public SubscriptionRequestObj :SubscriptionRequest = {
  planUniqueName: '',
  subscriptionUnqiueName:'',
  userUniqueName: '',
  licenceKey: ''
};
public SubscriptionPlans: CreateCompanyUsersPlan[] = [
  //  {
  //   "companies": null,
  //   "userDetails": {
  //     "name": "rajat@walkover.in",
  //     "uniqueName": "rajat@walkover.in",
  //     "email": "rajat@walkover.in",
  //     "signUpOn": "05-08-2019 19:33:53",
  //     "mobileno": null
  //   },
  //   "additionalTransactions": 0,
  //   "totalCompanies": 0,
  //   "planDetails": {
  //     "countries": [],
  //     "name": "Trial",
  //     "durationUnit": "MONTH",
  //     "companiesLimit": 30,
  //     "uniqueName": "eca1565070396031",
  //     "createdAt": "06-08-2019 11:16:36",
  //     "amount": 0,
  //     "ratePerExtraTransaction": 19,
  //     "isCommonPlan": true,
  //     "transactionLimit": 3,
  //     "duration": 1
  //   },
  //   "subscriptionId": "",
  //   "balance": 3000.0000,
  //   "expiry": "06-09-2019",
  //   "startedAt": "06-08-2019 17:43:26",
  //   "createdAt": "06-08-2019 17:41:55",
  //   "additionalCharges": null,
  //   "status": "active"
  // },
  // {
  //   "companies": null,
  //   "userDetails": {
  //     "name": "rajat@walkover.in",
  //     "uniqueName": "rajat@walkover.in",
  //     "email": "rajat@walkover.in",
  //     "signUpOn": "05-08-2019 19:33:53",
  //     "mobileno": null
  //   },
  //   "additionalTransactions": 0,
  //   "totalCompanies": 0,
  //   "planDetails": {
  //     "countries": [],
  //     "name": "testPlan_name1",
  //     "durationUnit": "MONTH",
  //     "companiesLimit": 30,
  //     "uniqueName": "eca1565070396031",
  //     "createdAt": "06-08-2019 11:16:36",
  //     "amount": 3000.0000,
  //     "ratePerExtraTransaction": 19,
  //     "isCommonPlan": true,
  //     "transactionLimit": 3,
  //     "duration": 1
  //   },
  //   "subscriptionId": "SUB-20190806-1",
  //   "balance": 3000.0000,
  //   "expiry": "06-09-2019",
  //   "startedAt": "06-08-2019 17:43:26",
  //   "createdAt": "06-08-2019 17:41:55",
  //   "additionalCharges": null,
  //   "status": "active"
  // },
  // {
  //   "companies": null,
  //   "userDetails": {
  //     "name": "rajat@walkover.in",
  //     "uniqueName": "rajat@walkover.in",
  //     "email": "rajat@walkover.in",
  //     "signUpOn": "05-08-2019 19:33:53",
  //     "mobileno": null
  //   },
  //   "additionalTransactions": 0,
  //   "totalCompanies": 0,
  //   "planDetails": {
  //     "countries": [],
  //     "name": "testPlan_name1",
  //     "durationUnit": "MONTH",
  //     "companiesLimit": 30,
  //     "uniqueName": "eca1565070396031",
  //     "createdAt": "06-08-2019 11:16:36",
  //     "amount": 3000.0000,
  //     "ratePerExtraTransaction": 19,
  //     "isCommonPlan": true,
  //     "transactionLimit": 3,
  //     "duration": 1
  //   },
  //   "subscriptionId": "",
  //   "balance": 0,
  //   "expiry": "06-09-2019",
  //   "startedAt": "06-08-2019 17:43:26",
  //   "createdAt": "06-08-2019 17:41:55",
  //   "additionalCharges": null,
  //   "status": "active"
  // }
];

  public socketCompanyRequest: SocketNewCompanyRequest = new SocketNewCompanyRequest();
  public companies$: Observable<CompanyResponse[]>;
  public isCompanyCreationInProcess$: Observable<boolean>;
  public isCompanyCreated$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

// private store: Store<AppState>, private settingsProfileActions: SettingsProfileActions,
//     private _router: Route, private _generalService: GeneralService, private _toasty: ToasterService,private companyActions: CompanyActions
   constructor(private store: Store<AppState>,private _generalService: GeneralService, private _route: Router, private _authenticationService: AuthenticationService,  private companyActions: CompanyActions) {

      this._authenticationService.getAllUserSubsciptionPlans().subscribe(res=> {
        console.log(res);
        this.SubscriptionPlans = res.body;
      });

    }

public ngOnInit() {
  if(this._generalService.createNewCompany) {
      this.createNewCompanyPreObj = this._generalService.createNewCompany;
  }
  this.logedInUser =  this._generalService.user;
  this.SubscriptionRequestObj.userUniqueName = this.logedInUser.uniqueName;
    //  if(!this.createNewCompanyPreObj) {
    //     this._route.navigate(['/pages', 'welcome']);
    //   }

     this.companies$ = this.store.select(s => s.session.companies).pipe(takeUntil(this.destroyed$));
    this.isCompanyCreationInProcess$ = this.store.select(s => s.session.isCompanyCreationInProcess).pipe(takeUntil(this.destroyed$));
    this.isCompanyCreated$ = this.store.select(s => s.session.isCompanyCreated).pipe(takeUntil(this.destroyed$));

}
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

    public selectPlanClicked(plan: any) {
      console.log('selectplan clicked ',plan);
    }

    public paidPlanSelected(plan: CreateCompanyUsersPlan) {

      this.SubscriptionRequestObj.subscriptionUnqiueName = plan.subscriptionId;
      this._route.navigate(['/pages', 'billing-detail']);
      this.store.dispatch(this.companyActions.selectedPlan(plan));
      
    console.log('paid plan selected ',plan);
    }

    public createCompany(item: CreateCompanyUsersPlan) {
      console.log(item);
        if(!this.createNewCompanyPreObj) {
       this._route.navigate(['/pages', 'welcome']);
      } else {
         this.SubscriptionRequestObj.planUniqueName = item.planDetails.uniqueName;
         this.createNewCompanyPreObj.subscriptionRequest = this.SubscriptionRequestObj;
         this.store.dispatch(this.companyActions.CreateNewCompany( this.createNewCompanyPreObj));
 
      }
  console.log('req obj',this.createNewCompanyPreObj);
      
    }
}