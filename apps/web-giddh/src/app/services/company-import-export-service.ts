import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './http-wrapper.service';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { COMPANY_IMPORT_EXPORT_API } from './apiurls/company-import-export.api';
import { concat, get } from '../lodash-optimized';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * CompanyImportExportService class
 * Implements CompanyImportExportService functionality
 */
export class CompanyImportExportService {
    private companyUniqueName: string;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(private errorHandler: GiddhErrorHandler, public http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * Handles ExportRequest functionality
     */
    public ExportRequest(branchUniqueName?: string): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + COMPANY_IMPORT_EXPORT_API.EXPORT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        /**
         * Handles if functionality
         */
        if (branchUniqueName) {
            url = url.concat(`?branchUniqueName=${branchUniqueName}`);
        }
        return this.http.get(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, string> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '')));
    }

    /**
     * Handles ExportLedgersRequest functionality
     */
    public ExportLedgersRequest(from: string, to: string, branchUniqueName?: string): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + COMPANY_IMPORT_EXPORT_API.EXPORT_LEDGERS
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':from', encodeURIComponent(from))
            ?.replace(':to', encodeURIComponent(to));
        /**
         * Handles if functionality
         */
        if (branchUniqueName) {
            url = url.concat(`&branchUniqueName=${branchUniqueName}`);
        }
        return this.http.get(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, string> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '')));
    }

    /**
     * Handles ImportRequest functionality
     */
    public ImportRequest(file: File, branchUniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        const formData: FormData = new FormData();
        formData.append('importFile', file, file.name);

        const httpOptions = {
            headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' }
        };
        let url = this.config.apiUrl + COMPANY_IMPORT_EXPORT_API.IMPORT
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        /**
         * Handles if functionality
         */
        if (branchUniqueName) {
            url = url.concat(`?branchUniqueName=${branchUniqueName}`);
        }

        return this.http.post(url, formData, httpOptions).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, string> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
    }

    /**
     * Handles ImportLedgersRequest functionality
     */
    public ImportLedgersRequest(file: File): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        const formData: FormData = new FormData();
        formData.append('importFile', file, file.name);

        const httpOptions = {
            headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' }
        };

        return this.http.post(this.config.apiUrl + COMPANY_IMPORT_EXPORT_API.IMPORT_LEDGERS
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), formData, httpOptions).pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<string, string> = res;
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
    }
}
