import { map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeoLocationSearch } from '../models/other-models/GeoLocationSearch';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

declare var _: any;

@Injectable()
export class LocationService {
    private GoogleApiURL: string = 'cities?q=:q';
    private _: any;

    constructor(private _http: HttpClient, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this._ = config._;
        _ = config._;
    }

    public GetCity(location: GeoLocationSearch) {
        let url = this.config.apiUrl + this.GoogleApiURL;
        return this._http.get(url.replace(':q', location.QueryString)).pipe(
            map((res) => {
                let r = res as any;
                let data = r.status === 'success' ? r.body.items : [];
                return data;
            }));
    }
}
