import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ManufacturingService } from '../../services/manufacturing.service';
import { MANUFACTURING_ACTIONS } from './manufacturing.const';
import { ICommonResponseOfManufactureItem, IMfStockSearchRequest } from '../../models/interfaces/manufacturing.interface';
import { ToasterService } from '../../services/toaster.service';
import { Router } from '@angular/router';
import { CustomActions } from '../../store/customActions';

@Injectable()
export class ManufacturingActions {
	// GET_ALL MF Report
	@Effect()
	private GetMfReport$: Observable<Action> = this.action$
		.ofType(MANUFACTURING_ACTIONS.MF_REPORT).pipe(
			switchMap((action: CustomActions) => this._manufacturingService.GetMfReport(action.payload)),
			map(response => {
				return this.GetMfReportResponse(response);
			}));

	@Effect()
	private GetMfReportResponse$: Observable<Action> = this.action$
		.ofType(MANUFACTURING_ACTIONS.MF_REPORT_RESPONSE).pipe(
			map((response: CustomActions) => {
				let data: BaseResponse<ICommonResponseOfManufactureItem, ICommonResponseOfManufactureItem> = response.payload;
				if (data.status === 'error') {
					this._toasty.errorToast(data.message, data.code);
				}
				return { type: 'EmptyAction' };
			}));

	// GET_ALL STOCK WITH RATE
	@Effect()
	private GetStockWithRate$: Observable<Action> = this.action$
		.ofType(MANUFACTURING_ACTIONS.GET_STOCK_WITH_RATE).pipe(
			switchMap((action: CustomActions) => this._manufacturingService.GetStockWithRate(action.payload)),
			map(response => {
				return this.GetStockWithRateResponse(response);
			}));

	@Effect()
	private GetStockWithRateResponse$: Observable<Action> = this.action$
		.ofType(MANUFACTURING_ACTIONS.GET_STOCK_WITH_RATE_RESPONSE).pipe(
			map((response: CustomActions) => {
				let data: BaseResponse<ICommonResponseOfManufactureItem, ICommonResponseOfManufactureItem> = response.payload;
				if (data.status === 'error') {
					this._toasty.errorToast(data.message, data.code);
				}
				return { type: 'EmptyAction' };
			}));

	// GET_ALL MANUFACTURING ITEM DETAIL
	@Effect()
	private GetMFItemDetail$: Observable<Action> = this.action$
		.ofType(MANUFACTURING_ACTIONS.GET_MF_ITEM_DETAILS).pipe(
			switchMap((action: CustomActions) => this._manufacturingService.GetManufacturingItem(action.payload)),
			map(response => {
				return this.GetMfItemDetailsResponse(response);
			}));

	@Effect()
	private GetMFItemDetailResponse$: Observable<Action> = this.action$
		.ofType(MANUFACTURING_ACTIONS.GET_MF_ITEM_DETAILS_RESPONSE).pipe(
			map(response => {
				return { type: 'EmptyAction' };
			}));

	// CREATE MANUFACTURING ITEM
	@Effect()
	private CreateMFItem$: Observable<Action> = this.action$
		.ofType(MANUFACTURING_ACTIONS.CREATE_MF_ITEM).pipe(
			switchMap((action: CustomActions) => {
				return this._manufacturingService.CreateManufacturingItem(action.payload, action.payload.stockUniqueName).pipe(
					map(response => this.CreateMfItemResponse(response)));
			}));

	@Effect()
	private CreateMFItemResponse$: Observable<Action> = this.action$
		.ofType(MANUFACTURING_ACTIONS.CREATE_MF_ITEM_RESPONSE).pipe(
			map((response: CustomActions) => {
				let data: BaseResponse<ICommonResponseOfManufactureItem, ICommonResponseOfManufactureItem> = response.payload;
				if (data.status === 'error') {
					this._toasty.errorToast(data.message, data.code);
				} else {
					this._toasty.successToast('Manufacturing Entry Created Successfully');
					this._router.navigate(['/pages', 'manufacturing', 'report']);
				}
				return { type: 'EmptyAction' };
			}));

	// UPDATE MANUFACTURING ITEM
	@Effect()
	private UpdateMFItem$: Observable<Action> = this.action$
		.ofType(MANUFACTURING_ACTIONS.UPDATE_MF_ITEM).pipe(
			switchMap((action: CustomActions) => {
				return this._manufacturingService.UpdateManufacturingItem(action.payload, { stockUniqueName: action.payload.stockUniqueName, manufacturingUniqueName: action.payload.uniqueName }).pipe(
					map(response => this.UpdateMfItemResponse(response)));
			}));

