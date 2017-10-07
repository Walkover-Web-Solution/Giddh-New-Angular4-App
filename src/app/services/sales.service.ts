import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { HandleCatch, ErrorHandler } from './catchManager/catchmanger';
import { Configuration } from '../app.constant';
import { InvoiceFormClass } from '../models/api-models/Sales';
// Configuration.ApiUrl +
const COMMON_URL = 'http://apitest.giddh.com/v2/company/:companyUniqueName/accounts/:accountUniqueName/';

const SALES_API_V2 = {
  GENERATE_SALES: COMMON_URL + 'invoices/generate-sales'
};

@Injectable()
export class SalesService {

    private user: UserDetails;
    private companyUniqueName: string;
    private roleUniqueName: string;

    constructor(
      private _http: HttpWrapperService,
      private store: Store<AppState>,
      private errorHandler: ErrorHandler,
    ) {}

    /**
     *
     * @param model : InvoiceFormClass object
     */
    public generateSales(model: InvoiceFormClass): Observable<BaseResponse<string, InvoiceFormClass>> {
      let accountUniqueName = model.account.uniqueName;
      this.store.take(1).subscribe(s => {
        if (s.session.user) {
          this.user = s.session.user.user;
          this.companyUniqueName = s.session.companyUniqueName;
        }
      });
      return this._http.post(SALES_API_V2.GENERATE_SALES.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model)
        .map((res) => {
          let data: BaseResponse<string, InvoiceFormClass> = res.json();
          data.request = model;
          return data;
        })
        .catch((e) => this.errorHandler.HandleCatch<string, InvoiceFormClass>(e, model));
    }
}
