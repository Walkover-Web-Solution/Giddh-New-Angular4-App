import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { Observable, of } from 'rxjs';
import { LoaderService } from '../loader/loader.service';
import { GeneralService } from './general.service';
import { OrganizationType } from '../models/user-login-state';

@Injectable()
export class GiddhHttpInterceptor implements HttpInterceptor {

    private isOnline: boolean = navigator.onLine;

    constructor(
        private _toasterService: ToasterService,
        private loadingService: LoaderService,
        private generalService: GeneralService
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
        if (this.isOnline) {
            return next.handle(request);
        } else {
            setTimeout(() => {
                this._toasterService.warningToast('Please check your internet connection.', 'Internet disconnected');
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
        request = request.clone({
            params: request.params.append('branchUniqueName', this.generalService.currentBranchUniqueName)
        });
        return request;
    }
}
