import { Store } from '@ngrx/store';
import { AppState } from './../store/roots';
import { SessionState } from './../store/authentication/authentication.reducer';
import { Injectable } from '@angular/core';
import { createSelector } from 'reselect';

export interface IScope {
  name: string;
  permissions: Array<{ code: string }>;
}

@Injectable()
export class PermissionDataService {
  private _isUserSuperAdmin: boolean = false;
  private _scopes: IScope[] = [];
  constructor(private store: Store<AppState>) {
    this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
      let currentCompany = companies.find((company) => company.uniqueName === uniqueName);
      if (currentCompany && currentCompany.userEntityRoles && currentCompany.userEntityRoles.length) {
        this.isUserSuperAdmin = currentCompany.userEntityRoles[0].role.uniqueName === 'super_admin' ? true : false;
        this.getData = currentCompany.userEntityRoles[0].role.scopes;
      }
    })).subscribe();
  }

  get getData(): IScope[] {
    return this._scopes;
  }

  set getData(data: IScope[]) {
    this._scopes = data;
  }

  get isUserSuperAdmin(): boolean {
    return this._isUserSuperAdmin;
  }

  set isUserSuperAdmin(info: boolean) {
    this._isUserSuperAdmin = info;
  }
}
