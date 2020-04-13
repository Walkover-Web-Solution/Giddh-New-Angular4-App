import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { EXCEPTION_NON_PROD_API, EXCEPTION_PROD_API } from './apiurls/exceptionlog.api';
import { HttpWrapperService } from "./httpWrapper.service";
import { Observable } from "rxjs";
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';

@Injectable()
export class ExceptionLogService {
    private companyUniqueName: string;

    constructor(private errorHandler: ErrorHandler, private http: HttpWrapperService, private generalService: GeneralService) {

    }

    /**
     * This will Add UI Exception on slack channel #giddh-ui-exception
     *
     * @param {*} request
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof ExceptionLogService
     */
    public addUiException(request: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

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

        return this.http.post(url, payload, options).pipe(
            map((response) => {
                return response;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, request)));
    }
}
