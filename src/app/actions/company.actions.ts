import { map, switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CompanyService } from '../services/companyService.service';
import { Actions, Effect } from '@ngrx/effects';
import { CompanyRequest, CompanyResponse, StateDetailsRequest, StateDetailsResponse, TaxResponse } from '../models/api-models/Company';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { ToasterService } from '../services/toaster.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { AppState } from '../store/roots';
import { CustomActions } from '../store/customActions';
import { GeneralService } from 'app/services/general.service';
import { COMMON_ACTIONS } from './common.const';

// import { userLoginStateEnum } from '../store/authentication/authentication.reducer';

@Injectable()

export class CompanyActions {
  public static CREATE_COMPANY = 'CompanyCreate';
  public static CREATE_COMPANY_RESPONSE = 'CompanyResponse';
  public static RESET_CREATE_COMPANY_FLAG = 'RESET_CREATE_COMPANY_FLAG';
  public static REFRESH_COMPANIES = 'CompanyRefresh';
  public static REFRESH_COMPANIES_RESPONSE = 'CompanyRefreshResponse';
  public static GET_STATE_DETAILS = 'CompanyGetStateDetails';
  public static GET_STATE_DETAILS_RESPONSE = 'CompanyGetStateDetailsResponse';
  public static SET_STATE_DETAILS = 'CompanySetStateDetails';
  public static SET_STATE_DETAILS_RESPONSE = 'CompanySetStateDetailsResponse';
  public static GET_APPLICATION_DATE = 'GetApplicationDate';
  public static SET_APPLICATION_DATE = 'SetApplicationDate';
  public static SET_APPLICATION_DATE_RESPONSE = 'SetApplicationDateResponse';
  public static RESET_APPLICATION_DATE = 'ResetApplicationDate';

  public static CHANGE_COMPANY = 'CHANGE_COMPANY';
  public static CHANGE_COMPANY_RESPONSE = 'CHANGE_COMPANY_RESPONSE';

  public static SET_ACTIVE_COMPANY = 'CompanyActiveCompany';
  public static SET_CONTACT_NO = 'SET_CONTACT_NO';

  public static DELETE_COMPANY = 'CompanyDelete';
  public static DELETE_COMPANY_RESPONSE = 'CompanyDeleteResponse';
  public static GET_TAX = 'GroupTax';
  public static GET_TAX_RESPONSE = 'GroupTaxResponse';

  public static SET_MULTIPLE_CURRENCY_FIELD = 'SET_MULTIPLE_CURRENCY_FIELD';

  @Effect()
  public createCompany$: Observable<Action> = this.action$
    .ofType(CompanyActions.CREATE_COMPANY).pipe(
      switchMap((action: CustomActions) => this._companyService.CreateCompany(action.payload)),
      map(response => this.CreateCompanyResponse(response)));

  @Effect()
  public createCompanyResponse$: Observable<Action> = this.action$
    .ofType(CompanyActions.CREATE_COMPANY_RESPONSE).pipe(
      map((action: CustomActions) => {
        let response = action.payload as BaseResponse<CompanyResponse, CompanyRequest>;
        if (response.status === 'error') {
          this._toasty.errorToast(response.message, response.code);
          return {type: 'EmptyAction'};
        }
        this._toasty.successToast('Company created successfully', 'Success');
        // set newly created company as active company

        // check if new uer has created first company then set newUserLoggedIn false
        let isNewUser = false;
        this.store.select(s => s.session.userLoginState).pipe(take(1)).subscribe(s => {
          isNewUser = s === 2;
        });
        //
        if (isNewUser) {
          this.store.dispatch({
            type: 'SetLoginStatus',
            payload: 1
          });
        }

        let stateDetailsObj = new StateDetailsRequest();
        stateDetailsObj.companyUniqueName = response.request.uniqueName;
        if (!response.request.isBranch) {
          /**
           * if user is signed up on their own take him to sales module
           */
          if (this._generalService.user.isNewUser) {
            // stateDetailsObj.lastState = 'sales';
            stateDetailsObj.lastState = isNewUser ? 'welcome' : 'sales';
          } else {
            stateDetailsObj.lastState = 'home';
          }
          this.store.dispatch(this.SetStateDetails(stateDetailsObj));
        }
        return this.RefreshCompanies();
      }));
  @Effect()
  public RefreshCompanies$: Observable<Action> = this.action$
    .ofType(CompanyActions.REFRESH_COMPANIES).pipe(
      switchMap((action: CustomActions) => this._companyService.CompanyList()),
      map(response => {
        if (response.status === 'error') {
          this._toasty.errorToast(response.message, response.code);
          return {type: 'EmptyAction'};
        }
        return this.RefreshCompaniesResponse(response);
      }));

