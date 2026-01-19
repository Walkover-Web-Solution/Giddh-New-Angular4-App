import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CustomActions } from '../store/custom-actions';
import { AuthenticationService } from '../services/authentication.service';
import { ToasterService } from '../services/toaster.service';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * SessionActions class
 * Implements SessionActions functionality
 */
export class SessionActions {

    public static GET_ALL_SESSION_REQUEST = 'GET_ALL_SESSION_REQUEST';
    public static GET_ALL_SESSION_RESPONSE = 'GET_ALL_SESSION_RESPONSE';

    public static UPDATE_SESSION_REQUEST = 'UPDATE_SESSION_REQUEST';
    public static UPDATE_SESSION_RESPONSE = 'UPDATE_SESSION_RESPONSE';

    public static DELETE_SESSION_REQUEST = 'DELETE_SESSION_REQUEST';
    public static DELETE_SESSION_RESPONSE = 'DELETE_SESSION_RESPONSE';

    public static DELETE_ALL_SESSION_REQUEST = 'DELETE_ALL_SESSION_REQUEST';
    public static DELETE_ALL_SESSION_RESPONSE = 'DELETE_ALL_SESSION_RESPONSE';

    public getAllSession$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SessionActions.GET_ALL_SESSION_REQUEST),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.auth.GetUserSession()),
            /**
             * Handles map functionality
             */
            map(response => this.getAllSessionResponse(response))));

    public getAllSessionResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SessionActions.GET_ALL_SESSION_RESPONSE),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status !== 'success') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public deleteSession$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SessionActions.DELETE_SESSION_REQUEST),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.auth.DeleteSession(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.deleteSessionResponse(response))));

    public deleteSessionResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SessionActions.DELETE_SESSION_RESPONSE),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status !== 'success') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public deleteAllSession$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SessionActions.DELETE_ALL_SESSION_REQUEST),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.auth.DeleteAllSession()),
            /**
             * Handles map functionality
             */
            map(response => this.deleteAllSessionResponse(response))));

    public deleteAllSessionResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SessionActions.DELETE_ALL_SESSION_RESPONSE),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status !== 'success') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        public _router: Router,
        private actions$: Actions,
        private auth: AuthenticationService,
        public _toaster: ToasterService
    ) {
    }

    /**
     * Retrieves allsession data
     */
    public getAllSession(): CustomActions {
        return {
            type: SessionActions.GET_ALL_SESSION_REQUEST
        };
    }

    /**
     * Retrieves allsessionresponse data
     */
    public getAllSessionResponse(response): CustomActions {
        return {
            type: SessionActions.GET_ALL_SESSION_RESPONSE,
            payload: response
        };
    }

    /**
     * Returns the delete session action
     *
     * @param {*} sessionId Session details
     * @returns {CustomActions} Delete session action
     * @memberof SessionActions
     */
    public deleteSession(sessionId: any): CustomActions {
        return {
            type: SessionActions.DELETE_SESSION_REQUEST,
            payload: sessionId
        };
    }

    /**
     * Deletes sessionresponse
     */
    public deleteSessionResponse(response): CustomActions {
        return {
            type: SessionActions.DELETE_SESSION_RESPONSE,
            payload: response
        };
    }

    /**
     * Deletes allsession
     */
    public deleteAllSession(): CustomActions {
        return {
            type: SessionActions.DELETE_ALL_SESSION_REQUEST
        };
    }

    /**
     * Deletes allsessionresponse
     */
    public deleteAllSessionResponse(response): CustomActions {
        return {
            type: SessionActions.DELETE_ALL_SESSION_RESPONSE,
            payload: response
        };
    }

}
