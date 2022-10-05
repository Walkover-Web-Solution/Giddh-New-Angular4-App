import { Injectable, Optional, Inject } from '@angular/core';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpWrapperService } from '../httpWrapper.service';
import { IServiceConfigArgs, ServiceConfig } from '../service.config';
import { ERROR_LOG_API } from '../apiurls/exception-log.api';
import { take } from 'rxjs/operators';

@Injectable()
export class GiddhErrorHandler {

    constructor(
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs,
        private router: Router,
        private http: HttpWrapperService,
        private store: Store<AppState>
    ) { }

    public HandleCatch<TResponce, TRequest>(r: HttpErrorResponse, request?: any, queryString?: any): Observable<BaseResponse<TResponce, TRequest>> {
        let data: BaseResponse<TResponce, TRequest> = new BaseResponse<TResponce, TRequest>();
        // logout if invalid session detacted
        if (r?.status === 0) {
            data = {
                body: null,
                code: 'Internal Error',
                message: 'something went wrong',
                status: 'error'
            };
            data.request = request;
            data.queryString = queryString;
        } else {
            this.logApiError(r);
            if (r?.status === 500 ||
                r?.status === 501 ||
                r?.status === 502 ||
                r?.status === 503 ||
                r?.status === 504 ||
                r?.status === 505 ||
                r?.status === 506 ||
                r?.status === 507 ||
                r?.status === 508 ||
                r?.status === 509 ||
                r?.status === 510 ||
                r?.status === 511
            ) {
                data.status = 'error';
                data.message = 'Something went wrong';
                data.body = null;
                data.code = 'Internal Error';
            } else {
                data = r.error as any;
                if (data) {
                    if (data.code === 'SESSION_EXPIRED_OR_INVALID') {
                        this.store.dispatch({ type: 'LoginOut' });
                    } else if (data.code === 'INVALID_JSON') {
                        let dataToSend = {
                            requestBody: '',
                            queryString: data.queryString,
                            method: '',
                            url: r.url,
                            email: null,
                            userUniqueName: null,
                            environment: null,
                            key: r.error.message ? r.error.message.substring(r.error.message.indexOf(':') + 2, r.error.message.length) : null,
                        };
                        this.store.dispatch({ type: 'REPORT_INVALID_JSON', payload: dataToSend });
                    } else if (data.code === '') {
                        // handle unshared company response
                    }
                    if (typeof data !== 'string') {
                        data.request = request;
                        data.queryString = queryString;
                    }
                }
            }
        }

        if(typeof data === "string") {
            data = {
                statusCode: r?.status
            };
        } else {
            data.statusCode = r?.status;
        }

        return new Observable<BaseResponse<TResponce, TRequest>>((o) => {
            o.next(data);
        });
    }

    /**
     * Logs error to API
     *
     * @param {HttpErrorResponse} response Error response received from the API/UI
     * @memberof GiddhErrorHandler
     */
    public logApiError(response: HttpErrorResponse): void {
        const apiError = response?.error as any;
        const errorCode = apiError?.code ? apiError?.code : response?.status;
        const errorMessage = apiError?.message ? apiError?.message : 'Bad Gateway';
        const requestObject = {
            apiErrorMessage: `Code: ${errorCode}, Message: ${errorMessage}`,
            apiUrl: response?.url,
            uiPageUrl: this.router.url ? this.router.url?.replace(/\/ledger\/.*/, '/ledger/account_unique_name') : '',
        };
        const url = `${this.config ? this.config.apiUrl : ''}${ERROR_LOG_API}`;
        this.http.post(url, requestObject).pipe(take(1)).subscribe(() => { }, () => { });
    }
}

export function HandleCatch<TResponce, TRequest>(r: any, request?: any, queryString?: any): Observable<BaseResponse<TResponce, TRequest>> {
    let data: BaseResponse<TResponce, TRequest> = new BaseResponse<TResponce, TRequest>();
    // logout if invalid session detacted
    if (r?.status === 0) {
        data = {
            body: null,
            code: 'Internal Error',
            message: 'something went wrong',
            status: 'error'
        };
        data.request = request;
        data.queryString = queryString;
    } else {
        if (r?.text() === '') {
            data.status = 'error';
            data.message = 'Something went wrong';
            data.body = null;
            data.code = 'Internal Error';
        } else {
            data = r?.json();
            if (data.code === 'SESSION_EXPIRED_OR_INVALID') {
                this.store.dispatch({ type: 'LoginOut' });
            }
        }
        data.request = request;
        data.queryString = queryString;
    }
    return new Observable<BaseResponse<TResponce, TRequest>>((o) => {
        o.next(data);
    });
}
