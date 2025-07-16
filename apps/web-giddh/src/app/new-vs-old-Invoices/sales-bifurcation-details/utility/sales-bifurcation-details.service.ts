import { Inject, Injectable, Optional } from "@angular/core";
import { environment } from "src/environments/environment";
import { Observable, catchError, map } from "rxjs";
import { HttpWrapperService } from "../../../services/http-wrapper.service";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { GiddhErrorHandler } from "../../../services/catchManager/catchmanger";
import { IServiceConfigArgs, ServiceConfig } from "../../../services/service.config";
import { GeneralService } from "../../../services/general.service";
import { HttpMethod, HttpMethodType } from "../../../app.constant";

const SALES_PERSON_API = 'company/:companyUniqueName/salesperson';

@Injectable()
export class SalesBifurcationDetailsService {
    constructor(
        private http: HttpWrapperService,
        private errorHandler: GiddhErrorHandler,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs
    ) {  }

    /**
     * Get sales person list
     *
     * @param {string} uniqueName
     * @param {HttpMethodType} [httpMethod=HttpMethod.GET]
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SalesBifurcationDetailsService
     */
    public salesBifurcationDetails(httpMethod: HttpMethodType = HttpMethod.GET, model: any = {}, uniqueName: string = null, params: any = {}): Observable<BaseResponse<any, any>> {
        let url = this.config?.apiUrl + 
        SALES_PERSON_API?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));
        if (uniqueName) {
            url += `/${encodeURIComponent(uniqueName)}`;
        }
        if (httpMethod === HttpMethod.GET) {
            url += `?page=${params?.page || 1}&count=${params?.count || 200}`;
        }
        return this.http[httpMethod](url, model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {})));
    }

}
