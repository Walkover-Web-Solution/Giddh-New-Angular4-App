import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ProformaService } from '../../services/proforma.service';
import { CustomActions } from '../../store/customActions';
import { PROFORMA_ACTIONS } from './proforma.const';
import { ActionTypeAfterVoucherGenerateOrUpdate, GenericRequestForGenerateSCD } from '../../models/api-models/Sales';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { InvoiceReceiptFilter } from '../../models/api-models/recipt';
import { ProformaFilter, ProformaGetAllVersionRequest, ProformaGetAllVersionsResponse, ProformaGetRequest, ProformaResponse, ProformaUpdateActionRequest } from '../../models/api-models/proforma';

@Injectable()
export class ProformaActions {

	@Effect()
	private GENERATE_PROFORMA$: Observable<Action> =
		this.action$.pipe(
			ofType(PROFORMA_ACTIONS.GENERATE_PROFORMA_REQUEST),
			switchMap((action: CustomActions) => this.proformaService.generate(action.payload)),
			map((response) => {
				if (response.status === 'success') {
					let no: string;
					switch (response.request.voucher.voucherDetails.voucherType) {
						case 'proformas':
							no = response.body.number;
							break;
						case 'estimates':
							no = response.body.number;
							break;
						default:
							no = response.body.voucher.voucherDetails.voucherNumber;
					}
					this._toasty.successToast(`Entry created successfully with Voucher No: ${no}`);
				} else {
					this._toasty.errorToast(response.message, response.code);
				}
				return this.generateProformaResponse(response);
			})
		);

	@Effect()
	private GET_ALL$: Observable<Action> =
		this.action$.pipe(
			ofType(PROFORMA_ACTIONS.GET_ALL_PROFORMA_REQUEST),
			switchMap((action: CustomActions) => this.proformaService.getAll(action.payload.request, action.payload.voucherType)),
			map((response) => {
				if (response.status !== 'success') {
					this._toasty.errorToast(response.message, response.code);
				}
				return this.getAllResponse(response);
			})
		);

	@Effect()
	private GET_DETAILS$: Observable<Action> =
		this.action$.pipe(
			ofType(PROFORMA_ACTIONS.GET_PROFORMA_DETAILS_REQUEST),
			switchMap((action: CustomActions) => this.proformaService.get(action.payload.request, action.payload.voucherType)),
			map((response) => {
				if (response.status !== 'success') {
					this._toasty.errorToast(response.message, response.code);
				}
				return this.getProformaDetailsResponse(response);
			})
		);

	@Effect()
	private UPDATE_PROFORMA$: Observable<Action> =
		this.action$.pipe(
			ofType(PROFORMA_ACTIONS.UPDATE_PROFORMA_REQUEST),
			switchMap((action: CustomActions) => this.proformaService.update(action.payload)),
			map((response) => {
				if (response.status === 'success') {
					this._toasty.successToast(`Voucher updated Successfully`);
				} else {
					this._toasty.errorToast(response.message, response.code);
				}
				return this.updateProformaResponse(response);
			})
		);

	@Effect()
	private DELETE_PROFORMA$: Observable<Action> =
		this.action$.pipe(
			ofType(PROFORMA_ACTIONS.DELETE_PROFORMA_REQUEST),
			switchMap((action: CustomActions) => this.proformaService.delete(action.payload.request, action.payload.voucherType)),
			map((response) => {
				if (response.status === 'success') {
					this._toasty.successToast(`Voucher Deleted Successfully`);
				} else {
					this._toasty.errorToast(response.message, response.code);
				}
				return this.deleteProformaResponse(response);
			})
		);

	@Effect()
	private UPDATE_PROFORMA_ACTION$: Observable<Action> =
		this.action$.pipe(
			ofType(PROFORMA_ACTIONS.UPDATE_PROFORMA_ACTION),
			switchMap((action: CustomActions) => this.proformaService.updateAction(action.payload.request, action.payload.voucherType)),
			map((response) => {
				if (response.status === 'success') {
					this._toasty.successToast(`Status updated Successfully`);
				} else {
					this._toasty.errorToast(response.message, response.code);
				}
				return this.updateProformaActionResponse(response);
			})
		);

