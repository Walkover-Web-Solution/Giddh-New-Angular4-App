import { Store } from '@ngrx/store';
import { AppState } from './../store/roots';
import { SessionState } from './../store/authentication/authentication.reducer';
import { Injectable } from '@angular/core';

@Injectable()
export class PermissionDataService {

  private _scopes: string[] = [];
  constructor(private store: Store<AppState>) {
      console.log('PermissionDataService constructor');
      this.store.select(c => c.session).take(1).subscribe((s: SessionState) => {
        let session = _.cloneDeep(s);
        let currentCompanyUniqueName = session.companyUniqueName;
        let currentCompany = session.companies.find((company) => company.uniqueName === currentCompanyUniqueName);
        if (currentCompany) {
          let scopes = [];
          currentCompany.userEntityRoles[0].role.scopes.forEach((permission) => {
            scopes.push(permission.name);
          });
          this.getData = scopes;
        }
    });
  }

  get getData(): string[] {
    return this._scopes;
  }

  set getData(data: string[]) {
    this._scopes = data;
  }
}
