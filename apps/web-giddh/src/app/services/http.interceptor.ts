import { Observable, of } from 'rxjs';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

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
            return of();
        }
    }
}
