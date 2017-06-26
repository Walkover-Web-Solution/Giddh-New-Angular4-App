import { Observable } from 'rxjs/Observable';
import { CompanyService } from './../companyService.service';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { CompanyRequest, ComapnyResponse, StateDetailsResponse, StateDetailsRequest, TaxResponse } from './../../models/api-models/Company';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { ToasterService } from '../toaster.service';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AppState } from '../../store/roots';

@Injectable()

export class CompanyActions {
  public static CREATE_COMPANY = 'CompanyCreate';
  public static CREATE_COMPANY_RESPONSE = 'CompanyResponse';
  public static REFRESH_COMPANIES = 'CompanyRefresh';
  public static REFRESH_COMPANIES_RESPONSE = 'CompanyRefreshResponse';
  public static GET_STATE_DETAILS = 'CompanyGetStateDetails';
  public static GET_STATE_DETAILS_RESPONSE = 'CompanyGetStateDetailsResponse';
  public static SET_STATE_DETAILS = 'CompanySetStateDetails';
  public static SET_STATE_DETAILS_RESPONSE = 'CompanySetStateDetailsResponse';
  public static SET_ACTIVE_COMPANY = 'CompanyActiveCompany';
  public static SET_CONTACT_NO = 'SET_CONTACT_NO';

  public static DELETE_COMPANY = 'CompanyDelete';
  public static DELETE_COMPANY_RESPONSE = 'CompanyDeleteResponse';
  public static GET_TAX = 'GroupTax';
  public static GET_TAX_RESPONSE = 'GroupTaxResponse';

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

  @Effect()
  public SetStateDetails$: Observable<Action> = this.action$
    .ofType(CompanyActions.SET_STATE_DETAILS)
    .debug('')
    .switchMap(action => this._companyService.setStateDetails(action.payload))
    .map(response => {
      if (response.status === 'error') {
        this._toasty.errorToast(response.message, response.code);
      }
      return this.SetStateDetailsResponse(response);
    });

  @Effect()
  public DeleteCompany$: Observable<Action> = this.action$
    .ofType(CompanyActions.DELETE_COMPANY)
    .debug('')
    .switchMap(action => this._companyService.DeleteCompany(action.payload))
    .map(response => {
      return this.DeleteCompanyResponse(response);
    });

  @Effect()
  public DeleteCompanyResponse$: Observable<Action> = this.action$
    .ofType(CompanyActions.DELETE_COMPANY_RESPONSE)
    .debug('')
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      } else {
        this._toasty.successToast(action.payload.body, 'success');
      }
      this.store.dispatch(this.RefreshCompanies());
      return { type: '' };
    });

  @Effect()
  public CompanyTax$: Observable<Action> = this.action$
    .ofType(CompanyActions.GET_TAX)
    .debug('')
    .switchMap(action => this._companyService.getComapnyTaxes())
    .map(response => {
      return this.getTaxResponse(response);
});

  @Effect()
  public CompanyTaxResponse$: Observable<Action> = this.action$
    .ofType(CompanyActions.GET_TAX_RESPONSE)
    .debug('')
    .map(action => {
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      }
      return {type: ''};
});

  constructor(private action$: Actions, private _companyService: CompanyService, private _toasty: ToasterService, private store: Store<AppState>) {

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

  public SetStateDetails(value: StateDetailsRequest): Action {
    return {
      type: CompanyActions.SET_STATE_DETAILS,
      payload: value
    };
  }

  public SetStateDetailsResponse(value: BaseResponse<StateDetailsResponse>): Action {
    return {
      type: CompanyActions.SET_STATE_DETAILS_RESPONSE,
      payload: value
    };
  }

  public DeleteCompany(value: string): Action {
    return {
      type: CompanyActions.DELETE_COMPANY,
      payload: value
    };
  }

  public DeleteCompanyResponse(value: BaseResponse<string>): Action {
    return {
      type: CompanyActions.DELETE_COMPANY_RESPONSE,
      payload: value
    };
  }

  public getTax(): Action {
    return {
      type: CompanyActions.GET_TAX
    };
  }
  public getTaxResponse(value: BaseResponse<TaxResponse[]>): Action {
    return {
      type: CompanyActions.GET_TAX_RESPONSE,
      payload: value
    };
  }
  public SetContactNumber(value: string): Action {
    return {
      type: CompanyActions.SET_CONTACT_NO,
      payload: value
    };
  }
}
