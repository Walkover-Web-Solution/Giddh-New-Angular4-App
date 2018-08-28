import { Injectable, Optional, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { TB_PL_BS_API } from './apiurls/tl-pl.api';
import { saveAs } from 'file-saver';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from '../services/service.config';
import { DayBookRequestModel, DaybookQueryRequest } from '../models/api-models/DaybookRequest';
import { DayBookResponseModel } from '../models/api-models/Daybook';
import { DAYBOOK_SEARCH_API } from './apiurls/daybook.api';

@Injectable()
export class DaybookService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(private errorHandler: ErrorHandler, public _http: HttpWrapperService, public _router: Router,
    private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }
  public GetDaybook(request: DayBookRequestModel, queryRequest: DaybookQueryRequest): Observable<BaseResponse<DayBookResponseModel, DayBookRequestModel>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + DAYBOOK_SEARCH_API.SEARCH
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':page', queryRequest.page.toString())
      .replace(':count', queryRequest.count.toString())
      .replace(':from', encodeURIComponent(queryRequest.from))
      .replace(':to', encodeURIComponent(queryRequest.to)), request)
      .map((res) => {
        let data: BaseResponse<DayBookResponseModel, DayBookRequestModel> = res;
        data.request = request;
        data.queryString = queryRequest;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<DayBookResponseModel, DayBookRequestModel>(e, request, queryRequest));
  }

  public ExportDaybook(request: DayBookRequestModel, queryRequest: DaybookQueryRequest): Observable<BaseResponse<DayBookResponseModel, DayBookRequestModel>> {

    console.log('queryRequest is :', queryRequest);

    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + DAYBOOK_SEARCH_API.EXPORT
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':page', queryRequest.page.toString())
      .replace(':count', queryRequest.count.toString())
      .replace(':from', encodeURIComponent(queryRequest.from))
      .replace(':to', encodeURIComponent(queryRequest.to))
      .replace(':format', queryRequest.format.toString())
      .replace(':type', queryRequest.type.toString())
      .replace(':sort', queryRequest.sort.toString()))
      .map((res) => {
        let data: BaseResponse<DayBookResponseModel, DayBookRequestModel> = res;
        data.queryString = queryRequest;
        data.queryString.requestType = queryRequest.format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel';
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<DayBookResponseModel, DayBookRequestModel>(e, request));
  }

  public ExportDaybookPost(request: DayBookRequestModel, queryRequest: DaybookQueryRequest): Observable<BaseResponse<DayBookResponseModel, DayBookRequestModel>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + DAYBOOK_SEARCH_API.EXPORT
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':page', queryRequest.page.toString())
      .replace(':count', queryRequest.count.toString())
      .replace(':from', encodeURIComponent(queryRequest.from))
      .replace(':to', encodeURIComponent(queryRequest.to))
      .replace(':format', queryRequest.format.toString())
      .replace(':type', queryRequest.type.toString())
      .replace(':sort', queryRequest.sort.toString()), request)
      .map((res) => {
        let data: BaseResponse<DayBookResponseModel, DayBookRequestModel> = res;
        data.request = request;
        data.queryString = queryRequest;
        data.queryString.requestType = queryRequest.format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel';
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<DayBookResponseModel, DayBookRequestModel>(e, request));
  }
}