	@Effect()
	private GET_ESTIMATE_VERSIONS$: Observable<Action> =
		this.action$.pipe(
			ofType(PROFORMA_ACTIONS.GET_ESTIMATE_VERSIONS),
			switchMap((action: CustomActions) => this.proformaService.getAllVersions(action.payload.request, action.payload.voucherType)),
			map((response) => {
				if (response.status === 'error') {
					this._toasty.errorToast(response.message, response.code);
				}
				return this.getEstimateVersionResponse(response);
			})
		);

	@Effect()
	private GENERATE_INVOICE$: Observable<Action> =
		this.action$.pipe(
			ofType(PROFORMA_ACTIONS.GENERATE_INVOICE_FROM_PROFORMA_OR_ESTIMATES),
			switchMap((action: CustomActions) => this.proformaService.generateInvoice(action.payload.request, action.payload.voucherType)),
			map((response) => {
				if (response.status === 'error') {
					this._toasty.errorToast(response.message, response.code);
				}
				return this.generateInvoiceResponse(response);
			})
		);

	@Effect()
	private GENERATE_PROFORMA_FROM_ESTIMATES$: Observable<Action> =
		this.action$.pipe(
			ofType(PROFORMA_ACTIONS.GENERATE_PROFORMA_FROM_ESTIMATE),
			switchMap((action: CustomActions) => this.proformaService.generateProforma(action.payload.request, action.payload.voucherType)),
			map((response) => {
				if (response.status === 'error') {
					this._toasty.errorToast(response.message, response.code);
				} else {
					this._toasty.successToast('Proforma Generated Successfully');
				}
				return this.generateProformaFromEstimateResponse(response);
			})
		);

	@Effect()
	private SEND_EMAIL$: Observable<Action> =
		this.action$.pipe(
			ofType(PROFORMA_ACTIONS.SEND_EMAIL),
			switchMap((action: CustomActions) => this.proformaService.sendEmail(action.payload.request, action.payload.voucherType)),
			map((response) => {
				if (response.status === 'error') {
					this._toasty.errorToast(response.message, response.code);
				} else {
					this._toasty.successToast(response.body);
				}
				return this.sendMailResponse(response);
			})
		);

	constructor(private action$: Actions, private _toasty: ToasterService, private store: Store<AppState>,
		private proformaService: ProformaService) {

	}

	// region generate proforma
	public generateProforma(request: GenericRequestForGenerateSCD): CustomActions {
		return {
			type: PROFORMA_ACTIONS.GENERATE_PROFORMA_REQUEST,
			payload: request
		}
	}

	public generateProformaResponse(response: BaseResponse<GenericRequestForGenerateSCD, GenericRequestForGenerateSCD>): CustomActions {
		return {
			type: PROFORMA_ACTIONS.GENERATE_PROFORMA_RESPONSE,
			payload: response
		}
	}

	// endregion

	// region get all proforma
	public getAll(request: ProformaFilter, voucherType: string): CustomActions {
		return {
			type: PROFORMA_ACTIONS.GET_ALL_PROFORMA_REQUEST,
			payload: { request, voucherType }
		}
	}

	public getAllResponse(response: BaseResponse<ProformaResponse, ProformaFilter>): CustomActions {
		return {
			type: PROFORMA_ACTIONS.GET_ALL_PROFORMA_RESPONSE,
			payload: response
		}
	}

	// endregion

	// region get proforma details
	public getProformaDetails(request: ProformaGetRequest, voucherType: string): CustomActions {
		return {
			type: PROFORMA_ACTIONS.GET_PROFORMA_DETAILS_REQUEST,
			payload: { request, voucherType }
		}
	}

	public getProformaDetailsResponse(response: BaseResponse<GenericRequestForGenerateSCD, ProformaGetRequest>): CustomActions {
		return {
			type: PROFORMA_ACTIONS.GET_PROFORMA_DETAILS_RESPONSE,
			payload: response
		}
	}

	// endregion

	// region update proforma
	public updateProforma(request: GenericRequestForGenerateSCD): CustomActions {
		return {
			type: PROFORMA_ACTIONS.UPDATE_PROFORMA_REQUEST,
			payload: request
		}
	}

	public updateProformaResponse(response: BaseResponse<GenericRequestForGenerateSCD, GenericRequestForGenerateSCD>): CustomActions {
		return {
			type: PROFORMA_ACTIONS.UPDATE_PROFORMA_RESPONSE,
			payload: response
		}
	}

	// endregion

	// region delete proforma
	public deleteProforma(request: ProformaGetRequest, voucherType: string): CustomActions {
		return {
			type: PROFORMA_ACTIONS.DELETE_PROFORMA_REQUEST,
			payload: { request, voucherType }
		}
	}

