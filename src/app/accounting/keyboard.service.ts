import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { AppState } from './../store/roots';
import { SessionState } from './../store/authentication/authentication.reducer';
import { Injectable, HostListener } from '@angular/core';
import { createSelector } from 'reselect';

@Injectable()
export class KeyboardService {

  public keyInformation: Subject<KeyboardEvent> = new Subject();

  public setKey(event: KeyboardEvent) {
    this.keyInformation.next(event);
  }
}
