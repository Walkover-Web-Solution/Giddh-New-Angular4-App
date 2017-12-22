import { Injectable, Optional, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { SEARCH_API } from './apiurls/search.api';
import { SearchRequest, SearchResponse } from '../models/api-models/Search';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';

@Injectable()
export class SearchService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(private errorHandler: ErrorHandler, public _http: HttpWrapperService, public _router: Router,
              private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }

  /**
   * get GetStocksReport
   */
  public Search(request: SearchRequest): Observable<BaseResponse<SearchResponse[], SearchRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + SEARCH_API.SEARCH
        .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
        .replace(':groupName', encodeURIComponent(request.groupName)),
      {from: request.fromDate, to: request.toDate, refresh: request.refresh})
      .map((res) => {
        return res.json();
      })
      .catch((e) => this.errorHandler.HandleCatch<SearchResponse[], SearchRequest>(e));
  }

}
