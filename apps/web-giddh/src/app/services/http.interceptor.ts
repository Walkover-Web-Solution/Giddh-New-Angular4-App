import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class GiddhHttpInterceptor implements HttpInterceptor {

    private isOnline: boolean = navigator.onLine;

    constructor(private _toasterService: ToasterService) {
        window.addEventListener('online', () => {
            this.isOnline = true;
        });
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
}
