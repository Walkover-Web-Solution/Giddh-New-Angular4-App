import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { AmazonSellerClass, CashfreeClass, EmailKeyClass, RazorPayClass, RazorPayDetailsResponse, SmsKeyClass, PaymentClass } from '../models/api-models/SettingsIntegraion';
import { SETTINGS_INTEGRATION_API } from './apiurls/settings.integration.api';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class SettingsIntegrationService {

    private user: UserDetails;
    private companyUniqueName: string;

    constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
        private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /*
    * Get SMS key
    */
    public GetSMSKey(): Observable<BaseResponse<SmsKeyClass, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.SMS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<SmsKeyClass, string> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<SmsKeyClass, string>(e)));
    }

    /**
     * Save SMS Key
     */
    public SaveSMSKey(model: SmsKeyClass): Observable<BaseResponse<string, SmsKeyClass>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.SMS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<string, SmsKeyClass> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e, model)));
    }

    /*
    * Get Email key
    */
    public GetEmailKey(): Observable<BaseResponse<EmailKeyClass, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.EMAIL.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<EmailKeyClass, string> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<EmailKeyClass, string>(e)));
    }

    /**
     * Save Email Key
     */
    public SaveEmailKey(model: EmailKeyClass): Observable<BaseResponse<string, EmailKeyClass>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.EMAIL.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<string, EmailKeyClass> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, EmailKeyClass>(e, model)));
    }
    /**
     * Save Payment Key
     */
    public SavePaymentKey(model: PaymentClass): Observable<BaseResponse<string, PaymentClass>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.PAYMENT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<string, PaymentClass> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, PaymentClass>(e, model)));
    }
    /**
     * Update Payment Key
     */
    public updatePaymentKey(model): Observable<BaseResponse<string, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.UPADTE_PAYMENT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<string, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, any>(e, model)));
    }
    /*
    * Get Razor pay details
    */
    public GetRazorPayDetails(): Observable<BaseResponse<RazorPayDetailsResponse, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.RAZORPAY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<RazorPayDetailsResponse, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, string>(e)));
    }

    /*
    * Save Razor pay details
    */
    public SaveRazorPayDetails(model: RazorPayClass): Observable<BaseResponse<RazorPayDetailsResponse, RazorPayClass>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.RAZORPAY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<RazorPayDetailsResponse, RazorPayClass> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, RazorPayClass>(e, model)));
    }

    /*
    * Update Razor pay details
    */
    public UpdateRazorPayDetails(model: RazorPayClass): Observable<BaseResponse<RazorPayDetailsResponse, RazorPayClass>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.RAZORPAY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<RazorPayDetailsResponse, RazorPayClass> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, RazorPayClass>(e, model)));
    }

    /*
    * Delete Razor pay details
    */
    public DeleteRazorPayDetails(): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.RAZORPAY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public SaveCashFreeDetail(model: CashfreeClass): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        delete model['fakeAccObj'];
        return this._http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.CASHFREE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e, model)));
    }

    public GetCashFreeDetail(): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.CASHFREE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e)));
    }

    public UpdateCashFreeDetail(model: CashfreeClass): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        delete model['fakeAccObj'];
        return this._http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.CASHFREE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e, model)));
    }

    public DeleteCashFreeDetail(): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.CASHFREE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public GetAutoCollectUser(): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.AUTOCOLLECT_USER.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e)));
    }

    public AddAutoCollectUser(model: CashfreeClass): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        delete model['fakeAccObj'];
        return this._http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.AUTOCOLLECT_USER.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e, model)));
    }

    public UpdateAutoCollectUser(model: CashfreeClass): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        delete model['fakeAccObj'];
        return this._http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.AUTOCOLLECT_USER.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e, model)));
    }

    public DeleteAutoCollectUser(): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.AUTOCOLLECT_USER.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public GetPaymentGateway(): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.PAYMENT_GATEWAY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e)));
    }

    public AddPaymentGateway(model: CashfreeClass): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.PAYMENT_GATEWAY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e, model)));
    }

    public UpdatePaymentGateway(model: CashfreeClass): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.PAYMENT_GATEWAY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e, model)));
    }

    public DeletePaymentGateway(): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.PAYMENT_GATEWAY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public GetAmazonSeller(): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.AMAZON_SELLER.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, AmazonSellerClass[]>(e)));
    }

    public AddAmazonSeller(model: AmazonSellerClass[]): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.AMAZON_SELLER.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any[]> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, AmazonSellerClass[]>(e, model)));
    }

    public UpdateAmazonSeller(model: AmazonSellerClass): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        let sellerId = model.sellerId;
        return this._http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.AMAZON_SELLER_OPERATION.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':sellerId', sellerId), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, AmazonSellerClass>(e, model)));
    }

    public DeleteAmazonSeller(sellerId): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.AMAZON_SELLER_OPERATION.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':sellerId', sellerId)).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = { sellerId };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    public GetGmailIntegrationStatus(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.GET_GMAIL_INTEGRATION_STATUS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e)));
    }

    /*
    Remove Gmail Integration
    */
    public RemoveGmailIntegration(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.REMOVE_GMAIL_INTEGRATION.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    public RemoveICICI(urn) {
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.REMOVE_ICICI_REQUEST.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':urn', urn)).pipe(map((res) => {

            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }
}
