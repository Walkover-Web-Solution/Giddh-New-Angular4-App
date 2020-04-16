import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BaseResponse } from '../models/api-models/BaseResponse';
import { EXCEPTION_API } from './apiurls/exception-log.api';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { HttpWrapperService } from './httpWrapper.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class ExceptionLogService implements ErrorHandler {
    /** Company unique name for current session */
    private companyUniqueName: string;

    /** @ignore */
    constructor(
        private injector: Injector
    ) { }

    /**
     * Publishes the error to server
     *
     * @param {*} error Error
     * @memberof ExceptionLogService
     */
    public handleError(error: any): void {
        this.addUiException({ component: '', exception: error.stack }).subscribe(() => { }, () => { });
        throw error;
    }

    /**
     * This will Add UI Exception on slack channel #giddh-ui-exception
     *
     * @param {*} request
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof ExceptionLogService
     */
    public addUiException(request: any): Observable<BaseResponse<any, any>> {
        // Need to inject manually as ErrorHandler service is instantiated first and
        // dependency injection is not available at that time
        const generalService = this.injector.get(GeneralService);
        const http = this.injector.get(HttpWrapperService);
        const errorHandler = this.injector.get(GiddhErrorHandler);
        const config: IServiceConfigArgs = this.injector.get(ServiceConfig) as IServiceConfigArgs;
        const router = this.injector.get(Router);


        this.companyUniqueName = generalService.companyUniqueName;
        const payloadJson = {
            user_agent: navigator.userAgent,
            user: this.companyUniqueName,
            page: router.url,
            error: (request.component) ? `${request.component} ${request.exception}` : request.exception,
            env: (PRODUCTION_ENV) ? 'PROD' : (STAGING_ENV) ? 'STAGE' : 'TEST'
        };

        const url = `${config.apiUrl}${EXCEPTION_API}`;

        return http.post(url, payloadJson).pipe(
            catchError((e) => errorHandler.HandleCatch<any, any>(e, request)));
    }
}
