import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SettingsIntegrationService {

    constructor() { }

    public GetSMSKey(): Observable<any> {
        return of({ status: 'success', body: {} });
    }

    public GetEmailKey(): Observable<any> {
        return of({ status: 'success', body: {} });
    }

    public SaveSMSKey(payload: any): Observable<any> {
        return of({ status: 'success', body: payload });
    }

    public SaveEmailKey(payload: any): Observable<any> {
        return of({ status: 'success', body: payload });
    }

    public GetRazorPayDetails(): Observable<any> {
        return of({ status: 'success', body: {} });
    }

    public SaveRazorPayDetails(payload: any): Observable<any> {
        return of({ status: 'success', body: payload });
    }

    public DeleteRazorPayDetails(): Observable<any> {
        return of({ status: 'success', body: {} });
    }

    public GetPaymentGateway(): Observable<any> {
        return of({ status: 'success', body: {} });
    }

    public AddPaymentGateway(payload: any): Observable<any> {
        return of({ status: 'success', body: payload });
    }

    public UpdatePaymentGateway(payload: any): Observable<any> {
        return of({ status: 'success', body: payload });
    }

    public DeletePaymentGateway(): Observable<any> {
        return of({ status: 'success', body: {} });
    }

    public UpdateAutoCollectUser(payload: any): Observable<any> {
        return of({ status: 'success', body: payload });
    }

    public AddAmazonSeller(payload: any): Observable<any> {
        return of({ status: 'success', body: payload });
    }

    public UpdateAmazonSeller(payload: any): Observable<any> {
        return of({ status: 'success', body: payload });
    }

    public DeleteAmazonSeller(payload: any): Observable<any> {
        return of({ status: 'success', body: payload });
    }

    public GetAmazonSeller(): Observable<any> {
        return of({ status: 'success', body: {} });
    }

    public GetGmailIntegrationStatus(): Observable<any> {
        return of({ status: 'success', body: {} });
    }

    public RemoveICICI(payload: any): Observable<any> {
        return of({ status: 'success', body: payload });
    }

    public RemoveGmailIntegration(): Observable<any> {
        return of({ status: 'success', body: {} });
    }
}
