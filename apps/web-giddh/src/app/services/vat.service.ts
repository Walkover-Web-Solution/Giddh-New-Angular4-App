import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { VAT_API } from './apiurls/vat.api';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { UserDetails } from "../models/api-models/loginModels";
import { VatReportRequest, VatReportResponse } from '../models/api-models/Vat';
import { ErrorHandler } from "./catchManager/catchmanger";
import { HttpWrapperService } from "./httpWrapper.service";
import { Observable } from "rxjs";
import { GroupCreateRequest, GroupResponse } from "../models/api-models/Group";

@Injectable()
export class VatService {
    private companyUniqueName: string;
    private user: UserDetails;

    constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService, private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this.user = this._generalService.user;
    }

    public GetVatReport(request: VatReportRequest): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;

        let url = this.config.apiUrl + VAT_API.VIEWREPORT;
        url = url.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        url = url.replace(':from', request.from);
        url = url.replace(':to', request.to);
        url = url.replace(':taxNumber', request.taxNumber);
        return this._http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<VatReportResponse, any> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, request)));
    }

    public DownloadVatReport(request: VatReportRequest): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;

        let url = this.config.apiUrl + VAT_API.DOWNLOADREPORT;
        url = url.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        url = url.replace(':from', request.from);
        url = url.replace(':to', request.to);
        url = url.replace(':taxNumber', request.taxNumber);
        return this._http.get(url).pipe(
            map((res) => {
                return res;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, request)));
    }
}
