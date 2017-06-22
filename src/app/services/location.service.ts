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

@Injectable()
export class LocationService {
  public appTitle = new Subject<string>();
  public authKey: string;
  // tslint:disable-next-line:no-empty
  constructor(private _http: Http) {
  }
  // tslint:disable-next-line:no-empty
  public GetCity() {
  }
}
