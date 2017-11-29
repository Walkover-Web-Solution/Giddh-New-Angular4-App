import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { GenerateSalesRequest, InvoiceFormClass } from '../models/api-models/Sales';
import { SALES_API_V2 } from './apiurls/sales.api';
import { GeneralService } from './general.service';

@Injectable()
export class SalesService {

  private user: UserDetails;
  private companyUniqueName: string;

  constructor(private _http: HttpWrapperService,
              private errorHandler: ErrorHandler, private _generalService: GeneralService) {
  }

  /**
   *
   * @param model : InvoiceFormClass object
   * @param updateAccount: boolean flag
   */
  public generateSales(model: GenerateSalesRequest): Observable<BaseResponse<string, GenerateSalesRequest>> {
    let accountUniqueName = model.invoice.account.uniqueName;
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(SALES_API_V2.GENERATE_SALES.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model)
      .map((res) => {
        let data: BaseResponse<string, GenerateSalesRequest> = res.json();
        data.request = model;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, GenerateSalesRequest>(e, model));
  }
}
