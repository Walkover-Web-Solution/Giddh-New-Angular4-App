import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
import { ErrorHandlerService } from './../services/errorhandler.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // tslint:disable-next-line:no-empty
  constructor(private auth: AuthService,
              private router: Router,
              private eh: ErrorHandlerService) { }

  // tslint:disable-next-line:no-empty
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
