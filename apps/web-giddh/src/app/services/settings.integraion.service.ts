import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './http-wrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { AmazonSellerClass, CashfreeClass, EmailKeyClass, RazorPayClass, RazorPayDetailsResponse, SmsKeyClass, PaymentClass, PaypalDetailsResponse, PayPalClass } from '../models/api-models/SettingsIntegraion';
import { SETTINGS_INTEGRATION_API } from './apiurls/settings.integration.api';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class SettingsIntegrationService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /*
    * Get SMS key
    */
    public GetSMSKey(): Observable<BaseResponse<SmsKeyClass, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.SMS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<SmsKeyClass, string> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<SmsKeyClass, string>(e)));
    }

    /**
     * Save SMS Key
     */
    public SaveSMSKey(model: SmsKeyClass): Observable<BaseResponse<string, SmsKeyClass>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.SMS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<string, SmsKeyClass> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e, model)));
    }

    /*
    * Get Email key
    */
    public GetEmailKey(): Observable<BaseResponse<EmailKeyClass, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.EMAIL?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<EmailKeyClass, string> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<EmailKeyClass, string>(e)));
    }

    /**
     * Save Email Key
     */
    public SaveEmailKey(model: EmailKeyClass): Observable<BaseResponse<string, EmailKeyClass>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.EMAIL?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<string, EmailKeyClass> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, EmailKeyClass>(e, model)));
    }
    /**
     * Save Payment Key
     */
    public SavePaymentKey(model: PaymentClass): Observable<BaseResponse<string, PaymentClass>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.PAYMENT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<string, PaymentClass> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, PaymentClass>(e, model)));
    }
    /**
     * Update Payment Key
     */
    public updatePaymentKey(model): Observable<BaseResponse<string, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.UPDATE_PAYMENT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<string, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, any>(e, model)));
    }

    /*
    * Get Razor pay details
    */
    public GetRazorPayDetails(): Observable<BaseResponse<RazorPayDetailsResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.RAZORPAY?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<RazorPayDetailsResponse, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, string>(e)));
    }

    /*
    * Save Razor pay details
    */
    public SaveRazorPayDetails(model: RazorPayClass): Observable<BaseResponse<RazorPayDetailsResponse, RazorPayClass>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.RAZORPAY?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<RazorPayDetailsResponse, RazorPayClass> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, RazorPayClass>(e, model)));
    }

    /*
    * Update Razor pay details
    */
    public UpdateRazorPayDetails(model: RazorPayClass): Observable<BaseResponse<RazorPayDetailsResponse, RazorPayClass>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.RAZORPAY?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<RazorPayDetailsResponse, RazorPayClass> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, RazorPayClass>(e, model)));
    }

    /*
    * Delete Razor pay details
    */
    public DeleteRazorPayDetails(): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.RAZORPAY?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public SaveCashFreeDetail(model: CashfreeClass): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        delete model['fakeAccObj'];
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.CASHFREE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e, model)));
    }

    public GetCashFreeDetail(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.CASHFREE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e)));
    }

    public UpdateCashFreeDetail(model: CashfreeClass): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        delete model['fakeAccObj'];
        return this.http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.CASHFREE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e, model)));
    }

    public DeleteCashFreeDetail(): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.CASHFREE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public GetAutoCollectUser(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.AUTOCOLLECT_USER?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e)));
    }

    public AddAutoCollectUser(model: CashfreeClass): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        delete model['fakeAccObj'];
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.AUTOCOLLECT_USER?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e, model)));
    }

    public UpdateAutoCollectUser(model: CashfreeClass): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        delete model['fakeAccObj'];
        return this.http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.AUTOCOLLECT_USER?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e, model)));
    }

    public DeleteAutoCollectUser(): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.AUTOCOLLECT_USER?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public GetPaymentGateway(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.PAYMENT_GATEWAY?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e)));
    }

    public AddPaymentGateway(model: CashfreeClass): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.PAYMENT_GATEWAY?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e, model)));
    }

    public UpdatePaymentGateway(model: CashfreeClass): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.PAYMENT_GATEWAY?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e, model)));
    }

    public DeletePaymentGateway(): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.PAYMENT_GATEWAY?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public GetAmazonSeller(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.AMAZON_SELLER?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, AmazonSellerClass[]>(e)));
    }

    public AddAmazonSeller(model: AmazonSellerClass[]): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.AMAZON_SELLER?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any[]> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, AmazonSellerClass[]>(e, model)));
    }

    public UpdateAmazonSeller(model: AmazonSellerClass): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let sellerId = model.sellerId;
        return this.http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.AMAZON_SELLER_OPERATION?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':sellerId', sellerId), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, AmazonSellerClass>(e, model)));
    }

    public DeleteAmazonSeller(sellerId): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.AMAZON_SELLER_OPERATION?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':sellerId', sellerId)).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = { sellerId };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    public GetGmailIntegrationStatus(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.GET_GMAIL_INTEGRATION_STATUS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e)));
    }

    /*
    Remove Gmail Integration
    */
    public RemoveGmailIntegration(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.REMOVE_GMAIL_INTEGRATION?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    public RemoveICICI(bankUserId: any) {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.REMOVE_ICICI_REQUEST?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':bankUserId', bankUserId)).pipe(map((res) => {

            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Get integrated bank validations form
     *
     * @param {string} companyUniqueName Company unique name
     * @param {string} bankName Bank name
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public getValidationFormForBank(companyUniqueName: string, bankName: string): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.BANK_INTERATION_VALIDATION_FORM?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))?.replace(':bankName', bankName)).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e)));
    }

    /**
     * New Bank Account Registration
     *
     * @param {*} model
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public bankAccountRegistration(model: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.BANK_ACCOUNT_REGISTRATION?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Get all connected bank accounts
     *
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public getAllBankAccounts(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.BANK_ACCOUNT_REGISTRATION?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    /**
     * This will use for get plaid token
     *
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public getPlaidLinkToken(itemId?: any): Observable<BaseResponse<any, any>> {
        if (!itemId) {
            itemId = '';
        }
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.GET_PLAID_LINK_TOKEN?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':itemId', itemId)).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    /**
     * This will use for save plaid access token
     *
     * @param {string} key
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public savePlaidAccessToken(model: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.SAVE_PLAID_ACCESS_TOKEN?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Delete the bank account payor
     *
     * @param {*} model
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public deleteBankAccountLogin(model: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.deleteWithBody(this.config.apiUrl + SETTINGS_INTEGRATION_API.BANK_ACCOUNT_REGISTRATION?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Add new bank account payor
     *
     * @param {*} model
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public bankAccountMultiRegistration(model: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.BANK_ACCOUNT_MULTI_REGISTRATION?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Update payor account
     *
     * @param {*} model
     * @param {*} request
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public updatePayorAccount(model: any, request: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.UPDATE_PAYOR_ACCOUNT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':bankAccountUniqueName', encodeURIComponent(request.bankAccountUniqueName))?.replace(':bankUserId', encodeURIComponent(request.bankUserId)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * Update bank account
     *
     * @param {*} model
     * @param {*} request
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public updateAccount(model: any, request: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.UPDATE_ACCOUNT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':bankAccountUniqueName', encodeURIComponent(request.bankAccountUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * This will return payor account registration status
     *
     * @param {*} request
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public getPayorRegistrationStatus(request: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.GET_PAYOR_REGISTRATION_STATUS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':bankAccountUniqueName', encodeURIComponent(request.bankAccountUniqueName))?.replace(':bankUserId', encodeURIComponent(request.bankUserId ?? request.urn))).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    /**
     * This will get the payors list for bank account based on amount limit
     *
     * @param {string} bankAccountUniqueName
     * @param {*} amount
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public getBankAccountPayorsList(bankAccountUniqueName: string, amount: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.GET_BANK_ACCOUNT_PAYORS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':bankAccountUniqueName', bankAccountUniqueName)?.replace(':amount', amount)).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e)));
    }

    /**
     * This will be use for get payapal details
     *
     * @return {*}  {Observable<BaseResponse<PaypalDetailsResponse, string>>}
     * @memberof SettingsIntegrationService
     */
    public getPaypalDetails(): Observable<BaseResponse<PaypalDetailsResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.PAYPAL?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<PaypalDetailsResponse, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<PaypalDetailsResponse, string>(e)));
    }

    /**
     * This will be use for save paypal details
     *
     * @param {PayPalClass} model
     * @return {*}  {Observable<BaseResponse<PaypalDetailsResponse, PayPalClass>>}
     * @memberof SettingsIntegrationService
     */
    public savePaypalDetails(model: PayPalClass): Observable<BaseResponse<PaypalDetailsResponse, PayPalClass>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.PAYPAL?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<PaypalDetailsResponse, PayPalClass> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<PaypalDetailsResponse, PayPalClass>(e, model)));
    }

    /**
     * This will be use for update paypal details
     *
     * @param {PayPalClass} model
     * @return {*}  {Observable<BaseResponse<PaypalDetailsResponse, PayPalClass>>}
     * @memberof SettingsIntegrationService
     */
    public updatePaypalDetails(model: PayPalClass): Observable<BaseResponse<PaypalDetailsResponse, PayPalClass>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.PAYPAL?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<PaypalDetailsResponse, PayPalClass> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<PaypalDetailsResponse, PayPalClass>(e, model)));
    }

    /**
     * This wil be use for delete paypal details
     *
     * @return {*}  {Observable<BaseResponse<string, string>>}
     * @memberof SettingsIntegrationService
     */
    public deletePaypalDetails(): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.PAYPAL?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * This will be use for get all institutions
     *
     * @param {ant} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public getAllInstitutions(model: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.GOCARDLESS.GET_ALL_INSTITUTIONS
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':countryCode', encodeURIComponent(model?.countryCode ?? ''))
            ?.replace(':page', encodeURIComponent(model?.page ?? ''))
            ?.replace(':count', encodeURIComponent(model?.count ?? ''))
        ).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * This will be use for create end user agreement by institution id
     *
     * @param {*} institutionId
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public createEndUserAgreementByInstitutionId(institutionId: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.GOCARDLESS.CREATE_END_USER_AGREEMENT
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':institutionId', encodeURIComponent(institutionId ?? ''))
            , '').pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = '';
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * This will be use for get all institutions
     *
     * @param {ant} requisitionId
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public getRequisition(requisitionId: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.GOCARDLESS.GET_REQUISITION
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':requisitionId', encodeURIComponent(requisitionId ?? ''))
        ).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * This wil be use for delete end user agreement details
     *
     * @param {string} agreementId
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public deleteEndUserAgreementDetails(agreementId: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.GOCARDLESS.DELETE_END_USER_AGREEMENT
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':agreementId', encodeURIComponent(agreementId))
        ).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }
}
