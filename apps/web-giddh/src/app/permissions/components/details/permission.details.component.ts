import { takeUntil } from 'rxjs/operators';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable, ReplaySubject } from 'rxjs';
import { PermissionActions } from '../../../actions/permission/permission.action';
import { IRoleCommonResponseAndRequest, Permission, Scope } from '../../../models/api-models/Permission';
import { IPage, NewPermissionObj, NewRoleClass } from '../../permission.utility';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { cloneDeep, concat, filter, find, findIndex, forEach, indexOf, isEmpty, map, remove } from '../../../lodash-optimized';

/**
 * Handles Component functionality
 */
@Component({
    standalone: false,
    templateUrl: './permission.details.html',
    styleUrls: [`./permission.details.scss`]
})

/**
 * PermissionDetailsComponent component
 * Handles permissiondetails functionality and user interactions
 */
export class PermissionDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
    public pageList: any[];
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
    /** Holds original page list */
    private originalPageList: any[];

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private router: Router,
        private store: Store<AppState>,
        private _location: Location,
        private permissionActions: PermissionActions,
        private _toaster: ToasterService
    ) {
        this.addUpdateRoleInProcess$ = this.store.pipe(select(p => p.permission.addUpdateRoleInProcess), takeUntil(this.destroyed$));
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles ngOnInit functionality
     */
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
            /**
             * Handles if functionality
             */
            if (this.rawDataForAllRoles) {
                this.allRolesOfPage = this.getAllRolesOfPageReady(cloneDeep(this.rawDataForAllRoles));
            }
            this.newRole = permission.newRole;
            this.originalPageList = permission.pages;
        });

        // listener for add update role case
        this.addUpdateRoleInProcess$.subscribe((result: boolean) => {
            /**
             * Handles if functionality
             */
            if (result) {
                // un comment below code to redirect
                this.router.navigate(['/pages/permissions/list']);
            }
        });

        /**
         * Handles if functionality
         */
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
        this.checkExistsDataInPageResponse();

        /**
         * Handles if functionality
         */
        if (this.roleObj?.scopes) {
            this.roleObj.scopes = this.roleObj?.scopes.map(item => {
                item.permissions.unshift({ code: 'SELECT-ALL', isSelected: false });
                return item;
            });
        }

    }

    /**
     * Handles sharesituation event
     */
    public handleShareSituation(roleObj: NewRoleClass) {
        let shareScopes = ['SHRALL', 'SHRLWR', 'SHRSM'];
        (Array.isArray(roleObj?.scopes) ? roleObj?.scopes : []).forEach((role) => {
            /**
             * Handles if functionality
             */
            if (role.name === 'SHARE') {
                role.permissions = role.permissions?.filter((p) => {
                    return shareScopes?.indexOf(p.code) > -1;
                });
                /**
                 * Handles if functionality
                 */
                if (role.permissions?.length < 3) {
                    (Array.isArray(shareScopes) ? shareScopes : []).forEach((s: string) => {
                        let indexOfAbsentScope = role.permissions.findIndex((p) => p.code === s);
                        /**
                         * Handles if functionality
                         */
                        if (indexOfAbsentScope === -1) {
                            role.permissions.push(new NewPermissionObj(s, false));
                        }
                    });
                }
            }
        });
        return roleObj;
    }

    /**
     * Handles addNewPage functionality
     */
    public addNewPage(page: string) {
        /**
         * Handles if functionality
         */
        if (page && !this.checkForAlreadyExistInPageArray(page)) {
            let pageObj = find(this.singlePageForFreshStart?.scopes, (o: Scope) => o.name === page);
            pageObj.permissions = pageObj.permissions.map((o: Permission) => {
                return o = new NewPermissionObj(o.code, false);
            });
            pageObj.permissions.unshift({ code: 'SELECT-ALL', isSelected: false });
            this.roleObj?.scopes?.push(pageObj);
            this.checkExistsDataInPageResponse();
            this.pageName = null;
        }
    }

    /**
     * Deletes pagefromscope
     */
    public removePageFromScope(page: string) {
        this.roleObj.scopes.splice(this.roleObj.scopes?.findIndex((o: Scope) => o.name === page), 1);
        this.checkExistsDataInPageResponse();
    }

    /**
     * Handles checkForAlreadyExistInPageArray functionality
     */
    public checkForAlreadyExistInPageArray(page: string): boolean {
        let idx = findIndex(this.roleObj?.scopes, (o: Scope) => {
            return o.name === page;
        });
        /**
         * Handles if functionality
         */
        if (idx !== -1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Handles goToRoles functionality
     */
    public goToRoles() {
        this._location.back();
    }

    /**
     * Retrieves scopedatareadyforapi data
     */
    public getScopeDataReadyForAPI(data): Scope[] {
        let arr: Scope[];
        arr = forEach(data?.scopes, (page: Scope) => {
            /**
             * Deletes 
             */
            remove(page.permissions, (permission: Permission) => !permission.isSelected || permission.code === 'SELECT-ALL');
        });
        return filter(arr, (scope: Scope) => scope.permissions?.length > 0);
    }

    /**
     * Handles addNewRole functionality
     */
    public addNewRole(): any {
        let data = cloneDeep(this.roleObj);
        data.scopes = this.getScopeDataReadyForAPI(data);

        /**
         * Handles if functionality
         */
        if (data.scopes?.length < 1) {
            return this._toaster.errorToast(this.localeData?.add_role_error);
        }
        this.store.dispatch(this.permissionActions.CreateRole(data));
    }

    /**
     * Updates existing role
     */
    public updateRole() {
        let data = cloneDeep(this.roleObj);
        data.scopes = this.getScopeDataReadyForAPI(data);
        this.store.dispatch(this.permissionActions.UpdateRole(data));
    }

    /**
     * Retrieves allrolesofpageready data
     */
    public getAllRolesOfPageReady(arr) {
        return arr?.map((o: Permission) => {
            return o = new NewPermissionObj(o.code, false);
        });
    }

    /**
     * Sets scopeforcurrentrole value
     */
    public setScopeForCurrentRole(): Scope[] {
        let response;
        /**
         * Handles if functionality
         */
        if (this.newRole.isFresh) {
            // fresh role logic here
            response = this.generateFreshUI();

        } else {
            // copy role scenario
            response = this.generateUIFromExistedRole();
        }

        /**
         * Handles if functionality
         */
        if (response) {
            (Array.isArray(response) ? response : []).forEach(item => {
                let count = 0;
                item?.permissions?.forEach(item => {
                    /**
                     * Handles if functionality
                     */
                    if (item.code !== 'SELECT-ALL' && item.isSelected) {
                        count++;
                    }
                });
                /**
                 * Handles if functionality
                 */
                if ((item.permissions.length - 1) === count) {
                    item.permissions[0].isSelected = true;
                }
            });
            return response;
        }
    }

    /**
     * Handles generateUIFromExistedRole functionality
     */
    public generateUIFromExistedRole() {
        let pRole: string = this.newRole?.uniqueName;
        let res = find(this.allRoles, function (o: IRoleCommonResponseAndRequest) {
            return o?.uniqueName === pRole;
        });
        /**
         * Handles if functionality
         */
        if (res) {
            /**
             * Handles forEach functionality
             */
            forEach(res.scopes, (obj: Scope) => {
                obj.permissions = obj.permissions.map((o: Permission) => {
                    return o = new NewPermissionObj(o.code, true);
                });
                /**
                 * Handles if functionality
                 */
                if (obj.permissions?.length < 6 && obj.name !== 'SHARE') {
                    obj.permissions = this.pushNonExistRoles(obj.permissions, this.getAllRolesOfPageReady(cloneDeep(this.rawDataForAllRoles)));
                }
                let count = 0;
                /**
                 * Handles forEach functionality
                 */
                forEach(obj.permissions, (o: Permission) => {
                    /**
                     * Handles if functionality
                     */
                    if (o.isSelected) {
                        count += 1;
                    }
                });
                /**
                 * Handles if functionality
                 */
                if (count === obj.permissions?.length) {
                    obj.permissions[0].isSelected = true;
                }
            });
            return res.scopes;
        }
    }

    /**
     * Handles pushNonExistRoles functionality
     */
    public pushNonExistRoles(arr1, arr2) {
        /**
         * Handles forEach functionality
         */
        forEach(arr1, (o: Permission) => {
            /**
             * Deletes 
             */
            remove(arr2, (item: Permission) => {
                return item.code === o.code;
            });
        });
        return concat(arr1, arr2);
    }

    /**
     * Handles generateFreshUI functionality
     */
    public generateFreshUI() {
        let arr = [];
        let allRoles = cloneDeep(this.singlePageForFreshStart?.scopes);
        /**
         * Handles forEach functionality
         */
        forEach(this.newRole.pageList, (item: IPage) => {
            /**
             * Handles if functionality
             */
            if (item.isSelected) {
                let res = find(allRoles, (o: Scope) => o.name === item.name);
                /**
                 * Handles if functionality
                 */
                if (res) {
                    res.permissions = map(res.permissions, (o: Permission) => new NewPermissionObj(o.code, false));
                    arr.push(res);
                }
            }
        });
        return arr;
    }

    /**
     * Handles checkForIsFixed functionality
     */
    public checkForIsFixed(): boolean {
        return !this.newRole.isFresh;
    }

    /**
     * Handles checkForRoleUniqueName functionality
     */
    public checkForRoleUniqueName(): string {
        /**
         * Handles if functionality
         */
        if (this.newRole.isFresh) {
            return null;
        } else {
            return this.newRole?.uniqueName;
        }
    }

    /**
     * Retrieves namebycode data
     */
    public getNameByCode(code: string) {
        /**
         * Handles switch functionality
         */
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

    /**
     * Handles isHavePermission functionality
     */
    public isHavePermission(pageName: string, item: Permission, type: string): boolean {
        let page;
        /**
         * Handles if functionality
         */
        if (pageName === 'SHARE') {
            return false;
        }
        /**
         * Handles if functionality
         */
        if (type === 'admin') {
            page = find(this.adminPageObj?.scopes, (o: Scope) => o.name === pageName);
        } else {
            page = find(this.viewPageObj?.scopes, (o: Scope) => o.name === pageName);
        }
        /**
         * Handles if functionality
         */
        if (page) {
            let access = find(page.permissions, (p: Permission) => p.code === item.code);
            // && access.isSelected
            /**
             * Handles if functionality
             */
            if (access) {
                return true;
            }
            return false;
        } else {
            return false;
        }
    }

    /**
     * Toggles items state
     */
    public toggleItems(pageName: string, event: any) {

        let res = find(this.roleObj?.scopes, (o: Scope) => o.name === pageName);
        /**
         * Handles if functionality
         */
        if (res) {
            /**
             * Handles map functionality
             */
            map(res.permissions, (permission: Permission) => permission.isSelected = event.checked ? true : false);
        }
    }

    /**
     * Toggles item state
     */
    public toggleItem(pageName: string, item: Permission, event: any) {
        let res = find(this.roleObj?.scopes, (o: Scope) => o.name === pageName);
        /**
         * Handles if functionality
         */
        if (event.checked) {
            let idx = findIndex(res.permissions, (permission: Permission) => {
                return permission.isSelected === false && permission.code !== 'SELECT-ALL';
            });

            /**
             * Handles if functionality
             */
            if (idx !== -1) {
                return res.permissions[0].isSelected = false;
            } else {
                return res.permissions[0].isSelected = true;
            }
        } else {
            return res.permissions[0].isSelected = false;
        }
    }

    /**
     * Checks if the page list already contains the current page. If not, adds it to the page list.//+
     *
     * @memberof PermissionDetailsComponent
     */
    public checkExistsDataInPageResponse(): void {
        this.pageList = [];
        this.originalPageList?.forEach(item => {
            /**
             * Handles if functionality
             */
            if (!this.checkForAlreadyExistInPageArray(String(item))) {
                this.pageList.push({ label: item, value: item, additional: { isDisabled: false } });
            }
        });
    }

}
