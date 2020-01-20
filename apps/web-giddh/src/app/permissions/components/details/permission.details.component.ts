import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable, ReplaySubject } from 'rxjs';
import { PermissionActions } from '../../../actions/permission/permission.action';
import { IRoleCommonResponseAndRequest, Permission, Scope } from '../../../models/api-models/Permission';
import * as _ from '../../../lodash-optimized';
import { IPage, IPageStr, NewPermissionObj, NewRoleClass } from '../../permission.utility';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';

@Component({
    templateUrl: './permission.details.html'
})

export class PermissionDetailsComponent implements OnInit, OnDestroy {
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

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private store: Store<AppState>,
        private _location: Location,
        private permissionActions: PermissionActions,
        private _toaster: ToasterService
    ) {

        this.store.select(p => p.permission).pipe(takeUntil(this.destroyed$)).subscribe((permission) => {
            this.allRoles = _.cloneDeep(permission.roles);
            this.singlePageForFreshStart = _.find(this.allRoles, function (o: IRoleCommonResponseAndRequest) {
                return o.uniqueName === 'super_admin';
            });
            this.adminPageObj = _.find(this.allRoles, function (o: IRoleCommonResponseAndRequest) {
                return o.uniqueName === 'admin';
            });
            this.viewPageObj = _.find(this.allRoles, function (o: IRoleCommonResponseAndRequest) {
                return o.uniqueName === 'view';
            });
            this.rawDataForAllRoles = _.cloneDeep(this.singlePageForFreshStart.scopes[0].permissions);
            this.allRolesOfPage = this.getAllRolesOfPageReady(_.cloneDeep(this.rawDataForAllRoles));
            this.newRole = permission.newRole;
            this.pageList = permission.pages;
        });
        this.addUpdateRoleInProcess$ = this.store.select(p => p.permission.addUpdateRoleInProcess).pipe(takeUntil(this.destroyed$));
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public ngOnInit() {

        // listener for add update role case
        this.addUpdateRoleInProcess$.subscribe((result: boolean) => {
            if (result) {
                // un comment below code to redirect
                this.router.navigate(['/pages/permissions/list']);
            }
        });

        if (_.isEmpty(this.newRole)) {
            this.router.navigate(['/pages/permissions/list']);
        } else if (this.newRole.isUpdateCase) {
            const roleObj = new NewRoleClass(this.newRole.name, this.setScopeForCurrentRole(), false, this.newRole.uniqueName, this.newRole.isUpdateCase);
            this.roleObj = this.handleShareSituation(roleObj);
        } else {
            this.roleObj = new NewRoleClass(this.newRole.name, this.setScopeForCurrentRole(), this.newRole.isFresh, this.checkForRoleUniqueName());
        }
    }

    public handleShareSituation(roleObj: NewRoleClass) {
        let shareScopes = ['SHRALL', 'SHRLWR', 'SHRSM'];
        roleObj.scopes.forEach((role) => {
            if (role.name === 'SHARE') {
                role.permissions = role.permissions.filter((p) => {
                    return shareScopes.indexOf(p.code) > -1;
                });
                if (role.permissions.length < 3) {
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
            let pageObj = _.find(this.singlePageForFreshStart.scopes, (o: Scope) => o.name === page);
            pageObj.permissions = pageObj.permissions.map((o: Permission) => {
                return o = new NewPermissionObj(o.code, false);
            });
            this.roleObj.scopes.push(pageObj);
        }
    }

    public removePageFromScope(page: string) {
        this.roleObj.scopes.splice(this.roleObj.scopes.findIndex((o: Scope) => o.name === page), 1);
    }

    public checkForAlreadyExistInPageArray(page: string): boolean {
        let idx = _.findIndex(this.roleObj.scopes, (o: Scope) => {
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
        arr = _.forEach(data.scopes, (page: Scope) => {
            _.remove(page.permissions, (o: Permission) => !o.isSelected);
        });
        return _.filter(arr, (o: Scope) => o.permissions.length > 0);
    }

    public addNewRole(): any {
        let data = _.cloneDeep(this.roleObj);
        data.scopes = this.getScopeDataReadyForAPI(data);
        if (data.scopes.length < 1) {
            return this._toaster.errorToast('At least 1 scope should selected.');
        }
        this.store.dispatch(this.permissionActions.CreateRole(data));
    }

    public updateRole() {
        let data = _.cloneDeep(this.roleObj);
        data.scopes = this.getScopeDataReadyForAPI(data);
        this.store.dispatch(this.permissionActions.UpdateRole(data));
    }

    public getAllRolesOfPageReady(arr) {
        return arr.map((o: Permission) => {
            return o = new NewPermissionObj(o.code, false);
        });
    }

    public setScopeForCurrentRole(): Scope[] {
        if (this.newRole.isFresh) {
            // fresh role logic here
            return this.generateFreshUI();
        } else {
            // copy role scenario
            return this.generateUIFromExistedRole();
        }
    }

    public generateUIFromExistedRole() {
        let pRole: string = this.newRole.uniqueName;
        let res = _.find(this.allRoles, function (o: IRoleCommonResponseAndRequest) {
            return o.uniqueName === pRole;
        });
        if (res) {
            _.forEach(res.scopes, (obj: Scope) => {
                obj.permissions = obj.permissions.map((o: Permission) => {
                    return o = new NewPermissionObj(o.code, true);
                });
                if (obj.permissions.length < 6 && obj.name !== 'SHARE') {
                    obj.permissions = this.pushNonExistRoles(obj.permissions, this.getAllRolesOfPageReady(_.cloneDeep(this.rawDataForAllRoles)));
                }
                let count = 0;
                _.forEach(obj.permissions, (o: Permission) => {
                    if (o.isSelected) {
                        count += 1;
                    }
                });
                if (count === obj.permissions.length) {
                    obj.selectAll = true;
                }
            });
            return res.scopes;
        }
    }

    public pushNonExistRoles(arr1, arr2) {
        _.forEach(arr1, (o: Permission) => {
            _.remove(arr2, (item: Permission) => {
                return item.code === o.code;
            });
        });
        return _.concat(arr1, arr2);
    }

    public generateFreshUI() {
        let arr = [];
        let allRoles = _.cloneDeep(this.singlePageForFreshStart.scopes);
        _.forEach(this.newRole.pageList, (item: IPage) => {
            if (item.isSelected) {
                let res = _.find(allRoles, (o: Scope) => o.name === item.name);
                if (res) {
                    res.permissions = _.map(res.permissions, (o: Permission) => new NewPermissionObj(o.code, false));
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
            return this.newRole.uniqueName;
        }
    }

    public getNameByCode(code: string) {
        switch (code) {
            case 'VW':
                return 'view';
            case 'UPDT':
                return 'edit';
            case 'DLT':
                return 'delete';
            case 'ADD':
                return 'create';
            case 'SHR':
                return 'share';
            case 'VWDLT':
                return 'view delete';
            case 'SHRLWR':
                return 'Share Lower';
            case 'SHRALL':
                return 'Share All';
            case 'SHRSM':
                return 'Share Same';
            case 'CMT':
                return 'Comment';
            case 'GSTVW':
                return 'GST View';
            case 'GSTFL':
                return 'GST Filing';
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
            page = _.find(this.adminPageObj.scopes, (o: Scope) => o.name === pageName);
        } else {
            page = _.find(this.viewPageObj.scopes, (o: Scope) => o.name === pageName);
        }
        if (page) {
            let access = _.find(page.permissions, (p: Permission) => p.code === item.code);
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
        let res = _.find(this.roleObj.scopes, (o: Scope) => o.name === pageName);
        if (res) {
            _.map(res.permissions, (o: Permission) => o.isSelected = event.target.checked ? true : false);
        }
    }

    public toggleItem(pageName: string, item: Permission, event: any) {
        let res = _.find(this.roleObj.scopes, (o: Scope) => o.name === pageName);
        if (event.target.checked) {
            let idx = _.findIndex(res.permissions, (o: Permission) => o.isSelected === false);
            if (idx !== -1) {
                return res.selectAll = false;
            } else {
                return res.selectAll = true;
            }
        } else {
            return res.selectAll = false;
        }
    }

}
