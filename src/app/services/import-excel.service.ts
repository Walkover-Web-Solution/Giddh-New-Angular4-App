import { catchError, map } from 'rxjs/operators';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { IMPORT_EXCEL_API } from './apiurls/import-excel.api';
import { ImportExcelResponseData } from '../models/api-models/import-excel';

@Injectable()
export class ImportExcelService {

  constructor(private errorHandler: ErrorHandler,
              private _http: HttpWrapperService,
              private _generalService: GeneralService,
              @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }

  public uploadFile(entity: string, model: File) {
    const companyUniqueName = this._generalService.companyUniqueName;
    const url = this.config.apiUrl + IMPORT_EXCEL_API.UPLOAD_FILE
      .replace(':companyUniqueName', companyUniqueName)
      .replace(':entity', entity)
    ;
    const formData: FormData = new FormData();
    formData.append('file', model, model.name);
    return this._http.post(url, formData, {headers: {'Content-Type': 'multipart/form-data'}}).pipe(map((res) => {
      let data: BaseResponse<ImportExcelResponseData, string> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<ImportExcelResponseData, string>(e)),);
  }

  public processImport(entity: string, model: ImportExcelResponseData) {
    const companyUniqueName = this._generalService.companyUniqueName;
    const url = this.config.apiUrl + IMPORT_EXCEL_API.PROCESS_IMPORT
      .replace(':companyUniqueName', companyUniqueName)
      .replace(':entity', entity)
    ;
    return this._http.post(url, model).pipe(map((res) => {
      let data: BaseResponse<ImportExcelResponseData, string> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<ImportExcelResponseData, string>(e)),);
  }

}
