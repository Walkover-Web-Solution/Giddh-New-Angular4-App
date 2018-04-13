import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { ToasterService } from '../services/toaster.service';
import { SignupWithMobile, UserDetails, VerifyMobileModel } from '../models/api-models/loginModels';
import { LoginActions } from '../actions/login.action';
import { AuthenticationService } from '../services/authentication.service';
import { CompanyService } from '../services/companyService.service';
import { CompanyResponse, GetCouponResp, StateDetailsRequest } from '../models/api-models/Company';
import { cloneDeep } from '../lodash-optimized';
import { CompanyActions } from '../actions/company.actions';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { IOption } from 'app/theme/ng-virtual-select/sh-options.interface';

const CustomerType = [
  {label: 'Customer', value: 'customer'},
  {label: 'Vendor', value: 'vendor'}
];

@Component({
  selector: 'contact-detail',
  templateUrl: './contact.component.html',
  styles: [`
  .dropdown-menu>li>a{
    padding: 2px 10px;
  }
  `]
})

export class ContactComponent implements OnInit, OnDestroy {
  public CustomerType = CustomerType;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _toasty: ToasterService, private router: Router) {

  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
