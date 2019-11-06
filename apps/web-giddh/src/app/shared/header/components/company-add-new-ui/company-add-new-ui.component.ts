import { take, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, AfterViewInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { VerifyMobileActions } from '../../../../actions/verifyMobile.actions';
import { LocationService } from '../../../../services/location.service';
import { CompanyActions } from '../../../../actions/company.actions';
import { GeneralActions } from '../../../../actions/general/general.actions';
import { LoginActions } from '../../../../actions/login.action';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthService } from '../../../../theme/ng-social-login-module/index';
import { GeneralService } from '../../../../services/general.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { AppState } from '../../../../store';
import { CompanyRequest, CompanyResponse, SocketNewCompanyRequest, StateDetailsRequest, CompanyCreateRequest } from '../../../../models/api-models/Company';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { CompanyService } from '../../../../services/companyService.service';
import { ToasterService } from '../../../../services/toaster.service';
import { CommonService } from '../../../../services/common.service';
import { userLoginStateEnum } from '../../../../models/user-login-state';
import { UserDetails } from 'apps/web-giddh/src/app/models/api-models/loginModels';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'company-add-new-ui-component',
  templateUrl: './company-add-new-ui.component.html',
  styleUrls: ['./company-add-new-ui.component.css']
})

export class CompanyAddNewUiComponent implements OnInit, OnDestroy {
  @Output() public closeCompanyModal: EventEmitter<any> = new EventEmitter();
  @Output() public closeCompanyModalAndShowAddManege: EventEmitter<string> = new EventEmitter();
  @ViewChild('logoutModal') public logoutModal: ModalDirective;
  @ViewChild('companyForm') public companyForm: NgForm;
  @Input() public createBranch: boolean = false;

