import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
import { CompanyRequest, CompanyResponse } from '../../../../models/api-models/Company';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'company-add-new-ui-component',
  templateUrl: './company-add-new-ui.component.html'
})

export class CompanyAddNewUiComponent implements OnInit {
  @Output() public closeCompanyModal: EventEmitter<any> = new EventEmitter();
  @Output() public closeCompanyModalAndShowAddManege: EventEmitter<string> = new EventEmitter();
  @ViewChild('logoutModal') public logoutModal: ModalDirective;

  public company: CompanyRequest = new CompanyRequest();
  public companies$: Observable<CompanyResponse[]>;
  public isLoggedInWithSocialAccount$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private socialAuthService: AuthService,
              private store: Store<AppState>, private verifyActions: VerifyMobileActions, private companyActions: CompanyActions,
              private _location: LocationService, private _route: Router, private _loginAction: LoginActions,
              private _aunthenticationService: AuthenticationService, private _generalActions: GeneralActions, private _generalService: GeneralService) {
    //
  }

  public ngOnInit() {
    this.companies$ = this.store.select(s => s.session.companies).takeUntil(this.destroyed$);
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
}
