import { map, catchError } from 'rxjs/operators';
import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { EXCEPTION_NON_PROD_API, EXCEPTION_PROD_API } from './apiurls/exception-log.api';
import { HttpWrapperService } from "./httpWrapper.service";
import { Observable } from "rxjs";
import { } from ''
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';

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
        console.info('Errorrrr occurred: ', error);
        this.addUiException({component: '', exception: error.stack}).subscribe(() => {}, () => {});
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
        this.companyUniqueName = generalService.companyUniqueName;

        let payloadJson = {
            text: "Company Unique Name: " + this.companyUniqueName,
            fields: [{
                title: request.component,
                value: request.exception,
                short: false
            }],
            color: 'danger'
        };

        let url = (PRODUCTION_ENV || isElectron || isCordova) ? EXCEPTION_PROD_API : EXCEPTION_NON_PROD_API;
        let options = { headers: [] };
        options.headers["Content-Type"] = "application/x-www-form-urlencoded";

        let payload = "payload=" + JSON.stringify(payloadJson);

        return http.post(url, payload, options).pipe(
            map((response) => {
                return response;
            }),
            catchError((e) => errorHandler.HandleCatch<any, any>(e, request)));
    }
}
