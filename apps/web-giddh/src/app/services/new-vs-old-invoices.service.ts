import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { HttpWrapperService } from './http-wrapper.service';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { NEWVSOLDINVOICE_API } from './apiurls/new-vs-old-invocies.api';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { NewVsOldInvoicesRequest, NewVsOldInvoicesResponse } from '../models/api-models/new-vs-old-invoices';
import { get } from '../lodash-optimized';

@Injectable({
    providedIn: 'root'
})
export class NewVsOldInvoicesService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this.companyUniqueName = this.generalService.companyUniqueName;
    }

    /**
     * Fetches the New vs Old Invoices report without sales person filter.
     * Uses a GET request with type and value as query parameters.
     *
     * @param {NewVsOldInvoicesRequest} queryRequest - Request parameters including type and value
     * @returns {Observable<BaseResponse<NewVsOldInvoicesResponse, string>>}
     * @memberof NewVsOldInvoicesService
     */
    public GetNewVsOldInvoices(queryRequest: NewVsOldInvoicesRequest): Observable<BaseResponse<NewVsOldInvoicesResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + NEWVSOLDINVOICE_API.GET
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':type', queryRequest.type?.toString())
            ?.replace(':value', queryRequest?.value?.toString()))
            .pipe(map((res) => {
                let data: BaseResponse<NewVsOldInvoicesResponse, string> = res;
                data.queryString = queryRequest;
                return data;
            }),
                catchError((e) => this.errorHandler.HandleCatch<NewVsOldInvoicesResponse, string>(e, null, queryRequest)));
    }

    /**
     * Fetches the New vs Old Invoices report filtered by sales person(s).
     * Uses a POST request to send the salesPersonUniqueNames in the request body.
     *
     * @param {NewVsOldInvoicesRequest} queryRequest - Request parameters including type, value and salesPersonUniqueNames
     * @returns {Observable<BaseResponse<NewVsOldInvoicesResponse, string>>}
     * @memberof NewVsOldInvoicesService
     */
    public PostNewVsOldInvoices(queryRequest: NewVsOldInvoicesRequest): Observable<BaseResponse<NewVsOldInvoicesResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        const url = this.config.apiUrl + NEWVSOLDINVOICE_API.POST
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':type', queryRequest.type?.toString())
            ?.replace(':value', queryRequest?.value?.toString());
        const body = {
            duration: 'salesPerson',
            salesPersonUniqueNames: queryRequest.salesPersonUniqueNames ?? []
        };
        return this.http.post(url, body)
            .pipe(map((res) => {
                let data: BaseResponse<NewVsOldInvoicesResponse, string> = res;
                data.queryString = queryRequest;
                return data;
            }),
                catchError((e) => this.errorHandler.HandleCatch<NewVsOldInvoicesResponse, string>(e, null, queryRequest)));
    }
}
