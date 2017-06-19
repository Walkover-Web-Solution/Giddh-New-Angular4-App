// import { AuthActions } from '../../store/authentication/authentication.reducer';
// import { Injectable } from '@angular/core';

// import { Actions, Effect } from '@ngrx/effects';
// import { AuthenticationService } from '../authentication.service';
// import { Observable } from 'rxjs';

// @Injectable()
// export class AuthenticationEffects {
//   @Effect() public login$ = this.actions$
//     .ofType(AuthActions.LOGIN)
//     .switchMap(action => this.auth.login(action.payload)
//       .map((res: any) => ({ type: AuthActions.LOGIN_SUCCESS, payload: res }))
//       .catch((_error) => Observable.of({ type: AuthActions.LOGIN_FAILED, payload: _error }))
//     );

//   @Effect() logout$ = this.actions$
//     .ofType(AuthActions.LOGOUT)
//     .switchMap(action => this.auth.logout()
//       .map((res: any) => ({ type: AuthActions.LOGOUT_SUCCESS, payload: res }))
//     );

//   @Effect() checkAuth$ = this.actions$
//     .ofType(AuthActions.CHECK_AUTH)
//     .switchMap(action => this.auth.checkAuth()
//       .map((res: any) => {
//         if (res !== null) {
//           return { type: AuthActions.CHECK_AUTH_SUCCESS, payload: res };
//         } else {
//           return { type: AuthActions.CHECK_AUTH_SUCCESS_NO_USER };
//         }
//       })
//     );

//   constructor(private auth: AuthenticationService,
//               private actions$: Actions) {
//   }
// }
