import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './http-wrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { PLAN_API, SUBSCRIPTIONS_API, SUBSRIPTION_V2_API } from './apiurls/subscriptions.api';
import * as dayjs from 'dayjs';
import { SubscriptionsUser } from '../models/api-models/Subscriptions';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import { TaxSupportedCountries, TaxType } from '../app.constant';

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
            ?.replace(':subscriptionId', subscription.subscriptionId)
            ?.replace(':from', subscription.subscribedOn)
            ?.replace(':to', dayjs(subscription.subscribedOn, GIDDH_DATE_FORMAT).add(1, 'year').format(GIDDH_DATE_FORMAT))
            ?.replace(':interval', paymentFrequency))
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
            ?.replace(':company', params.company)
            ?.replace(':from', params.subscription.subscribedOn)
            ?.replace(':to', params.subscription.renewalDate)
            ?.replace(':interval', paymentFrequency))
            .pipe(map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
    }

    public GetSubscribedCompaniesList(subscription): Observable<BaseResponse<string, string>> {
        return this.http.get(this.config.apiUrl + SUBSCRIPTIONS_API.SUBSCRIBED_COMPANIES_LIST
            ?.replace(':subscriptionId', subscription.subscriptionId))
            .pipe(map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
    }

    /**
     * Get All Plans list
     *
     * @param {*} model
     * @param {*} params
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PlanService
     */
    public getAllPlans(params: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + PLAN_API.GET_ALL_PLANS
            ?.replace(':countryCode', encodeURIComponent(params.countryCode ?? ''))
        ).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {})));
    }

    /**
     * Get All Subscription list
     *
     * @param {*} model
     * @param {*} params
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof PlanService
     */
    public getAllSubscriptions(): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + SUBSRIPTION_V2_API.GET_ALL_SUBSCRIPTIONS)
            .pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {})));
    }
    /**
     * This will be use for show tax type by country
     *
     * @param {string} countryCode
     * @param {string} companyCountryCode
     * @return {*}  {TaxType}
     * @memberof SubscriptionsService
     */
    public showTaxTypeByCountry(countryCode: string, companyCountryCode: string): TaxType {
        if (companyCountryCode === countryCode) {
            if (countryCode === TaxSupportedCountries.IN) {
                return TaxType.GST;
            } else if (countryCode === TaxSupportedCountries.UAE) {
                return TaxType.TRN;
            } else if (countryCode === TaxSupportedCountries.UK) {
                return TaxType.VAT;
            }
        } else {
            return null;
        }
    }

    public createPlan(model: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.config.apiUrl + PLAN_API.CREATE_PLAN, model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {})));
    }

    public applyPromoCode(model: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.config.apiUrl + PLAN_API.APPLY_PROMOCODE, model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {})));
    }

    /**
 * Get All Subscription list
 *
 * @param {*} model
 * @param {*} params
 * @returns {Observable<BaseResponse<any, any>>}
 * @memberof PlanService
 */
    public viewSubscriptionById(id: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + SUBSRIPTION_V2_API.SUBSCRIPTION_BY_ID
            ?.replace(':subscriptionId', encodeURIComponent(id ?? '')))
            .pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {})));
    }

    public cancelSubscriptionById(id: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + SUBSRIPTION_V2_API.CANCEL_SUBSCRIPTION_BY_ID
            ?.replace(':subscriptionId', encodeURIComponent(id ?? ''))).pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = '';
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {})));
    }

    /**
 * Transfer Subscription Details by Id
 *
 * @param {*} model
 * @param {string} subscriptionId
 * @returns {Observable<BaseResponse<any, any>>}
 * @memberof SubscriptionService
 */
    public transferSubscription(model: any, subscriptionId: string): Observable<BaseResponse<any, any>> {
        return this.http.post(this.config.apiUrl + SUBSRIPTION_V2_API.TRANSFER
            ?.replace(':subscriptionId', encodeURIComponent(subscriptionId ?? ''))
            , model).pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {})));
    }

    public verifyOwnership(id: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + SUBSRIPTION_V2_API.VERIFY_OWNERSHIP
            ?.replace(':requestId', encodeURIComponent(id ?? ''))).pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = '';
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {})));
    }

    /**
 * Get All Plans list
 *
 * @param {*} model
 * @param {*} params
 * @returns {Observable<BaseResponse<any, any>>}
 * @memberof PlanService
 */
    public getBillingDetails(billingAccountUnqiueName: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + SUBSRIPTION_V2_API.GET_BILLING_DETAILS
            ?.replace(':billingAccountUnqiueName', encodeURIComponent(billingAccountUnqiueName ?? ''))
        ).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {})));
    }


    public updateBillingDetails(model: any, billingAccountUnqiueName: any): Observable<BaseResponse<any, any>> {
        return this.http.patch(this.config.apiUrl + SUBSRIPTION_V2_API.UPDATE_BILLING_DETAILS
            ?.replace(':billingAccountUnqiueName', encodeURIComponent(billingAccountUnqiueName ?? '')), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {})));
    }


}
