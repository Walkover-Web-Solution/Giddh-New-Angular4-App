import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { CompanyActions } from './company.actions';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomActions } from '../store/customActions';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { userLoginStateEnum } from '../store/authentication/authentication.reducer';
import { CompanyResponse, StateDetailsResponse } from '../models/api-models/Company';
import { ROUTES } from '../app.routes';
import { Configuration } from '../app.constant';
import { AuthenticationService } from '../services/authentication.service';
import { ToasterService } from '../services/toaster.service';
import { AppState } from '../store/index';
import { CompanyService } from '../services/companyService.service';
import { GeneralService } from '../services/general.service';
import { sortBy } from 'app/lodash-optimized';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class SessionActions {

  public static GET_ALL_SESSION_REQUEST = 'GET_ALL_SESSION_REQUEST';
  public static GET_ALL_SESSION_RESPONSE = 'GET_ALL_SESSION_RESPONSE';

  public static UPDATE_SESSION_REQUEST = 'UPDATE_SESSION_REQUEST';
  public static UPDATE_SESSION_RESPONSE = 'UPDATE_SESSION_RESPONSE';

  public static DELETE_SESSION_REQUEST = 'DELETE_SESSION_REQUEST';
  public static DELETE_SESSION_RESPONSE = 'DELETE_SESSION_RESPONSE';

  public static DELETE_ALL_SESSION_REQUEST = 'DELETE_ALL_SESSION_REQUEST';
  public static DELETE_ALL_SESSION_RESPONSE = 'DELETE_ALL_SESSION_RESPONSE';

  @Effect()
  public getAllSession$: Observable<Action> = this.actions$
    .ofType(SessionActions.GET_ALL_SESSION_REQUEST)
    .switchMap((action: CustomActions) => this.auth.GetUserSession())
    .map(response => this.getAllSessionResponse(response));

  @Effect()
  public getAllSessionResponse$: Observable<Action> = this.actions$
    .ofType(SessionActions.GET_ALL_SESSION_RESPONSE)
    .map((action: CustomActions) => {
      if (action.payload.status !== 'success') {
        this._toaster.errorToast(action.payload.message, action.payload.code);
        // this._toaster.successToast('action.payload.me');
      }
      return { type: 'EmptyAction' };
    });

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    public _router: Router,
    private actions$: Actions,
    private auth: AuthenticationService,
    public _toaster: ToasterService,
    private store: Store<AppState>,
    private comapnyActions: CompanyActions,
    private _companyService: CompanyService,
    private http: HttpClient,
    private _generalService: GeneralService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public getAllSession(): CustomActions {
    return {
      type: SessionActions.GET_ALL_SESSION_REQUEST
    };
  }

  public getAllSessionResponse(value: BaseResponse<string, string>): CustomActions {
    return {
      type: SessionActions.GET_ALL_SESSION_RESPONSE,
      payload: value
    };
  }

}
