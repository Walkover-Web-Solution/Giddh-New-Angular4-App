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

@Injectable()
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
            ofType(SubscriptionsActions.SubscribedCompanies),
            switchMap((action: CustomActions) => this.subscriptions.getSubScribedCompanies()),
            map(response => this.SubscribedCompaniesResponse(response))));

    public SubscribedUserTransactions$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(SubscriptionsActions.SubscribedUserTransactions),
            switchMap((action: CustomActions) => this.subscriptions.GetSubScribedUserTransaction(action.payload)),
            map(response => this.SubscribedUserTransactionsResponse(response))));

    public SubscribedCompanyTransactions$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(SubscriptionsActions.SubscribedCompanyTransactions),
            switchMap((action: CustomActions) => this.subscriptions.GetSubScribedCompanyTransaction(action.payload)),
            map(response => this.SubscribedCompanyTransactionsResponse(response))));

    public SubscribedCompaniesList$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(SubscriptionsActions.SubscribedCompaniesList),
            switchMap((action: CustomActions) => this.subscriptions.GetSubscribedCompaniesList(action.payload)),
            map(response => this.SubscribedCompaniesListResponse(response))));

    constructor(
        public _router: Router,
        private actions$: Actions,
        private subscriptions: SubscriptionsService,
        public _toaster: ToasterService,
    ) {
    }

    public SubscribedCompanies(): CustomActions {
        return {
            type: SubscriptionsActions.SubscribedCompanies
        };
    }

    public SubscribedCompaniesResponse(resp: BaseResponse<any, any>): CustomActions {
        return {
            type: SubscriptionsActions.SubscribedCompaniesResponse,
            payload: resp
        };
    }

    public SubscribedCompaniesList(subscription): CustomActions {
        return {
            type: SubscriptionsActions.SubscribedCompaniesList,
            payload: subscription
        };
    }

    public SubscribedCompaniesListResponse(resp: BaseResponse<any, any>): CustomActions {
        return {
            type: SubscriptionsActions.SubscribedCompaniesListResponse,
            payload: resp
        };
    }

    public SubscribedUserTransactions(subscription): CustomActions {
        return {
            type: SubscriptionsActions.SubscribedUserTransactions,
            payload: subscription
        };
    }

    public SubscribedUserTransactionsResponse(resp: BaseResponse<any, any>): CustomActions {
        return {
            type: SubscriptionsActions.SubscribedUserTransactionsResponse,
            payload: resp
        };
    }

    public SubscribedCompanyTransactions(subscription, company): CustomActions {
        return {
            type: SubscriptionsActions.SubscribedCompanyTransactions,
            payload: { subscription, company }
        };
    }
    
    public SubscribedCompanyTransactionsResponse(resp: BaseResponse<any, any>): CustomActions {
        return {
            type: SubscriptionsActions.SubscribedCompanyTransactionsResponse,
            payload: resp
        };
    }
}
