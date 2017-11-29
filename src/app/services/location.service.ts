import { Injectable } from '@angular/core';

import { Domain } from '../models/domain';
import { Http } from '@angular/http';
import { GeoLocationSearch } from '../models/other-models/GeoLocationSearch';
import * as _ from '../lodash-optimized';

@Injectable()
export class LocationService {
  private GoogleApiURL: string = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCaphDTQJXyr1lhnaXP_nm7a5dqgr5KVJU';

  constructor(private _http: Http) {
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
    return this._http.get(this.GoogleApiURL + '&' + query)
      .map((res) => {
        let r = res.json();
        let data = r.results.filter((i) => _.includes(i.types, 'locality'));
        return data;
      });
  }
}
