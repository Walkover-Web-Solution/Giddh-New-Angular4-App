import { ToasterService } from '../toaster.service';
import { AuthenticationService } from '../authentication.service';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class LoginActions {

  public static SignupWithEmailRequest = 'SignupWithEmailRequest';
  public static SignupWithEmailResponce = 'SignupWithEmailResponce';

  @Effect()
  public signupWithEmail$: Observable<Action> = this.actions$
    .ofType(LoginActions.SignupWithEmailRequest)
    .debug('action received')
    .switchMap(action => this.auth.SignupWithEmail(action.payload))
    .debug('data received via the HTTP request')
    .map(response => {
      debugger
      if (response.status === 200) {
        return this.SignupWithEmailResponce({
          status: 'success', body: 'Verification Code Sent Successfully.'
        });
      } else {
        return this.SignupWithEmailResponce({
          status: 'error', body: 'The email: abc@gmail.con is invalid.', code: 'INVALID_EMAIL'
        });
      }
    });

  @Effect()
  public signupWithEmailResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.SignupWithEmailResponce)
    .debug('action received')
    .map(action => {
      if (action.payload.status === 'success') {
        this._toaster.successToast(action.payload.body);
      } else {
        this._toaster.errorToast(action.payload.body);
      }
      return { type: '' };
    });

  constructor(private actions$: Actions,
    private auth: AuthenticationService,
    public _toaster: ToasterService) {

  }

  public SignupWithEmailRequest(value: any): Action {
    return {
      type: LoginActions.SignupWithEmailRequest,
      payload: value
    };
  }
  public SignupWithEmailResponce(value: any): Action {
    return {
      type: LoginActions.SignupWithEmailResponce,
      payload: value
    };
  }

}
