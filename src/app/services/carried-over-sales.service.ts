import { Inject, Injectable, OnInit, Optional } from '@angular/core';
import { ErrorHandler } from './catchManager/catchmanger';
import { HttpWrapperService } from './httpWrapper.service';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { CARRIEDOVERSALES_API } from './apiurls/carried-over-sales.api';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { CarriedOverSalesResponse } from '../models/api-models/carried-over-sales';
import { FlattenAccountsResponse } from '../models/api-models/Account';

@Injectable()
export class CarriedOverSalesService implements OnInit {
  private companyUniqueName: string;

  constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
              private _generalService: GeneralService,
              @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    this.companyUniqueName = this._generalService.companyUniqueName;
  }

  public ngOnInit() {
    //
  }

  public GetCarriedOverSales(q?: string, type: string = 'quarter', value?: string): Observable<BaseResponse<CarriedOverSalesResponse, string>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    if (this.companyUniqueName) {
      return this._http.get(this.config.apiUrl + CARRIEDOVERSALES_API.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':q', encodeURIComponent(q || '')).replace(':type', encodeURIComponent(type || '')).replace(':value', encodeURIComponent(value || ''))).map((res) => {
        let data: BaseResponse<CarriedOverSalesResponse, string> = res;
        data.queryString = {q, type, value};
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<CarriedOverSalesResponse, string>(e));
    } else {
      return Observable.empty();
    }
  }
}
