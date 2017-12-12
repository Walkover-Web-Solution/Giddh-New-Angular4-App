import { Store } from '@ngrx/store';
import { AppState } from './../store/roots';
import { SessionState } from './../store/authentication/authentication.reducer';
import { Injectable } from '@angular/core';

export interface IScope {
  name: string;
  permissions: Array<{ code: string }>;
}

@Injectable()
export class PermissionDataService {

  private _scopes: IScope[] = [];
  constructor(private store: Store<AppState>) {
      console.log('PermissionDataService constructor');
      this.store.select(c => c.session).take(1).subscribe((s: SessionState) => {
        let session = _.cloneDeep(s);
        let currentCompanyUniqueName = session.companyUniqueName;
        let currentCompany = session.companies.find((company) => company.uniqueName === currentCompanyUniqueName);
        if (currentCompany) {
          this.getData = currentCompany.userEntityRoles[0].role.scopes;
        }
    });
  }

  get getData(): IScope[] {
    return this._scopes;
  }

  set getData(data: IScope[]) {
    this._scopes = data;
  }
}
