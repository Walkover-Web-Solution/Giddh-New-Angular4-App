import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { empty, Observable, of, throwError } from 'rxjs';
import { LoaderService } from '../loader/loader.service';
import { GeneralService } from './general.service';
import { OrganizationType } from '../models/user-login-state';
import { LocaleService } from './locale.service';
import { catchError, retryWhen, tap } from 'rxjs/operators';

@Injectable()
export class GiddhHttpInterceptor implements HttpInterceptor {

    private isOnline: boolean = navigator.onLine;

    constructor(
        private toasterService: ToasterService,
        private loadingService: LoaderService,
        private generalService: GeneralService,
        private localeService: LocaleService
    ) {
        window.addEventListener('online', () => {
            this.isOnline = true;
        });
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.generalService.currentOrganizationType === OrganizationType.Branch && request && request.urlWithParams) {
            request = this.addBranchUniqueName(request);
        }
        request = this.addLanguage(request);
        if (this.isOnline) {
            /** Holds api call retry limit */
            let retryLimit: number = 1;
            /** Holds api call retry attempts */
            let retryAttempts: number = 0;

            return next.handle(request).pipe(
                // retryWhen operator should come before catchError operator as it is more specific
                retryWhen(errors => errors.pipe(
                    // inside the retryWhen, use a tap operator to throw an error 
                    // if you don't want to retry
                    tap(error => {
                        if (!error.headers.get("retry-after") || retryAttempts >= retryLimit) {
                            throw error;
                        } else {
                            retryAttempts++;
                        }
                    })
                )),
                // now catch all other errors
                catchError((error) => {
                    if (retryAttempts === 1) {
                        return throwError(error);
                    } else {
                        return empty();
                    }
                })
            );
        } else {
            setTimeout(() => {
                this.toasterService.warningToast(this.localeService.translate("app_messages.internet_error"), this.localeService.translate("app_messages.internet_disconnected"));
            }, 100);
            this.loadingService.hide();
            if (request.body && request.body.handleNetworkDisconnection) {
                return of(new HttpResponse({ status: 200, body: { status: 'no-network' } }));
            } else {
                return of();
            }
        }
    }

    /**
     * Adds branch unique name to every API call if branch is switched
     *
     * @private
     * @param {HttpRequest<any>} request Current request
     * @returns {HttpRequest<any>} Http request to carry out API call
     * @memberof GiddhHttpInterceptor
     */
    private addBranchUniqueName(request: HttpRequest<any>): HttpRequest<any> {
        if (!request.params.has('branchUniqueName') && !request.url.includes('branchUniqueName') && !request.url.includes('.json')) {
            request = request.clone({
                params: request.params.append('branchUniqueName', encodeURIComponent(this.generalService.currentBranchUniqueName))
            });
        }
        return request;
    }

    /**
     * Adds language code to every API call
     *
     * @private
     * @param {HttpRequest<any>} request
     * @returns {HttpRequest<any>}
     * @memberof GiddhHttpInterceptor
     */
    private addLanguage(request: HttpRequest<any>): HttpRequest<any> {
        if (!request.params.has('lang') && !request.url.includes('.json')) {
            request = request.clone({
                params: request.params.append('lang', (this.localeService.language || "en"))
            });
        }
        return request;
    }
}
