import { AppState } from '../store/roots';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Domain } from '../models/domain';
import { Store } from '@ngrx/store';
import { Http } from '@angular/http';
import { GeoLocationSearch } from '../models/other-models/GeoLocationSearch';
import * as _ from 'lodash';

@Injectable()
export class LocationService {
  public appTitle = new Subject<string>();
  public authKey: string;
  private GoogleApiURL: string = 'http://maps.googleapis.com/maps/api/geocode/json?';

  constructor(private _http: Http) {
  }

  public GetCity(location: GeoLocationSearch) {
    let query = ``;
    if (location.Country !== undefined) {
      query += `address=${location.QueryString}&components=country:${location.Country}|administrative_area:${location.QueryString}`;
    } else if (location.AdministratorLevel !== undefined) {
      query += `address=${location.QueryString}&components=administrative_area:${location.QueryString}`;
    } else if (location.OnlyCity) {
      query += `address=${location.QueryString}`;
    } else {
      query += `components=country:${location.QueryString}`;
    }
    return this._http.get(this.GoogleApiURL + query)
      .map((res) => {
        let r = res.json();
        // let data = r.results.map((a) => {
        //   debugger
        //   return a.address_components.map((p) => {
        //     if (_.includes(p.types, 'locality')) {
        //       return p.long_name;
        //     }
        //     return '';
        //   });
        // });
        let data = r.results.filter((i) => _.includes(i.types, 'locality'));
        return data.map(item =>
          item.address_components[0].long_name
        );
        // data = _.uniq(_.flatten(data).filter(p => p !== ''));
      })
      .catch((e) => e);
  }
}
