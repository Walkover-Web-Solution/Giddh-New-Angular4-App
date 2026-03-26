import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpWrapperService } from '../../services/http-wrapper.service';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GiddhErrorHandler } from '../../services/catchManager/catchmanger';
import { GeneralService } from '../../services/general.service';
import { IServiceConfigArgs, ServiceConfig } from '../../services/service.config';
import { BANK_RECONCILIATION_API } from './apiurls/bank-reconciliation.api';
import {
    ReconciliationListResponse,
    ReconciliationUploadResponse,
    ReconciliationProcessRequest
} from './bank-reconciliation.model';

/**
 * Service for Bank Reconciliation feature
 * Handles all API calls for upload, column mapping, and listing reconciliations
 *
 * @export
 * @class BankReconciliationService
 */
@Injectable({
    providedIn: 'root'
})
export class BankReconciliationService {
    private readonly errorHandler = inject(GiddhErrorHandler);
    private readonly http = inject(HttpWrapperService);
    private readonly generalService = inject(GeneralService);
    private readonly config = inject<IServiceConfigArgs>(ServiceConfig);

    /**
     * Fetches the list of all reconciliation requests for the current company
     *
     * @param {number} page - Page number (1-based)
     * @param {number} count - Items per page
     * @param {string} from - From date filter (DD-MM-YYYY)
     * @param {string} to - To date filter (DD-MM-YYYY)
     * @returns {Observable<BaseResponse<ReconciliationListResponse, unknown>>}
     * @memberof BankReconciliationService
     */
    public getAll(page: number, count: number, from: string, to: string): Observable<BaseResponse<ReconciliationListResponse, unknown>> {
        const queryParams = new URLSearchParams({ page: String(page), count: String(count) });
        if (from) queryParams.set('from', from);
        if (to) queryParams.set('to', to);
        const url = this.generalService.replaceUrlPlaceholders(BANK_RECONCILIATION_API.GET_ALL, {}) + `?${queryParams}`;

        return this.http.get(url).pipe(
            map((res) => {
                const data: BaseResponse<ReconciliationListResponse, unknown> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<ReconciliationListResponse, unknown>(e))
        );
    }

    /**
     * Uploads a bank statement file and returns extracted headers and metadata
     *
     * @param {File} file - The bank statement file to upload
     * @param {string} accountUniqueName - Account unique name for reconciliation
     * @param {string} from - From date (DD-MM-YYYY)
     * @param {string} to - To date (DD-MM-YYYY)
     * @param {string} password - Optional PDF password
     * @param {string} branchUniqueName - Branch unique name
     * @returns {Observable<BaseResponse<ReconciliationUploadResponse, unknown>>}
     * @memberof BankReconciliationService
     */
    public upload(
        file: File,
        accountUniqueName: string,
        from: string,
        to: string,
        password: string = '',
        branchUniqueName: string = '',
        sameDebitCreditColumn: boolean = false
    ): Observable<BaseResponse<ReconciliationUploadResponse, unknown>> {
        const queryParams = new URLSearchParams({
            branchUniqueName: branchUniqueName || this.generalService.currentBranchUniqueName || '',
            from,
            to,
            password: password || '',
            accountUniqueName,
            sameDebitCreditColumn: String(sameDebitCreditColumn)
        });
        const url = this.generalService.replaceUrlPlaceholders(BANK_RECONCILIATION_API.UPLOAD, {}) + `?${queryParams}`;

        const formData = new FormData();
        formData.append('file', file);

        const options = { headers: { 'Content-Type': 'multipart/form-data' } };

        return this.http.post(url, formData, options).pipe(
            map((res) => {
                const data: BaseResponse<ReconciliationUploadResponse, unknown> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<ReconciliationUploadResponse, unknown>(e))
        );
    }

    /**
     * Processes the uploaded Excel/CSV file with user-defined column mappings
     *
     * @param {ReconciliationProcessRequest} requestData - Request ID and column mappings
     * @returns {Observable<BaseResponse<unknown, ReconciliationProcessRequest>>}
     * @memberof BankReconciliationService
     */
    public process(requestData: ReconciliationProcessRequest): Observable<BaseResponse<unknown, ReconciliationProcessRequest>> {
        const url = this.generalService.replaceUrlPlaceholders(BANK_RECONCILIATION_API.PROCESS, {});

        return this.http.post(url, requestData).pipe(
            map((res) => {
                const data: BaseResponse<unknown, ReconciliationProcessRequest> = res;
                data.request = requestData;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<unknown, ReconciliationProcessRequest>(e, requestData))
        );
    }
}
