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
import { ServiceConfig, IServiceConfigArgs } from 'app/services/service.config';
import { DayBookRequestModel } from 'app/models/api-models/DaybookRequest';
import { DayBookResponseModel } from 'app/models/api-models/Daybook';
import { DAYBOOK_SEARCH_API } from 'app/services/apiurls/daybook.api';

@Injectable()
export class DaybookService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(private errorHandler: ErrorHandler, public _http: HttpWrapperService, public _router: Router,
    private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }
  public GetDaybook(request: DayBookRequestModel, fromdate: string, todate: string): Observable<BaseResponse<DayBookResponseModel, DayBookRequestModel>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + DAYBOOK_SEARCH_API.SEARCH
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':fromDate', encodeURIComponent(fromdate))
      .replace(':toDate', encodeURIComponent(todate)), request)
      .map((res) => {
        let data: BaseResponse<DayBookResponseModel, DayBookRequestModel> = res.json();
        data.request = request;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<DayBookResponseModel, DayBookRequestModel>(e, request));
  }
}
