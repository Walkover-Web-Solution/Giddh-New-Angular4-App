// import { Injectable } from '@angular/core';
// import { HttpWrapperService } from './httpWrapper.service';
// import { Store } from '@ngrx/store';
// import { AppState } from '../store/roots';
// import { Observable } from 'rxjs/Observable';
// import { BaseResponse } from '../models/api-models/BaseResponse';
// import { BankAccountsResponse } from '../models/api-models/Dashboard';
// import { SETTINGS_LINKED_ACCOUNTS_API } from './apiurls/settings.linked-accounts.api';
// import { GiddhErrorHandler } from './catchManager/catchmanger';
// import { UserDetails } from '../models/api-models/loginModels';

// @Injectable()
// export class SettingsLinkedAccountsService {
//   private user: UserDetails;
//   private companyUniqueName: string;
//   private roleUniqueName: string;
//   constructor(private errorHandler: GiddhErrorHandler,private _http: HttpWrapperService, private store: Store<AppState>) { }

//   public GetBankAccounts(): Observable<BaseResponse<BankAccountsResponse[], string>> {
//     this.store.take(1).subscribe(s => {
//       if (s.session.user) {
//         this.user = s.session.user.user;
//       }
//       this.companyUniqueName = s.session.companyUniqueName;
//     });
//     return this._http.get(SETTINGS_LINKED_ACCOUNTS_API.BANK_ACCOUNTS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
//       let data: BaseResponse<BankAccountsResponse[], string> = res;
//       data.request = '';
//       return data;
//     }).catch((e) => this.errorHandler.HandleCatch<BankAccountsResponse[], string>(e, '', ));
//   }

//   /*
//   * Delete Account
//   */
//   public DeleteBankAccounts(token: string): Observable<BaseResponse<string, string>> {
//     this.store.take(1).subscribe(s => {
//       if (s.session.user) {
//         this.user = s.session.user.user;
//       }
//       this.companyUniqueName = s.session.companyUniqueName;
//     });
//     return this._http.delete(SETTINGS_LINKED_ACCOUNTS_API.REMOVE_ACCOUNT
//       .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
//       .replace(':loginId', token)
//     ).map((res) => {
//       let data: BaseResponse<string, string> = res;
//       data.request = token;
//       return data;
//     }).catch((e) => this.errorHandler.HandleCatch<string, string>(e));
//   }
// }
