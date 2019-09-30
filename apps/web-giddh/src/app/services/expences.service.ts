import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';

import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { CommonPaginatedRequest } from '../models/api-models/Invoice';
import { PettyCashReportResponse, ActionPettycashRequest } from '../models/api-models/Expences';
import { EXPENSE_API } from './apiurls/expense.api';

@Injectable()
export class ExpenseService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(private errorHandler: ErrorHandler, public _http: HttpWrapperService, public _router: Router,
    private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }

  public getPettycashReports(model: CommonPaginatedRequest): Observable<BaseResponse<PettyCashReportResponse, any>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + EXPENSE_API.GET.replace(':companyUniqueName', this.companyUniqueName), model).pipe(
      map((res) => {
        let data: BaseResponse<PettyCashReportResponse, any> = res;
        data.request = model;
        return data;
      }),
      catchError((e) => this.errorHandler.HandleCatch<PettyCashReportResponse, any>(e)));
  }
  public actionPettycashReports(requestObj: ActionPettycashRequest, model?: any): Observable<BaseResponse<PettyCashReportResponse, any>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + EXPENSE_API.ACTION.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', requestObj.uniqueName).replace(':actionType', requestObj.actionType), model).pipe(
      map((res) => {
        let data: BaseResponse<any, any> = res;
        data.request = requestObj;
        return data;
      }),
      catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
  }



}
