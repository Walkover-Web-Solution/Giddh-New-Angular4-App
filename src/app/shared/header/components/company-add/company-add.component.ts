import { CompanyActions } from './../../../../services/actions/company.actions';
import { LocationService } from './../../../../services/location.service';
import { CompanyRequest } from './../../../../models/api-models/Company';
import { SignupWithMobile, VerifyMobileModel } from './../../../../models/api-models/loginModels';
import { Observable, ReplaySubject } from 'rxjs';
import { VerifyMobileActions } from './../../../../services/actions/verifyMobile.actions';
import { AppState } from './../../../../store/roots';
import { Store } from '@ngrx/store';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { WizardComponent } from '../../../theme/ng2-wizard/wizard.component';
import { ComapnyResponse, StateDetailsRequest } from '../../../../models/api-models/Company';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { LoginActions } from '../../../../services/actions/login.action';
import { AuthService, GoogleLoginProvider } from 'ng4-social-login';
import { AuthenticationService } from "../../../../services/authentication.service";
// const GOOGLE_CLIENT_ID = '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com';
@Component({
  selector: 'company-add',
  templateUrl: './company-add.component.html'
})
export class CompanyAddComponent implements OnInit, OnDestroy {
  @ViewChild('wizard') public wizard: WizardComponent;
  @ViewChild('logoutModal') public logoutModal: ModalDirective;
  @Output() public closeCompanyModal: EventEmitter<any> = new EventEmitter();
  @Output() public closeCompanyModalAndShowAddManege: EventEmitter<string> = new EventEmitter();
  public company: CompanyRequest = new CompanyRequest();
  public phoneNumber: string;
  public verificationCode: string;
  public showVerificationBox: Observable<boolean>;
  public isMobileVerified: Observable<boolean>;
  public isCompanyCreationInProcess$: Observable<boolean>;
  public isCompanyCreated$: Observable<boolean>;
  public companies$: Observable<ComapnyResponse[]>;
  public showMobileVarifyMsg: boolean = false;
  public dataSource: Observable<any>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private socialAuthService: AuthService,
    private store: Store<AppState>, private verifyActions: VerifyMobileActions, private companyActions: CompanyActions,
    private _location: LocationService, private _route: Router, private _loginAction: LoginActions,
    private _aunthenticationServer: AuthenticationService) {
  }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {
    this.companies$ = this.store.select(s => s.company.companies).takeUntil(this.destroyed$);
    this.showVerificationBox = this.store.select(s => s.verifyMobile.showVerificationBox).takeUntil(this.destroyed$);
    this.isCompanyCreationInProcess$ = this.store.select(s => s.company.isCompanyCreationInProcess).takeUntil(this.destroyed$);

    this.isMobileVerified = this.store.select(s => {
      if (s.session.user) {
        return s.session.user.user.mobileNo !== null;
      }
    }).takeUntil(this.destroyed$);
    this.isCompanyCreated$ = this.store.select(s => s.company.isCompanyCreated).takeUntil(this.destroyed$);
    this.dataSource = Observable
      .create((observer: any) => {
        this._location.GetCity({
          QueryString: this.company.city,
          AdministratorLevel: undefined,
          Country: undefined,
          OnlyCity: true
        }).subscribe((res) => observer.next(res));
      }).takeUntil(this.destroyed$);

    this.isMobileVerified.subscribe(p => {
      if (p) {
        this.wizard.next();
        this.showMobileVarifyMsg = true;
      }
    });
    this.isCompanyCreated$.subscribe(s => {
      if (s) {
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = this.company.uniqueName;
        stateDetailsRequest.lastState = 'company.content.ledgerContent@giddh';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
        this._route.navigate(['/ledger', 'cash']);
        this.closeModal();
      }
    });
    // this.store
    //   .select(c => c.company.companies).takeUntil(this.destroyed$)
    //   .subscribe(p => {
    //     if (p && p.find(c => c.name === this.company.name) !== undefined) {
    //       this.company = new CompanyRequest();
    //       this.wizard.next();
    //     }
    //   });
  }

  public textOnly(e) {
    if (this.company && this.company.city) {
      this.company.city = this.company.city.replace(/[^a-zA-Z\s]/g, '');
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /**
   * addNumber
   */
  public addNumber() {
    let model = new SignupWithMobile();
    model.mobileNumber = this.phoneNumber;
    this.store.dispatch(this.verifyActions.verifyNumberRequest(model));
  }

  /**
   * verifyNumber
   */
  public verifyNumber() {
    let model = new VerifyMobileModel();
    model.mobileNumber = this.phoneNumber;
    model.oneTimePassword = this.verificationCode;
    this.store.dispatch(this.verifyActions.verifyNumberCodeRequest(model));
  }

  /**
   * createCompany
   */
  public createCompany() {
    let company = new CompanyRequest();
    company.name = this.company.name;
    company.city = this.company.city;
    company.uniqueName = this.getRandomString(company.name, company.city);
    this.company.uniqueName = company.uniqueName;
    this.store.dispatch(this.companyActions.CreateCompany(company));
  }

  public closeModal() {
    let companies = null;
    this.companies$.take(1).subscribe(c => companies = c);
    if (companies) {
      if (companies.length > 0) {
        this.closeCompanyModal.emit();
      } else {
        this.showLogoutModal();
      }
    } else {
      this.showLogoutModal();
    }
  }

  public closeModalAndShowAddMangeModal() {
    this.closeCompanyModalAndShowAddManege.emit();
  }

  public showLogoutModal() {
    this.logoutModal.show();
  }

  public hideLogoutModal() {
    this.logoutModal.hide();
  }

  public logoutUser() {
    this.hideLogoutModal();
    this.closeCompanyModal.emit();
    if (!isElectron) {
      this.socialAuthService.signOut();
    } else {
      this._aunthenticationServer.GoogleProvider.signOut();
    }

    this.store.dispatch(this._loginAction.LogOut());
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
}
