import { Injectable, Optional, Inject } from '@angular/core';
import { HttpWrapperService } from './httpWrapper.service';
import { HttpClient } from '@angular/common/http';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { GeneralService } from './general.service';
import { UserDetails } from '../models/api-models/loginModels';
import { BULK_UPDATE_VOUCHER } from './apiurls/invoice.api';
import { map, catchError } from 'rxjs/operators';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';

@Injectable()
export class InvoiceBulkUpdateService {

    private user: UserDetails;
    private companyUniqueName: string;
    private _: any;
    private voucherType: string = '';
    constructor(private errorHandler: GiddhErrorHandler, private _http: HttpWrapperService, private _httpClient: HttpClient, private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this._ = config._;
        _ = config._;
    }

 /**
  * API call for bulk update Invoice
  *
  * @param {*} model
  * @param {string} actionType
  * @returns
  * @memberof InvoiceBulkUpdateService
  */
 public bulkUpdateInvoice(model: any, actionType: string) {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        let url;
        if(actionType) {
         url = this.config.apiUrl + BULK_UPDATE_VOUCHER.BULK_UPDATE_VOUCHER_ACTION.replace(':companyUniqueName',this.companyUniqueName).replace(':actionType',actionType);
        }
        return this._http.post(url, model).pipe(
            map(res=>{
                let data: BaseResponse<any, any> = res;
                data.request = model;
                data.queryString = { model, actionType };
                return data;
            }), catchError((e)=> this.errorHandler.HandleCatch<any, any>(e, model)));
    }

}
