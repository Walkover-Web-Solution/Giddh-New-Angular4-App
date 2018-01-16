import { Injectable } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { eventsConst } from 'app/shared/header/components/eventsConst';

@Injectable()
export class GeneralService {
  public eventHandler: Subject<{ name: eventsConst, payload: any }> = new Subject();
  private _user: UserDetails;
  private _companyUniqueName: string;
  private _sessionId: string;

  get user(): UserDetails {
    return this._user;
  }

  set user(userData: UserDetails) {
    this._user = userData;
  }

  get companyUniqueName(): string {
    return this._companyUniqueName;
  }

  set companyUniqueName(companyUniqueName: string) {
    this._companyUniqueName = companyUniqueName;
  }

  get sessionId(): string {
    return this._sessionId;
  }

  set sessionId(sessionId: string) {
    this._sessionId = sessionId;
  }

  public resetGeneralServiceState() {
    this.user = null;
    this.sessionId = null;
    this.companyUniqueName = null;
  }
}
