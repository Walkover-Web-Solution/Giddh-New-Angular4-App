import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, OnInit, Optional } from '@angular/core';
import { ErrorHandler } from './catchManager/catchmanger';
import { HttpWrapperService } from './httpWrapper.service';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { CARRIEDOVERSALES_API } from './apiurls/carried-over-sales.api';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { CarriedOverSalesRequest, CarriedOverSalesResponse } from '../models/api-models/carried-over-sales';

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

  public GetCarriedOverSales(queryRequest: CarriedOverSalesRequest): Observable<BaseResponse<CarriedOverSalesResponse, string>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + CARRIEDOVERSALES_API.GET
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':type', queryRequest.type.toString())
      .replace(':value', queryRequest.value.toString())).pipe(
      map((res) => {
        let data: BaseResponse<CarriedOverSalesResponse, string> = res;
        data.queryString = queryRequest;
        return data;
      }),
      catchError((e) => this.errorHandler.HandleCatch<CarriedOverSalesResponse, string>(e, null, queryRequest)));
  }
}
