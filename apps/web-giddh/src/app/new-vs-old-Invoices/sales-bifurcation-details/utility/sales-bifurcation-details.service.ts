import { Injectable } from "@angular/core";
import { Observable, catchError, map } from "rxjs";
import { HttpWrapperService } from "../../../services/http-wrapper.service";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { GiddhErrorHandler } from "../../../services/catchManager/catchmanger";
import { GeneralService } from "../../../services/general.service";
import { SALES_BIFURCATION_API } from "./sales-bifurcation-details.api";

@Injectable({
    providedIn: 'root'
})
export class SalesBifurcationDetailsService {
    constructor(
        private http: HttpWrapperService,
        private errorHandler: GiddhErrorHandler,
        private generalService: GeneralService
    ) { }

    /**
     * Get sales bifurcation details list (GET — no sales person filter)
     *
     * @param {any} params
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SalesBifurcationDetailsService
     */
    public salesBifurcationDetails(params: any = {}): Observable<BaseResponse<any, any>> {
        return this.http.get(this.generalService.replaceUrlPlaceholders(SALES_BIFURCATION_API, params))
            .pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.queryString = params;
                return data;
            }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, null, params)));
    }

    /**
     * Get sales bifurcation details list filtered by sales person (POST).
     * Sends salesPersonUniqueNames in the request body.
     *
     * @param {any} params
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SalesBifurcationDetailsService
     */
    public salesBifurcationDetailsBySalesPerson(params: any = {}): Observable<BaseResponse<any, any>> {
        const body = { salesPersonUniqueNames: params.salesPersonUniqueNames || [] };
        return this.http.post(this.generalService.replaceUrlPlaceholders(SALES_BIFURCATION_API, params), body)
            .pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.queryString = params;
                return data;
            }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, null, params)));
    }

}