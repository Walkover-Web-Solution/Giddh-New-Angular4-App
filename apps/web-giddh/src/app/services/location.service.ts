import { map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { GeoLocationSearch } from '../models/other-models/geo-location-search';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { HttpWrapperService } from './http-wrapper.service';

declare var _: any;

@Injectable()
export class LocationService {
    private GoogleApiURL: string = 'cities?q=:q';
    private _: any;

    constructor(private http: HttpWrapperService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this._ = config._;
        _ = config._;
    }

    public GetCity(location: GeoLocationSearch) {
        let url = this.config.apiUrl + this.GoogleApiURL;
        return this.http.get(url?.replace(':q', location.QueryString)).pipe(
            map((res) => {
                let r = res as any;
                let data = r?.status === 'success' ? r.body.items : [];
                return data;
            }));
    }
}
