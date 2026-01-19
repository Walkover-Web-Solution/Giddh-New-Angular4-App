import { finalize, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoaderService } from "../loader/loader.service";
import { GeneralService } from "./general.service";
import { get, keys, map } from '../lodash-optimized';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * HttpWrapperService service
 * Provides httpwrapper related business logic and data operations
 */
export class HttpWrapperService {
    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private http: HttpClient,
        private loaderService: LoaderService,
        private generalService: GeneralService
    ) {

    }

    /**
     * Retrieves  data
     */
    public get = (
        url: string,
        params?: any,
        options?: any
    ): Observable<any> => {
        options = this.prepareOptions(options);
        options.params = params;
        return this.http.get(url, options).pipe(
            /**
             * Handles finalize functionality
             */
            finalize(() => {
                this.hideLoader();
            })
        );
    };
    /**
     * Handles post functionality
     */
    public post = (url: string, body: any, options?: any): Observable<any> => {
        options = this.prepareOptions(options);
        return this.http.post(url, body, options).pipe(
            /**
             * Handles finalize functionality
             */
            finalize(() => {
                this.hideLoader();
            })
        );
    };
    /**
     * Handles put functionality
     */
    public put = (url: string, body: any, options?: any): Observable<any> => {
        options = this.prepareOptions(options);
        return this.http.put(url, body, options).pipe(
            /**
             * Handles finalize functionality
             */
            finalize(() => {
                this.hideLoader();
            })
        );
    };
    /**
     * Deletes 
     */
    public delete = (
        url: string,
        params?: any,
        options?: any
    ): Observable<any> => {
        options = this.prepareOptions(options);
        options.search = this.objectToParams(params);
        return this.http.delete(url, options).pipe(
            /**
             * Handles finalize functionality
             */
            finalize(() => {
                this.hideLoader();
            })
        );
    };

    /**
     * Deletes withbody
     */
    public deleteWithBody = (url: string, request: any): Observable<any> => {
        let options = { headers: {}, body: {} };
        options.headers["Session-Id"] = this.generalService.sessionId;
        options.headers["Content-Type"] = "application/json";
        options.headers["Accept"] = "application/json";
        options.headers = new HttpHeaders(options.headers);
        options.body = request;
        this.showLoader();
        return this.http.delete(url, options).pipe(
            /**
             * Handles finalize functionality
             */
            finalize(() => {
                this.hideLoader();
            })
        );
    };

    /**
     * Handles patch functionality
     */
    public patch = (url: string, body: any, options?: any): Observable<any> => {
        options = this.prepareOptions(options);
        return this.http.patch(url, body, options).pipe(
            /**
             * Handles finalize functionality
             */
            finalize(() => {
                this.hideLoader();
            })
        );
    };

    /**
     * Handles prepareOptions functionality
     */
    public prepareOptions(options: any): any {
        /**
         * Handles if functionality
         */
        if (options && options.loader) {
            /**
             * Handles if functionality
             */
            if (options.loader !== "hide") {
                this.showLoader();
            }
        } else {
            this.showLoader();
        }
        let sessionId = this.generalService.sessionId;
        options = options || {};

        /**
         * Handles if functionality
         */
        if (!options.headers) {
            options.headers = {} as any;
        }

        /**
         * Handles if functionality
         */
        if (sessionId) {
            options.headers["Session-Id"] = sessionId;
        }

        options.headers["cache-control"] = "no-cache";
        /**
         * Handles if functionality
         */
        if (!options.headers["Content-Type"]) {
            options.headers["Content-Type"] = "application/json";
        }
        /**
         * Handles if functionality
         */
        if (options.headers["Content-Type"] === "multipart/form-data") {
            delete options.headers["Content-Type"];
        }
        /**
         * Handles if functionality
         */
        if (!options.headers["Accept"] && options.headers["Content-Type"] != "application/x-www-form-urlencoded") {
            options.headers["Accept"] = "application/json";
        }
        /**
         * Handles if functionality
         */
        if (options.headers["Content-Type"] == "application/x-www-form-urlencoded") {
            delete options.headers["cache-control"];
            delete options.headers["Session-Id"];
        }
        // options.headers["X-Tenant"] = this.generalService.getUtmParameter("X-Tenant");
        options.headers = new HttpHeaders(options.headers);
        return options;
    }

    /**
     * Handles isPrimitive functionality
     */
    public isPrimitive(value) {
        /**
         * Handles return functionality
         */
        return (
            value == null ||
            (typeof value !== "function" && typeof value !== "object")
        );
    }

    /**
     * Handles objectToParams functionality
     */
    public objectToParams(object = {}) {
        return Object.keys(object)
            .map(value => {
                let objectValue = this.isPrimitive(object[value])
                    ? object[value]
                    : JSON.stringify(object[value]);
                return `${value}=${objectValue}`;
            })
            .join("&");
    }

    /**
     * Shows loader element
     */
    private showLoader(): void {
        this.loaderService.show();
    }

    /**
     * Hides loader element
     */
    private hideLoader(): void {
        this.loaderService.hide();
    }
}
