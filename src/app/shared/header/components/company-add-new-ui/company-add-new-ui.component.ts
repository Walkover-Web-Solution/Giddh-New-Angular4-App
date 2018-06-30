import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { VerifyMobileActions } from '../../../../actions/verifyMobile.actions';
import { LocationService } from '../../../../services/location.service';
import { CompanyActions } from '../../../../actions/company.actions';
import { GeneralActions } from '../../../../actions/general/general.actions';
import { LoginActions } from '../../../../actions/login.action';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthService } from 'ng4-social-login';
import { GeneralService } from '../../../../services/general.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { AppState } from '../../../../store';
import { CompanyRequest, CompanyResponse, StateDetailsRequest } from '../../../../models/api-models/Company';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { contriesWithCodes } from '../../../helpers/countryWithCodes';

@Component({
  selector: 'company-add-new-ui-component',
  templateUrl: './company-add-new-ui.component.html'
})

export class CompanyAddNewUiComponent implements OnInit, OnDestroy {
  @Output() public closeCompanyModal: EventEmitter<any> = new EventEmitter();
  @Output() public closeCompanyModalAndShowAddManege: EventEmitter<string> = new EventEmitter();
  @ViewChild('logoutModal') public logoutModal: ModalDirective;
  @Input() public createBranch: boolean = false;

  public countrySource: IOption[] = [];
  public company: CompanyRequest = new CompanyRequest();
  public companies$: Observable<CompanyResponse[]>;
  public isCompanyCreationInProcess$: Observable<boolean>;
  public isCompanyCreated$: Observable<boolean>;
  public isLoggedInWithSocialAccount$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private socialAuthService: AuthService,
              private store: Store<AppState>, private verifyActions: VerifyMobileActions, private companyActions: CompanyActions,
              private _location: LocationService, private _route: Router, private _loginAction: LoginActions,
              private _aunthenticationService: AuthenticationService, private _generalActions: GeneralActions, private _generalService: GeneralService) {
    contriesWithCodes.map(c => {
      this.countrySource.push({value: c.countryName, label: `${c.countryflag} - ${c.countryName}`});
    });
  }

  public ngOnInit() {
    this.companies$ = this.store.select(s => s.session.companies).takeUntil(this.destroyed$);
    this.isCompanyCreationInProcess$ = this.store.select(s => s.session.isCompanyCreationInProcess).takeUntil(this.destroyed$);
    this.isCompanyCreated$ = this.store.select(s => s.session.isCompanyCreated).takeUntil(this.destroyed$);
    this.isCompanyCreated$.subscribe(s => {
      if (s && !this.createBranch) {
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = this.company.uniqueName;
        stateDetailsRequest.lastState = 'welcome';
        this._generalService.companyUniqueName = this.company.uniqueName;
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
        this.store.dispatch(this._loginAction.ChangeCompany(this.company.uniqueName));
        this._route.navigate(['welcome']);
        this.closeModal();
      }
    });
  }

  /**
   * createCompany
   */
  public createCompany() {
    this.company.uniqueName = this.getRandomString(this.company.name, this.company.country);
    this.company.isBranch = this.createBranch;
    this.store.dispatch(this.companyActions.CreateCompany(this.company));
  }

  public closeModal() {
    let companies = null;
    this.companies$.take(1).subscribe(c => companies = c);
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
