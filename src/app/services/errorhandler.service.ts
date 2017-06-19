import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { AuthenticationService } from './authentication.service';
import { ToasterService } from './toaster.service';
import { Router } from '@angular/router';
import { Response } from '@angular/http';

@Injectable()
export class ErrorHandlerService {

  constructor(public _authService: AuthenticationService,
              public _toaster: ToasterService,
              private _router: Router) { }

  public handleError(err: any) {
    if (typeof err === 'string') {
      this._toaster.errorToast(err);
    } else if (err instanceof Response) {
      const res: Response = err;
      if (res.text() && res.text() !== res.statusText) {
        this._toaster.errorToast(res.text(), res.statusText);
      } else {
        this._toaster.errorToast(res.statusText);
      }
    } else if (err && err.message) {
      this._toaster.errorToast(err.message);
    } else if (err) {
      this._toaster.errorToast(err.toString());
    } else {
      this._toaster.errorToast('An unknown error has occurred');
    }
  }
}
