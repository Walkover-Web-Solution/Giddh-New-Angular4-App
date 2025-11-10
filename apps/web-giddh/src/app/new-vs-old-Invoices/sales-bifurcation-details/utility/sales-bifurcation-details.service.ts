import { Inject, Injectable, Optional } from "@angular/core";
import { Observable, catchError, map } from "rxjs";
import { HttpWrapperService } from "../../../services/http-wrapper.service";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { GiddhErrorHandler } from "../../../services/catchManager/catchmanger";
import { IServiceConfigArgs, ServiceConfig } from "../../../services/service.config";
import { GeneralService } from "../../../services/general.service";
import { SALES_BIFURCATION_API } from "./sales-bifurcation-details.api";

@Injectable()
export class SalesBifurcationDetailsService {
    constructor(
        private http: HttpWrapperService,
        private errorHandler: GiddhErrorHandler,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs
    ) { }

    /**
     * Get sales person list
     *
     * @param {any} params
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SalesBifurcationDetailsService
     */
    public salesBifurcationDetails(params: any = {}): Observable<BaseResponse<any, any>> {
        return this.http.get(this.config.apiUrl + SALES_BIFURCATION_API
            ?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName))
            ?.replace(':type', params?.type?.toString())
            ?.replace(':value', params?.value?.toString())
            ?.replace(':dataType', params?.dataType?.toString())
            ?.replace(':page', params?.page?.toString())
            ?.replace(':count', params?.count?.toString())
            ?.replace(':q', encodeURIComponent(params?.q || ''))
            ?.replace(':sort', params?.sort?.toString())
            ?.replace(':sortBy', params?.sortBy?.toString())
            ?.replace(':fromDate', params?.fromDate?.toString() ?? '')
            ?.replace(':toDate', params?.toDate?.toString() ?? '')
            ?.replace(':salesFrom', params?.salesFrom?.toString() ?? ''))
            .pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.queryString = params;
                return data;
            }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, null, params)));
    }

}