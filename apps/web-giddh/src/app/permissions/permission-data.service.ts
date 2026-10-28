import { Store, select, createSelector } from '@ngrx/store';
import { AppState } from './../store/roots';
import { Injectable } from '@angular/core';

export interface IScope {
    name: string;
    permissions: Array<{ code: string }>;
}
/**
 * This will store the company createdBy Object Information
 *
 * @export
 * @interface CompanyData
 */
export interface CompanyData {
    createdBy: any;
}

@Injectable({
    providedIn: 'root'
})
export class PermissionDataService {
    private _scopes: IScope[] = [];
    private createdBy: CompanyData;

    constructor(private store: Store<AppState>) {
        this.store.pipe(select(createSelector(
            (state: AppState) => state.session.companies,
            (state: AppState) => state.session.companyUniqueName,
            (state: AppState) => state.session.companyUser,
            (companies, uniqueName, companyUser) => ({
                company: companies.find(company => company?.uniqueName === uniqueName),
                companyUser
            })
        ))).subscribe(({ company, companyUser }) => {
            this.getCompany = company;
            if (companyUser && companyUser.userEntityRoles && companyUser.userEntityRoles.length) {
                const superAdminIndex = companyUser.userEntityRoles.findIndex(role =>
                    role.entity.entity === 'COMPANY' && role.role?.uniqueName === 'super_admin'
                );
                const companyRoleIndex = superAdminIndex !== -1 ? superAdminIndex :
                    companyUser.userEntityRoles.findIndex(role => role.entity.entity === 'COMPANY');
                const selectedRoleIndex = companyRoleIndex !== -1 ? companyRoleIndex : 0;
                this.isUserSuperAdmin = superAdminIndex !== -1;
                this.getData = companyUser.userEntityRoles[selectedRoleIndex].role?.scopes;
            }
        });
    }

    private _isUserSuperAdmin: boolean = false;

    get isUserSuperAdmin(): boolean {
        return this._isUserSuperAdmin;
    }

    set isUserSuperAdmin(info: boolean) {
        this._isUserSuperAdmin = info;
    }

    get getData(): IScope[] {
        return this._scopes;
    }

    set getData(data: IScope[]) {
        this._scopes = data;
    }

    /**
     * Used to get company createdBy Information
     *
     * @type {CompanyData}
     * @memberof PermissionDataService
     */
    get getCompany(): CompanyData {
        return this.createdBy;
    }

    /**
     * Used to set company createdBy Information
     *
     * @memberof PermissionDataService
     */
    set getCompany(data: CompanyData) {
        this.createdBy = data;
    }
}
