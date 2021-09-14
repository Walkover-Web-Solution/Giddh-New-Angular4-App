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
    /** This will hold the common locale json */
    public commonLocale: any = {};
    private _language: string;
    
    get language(): string {
        return this._language;
    }

    set language(lang: string) {
        this._language = lang;
    }

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

                if (!folder) {
                    this.commonLocale = data;
                }

                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * This will return the translation of provided key from common locale json
     *
     * @param {string} key
     * @returns {*}
     * @memberof LocaleService
     */
    public translate(key: string): any {
        return key.split('.').reduce(function(previous, current) {
            return previous ? previous[current] : null
        }, this.commonLocale);
    }
}
