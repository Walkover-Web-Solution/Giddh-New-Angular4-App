import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { HttpWrapperService } from './httpWrapper.service';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { NEWVSOLDINVOICE_API } from './apiurls/new-vs-old-invocies.api';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { NewVsOldInvoicesRequest, NewVsOldInvoicesResponse } from '../models/api-models/new-vs-old-invoices';

@Injectable()
export class NewVsOldInvoicesService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this.companyUniqueName = this.generalService.companyUniqueName;
    }

    public GetNewVsOldInvoices(queryRequest: NewVsOldInvoicesRequest): Observable<BaseResponse<NewVsOldInvoicesResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + NEWVSOLDINVOICE_API.GET
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':type', queryRequest.type?.toString())
            ?.replace(':value', queryRequest.value?.toString()))
            .pipe(map((res) => {
                let data: BaseResponse<NewVsOldInvoicesResponse, string> = res;
                data.queryString = queryRequest;
                return data;
            }),
                catchError((e) => this.errorHandler.HandleCatch<NewVsOldInvoicesResponse, string>(e, null, queryRequest)));
    }
}
