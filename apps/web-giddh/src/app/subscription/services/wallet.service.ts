import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../services/http-wrapper.service';
import { GiddhErrorHandler } from '../../services/catchManager/catchmanger';
import { GeneralService } from '../../services/general.service';
import { WALLET_API } from '../wallet.api';
import { BaseResponse } from '../../models/api-models/BaseResponse';

@Injectable({
    providedIn: 'root'
})
export class WalletService {

    constructor(
        private http: HttpWrapperService,
        private errorHandler: GiddhErrorHandler,
        private generalService: GeneralService
    ) {
    }

    /**
     * Sends a GET request to retrieve subscription data by ID.
     *
     * @param {string} subscriptionId - The subscription ID.
     * @returns An observable of the API response with the subscription data.
     * @memberof WalletService
     */
    public getSubscriptionData(subscriptionId: string): Observable<BaseResponse<any, any>> {
        return this.http.get(this.generalService.replaceUrlPlaceholders(WALLET_API.GET_SUBSCRIPTION_DATA, { subscriptionId }))
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * Sends a GET request to retrieve wallet details for a subscription.
     *
     * @param {string} subscriptionId - The subscription ID.
     * @returns An observable of the API response with the wallet details.
     * @memberof WalletService
     */
    public getWalletDetails(subscriptionId: string): Observable<BaseResponse<any, any>> {
        return this.http.get(this.generalService.replaceUrlPlaceholders(WALLET_API.GET_WALLET_DETAILS, { subscriptionId }))
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * Sends a POST request to add amount to wallet.
     *
     * @param {any} payload - Payload containing subscriptionId, walletAmount, duration, and paymentProvider.
     * @returns An observable of the API response.
     * @memberof WalletService
     */
    public addWalletAmount(payload: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.generalService.replaceUrlPlaceholders(WALLET_API.ADD_WALLET_AMOUNT, {}), payload)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', payload)));
    }

    /**
     * Sends a POST request to capture wallet payment after payment gateway confirmation.
     *
     * @param {any} payload - Payload containing subscriptionId, duration, paymentProvider, razorpayOrderId/payuTransactionId, and paymentId.
     * @returns An observable of the API response.
     * @memberof WalletService
     */
    public captureWalletPayment(payload: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.generalService.replaceUrlPlaceholders(WALLET_API.CAPTURE_WALLET_PAYMENT, { subscriptionId: payload.subscriptionId }), payload)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', payload)));
    }

    /**
     * Sends a GET request to retrieve wallet transaction logs with pagination.
     *
     * @param {string} subscriptionId - The subscription ID.
     * @param {any} params - Query parameters (page, count).
     * @returns An observable of the API response with the wallet logs.
     * @memberof WalletService
     */
    public getWalletLogs(subscriptionId: string, params: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.generalService.replaceUrlPlaceholders(WALLET_API.GET_WALLET_LOGS, { subscriptionId, page: params.page, count: params.count }))
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }
}
