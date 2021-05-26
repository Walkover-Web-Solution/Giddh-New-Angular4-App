import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from "./catchManager/catchmanger";
import { HttpWrapperService } from "./httpWrapper.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LocaleService {
    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService) {

    }

    /**
     * This will call the API to get locale JSON
     *
     * @param {string} folder
     * @param {string} languageCode
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof LocaleService
     */
    public getLocale(folder: string, languageCode: string): Observable<BaseResponse<any, any>> {
        let url = "";
        if (folder) {
            url = "assets/locale/" + folder + "/" + languageCode + ".json";
        } else {
            url = "assets/locale/" + languageCode + ".json";
        }

        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }
}
