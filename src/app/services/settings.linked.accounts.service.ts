import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { HandleCatch } from './catchManager/catchmanger';
import { SETTINGS_PROFILE_API } from './apiurls/settings.profile.api';
import { EBANKS } from './apiurls/settings.linked.accounts.api';
import { IGetEbankTokenResponse, IGetAllEbankAccountResponse } from '../models/api-models/SettingsLinkedAccounts';

@Injectable()
export class SettingsLinkedAccountsService {

  private user: UserDetails;
  private companyUniqueName: string;

  constructor(private _http: HttpWrapperService, private store: Store<AppState>) {}

    /**
    * Get ebank token
    */
    public GetEbankToken(): Observable<BaseResponse<IGetEbankTokenResponse, string>> {
        this.store.take(1).subscribe(s => {
            if (s.session.user) {
                this.user = s.session.user.user;
            }
            this.companyUniqueName = s.session.companyUniqueName;
        });
        return this._http.get(EBANKS.GET_TOKEN.replace(':companyUniqueName', this.companyUniqueName)).map((res) => {
            let data: BaseResponse<IGetEbankTokenResponse, string> = res.json();
            return data;
        }).catch((e) => HandleCatch<IGetEbankTokenResponse, string>(e));
    }

    /**
    * Get all ebank accounts
    */
   public GetAllEbankAccounts(): Observable<BaseResponse<IGetAllEbankAccountResponse[], string>> {
        this.store.take(1).subscribe(s => {
            if (s.session.user) {
                this.user = s.session.user.user;
            }
            this.companyUniqueName = s.session.companyUniqueName;
        });
        return this._http.get(EBANKS.GET_ALL_ACCOUNTS.replace(':companyUniqueName', this.companyUniqueName)).map((res) => {
            let data: BaseResponse<IGetAllEbankAccountResponse[], string> = res.json();
            return data;
        }).catch((e) => HandleCatch<IGetAllEbankAccountResponse[], string>(e));
    }

}
