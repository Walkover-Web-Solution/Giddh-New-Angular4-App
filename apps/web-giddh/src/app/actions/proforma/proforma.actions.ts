import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ProformaService } from '../../services/proforma.service';
import { CustomActions } from '../../store/customActions';
import { PROFORMA_ACTIONS } from './proforma.const';
import { GenericRequestForGenerateSCD } from '../../models/api-models/Sales';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { InvoiceReceiptFilter } from '../../models/api-models/recipt';
import { ProformaFilter, ProformaGetRequest, ProformaResponse } from '../../models/api-models/proforma';

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
          switch (response.body.voucher.voucherDetails.voucherType) {
            case 'proforma':
              no = response.body.voucher.voucherDetails.proformaNumber;
              break;
            case 'estimate' :
              no = response.body.voucher.voucherDetails.estimateNumber;
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
  public getAll(request: InvoiceReceiptFilter, voucherType: string): CustomActions {
    return {
      type: PROFORMA_ACTIONS.GET_ALL_PROFORMA_REQUEST,
      payload: {request, voucherType}
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
      payload: {request, voucherType}
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
      payload: {request, voucherType}
    }
  }

  public deleteProformaResponse(response: BaseResponse<string, ProformaGetRequest>): CustomActions {
    return {
      type: PROFORMA_ACTIONS.DELETE_PROFORMA_RESPONSE,
      payload: response
    }
  }
  // endregion

  private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false,
                                                errorAction: CustomActions = {type: 'EmptyAction'}, message?: string): CustomActions {
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
