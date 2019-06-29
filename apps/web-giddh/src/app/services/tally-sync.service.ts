import {catchError, map} from 'rxjs/operators';
import {HttpWrapperService} from './httpWrapper.service';
import {Inject, Injectable, Optional} from '@angular/core';
import {ErrorHandler} from './catchManager/catchmanger';
import {GeneralService} from './general.service';
import {IServiceConfigArgs, ServiceConfig} from './service.config';
import {TALLY_SYNC_API} from "./apiurls/tally-sync";
import {
  ImportExcelProcessResponseData,
  ImportExcelRequestData,
  ImportExcelResponseData
} from "../models/api-models/import-excel";
import {TallySyncResponseData} from "../models/api-models/tally-sync";
import {BaseResponse} from "../../../../../Nativemobile/src/app/models/api-models/BaseResponse";

@Injectable()
export class TallySyncService {

  constructor(private errorHandler: ErrorHandler,
              private _http: HttpWrapperService,
              private _generalService: GeneralService,
              @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }

  //
  public getCompletedSync(from: string, to: string) {
    const companyUniqueName = this._generalService.companyUniqueName;
    const url = this.config.apiUrl + TALLY_SYNC_API.COMPLETED
      .replace(':companyUniqueName', companyUniqueName)
      .replace(':from', from)
      .replace(':to', to)
      .replace(':page', '1')
      .replace(':count', '20')
      .replace(':sortBy', 'desc')
    ;
    return this._http.get(url).pipe(map((res) => {
      return res.body;
    }), catchError((e) => this.errorHandler.HandleCatch<TallySyncResponseData, string>(e)));
  }

  public getInProgressSync() {
    const url = this.config.apiUrl + TALLY_SYNC_API.INPROGRESS
      .replace(':page', '1')
      .replace(':count', '20')
      .replace(':sortBy', 'desc')
    ;
    return this._http.get(url).pipe(map((res) => {
      return res.body;
    }), catchError((e) => this.errorHandler.HandleCatch<TallySyncResponseData, string>(e)));
  }


}
