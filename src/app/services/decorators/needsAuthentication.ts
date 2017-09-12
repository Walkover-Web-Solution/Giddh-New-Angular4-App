import { CompanyActions } from '../actions/company.actions';
import { CompanyService } from '../companyService.service';
import { VerifyEmailResponseModel } from '../../models/api-models/loginModels';
import { AppState } from '../../store/roots';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StateDetailsRequest, StateDetailsResponse } from '../../models/api-models/Company';
import { BaseResponse } from '../../models/api-models/BaseResponse';

@Injectable()
export class NeedsAuthentication implements CanActivate {
  private user: VerifyEmailResponseModel;
  constructor(public _router: Router, private store: Store<AppState>, private _companyService: CompanyService, private companyActions: CompanyActions) {
  }
  public canActivate() {
    // Take User from session
    this.store.select(p => p.session.user).subscribe(s => {
      if (s) {
        this.user = s ;
      }
    });
    // Check if user has Session
    if (this.user && this.user.session && this.user.session.id) {

      let cmpUniqueName = '';
      this.store.select(s => s.session.companyUniqueName).subscribe(s => {
        if (s) {
          cmpUniqueName = s;
        }
      });
      // check if user have activeCompany
      if (cmpUniqueName === '') {
        console.log('Opps! I don\'t have company name from needsAuthentication, Let me get it');
        // getStateDeailsAuthGuard to check if user have
        let resp = this._companyService.getStateDetailsAuthGuard('').toPromise();
        return resp.then(p => {
          // if (p.body == null) {
          return this._companyService.CompanyList().toPromise().then(cmp => {
            if (cmp.body.length > 0) {
              if (cmp.body.findIndex(c => c.uniqueName === p.body.companyUniqueName) > -1) {
                this.store.dispatch(this.companyActions.GetStateDetailsResponse(p));
                return true;
              } else {
                let respState = new BaseResponse<StateDetailsResponse, string>();
                respState.body = new StateDetailsResponse();
                respState.body.companyUniqueName = cmp.body[0].uniqueName;
                respState.body.lastState = 'company.content.ledgerContent@giddh';
                respState.status = 'success';
                respState.request = '';
                this.store.dispatch(this.companyActions.GetStateDetailsResponse(respState));
                return true;
              }
            } else {
              // Navigate to new-user for adding new comapny
              this._router.navigate(['/dummy'], { skipLocationChange: true }).then(() => {
                this._router.navigate(['/new-user']);
              });
              return false;
            }
          });
          // } else {
          //   console.log('Got It!Let\'t Redirect-> from needsAuthentication');
          //   this.store.dispatch(this.companyActions.GetStateDetailsResponse(p));
          //   return true;
          // }
        }).catch((e) => {
          return this._companyService.CompanyList().toPromise().then(cmp => {
            if (cmp.body.length > 0) {
              // Set first company as acctive call Set StateDetail API
              let respState = new BaseResponse<StateDetailsResponse, string>();
              respState.body = new StateDetailsResponse();
              respState.body.companyUniqueName = cmp.body[0].uniqueName;
              respState.body.lastState = 'company.content.ledgerContent@giddh';
              respState.status = 'success';
              respState.request = '';
              this.store.dispatch(this.companyActions.GetStateDetailsResponse(respState));
              return true;
            } else {
              // Navigate to new-user for adding new comapny
              this._router.navigate(['/dummy'], { skipLocationChange: true }).then(() => {
                this._router.navigate(['/new-user']);
              });
              return false;
            }
          });
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
