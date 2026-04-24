import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from "./catchManager/catchmanger";
import { HttpWrapperService } from "./http-wrapper.service";
import { Observable } from "rxjs";
import { get } from '../lodash-optimized';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable({
    providedIn: 'root'
})
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

    constructor(
        private errorHandler: GiddhErrorHandler,
        private http: HttpWrapperService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs
    ) {

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
                let data: BaseResponse<any, any> = this.replaceBrandName(res);

                if (!folder) {
                    this.commonLocale = data;
                }

                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Recursively replaces the [BRAND_NAME] placeholder in all string values
     * of a locale object with the configured brand name.
     *
     * @private
     * @param {*} obj - The locale object or value to process
     * @returns {*} The processed object with brand name substituted
     * @memberof LocaleService
     */
    private replaceBrandName(obj: any): any {
        const brandName = this.config?.BRAND_NAME ?? '';
        const supportEmail = this.config?.SUPPORT_EMAIL ?? '';
        const supportPhone = this.config?.SUPPORT_PHONE ?? '';
        const replace = (value: any): any => {
            if (typeof value === 'string') {
                return value
                    .replace(/\[BRAND_NAME\]/g, brandName)
                    .replace(/\[SUPPORT_EMAIL\]/g, supportEmail)
                    .replace(/\[SUPPORT_PHONE\]/g, supportPhone);
            }
            if (Array.isArray(value)) {
                return value.map(replace);
            }
            if (value !== null && typeof value === 'object') {
                const result: any = {};
                for (const key of Object.keys(value)) {
                    result[key] = replace(value[key]);
                }
                return result;
            }
            return value;
        };
        return replace(obj);
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
