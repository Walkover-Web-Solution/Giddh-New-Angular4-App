import { map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { COMMON_API } from './apiurls/common.api';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import {UserDetails} from "../models/api-models/loginModels";
import { CountryResponse, CurrencyResponse, CallingCodesResponse } from '../models/api-models/Common';
import {ErrorHandler} from "./catchManager/catchmanger";
import {HttpWrapperService} from "./httpWrapper.service";
import {Observable} from "rxjs";

@Injectable()
export class CommonService {
  private user: UserDetails;

  constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService, private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    this.user = this._generalService.user;
  }

  public GetCountry(formName: string): Observable<BaseResponse<any, any>> {
    let url = this.config.apiUrl + COMMON_API.COUNTRY;
    return this._http.get(url.replace(':formName', formName)).pipe(
      map((res) => {
        let data: BaseResponse<CountryResponse, any> = res;
        return data;
      }));
  }

  public GetCurrency(): Observable<BaseResponse<any, any>> {
    let url = this.config.apiUrl + COMMON_API.CURRENCY;
    return this._http.get(url).pipe(
      map((res) => {
        let data: BaseResponse<CurrencyResponse, any> = res;
        return data;
      }));
  }

  public GetCallingCodes(): Observable<BaseResponse<any, any>> {
    let url = this.config.apiUrl + COMMON_API.CALLING_CODES;
    return this._http.get(url).pipe(
      map((res) => {
        let data: BaseResponse<CallingCodesResponse, any> = res;
        return data;
      }));
  }
}
