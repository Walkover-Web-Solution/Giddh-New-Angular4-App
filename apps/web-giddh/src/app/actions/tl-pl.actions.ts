import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../services/toaster.service';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { TlPlService } from '../services/tl-pl.service';
import { AccountDetails, BalanceSheetRequest, GetCogsRequest, GetCogsResponse, ProfitLossDateRangeResponse, ProfitLossRequest, TrialBalanceExportExcelRequest, TrialBalanceRequest } from '../models/api-models/tb-pl-bs';
import { CustomActions } from '../store/custom-actions';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * TBPlBsActions actions
 * Defines tbplbs related action creators for state management
 */
export class TBPlBsActions {

    public static readonly GET_TRIAL_BALANCE_REQUEST = 'GET_TRIAL_BALANCE_REQUEST';
    public static readonly GET_TRIAL_BALANCE_RESPONSE = 'GET_TRIAL_BALANCE_RESPONSE';

    public static readonly GET_V2_TRIAL_BALANCE_REQUEST = 'GET_V2_TRIAL_BALANCE_REQUEST';
    public static readonly GET_V2_TRIAL_BALANCE_RESPONSE = 'GET_V2_TRIAL_BALANCE_RESPONSE';

    public static readonly GET_PROFIT_LOSS_REQUEST = 'GET_PROFIT_LOSS_REQUEST';
    public static readonly GET_PROFIT_LOSS_RESPONSE = 'GET_PROFIT_LOSS_RESPONSE';

    public static readonly GET_COGS_REQUEST = 'GET_COGS_REQUEST';
    public static readonly GET_COGS_RESPONSE = 'GET_COGS_RESPONSE';

    public static readonly GET_BALANCE_SHEET_REQUEST = 'GET_BALANCE_SHEET_REQUEST';
    public static readonly GET_BALANCE_SHEET_RESPONSE = 'GET_BALANCE_SHEET_RESPONSE';

    public static readonly DOWNLOAD_TRIAL_BALANCE_EXCEL_REQUEST = 'DOWNLOAD_TRIAL_BALANCE_EXCEL_REQUEST';

    public static readonly DOWNLOAD_PROFIT_LOSS_EXCEL_REQUEST = 'DOWNLOAD_PROFIT_LOSS_EXCEL_REQUEST';

    public static readonly DOWNLOAD_BALANCE_SHEET_EXCEL_REQUEST = 'DOWNLOAD_BALANCE_SHEET_EXCEL_REQUEST';

