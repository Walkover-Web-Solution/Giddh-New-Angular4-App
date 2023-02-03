import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../services/toaster.service';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { TlPlService } from '../services/tl-pl.service';
import { AccountDetails, BalanceSheetRequest, GetCogsRequest, GetCogsResponse, ProfitLossRequest, TrialBalanceExportExcelRequest, TrialBalanceRequest } from '../models/api-models/tb-pl-bs';
import { CustomActions } from '../store/customActions';

@Injectable()
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
            ofType(TBPlBsActions.GET_TRIAL_BALANCE_REQUEST),
            switchMap((action: CustomActions) => {
                return this._tlPlService.GetTrailBalance(action.payload).pipe(
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
            ofType(TBPlBsActions.GET_V2_TRIAL_BALANCE_REQUEST),
            switchMap((action: CustomActions) => {
                return this._tlPlService.GetV2TrailBalance(action.payload).pipe(
                    map((r) => this.validateResponse<AccountDetails, TrialBalanceRequest>(r, {
                        type: TBPlBsActions.GET_V2_TRIAL_BALANCE_RESPONSE,
                        payload: r.body
                    }, true, {
                        type: TBPlBsActions.GET_V2_TRIAL_BALANCE_RESPONSE,
                        payload: null
                    })));
            })));

    private GetProfitLoss$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(TBPlBsActions.GET_PROFIT_LOSS_REQUEST),
            switchMap((action: CustomActions) => {
                return this._tlPlService.GetProfitLoss(action.payload).pipe(
                    map((r) => this.validateResponse<AccountDetails, ProfitLossRequest>(r, {
                        type: TBPlBsActions.GET_PROFIT_LOSS_RESPONSE,
                        payload: r.body
                    }, true, {
                        type: TBPlBsActions.GET_PROFIT_LOSS_RESPONSE,
                        payload: []
                    })));
            })));

    private GetCogs$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(TBPlBsActions.GET_COGS_REQUEST),
            switchMap((action: CustomActions) => {
                return this._tlPlService.GetCogs(action.payload).pipe(
                    map((r) => this.validateResponse<GetCogsResponse, GetCogsRequest>(r, {
                        type: TBPlBsActions.GET_COGS_RESPONSE,
                        payload: r.body
                    }, true, {
                        type: TBPlBsActions.GET_COGS_RESPONSE,
                        payload: r.body
                    })));
            })));

    private GetBalanceSheet$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(TBPlBsActions.GET_BALANCE_SHEET_REQUEST),
            switchMap((action: CustomActions) => {
                return this._tlPlService.GetBalanceSheet(action.payload).pipe(
                    map((r) => this.validateResponse<AccountDetails, BalanceSheetRequest>(r, {
                        type: TBPlBsActions.GET_BALANCE_SHEET_RESPONSE,
                        payload: r.body
                    }, true, {
                        type: TBPlBsActions.GET_BALANCE_SHEET_RESPONSE,
                        payload: []
                    })));
            })));

    private DownloadTrailBalanceExcel$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(TBPlBsActions.DOWNLOAD_TRIAL_BALANCE_EXCEL_REQUEST),
            switchMap((action: CustomActions) => {
                return this._tlPlService.DownloadTrialBalanceExcel(action.payload).pipe(
                    map((r) => ({ type: 'EmptyAction' })));
            })));

    private DownloadTBalanceSheetExcel$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(TBPlBsActions.DOWNLOAD_BALANCE_SHEET_EXCEL_REQUEST),
            switchMap((action: CustomActions) => {
                return this._tlPlService.DownloadBalanceSheetExcel(action.payload).pipe(
                    map((r) => ({ type: 'EmptyAction' })));
            })));

    private DownloadProfitLossExcel$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(TBPlBsActions.DOWNLOAD_PROFIT_LOSS_EXCEL_REQUEST),
            switchMap((action: CustomActions) => {
                return this._tlPlService.DownloadProfitLossExcel(action.payload).pipe(
                    map((r) => ({ type: 'EmptyAction' })));
            })));

    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private _tlPlService: TlPlService) {
    }

    public GetTrialBalance(request: TrialBalanceRequest): CustomActions {
        return {
            type: TBPlBsActions.GET_TRIAL_BALANCE_REQUEST,
            payload: request
        };
    }

    public GetV2TrialBalance(request: TrialBalanceRequest): CustomActions {
        return {
            type: TBPlBsActions.GET_V2_TRIAL_BALANCE_REQUEST,
            payload: request
        };
    }

    public DownloadTrialBalanceExcel(request: TrialBalanceExportExcelRequest): CustomActions {
        return {
            type: TBPlBsActions.DOWNLOAD_TRIAL_BALANCE_EXCEL_REQUEST,
            payload: request
        };
    }

    public DownloadProfitLossExcel(request: ProfitLossRequest): CustomActions {
        return {
            type: TBPlBsActions.DOWNLOAD_PROFIT_LOSS_EXCEL_REQUEST,
            payload: request
        };
    }

    public DownloadBalanceSheetExcel(request: ProfitLossRequest): CustomActions {
        return {
            type: TBPlBsActions.DOWNLOAD_BALANCE_SHEET_EXCEL_REQUEST,
            payload: request
        };
    }

    public GetProfitLoss(request: ProfitLossRequest): CustomActions {
        return {
            type: TBPlBsActions.GET_PROFIT_LOSS_REQUEST,
            payload: request
        };
    }

    public GetCogs(request: GetCogsRequest): CustomActions {
        return {
            type: TBPlBsActions.GET_COGS_REQUEST,
            payload: request
        };
    }

    public GetBalanceSheet(request: BalanceSheetRequest): CustomActions {
        return {
            type: TBPlBsActions.GET_BALANCE_SHEET_REQUEST,
            payload: request
        };
    }

    private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response?.status === 'error') {
            if (showToast) {
                this._toasty.errorToast(response.message);
            }
            return errorAction;
        }
        return successAction;
    }
}
