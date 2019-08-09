
import { take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { VerifyMobileActions } from '../actions/verifyMobile.actions';
import { LocationService } from '../services/location.service';
import { CompanyActions } from '../actions/company.actions';
import { GeneralActions } from '../actions/general/general.actions';
import { LoginActions } from '../actions/login.action';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthService } from '../theme/ng-social-login-module/index';
//import { GeneralService } from 'services/general.service';
import { AuthenticationService } from '../services/authentication.service';
import { AppState } from '../store';
import { CompanyRequest, CompanyResponse, SocketNewCompanyRequest, StateDetailsRequest, CompanyCreateRequest, States, } from '../models/api-models/Company';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { IOption } from '../theme/ng-virtual-select/sh-options.interface';

import { CompanyService } from '../services/companyService.service';
import { userLoginStateEnum } from '../models/user-login-state';
import { UserDetails } from 'apps/web-giddh/src/app/models/api-models/loginModels';
import { GeneralService } from '../services/general.service';
import { ToasterService } from '../services/toaster.service';
import { contriesWithCodes } from '../shared/helpers/countryWithCodes';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { ShSelectComponent } from '../theme/ng-virtual-select/sh-select.component';


@Component({
  selector: 'create-company-component',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css']
})
export class CreateCompanyComponent implements OnInit, OnDestroy {
  @Output() public closeCompanyModal: EventEmitter<any> = new EventEmitter();
  @Output() public closeCompanyModalAndShowAddManege: EventEmitter<string> = new EventEmitter();
  @ViewChild('logoutModal') public logoutModal: ModalDirective;
  @Input() public createBranch: boolean = false;


  // sadique sheikh
  
  public companyProfileObj: any = null;
  public countryCodeList: IOption[] = [];
  public company: any = {};
  public createNewCompany: any = {};
  public statesSource$: Observable<IOption[]> = observableOf([]);
  public stateStream$: Observable<States[]>;
  public states: IOption[] = [];
  public countryIsIndia: boolean = false;
  public selectedBusinesstype: string = '';
  public selectedCountry = '';
  //public gstKeyDownSubject$: Subject<any> = new Subject<any>();
  public isGstValid: boolean;
  public industrialList: IOption[] = [{
    label: 'Agriculture',
    value: 'Agriculture'
  }, {
    label: 'Automobile Transport',
    value: 'Automobile Transport'
  }, {
    label: 'Ecommerce',
    value: 'Ecommerce'
  }, {
    label: 'Education',
    value: 'Education'
  }, {
    label: 'Financial Institution',
    value: 'Financial Institution'
  }, {
    label: 'Gym',
    value: 'Gym'
  }, {
    label: 'Hospitality',
    value: 'Hospitality'
  }, {
    label: 'IT Company',
    value: 'IT Company'
  }, {
    label: 'Lifestyle Clubs',
    value: 'Lifestyle Clubs'
  }, {
    label: 'Logistics',
    value: 'Logistics'
  }, {
    label: 'Marriage Bureau',
    value: 'Marriage Bureau'
  }, {
    label: 'Media  Advertisement',
    value: 'Media  Advertisement'
  }, {
    label: 'Personal Use',
    value: 'Personal Use'
  }, {
    label: 'Political',
    value: 'Political'
  }, {
    label: 'Public Sector',
    value: 'Public Sector'
  }, {
    label: 'Real estate',
    value: 'Real estate'
  }, {
    label: 'Retail FMCG',
    value: 'Retail FMCG'
  }, {
    label: 'Stock and Commodity',
    value: 'Stock and Commodity'
  }, {
    label: 'Telecom',
    value: 'Telecom'
  }, {
    label: 'Tips And Alert',
    value: 'Tips And Alert'
  }, {
    label: 'Travel',
    value: 'Travel'
  }, {
    label: 'Wholesalers Distributors',
    value: 'Wholesalers Distributors'
  }
  ];
  public createNewCompanyPreparedObj: CompanyCreateRequest = {
        name: '',
        country: '',
        phoneCode: '',
        contactNo: '',
        uniqueName: '',
        isBranch: false,
        subscriptionRequest: null,
        gstDetails: [],
        bussinessNature: '',
        bussinessType: '',
        address: '',
        industry: '',
        baseCurrency: '',
        isMultipleCurrency: false,
        city: '',
        pincode: '',
        email: '',
        taxes: [],
        billingDetails: null,
        nameAlias: '',
  }
  public updateProfileSuccess$: Observable<boolean>;
  public businessType: IOption[] = [
    { label: 'Unregister', value: 'unregistered' },
    { label: 'Register', value: 'registered' }
  ];

