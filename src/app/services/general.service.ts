import { Injectable } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { Subject } from 'rxjs';
import { eventsConst } from 'app/shared/header/components/eventsConst';

@Injectable()
export class GeneralService {
  public eventHandler: Subject<{ name: eventsConst, payload: any }> = new Subject();
  private _user: UserDetails;

  get user(): UserDetails {
    return this._user;
  }

  set user(userData: UserDetails) {
    this._user = userData;
  }

  private _companyUniqueName: string;

  get companyUniqueName(): string {
    return this._companyUniqueName;
  }

  set companyUniqueName(companyUniqueName: string) {
    this._companyUniqueName = companyUniqueName;
  }

  private _sessionId: string;

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
