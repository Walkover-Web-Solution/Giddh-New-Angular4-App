import { Inject, Injectable, OnInit, Optional } from '@angular/core';
import { GeneralService } from './general.service';
import { DownloadVoucherRequest, ReciptRequest } from '../models/api-models/recipt';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { HttpWrapperService } from './httpWrapper.service';
import { HttpClient } from '@angular/common/http';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { RECEIPT_API } from './apiurls/recipt.api';
import { GenerateInvoiceRequestClass } from '../models/api-models/Invoice';
import { ErrorHandler } from './catchManager/catchmanger';
import { DownloadLedgerRequest } from '../models/api-models/Ledger';
import { LEDGER_API } from './apiurls/ledger.api';
import { UserDetails } from '../models/api-models/loginModels';

@Injectable()
export class ReceiptService implements OnInit {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(private _generalService: GeneralService, private _http: HttpWrapperService,
              private _httpClient: HttpClient, private errorHandler: ErrorHandler,
              @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    this.companyUniqueName = this._generalService.companyUniqueName;
  }

  public ngOnInit() {
    //
  }

  // public UpdateRecipt(accountUniqueName: string, model: ReciptRequest): Observable<BaseResponse<string, ReciptRequest>> {
  //   this.companyUniqueName = this._generalService.companyUniqueName;
  //   return this._http(this.config.apiUrl + RECEIPT_API.PUT.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model)
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

  public DownloadVoucher(model: DownloadVoucherRequest, accountUniqueName: string): Observable<BaseResponse<any, DownloadVoucherRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + RECEIPT_API.DOWNLOAD_VOUCHER
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model)
      .map((res) => {
        let data: BaseResponse<any, DownloadVoucherRequest> = res;
        data.request = model;
        data.queryString = {accountUniqueName};
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<any, DownloadVoucherRequest>(e, model, {accountUniqueName}));
  }
}
