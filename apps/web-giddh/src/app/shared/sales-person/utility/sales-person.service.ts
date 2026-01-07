import { Inject, Injectable, Optional } from "@angular/core";
import { Observable, catchError, map } from "rxjs";
import { HttpWrapperService } from "../../../services/http-wrapper.service";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { GiddhErrorHandler } from "../../../services/catchManager/catchmanger";
import { IServiceConfigArgs, ServiceConfig } from "../../../services/service.config";
import { GeneralService } from "../../../services/general.service";
import { API_BULK_FETCH_LIMIT, HttpMethod, HttpMethodType } from "../../../app.constant";
import { SALES_PERSON_API, SALES_PERSON_ARCHIVE_API } from "./sales.person.api";
import { SalesPersonDeleteArchivedModel } from "./sales-person.constant";

@Injectable({
    providedIn: 'root'
})
export class SalesPersonService {
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
     * @memberof SalesPersonService
     */
    public salesPerson(httpMethod: HttpMethodType = HttpMethod.GET, model: any = {}, uniqueName: string = null, params: any = {}): Observable<BaseResponse<any, any>> {
        let url = this.config?.apiUrl +
        SALES_PERSON_API?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));
        if (uniqueName) {
            url += `/${encodeURIComponent(uniqueName)}`;
        }
        if (httpMethod === HttpMethod.GET) {
            url += `?page=${params?.page || 1}&count=${params?.count || API_BULK_FETCH_LIMIT}&archive=${params?.archive ?? false}`; // archive is false by default means only active sales person will be fetched
        }
        return this.http[httpMethod](url, model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {})));
    }

    /**
     * Archive sales person
     *
     * @param {SalesPersonDeleteArchivedModel} model
     * @param {string} salesPersonUniqueName
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SalesPersonService
     */
    public salesPersonArchive(model: SalesPersonDeleteArchivedModel, salesPersonUniqueName: string = null): Observable<BaseResponse<any, any>> {
        let url = this.config?.apiUrl + SALES_PERSON_ARCHIVE_API
        ?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName))
        ?.replace(':uniqueName', encodeURIComponent(salesPersonUniqueName));
        return this.http.post(url, model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {})));
    }
}
