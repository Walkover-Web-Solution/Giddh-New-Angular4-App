import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './http-wrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { SUBSCRIPTIONS_API, SUBSCRIPTION_V2_API } from './apiurls/subscriptions.api';
import * as dayjs from 'dayjs';
import { SubscriptionsUser } from '../models/api-models/Subscriptions';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import { GeneralService } from './general.service';
import { TaxSupportedCountries, TaxType } from '../vouchers/utility/vouchers.const';

@Injectable()
export class SubscriptionsService {
    public dayjs = dayjs;

    constructor(private errorHandler: GiddhErrorHandler,
        public http: HttpWrapperService,
        private generalService: GeneralService,
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

    /**
     * Save Razorpay Token
     *
     * @param subscriptionId
     * @param paymentId
     * @returns
     */
    public saveRazorpayToken(subscriptionId: string, paymentId: string): Observable<any> {
        return this.http.get(this.config.apiUrl + SUBSCRIPTION_V2_API.SAVE_RAZORPAY_TOKEN
            ?.replace(':subscriptionId', subscriptionId)
            ?.replace(':paymentId', paymentId))
            .pipe(map((res) => {
                return res;
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
     * @memberof SubscriptionsService
     */
    public getAllPlans(params: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + SUBSCRIPTION_V2_API.GET_ALL_PLANS
            ?.replace(':regionCode', encodeURIComponent(params?.regionCode || ''))
        ).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {})));
    }

    /**
    * Get All Country list
    *
    * @param {*} model
    * @param {*} params
    * @returns {Observable<BaseResponse<any, any>>}
    * @memberof SubscriptionsService
    */
    public getCountryList(): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + SUBSCRIPTION_V2_API.GET_COUNTRY_LIST
        ).pipe(map((res) => {
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

    /**
     * Retrieves all subscriptions with pagination and provided model from the SubscriptionsService.
     *
     * @param pagination - Pagination details.
     * @param model - Data model for filtering.
     * @returns Observable<BaseResponse<any, any>> - Observable emitting the response.
     * @memberof SubscriptionsService
     */
    public getAllSubscriptions(pagination: any, model: any): Observable<BaseResponse<any, any>> {
        const reqObj = model?.region ? { region: model.region, planName: model.planName } : model;
        return this.http.post(this.config.apiUrl + SUBSCRIPTION_V2_API.GET_ALL_SUBSCRIPTIONS
            ?.replace(':page', encodeURIComponent(pagination?.page ?? ''))
            ?.replace(':count', encodeURIComponent(pagination?.count ?? ''))
            ?.replace(':fromMoveCompany', encodeURIComponent(pagination?.fromMoveCompany ?? ''))
            , reqObj)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
     * Creates a new subscription using the provided model in the SubscriptionsService.
     *
     * @param model - Data model for creating a plan.
     * @returns Observable<BaseResponse<any, any>> - Observable emitting the response.
     * @memberof SubscriptionsService
     */
    public createSubscription(model: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.config.apiUrl + SUBSCRIPTION_V2_API.CREATE_SUBSCRIPTION, model)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
     * Updates a subscription using the provided model in the SubscriptionsService.
     *
     * @param model - Data model for updating a plan.
     * @returns Observable<BaseResponse<any, any>> - Observable emitting the response.
     * @memberof SubscriptionsService
     */
    public updateSubscription(model: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.config.apiUrl + SUBSCRIPTION_V2_API.UPDATE_SUBSCRIPTION
            ?.replace(':company', encodeURIComponent(this.generalService.companyUniqueName ?? '')),
            model)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
     * Retrieves subscription details by ID from the SubscriptionsService.
     *
     * @param id - ID of the subscription to retrieve.
     * @returns Observable<BaseResponse<any, any>> - Observable emitting the response.
     * @memberof SubscriptionsService
     */
    public viewSubscriptionById(id: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + SUBSCRIPTION_V2_API.SUBSCRIPTION_BY_ID
            ?.replace(':subscriptionId', encodeURIComponent(id ?? '')))
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
     * Cancels a subscription by ID using the SubscriptionsService.
     *
     * @param id - ID of the subscription to cancel.
     * @returns Observable<BaseResponse<any, any>> - Observable emitting the response.
     * @memberof SubscriptionsService
     */
    public cancelSubscriptionById(id: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + SUBSCRIPTION_V2_API.CANCEL_SUBSCRIPTION_BY_ID
            ?.replace(':subscriptionId', encodeURIComponent(id ?? '')))
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
     * Transfers a subscription using the provided model and subscription ID in the SubscriptionsService.
     *
     * @param model - Data model for transferring subscription.
     * @param subscriptionId - ID of the subscription to transfer.
     * @returns Observable<BaseResponse<any, any>> - Observable emitting the response.
     * @memberof SubscriptionsService
     */
    public transferSubscription(model: any, subscriptionId: string): Observable<BaseResponse<any, any>> {
        return this.http.post(this.config.apiUrl + SUBSCRIPTION_V2_API.TRANSFER
            ?.replace(':subscriptionId', encodeURIComponent(subscriptionId ?? '')),
            model)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
     * Verifies ownership using the provided ID in the SubscriptionsService.
     *
     * @param {*} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SubscriptionsService
     */
    public verifyOwnership(model: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.config.apiUrl + SUBSCRIPTION_V2_API.VERIFY_OWNERSHIP
            ?.replace(':requestId', encodeURIComponent(model?.reqId ? model?.reqId : model))
            ?.replace(':reject', encodeURIComponent(model?.reason ? true : false)), model?.reason)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = model?.reason;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model?.reason, {}))
            );
    }

    /**
     * Retrieves billing details by billing account unique name from the SubscriptionsService.
     *
     * @param billingAccountUnqiueName - Unique name of the billing account.
     * @returns Observable<BaseResponse<any, any>> - Observable emitting the response.
     * @memberof SubscriptionsService
     */
    public getBillingDetails(billingAccountUnqiueName: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + SUBSCRIPTION_V2_API.GET_BILLING_DETAILS
            ?.replace(':billingAccountUnqiueName', encodeURIComponent(billingAccountUnqiueName ?? '')))
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
  * Retrieves companies list by subscription ID with provided model and parameters from the SubscriptionsService.
  *
  * @param model - Data model for filtering.
  * @param subscriptionId - ID of the subscription.
  * @param params - Parameters for pagination and sorting.
  * @returns Observable<BaseResponse<any, any>> - Observable emitting the response.
  * @memberof SubscriptionsService
  */
    public getCompaniesListBySubscriptionID(model: any, subscriptionId: any, params: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.config.apiUrl + SUBSCRIPTION_V2_API.GET_COMPANIES_LIST_BY_SUBSCRIPTION_ID
            ?.replace(':subscriptionId', encodeURIComponent(subscriptionId ?? ''))
            ?.replace(':sort', encodeURIComponent(params.sort ?? ''))
            ?.replace(':sortBy', encodeURIComponent(params.sortBy ?? ''))
            ?.replace(':page', encodeURIComponent(params.page ?? ''))
            ?.replace(':count', encodeURIComponent(params.count ?? ''))
            ?.replace(':query', encodeURIComponent(params.query ?? ''))
            , model
        ).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = '';
                data.queryString = {};
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
        );
    }

    /**
     * Updates billing details using the provided model and billing account unique name in the SubscriptionsService.
     *
     * @param model - Data model for updating billing details.
     * @param billingAccountUnqiueName - Unique name of the billing account.
     * @returns Observable<BaseResponse<any, any>> - Observable emitting the response.
     * @memberof SubscriptionsService
     */
    public updateBillingDetails(model: any, billingAccountUnqiueName: any): Observable<BaseResponse<any, any>> {
        return this.http.patch(this.config.apiUrl + SUBSCRIPTION_V2_API.UPDATE_BILLING_DETAILS
            ?.replace(':billingAccountUnqiueName', encodeURIComponent(billingAccountUnqiueName ?? '')), model)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
     * This will be use for generating order by subscription id
     *
     * @param {*} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SubscriptionsService
     */
    public generateOrderBySubscriptionId(model: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + SUBSCRIPTION_V2_API.GENERATE_ORDER_BY_SUBSCRIPTION_ID
            ?.replace(':subscriptionId', encodeURIComponent(model?.subscriptionId))
            ?.replace(':promocode', encodeURIComponent(model?.promoCode ?? '')))
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
     * This will be use for get change plan details
     *
     * @param {*} request
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SubscriptionsService
     */
    public getChangePlanDetails(request: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.config.apiUrl + SUBSCRIPTION_V2_API.GET_CHANGE_PLAN_DETAILS, request)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
     * This will be use for update plan
     *
     * @param {*} request
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SubscriptionsService
     */
    public updatePlan(request: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.config.apiUrl + SUBSCRIPTION_V2_API.UPDATE_PLAN, request)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
    * This will be use for buy plan
    *
    * @param {*} model
    * @return {*}  {Observable<BaseResponse<any, any>>}
    * @memberof SubscriptionsService
    */
    public buyPlan(model: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.config.apiUrl + SUBSCRIPTION_V2_API.BUY_PLAN,
            model)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
     *  This will be use for get all companies by subscription id
     *
     * @param {*} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SubscriptionsService
     */
    public getCompaniesBySubscriptionId(model: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + SUBSCRIPTION_V2_API.GET_COMPANIES_BY_SUBSCRIPTION_ID
            ?.replace(':subscriptionId', encodeURIComponent(model?.subscriptionId))
            ?.replace(":page", model.page)
            ?.replace(":q", model.q ?? '')
            ?.replace(":count", model.count))
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
     * Save payment provider by subscription id
     *
     * @param {*} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SubscriptionsService
     */
    public savePaymentProviderBySubscriptionID(model: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.config.apiUrl + SUBSCRIPTION_V2_API.SAVE_PAYMENT_METHOD,
            model)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
     * Get payment method list
     *
     * @param {*} subscriptionId
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SubscriptionsService
     */
    public getPaymentProviderListBySubscriptionID(subscriptionId: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + SUBSCRIPTION_V2_API.GET_PAYMENT_METHODS
            ?.replace(':subscriptionId', encodeURIComponent(subscriptionId)))
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
     * Delete payment method
     *
     * @param {string} paymentUniqueName
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SubscriptionsService
     */
    public deletePaymentMethod(paymentUniqueName: string): Observable<BaseResponse<any, any>> {
        return this.http.delete(this.config.apiUrl + SUBSCRIPTION_V2_API.DELETE_PAYMENT_METHOD
            ?.replace(':paymentUniqueName', encodeURIComponent(paymentUniqueName ?? '')), '')
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
     * Set default method
     *
     * @param {string} paymentUniqueName
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SubscriptionsService
     */
    public setDetaultPaymentMethod(paymentUniqueName: string): Observable<BaseResponse<any, any>> {
        return this.http.patch(this.config.apiUrl + SUBSCRIPTION_V2_API.SET_DEFAULT_PAYMENT_METHOD
            ?.replace(':paymentUniqueName', encodeURIComponent(paymentUniqueName ?? '')), '')
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
     * Set archive/unarchive company
     *
     * @param {*} model
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SubscriptionsService
     */
    public setArchiveUnarchiveCompany(model: any): Observable<BaseResponse<any, any>> {
        return this.http.patch(this.config.apiUrl + SUBSCRIPTION_V2_API.SET_ARCHIVE_UNARCHIVE_COMPANY
            ?.replace(':companyUniqueName', encodeURIComponent(model?.companyUniqueName ?? '')), model?.status)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = model?.status;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model?.status, {}))
            );
    }

    /**
     * Activate plan
     *
     * @param {*} subscriptionId
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof SubscriptionsService
     */
    public activatePlan(subscriptionId: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + SUBSCRIPTION_V2_API.ACTIVATE_PLAN
            ?.replace(':subscriptionId', encodeURIComponent(subscriptionId)))
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    /**
    * Get plan amount calculation
    *
    * @param {*} model
    * @return {*}  {Observable<BaseResponse<any, any>>}
    * @memberof SubscriptionsService
    */
    public getPlanAmountCalculation(model: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.config.apiUrl + SUBSCRIPTION_V2_API.CALCULATION_PLAN_AMOUNT, model)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = model;
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model, {}))
            );
    }


    /**
    * Get Paypal capture plan
    *
    * @param {*} model
    * @return {*}  {Observable<BaseResponse<any, any>>}
    * @memberof SubscriptionsService
    */
    public paypalCaptureOrder(model: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.config.apiUrl + SUBSCRIPTION_V2_API.PAYPAL_CAPTURE_PLAN
            ?.replace(':subscriptionId', encodeURIComponent(model?.subscriptionId))
            ?.replace(':orderId', encodeURIComponent(model?.orderId))
            , '')
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model, {}))
            );
    }
}
