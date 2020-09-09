import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { Observable, of } from 'rxjs';
import { GeneralService } from './general.service';
import { OrganizationType } from '../models/user-login-state';

@Injectable()
export class GiddhHttpInterceptor implements HttpInterceptor {

    private isOnline: boolean = navigator.onLine;

    constructor(
        private _toasterService: ToasterService,
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
            request = this.addBranchUnqiueName(request);
        }
        if (this.isOnline) {
            return next.handle(request);
        } else {
            setTimeout(() => {
                this._toasterService.warningToast('Please check your internet connection.', 'Internet disconnected');
            }, 100);
            if (request.body && request.body.handleNetworkDisconnection) {
                return of(new HttpResponse({ status: 200, body: { status: 'no-network' } }));
            } else {
                return of();
            }
        }
    }

    private addBranchUnqiueName(request: HttpRequest<any>): HttpRequest<any> {
        const delemiter = request.urlWithParams.includes('?') ? '&' : '?';
        if (!request.urlWithParams.includes('branchUniqueName')) {
            request = request.clone({
                url: `${request.url}${delemiter}branchUniqueName=${this.generalService.currentBranchUniqueName}`
            });
        }
        return request;
    }
}
