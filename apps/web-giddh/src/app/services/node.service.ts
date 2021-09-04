import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BaseResponse } from "../models/api-models/BaseResponse";
import { NODE_API } from "./apiurls/node.api";
import { GiddhErrorHandler } from "./catchManager/catchmanger";
import { GeneralService } from "./general.service";
import { HttpWrapperService } from "./httpWrapper.service";

@Injectable()
export class NodeService {

    constructor(
        private errorHandler: GiddhErrorHandler,
        private http: HttpWrapperService,
        private generalService: GeneralService) {

    }

    public saveCompany(): Observable<BaseResponse<any, any>> {
        let apiUrl = this.generalService.getApiDomain();
        return this.http.get(apiUrl + NODE_API.SAVE_COMPANY.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }
}