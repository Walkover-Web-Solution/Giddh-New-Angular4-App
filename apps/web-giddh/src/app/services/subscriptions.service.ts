import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpWrapperService } from './httpWrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { SUBSCRIPTIONS_API } from './apiurls/subscriptions.api';
import * as moment from 'moment';
import { SubscriptionsUser } from '../models/api-models/Subscriptions';

@Injectable()
export class SubscriptionsService {
    public moment = moment;

    constructor(private errorHandler: ErrorHandler,
        public _httpClient: HttpClient,
        public _http: HttpWrapperService,
        public _router: Router,
        private _generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {

    }

    public GetSubScribedCompanies(): Observable<BaseResponse<SubscriptionsUser, string>> {
        let userUniqueName = this._generalService.user.uniqueName;

        return this._http.get(this.config.apiUrl + SUBSCRIPTIONS_API.SUBSCRIBED_COMPANIES).pipe(map((res) => {
            let data: BaseResponse<SubscriptionsUser, string> = res;
            data.request = '';
            data.queryString = {};
            // data.response.results.forEach(p => p.isOpen = false);
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<SubscriptionsUser, string>(e, '')));
    }

    public GetSubScribedUserTransaction(subscription): Observable<BaseResponse<string, string>> {
        let paymentFrequency = 'daily';
        if (subscription.plan && subscription.plan.paymentFrequency) {
            paymentFrequency = subscription.plan.paymentFrequency.toLowerCase();
        }
        return this._http.get(this.config.apiUrl + SUBSCRIPTIONS_API.SUBSCRIBED_USER_TRANSACTIONS
            .replace(':subscriptionId', subscription.subscriptionId)
            .replace(':from', subscription.subscribedOn)
            .replace(':to', moment(subscription.subscribedOn, 'DD-MM-YYYY').add(1, 'years').format('DD-MM-YYYY'))
            .replace(':interval', paymentFrequency))
            .pipe(map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = '';
                data.queryString = {};
                // data.response.results.forEach(p => p.isOpen = false);
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
    }

    public GetSubScribedCompanyTransaction(params): Observable<BaseResponse<string, string>> {
        let paymentFrequency = 'daily';
        if (params.subscription.plan && params.subscription.plan.paymentFrequency) {
            paymentFrequency = params.subscription.plan.paymentFrequency.toLowerCase();
        }
        return this._http.get(this.config.apiUrl + SUBSCRIPTIONS_API.SUBSCRIBED_COMPANY_TRANSACTIONS
            .replace(':company', params.company)
            .replace(':from', params.subscription.subscribedOn)
            .replace(':to', params.subscription.renewalDate)
            .replace(':interval', paymentFrequency))
            .pipe(map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = '';
                data.queryString = {};
                // data.response.results.forEach(p => p.isOpen = false);
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
    }

    public GetSubscribedCompaniesList(subscription): Observable<BaseResponse<string, string>> {
        return this._http.get(this.config.apiUrl + SUBSCRIPTIONS_API.SUBSCRIBED_COMPANIES_LIST
            .replace(':subscriptionId', subscription.subscriptionId))
            .pipe(map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = '';
                data.queryString = {};
                // data.response.results.forEach(p => p.isOpen = false);
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
    }
}
