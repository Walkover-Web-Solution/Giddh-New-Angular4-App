import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Configuration, URLS } from '../app.constants';
import { Router } from '@angular/router';
import { HttpWrapperService } from './httpWrapper.service';
import { CurrentUserService } from './currentUser.service';
import { ErrorHandlerService } from './errorhandler.service';
import { LoaderService } from './loader.service';
// import { UserManager, Log, MetadataService, User } from 'oidc-client';
@Injectable()
export class AuthenticationService {

  constructor(public _http: HttpWrapperService,
              public _router: Router,
              public _currentUserService: CurrentUserService,
  ) {
  }

  // public loginSignUpWithGoogle(){
  // }
  public HandleError(error: any) {
    console.log(error);
    if (error.status === 403) {
      this._router.navigate(['/Forbidden']);
    } else if (error.status === 401) {
      this._router.navigate(['/Unauthorized']);
    }
  }
}
