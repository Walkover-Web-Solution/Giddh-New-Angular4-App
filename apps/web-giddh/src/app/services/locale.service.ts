import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from "./catchManager/catchmanger";
import { HttpWrapperService } from "./httpWrapper.service";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LocaleService {
    public _commonData: Subject<any> = new Subject();

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService) {
        this.getLocale('', 'en').subscribe(response => {
            this._commonData.next(response);
        });
    }

    /**
     * This will return the common json file data
     *
     * @readonly
     * @type {*}
     * @memberof LocaleService
     */
    get commonData(): any {
        return this._commonData.asObservable();
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
        if(folder) {
            url = "/assets/locale/" + folder + "/" + languageCode + ".json";
        } else {
            url = "/assets/locale/" + languageCode + ".json";
        }

        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }
}