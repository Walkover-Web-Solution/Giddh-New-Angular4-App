import { empty as observableEmpty, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
    ICurrencyResponse,
    SocketNewCompanyRequest,
    CompanyCreateRequest,
    StatesRequest
} from './../models/api-models/Company';
import { AccountSharedWithResponse } from '../models/api-models/Account';
import {
    CompanyResponse,
    StateDetailsRequest,
    StateDetailsResponse,
    States,
    TaxResponse
} from '../models/api-models/Company';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { COMPANY_API } from './apiurls/comapny.api';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { BulkEmailRequest } from '../models/api-models/Search';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { IRegistration, GetOTPRequest, BulkPaymentResponse, BulkPaymentConfirmRequest } from "../models/interfaces/registration.interface";
import { ReportsRequestModel, ReportsResponseModel } from "../models/api-models/Reports";

@Injectable()
export class CompanyService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService, private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this.companyUniqueName = this.generalService.companyUniqueName;
    }

    /**
     * CreateNewCompanyPage
     */
    public CreateNewCompany(company: CompanyCreateRequest): Observable<BaseResponse<CompanyResponse, CompanyCreateRequest>> {
        return this.http.post(this.config.apiUrl + COMPANY_API.CREATE_COMPANY, company).pipe(
            map((res) => {
                let data: BaseResponse<CompanyResponse, CompanyCreateRequest> = res;
                data.request = company;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<CompanyResponse, CompanyCreateRequest>(e, company)));
    }

    /**
     * CreateCompany
     */
    public SocketCreateCompany(company: SocketNewCompanyRequest): Observable<BaseResponse<any, SocketNewCompanyRequest>> {
        return this.http.post('https://sokt.io/app/KyMrjhxQhqznF1sn4K6Y/zwueyKWYsnTBuf6Qg2VH', company).pipe(
            map((res) => {
                let data: BaseResponse<any, SocketNewCompanyRequest> = res;
                data.request = company;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, SocketNewCompanyRequest>(e, SocketNewCompanyRequest)));
    }

    /**
     * CompanyList
     */
    public CompanyList(): Observable<BaseResponse<CompanyResponse[], string>> {
        let uniqueName = (this.generalService?.user) ? this.generalService?.user?.uniqueName : "";

        return this.http.get(this.config.apiUrl + COMPANY_API.COMPANY_LIST?.replace(':uniqueName', uniqueName)).pipe(
            map((res) => {
                let data: BaseResponse<CompanyResponse[], string> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<CompanyResponse[], string>(e, '')));
    }

    // Get business nature for create company
    public GetAllBusinessNatureList() {
        return this.http.get(this.config.apiUrl + COMPANY_API.BUSINESS_NATURE_LIST
        ).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * CurrencyList
     */
    public CurrencyList(): Observable<BaseResponse<ICurrencyResponse[], string>> {
        return this.http.get(this.config.apiUrl + 'currency').pipe(
            map((res) => {
                let data: BaseResponse<ICurrencyResponse[], string> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<ICurrencyResponse[], string>(e, '')));
    }

    /**
     * get state details
     */
    public getStateDetails(cmpUniqueName?: string, fetchLastState?: boolean): Observable<BaseResponse<StateDetailsResponse, string>> {
        let url = '';
        let delimeter = '';
        if (cmpUniqueName) {
            url = this.config.apiUrl + COMPANY_API.GET_STATE_DETAILS?.replace(':companyUniqueName', encodeURIComponent(cmpUniqueName ? cmpUniqueName : ''));
            delimeter = '&';
        } else {
            url = this.config.apiUrl + COMPANY_API.GET_STATE_DETAILS?.replace('?companyUniqueName=:companyUniqueName', '');
            delimeter = '?';
        }
        if (fetchLastState) {
            url = url.concat(`${delimeter}fetchLastState=true`);
        }
        return this.http.get(url).pipe(map((res) => {
            let data: BaseResponse<StateDetailsResponse, string> = res;
            data.queryString = cmpUniqueName;
            data.request = cmpUniqueName;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<StateDetailsResponse, string>(e, cmpUniqueName, cmpUniqueName)));
    }

    //Get razorPay paymentID
    public getRazorPayOrderId(amount: any, currency: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + COMPANY_API.RAZORPAY_ORDERID?.replace(':amount', amount)?.replace(':currency', currency)).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    // Effects need to be review
    public setStateDetails(stateDetails: StateDetailsRequest): Observable<BaseResponse<string, StateDetailsRequest>> {
        if (stateDetails.companyUniqueName) {
            return this.http.post(this.config.apiUrl + COMPANY_API.SET_STATE_DETAILS, stateDetails).pipe(map((res) => {
                let data: BaseResponse<string, StateDetailsRequest> = res;
                data.request = stateDetails;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, StateDetailsRequest>(e, stateDetails)));
        } else {
            return observableEmpty();
        }
    }

    public getApplicationDate(): Observable<BaseResponse<string, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        if (this.companyUniqueName) {
            return this.http.get(this.config.apiUrl + COMPANY_API.UNIVERSAL_DATE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
                let data: BaseResponse<string, any> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, any>(e)));
        } else {
            // When new user sign up without company
            return observableEmpty();
        }
    }

    /**
     * Makes API call to set the application date (universal date)
     *
     * @param {{ fromDate?: string, toDate?: string, duration?: number, period?: string, chosenLabel?: string }} dateObj Request object for the API
     * @returns {Observable<BaseResponse<string, any>>} Response observable to carry out further operations
     * @memberof CompanyService
     */
    public setApplicationDate(dateObj: { fromDate?: string, toDate?: string, duration?: number, period?: string, chosenLabel?: string }): Observable<BaseResponse<string, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + COMPANY_API.UNIVERSAL_DATE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), dateObj).pipe(map((res) => {
            let data: BaseResponse<string, any> = res;
            data['chosenLabel'] = dateObj.chosenLabel;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, any>(e, dateObj)));
    }

    public getCompanyTaxes(): Observable<BaseResponse<TaxResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        if (this.companyUniqueName) {
            return this.http.get(this.config.apiUrl + COMPANY_API.TAX?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
                let data: BaseResponse<TaxResponse[], string> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<TaxResponse[], string>(e)));
        } else {
            return observableEmpty();
        }
    }

    public getComapnyUsers(): Observable<BaseResponse<AccountSharedWithResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + COMPANY_API.GET_COMPANY_USERS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<AccountSharedWithResponse[], string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<AccountSharedWithResponse[], string>(e)));
    }

    public sendEmail(request: BulkEmailRequest): Observable<BaseResponse<string, BulkEmailRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + COMPANY_API.SEND_EMAIL
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':groupUniqueName', encodeURIComponent(request.params?.groupUniqueName))
            ?.replace(':from', encodeURIComponent(request.params.from))
            ?.replace(':to', encodeURIComponent(request.params.to))
            ?.replace(':sortBy', encodeURIComponent(request.params.sortBy))
            ?.replace(':sort', encodeURIComponent(request.params.sort))
            , request.data).pipe(map((res) => {
                return res;
            }), catchError((e) => this.errorHandler.HandleCatch<string, BulkEmailRequest>(e)));
    }

    public downloadCSV(request: BulkEmailRequest): Observable<BaseResponse<string, BulkEmailRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + COMPANY_API.DOWNLOAD_CSV
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':groupUniqueName', encodeURIComponent(request.params?.groupUniqueName))
            ?.replace(':from', encodeURIComponent(request.params.from))
            ?.replace(':to', encodeURIComponent(request.params.to))
            ?.replace(':sortBy', encodeURIComponent(request.params.sortBy))
            ?.replace(':sort', encodeURIComponent(request.params.sort));
        if (request.branchUniqueName) {
            request.branchUniqueName = request.branchUniqueName !== this.companyUniqueName ? request.branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${request.branchUniqueName}`);
        }
        return this.http.post(url, request.data).pipe(map((res) => {
            return res;
        }), catchError((e) => this.errorHandler.HandleCatch<string, BulkEmailRequest>(e)));
    }

    public sendSms(request: BulkEmailRequest): Observable<BaseResponse<string, BulkEmailRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + COMPANY_API.SEND_SMS

            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':groupUniqueName', encodeURIComponent(request.params?.groupUniqueName))
            ?.replace(':from', encodeURIComponent(request.params.from))
            ?.replace(':to', encodeURIComponent(request.params.to))
            ?.replace(':sortBy', encodeURIComponent(request.params.sortBy))
            ?.replace(':sort', encodeURIComponent(request.params.sort))
            , request.data).pipe(map((res) => {
                return res;
            }), catchError((e) => this.errorHandler.HandleCatch<string, BulkEmailRequest>(e)));
    }

    /**
     * get all states
     */
    public getAllStates(request: StatesRequest): Observable<BaseResponse<States, string>> {
        let url = this.config.apiUrl + COMPANY_API.GET_ALL_STATES;
        url = url?.replace(":country", request.country);

        return this.http.get(url).pipe(map((res) => {
            let data: BaseResponse<States, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<States, string>(e)));
    }

    /**
     * Registered Account Details
     */
    public getRegisteredAccount(): Observable<BaseResponse<IRegistration, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        if (this.companyUniqueName) {
            return this.http.get(this.config.apiUrl + COMPANY_API.REGISTER_ACCOUNT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
                let data: BaseResponse<IRegistration, string> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<IRegistration, string>(e)));
        } else {
            return observableEmpty();
        }
    }

    /**
     * get OTP
     */
    public getOTP(request) {
        this.companyUniqueName = this.generalService.companyUniqueName;
        if (this.companyUniqueName) {
            return this.http.get(this.config.apiUrl + COMPANY_API.GET_OTP?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':urn', encodeURIComponent(request.params.urn))).pipe(map((res) => {
                let data: BaseResponse<IRegistration, string> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<IRegistration, string>(e)));
        } else {
            return observableEmpty();
        }
    }

    /*
  * get registered sales
  * */
    public getSalesRegister(request: ReportsRequestModel) {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = this.config.apiUrl + COMPANY_API.GET_REGISTERED_SALES
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':fromDate', encodeURIComponent(request.from))
            ?.replace(':toDate', encodeURIComponent(request.to))
            ?.replace(':interval', encodeURIComponent(request.interval));
        if (request.branchUniqueName) {
            request.branchUniqueName = request.branchUniqueName !== this.companyUniqueName ? request.branchUniqueName : '';
            contextPath = contextPath.concat(`&branchUniqueName=${encodeURIComponent(request.branchUniqueName)}`);
        }
        return this.http.get(contextPath).pipe(map((res) => {
            let data: BaseResponse<ReportsResponseModel, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, ReportsRequestModel>(e, ReportsRequestModel)));
    }

    /**
     * To get registered sales
     *
     * @param {ReportsRequestModel} request Request body
     * @returns
     * @memberof CompanyService
     */
    public getPurchaseRegister(request: ReportsRequestModel) {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = this.config.apiUrl + COMPANY_API.GET_REGISTERED_PURCHASE
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':fromDate', encodeURIComponent(request.from))
            ?.replace(':toDate', encodeURIComponent(request.to))
            ?.replace(':interval', encodeURIComponent(request.interval));
        if (request.branchUniqueName) {
            request.branchUniqueName = request.branchUniqueName !== this.companyUniqueName ? request.branchUniqueName : '';
            contextPath = contextPath.concat(`&branchUniqueName=${encodeURIComponent(request.branchUniqueName)}`);
        }
        return this.http.get(contextPath).pipe(map((res) => {
            let data: BaseResponse<ReportsResponseModel, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, ReportsRequestModel>(e, ReportsRequestModel)));
    }

    /**
     *Get all integrated banks list
     *
     * @param {ReportsRequestModel} request
     * @returns
     * @memberof CompanyService
     */
    public getIntegratedBankInCompany(companyUniqueName: string): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + COMPANY_API.GET_COMPANY_INTEGRATED_BANK_LIST
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))).pipe(map((res) => {
                let data: BaseResponse<any, string> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, any>(e, ReportsRequestModel)));
    }

    /**
     * Bulk pay vendor API call
     *
     * @param {string} companyUniqueName  company unique name
     * @param {GetOTPRequest} bankTransferRequest request object
     * @returns {Observable<BaseResponse<string, GetOTPRequest>>}
     * @memberof CompanyService
     */
    public bulkVendorPayment(companyUniqueName: string, bankTransferRequest: GetOTPRequest): Observable<BaseResponse<BulkPaymentResponse, GetOTPRequest>> {
        return this.http.post(this.config.apiUrl + COMPANY_API.BULK_PAYMENT?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)), bankTransferRequest).pipe(map((res) => {
            return res;
        }), catchError((e) => this.errorHandler.HandleCatch<BulkPaymentResponse, GetOTPRequest>(e, bankTransferRequest)));
    }

    /**
     * Bulk pay vendor API call
     *
     * @param {string} companyUniqueName  Company unique name
     * @param {string} urn selected payor urn number
     * @param {string} bankAccountUniqueName Selected bank
     * @param {BulkPaymentConfirmRequest} requestObject Request object
     * @returns {Observable<BaseResponse<BulkPaymentResponse, BulkPaymentConfirmRequest>>}
     * @memberof CompanyService
     */
    public bulkVendorPaymentConfirm(companyUniqueName: string, urn: string, bankAccountUniqueName: string, requestObject: BulkPaymentConfirmRequest): Observable<BaseResponse<BulkPaymentResponse, BulkPaymentConfirmRequest>> {
        return this.http.post(this.config.apiUrl + COMPANY_API.BULK_PAYMENT_CONFIRM?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))?.replace(':urn', urn)?.replace(':uniqueName', encodeURIComponent(bankAccountUniqueName)), requestObject).pipe(map((res) => {
            return res;
        }), catchError((e) => this.errorHandler.HandleCatch<BulkPaymentResponse, BulkPaymentConfirmRequest>(e, BulkPaymentConfirmRequest)));
    }

    /**
    * Resend OTP API call
    *
    * @param {string} companyUniqueName Company unique name
    * @param {string} urn Urn number
    * @param {string} uniqueName Account unique name
    * @returns
    * @memberof CompanyService
    */
    public resendOtp(companyUniqueName: string, urn: string, requestId: string, uniqueName: string): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMPANY_API.BULK_PAYMENT_RESEND_OTP?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))?.replace(':uniqueName', encodeURIComponent(uniqueName))?.replace(':urn', urn)?.replace(':requestId', requestId);
        return this.http.get(url).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, any>(e, '')));
    }

    /**
     * Creates a new branch
     *
     * @param {string} companyUniqueName Company unique name under which a branch is created
     * @param {*} requestObject Request payload for branch createion
     * @returns {Observable<any>} Observable to carry out further operation
     * @memberof CompanyService
     */
    public createNewBranch(companyUniqueName: string, requestObject: any): Observable<any> {
        const requestPayload = {
            name: requestObject.name,
            uniqueName: requestObject.uniqueName,
            alias: requestObject.nameAlias,
            parent_branch_unique_name: '',
            businessType: requestObject.businessType || '',
            businessNature: requestObject.businessNature || '',
            addresses: []
        }
        if (requestObject.addresses && requestObject.addresses.length) {
            const addressDetails = requestObject.addresses[0];
            requestPayload.addresses = [
                {
                    taxNumber: addressDetails.taxNumber,
                    isDefault: true,
                    stateCode: addressDetails.stateCode,
                    stateName: addressDetails.stateName,
                    address: addressDetails.address
                }
            ];
        }
        return this.http.post(this.config.apiUrl + COMPANY_API.CREATE_NEW_BRANCH
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)), requestPayload).pipe(
                catchError((e) => this.errorHandler.HandleCatch<string, any>(e, ReportsRequestModel)));
    }

    /**
     * Updates the branch
     *
     * @param {*} requestObject Request payload for API
     * @returns {Observable<any>} Observable to carry out further operation
     * @memberof CompanyService
     */
    public updateBranch(requestObject: any): Observable<any> {
        const contextPath = `${this.config.apiUrl}${COMPANY_API.CREATE_NEW_BRANCH}/${encodeURIComponent(requestObject.branchUniqueName)}`;
        const requestPayload = {
            name: requestObject.name,
            alias: requestObject.alias
        };
        return this.http.put(contextPath
            ?.replace(':companyUniqueName', encodeURIComponent(requestObject.companyUniqueName)), requestPayload).pipe(
                catchError((e) => this.errorHandler.HandleCatch<string, any>(e, ReportsRequestModel)));
    }

    /**
     * Returns the menu items to be shown in menu panel
     *
     * @returns {Observable<any>} Observable to carry out further operation
     * @memberof CompanyService
     */
    public getMenuItems(): Observable<any> {
        let url = `${this.config.apiUrl}${COMPANY_API.GET_SIDE_BAR_ITEM}`;
        url = url?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));
        return this.http.get(url).pipe(
            catchError((e) => this.errorHandler.HandleCatch<string, any>(e, ReportsRequestModel)));
    }

    /**
     * Calls the company uer api
     *
     * @param {*} model
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof CompanyService
     */
    public getCompanyUser(model: any): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMPANY_API.GET_COMPANY_USER?.replace(':companyUniqueName', encodeURIComponent(model.companyUniqueName))?.replace(':userUniqueName', encodeURIComponent(model.userUniqueName));
        return this.http.get(url).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, any>(e, '')));
    }
}
