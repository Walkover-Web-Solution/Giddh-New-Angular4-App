import { Injectable, Inject, Optional } from '@angular/core';
import { Domain } from '../models/domain';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { GeoLocationSearch } from '../models/other-models/GeoLocationSearch';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
declare var _: any;

@Injectable()
export class LocationService {
  private GoogleApiURL: string = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCaphDTQJXyr1lhnaXP_nm7a5dqgr5KVJU';
  private _: any;
  constructor(private _http: HttpClient, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    this._ = config._;
    _ = config._;
  }

  public GetCity(location: GeoLocationSearch) {
    let query = ``;
    if (location.Country !== undefined) {
      query += `address=${location.QueryString}&components=country:${location.Country}|administrative_area:${location.QueryString}`;
    } else if (location.AdministratorLevel !== undefined) {
      query += `address=${location.QueryString}&components=administrative_area:${location.QueryString}`;
    } else if (location.OnlyCity) {
      if (location.QueryString && location.QueryString !== '') {
        query += `address=${location.QueryString}`;
      } else {
        query += `address=''`;
      }
    } else {
      query += `components=country:${location.QueryString}`;
    }
    return this._http.get(this.GoogleApiURL + '&' + query, { responseType: 'json' })
      .map((res) => {
        let r = res as any;
        let data = r.results.filter((i) => _.includes(i.types, 'locality'));
        return data;
      });
  }
}