  @Effect()
  public RefreshCompaniesResponse$: Observable<CustomActions> = this.action$
    .ofType(CompanyActions.REFRESH_COMPANIES_RESPONSE).pipe(
      map((action: CustomActions) => {
        let response: BaseResponse<CompanyResponse[], string> = action.payload;
        if (response.status === 'error') {
          this._toasty.errorToast(response.message, response.code);
          return {type: 'EmptyAction'};
        }
        // check if user have companies
        if (response.body.length) {
          let activeCompanyName = null;
          this.store.select(s => s.session.companyUniqueName).pipe(take(1)).subscribe(a => activeCompanyName = a);

          if (activeCompanyName) {
            let companyIndex = response.body.findIndex(cmp => cmp.uniqueName === activeCompanyName);
            if (companyIndex > -1) {
              // if active company find no action needed
              return {type: 'EmptyAction'};
            } else {
              // if no active company active next company from companies list
              return {
                type: 'CHANGE_COMPANY',
                payload: response.body[0].uniqueName
              };
            }
          } else {
            // if no active company active next company from companies list
            return {
              type: 'CHANGE_COMPANY',
              payload: response.body[0].uniqueName
            };
          }
        } else {
          //  if no companies available open create new company popup
          return {
            type: 'SetLoginStatus',
            payload: 2
          } as CustomActions;
        }
      }));

  @Effect()
  public GetStateDetails$: Observable<Action> = this.action$
    .ofType(CompanyActions.GET_STATE_DETAILS).pipe(
      switchMap((action: CustomActions) => this._companyService.getStateDetails(action.payload)),
      map(response => {
        if (response.status === 'error') {
          this._toasty.errorToast(response.message, response.code);
          return {type: 'EmptyAction'};
        }
        return this.GetStateDetailsResponse(response);
      }));

  @Effect()
  public SetStateDetails$: Observable<Action> = this.action$
    .ofType(CompanyActions.SET_STATE_DETAILS).pipe(
      switchMap((action: CustomActions) => this._companyService.setStateDetails(action.payload)),
      map(response => {
        if (response.status === 'error') {
          this._toasty.errorToast(response.message, response.code);
          return {type: 'EmptyAction'};
        }
        return this.SetStateDetailsResponse(response);
      }));

  @Effect()
  public GetApplicationDate$: Observable<Action> = this.action$
    .ofType(CompanyActions.GET_APPLICATION_DATE).pipe(
      switchMap((action: CustomActions) => this._companyService.getApplicationDate()),
      map(response => {
        if (response.status === 'error') {
          this._toasty.errorToast(response.message, response.code);
          return {type: 'EmptyAction'};
        }
        return this.SeApplicationDateResponse(response);
      }));

  @Effect()
  public SetApplicationDate$: Observable<Action> = this.action$
    .ofType(CompanyActions.SET_APPLICATION_DATE).pipe(
      switchMap((action: CustomActions) => this._companyService.setApplicationDate(action.payload)),
      map(response => {
        if (response.status === 'error') {
          this._toasty.errorToast(response.message, response.code);
          return {type: 'EmptyAction'};
        } else if (response.status === 'success') {
          this._toasty.successToast('Application date updated successfully.', 'Success');
          return this.SeApplicationDateResponse(response);
        }
      }));

  @Effect()
  public DeleteCompany$: Observable<Action> = this.action$
    .ofType(CompanyActions.DELETE_COMPANY).pipe(
      switchMap((action: CustomActions) => this._companyService.DeleteCompany(action.payload)),
      map(response => {
        return this.DeleteCompanyResponse(response);
      }));

  @Effect()
  public DeleteCompanyResponse$: Observable<Action> = this.action$
    .ofType(CompanyActions.DELETE_COMPANY_RESPONSE).pipe(
      map((action: CustomActions) => {
        if (action.payload.status === 'error') {
          this._toasty.errorToast(action.payload.message, action.payload.code);
          return {type: 'EmptyAction'};
        } else {
          this._toasty.successToast(action.payload.body, 'success');
        }
        this.store.dispatch(this.RefreshCompanies());
        return {type: 'EmptyAction'};
      }));

