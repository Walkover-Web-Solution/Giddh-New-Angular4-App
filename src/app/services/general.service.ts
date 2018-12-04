import { Injectable } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BehaviorSubject, Subject } from 'rxjs';
import { eventsConst } from 'app/shared/header/components/eventsConst';

@Injectable()
export class GeneralService {

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
  // currencyType define specific type of currency out of four type which is a.  1,00,00,000  b. 10,000,000 c. 10\'000\'000  d. 10 000 000
get currencyType():string{

  return this._currencyType;
  }
  
  set currencyType(currencyType:string){
  this._currencyType=currencyType;
  
  }
  

  public eventHandler: Subject<{ name: eventsConst, payload: any }> = new Subject();
  public IAmLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _user: UserDetails;

  private _companyUniqueName: string;
  private _sessionId: string;
  private _currencyType='1,00,00,000';   // currency type will be out of these four type a.  1,00,00,000  b. 10,000,000 c. 10\'000\'000  d. 10 000 000
  public resetGeneralServiceState() {
    this.user = null;
    this.sessionId = null;
    this.companyUniqueName = null;
  }

  public SetIAmLoaded(iAmLoaded: boolean) {
    this.IAmLoaded.next(iAmLoaded);
  }
}