  public countrySource: IOption[] = [];
  public countrySource$: Observable<IOption[]> = observableOf([]);
  // public company: CompanyRequest2 = new CompanyRequest2();
  public company: CompanyCreateRequest = new CompanyCreateRequest();
  public socketCompanyRequest: SocketNewCompanyRequest = new SocketNewCompanyRequest();
  public companies$: Observable<CompanyResponse[]>;
  public isCompanyCreationInProcess$: Observable<boolean>;
  public isCompanyCreated$: Observable<boolean>;
  public logedInuser: UserDetails;
  public isLoggedInWithSocialAccount$: Observable<boolean>;
  public currencySource$: Observable<IOption[]> = observableOf([]);
  public currencies: IOption[] = [];
  public countryPhoneCode: IOption[] = [];
  public callingCodesSource$: Observable<IOption[]> = observableOf([]);
  public countryCurrency: any[] = [];
  public isMobileNumberValid: boolean = false;
  public createNewCompanyObject: CompanyCreateRequest = new CompanyCreateRequest();
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private socialAuthService: AuthService,
    private store: Store<AppState>, private verifyActions: VerifyMobileActions, private companyActions: CompanyActions,
    private _location: LocationService, private _route: Router, private _loginAction: LoginActions, private _companyService: CompanyService,
    private _aunthenticationService: AuthenticationService, private _generalActions: GeneralActions, private _generalService: GeneralService,
    private _toaster: ToasterService, private _commonService: CommonService
  ) {
    this.getCountry();
    this.getCurrency();
    this.getCallingCodes();

    this.isLoggedInWithSocialAccount$ = this.store.select(p => p.login.isLoggedInWithSocialAccount).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.logedInuser = this._generalService.user;
    if (this._generalService.createNewCompany) {
      this.company = this._generalService.createNewCompany;
      if (this.company.contactNo.toString().includes('-')) {
        let contact = this.company.contactNo.split('-');
        this.company.contactNo = contact[1];
      }
      this.isMobileNumberValid = true;
    }
    this._generalService.createNewCompany = null;
    this.companies$ = this.store.select(s => s.session.companies).pipe(takeUntil(this.destroyed$));
    this.isCompanyCreationInProcess$ = this.store.select(s => s.session.isCompanyCreationInProcess).pipe(takeUntil(this.destroyed$));
    this.isCompanyCreated$ = this.store.select(s => s.session.isCompanyCreated).pipe(takeUntil(this.destroyed$));
    this.isCompanyCreated$.subscribe(s => {
      if (s && !this.createBranch) {
        let isNewUSer = false;
        this.store.select(state => state.session.userLoginState).pipe(take(1)).subscribe(st => {
          isNewUSer = st === userLoginStateEnum.newUserLoggedIn;
        });
        let prevTab = '';
        this.store.select(ss => ss.session.lastState).pipe(take(1)).subscribe(se => {
          prevTab = se;
        });
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = this.company.uniqueName;
        stateDetailsRequest.lastState = isNewUSer ? 'welcome' : 'onboarding';
        this._generalService.companyUniqueName = this.company.uniqueName;
        if (prevTab !== 'user-details') {
          this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
        }
        // this.store.dispatch(this._loginAction.ChangeCompany(this.company.uniqueName));
        setTimeout(() => {
          if (prevTab !== 'user-details') {
            this.store.dispatch(this._loginAction.ChangeCompany(this.company.uniqueName));
            this._route.navigate([isNewUSer ? 'welcome' : 'onboarding']);
          }
          this.closeModal();
        }, 500);
      }
    });
    this.store.select(p => p.session.companyUniqueName).pipe(distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(a => {
      if (a && a !== '' && this.company.uniqueName) {
        if (a.includes(this.company.uniqueName.substring(0, 8))) {
          this.company.name = '';
          this.company.country = '';
          this.company.baseCurrency = '';
          this.company.contactNo = '';
          this.company.phoneCode = '';
        }
      }
    });
  }

  /**
   * createCompany
   */
  public createCompany(mobileNoEl) {

    if (!this.isMobileNumberValid) {
      this._toaster.errorToast('Invalid Contact number', 'Error');
      if (mobileNoEl) {
        mobileNoEl.focus();
      }
      return;
    } else {
      let companies = null;
      this.companies$.pipe(take(1)).subscribe(c => companies = c);
      this.company.uniqueName = this.getRandomString(this.company.name, this.company.country);
      this.company.isBranch = this.createBranch;
      this._generalService.createNewCompany = this.company;
      this.store.dispatch(this.companyActions.userStoreCreateCompany(this.company));
      this.closeCompanyModal.emit();
      this._route.navigate(['welcome']);
      //this.store.dispatch(this.companyActions.CreateCompany(this.company));
      //this.store.dispatch(this.companyActions.GetApplicableTaxes());
      if (companies) {
        if (companies.length === 0) {
          this.fireSocketCompanyCreateRequest();
        }
      }
    }
  }

  public fireSocketCompanyCreateRequest() {
    this.socketCompanyRequest.CompanyName = this.company.name;
    this.socketCompanyRequest.Timestamp = Date.now();
    this.socketCompanyRequest.LoggedInEmailID = this._generalService.user.email;
    this.socketCompanyRequest.MobileNo = this.company.contactNo.toString();
    this.socketCompanyRequest.Name = this._generalService.user.name;
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
  public isValidMobileNumber(ele: HTMLInputElement) {
    if (ele.value) {
      if (ele.value.length > 9 && ele.value.length < 16) {
        ele.classList.remove('error-box');
        this.isMobileNumberValid = true;
      } else {
        this.isMobileNumberValid = false;
        this._toaster.errorToast('Invalid Contact number');
        ele.classList.add('error-box');
      }
    }
  }

  public selectCountry(event: IOption) {
    if (event) {
      let phoneCode = event.additional;
      this.company.phoneCode = phoneCode;
      this.company.baseCurrency = this.countryCurrency[event.value];
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

  public getCountry() {
    this._commonService.GetCountry("onboarding").subscribe((response) => {
      if (response.status === 'success') {
        Object.keys(response.body).forEach(key => {
          // Creating Country List
          this.countrySource.push({value: response.body[key].countryName, label: response.body[key].alpha2CountryCode + ' - ' + response.body[key].countryName, additional: response.body[key].callingCode});
          // Creating Country Currency List
          this.countryCurrency[response.body[key].countryName] = [];
          this.countryCurrency[response.body[key].countryName] = response.body[key].currency.code;
        });

        this.countrySource$ = observableOf(this.countrySource);
      }
    }, (error => {

    }));
  }

  public getCurrency() {
    this._commonService.GetCurrency().subscribe((response) => {
      if(response.status === 'success') {
        Object.keys(response.body).forEach(key => {
          this.currencies.push({ label: response.body[key].code, value: response.body[key].code });
        });

        this.currencySource$ = observableOf(this.currencies);
      }
    }, (error => {

    }));
  }

  public getCallingCodes() {
    this._commonService.GetCallingCodes().subscribe((response) => {
      if(response.status === 'success') {
        Object.keys(response.body.callingCodes).forEach(key => {
          this.countryPhoneCode.push({ label: response.body.callingCodes[key], value: response.body.callingCodes[key] });
        });

        this.callingCodesSource$ = observableOf(this.countryPhoneCode);
      }
    }, (error => {

    }));
  }
}
