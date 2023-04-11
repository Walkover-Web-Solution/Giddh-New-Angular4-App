import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { HOME } from './home.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ToasterService } from '../../services/toaster.service';
import { DashboardService } from '../../services/dashboard.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BankAccountsResponse, GraphTypesResponse } from '../../models/api-models/Dashboard';
import { CustomActions } from '../../store/custom-actions';

@Injectable()

export class HomeActions {

    public GetRatioAnalysis$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(HOME.GET_RATIO_ANALYSIS),
            switchMap((action: CustomActions) => {
                return this._dashboardService.GetRationAnalysis(action.payload.date, action.payload.refresh);
            }), map((res) => this.validateResponse<BankAccountsResponse[], string>(res, {
                type: HOME.GET_RATIO_ANALYSIS_RESPONSE,
                payload: res
            }, true, {
                type: HOME.GET_RATIO_ANALYSIS_RESPONSE,
                payload: res
            }))));

    public getRevenueGraphTypes$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(HOME.GET_REVENUE_GRAPH_TYPES),
            switchMap((action: CustomActions) => this._dashboardService.GetRevenueGraphTypes()),
            map(response => this.getRevenueGraphTypesResponse(response))));

    constructor(private action$: Actions, private _toasty: ToasterService, private _dashboardService: DashboardService) {

    }

    public ResetHomeState(): CustomActions {
        return {
            type: HOME.RESET_HOME_STATE
        };
    }

    public getRatioAnalysis(date: string, refresh: boolean) {
        return {
            type: HOME.GET_RATIO_ANALYSIS,
            payload: { date, refresh }
        };
    }

    public getRatioAnalysisResponse(res) {
        return {
            type: HOME.GET_RATIO_ANALYSIS_RESPONSE,
            payload: res
        };
    }

    private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response && response.status === 'error') {
            if (showToast) {
                this._toasty.errorToast(response.message);
            }
            return errorAction;
        }
        return successAction;
    }

    public getRevenueGraphTypes(): CustomActions {
        return {
            type: HOME.GET_REVENUE_GRAPH_TYPES,
            payload: null
        };
    }

    public getRevenueGraphTypesResponse(value: BaseResponse<GraphTypesResponse, any>): CustomActions {
        return {
            type: HOME.GET_REVENUE_GRAPH_TYPES_RESPONSE,
            payload: value
        };
    }
}
