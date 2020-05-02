import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IMagicLinkLedgerRequest, IMagicLinkLedgerResponse } from './../models/api-models/MagicLink';
import { Inject, Injectable, Optional } from '@angular/core';

import { HttpWrapperService } from './httpWrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { LEDGER_API } from './apiurls/ledger.api';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class MagicLinkService {

    constructor(
        private errorHandler: GiddhErrorHandler,
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
        return this._http.get(URL).pipe(map((res) => {
            let data: BaseResponse<IMagicLinkLedgerResponse, IMagicLinkLedgerRequest> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<IMagicLinkLedgerResponse, IMagicLinkLedgerRequest>(e, {})));
    }

    /**
     * get base64 data of a file
     */
    public DownloadInvoice(id: string, invoiceNum: string): Observable<BaseResponse<any, any>> {
        return this._http.get(this.config.apiUrl + LEDGER_API.MAGIC_LINK_DOWNLOAD_FILE.replace(':id', id).replace(':invoiceNum', invoiceNum)).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, {})));
    }
}
