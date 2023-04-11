import { Optional, Inject, Injectable } from '@angular/core';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { HttpWrapperService } from './http-wrapper.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';
import { GeneralService } from './general.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { catchError, map } from 'rxjs/operators';
import { BULK_VOUCHER_EXPORT_API } from './apiurls/bulkvoucherexport.api';
import { Observable } from 'rxjs';

@Injectable()
export class BulkVoucherExportService {

    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * This will bulk export the vouchers
     *
     * @param {*} getRequest
     * @param {*} postRequest
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof BulkVoucherExportService
     */
    public bulkExport(getRequest: any, postRequest: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + BULK_VOUCHER_EXPORT_API.BULK_EXPORT;
        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        url = url?.replace(':from', getRequest.from);
        url = url?.replace(':to', getRequest.to);
        url = url?.replace(':type', getRequest.type);
        url = url?.replace(':mail', getRequest.mail);
        url = url?.replace(':q', getRequest.q);
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.post(url, postRequest).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = postRequest;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, postRequest)));
    }
}
