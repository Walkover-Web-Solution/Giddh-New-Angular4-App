import { take, takeUntil } from 'rxjs/operators';
import { GeneralService } from '../../services/general.service';
import { AccountsAction } from '../../actions/accounts.actions';
import { PermissionActions } from '../../actions/permission/permission.action';
import { SettingsPermissionActions } from '../../actions/settings/permissions/settings.permissions.action';
import { select, Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppState } from '../../store';
import { ReplaySubject } from 'rxjs';
import { ShareRequestForm } from '../../models/api-models/Permission';
import { forIn, sortBy, cloneDeep, groupBy } from '../../lodash-optimized';
import { MatDialog } from '@angular/material/dialog';
import { PageLeaveUtilityService } from '../../services/page-leave-utility.service';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { NewConfirmationModalComponent } from '../../theme/new-confirmation-modal/confirmation-modal.component';
import { OrganizationType } from '../../models/user-login-state';
import { SettingsPermissionService } from '../../services/settings.permission.service';

@Component({
    selector: 'setting-permission',
    templateUrl: './setting.permission.component.html',
    styleUrls: ['./setting.permission.component.scss'],
    standalone: false
})
export class SettingPermissionComponent implements OnInit, OnDestroy {
    /** Edit User Dialog Reference */
    @ViewChild('editUserModal', { static: true }) public editUserModal: TemplateRef<any>;
    public sharedWith: object[] = [];
    public usersList: any;
    public selectedCompanyUniqueName: string;
    public selectedUser: ShareRequestForm;
    public currentUser: any;
    public isUpdtCase: boolean = false;
    private loggedInUserEmail: string;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if permission form has unsaved changes */
    public hasUnsavedChanges: boolean = false;
    /** Instance of advance search modal dialog */
    public editDialogRef: any;

    constructor(
        private settingsPermissionActions: SettingsPermissionActions,
        private permissionActions: PermissionActions,
        private accountsAction: AccountsAction,
        private store: Store<AppState>,
        public dialog: MatDialog,
        private generalService: GeneralService,
        private pageLeaveUtilityService: PageLeaveUtilityService,
        private settingsProfileActions: SettingsProfileActions,
        private settingsPermissionService: SettingsPermissionService
    ) {
        this.store.pipe(select(s => s.session.user), take(1)).subscribe(result => {
            if (result && result.user) {
                this.generalService.user = result.user;
                this.loggedInUserEmail = result.user.email;
            }
        });
    }