    private GetTrialBalance$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(TBPlBsActions.GET_TRIAL_BALANCE_REQUEST),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._tlPlService.GetTrailBalance(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map((r) => this.validateResponse<AccountDetails, TrialBalanceRequest>(r, {
                        type: TBPlBsActions.GET_TRIAL_BALANCE_RESPONSE,
                        payload: r.body
                    }, true, {
                        type: TBPlBsActions.GET_TRIAL_BALANCE_RESPONSE,
                        payload: null
                    })));
            })));

    private GetV2TrialBalance$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(TBPlBsActions.GET_V2_TRIAL_BALANCE_REQUEST),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._tlPlService.GetV2TrailBalance(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map((r) => this.validateResponse<AccountDetails, TrialBalanceRequest>(r, {
                        type: TBPlBsActions.GET_V2_TRIAL_BALANCE_RESPONSE,
                        payload: r?.body
                    }, true, {
                        type: TBPlBsActions.GET_V2_TRIAL_BALANCE_RESPONSE,
                        payload: null
                    })));
            })));

    private GetProfitLoss$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(TBPlBsActions.GET_PROFIT_LOSS_REQUEST),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._tlPlService.getComparedProfitLoss(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map((r) => this.validateResponse<AccountDetails, ProfitLossRequest>(r, {
                        type: TBPlBsActions.GET_PROFIT_LOSS_RESPONSE,
                        payload: r?.body
                    }, true, {
                        type: TBPlBsActions.GET_PROFIT_LOSS_RESPONSE,
                        payload: []
                    })));
            })));

    private GetCogs$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(TBPlBsActions.GET_COGS_REQUEST),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._tlPlService.GetCogs(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map((r) => this.validateResponse<GetCogsResponse, GetCogsRequest>(r, {
                        type: TBPlBsActions.GET_COGS_RESPONSE,
                        payload: r?.body
                    }, true, {
                        type: TBPlBsActions.GET_COGS_RESPONSE,
                        payload: r?.body
                    })));
            })));

    private GetBalanceSheet$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(TBPlBsActions.GET_BALANCE_SHEET_REQUEST),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._tlPlService.GetBalanceSheet(action?.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map((r) => this.validateResponse<AccountDetails, BalanceSheetRequest>(r, {
                        type: TBPlBsActions.GET_BALANCE_SHEET_RESPONSE,
                        payload: r?.body
                    }, true, {
                        type: TBPlBsActions.GET_BALANCE_SHEET_RESPONSE,
                        payload: []
                    })));
            })));

    private DownloadTrailBalanceExcel$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(TBPlBsActions.DOWNLOAD_TRIAL_BALANCE_EXCEL_REQUEST),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._tlPlService.DownloadTrialBalanceExcel(action?.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map((r) => ({ type: 'EmptyAction' })));
            })));

    private DownloadTBalanceSheetExcel$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(TBPlBsActions.DOWNLOAD_BALANCE_SHEET_EXCEL_REQUEST),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._tlPlService.DownloadBalanceSheetExcel(action?.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map((r) => ({ type: 'EmptyAction' })));
            })));

    private DownloadProfitLossExcel$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(TBPlBsActions.DOWNLOAD_PROFIT_LOSS_EXCEL_REQUEST),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._tlPlService.DownloadProfitLossExcel(action?.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map((r) => ({ type: 'EmptyAction' })));
            })));

    /**
     * Creates an instance of actions
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private _tlPlService: TlPlService) {
    }

    /**
     * Handles GetTrialBalance functionality
     */
    public GetTrialBalance(request: TrialBalanceRequest): CustomActions {
        return {
            type: TBPlBsActions.GET_TRIAL_BALANCE_REQUEST,
            payload: request
        };
    }

    /**
     * Handles GetV2TrialBalance functionality
     */
    public GetV2TrialBalance(request: TrialBalanceRequest): CustomActions {
        return {
            type: TBPlBsActions.GET_V2_TRIAL_BALANCE_REQUEST,
            payload: request
        };
    }

    /**
     * Handles DownloadTrialBalanceExcel functionality
     */
    public DownloadTrialBalanceExcel(request: TrialBalanceExportExcelRequest): CustomActions {
        return {
            type: TBPlBsActions.DOWNLOAD_TRIAL_BALANCE_EXCEL_REQUEST,
            payload: request
        };
    }

    /**
     * Handles DownloadProfitLossExcel functionality
     */
    public DownloadProfitLossExcel(request: ProfitLossRequest): CustomActions {
        return {
            type: TBPlBsActions.DOWNLOAD_PROFIT_LOSS_EXCEL_REQUEST,
            payload: request
        };
    }

    /**
     * Handles DownloadBalanceSheetExcel functionality
     */
    public DownloadBalanceSheetExcel(request: ProfitLossRequest): CustomActions {
        return {
            type: TBPlBsActions.DOWNLOAD_BALANCE_SHEET_EXCEL_REQUEST,
            payload: request
        };
    }

    /**
     * Handles GetProfitLoss functionality
     */
    public GetProfitLoss(request: ProfitLossRequest): CustomActions {
        return {
            type: TBPlBsActions.GET_PROFIT_LOSS_REQUEST,
            payload: request
        };
    }

    /**
     * Handles GetCogs functionality
     */
    public GetCogs(request: GetCogsRequest): CustomActions {
        return {
            type: TBPlBsActions.GET_COGS_REQUEST,
            payload: request
        };
    }

    /**
     * Handles GetBalanceSheet functionality
     */
    public GetBalanceSheet(request: BalanceSheetRequest): CustomActions {
        return {
            type: TBPlBsActions.GET_BALANCE_SHEET_REQUEST,
            payload: request
        };
    }

    private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        /**
         * Handles if functionality
         */
        if (response?.status === 'error') {
            /**
             * Handles if functionality
             */
            if (showToast) {
                this._toasty.errorToast(response.message);
            }
            return errorAction;
        }
        return successAction;
    }
}
