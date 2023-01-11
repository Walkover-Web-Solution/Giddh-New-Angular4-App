import { catchError, map } from 'rxjs/operators';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { IMPORT_EXCEL_API } from './apiurls/import-excel.api';
import { ImportExcelProcessResponseData, ImportExcelRequestData, ImportExcelResponseData, ImportExcelStatusPaginatedResponse } from '../models/api-models/import-excel';
import { Observable } from 'rxjs';
import { CommonPaginatedRequest } from '../models/api-models/Invoice';

@Injectable()
export class ImportExcelService {

    constructor(private errorHandler: GiddhErrorHandler,
        private http: HttpWrapperService,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    public uploadFile(entity: string, model: any) {
        const companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + IMPORT_EXCEL_API.UPLOAD_FILE
            ?.replace(':companyUniqueName', companyUniqueName)
            ?.replace(':entity', entity)
            ;
        if (model.branchUniqueName) {
            url = url.concat(`&branchUniqueName=${encodeURIComponent(model.branchUniqueName)}`);
        }
        const formData: FormData = new FormData();
        formData.append('file', model.file, model.file.name);
        formData.append('isHeaderProvided', model.isHeaderProvided);
        return this.http.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).pipe(map((res) => {
            let data: BaseResponse<ImportExcelResponseData, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<ImportExcelResponseData, string>(e)));
    }

    public processImport(entity: string, model: any) {
        const companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + IMPORT_EXCEL_API.PROCESS_IMPORT
            ?.replace(':companyUniqueName', companyUniqueName)
            ?.replace(':entity', entity)
            ?.replace(':isHeaderProvided', model.isHeaderProvided?.toString());
        if (model.branchUniqueName) {
            url = url.concat(`&branchUniqueName=${model.branchUniqueName}`);
        }
        return this.http.post(url, model).pipe(map((res) => {
            let data: BaseResponse<ImportExcelProcessResponseData, ImportExcelRequestData> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<ImportExcelProcessResponseData, ImportExcelRequestData>(e)));
    }

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
