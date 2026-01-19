import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from "./catchManager/catchmanger";
import { HttpWrapperService } from "./http-wrapper.service";
import { Observable } from "rxjs";
import { get } from '../lodash-optimized';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * LocaleService service
 * Provides locale related business logic and data operations
 */
export class LocaleService {
    /** This will hold the common locale json */
    public commonLocale: any = {};
    /** This will hold active language code */
    private _language: string;
    
    /**
     * Returns the active language code
     *
     * @type {string}
     * @memberof LocaleService
     */
    get language(): string {
        return this._language;
    }

    /**
     * Sets the active language code
     *
     * @memberof LocaleService
     */
    set language(lang: string) {
        this._language = lang;
    }

    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
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
        /**
         * Handles if functionality
         */
        if (folder) {
            url = "assets/locale/" + folder + "/" + languageCode + ".json";
        } else {
            url = "assets/locale/" + languageCode + ".json";
        }

        return this.http.get(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, any> = res;

                /**
                 * Handles if functionality
                 */
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
