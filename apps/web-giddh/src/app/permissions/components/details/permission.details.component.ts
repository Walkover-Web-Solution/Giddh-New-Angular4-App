import { takeUntil } from 'rxjs/operators';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable, ReplaySubject } from 'rxjs';
import { PermissionActions } from '../../../actions/permission/permission.action';
import { IRoleCommonResponseAndRequest, Permission, Scope } from '../../../models/api-models/Permission';
import { IPage, IPageStr, NewPermissionObj, NewRoleClass } from '../../permission.utility';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { cloneDeep, concat, filter, find, findIndex, forEach, isEmpty, map, remove } from '../../../lodash-optimized';

@Component({
    templateUrl: './permission.details.html',
    styleUrls: [`./permission.details.scss`]
})

export class PermissionDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
    public pageList: IPageStr[];
    public newRole: any = {};
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public allRoles: any;
    public adminPageObj: IRoleCommonResponseAndRequest;
    public viewPageObj: IRoleCommonResponseAndRequest;
    public singlePageForFreshStart: any;
    public rawDataForAllRoles: Permission[];
    public allRolesOfPage: Permission[];
    public roleObj: NewRoleClass;
    public pageName: string = '';
    public addUpdateRoleInProcess$: Observable<boolean>;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /* Holds Table column */
    public displayedColumns: string[] = ['admin', 'adminicon', 'view'];

    constructor(private router: Router,
        private store: Store<AppState>,
        private _location: Location,
        private permissionActions: PermissionActions,
        private _toaster: ToasterService
    ) {
        this.addUpdateRoleInProcess$ = this.store.pipe(select(p => p.permission.addUpdateRoleInProcess), takeUntil(this.destroyed$));
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public ngOnInit() {
        this.store.pipe(select(p => p.permission), takeUntil(this.destroyed$)).subscribe((permission) => {
            this.allRoles = cloneDeep(permission.roles);
            this.singlePageForFreshStart = find(this.allRoles, function (o: IRoleCommonResponseAndRequest) {
                return o?.uniqueName === 'super_admin';
            });
            this.adminPageObj = find(this.allRoles, function (o: IRoleCommonResponseAndRequest) {
                return o?.uniqueName === 'admin';
            });
            this.viewPageObj = find(this.allRoles, function (o: IRoleCommonResponseAndRequest) {
                return o?.uniqueName === 'view';
            });
            this.rawDataForAllRoles = cloneDeep(this.singlePageForFreshStart?.scopes[0]?.permissions);
            if (this.rawDataForAllRoles) {
                this.allRolesOfPage = this.getAllRolesOfPageReady(cloneDeep(this.rawDataForAllRoles));
            }
            this.newRole = permission.newRole;
            this.pageList = permission.pages;
        });

        // listener for add update role case
        this.addUpdateRoleInProcess$.subscribe((result: boolean) => {
            if (result) {
                // un comment below code to redirect
                this.router.navigate(['/pages/permissions/list']);
            }
        });

        if (isEmpty(this.newRole)) {
            this.router.navigate(['/pages/permissions/list']);
        } else if (this.newRole.isUpdateCase) {
            const roleObj = new NewRoleClass(this.newRole?.name, this.setScopeForCurrentRole(), false, this.newRole?.uniqueName, this.newRole?.isUpdateCase);
            this.roleObj = this.handleShareSituation(roleObj);
        } else {
            this.roleObj = new NewRoleClass(this.newRole.name, this.setScopeForCurrentRole(), this.newRole.isFresh, this.checkForRoleUniqueName());
        }
    }

    /**
    * This hook will be use for component after initialization
    *
    * @memberof PermissionDetailsComponent
    */
    public ngAfterViewInit(): void {
        this.pageList = this.pageList.map(item => {
            return { label: item, value: item, additional: { isDisabled: this.checkForAlreadyExistInPageArray(String(item)) } }
        });

        if (this.roleObj?.scopes) {
            this.roleObj.scopes = this.roleObj?.scopes.map(item => {
                item.permissions.unshift({ code: 'SELECT-ALL', isSelected: false });
                return item;
            });
        }

    }

    public handleShareSituation(roleObj: NewRoleClass) {
        let shareScopes = ['SHRALL', 'SHRLWR', 'SHRSM'];
        roleObj?.scopes.forEach((role) => {
            if (role.name === 'SHARE') {
                role.permissions = role.permissions?.filter((p) => {
                    return shareScopes?.indexOf(p.code) > -1;
                });
                if (role.permissions?.length < 3) {
                    shareScopes.forEach((s: string) => {
                        let indexOfAbsentScope = role.permissions.findIndex((p) => p.code === s);
                        if (indexOfAbsentScope === -1) {
                            role.permissions.push(new NewPermissionObj(s, false));
                        }
                    });
                }
            }
        });
        return roleObj;
    }

    public addNewPage(page: string) {
        if (page && !this.checkForAlreadyExistInPageArray(page)) {
            let pageObj = find(this.singlePageForFreshStart?.scopes, (o: Scope) => o.name === page);
            pageObj.permissions = pageObj.permissions.map((o: Permission) => {
                return o = new NewPermissionObj(o.code, false);
            });
            pageObj.permissions.unshift({ code: 'SELECT-ALL', isSelected: false });
            this.roleObj?.scopes?.push(pageObj);
        }
    }

    public removePageFromScope(page: string) {
        this.roleObj.scopes.splice(this.roleObj.scopes?.findIndex((o: Scope) => o.name === page), 1);
    }

    public checkForAlreadyExistInPageArray(page: string): boolean {
        let idx = findIndex(this.roleObj?.scopes, (o: Scope) => {
            return o.name === page;
        });
        if (idx !== -1) {
            return true;
        } else {
            return false;
        }
    }

    public goToRoles() {
        this._location.back();
    }

    public getScopeDataReadyForAPI(data): Scope[] {
        let arr: Scope[];
        arr = forEach(data?.scopes, (page: Scope) => {
            remove(page.permissions, (o: Permission) => !o.isSelected || o.code === 'SELECT-ALL');
        });
        return filter(arr, (o: Scope) => o.permissions?.length > 0);
    }

    public addNewRole(): any {
        let data = cloneDeep(this.roleObj);
        data.scopes = this.getScopeDataReadyForAPI(data);

        if (data.scopes?.length < 1) {
            return this._toaster.errorToast(this.localeData?.add_role_error);
        }
        this.store.dispatch(this.permissionActions.CreateRole(data));
    }

    public updateRole() {
        let data = cloneDeep(this.roleObj);
        data.scopes = this.getScopeDataReadyForAPI(data);
        this.store.dispatch(this.permissionActions.UpdateRole(data));
    }

    public getAllRolesOfPageReady(arr) {
        return arr?.map((o: Permission) => {
            return o = new NewPermissionObj(o.code, false);
        });
    }

    public setScopeForCurrentRole(): Scope[] {
        let response;
        if (this.newRole.isFresh) {
            // fresh role logic here
            response = this.generateFreshUI();

        } else {
            // copy role scenario
            response = this.generateUIFromExistedRole();;
        }

        if (response) {
            response.forEach(item => {
                let count = 0;
                item.permissions.forEach(item => {
                    if (item.code !== 'SELECT-ALL' && item.isSelected) {
                        count++;
                    }
                });
                if ((item.permissions.length - 1) === count) {
                    item.permissions[0].isSelected = true;
                }
            });
            return response;
        }
    }

    public generateUIFromExistedRole() {
        let pRole: string = this.newRole?.uniqueName;
        let res = find(this.allRoles, function (o: IRoleCommonResponseAndRequest) {
            return o?.uniqueName === pRole;
        });
        if (res) {
            forEach(res.scopes, (obj: Scope) => {
                obj.permissions = obj.permissions.map((o: Permission) => {
                    return o = new NewPermissionObj(o.code, true);
                });
                if (obj.permissions?.length < 6 && obj.name !== 'SHARE') {
                    obj.permissions = this.pushNonExistRoles(obj.permissions, this.getAllRolesOfPageReady(cloneDeep(this.rawDataForAllRoles)));
                }
                let count = 0;
                forEach(obj.permissions, (o: Permission) => {
                    if (o.isSelected) {
                        count += 1;
                    }
                });
                if (count === obj.permissions?.length) {
                    obj.permissions[0].isSelected = true;
                }
            });
            return res.scopes;
        }
    }

    public pushNonExistRoles(arr1, arr2) {
        forEach(arr1, (o: Permission) => {
            remove(arr2, (item: Permission) => {
                return item.code === o.code;
            });
        });
        return concat(arr1, arr2);
    }

    public generateFreshUI() {
        let arr = [];
        let allRoles = cloneDeep(this.singlePageForFreshStart?.scopes);
        forEach(this.newRole.pageList, (item: IPage) => {
            if (item.isSelected) {
                let res = find(allRoles, (o: Scope) => o.name === item.name);
                if (res) {
                    res.permissions = map(res.permissions, (o: Permission) => new NewPermissionObj(o.code, false));
                    arr.push(res);
                }
            }
        });
        return arr;
    }

    public checkForIsFixed(): boolean {
        return !this.newRole.isFresh;
    }

    public checkForRoleUniqueName(): string {
        if (this.newRole.isFresh) {
            return null;
        } else {
            return this.newRole?.uniqueName;
        }
    }

    public getNameByCode(code: string) {
        switch (code) {
            case 'VW':
                return this.localeData?.name_codes.view;
            case 'UPDT':
                return this.localeData?.name_codes.edit;
            case 'DLT':
                return this.localeData?.name_codes.delete;
            case 'ADD':
                return this.localeData?.name_codes.create;
            case 'SHR':
                return this.localeData?.name_codes.share;
            case 'VWDLT':
                return this.localeData?.name_codes.view_delete;
            case 'SHRLWR':
                return this.localeData?.name_codes.share_lower;
            case 'SHRALL':
                return this.localeData?.name_codes.share_all;
            case 'SHRSM':
                return this.localeData?.name_codes.share_same;
            case 'CMT':
                return this.localeData?.name_codes.comment;
            case 'GSTVW':
                return this.localeData?.name_codes.gst_view;
            case 'GSTFL':
                return this.localeData?.name_codes.gst_filing;
            default:
                return '';
        }
    }

    public isHavePermission(pageName: string, item: Permission, type: string): boolean {
        let page;
        if (pageName === 'SHARE') {
            return false;
        }
        if (type === 'admin') {
            page = find(this.adminPageObj?.scopes, (o: Scope) => o.name === pageName);
        } else {
            page = find(this.viewPageObj?.scopes, (o: Scope) => o.name === pageName);
        }
        if (page) {
            let access = find(page.permissions, (p: Permission) => p.code === item.code);
            // && access.isSelected
            if (access) {
                return true;
            }
            return false;
        } else {
            return false;
        }
    }

    public toggleItems(pageName: string, event: any) {

        let res = find(this.roleObj?.scopes, (o: Scope) => o.name === pageName);
        if (res) {
            map(res.permissions, (o: Permission) => o.isSelected = event.checked ? true : false);
        }
    }

    public toggleItem(pageName: string, item: Permission, event: any) {
        let res = find(this.roleObj?.scopes, (o: Scope) => o.name === pageName);
        if (event.checked) {
            let idx = findIndex(res.permissions, (o: Permission) => {
                return o.isSelected === false && o.code !== 'SELECT-ALL';
            });

            if (idx !== -1) {
                return res.permissions[0].isSelected = false;
            } else {
                return res.permissions[0].isSelected = true;
            }
        } else {
            return res.permissions[0].isSelected = false;
        }
    }

}
