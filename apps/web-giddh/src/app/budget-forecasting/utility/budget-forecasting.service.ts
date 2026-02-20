import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpWrapperService } from '../../services/http-wrapper.service';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GiddhErrorHandler } from '../../services/catchManager/catchmanger';
import { GeneralService } from '../../services/general.service';
import { IServiceConfigArgs, ServiceConfig } from '../../services/service.config';
import { BUDGET_FORECASTING_API } from './apiurls/budget-forecasting.api';
import { ForecastPayload, ForecastResponse } from './budget-forecasting.model';

/**
 * Service for managing budget forecasting functionality
 * Handles all API calls related to cashflow forecasting
 * 
 * @export
 * @class BudgetForecastingService
 */
@Injectable({
    providedIn: 'root'
})
export class BudgetForecastingService {
    private errorHandler = inject(GiddhErrorHandler);
    public http = inject(HttpWrapperService);
    private generalService = inject(GeneralService);
    private config = inject<IServiceConfigArgs>(ServiceConfig);

    /**
     * Fetches forecast data from the API
     *
     * @param {ForecastPayload} requestData - Forecast request parameters
     * @returns {Observable<BaseResponse<ForecastResponse[], ForecastPayload>>} Observable of forecast response
     * @memberof BudgetForecastingService
     */
    public getForecast(requestData: ForecastPayload): Observable<BaseResponse<ForecastResponse[], ForecastPayload>> {
        const url = this.config.apiUrl + BUDGET_FORECASTING_API.GET_FORECAST
            .replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));

        return this.http.post(url, requestData).pipe(
            map((res) => {
                let data: BaseResponse<ForecastResponse[], ForecastPayload> = res;
                data.request = requestData;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<ForecastResponse[], ForecastPayload>(e, requestData, ''))
        );
    }
}
