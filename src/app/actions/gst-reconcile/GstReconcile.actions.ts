import { Injectable } from '@angular/core';
import { CustomActions } from '../../store/customActions';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { COMPANY_IMPORT_EXPORT_ACTIONS } from '../company-import-export/company-import-export.const';
import { GST_RECONCILE_ACTIONS } from './GstReconcile.const';
import { VerifyOtpRequest } from '../../models/api-models/GstReconcile';

@Injectable()
export class GstReconcileActions {

  constructor() {
    //
  }

  public GstReconcileRequest(userName: string): CustomActions {
    return {
      type: GST_RECONCILE_ACTIONS.GST_RECONCILE_REQUEST,
      payload: {userName}
    };
  }

  public GstReconcileResponse(response: BaseResponse<string, string>): CustomActions {
    return {
      type: GST_RECONCILE_ACTIONS.GST_RECONCILE_RESPONSE,
      payload: response
    };
  }

  public GstReconcileInvoicePeriodRequest(period: string): CustomActions {
    return {
      type: GST_RECONCILE_ACTIONS.GST_RECONCILE_INVOICE_PERIOD_REQUEST,
      payload: {period}
    };
  }

  public GstReconcileInvoicePeriodResponse(response: BaseResponse<string, string>): CustomActions {
    return {
      type: GST_RECONCILE_ACTIONS.GST_RECONCILE_INVOICE_PERIOD_RESPONSE,
      payload: response
    };
  }

  public GstReconcileVerifyOtpRequest(model: VerifyOtpRequest): CustomActions {
    return {
      type: GST_RECONCILE_ACTIONS.GST_RECONCILE_VERIFY_OTP_REQUEST,
      payload: {body: model}
    };
  }
}