  @Effect()
  public CompanyTax$: Observable<Action> = this.action$
    .ofType(CompanyActions.GET_TAX).pipe(
      switchMap((action: CustomActions) => this._companyService.getComapnyTaxes()),
      map(response => {
        return this.getTaxResponse(response);
      }));

  @Effect()
  public CompanyTaxResponse$: Observable<Action> = this.action$
    .ofType(CompanyActions.GET_TAX_RESPONSE).pipe(
      map((action: CustomActions) => {
        if (action.payload.status === 'error') {
          this._toasty.errorToast(action.payload.message, action.payload.code);
        }
        return {type: 'EmptyAction'};
      }));

  constructor(
    private action$: Actions,
    private _companyService: CompanyService,
    private _toasty: ToasterService,
    private store: Store<AppState>,
    private _generalService: GeneralService
  ) {
  }

  public CreateCompany(value: CompanyRequest): CustomActions {
    return {
      type: CompanyActions.CREATE_COMPANY,
      payload: value
    };
  }

  public RefreshCompanies(): CustomActions {
    return {
      type: CompanyActions.REFRESH_COMPANIES
    };
  }

  public RefreshCompaniesResponse(response: BaseResponse<CompanyResponse[], string>): CustomActions {
    return {
      type: CompanyActions.REFRESH_COMPANIES_RESPONSE,
      payload: response
    };
  }

  public SetActiveCompany(value: string): CustomActions {
    return {
      type: CompanyActions.SET_ACTIVE_COMPANY,
      payload: value
    };
  }

  public CreateCompanyResponse(value: BaseResponse<CompanyResponse, CompanyRequest>): CustomActions {
    this.store.dispatch(this.ResetApplicationData());
    return {
      type: CompanyActions.CREATE_COMPANY_RESPONSE,
      payload: value
    };
  }

  public ResetApplicationData(): CustomActions {
    return {
      type: COMMON_ACTIONS.RESET_APPLICATION_DATA
    };
  }

  public GetStateDetails(cmpUniqueName?: string): CustomActions {
    return {
      type: CompanyActions.GET_STATE_DETAILS,
      payload: cmpUniqueName
    };
  }

  public GetStateDetailsResponse(value: BaseResponse<StateDetailsResponse, string>): CustomActions {
    return {
      type: CompanyActions.GET_STATE_DETAILS_RESPONSE,
      payload: value
    };
  }

  public SetStateDetails(value: StateDetailsRequest): CustomActions {
    return {
      type: CompanyActions.SET_STATE_DETAILS,
      payload: value
    };
  }

  public GetApplicationDate(): CustomActions {
    return {
      type: CompanyActions.GET_APPLICATION_DATE,
      payload: null
    };
  }

  public SetApplicationDate(value: any): CustomActions {
    return {
      type: CompanyActions.SET_APPLICATION_DATE,
      payload: value
    };
  }

  public SeApplicationDateResponse(value: BaseResponse<string, any>): CustomActions {
    return {
      type: CompanyActions.SET_APPLICATION_DATE_RESPONSE,
      payload: value
    };
  }

  public ResetApplicationDate(): CustomActions {
    return {
      type: CompanyActions.RESET_APPLICATION_DATE,
    };
  }

  public SetStateDetailsResponse(value: BaseResponse<string, StateDetailsRequest>): CustomActions {
    return {
      type: CompanyActions.SET_STATE_DETAILS_RESPONSE,
      payload: value
    };
  }

  public DeleteCompany(value: string): CustomActions {
    return {
      type: CompanyActions.DELETE_COMPANY,
      payload: value
    };
  }

  public DeleteCompanyResponse(value: BaseResponse<string, string>): CustomActions {
    return {
      type: CompanyActions.DELETE_COMPANY_RESPONSE,
      payload: value
    };
  }

  public getTax(): CustomActions {
    return {
      type: CompanyActions.GET_TAX
    };
  }

  public getTaxResponse(value: BaseResponse<TaxResponse[], string>): CustomActions {
    return {
      type: CompanyActions.GET_TAX_RESPONSE,
      payload: value
    };
  }

  public SetContactNumber(value: string): CustomActions {
    return {
      type: CompanyActions.SET_CONTACT_NO,
      payload: value
    };
  }

  public ResetCompanyPopup(): CustomActions {
    return {type: CompanyActions.RESET_CREATE_COMPANY_FLAG};
  }

}
