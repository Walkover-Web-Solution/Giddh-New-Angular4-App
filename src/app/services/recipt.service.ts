import { Injectable, OnInit } from '@angular/core';
import { GeneralService } from './general.service';
import { ReciptRequest } from '../models/api-models/recipt';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { HttpWrapperService } from './httpWrapper.service';
import { HttpClient } from '@angular/common/http';
import { IServiceConfigArgs } from './service.config';
import { RECIPT_API } from './apiurls/recipt.api';
import { GenerateInvoiceRequestClass } from '../models/api-models/Invoice';
import { ErrorHandler } from './catchManager/catchmanger';

@Injectable()
export class ReciptService implements OnInit {
  private companyUniqueName: string;

  constructor(private _generalService: GeneralService, private _http: HttpWrapperService,
              private _httpClient: HttpClient, private config: IServiceConfigArgs, private errorHandler: ErrorHandler) {
    this.companyUniqueName = this._generalService.companyUniqueName;
  }

  public ngOnInit() {
    //
  }

  // public UpdateRecipt(accountUniqueName: string, model: ReciptRequest): Observable<BaseResponse<string, ReciptRequest>> {
  //   this.companyUniqueName = this._generalService.companyUniqueName;
  //   return this._http(this.config.apiUrl + RECIPT_API.PUT.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model)
  //     .map((res) => {
  //       let data: BaseResponse<string, ReciptRequest> = res;
  //       data.request = model;
  //       data.queryString = {accountUniqueName};
  //       return data;
  //     })
  //     .catch((e) => this.errorHandler.HandleCatch<string, GenerateInvoiceRequestClass>(e, model));
  // }

  public GetAllRecipt() {
  //
  }

}
