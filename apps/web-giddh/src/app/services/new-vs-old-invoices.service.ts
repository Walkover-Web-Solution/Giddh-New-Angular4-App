import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, OnInit, Optional } from '@angular/core';
import { ErrorHandler } from './catchManager/catchmanger';
import { HttpWrapperService } from './httpWrapper.service';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { NEWVSOLDINVOICE_API } from './apiurls/new-vs-old-invocies.api';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { NewVsOldInvoicesRequest, NewVsOldInvoicesResponse } from '../models/api-models/new-vs-old-invoices';

@Injectable()
export class NewVsOldInvoicesService implements OnInit {
    private companyUniqueName: string;

    constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
        private _generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this.companyUniqueName = this._generalService.companyUniqueName;
    }

    public ngOnInit() {
        //
    }

    public GetNewVsOldInvoices(queryRequest: NewVsOldInvoicesRequest): Observable<BaseResponse<NewVsOldInvoicesResponse, string>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + NEWVSOLDINVOICE_API.GET
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':type', queryRequest.type.toString())
            .replace(':value', queryRequest.value.toString()))
            .pipe(map((res) => {
                let data: BaseResponse<NewVsOldInvoicesResponse, string> = res;
                data.queryString = queryRequest;
                return data;
            }),
                catchError((e) => this.errorHandler.HandleCatch<NewVsOldInvoicesResponse, string>(e, null, queryRequest)));
    }
}
