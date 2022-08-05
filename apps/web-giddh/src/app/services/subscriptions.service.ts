import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './httpWrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { SUBSCRIPTIONS_API } from './apiurls/subscriptions.api';
import * as dayjs from 'dayjs';
import { SubscriptionsUser } from '../models/api-models/Subscriptions';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';

@Injectable()
export class SubscriptionsService {
    public dayjs = dayjs;

    constructor(private errorHandler: GiddhErrorHandler,
        public http: HttpWrapperService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {

    }

    public getSubScribedCompanies(): Observable<BaseResponse<SubscriptionsUser, string>> {
        return this.http.get(this.config.apiUrl + SUBSCRIPTIONS_API.SUBSCRIBED_COMPANIES).pipe(map((res) => {
            let data: BaseResponse<SubscriptionsUser, string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<SubscriptionsUser, string>(e, '')));
    }

    public GetSubScribedUserTransaction(subscription): Observable<BaseResponse<string, string>> {
        let paymentFrequency = 'daily';
        if (subscription.plan && subscription.plan.paymentFrequency) {
            paymentFrequency = subscription.plan.paymentFrequency.toLowerCase();
        }
        return this.http.get(this.config.apiUrl + SUBSCRIPTIONS_API.SUBSCRIBED_USER_TRANSACTIONS
            .replace(':subscriptionId', subscription.subscriptionId)
            .replace(':from', subscription.subscribedOn)
            .replace(':to', dayjs(subscription.subscribedOn, GIDDH_DATE_FORMAT).add(1, 'year').format(GIDDH_DATE_FORMAT))
            .replace(':interval', paymentFrequency))
            .pipe(map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
    }

    public GetSubScribedCompanyTransaction(params): Observable<BaseResponse<string, string>> {
        let paymentFrequency = 'daily';
        if (params.subscription.plan && params.subscription.plan.paymentFrequency) {
            paymentFrequency = params.subscription.plan.paymentFrequency.toLowerCase();
        }
        return this.http.get(this.config.apiUrl + SUBSCRIPTIONS_API.SUBSCRIBED_COMPANY_TRANSACTIONS
            .replace(':company', params.company)
            .replace(':from', params.subscription.subscribedOn)
            .replace(':to', params.subscription.renewalDate)
            .replace(':interval', paymentFrequency))
            .pipe(map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
    }

    public GetSubscribedCompaniesList(subscription): Observable<BaseResponse<string, string>> {
        return this.http.get(this.config.apiUrl + SUBSCRIPTIONS_API.SUBSCRIBED_COMPANIES_LIST
            .replace(':subscriptionId', subscription.subscriptionId))
            .pipe(map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
    }
}
