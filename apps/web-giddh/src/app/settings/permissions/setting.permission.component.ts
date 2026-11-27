import { take, takeUntil } from 'rxjs/operators';
import { GeneralService } from '../../services/general.service';
import { AccountsAction } from '../../actions/accounts.actions';
import { PermissionActions } from '../../actions/permission/permission.action';
import { SettingsPermissionActions } from '../../actions/settings/permissions/settings.permissions.action';
import { select, Store } from '@ngrx/store';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild, computed, signal } from '@angular/core';
import { AppState } from '../../store';
import { ReplaySubject } from 'rxjs';
import { ShareRequestForm } from '../../models/api-models/Permission';
import { forIn, sortBy, cloneDeep, groupBy } from '../../lodash-optimized';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageLeaveUtilityService } from '../../services/page-leave-utility.service';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { NewConfirmationModalComponent } from '../../theme/new-confirmation-modal/confirmation-modal.component';
import { OrganizationType } from '../../models/user-login-state';
import { SettingsPermissionService } from '../../services/settings.permission.service';

/** Grouped permission rows for one shared user in the Users list */
interface PermissionUserGroup {
    name: string;
    rows: ShareRequestForm[];
}

@Component({
    selector: 'setting-permission',
    templateUrl: './setting.permission.component.html',
    styleUrls: ['./setting.permission.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SettingPermissionComponent implements OnInit, OnDestroy {
    /** Edit User Dialog Reference */
    @ViewChild('editUserModal', { static: true }) public editUserModal: TemplateRef<unknown>;
    /** Shared-with entries (legacy list holder) */
    public readonly sharedWith = signal<object[]>([]);
    /** Grouped users shown in the Users list */
    public readonly usersList = signal<PermissionUserGroup[]>([]);
    /** Active company unique name used for company-mode share APIs */
    public readonly selectedCompanyUniqueName = signal<string | null>(null);
    /** User row opened in the edit dialog */
    public readonly selectedUser = signal<ShareRequestForm | null>(null);
    /** Logged-in session user */
    public readonly currentUser = signal<unknown>(null);
    /** True when the open dialog is an update (derived from selectedUser) */
    public readonly isUpdtCase = computed(() => !!this.selectedUser());
    private loggedInUserEmail: string;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Permission locale strings */
    public readonly localeData = signal<Record<string, unknown>>({});
    /** Common locale strings */
    public readonly commonLocaleData = signal<Record<string, unknown>>({});
    /** True if permission form has unsaved changes */
    public readonly hasUnsavedChanges = signal<boolean>(false);
    /** Instance of edit user modal dialog */
    private editDialogRef: MatDialogRef<unknown> | null = null;
    /** True when organization is in company mode (entity column is company-mode only) */
    public readonly isCompanyMode = signal<boolean>(false);
    /** Entity options for the company-mode entity dropdown */
    public readonly entityOptions = computed(() => {
        const common = this.commonLocaleData();
        return [
            { label: common?.['app_company'] as string, value: 'COMPANY' },
            { label: common?.['app_branch'] as string, value: 'BRANCH' },
            { label: common?.['app_warehouse'] as string, value: 'WAREHOUSE' }
        ];
    });

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
        this.isCompanyMode.set(this.generalService.currentOrganizationType === OrganizationType.Company);
        this.store.pipe(select(state => state.settings.usersWithCompanyPermissions), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.isCompanyMode()) {
                this.setUsersList(response);
            }
        });
    }

    public getInitialData() {
        this.isCompanyMode.set(this.generalService.currentOrganizationType === OrganizationType.Company);
        this.store.dispatch(this.permissionActions.GetRoles());
        this.store.pipe(take(1)).subscribe(s => {
            this.selectedCompanyUniqueName.set(s.session.companyUniqueName);
            if (s.session.user) {
                this.currentUser.set(s.session.user.user);
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
            const locale = this.localeData();
            const common = this.commonLocaleData();
            const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
                panelClass: ['mat-dialog-md'],
                data: {
                    configuration: this.generalService.deleteConfiguration(locale?.['delete_user_permission'] as string, common)
                }
            });
            dialogRef.afterClosed().subscribe(response => {
                if (response === common?.['app_yes']) {
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


    public showModalForEdit(user?: ShareRequestForm): void {
        this.selectedUser.set(user ?? null);
        this.editDialogRef = this.dialog.open(this.editUserModal, {
            width: '1200px',
        });
    }
    public closeEditUserModal(event?: boolean): void {
        if (event && this.hasUnsavedChanges()) {
            this.pageLeaveUtilityService.confirmPageLeave((action) => {
                if (action) {
                    this.hasUnsavedChanges.set(false);
                    this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
                    this.editDialogRef?.close();
                }
            });
        } else {
            this.hasUnsavedChanges.set(false);
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
     * @param {ShareRequestForm} user
     * @returns {string}
     * @memberof SettingPermissionComponent
     */
    public getPastPeriodDuration(user: ShareRequestForm): string {
        let pastPeriodDuration = this.localeData()?.['past_period_duration'] as string;
        pastPeriodDuration = pastPeriodDuration?.replace("[DURATION]", String(user.duration));
        pastPeriodDuration = pastPeriodDuration?.replace("[PERIOD]", user.period);
        return pastPeriodDuration;
    }

    /**
     * Localized label for permission entity type (company / branch / warehouse)
     *
     * @param {string} entity
     * @returns {string}
     * @memberof SettingPermissionComponent
     */
    public getEntityLabel(entity: string): string {
        const key = entity?.toUpperCase();
        const matched = this.entityOptions().find(option => option.value === key);
        return matched?.label || entity;
    }

    /**
     * Resets form unsaved changes
     *
     * @private
     * @memberof SettingPermissionComponent
     */
    private resetUnsavedChanges(): void {
        this.hasUnsavedChanges.set(false);
        this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
        this.store.dispatch(this.settingsProfileActions.hasUnsavedChanges(false));
    }

    /**
     * Updates unsaved changes returned from inline form
     *
     * @param {boolean} event
     * @memberof SettingPermissionComponent
     */
    public updateUnsavedChanges(event: boolean): void {
        this.hasUnsavedChanges.set(event);
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
                this.usersList.set([]);
                return;
            }
            this.settingsPermissionService
                .getEntitySharedWith('branch', branchUniqueName)
                .pipe(takeUntil(this.destroyed$))
                .subscribe((response) => {
                    if (response?.status === 'success' && response.body) {
                        this.setUsersList(response.body);
                    } else {
                        this.usersList.set([]);
                    }
                });
            return;
        }

        this.store.dispatch(this.settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName()));
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
        let arr: PermissionUserGroup[] = [];
        forIn(sortedArr, (value: ShareRequestForm[]) => {
            if (value[0].emailId === this.loggedInUserEmail) {
                value[0].isLoggedInUser = true;
            }
            arr.push({ name: value[0].userName, rows: value });
        });
        this.usersList.set(sortBy(arr, ['name']));
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
            entityUniqueName: this.selectedCompanyUniqueName()
        };
    }
}