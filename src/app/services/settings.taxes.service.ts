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
import { SETTINGS_PROFILE_API } from './apiurls/settings.profile.api';
import { COMPANY_API } from './apiurls/comapny.api';

@Injectable()
export class SettingsTaxesService {

  private user: UserDetails;
  private companyUniqueName: string;
  private roleUniqueName: string;

  constructor(private _http: HttpWrapperService, private store: Store<AppState>) {}

  /**
    * Create Tax
    */
    public CreateTax(model): Observable<BaseResponse<any, any>> {
        this.store.take(1).subscribe(s => {
            if (s.session.user) {
                this.user = s.session.user.user;
            }
            this.companyUniqueName = s.session.companyUniqueName;
        });
        return this._http.post(COMPANY_API.TAX.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
            let data: BaseResponse<any, any> = res.json();
            data.request = model;
            return data;
        }).catch((e) => HandleCatch<any, any>(e, model));
    }

    /**
    * Update Tax
    */
    public UpdateTax(model, taxUniqueName: string): Observable<BaseResponse<any, any>> {
        this.store.take(1).subscribe(s => {
            if (s.session.user) {
                this.user = s.session.user.user;
            }
            this.companyUniqueName = s.session.companyUniqueName;
        });
        return this._http.put(COMPANY_API.TAX.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)) + '/' + taxUniqueName, model).map((res) => {
            let data: BaseResponse<any, any> = res.json();
            data.request = model;
            return data;
        }).catch((e) => HandleCatch<any, any>(e, model));
    }

    /**
    * Delete Tax
    */
    public DeleteTax(taxUniqueName: string): Observable<BaseResponse<any, any>> {
        this.store.take(1).subscribe(s => {
            if (s.session.user) {
                this.user = s.session.user.user;
            }
            this.companyUniqueName = s.session.companyUniqueName;
        });
        return this._http.delete(COMPANY_API.TAX.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)) + '/' + taxUniqueName).map((res) => {
            let data: BaseResponse<any, any> = res.json();
            data.request = taxUniqueName;
            return data;
        }).catch((e) => HandleCatch<any, any>(e, taxUniqueName));
    }
}
