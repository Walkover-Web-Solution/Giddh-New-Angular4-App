import { CompanyActions } from '../actions/company.actions';
import { CompanyService } from '../companyService.service';
import { VerifyEmailResponseModel } from '../../models/api-models/loginModels';
import { AppState } from '../../store/roots';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StateDetailsRequest, StateDetailsResponse } from '../../models/api-models/Company';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { userLoginStateEnum } from '../../store/authentication/authentication.reducer';

@Injectable()
export class NeedsAuthentication implements CanActivate {
  private user: VerifyEmailResponseModel;
  constructor(public _router: Router, private store: Store<AppState>, private _companyService: CompanyService, private companyActions: CompanyActions) {
  }
  public canActivate() {
    return this.store.select(p => p.session.userLoginState).map(p => {
      if (p === userLoginStateEnum.newUserLoggedIn) {
        this._router.navigate(['/new-user']);
      }
      if (p === userLoginStateEnum.notLoggedIn) {
        this._router.navigate(['/login']);
      }
      console.log('from nedd authentication' + (p === userLoginStateEnum.userLoggedIn));
      return p === userLoginStateEnum.userLoggedIn;
    });
  }
}
