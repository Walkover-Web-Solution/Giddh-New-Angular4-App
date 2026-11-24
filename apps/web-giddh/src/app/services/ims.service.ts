import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ACTIVE_GSP_PROVIDER } from '../gst/constants/gst.constant';
import { BaseResponse } from '../models/api-models/BaseResponse';
import {
    ImsInvoicesRequest,
    ImsInvoicesResponse,
    ImsReferenceRow,
    ImsSaveParams,
    ImsSaveRequest,
    ImsSaveResponse,
    ImsSaveStatusRequest
} from '../models/api-models/Ims';
import { GSTR_API } from './apiurls/gst-r.api';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { HttpWrapperService } from './http-wrapper.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

/**
 * IMS (Invoice Management System) API calls.
 * The GSP session (OTP) is shared with GSTR filing and stays in GstReconcileService.
 */
@Injectable({
    providedIn: 'root'
})
export class ImsService {
    private readonly errorHandler = inject(GiddhErrorHandler);
    private readonly http = inject(HttpWrapperService);
    private readonly generalService = inject(GeneralService);
    private readonly config = inject<IServiceConfigArgs>(ServiceConfig);

    /**
     * Lists IMS invoices with the period summary. `refresh: true` pulls fresh data from the portal first.
     *
     * @param {ImsInvoicesRequest} request Period, filter and page
     * @returns {Observable<BaseResponse<ImsInvoicesResponse, ImsInvoicesRequest>>}
     * @memberof ImsService
     */
    public getInvoices(request: ImsInvoicesRequest): Observable<BaseResponse<ImsInvoicesResponse, ImsInvoicesRequest>> {
        const params: Record<string, string | number | boolean> = {
            gstin: request.gstin,
            monthYear: request.monthYear,
            refresh: request.refresh,
            page: request.page,
            count: request.count,
            gsp: ACTIVE_GSP_PROVIDER
        };
        if (request.status) {
            params.status = request.status;
        }
        return this.http.get(this.config.apiUrl + this.withCompany(GSTR_API.IMS_INVOICES), params)
            .pipe(catchError(error => this.errorHandler.HandleCatch<ImsInvoicesResponse, ImsInvoicesRequest>(error, request)));
    }

    /**
     * Saves Accept / Reject / Pending actions, or resets them when `reset` is true.
     *
     * @param {ImsSaveParams} params GSTIN, period and reset flag
     * @param {ImsSaveRequest} body Invoice actions
     * @returns {Observable<BaseResponse<ImsSaveResponse, ImsSaveRequest>>}
     * @memberof ImsService
     */
    public saveActions(params: ImsSaveParams, body: ImsSaveRequest): Observable<BaseResponse<ImsSaveResponse, ImsSaveRequest>> {
        const url = this.withCompany(GSTR_API.SAVE_IMS)
            .replace(':gstin', encodeURIComponent(params.gstin))
            .replace(':monthYear', encodeURIComponent(params.monthYear))
            .replace(':reset', String(params.reset))
            .replace(':gsp', ACTIVE_GSP_PROVIDER)
            .replace(':currentDateTime', encodeURIComponent(this.generalService.getCurrentDateTime()));
        return this.http.post(this.config.apiUrl + url, body)
            .pipe(catchError(error => this.errorHandler.HandleCatch<ImsSaveResponse, ImsSaveRequest>(error, body)));
    }

    /**
     * Gets the portal status of a save or reset.
     *
     * @param {ImsSaveStatusRequest} request Reference id, GSTIN and return period
     * @returns {Observable<BaseResponse<ImsSaveResponse, ImsSaveStatusRequest>>}
     * @memberof ImsService
     */
    public getSaveStatus(request: ImsSaveStatusRequest): Observable<BaseResponse<ImsSaveResponse, ImsSaveStatusRequest>> {
        const params = {
            referenceId: request.referenceId,
            gstin: request.gstin,
            retPeriod: request.retPeriod,
            gsp: ACTIVE_GSP_PROVIDER
        };
        return this.http.get(this.config.apiUrl + this.withCompany(GSTR_API.SAVE_IMS_STATUS), params)
            .pipe(catchError(error => this.errorHandler.HandleCatch<ImsSaveResponse, ImsSaveStatusRequest>(error, request)));
    }

    /**
     * Lists IMS save / reset reference ids for the period.
     *
     * @param {string} gstin GSTIN
     * @param {string} monthYear Period in MM-yyyy
     * @returns {Observable<BaseResponse<ImsReferenceRow[], string>>}
     * @memberof ImsService
     */
    public getReferenceIds(gstin: string, monthYear: string): Observable<BaseResponse<ImsReferenceRow[], string>> {
        return this.http.get(this.config.apiUrl + this.withCompany(GSTR_API.IMS_REFERENCE_IDS), { gstin, monthYear })
            .pipe(catchError(error => this.errorHandler.HandleCatch<ImsReferenceRow[], string>(error)));
    }

    /**
     * Fills the active company in an API path.
     *
     * @private
     * @param {string} path API path with `:companyUniqueName`
     * @returns {string}
     * @memberof ImsService
     */
    private withCompany(path: string): string {
        return path.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));
    }
}