	@Effect()
	private UpdateMFItemResponse$: Observable<Action> = this.action$
		.ofType(MANUFACTURING_ACTIONS.UPDATE_MF_ITEM_RESPONSE).pipe(
			map((response: CustomActions) => {
				let data: BaseResponse<ICommonResponseOfManufactureItem, ICommonResponseOfManufactureItem> = response.payload;
				if (data.status === 'error') {
					this._toasty.errorToast(data.message, data.code);
				} else {
					this._toasty.successToast('Manufacturing Entry Updated Successfully');
					this._router.navigate(['/pages', 'manufacturing', 'report']);
				}
				return { type: 'EmptyAction' };
			}));

	// DELETE MANUFACTURING ITEM
	@Effect()
	private DeleteMFItem$: Observable<Action> = this.action$
		.ofType(MANUFACTURING_ACTIONS.DELETE_MF_ITEM).pipe(
			switchMap((action: CustomActions) => {
				return this._manufacturingService.DeleteManufacturingItem(action.payload).pipe( // Check here the parameter
					map(response => this.DeleteMfItemResponse(response)));
			}));

	@Effect()
	private DeleteMFItemResponse$: Observable<Action> = this.action$
		.ofType(MANUFACTURING_ACTIONS.DELETE_MF_ITEM_RESPONSE).pipe(
			map((response: CustomActions) => {
				let data: BaseResponse<ICommonResponseOfManufactureItem, ICommonResponseOfManufactureItem> = response.payload;
				if (data.status === 'error') {
					this._toasty.errorToast(data.message, data.code);
				} else {
					this._toasty.successToast('Manufacturing Entry Deleted Successfully');
					this._router.navigate(['/pages', 'manufacturing', 'report']);
				}
				return { type: 'EmptyAction' };
			}));

	constructor(
		private action$: Actions,
		private _manufacturingService: ManufacturingService,
		private _toasty: ToasterService,
		private _router: Router
	) {
	}

	public GetStockWithRate(value: string): CustomActions {
		return {
			type: MANUFACTURING_ACTIONS.GET_STOCK_WITH_RATE,
			payload: { stockUniqueName: value }
		};
	}

	public GetStockWithRateResponse(value: BaseResponse<ICommonResponseOfManufactureItem, string>): CustomActions {
		return {
			type: MANUFACTURING_ACTIONS.GET_STOCK_WITH_RATE_RESPONSE,
			payload: value
		};
	}

	public GetMfReport(value: IMfStockSearchRequest): CustomActions {
		return {
			type: MANUFACTURING_ACTIONS.MF_REPORT,
			payload: value
		};
	}

	public GetMfReportResponse(value): CustomActions {
		return {
			type: MANUFACTURING_ACTIONS.MF_REPORT_RESPONSE,
			payload: value
		};
	}

	public GetMfItemDetails(): CustomActions {
		return {
			type: MANUFACTURING_ACTIONS.GET_MF_ITEM_DETAILS
		};
	}

	public GetMfItemDetailsResponse(value): CustomActions {
		return {
			type: MANUFACTURING_ACTIONS.GET_MF_ITEM_DETAILS_RESPONSE,
			payload: value
		};
	}

	public CreateMfItem(value): CustomActions {
		return {
			type: MANUFACTURING_ACTIONS.CREATE_MF_ITEM,
			payload: value
		};
	}

	public CreateMfItemResponse(value): CustomActions {
		return {
			type: MANUFACTURING_ACTIONS.CREATE_MF_ITEM_RESPONSE,
			payload: value
		};
	}

	public UpdateMfItem(value): CustomActions {
		return {
			type: MANUFACTURING_ACTIONS.UPDATE_MF_ITEM,
			payload: value
		};
	}

	public UpdateMfItemResponse(value): CustomActions {
		return {
			type: MANUFACTURING_ACTIONS.UPDATE_MF_ITEM_RESPONSE,
			payload: value
		};
	}

	public DeleteMfItem(value): CustomActions {
		return {
			type: MANUFACTURING_ACTIONS.DELETE_MF_ITEM,
			payload: value
		};
	}

	public DeleteMfItemResponse(value): CustomActions {
		return {
			type: MANUFACTURING_ACTIONS.DELETE_MF_ITEM_RESPONSE,
			payload: value
		};
	}

	public SetMFItemUniqueNameInStore(value: string): CustomActions {
		return {
			type: MANUFACTURING_ACTIONS.SET_MF_ITEM_UNIQUENAME_IN_STORE,
			payload: value
		};
	}

	public RemoveMFItemUniqueNameFomStore(): CustomActions {
		return {
			type: MANUFACTURING_ACTIONS.REMOVE_MF_ITEM_UNIQUENAME_FROM_STORE
		};
	}
}