  public taxesoptions: IOption[] = [
    { label: 'TCS', value: 'TCS Tax' },
    { label: 'TDS', value: 'TDS Tax' },
  ];
  public BusinessOptions: IOption[] = [
    { label: 'Food', value: 'food' },
    { label: 'Service', value: 'service' },
     { label: 'Manufacturing', value: 'manufacturing' },
    { label: 'Retail', value: 'retail' },
  ];


  public hideTextarea = true;
  public collapseTextarea = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  // sadique sheikh



  public countrySource: IOption[] = [];
  //public company: CompanyRequest2 = new CompanyRequest2();
  //public company: CompanyCreateRequest = new CompanyCreateRequest();
  public socketCompanyRequest: SocketNewCompanyRequest = new SocketNewCompanyRequest();
  public companies$: Observable<CompanyResponse[]>;
  public isCompanyCreationInProcess$: Observable<boolean>;
  public isCompanyCreated$: Observable<boolean>;
  public logedInuser: UserDetails;
  public isLoggedInWithSocialAccount$: Observable<boolean>;
  public currencySource$: Observable<IOption[]> = observableOf([]);
  public currencies: IOption[] = [];
  public countryPhoneCode: IOption[] = [];
  public createNewCompanyObject: CompanyCreateRequest = new CompanyCreateRequest();
  //private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private socialAuthService: AuthService,
              private store: Store<AppState>, private verifyActions: VerifyMobileActions, private companyActions: CompanyActions,
              private _location: LocationService, private _route: Router, private _loginAction: LoginActions, private _companyService: CompanyService,
              private _aunthenticationService: AuthenticationService, private _generalActions: GeneralActions, private _generalService: GeneralService,
              private _toaster: ToasterService,
              private settingsProfileActions: SettingsProfileActions,
              private _router: Router, private _toasty: ToasterService,
  ) {
    contriesWithCodes.map(c => {
      this.countrySource.push({value: c.countryName, label: `${c.countryflag} - ${c.countryName}`});
      this.isLoggedInWithSocialAccount$ = this.store.select(p => p.login.isLoggedInWithSocialAccount).pipe(takeUntil(this.destroyed$));
    });
     // Country phone Code
    contriesWithCodes.map(c => {
      this.countryPhoneCode.push({value: c.value, label: c.value});
    });
      this.store.select(s => s.session.currencies).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      this.currencies = [];
      if (data) {
        data.map(d => {
          this.currencies.push({label: d.code, value: d.code});
        });
      }
      this.currencySource$ = observableOf(this.currencies);
    });

    // new
    this.companyProfileObj = {};

    contriesWithCodes.map(c => {
      this.countryCodeList.push({ value: c.value, label: c.value, additional: c.countryName });
    });

    this.stateStream$ = this.store.select(s => s.general.states).pipe(takeUntil(this.destroyed$));
    this.stateStream$.subscribe((data) => {
      if (data) {
        data.map(d => {
          this.states.push({label: `${d.code} - ${d.name}`, value: d.code});
        });
      }
      this.statesSource$ = observableOf(this.states);
    }, (err) => {
      // console.log(err);
    });
    this.store.select(state => {
      if (!state.session.companies) {
        return;
      }
      state.session.companies.forEach(cmp => {
        if (cmp.uniqueName === state.session.companyUniqueName) {
          this.countryIsIndia = cmp.country.toLocaleLowerCase() === 'india';

          if (cmp.country && this.companyProfileObj && !this.companyProfileObj.country) {
            this.selectedCountry = cmp.country;
            this.autoSelectCountryCode(cmp.country);
          }
        }
      });
    }).pipe(takeUntil(this.destroyed$)).subscribe();
    this.updateProfileSuccess$ = this.store.select(s => s.settings.updateProfileSuccess).pipe(takeUntil(this.destroyed$));
     // GET APPLICABLE TAXES
   // this.store.dispatch(this.companyActions.GetApplicableTaxes());
  }
  public ngOnInit() {
    this.logedInuser = this._generalService.user;
    this.companies$ = this.store.select(s => s.session.companies).pipe(takeUntil(this.destroyed$));
    this.isCompanyCreationInProcess$ = this.store.select(s => s.session.isCompanyCreationInProcess).pipe(takeUntil(this.destroyed$));
    this.isCompanyCreated$ = this.store.select(s => s.session.isCompanyCreated).pipe(takeUntil(this.destroyed$));
    this.isCompanyCreated$.subscribe(s => {
      if (s && !this.createBranch) {
        let isNewUSer = false;
        this.store.select(state => state.session.userLoginState).pipe(take(1)).subscribe(st => {
          isNewUSer = st === userLoginStateEnum.newUserLoggedIn;
        });
        let prevTab= '';
        this.store.select(ss => ss.session.lastState).pipe(take(1)).subscribe(se => {
          prevTab = se;
        });
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = this.company.uniqueName;
        stateDetailsRequest.lastState = isNewUSer ? 'welcome' : 'sales';
        this._generalService.companyUniqueName = this.company.uniqueName;
        if(prevTab !== 'user-details'){
          this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
        }
        // this.store.dispatch(this._loginAction.ChangeCompany(this.company.uniqueName));
        setTimeout(() => {
          if(prevTab !== 'user-details'){
            this.store.dispatch(this._loginAction.ChangeCompany(this.company.uniqueName));
            this._route.navigate([isNewUSer ? 'welcome' : 'sales']);
          }
          this.closeModal();
        }, 500);
      }
    });

    // new
    if(this._generalService.createNewCompany) {
      this.createNewCompany = this._generalService.createNewCompany;
      this.company = this.createNewCompany;
      if(this.company) {
      this.createNewCompanyPreparedObj.name = this.company.name;
      this.createNewCompanyPreparedObj.contactNo = this.company.phoneCode + this.company.contactNo;
      this.createNewCompanyPreparedObj.uniqueName = this.company.uniqueName;
      this.createNewCompanyPreparedObj.isBranch = this.company.isBranch;
      this.createNewCompanyPreparedObj.country = this.company.country;
      this.createNewCompanyPreparedObj.baseCurrency = this.company.baseCurrency; 
      }
     
    }
   
    this.updateProfileSuccess$.subscribe(s => {
      if (s) {
        this._router.navigate(['/select-plan']);
      }
    });

    // this.gstKeyDownSubject$
    //   .pipe(debounceTime(3000)
    //     , distinctUntilChanged()
    //     , takeUntil(this.destroyed$))
    //   .subscribe((event: any) => {
    //     if (this.isGstValid) {
    //     this.patchProfile({gstDetails: this.companyProfileObj.gstDetails});
    //     }
    //   });
  }
  /**
   * createCompany
   */
  public createCompany(mobileNoEl) {
    let mobNoPattern = /^\d+$/;
    if (!mobNoPattern.test(this.company.contactNo)) {
      this._toaster.errorToast('please add valid mobile no', 'Error');
      if (mobileNoEl) {
        mobileNoEl.focus();
      }
      return;
    }
    this.company.uniqueName = this.getRandomString(this.company.name, this.company.country);
    this.company.isBranch = this.createBranch;
    //this._generalService.createNewCompany = this.company;
    this.closeCompanyModal.emit();
    this._route.navigate(['/pages','welcome']);
   // this.store.dispatch(this.companyActions.CreateCompany(this.company));
   //this.store.dispatch(this.companyActions.GetApplicableTaxes());
   // this.fireSocketCompanyCreateRequest();
  }
  public fireSocketCompanyCreateRequest() {
    this.socketCompanyRequest.CompanyName = this.company.name;
    this.socketCompanyRequest.Timestamp = Date.now();
    this.socketCompanyRequest.LoggedInEmailID = this._generalService.user.email;
    this.socketCompanyRequest.MobileNo = this.company.contactNo;
    this._companyService.SocketCreateCompany(this.socketCompanyRequest).subscribe();
  }
  public closeModal() {
    let companies = null;
    this.companies$.pipe(take(1)).subscribe(c => companies = c);
    if (companies) {
      if (companies.length > 0) {
        this.store.dispatch(this._generalActions.getGroupWithAccounts());
        this.store.dispatch(this._generalActions.getFlattenAccount());
        this.closeCompanyModal.emit();
      } else {
        this.showLogoutModal();
      }
    } else {
      this.showLogoutModal();
    }
  }
  public showLogoutModal() {
    this.logoutModal.show();
  }
  public hideLogoutModal() {
    this.logoutModal.hide();
  }
  public logoutUser() {
    this.store.dispatch(this.verifyActions.hideVerifyBox());
    this.hideLogoutModal();
    this.closeCompanyModal.emit();
    if (isElectron) {
      // this._aunthenticationServer.GoogleProvider.signOut();
      this.store.dispatch(this._loginAction.ClearSession());
    } else {
      this.isLoggedInWithSocialAccount$.subscribe((val) => {
        if (val) {
          this.socialAuthService.signOut().then().catch((err) => {
            // console.log ('err', err);
          });
          this.store.dispatch(this._loginAction.ClearSession());
          this.store.dispatch(this._loginAction.socialLogoutAttempt());
        } else {
          this.store.dispatch(this._loginAction.ClearSession());
        }
      });
    }
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  public makeMeCaptialize(companyName: string) {
    if (companyName) {
      this.company.name = companyName[0].toUpperCase() + companyName.substr(1, companyName.length);
    }
  }
  private getRandomString(comnanyName, city) {
    // tslint:disable-next-line:one-variable-per-declaration
    let d, dateString, randomGenerate, strings;
    comnanyName = this.removeSpecialCharacters(comnanyName);
    city = this.removeSpecialCharacters(city);
    d = new Date();
    dateString = d.getTime().toString();
    randomGenerate = this.getSixCharRandom();
    strings = [comnanyName, city, dateString, randomGenerate];
    return strings.join('');
  }
  private removeSpecialCharacters(str) {
    let finalString;
    finalString = str.replace(/[^a-zA-Z0-9]/g, '');
    return finalString.substr(0, 6).toLowerCase();
  }
  private getSixCharRandom() {
    return Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 6);
  }


  // new
  public ngAfterViewInit() {
    this._generalService.IAmLoaded.next(true);
  }

  public skip() {
    this._router.navigate(['/onboarding']);
  }

  public submit() {

    let object = _.cloneDeep(this.companyProfileObj);
    if (object.country && object.contactNo) {
      object.contactNo = _.cloneDeep(`${object.country}${object.contactNo}`);
      object.country = this.selectedCountry;
    } else {
      object.country = this.selectedCountry;
      object.contactNo = null;
    }
    this._router.navigate(['/pages','select-plan']);
   // this.store.dispatch(this.settingsProfileActions.UpdateProfile(object));
    //  this.store.dispatch(this.companyActions.GetApplicableTaxes());
  }

  /**
   * autoSelectCountryCode
   */
  public autoSelectCountryCode(country) {
    if (this.countryCodeList) {
      let selectedCountry = _.find(this.countryCodeList, function (o) {
        return o.additional === country;
      });
      if (selectedCountry && selectedCountry.value) {
        this.companyProfileObj.country = selectedCountry.value;
      }
    }

  }
    public checkGstNumValidation(ele: HTMLInputElement) {
    let isInvalid: boolean = false;
    if (ele.value) {
      if (ele.value.length !== 15 || (Number(ele.value.substring(0, 2)) < 1) || (Number(ele.value.substring(0, 2)) > 37)) {
        this._toasty.errorToast('Invalid GST number');
        ele.classList.add('error-box');
        this.isGstValid = false;
      } else {
        ele.classList.remove('error-box');
        this.isGstValid = true;
        // this.checkGstDetails();
      }
    } else {
      ele.classList.remove('error-box');
    }
  }
  public getStateCode(gstNo: HTMLInputElement, statesEle: ShSelectComponent) {
    let gstVal: string = gstNo.value;

    if (gstVal.length >= 2) {
      this.statesSource$.pipe(take(1)).subscribe(state => {
        let s = state.find(st => st.value === gstVal.substr(0, 2));
        statesEle.setDisabledState(false);
        this.companyProfileObj.state = s.value;
        if (s) {
           this.companyProfileObj.state = s.value;
           statesEle.setDisabledState(true);
         
        } else {
           this.companyProfileObj.state = '';
          statesEle.setDisabledState(false);
          this._toasty.clearAllToaster();
          this._toasty.warningToast('Invalid GSTIN.');
        }
      });
    } else {
      statesEle.setDisabledState(false);
      this.companyProfileObj.state = '';
    }
  }

  public selectedbusinessType(event) {
    //
    if(event) {
    this.selectedBusinesstype = event.value;
    }
    console.log(event);
  }
  public selectedbusinessOptions(event) {
    if(event) {
   //
    }
    console.log(event);

  }
  public selectedApplicabeTaxes(event) {
    console.log(event);

  }

    public setChildState(ele: HTMLInputElement, index: number) {
    let stateCode: any = Number(ele.value.substring(0, 2));
    if (stateCode <= 37) {
      if (stateCode < 10 && stateCode !== 0) {
        stateCode = (stateCode < 10) ? '0' + stateCode.toString() : stateCode.toString();
      } else if (stateCode === 0) {
        stateCode = '';
      }
      this.companyProfileObj.gstDetails[index].addressList[0].stateCode = stateCode.toString();
    } else {
      this.companyProfileObj.gstDetails[index].addressList[0].stateCode = '';
    }
  }
}