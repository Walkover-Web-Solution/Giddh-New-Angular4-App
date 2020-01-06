import { map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { COMMON_API } from './apiurls/common.api';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { CommandKRequest } from '../models/api-models/Common';
import { ErrorHandler } from "./catchManager/catchmanger";
import { HttpWrapperService } from "./httpWrapper.service";
import { Observable } from "rxjs";

@Injectable()
export class CommandKService {
    private companyUniqueName: string;

    constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService, private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this.companyUniqueName = this._generalService.companyUniqueName;
    }

    public searchCommandK(request: CommandKRequest): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.COMMAND_K;
        url = url.replace(':companyUniqueName', this.companyUniqueName);
        url = url.replace(':page', request.page);
        url = url.replace(':q', request.q);
        url = url.replace(':group', request.group);
        return this._http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }));
    }
}
