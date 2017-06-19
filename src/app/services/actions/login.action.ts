import { AuthenticationService } from '../authentication.service';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class LoginActions {

  public static SignupWithEmail = 'SignupWithEmail';
  public static SignupWithEmailResponce = 'SignupWithEmailResponce';

  @Effect()
  public signupWithEmail$: Observable<Action> = this.actions$
    .ofType(LoginActions.SignupWithEmail)
    .debug('action received')
    .switchMap(action => this.auth.SignupWithEmail(action.payload))
    .debug('data received via the HTTP request')
    .map(response => this.SignupWithEmailResponce(response));
  constructor(private actions$: Actions, private auth: AuthenticationService) {

  }

  public setValue(value: string): Action {
    return {
      type: LoginActions.SignupWithEmail,
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
