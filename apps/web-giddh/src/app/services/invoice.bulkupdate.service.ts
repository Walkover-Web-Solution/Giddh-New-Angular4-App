import { Injectable, Optional, Inject } from '@angular/core';
import { HttpWrapperService } from './http-wrapper.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { GeneralService } from './general.service';
import { BULK_UPDATE_VOUCHER } from './apiurls/invoice.api';
import { map, catchError } from 'rxjs/operators';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * InvoiceBulkUpdateService service
 * Provides invoicebulkupdate related business logic and data operations
 */
export class InvoiceBulkUpdateService {
    private _: any;
    
    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService, private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
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
        let url;
        /**
         * Handles if functionality
         */
        if (actionType) {
            url = this.config.apiUrl + BULK_UPDATE_VOUCHER.BULK_UPDATE_VOUCHER_ACTION?.replace(':companyUniqueName', this.generalService.companyUniqueName)?.replace(':actionType', actionType);
            
            /**
             * Handles if functionality
             */
            if (this.generalService.voucherApiVersion === 2) {
                url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
            }
        }
        return this.http.post(url, model).pipe(
            /**
             * Handles map functionality
             */
            map(res => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                data.queryString = { model, actionType };
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

}
