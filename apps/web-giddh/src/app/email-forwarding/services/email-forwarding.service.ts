import { Injectable, Optional, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpWrapperService } from '../../services/http-wrapper.service';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GiddhErrorHandler } from '../../services/catchManager/catchmanger';
import { GeneralService } from '../../services/general.service';
import { IServiceConfigArgs, ServiceConfig } from '../../services/service.config';
import { EMAIL_FORWARDING_API } from './apiurls/email-forwarding.api';
import {
    EmailForwardingRequest,
    EmailForwardingResponse
} from '../models/email-forwarding.model';

/**
 * Service for managing email forwarding functionality
 * Handles all API calls related to email forwarding configurations
 * 
 * @export
 * @class EmailForwardingService
 */
@Injectable({
    providedIn: 'root'
})
/**
 * EmailForwardingService service
 * Provides emailforwarding related business logic and data operations
 */
export class EmailForwardingService {
    /** Current company unique name */
    private companyUniqueName: string;

    /**
     * Creates an instance of EmailForwardingService
     * 
     * @param {GiddhErrorHandler} errorHandler - Error handling service
     * @param {HttpWrapperService} http - HTTP wrapper service
     * @param {GeneralService} generalService - General utility service
     * @param {IServiceConfigArgs} config - Service configuration
     * @memberof EmailForwardingService
     */
    constructor(
        private errorHandler: GiddhErrorHandler,
        public http: HttpWrapperService,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs
    ) { }

    /**
     * Generates email communication for the company
     * 
     * @returns {Observable<BaseResponse<string, string>>} Observable with generated email datas
     * @memberof EmailForwardingService
     */
    public generateEmail(): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        
        const url = this.config.apiUrl + EMAIL_FORWARDING_API.GENERATE_EMAIL
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));

        return this.http.get(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = '';
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '', ''))
        );
    }

    /**
     * Gets a specific email forwarding configuration by unique name
     * 
     * @param {string} uniqueName - Unique identifier of the email forwarding configuration
     * @returns {Observable<BaseResponse<EmailForwardingResponse, string>>} Observable with email forwarding data
     * @memberof EmailForwardingService
     */
    public getEmailForwarding(uniqueName: string): Observable<BaseResponse<EmailForwardingResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        
        const url = this.config.apiUrl + EMAIL_FORWARDING_API.GET_EMAIL_FORWARDING
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':uniqueName', encodeURIComponent(uniqueName));

        return this.http.get(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<EmailForwardingResponse, string> = res;
                data.request = uniqueName;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<EmailForwardingResponse, string>(e, uniqueName, ''))
        );
    }

    /**
     * Gets all email forwarding configurations for the company
     * 
     * @param {number} [page=1] - Page number for pagination
     * @param {number} [count=20] - Number of items per page
     * @param {string} [query=''] - Search query
     * @returns {Observable<BaseResponse<EmailForwardingResponse[], string>>} Observable with list of email forwarding configurations
     * @memberof EmailForwardingService
     */
    public getAllEmailForwarding(): Observable<BaseResponse<EmailForwardingResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        
        let url = this.config.apiUrl + EMAIL_FORWARDING_API.GET_ALL_EMAIL_FORWARDING
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));

        return this.http.get(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<EmailForwardingResponse[], string> = res;
                data.request = '';
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<EmailForwardingResponse[], string>(e, '', ''))
        );
    }

    /**
     * Deletes an email forwarding configuration
     * 
     * @param {string} uniqueName - Unique identifier of the email forwarding configuration to delete
     * @returns {Observable<BaseResponse<string, string>>} Observable with deletion result
     * @memberof EmailForwardingService
     */
    public deleteEmailForwarding(uniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        
        const url = this.config.apiUrl + EMAIL_FORWARDING_API.DELETE_EMAIL_FORWARDING
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':uniqueName', encodeURIComponent(uniqueName));

        return this.http.delete(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = uniqueName;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e, uniqueName, ''))
        );
    }

    /**
     * Creates a new email forwarding configuration
     * 
     * @param {EmailForwardingRequest} requestData - Email forwarding configuration data
     * @returns {Observable<BaseResponse<EmailForwardingResponse, EmailForwardingRequest>>} Observable with created configuration
     * @memberof EmailForwardingService
     */
    public createEmailForwarding(
        requestData: EmailForwardingRequest
    ): Observable<BaseResponse<EmailForwardingResponse, EmailForwardingRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        
        const url = this.config.apiUrl + EMAIL_FORWARDING_API.CREATE_EMAIL_FORWARDING
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));

        return this.http.post(url, requestData).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<EmailForwardingResponse, EmailForwardingRequest> = res;
                data.request = requestData;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<EmailForwardingResponse, EmailForwardingRequest>(e, requestData, ''))
        );
    }

    /**
     * Updates an existing email forwarding configuration
     * 
     * @param {string} uniqueName - Unique identifier of the email forwarding configuration to update
     * @param {EmailForwardingRequest} requestData - Updated email forwarding configuration data
     * @returns {Observable<BaseResponse<EmailForwardingResponse, EmailForwardingRequest>>} Observable with updated configuration
     * @memberof EmailForwardingService
     */
    public updateEmailForwarding(
        uniqueName: string,
        requestData: EmailForwardingRequest
    ): Observable<BaseResponse<EmailForwardingResponse, EmailForwardingRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        
        const url = this.config.apiUrl + EMAIL_FORWARDING_API.UPDATE_EMAIL_FORWARDING
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':uniqueName', encodeURIComponent(uniqueName));

        return this.http.put(url, requestData).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<EmailForwardingResponse, EmailForwardingRequest> = res;
                data.request = requestData;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<EmailForwardingResponse, EmailForwardingRequest>(e, requestData, ''))
        );
    }

    /**
     * Creates a formatted email forwarding request object
     * 
     * @param {string} accountUniqueName - Account unique name
     * @param {string} originalEmail - Original email address
     * @param {string} forwardedMail - Forwarded email address
     * @param {string} [password=''] - Password for email configuration
     * @returns {EmailForwardingRequest} Formatted request object
     * @memberof EmailForwardingService
     */
    public createEmailForwardingRequest(
        accountUniqueName: string,
        originalEmail: string,
        forwardedMail: string,
        password: string = ''
    ): EmailForwardingRequest {
        return {
            accountUniqueName: accountUniqueName?.trim(),
            originalEmail: originalEmail?.trim(),
            forwardedMail: forwardedMail?.trim(),
            password: password?.trim()
        };
    }
}
