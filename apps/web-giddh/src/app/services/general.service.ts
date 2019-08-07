import { Injectable } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BehaviorSubject, Subject } from 'rxjs';
import { eventsConst }  from 'apps/web-giddh/src/app/shared/header/components/eventsConst';
import { IUlist } from '../models/interfaces/ulist.interface';
import { CompanyRequest, CompanyCreateRequest } from '../models/api-models/Company';

@Injectable()
export class GeneralService {

  public talkToSalesModal: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isCurrencyPipeLoaded: boolean = false;

  public menuClickedFromOutSideHeader: BehaviorSubject<IUlist> = new BehaviorSubject<IUlist>(null);
  public invalidMenuClicked: BehaviorSubject<{next: IUlist, previous: IUlist}> = new BehaviorSubject<{next: IUlist, previous: IUlist}>(null);

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
  get currencyType(): string {
    return this._currencyType;
  }

  set currencyType(currencyType: string) {
    this._currencyType = currencyType;

  }
   get createNewCompany(): CompanyCreateRequest {
    return this._createNewCompany;
  }

  set createNewCompany(newCompanyRequest: CompanyCreateRequest) {
    this._createNewCompany = newCompanyRequest;
  }

  public eventHandler: Subject<{ name: eventsConst, payload: any }> = new Subject();
  public IAmLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _user: UserDetails;
  private _createNewCompany: CompanyCreateRequest;

  private _companyUniqueName: string;

  private _currencyType = '1,00,00,000';   // there will be four type of currencyType a.1,00,00,000 (INR),b.10,000,000,c.10\'000\'000,d.10 000 000

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
