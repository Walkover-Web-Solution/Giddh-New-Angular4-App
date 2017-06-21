import { Observable } from 'rxjs/Observable';
import { CompanyService } from './../companyService.service';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { CompanyRequest } from './../../models/api-models/Company';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { ToasterService } from '../toaster.service';
import { ComapnyResponse, StateDetailsResponse } from '../../models/index';
import { BaseResponse } from '../../models/api-models/BaseResponse';

@Injectable()

export class CompanyActions {
  public static CREATE_COMPANY = 'CompanyCreate';
  public static CREATE_COMPANY_RESPONSE = 'CompanyResponse';
  public static REFRESH_COMPANIES = 'CompanyRefresh';
  public static REFRESH_COMPANIES_RESPONSE = 'CompanyRefreshResponse';
  public static GET_STATE_DETAILS = 'CompanyStateDetails';
  public static GET_STATE_DETAILS_RESPONSE = 'CompanyStateDetailsResponse';
  public static SET_ACTIVE_COMPANY = 'CompanyActiveCompany';

  @Effect()
  public createCompany$: Observable<Action> = this.action$
    .ofType(CompanyActions.CREATE_COMPANY)
    .debug('')
    .switchMap(action => {
      return this._companyService.CreateCompany(action.payload);
    })
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

     @Effect()
  public GetStateDetails$: Observable<Action> = this.action$
    .ofType(CompanyActions.GET_STATE_DETAILS)
    .debug('')
    .switchMap(action => this._companyService.getStateDetails())
    .map(response => {
      console.log('Response ' + response);
      return this.GetStateDetailsResponse(response);
  });
  constructor(private action$: Actions, private _companyService: CompanyService, private _toasty: ToasterService) {

  }
  public CreateCompany(value: CompanyRequest): Action {
    return {
      type: CompanyActions.CREATE_COMPANY,
      payload: value
    };
  }

  public RefreshCompanies(): Action {
    return {
      type: CompanyActions.REFRESH_COMPANIES
    };
  }

  public RefreshCompaniesResponse(response: BaseResponse<ComapnyResponse[]>): Action {
    return {
      type: CompanyActions.REFRESH_COMPANIES_RESPONSE,
      payload: response
    };
  }

  public CreateCompanyResponse(value: BaseResponse<ComapnyResponse>): Action {
    return {
      type: CompanyActions.CREATE_COMPANY_RESPONSE,
      payload: value
    };
  }

  public GetStateDetails(): Action {
    return {
      type: CompanyActions.GET_STATE_DETAILS
    };
  }

  public GetStateDetailsResponse(value: BaseResponse<StateDetailsResponse>): Action {
    return {
      type: CompanyActions.GET_STATE_DETAILS_RESPONSE,
      payload: value
    };
  }

  public setActiveCompany(company: ComapnyResponse): Action {
    return {
      type: CompanyActions.SET_ACTIVE_COMPANY,
      payload: company
    };
  }
}