	public deleteProformaResponse(response: BaseResponse<string, ProformaGetRequest>): CustomActions {
		return {
			type: PROFORMA_ACTIONS.DELETE_PROFORMA_RESPONSE,
			payload: response
		}
	}

	// endregion

	// region update proforma action
	public updateProformaAction(request: ProformaUpdateActionRequest, voucherType: string): CustomActions {
		return {
			type: PROFORMA_ACTIONS.UPDATE_PROFORMA_ACTION,
			payload: { request, voucherType }
		}
	}

	public updateProformaActionResponse(response: BaseResponse<string, ProformaUpdateActionRequest>): CustomActions {
		return {
			type: PROFORMA_ACTIONS.UPDATE_PROFORMA_ACTION_RESPONSE,
			payload: response
		}
	}

	// endregion

	// region get estimates version
	public getEstimateVersion(request: ProformaGetAllVersionRequest, voucherType: string): CustomActions {
		return {
			type: PROFORMA_ACTIONS.GET_ESTIMATE_VERSIONS,
			payload: { request, voucherType }
		}
	}

	public getEstimateVersionResponse(response: BaseResponse<ProformaGetAllVersionsResponse, ProformaGetAllVersionRequest>): CustomActions {
		return {
			type: PROFORMA_ACTIONS.GET_ESTIMATE_VERSIONS_RESPONSE,
			payload: response
		}
	}

	// endregion

	// region generate proforma from estimate
	public generateProformaFromEstimate(request: ProformaGetAllVersionRequest, voucherType: string): CustomActions {
		return {
			type: PROFORMA_ACTIONS.GENERATE_PROFORMA_FROM_ESTIMATE,
			payload: { request, voucherType }
		}
	}

	public generateProformaFromEstimateResponse(response: BaseResponse<string, ProformaGetAllVersionRequest>): CustomActions {
		return {
			type: PROFORMA_ACTIONS.GENERATE_PROFORMA_FROM_ESTIMATE_RESPONSE,
			payload: response
		}
	}

	// endregion

	// region generate invoice from proforma or estimates
	public generateInvoice(request: ProformaGetAllVersionRequest, voucherType: string): CustomActions {
		return {
			type: PROFORMA_ACTIONS.GENERATE_INVOICE_FROM_PROFORMA_OR_ESTIMATES,
			payload: { request, voucherType }
		}
	}

	public generateInvoiceResponse(response: BaseResponse<string, ProformaGetAllVersionRequest>): CustomActions {
		return {
			type: PROFORMA_ACTIONS.GENERATE_INVOICE_FROM_PROFORMA_OR_ESTIMATES_RESPONSE,
			payload: response
		}
	}

	// endregion

	// region send mail
	public sendMail(request: ProformaGetRequest, voucherType: string): CustomActions {
		return {
			type: PROFORMA_ACTIONS.SEND_EMAIL,
			payload: { request, voucherType }
		}
	}

	public sendMailResponse(response: BaseResponse<string, ProformaGetRequest>): CustomActions {
		return {
			type: PROFORMA_ACTIONS.SEND_EMAIL_RESPONSE,
			payload: response
		}
	}

	// endregion

	//region set voucher for details, send-email and generate and download
	public setVoucherForDetails(voucherNo: string, action: ActionTypeAfterVoucherGenerateOrUpdate): CustomActions {
		return {
			type: PROFORMA_ACTIONS.SET_VOUCHER_FOR_DETAILS,
			payload: { voucherNo, action }
		}
	}

	public resetVoucherForDetails(): CustomActions {
		return {
			type: PROFORMA_ACTIONS.RESET_VOUCHER_FOR_DETAILS
		}
	}

	//endregion

	// region reset active voucher
	public resetActiveVoucher(): CustomActions {
		return {
			type: PROFORMA_ACTIONS.RESET_ACTIVE_VOUCHER
		}
	}

	// endregion

	private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false,
		errorAction: CustomActions = { type: 'EmptyAction' }, message?: string): CustomActions {
		if (response.status === 'error') {
			if (showToast) {
				this._toasty.errorToast(response.message);
			}
			return errorAction;
		} else {
			if (showToast && typeof response.body === 'string') {
				this._toasty.successToast(response.body);
			} else if (message) {
				this._toasty.successToast(message);
			}
		}
		return successAction;
	}
}
