import { map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { GeoLocationSearch } from '../models/other-models/geo-location-search';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { HttpWrapperService } from './http-wrapper.service';
import { get } from '../lodash-optimized';

declare var _: any;

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * LocationService service
 * Provides location related business logic and data operations
 */
export class LocationService {
    private GoogleApiURL: string = 'cities?q=:q';
    private _: any;

    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(private http: HttpWrapperService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this._ = config._;
        _ = config._;
    }

    /**
     * Handles GetCity functionality
     */
    public GetCity(location: GeoLocationSearch) {
        let url = this.config.apiUrl + this.GoogleApiURL;
        return this.http.get(url?.replace(':q', location.QueryString)).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let r = res as any;
                let data = r?.status === 'success' ? r.body?.items : [];
                return data;
            }));
    }
}
