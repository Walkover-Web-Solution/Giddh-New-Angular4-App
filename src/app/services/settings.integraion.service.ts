import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { HandleCatch } from './catchManager/catchmanger';
import { SmsKeyClass, EmailKeyClass } from '../models/api-models/SettingsIntegraion';
import { SETTINGS_INTEGRATION_API } from './apiurls/settings.integration.api';

@Injectable()
export class SettingsIntegrationService {

  private user: UserDetails;
  private companyUniqueName: string;
  private roleUniqueName: string;

  constructor(private _http: HttpWrapperService, private store: Store<AppState>) {}

  /*
  * Get SMS key
  */
  public GetSMSKey(): Observable<BaseResponse<SmsKeyClass, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(SETTINGS_INTEGRATION_API.SMS.replace(':companyUniqueName', this.companyUniqueName)).map((res) => {
      let data: BaseResponse<SmsKeyClass, string> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => HandleCatch<SmsKeyClass, string>(e));
  }

  /**
  * Save SMS Key
  */
  public SaveSMSKey(model: SmsKeyClass): Observable<BaseResponse<string, SmsKeyClass>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.post(SETTINGS_INTEGRATION_API.SMS.replace(':companyUniqueName', this.companyUniqueName), model).map((res) => {
      let data: BaseResponse<string, SmsKeyClass> = res.json();
      data.request = model;
      return data;
    }).catch((e) => HandleCatch<string, SmsKeyClass>(e, model));
  }

  /*
  * Get Email key
  */
  public GetEmailKey(): Observable<BaseResponse<EmailKeyClass, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(SETTINGS_INTEGRATION_API.EMAIL.replace(':companyUniqueName', this.companyUniqueName)).map((res) => {
      let data: BaseResponse<EmailKeyClass, string> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => HandleCatch<EmailKeyClass, string>(e));
  }

  /**
  * Save Email Key
  */
  public SaveEmailKey(model: EmailKeyClass): Observable<BaseResponse<string, EmailKeyClass>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.post(SETTINGS_INTEGRATION_API.EMAIL.replace(':companyUniqueName', this.companyUniqueName), model).map((res) => {
      let data: BaseResponse<string, EmailKeyClass> = res.json();
      data.request = model;
      return data;
    }).catch((e) => HandleCatch<string, EmailKeyClass>(e, model));
  }

}
