import { from } from 'rxjs/observable/from';
import { IMagicLinkLedgerResponse, IMagicLinkLedgerRequest } from './../models/api-models/MagicLink';
import { DownloadLedgerAttachmentResponse, DownloadLedgerRequest, ExportLedgerRequest, IELedgerResponse, ILedgerAdvanceSearchRequest, ILedgerAdvanceSearchResponse, LedgerResponse, LedgerUpdateRequest, MagicLinkRequest, MagicLinkResponse, MailLedgerRequest, ReconcileResponse, TransactionsRequest, TransactionsResponse } from '../models/api-models/Ledger';
import { Injectable, Optional, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { LEDGER_API } from './apiurls/ledger.api';
import { BlankLedgerVM } from '../ledger/ledger.vm';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';
@Injectable()
export class MagicLinkService {

  constructor(
    private errorHandler: ErrorHandler,
    public _http: HttpWrapperService,
    @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }

  /**
   * get bank transactions for a account
   */
  public GetMagicLinkData(model: IMagicLinkLedgerRequest): Observable<BaseResponse<IMagicLinkLedgerResponse, IMagicLinkLedgerRequest>> {
    let URL;
    if (model.data.from && model.data.to) {
      URL = this.config.apiUrl + LEDGER_API.GET_MAGIC_LINK_DATA_WITH_DATE.replace(':id', model.data.id).replace(':from', model.data.from).replace(':to', model.data.to);
    } else {
      URL = this.config.apiUrl + LEDGER_API.GET_MAGIC_LINK_DATA.replace(':id', model.data.id);
    }
    return this._http.get(URL).map((res) => {
      let data: BaseResponse<IMagicLinkLedgerResponse, IMagicLinkLedgerRequest> = res;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<IMagicLinkLedgerResponse, IMagicLinkLedgerRequest>(e, {}));
  }

  /**
   * get base64 data of a file
   */
  public DownloadInvoice(id: string, invoiceNum: string): Observable<BaseResponse<any, any>> {
    return this._http.get(this.config.apiUrl + LEDGER_API.MAGIC_LINK_DOWNLOAD_FILE.replace(':id', id).replace(':invoiceNum', invoiceNum)).map((res) => {
      let data: BaseResponse<any, any> = res;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e, {}));
  }
}