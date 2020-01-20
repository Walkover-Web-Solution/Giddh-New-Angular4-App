import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppState } from '../store/roots';
import { Actions, Effect } from '@ngrx/effects';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { CustomActions } from '../store/customActions';
import {
	AgingAdvanceSearchModal,
	DueAmountReportQueryRequest,
	DueAmountReportRequest,
	DueAmountReportResponse,
	DueRangeRequest
} from '../models/api-models/Contact';
import { GeneralService } from '../services/general.service';
import { ToasterService } from '../services/toaster.service';
import { AgingreportingService } from '../services/agingreporting.service';

@Injectable()
export class AgingReportActions {
	public static DUE_DAY_RANGE_POPUP_OPEN = 'DUE_DAY_RANGE_POPUP_OPEN';
	public static DUE_DAY_RANGE_POPUP_CLOSE = 'DUE_DAY_RANGE_POPUP_CLOSE';
	public static CREATE_DUE_DAY_RANGE = 'CREATE_DUE_DAY_RANGE';
	public static CREATE_DUE_DAY_RANGE_RESPONSE = 'CREATE_DUE_DAY_RANGE_RESPONSE';

	public static GET_DUE_DAY_RANGE = 'GET_DUE_DAY_RANGE';
	public static GET_DUE_DAY_RANGE_RESPONSE = 'GET_DUE_DAY_RANGE_RESPONSE';

	public static GET_DUE_DAY_REPORT = 'GET_DUE_DAY_REPORT';
	public static GET_DUE_DAY_REPORT_RESPONSE = 'GET_DUE_DAY_REPORT_RESPONSE';

	@Effect()
	public createDueRange$: Observable<Action> = this.action$
		.ofType(AgingReportActions.CREATE_DUE_DAY_RANGE).pipe(
			switchMap((action: CustomActions) => this._agingReportService.CreateDueDaysRange(action.payload)),
			map(response => this.CreateDueRangeResponse(response)));

	@Effect()
	public createDueRangeResponse$: Observable<Action> = this.action$
		.ofType(AgingReportActions.CREATE_DUE_DAY_RANGE_RESPONSE).pipe(
			map((action: CustomActions) => {
				let response = action.payload as BaseResponse<string, DueRangeRequest>;
				if (response.status === 'error') {
					this._toasty.errorToast(response.message, response.code);
					return { type: 'EmptyAction' };
				}
				this._toasty.successToast('Due date range created successfully', 'Success');
				// set newly created company as active company
				return { type: 'EmptyAction' };
				// check if new uer has created first company then set newUserLoggedIn false
			}));

	@Effect()
	public getDueRange$: Observable<Action> = this.action$
		.ofType(AgingReportActions.GET_DUE_DAY_RANGE).pipe(
			switchMap((action: CustomActions) => this._agingReportService.GetDueDaysRange()),
			map(response => this.GetDueRangeResponse(response)));

	@Effect()
	public getDueRangeResponse$: Observable<Action> = this.action$
		.ofType(AgingReportActions.GET_DUE_DAY_RANGE_RESPONSE).pipe(
			map((action: CustomActions) => {
				let response = action.payload as BaseResponse<string[], string>;
				if (response.status === 'error') {
					this._toasty.errorToast(response.message, response.code);
					return { type: 'EmptyAction' };
				}
				// this._toasty.successToast('Due date range created successfully', 'Success');
				// set newly created company as active company
				return { type: 'EmptyAction' };
				// check if new uer has created first company then set newUserLoggedIn false
			}));

	@Effect() private getDueReport$: Observable<Action> = this.action$
		.ofType(AgingReportActions.GET_DUE_DAY_REPORT).pipe(
			switchMap((action: CustomActions) => {
				return this._agingReportService.GetDueAmountReport(action.payload.model, action.payload.queryRequest).pipe(
					map((r) => this.validateResponse<DueAmountReportResponse, DueAmountReportRequest>(r, {
						type: AgingReportActions.GET_DUE_DAY_REPORT_RESPONSE,
						payload: r.body
					}, true, {
						type: AgingReportActions.GET_DUE_DAY_REPORT_RESPONSE,
						payload: null
					})));
			}));

	constructor(
		private action$: Actions,
		private _agingReportService: AgingreportingService,
		private _toasty: ToasterService,
		private store: Store<AppState>,
		private _generalService: GeneralService
	) {
	}

	public CreateDueRange(value: DueRangeRequest): CustomActions {
		return {
			type: AgingReportActions.CREATE_DUE_DAY_RANGE,
			payload: value
		};
	}

	public CreateDueRangeResponse(value: BaseResponse<string, DueRangeRequest>): CustomActions {
		return {
			type: AgingReportActions.CREATE_DUE_DAY_RANGE_RESPONSE,
			payload: value
		};
	}

	public GetDueRange(): CustomActions {
		return {
			type: AgingReportActions.GET_DUE_DAY_RANGE,
			payload: null
		};
	}

	public GetDueRangeResponse(value: BaseResponse<string[], string>): CustomActions {
		return {
			type: AgingReportActions.GET_DUE_DAY_RANGE_RESPONSE,
			payload: value
		};
	}

	public GetDueReport(model: AgingAdvanceSearchModal, queryRequest: DueAmountReportQueryRequest): CustomActions {
		return {
			type: AgingReportActions.GET_DUE_DAY_REPORT,
			payload: { model, queryRequest }
		};
	}

	public GetDueReportResponse(value: BaseResponse<string[], string>): CustomActions {
		return {
			type: AgingReportActions.GET_DUE_DAY_REPORT_RESPONSE,
			payload: value
		};
	}

	public OpenDueRange(): CustomActions {
		return {
			type: AgingReportActions.DUE_DAY_RANGE_POPUP_OPEN,
			payload: null
		};
	}

	public CloseDueRange(): CustomActions {
		return {
			type: AgingReportActions.DUE_DAY_RANGE_POPUP_CLOSE,
			payload: null
		};
	}

	private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
		if (response.status === 'error') {
			if (showToast) {
				this._toasty.errorToast(response.message);
			}
			return errorAction;
		}
		return successAction;
	}
}
