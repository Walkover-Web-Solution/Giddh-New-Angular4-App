import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { CustomActions } from '../../store/custom-actions';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { SubscriptionsService } from '../../services/subscriptions.service';
import { ToasterService } from '../../services/toaster.service';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * SubscriptionsActions class
 * Implements SubscriptionsActions functionality
 */
export class SubscriptionsActions {
    public static SubscribedCompanies = 'SubscribedCompanies';
    public static SubscribedCompaniesResponse = 'SubscribedCompaniesResponse';
    public static SubscribedUserTransactions = 'SubscribedUserTransactions';
    public static SubscribedUserTransactionsResponse = 'SubscribedUserTransactionsResponse';
    public static SubscribedCompanyTransactions = 'SubscribedCompanyTransactions';
    public static SubscribedCompanyTransactionsResponse = 'SubscribedCompanyTransactionsResponse';
    public static SubscribedCompaniesList = 'SubscribedCompaniesList';
    public static SubscribedCompaniesListResponse = 'SubscribedCompaniesListResponse';

    public SubscriptionsActions: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SubscriptionsActions.SubscribedCompanies),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.subscriptions.getSubScribedCompanies()),
            /**
             * Handles map functionality
             */
            map(response => this.SubscribedCompaniesResponse(response))));

    public SubscribedUserTransactions$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SubscriptionsActions.SubscribedUserTransactions),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.subscriptions.GetSubScribedUserTransaction(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.SubscribedUserTransactionsResponse(response))));

    public SubscribedCompanyTransactions$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SubscriptionsActions.SubscribedCompanyTransactions),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.subscriptions.GetSubScribedCompanyTransaction(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.SubscribedCompanyTransactionsResponse(response))));

    public SubscribedCompaniesList$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SubscriptionsActions.SubscribedCompaniesList),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.subscriptions.GetSubscribedCompaniesList(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.SubscribedCompaniesListResponse(response))));

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        public _router: Router,
        private actions$: Actions,
        private subscriptions: SubscriptionsService,
        public _toaster: ToasterService,
    ) {
    }

    /**
     * Handles SubscribedCompanies functionality
     */
    public SubscribedCompanies(): CustomActions {
        return {
            type: SubscriptionsActions.SubscribedCompanies
        };
    }

    /**
     * Handles SubscribedCompaniesResponse functionality
     */
    public SubscribedCompaniesResponse(resp: BaseResponse<any, any>): CustomActions {
        return {
            type: SubscriptionsActions.SubscribedCompaniesResponse,
            payload: resp
        };
    }

    /**
     * Handles SubscribedCompaniesList functionality
     */
    public SubscribedCompaniesList(subscription): CustomActions {
        return {
            type: SubscriptionsActions.SubscribedCompaniesList,
            payload: subscription
        };
    }

    /**
     * Handles SubscribedCompaniesListResponse functionality
     */
    public SubscribedCompaniesListResponse(resp: BaseResponse<any, any>): CustomActions {
        return {
            type: SubscriptionsActions.SubscribedCompaniesListResponse,
            payload: resp
        };
    }

    /**
     * Handles SubscribedUserTransactions functionality
     */
    public SubscribedUserTransactions(subscription): CustomActions {
        return {
            type: SubscriptionsActions.SubscribedUserTransactions,
            payload: subscription
        };
    }

    /**
     * Handles SubscribedUserTransactionsResponse functionality
     */
    public SubscribedUserTransactionsResponse(resp: BaseResponse<any, any>): CustomActions {
        return {
            type: SubscriptionsActions.SubscribedUserTransactionsResponse,
            payload: resp
        };
    }

    /**
     * Handles SubscribedCompanyTransactions functionality
     */
    public SubscribedCompanyTransactions(subscription, company): CustomActions {
        return {
            type: SubscriptionsActions.SubscribedCompanyTransactions,
            payload: { subscription, company }
        };
    }
    
    /**
     * Handles SubscribedCompanyTransactionsResponse functionality
     */
    public SubscribedCompanyTransactionsResponse(resp: BaseResponse<any, any>): CustomActions {
        return {
            type: SubscriptionsActions.SubscribedCompanyTransactionsResponse,
            payload: resp
        };
    }
}
