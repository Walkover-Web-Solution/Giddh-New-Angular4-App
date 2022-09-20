import { catchError, map, retry } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './httpWrapper.service';
import { GMAIL_API, LOGIN_API } from './apiurls/login.api';
import { BaseResponse } from '../models/api-models/BaseResponse';
import {
    AuthKeyResponse,
    SignupWithMobile,
    UserDetails,
    VerifyEmailModel,
    VerifyEmailResponseModel,
    VerifyMobileModel,
    VerifyMobileResponseModel
} from '../models/api-models/loginModels';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { LoginWithPassword, SignUpWithPassword } from '../models/api-models/login';

@Injectable()
export class AuthenticationService {

    constructor(private errorHandler: GiddhErrorHandler,
        public httpClient: HttpClient,
        public http: HttpWrapperService,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    public SignupWithEmail(datatoSend: any): Observable<BaseResponse<string, string>> {
        return this.http.post(this.config.apiUrl + LOGIN_API.SignupWithEmail, datatoSend).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, datatoSend)));
    }

    public VerifyEmail(model: VerifyEmailModel): Observable<BaseResponse<VerifyEmailResponseModel, VerifyEmailModel>> {
        return this.http.post(this.config.apiUrl + LOGIN_API.VerifyEmail, model).pipe(map((res) => {
            let data: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<VerifyEmailResponseModel, VerifyEmailModel>(e, model)));
    }

    public SignupWithMobile(model: SignupWithMobile): Observable<BaseResponse<string, SignupWithMobile>> {
        return this.http.post(this.config.apiUrl + LOGIN_API.SignupWithMobile, model).pipe(map((res) => {
            let data: BaseResponse<string, SignupWithMobile> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SignupWithMobile>(e, model)));
    }

    public VerifyOTP(modele: VerifyMobileModel): Observable<BaseResponse<VerifyMobileResponseModel, VerifyMobileModel>> {
        return this.http.post(this.config.apiUrl + LOGIN_API.VerifyOTP, modele).pipe(map((res) => {
            let data: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = res;
            data.request = modele;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<VerifyMobileResponseModel, VerifyMobileModel>(e, modele)));
    }

    public SignupWithPassword(modele: SignUpWithPassword): Observable<BaseResponse<VerifyMobileResponseModel, SignUpWithPassword>> {
        return this.http.post(this.config.apiUrl + LOGIN_API.SignupWithPassword, modele).pipe(map((res) => {
            let data: BaseResponse<VerifyMobileResponseModel, SignUpWithPassword> = res;
            data.request = modele;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<VerifyMobileResponseModel, SignUpWithPassword>(e, modele)));
    }

    public LoginWithPassword(modele: LoginWithPassword): Observable<BaseResponse<VerifyMobileResponseModel, LoginWithPassword>> {
        return this.http.post(this.config.apiUrl + LOGIN_API.LoginWithPassword, modele).pipe(map((res) => {
            let data: BaseResponse<VerifyMobileResponseModel, LoginWithPassword> = res;
            data.request = modele;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<VerifyMobileResponseModel, LoginWithPassword>(e, modele)));
    }

    public VerifyNumber(modele: SignupWithMobile): Observable<BaseResponse<string, SignupWithMobile>> {
        return this.http.post(this.config.apiUrl + LOGIN_API.VerifyNumber, modele).pipe(map((res) => {
            let data: BaseResponse<string, SignupWithMobile> = res;
            data.request = modele;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, SignupWithMobile>(e, modele)));
    }

    public VerifyNumberOTP(modele: VerifyMobileModel): Observable<BaseResponse<string, VerifyMobileModel>> {
        return this.http.put(this.config.apiUrl + LOGIN_API.VerifyNumber, modele).pipe(map((res) => {
            let data: BaseResponse<string, VerifyMobileModel> = res;
            data.request = modele;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, VerifyMobileModel>(e)));
    }

    public ClearSession(): Observable<BaseResponse<string, string>> {
        let userName = (this.generalService.user) ? this.generalService.user.uniqueName : "";
        return this.http.delete(this.config.apiUrl + LOGIN_API.CLEAR_SESSION?.replace(':userUniqueName', encodeURIComponent(userName))).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public LoginWithGoogle(token: string) {
        // debugger;
        let args: any = { headers: {} };
        args.headers['cache-control'] = 'no-cache';
        args.headers['Content-Type'] = 'application/json';
        args.headers['Accept'] = 'application/json';
        args.headers['Access-Token'] = token;
        args.headers = new HttpHeaders(args.headers);
        return this.httpClient.get(this.config.apiUrl + LOGIN_API.LOGIN_WITH_GOOGLE, {
            headers: args.headers,
            responseType: 'json'
        }).pipe(map((res) => {
            let data: BaseResponse<VerifyEmailResponseModel, string> = res as BaseResponse<VerifyEmailResponseModel, string>;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<VerifyEmailResponseModel, string>(e, args)));
    }

    public SetSettings(model): Observable<BaseResponse<string, string>> {
        let uniqueName = (this.generalService.user) ? this.generalService.user.uniqueName : "";

        return this.http.put(this.config.apiUrl + LOGIN_API.SET_SETTINGS
            ?.replace(':userUniqueName', encodeURIComponent(uniqueName)), model).pipe(map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
    }

    public FetchUserDetails(): Observable<BaseResponse<UserDetails, string>> {
        let sessionId = (this.generalService.user) ? this.generalService.user.uniqueName : "";

        return this.http.get(this.config.apiUrl + LOGIN_API.FETCH_DETAILS
            ?.replace(':sessionId', sessionId)).pipe(map((res) => {
                let data: BaseResponse<UserDetails, string> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<UserDetails, string>(e, '')));
    }

    public GetAuthKey(): Observable<BaseResponse<AuthKeyResponse, string>> {
        let uniqueName = (this.generalService.user) ? this.generalService.user.uniqueName : "";

        return this.http.get(this.config.apiUrl + LOGIN_API.GET_AUTH_KEY
            ?.replace(':uniqueName', uniqueName)).pipe(map((res) => {
                let data: BaseResponse<AuthKeyResponse, string> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<AuthKeyResponse, string>(e, '')));
    }

    public RegenerateAuthKey(): Observable<BaseResponse<AuthKeyResponse, string>> {
        let userEmail = (this.generalService.user) ? this.generalService.user.email : "";

        return this.http.put(this.config.apiUrl + LOGIN_API.REGENERATE_AUTH_KEY
            ?.replace(':userEmail', userEmail), {}).pipe(map((res) => {
                let data: BaseResponse<AuthKeyResponse, string> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<AuthKeyResponse, string>(e, '')));
    }

    public ReportInvalidJSON(model): Observable<BaseResponse<AuthKeyResponse, string>> {
        model.email = (this.generalService.user) ? this.generalService.user.email : "";
        model.environment = this.config.apiUrl;
        model.userUniqueName = (this.generalService.user) ? this.generalService.user.uniqueName : "";
        return this.http.post(this.config.apiUrl + 'exception/invalid-json', model).pipe(map((res) => {
            let data: BaseResponse<AuthKeyResponse, string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<AuthKeyResponse, string>(e, '')));
    }

    // Get User Sessions
    public GetUserSession() {
        let userEmail = (this.generalService.user) ? this.generalService.user.email : "";
        return this.http.get(this.config.apiUrl + LOGIN_API.GET_SESSION
            ?.replace(':userEmail', userEmail)).pipe(map(res => {
                let data = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * Deletes the session
     *
     * @param {*} requestPayload Payload for API
     * @returns {Observable<any>} Observable to carry out further operation
     * @memberof AuthenticationService
     */
    public DeleteSession(requestPayload: any): Observable<any> {
        let userEmail = (this.generalService.user) ? this.generalService.user.email : "";
        let id = {
            sessionId: requestPayload.sessionId
        };
        return this.http.post(this.config.apiUrl + LOGIN_API.DELETE_SESSION?.replace(':userEmail', userEmail), id).pipe(map(res => {
            let data = res;
            data.queryString = requestPayload;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    // Delete All Sessions
    public DeleteAllSession() {
        let userEmail = (this.generalService.user) ? this.generalService.user.email : "";
        return this.http.delete(this.config.apiUrl + LOGIN_API.DELETE_ALL_SESSION?.replace(':userEmail', userEmail)).pipe(map(res => {
            let data = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    // Get Electron App Version
    public GetElectronAppVersion() {
        let args: any = { headers: {} };
        args.headers['cache-control'] = 'no-cache';
        args.headers['Content-Type'] = 'application/xml';
        args.headers = new HttpHeaders(args.headers);
        return this.httpClient.get('https://s3-ap-south-1.amazonaws.com/giddh-app-builds/latest.yml', {
            headers: args.headers,
            responseType: 'text'
        }).pipe(map((res) => {
            return res;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, args)));
    }

    public forgotPassword(userId): Observable<BaseResponse<string, any>> {
        let userName = userId;
        return this.http.put(this.config.apiUrl + LOGIN_API.FORGOT_PASSWORD?.replace(':userEmail', userName), {}).pipe(map((res) => {
            let data: BaseResponse<string, any> = res;
            data.request = userId;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, any>(e)));
    }

    public resetPassword(model): Observable<BaseResponse<string, any>> {
        let objToSend = model;
        return this.http.put(this.config.apiUrl + LOGIN_API.RESET_PASSWORD, objToSend).pipe(map((res) => {
            let data: BaseResponse<string, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, any>(e)));
    }

    public renewSession(): Observable<BaseResponse<any, any>> {
        let userName = (this.generalService.user) ? this.generalService.user.uniqueName : "";
        return this.http.put(this.config.apiUrl + LOGIN_API.RENEW_SESSION?.replace(':userUniqueName', encodeURIComponent(userName)), null).pipe(map((res) => {
            let data: BaseResponse<string, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, any>(e)));
    }

    public saveGmailAuthCode(data) {
        const companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + GMAIL_API.GENERATE_GMAIL_TOKEN?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)), data).pipe(map((res) => {
            let data: BaseResponse<string, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, any>(e)));
    }

    public saveGmailToken(data) {
        const companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + GMAIL_API.SAVE_GMAIL_TOKEN?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)), data).pipe(map((res) => {
            let data: BaseResponse<string, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, any>(e)));
    }

    public getAllUserSubsciptionPlans(countryCode): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + LOGIN_API.GET_USER_SUBSCRIPTION_PLAN_API;
        url = url?.replace(":countryCode", countryCode);

        return this.http.get(url).pipe(map(res => {
            let data = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * Returns the user details obtained from the session ID
     *
     * @param {*} sessionId Session ID of current session
     * @returns {Observable<BaseResponse<any, any>>} Observable to carry out further operations
     * @memberof AuthenticationService
     */
    public getUserDetails(sessionId: any): Observable<any> {
        const url = `${this.config.apiUrl}${LOGIN_API.GET_USER_DETAILS_FROM_SESSION_ID}`;
        return this.http.get(url, null, { headers: { 'Session-Id': sessionId } })
            .pipe(retry(3), catchError((error) => this.errorHandler.HandleCatch<any, any>(error, '')));
    }

    /**
     * To get version of latest Mac app
     *
     * @returns {*}
     * @memberof AuthenticationService
     */
    public getElectronMacAppVersion(): any {
        let args: any = { headers: {} };
        args.headers['cache-control'] = 'no-cache';
        args.headers['Content-Type'] = 'application/xml';
        args.headers = new HttpHeaders(args.headers);
        return this.httpClient.get('https://s3-ap-south-1.amazonaws.com/giddh-app-builds/latest-mac.yml', {
            headers: args.headers,
            responseType: 'text'
        }).pipe(map((res) => {
            return res;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, args)));
    }
}
