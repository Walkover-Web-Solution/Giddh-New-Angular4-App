import { AppState } from '../store/roots';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
import { ErrorHandlerService } from './../services/errorhandler.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public isVerifyMobileInProcess$: Observable<boolean>;
  public isLoginWithMobileInProcess$: Observable<boolean>;
  public isVerifyEmailInProcess$: Observable<boolean>;
  public isLoginWithEmailInProcess$: Observable<boolean>;

  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>,
    private auth: AuthService,
    private router: Router,
    private eh: ErrorHandlerService) {
    this.isLoginWithEmailInProcess$ = store.select((state) => {
      return state.login.isLoginWithEmailInProcess;
    });

    this.isVerifyEmailInProcess$ = store.select((state) => {
      return state.login.isVerifyEmailInProcess;
    });
    this.isLoginWithMobileInProcess$ = store.select((state) => {
      return state.login.isLoginWithMobileInProcess;
    });
    this.isVerifyMobileInProcess$ = store.select((state) => {
      return state.login.isVerifyMobileInProcess;
    });
  }

  public ngOnInit() {
    // this.auth.login({})
  }

  public loginWithProvider(provider: string) {
    this.auth.authenticate(provider)
      .subscribe({
        error: (err: any) => {
          // tslint:disable-next-line:no-debugger
          debugger;
          this.eh.handleError(err);
        },
        complete: () => {
          // tslint:disable-next-line:no-debugger
          debugger;
          this.router.navigateByUrl('main');
        }
      });

  }

}
