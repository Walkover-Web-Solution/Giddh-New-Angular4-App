import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { REVERSECHARGE_API } from './apiurls/reversecharge.api';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { ReverseChargeReportRequest } from '../models/api-models/ReverseCharge';
import { ErrorHandler } from "./catchManager/catchmanger";
import { HttpWrapperService } from "./httpWrapper.service";
import { Observable } from "rxjs";

@Injectable()
export class ReverseChargeService {
    constructor(private errorHandler: ErrorHandler, private http: HttpWrapperService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        
    }

    public getReverseChargeReport(companyUniqueName: any, request: ReverseChargeReportRequest): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + REVERSECHARGE_API.VIEW_REPORT;
        url = url.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        url = url.replace(':from', request.from);
        url = url.replace(':to', request.to);
        url = url.replace(':sort', request.sort);
        url = url.replace(':sortBy', request.sortBy);
        url = url.replace(':page', request.page);
        url = url.replace(':count', request.count);
        url = url.replace(':supplierName', request.supplierName);
        url = url.replace(':invoiceNumber', request.invoiceNumber);
        url = url.replace(':supplierCountry', request.supplierCountry);
        url = url.replace(':voucherType', request.voucherType);
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, request)));
    }
}