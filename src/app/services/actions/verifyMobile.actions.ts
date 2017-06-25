import { Observable } from 'rxjs/Observable';
import { CompanyActions } from './company.actions';
import { SignupWithMobile, VerifyMobileModel } from './../../models/api-models/loginModels';
import { AppState } from './../../store/roots';
import { ToasterService } from './../toaster.service';
import { AuthenticationService } from './../authentication.service';
import { Actions, Effect } from '@ngrx/effects';
import { ComapnyResponse } from './../../models/api-models/Company';
import { BaseResponse } from './../../models/api-models/BaseResponse';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action, Store } from '@ngrx/store';

@Injectable()

export class VerifyMobileActions {

  public static VERIFY_MOBILE_REQUEST = 'VERIFY_MOBILE_REQUEST';
  public static SHOW_VERIFICATION_BOX = 'SHOW_VERIFICATION_BOX';
  public static VERIFY_MOBILE_CODE_REQUEST = 'VERIFY_MOBILE_CODE_REQUEST';
  public static VERIFY_MOBILE_CODE_RESPONSE = 'VERIFY_MOBILE_CODE_RESPONSE';

  @Effect() private verifyNumber$: Observable<Action> = this.action$
    .ofType(VerifyMobileActions.VERIFY_MOBILE_REQUEST)
    .switchMap(action => this._authService.VerifyNumber(action.payload)
      .map(response => this.action(VerifyMobileActions.SHOW_VERIFICATION_BOX, true))
      .catch(e => {
        this.store.dispatch(this.action(VerifyMobileActions.SHOW_VERIFICATION_BOX, false));
        return Observable.of(e);
      })
    );
  @Effect() private verifyNumberCode$: Observable<Action> = this.action$
    .ofType(VerifyMobileActions.VERIFY_MOBILE_CODE_REQUEST)
    .switchMap(action => this._authService.VerifyNumberOTP(action.payload)
      .map(response => {
        let no: string = null;
        this.store
          .select(x => x.verifyMobile.phoneNumber)
          .take(1)
          .subscribe(p => no = p);
        this.store.dispatch(this.companyActions.SetContactNumber(no));
        return this.action(VerifyMobileActions.VERIFY_MOBILE_CODE_RESPONSE, response);
      })
      .catch(e => Observable.of(e))
    );
  constructor(private action$: Actions,
    private _authService: AuthenticationService,
    private _toasty: ToasterService,
    private store: Store<AppState>,
    private companyActions: CompanyActions
  ) {

  }

  public verifyNumberRequest =
  (model: SignupWithMobile): Action => this.action(VerifyMobileActions.VERIFY_MOBILE_REQUEST, model)

  public verifyNumberCodeRequest =
  (verifyMobileModel: VerifyMobileModel): Action => this.action(VerifyMobileActions.VERIFY_MOBILE_CODE_REQUEST, verifyMobileModel)

  private action = (type, payload) => ({ type, payload });
}
