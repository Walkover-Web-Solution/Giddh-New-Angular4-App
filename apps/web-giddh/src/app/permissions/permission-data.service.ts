import { Store, select, createSelector } from '@ngrx/store';
import { AppState } from './../store/roots';
import { Injectable } from '@angular/core';
import { CompanyResponse } from '../models/api-models/Company';

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

@Injectable()
export class PermissionDataService {
    private _scopes: IScope[] = [];
    private createdBy: CompanyData;

    constructor(private store: Store<AppState>) {
        this.store.pipe(select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies: CompanyResponse[], uniqueName) => {
            let currentCompany = companies.find((company) => company?.uniqueName === uniqueName);
            this.getCompany = currentCompany;
            this.store.pipe(select(state => state.session.companyUser)).subscribe(response => {
                if (response && response.userEntityRoles && response.userEntityRoles.length) {
                    let superAdminIndx = response.userEntityRoles.findIndex((role) => {
                        return (role.entity.entity === 'COMPANY' && role.role?.uniqueName === 'super_admin');
                    });
                    let companyEntityIndx = superAdminIndx !== -1 ? superAdminIndx : null;
                    if (!companyEntityIndx) {
                        companyEntityIndx = response.userEntityRoles.findIndex((role) => {
                            return (role.entity.entity === 'COMPANY');
                        });
                    }
                    companyEntityIndx = companyEntityIndx !== -1 ? companyEntityIndx : 0;
                    this.isUserSuperAdmin = superAdminIndx !== -1 ? true : false;
                    this.getData = response.userEntityRoles[companyEntityIndx].role?.scopes;
                }
            });
        }))).subscribe();
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
