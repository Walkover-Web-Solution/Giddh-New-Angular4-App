import { catchError, map } from 'rxjs/operators';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { TALLY_SYNC_API } from "./apiurls/tally-sync";
import { TallySyncResponseData, DownloadTallyErrorLogRequest } from "../models/api-models/tally-sync";
import { CommonPaginatedRequest } from '../models/api-models/Invoice';

@Injectable()
export class TallySyncService {

    constructor(private errorHandler: GiddhErrorHandler,
        private http: HttpWrapperService,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    public getCompletedSync(model: CommonPaginatedRequest) {
        const companyUniqueName = this.generalService.companyUniqueName;
        const url = this.config.apiUrl + TALLY_SYNC_API.COMPLETED
            ?.replace(':companyUniqueName', companyUniqueName);
        return this.http.get(url, model).pipe(map((res) => {
            return res.body;
        }), catchError((e) => this.errorHandler.HandleCatch<TallySyncResponseData, string>(e)));
    }

    public getInProgressSync(model: CommonPaginatedRequest) {
        const companyUniqueName = this.generalService.companyUniqueName;
        const url = this.config.apiUrl + TALLY_SYNC_API.INPROGRESS
            ?.replace(':companyUniqueName', companyUniqueName);
        return this.http.get(url, model).pipe(map((res) => {
            return res.body;
        }), catchError((e) => this.errorHandler.HandleCatch<TallySyncResponseData, string>(e)));
    }

    public getErrorLog(companyUniqueName: string, model: DownloadTallyErrorLogRequest) {
        const url = this.config.apiUrl + TALLY_SYNC_API.ERROR_LOG
            ?.replace(':companyUniqueName', companyUniqueName);
        return this.http.get(url, model).pipe(map((res) => {
            return res;
        }), catchError((e) =>
            this.errorHandler.HandleCatch<TallySyncResponseData, string>(e))
        );
    }
}
