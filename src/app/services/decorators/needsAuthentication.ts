import { CompanyActions } from '../actions/company.actions';
import { CompanyService } from '../companyService.service';
import { VerifyEmailResponseModel } from '../../models/api-models/loginModels';
import { AppState } from '../../store/roots';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Store } from '@ngrx/store';

@Injectable()
export class NeedsAuthentication implements CanActivate {
  private user: VerifyEmailResponseModel;
  constructor(public _router: Router, private store: Store<AppState>, private _companyService: CompanyService, private companyActions: CompanyActions) {
  }
  public canActivate() {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user;
      }
    });
    if (this.user && this.user.authKey) {
      let cmpUniqueName = '';
      this.store.select(s => s.session.companyUniqueName).take(1).subscribe(s => {
        if (s) {
          cmpUniqueName = s;
        }
      });
      if (cmpUniqueName === '') {
        console.log('Opps! I don\'t have company name from needsAuthentication, Let me get it');
        let resp = this._companyService.getStateDetails('').toPromise();
        return resp.then(p => {
          console.log('Got It!Let\'t Redirect-> from needsAuthentication');
          this.store.dispatch(this.companyActions.GetStateDetailsResponse(p));
          return true;
        }).catch((e) => {
          console.log(e);
          return true;
        });
      }
      console.log('YAY! I have company name from needsAuthentication');
      return true;
    } else {
      console.log('Home youa are not authenticated Login again from needsAuthentication');
      this._router.navigate(['/dummy'], { skipLocationChange: true }).then(() => {
        this._router.navigate(['/login']);
      });
      return false;
    }
  }
}
