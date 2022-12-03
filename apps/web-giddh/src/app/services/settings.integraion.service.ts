import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { AmazonSellerClass, CashfreeClass, EmailKeyClass, RazorPayClass, RazorPayDetailsResponse, SmsKeyClass, PaymentClass } from '../models/api-models/SettingsIntegraion';
import { SETTINGS_INTEGRATION_API, SETTINGS_INTEGRATION_COMMUNICATION_API } from './apiurls/settings.integration.api';
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

    public RemoveICICI(urn) {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.REMOVE_ICICI_REQUEST?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':urn', urn)).pipe(map((res) => {

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
        return this.http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.UPDATE_PAYOR_ACCOUNT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':bankAccountUniqueName', encodeURIComponent(request.bankAccountUniqueName))?.replace(':urn', encodeURIComponent(request.urn)), model).pipe(map((res) => {
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

        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.GET_PAYOR_REGISTRATION_STATUS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':bankAccountUniqueName', encodeURIComponent(request.bankAccountUniqueName))?.replace(':urn', encodeURIComponent(request.urn))).pipe(map((res) => {
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
     * Get platforms and fields for integration
     *
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public getCommunicationPlatforms(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.GET_PLATFORMS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Verifies the integration with communication platform
     *
     * @param {*} model
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public verifyCommunicationPlatform(model: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.VERIFY_PLATFORM.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Deletes the integration with communication platform
     *
     * @param {string} platformUniqueName
     * @returns {Observable<BaseResponse<string, string>>}
     * @memberof SettingsIntegrationService
     */
    public deleteCommunicationPlatform(platformUniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.DELETE_PLATFORM.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':platformUniqueName', platformUniqueName)).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Gets the list of triggers
     *
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public getTriggersList(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.GET_TRIGGERS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Deletes the trigger
     *
     * @param {string} triggerUniqueName
     * @returns {Observable<BaseResponse<string, string>>}
     * @memberof SettingsIntegrationService
     */
    public deleteTrigger(triggerUniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.DELETE_TRIGGER.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':triggerUniqueName', triggerUniqueName)).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Gets the trigger form
     *
     * @param {string} platform
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsIntegrationService
     */
    public getTriggerForm(platform: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.GET_TRIGGER_FORM.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':platform', platform)).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public getFieldSuggestions(platform: string, entity:string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.GET_FIELD_SUGGESTIONS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':platform', platform).replace(':entity', entity)).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public getCampaignFields(slug: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.GET_CAMPAIGN_FIELDS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':slug', slug)).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public getCampaignList(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.GET_CAMPAIGN_LIST.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public getTriggerByUniqueName(triggerUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_INTEGRATION_COMMUNICATION_API.GET_TRIGGERS_BY_UNIQUENAME.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':triggerUniqueName', triggerUniqueName)).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public createTrigger(model: SmsKeyClass): Observable<BaseResponse<string, SmsKeyClass>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.SMS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<string, SmsKeyClass> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e, model)));
    }
}
