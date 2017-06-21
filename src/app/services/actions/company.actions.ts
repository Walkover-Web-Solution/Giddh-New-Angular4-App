import { Observable } from 'rxjs/Observable';
import { CompanyService } from './../companyService.service';
import { Effect, Actions } from '@ngrx/effects';
import { Company } from './../../models/api-models/Company';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { ToasterService } from '../toaster.service';

@Injectable()

export class CompanyActions {
  public static CREATE_COMPANY = '[Company] Create';
  public static REFRESH_COMPANIES = '[Company] Refresh';
  public static REFRESH_COMPANIES_RESPONSE = '[Company] Response';

  @Effect()
  public createCompany$: Observable<Action> = this.action$
    .ofType(CompanyActions.CREATE_COMPANY)
    .debug('')
    .switchMap(action => this._companyService.CreateCompany(action.payload))
    .map(response => {
      console.log('Response ' + response);
      return this.CreateCompanyResponse(response);
    });

  @Effect()
  public RefreshCompanies$: Observable<Action> = this.action$
    .ofType(CompanyActions.REFRESH_COMPANIES)
    .debug('')
    .switchMap(action => this._companyService.CompanyList())
    .map(response => {
      console.log('Response ' + response);
      return this.RefreshCompaniesResponse(response);
  });

  @Effect()
  public RefreshCompaniesResponse$: Observable<Action> = this.action$
    .ofType(CompanyActions.REFRESH_COMPANIES_RESPONSE)
    .debug('')
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      }
      return { type: '' };
    });

  constructor(private action$: Actions, private _companyService: CompanyService, private _toasty: ToasterService) {

  }
  public CreateCompany(value: Company): Action {
    return {
      type: CompanyActions.CREATE_COMPANY,
      payload: value
    };
  }

  public RefreshCompanies(): Action {
    return {
      type: CompanyActions.REFRESH_COMPANIES,
      payload: true
    };
  }

  public RefreshCompaniesResponse(response: Response): Action {
    return {
      type: CompanyActions.REFRESH_COMPANIES_RESPONSE,
      payload: response
    };
  }

  public CreateCompanyResponse(value: Response): Action {
    return {
      type: CompanyActions.CREATE_COMPANY,
      payload: value
    };
  }
}
