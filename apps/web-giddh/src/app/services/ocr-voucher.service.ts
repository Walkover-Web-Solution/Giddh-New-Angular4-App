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
import { OCR_VOUCHER_API } from './apiurls/ocr-voucher.api';

@Injectable()
export class OcrVoucherService {
    public dayjs = dayjs;

    constructor(private errorHandler: GiddhErrorHandler,
        public http: HttpWrapperService,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {

    }

    /**
     * Retrieves all subscriptions with pagination and provided model from the SubscriptionsService.
     *
     * @param pagination - Pagination details.
     * @param model - Data model for filtering.
     * @returns Observable<BaseResponse<any, any>> - Observable emitting the response.
     * @memberof SubscriptionsService
     */
    public getAllOcrDocuments(pagination: any, model: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.config.apiUrl + OCR_VOUCHER_API.GET_ALL_OCR_DOCUMENTS
            ?.replace(':page', encodeURIComponent(pagination?.page ?? ''))
            ?.replace(':count', encodeURIComponent(pagination?.count ?? ''))
            ?.replace(':from', encodeURIComponent(pagination?.from ?? ''))
            ?.replace(':to', encodeURIComponent(pagination?.to ?? ''))
            , model)
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
}
