import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './httpWrapper.service';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { CommonPaginatedRequest } from '../models/api-models/Invoice';
import { ActionPettycashRequest, PettyCashReportResponse, PettyCashResonse } from '../models/api-models/Expences';
import { EXPENSE_API } from './apiurls/expense.api';

@Injectable()
export class ExpenseService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, public http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    public getPettycashReports(request: CommonPaginatedRequest): Observable<BaseResponse<PettyCashReportResponse, any>> {
        request.status = 'pending';
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.createQueryString(this.config.apiUrl + EXPENSE_API.GET, {
            page: request.page, count: request.count, sort: request.sort, sortBy: request.sortBy
        });
        return this.http.post(url.replace(':companyUniqueName', this.companyUniqueName), request).pipe(
            map((res) => {
                let data: BaseResponse<PettyCashReportResponse, any> = res;
                data.request = request;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<PettyCashReportResponse, any>(e)));
    }

    public getPettycashRejectedReports(request: CommonPaginatedRequest): Observable<BaseResponse<PettyCashReportResponse, any>> {
        request.status = 'rejected';
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.createQueryString(this.config.apiUrl + EXPENSE_API.GET, {
            page: request.page, count: request.count, sort: request.sort, sortBy: request.sortBy
        });

        return this.http.post(url.replace(':companyUniqueName', this.companyUniqueName), request).pipe(
            map((res) => {
                let data: BaseResponse<PettyCashReportResponse, any> = res;
                data.request = request;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<PettyCashReportResponse, any>(e)));
    }

    public actionPettycashReports(requestObj: ActionPettycashRequest, model?: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + EXPENSE_API.ACTION
            .replace(':companyUniqueName', this.companyUniqueName)
            .replace(':uniqueName', requestObj.uniqueName)
            .replace(':accountUniqueName', encodeURIComponent(requestObj.accountUniqueName))
            .replace(':actionType', requestObj.actionType);

        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }

        return this.http.post(url, model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = requestObj;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    public getPettycashEntry(uniqueName: string): Observable<BaseResponse<PettyCashResonse, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + EXPENSE_API.GETEntry
            .replace(':companyUniqueName', this.companyUniqueName)
            .replace(':accountUniqueName', encodeURIComponent(uniqueName))).pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    private createQueryString(str, model) {
        let url = str + '?';
        if ((model.page)) {
            url = url + 'page=' + model.page;
        }
        if ((model.count)) {
            url = url + '&count=' + model.count;
        }

        if ((model.type)) {
            url = url + '&type=' + model.type;
        }
        if ((model.sort)) {
            url = url + '&sort=' + model.sort;
        }
        if ((model.sortBy)) {
            url = url + '&sortBy=' + model.sortBy;
        }
        return url;
    }

}
