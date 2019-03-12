import { Injectable } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BehaviorSubject, Subject } from 'rxjs';
import { eventsConst } from 'app/shared/header/components/eventsConst';

@Injectable()
export class GeneralService {

  public talkToSalesModal: BehaviorSubject<boolean> = new BehaviorSubject(false);

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
  // currencyType define specific type of currency out of four type of urrencyType a.1,00,00,000 ,b.10,000,000,c.10\'000\'000,d.10 000 000  
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

  private _currencyType='1,00,00,000';   // there will be four type of currencyType a.1,00,00,000 (INR),b.10,000,000,c.10\'000\'000,d.10 000 000  

  private _sessionId: string;

  public resetGeneralServiceState() {
    this.user = null;
    this.sessionId = null;
    this.companyUniqueName = null;
  }

  public SetIAmLoaded(iAmLoaded: boolean) {
    this.IAmLoaded.next(iAmLoaded);
  }
}
