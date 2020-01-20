import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable, ReplaySubject } from 'rxjs';
import { CompanyActions } from './company.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomActions } from '../store/customActions';
import { AuthenticationService } from '../services/authentication.service';
import { ToasterService } from '../services/toaster.service';
import { AppState } from '../store/index';
import { CompanyService } from '../services/companyService.service';
import { GeneralService } from '../services/general.service';

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
        .ofType(SessionActions.GET_ALL_SESSION_REQUEST).pipe(
            switchMap((action: CustomActions) => this.auth.GetUserSession()),
            map(response => this.getAllSessionResponse(response)));

    @Effect()
    public getAllSessionResponse$: Observable<Action> = this.actions$
        .ofType(SessionActions.GET_ALL_SESSION_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status !== 'success') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                    // this._toaster.successToast('action.payload.me');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public deleteSession$: Observable<Action> = this.actions$
        .ofType(SessionActions.DELETE_SESSION_REQUEST).pipe(
            switchMap((action: CustomActions) => this.auth.DeleteSession(action.payload)),
            map(response => this.deleteSessionResponse(response)));

    @Effect()
    public deleteSessionResponse$: Observable<Action> = this.actions$
        .ofType(SessionActions.DELETE_SESSION_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status !== 'success') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                    // this._toaster.successToast('action.payload.me');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public deleteAllSession$: Observable<Action> = this.actions$
        .ofType(SessionActions.DELETE_ALL_SESSION_REQUEST).pipe(
            switchMap((action: CustomActions) => this.auth.DeleteAllSession()),
            map(response => this.deleteAllSessionResponse(response)));

    @Effect()
    public deleteAllSessionResponse$: Observable<Action> = this.actions$
        .ofType(SessionActions.DELETE_ALL_SESSION_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status !== 'success') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                    // this._toaster.successToast('action.payload.me');
                }
                return { type: 'EmptyAction' };
            }));

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

    public getAllSessionResponse(response): CustomActions {
        return {
            type: SessionActions.GET_ALL_SESSION_RESPONSE,
            payload: response
        };
    }

    public deleteSession(sessionId: string): CustomActions {
        return {
            type: SessionActions.DELETE_SESSION_REQUEST,
            payload: sessionId
        };
    }

    public deleteSessionResponse(response): CustomActions {
        return {
            type: SessionActions.DELETE_SESSION_RESPONSE,
            payload: response
        };
    }

    public deleteAllSession(): CustomActions {
        return {
            type: SessionActions.DELETE_ALL_SESSION_REQUEST
        };
    }

    public deleteAllSessionResponse(response): CustomActions {
        return {
            type: SessionActions.DELETE_ALL_SESSION_RESPONSE,
            payload: response
        };
    }

}
