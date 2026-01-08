import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './http-wrapper.service';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { COMPANY_IMPORT_EXPORT_API } from './apiurls/company-import-export.api';

@Injectable()
export class CompanyImportExportService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, public http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    public ExportRequest(branchUniqueName?: string): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + COMPANY_IMPORT_EXPORT_API.EXPORT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        if (branchUniqueName) {
            url = url.concat(`?branchUniqueName=${branchUniqueName}`);
        }
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, string> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '')));
    }

    public ExportLedgersRequest(from: string, to: string, branchUniqueName?: string): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + COMPANY_IMPORT_EXPORT_API.EXPORT_LEDGERS
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':from', encodeURIComponent(from))
            ?.replace(':to', encodeURIComponent(to));
        if (branchUniqueName) {
            url = url.concat(`&branchUniqueName=${branchUniqueName}`);
        }
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, string> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '')));
    }

    public ImportRequest(file: File, branchUniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        const formData: FormData = new FormData();
        formData.append('importFile', file, file.name);

        const httpOptions = {
            headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' }
        };
        let url = this.config.apiUrl + COMPANY_IMPORT_EXPORT_API.IMPORT
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        if (branchUniqueName) {
            url = url.concat(`?branchUniqueName=${branchUniqueName}`);
        }

        return this.http.post(url, formData, httpOptions).pipe(
            map((res) => {
                let data: BaseResponse<string, string> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
    }

    public ImportLedgersRequest(file: File): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        const formData: FormData = new FormData();
        formData.append('importFile', file, file.name);

        const httpOptions = {
            headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' }
        };

        return this.http.post(this.config.apiUrl + COMPANY_IMPORT_EXPORT_API.IMPORT_LEDGERS
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), formData, httpOptions).pipe(
                map((res) => {
                    let data: BaseResponse<string, string> = res;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
    }
}