    public ngOnInit() {
        this.store.pipe(select(state => state.settings.usersWithCompanyPermissions), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.setUsersList(response);
            }
        });
    }

    public getInitialData() {
        this.store.dispatch(this.permissionActions.GetRoles());
        this.store.pipe(take(1)).subscribe(s => {
            this.selectedCompanyUniqueName = s.session.companyUniqueName;
            if (s.session.user) {
                this.currentUser = s.session.user.user;
            }
            this.loadUsersWithPermissions();
        });
    }

    public prepareDataForUI(data: ShareRequestForm[]) {
        return data.map((o) => {
            if (o.allowedCidrs && o.allowedCidrs.length > 0) {
                o.cidrsStr = o.allowedCidrs?.toString();
            } else {
                o.cidrsStr = null;
            }
            if (o.allowedIps && o.allowedIps.length > 0) {
                o.ipsStr = o.allowedIps?.toString();
            } else {
                o.ipsStr = null;
            }
            return o;
        });
    }

    public submitPermissionForm(e: { action: string, data: ShareRequestForm }) {
        if (e.action === 'update') {
            this.closeEditUserModal();
        }
        this.waitAndReloadCompany();
    }

    public onRevokePermission(assignRoleEntryUniqueName: string) {
        if (assignRoleEntryUniqueName) {
            const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
                panelClass: ['mat-dialog-md'],
                data: {
                    configuration: this.generalService.deleteConfiguration(this.localeData?.delete_user_permission, this.commonLocaleData)
                }
            });
            dialogRef.afterClosed().subscribe(response => {
                if (response === this.commonLocaleData?.app_yes) {
                    const permissionEntity = this.getPermissionEntity();
                    this.store.dispatch(
                        this.accountsAction.unShareEntity(
                            assignRoleEntryUniqueName,
                            permissionEntity.entity,
                            permissionEntity.entityUniqueName
                        )
                    );
                    this.waitAndReloadCompany();
                    setTimeout(() => {
                        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
                    }, 500);
                }
            });
        }
    }


    public showModalForEdit(user?: any): void {
        this.selectedUser = user ? user : '';
        this.editDialogRef = this.dialog.open(this.editUserModal, {
                    width: '1200px',
                });
    }
    public closeEditUserModal(event?: any): void {
        if (event && this.hasUnsavedChanges) {
            this.pageLeaveUtilityService.confirmPageLeave((action) => {
                if (action) {
                    this.hasUnsavedChanges = false;
                    this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
                    this.editDialogRef?.close();
                }
            });
        } else {
            this.hasUnsavedChanges = false;
            this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
            this.editDialogRef?.close();
        }
    }

    public waitAndReloadCompany() {
        setTimeout(() => {
            this.loadUsersWithPermissions();
            setTimeout(() => {
                this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
            }, 500);
        }, 2000);
    }

    public ngOnDestroy() {
        this.resetUnsavedChanges();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will return the past period,duration text
     *
     * @param {*} user
     * @returns {string}
     * @memberof SettingPermissionComponent
     */
    public getPastPeriodDuration(user: any): string {
        let pastPeriodDuration = this.localeData?.past_period_duration;
        pastPeriodDuration = pastPeriodDuration?.replace("[DURATION]", user.duration);
        pastPeriodDuration = pastPeriodDuration?.replace("[PERIOD]", user.period);
        return pastPeriodDuration;
    }

    /**
     * Resets form unsaved changes
     *
     * @private
     * @memberof SettingPermissionComponent
     */
    private resetUnsavedChanges(): void {
        this.hasUnsavedChanges = false;
        this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
        this.store.dispatch(this.settingsProfileActions.hasUnsavedChanges(false));
    }

    /**
     * Updates unsaved changes returned from inline form
     *
     * @param {*} event
     * @memberof SettingPermissionComponent
     */
    public updateUnsavedChanges(event: any): void {
        this.hasUnsavedChanges = event;
        if (event) {
            this.pageLeaveUtilityService.addBrowserConfirmationDialog();
        } else {
            this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
        }
        this.store.dispatch(this.settingsProfileActions.hasUnsavedChanges(event));
    }

    /**
     * Loads shared users for company or current branch
     *
     * @private
     * @memberof SettingPermissionComponent
     */
    private loadUsersWithPermissions(): void {
        if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
            const branchUniqueName = this.generalService.currentBranchUniqueName;
            if (!branchUniqueName) {
                this.usersList = [];
                return;
            }
            this.settingsPermissionService
                .getEntitySharedWith('branch', branchUniqueName)
                .pipe(takeUntil(this.destroyed$))
                .subscribe((response) => {
                    if (response?.status === 'success' && response.body) {
                        this.setUsersList(response.body);
                    } else {
                        this.usersList = [];
                    }
                });
            return;
        }

        this.store.dispatch(this.settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName));
    }

    /**
     * Builds UI users list from shared permission response
     *
     * @private
     * @param {ShareRequestForm[]} response
     * @memberof SettingPermissionComponent
     */
    private setUsersList(response: ShareRequestForm[]): void {
        let data = cloneDeep(response);
        let sortedArr = groupBy(this.prepareDataForUI(data), 'emailId');
        let arr = [];
        forIn(sortedArr, (value) => {
            if (value[0].emailId === this.loggedInUserEmail) {
                value[0].isLoggedInUser = true;
            }
            arr.push({ name: value[0].userName, rows: value });
        });
        this.usersList = sortBy(arr, ['name']);
    }

    /**
     * Resolves permission entity from current organization mode
     *
     * @private
     * @returns {{ entity: string; entityUniqueName: string }}
     * @memberof SettingPermissionComponent
     */
    private getPermissionEntity(): { entity: string; entityUniqueName: string } {
        if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
            return {
                entity: 'branch',
                entityUniqueName: this.generalService.currentBranchUniqueName
            };
        }
        return {
            entity: 'company',
            entityUniqueName: this.selectedCompanyUniqueName
        };
    }
}
