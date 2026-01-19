import { catchError, map } from 'rxjs/operators';
import { HttpWrapperService } from './http-wrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { IMPORT_EXCEL_API } from './apiurls/import-excel.api';
import { ImportExcelProcessResponseData, ImportExcelRequestData, ImportExcelResponseData, ImportExcelStatusPaginatedResponse } from '../models/api-models/import-excel';
import { Observable } from 'rxjs';
import { CommonPaginatedRequest } from '../models/api-models/Invoice';
import { concat, get } from '../lodash-optimized';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * ImportExcelService service
 * Provides importexcel related business logic and data operations
 */
export class ImportExcelService {

    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(private errorHandler: GiddhErrorHandler,
        private http: HttpWrapperService,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * Handles uploadFile functionality
     */
    public uploadFile(entity: string, model: any) {
        const companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + IMPORT_EXCEL_API.UPLOAD_FILE
            ?.replace(':companyUniqueName', companyUniqueName)
            ?.replace(':entity', entity)
            ;
        /**
         * Handles if functionality
         */
        if (model.branchUniqueName) {
            url = url.concat(`&branchUniqueName=${encodeURIComponent(model.branchUniqueName)}`);
        }
        const formData: FormData = new FormData();
        formData.append('file', model.file, model.file.name);
        formData.append('isHeaderProvided', model.isHeaderProvided);
        /**
         * Handles if functionality
         */
        if (model.accountUniqueName) {
            formData.append('accountUniqueName', model.accountUniqueName);
        }
        /**
         * Handles if functionality
         */
        if (model.sameDebitCreditAmountColumn) {
            formData.append('sameDebitCreditAmountColumn', model.sameDebitCreditAmountColumn);
        }
        return this.http.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).pipe(map((res) => {
            let data: BaseResponse<ImportExcelResponseData, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<ImportExcelResponseData, string>(e)));
    }

    /**
     * Handles processImport functionality
     */
    public processImport(entity: string, model: any) {
        const companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + IMPORT_EXCEL_API.PROCESS_IMPORT
            ?.replace(':companyUniqueName', companyUniqueName)
            ?.replace(':entity', entity)
            ?.replace(':isHeaderProvided', model.isHeaderProvided?.toString());
        /**
         * Handles if functionality
         */
        if (model.branchUniqueName) {
            url = url.concat(`&branchUniqueName=${model.branchUniqueName}`);
        }
        return this.http.post(url, model).pipe(map((res) => {
            let data: BaseResponse<ImportExcelProcessResponseData, ImportExcelRequestData> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<ImportExcelProcessResponseData, ImportExcelRequestData>(e)));
    }

    /**
     * Handles importStatus functionality
     */
    public importStatus(paginatedRequest: CommonPaginatedRequest): Observable<BaseResponse<ImportExcelStatusPaginatedResponse, string>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + IMPORT_EXCEL_API.IMPORT_STATUS
            ?.replace(':companyUniqueName', companyUniqueName)
            ?.replace(':page', paginatedRequest.page?.toString())
            ?.replace(':count', paginatedRequest.count?.toString())

        return this.http.get(url).pipe(map((res) => {
            let data: BaseResponse<ImportExcelStatusPaginatedResponse, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<ImportExcelStatusPaginatedResponse, string>(e)));
    }
}
