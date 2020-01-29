import { catchError, map } from 'rxjs/operators';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { TALLY_SYNC_API } from "./apiurls/tally-sync";
import { TallySyncResponseData, DownloadTallyErrorLogRequest } from "../models/api-models/tally-sync";

@Injectable()
export class TallySyncService {

    constructor(private errorHandler: ErrorHandler,
        private _http: HttpWrapperService,
        private _generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    //
    public getCompletedSync(from: string, to: string) {
        const companyUniqueName = this._generalService.companyUniqueName;
        const url = this.config.apiUrl + TALLY_SYNC_API.COMPLETED
            .replace(':companyUniqueName', companyUniqueName)
            .replace(':from', from)
            .replace(':to', to)
            .replace(':page', '1')
            .replace(':count', '20')
            .replace(':sortBy', 'desc')
            ;
        return this._http.get(url).pipe(map((res) => {
            return res.body;
        }), catchError((e) => this.errorHandler.HandleCatch<TallySyncResponseData, string>(e)));
    }

    public getInProgressSync() {
        const url = this.config.apiUrl + TALLY_SYNC_API.INPROGRESS
            .replace(':page', '1')
            .replace(':count', '20')
            .replace(':sortBy', 'desc')
            ;
        return this._http.get(url).pipe(map((res) => {
            return res.body;
        }), catchError((e) => this.errorHandler.HandleCatch<TallySyncResponseData, string>(e)));
    }

    public getErrorLog(companyUniqueName: string, model: DownloadTallyErrorLogRequest) {
        const url = this.config.apiUrl + TALLY_SYNC_API.ERROR_LOG
            .replace(':companyUniqueName', companyUniqueName);
        return this._http.get(url, model).pipe(map((res) => {
            return res;
        }), catchError((e) =>
            this.errorHandler.HandleCatch<TallySyncResponseData, string>(e))
        );
    }


}
