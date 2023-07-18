import { take, takeUntil } from 'rxjs/operators';
import { GeneralService } from '../../services/general.service';
import { AccountsAction } from '../../actions/accounts.actions';
import { PermissionActions } from '../../actions/permission/permission.action';
import { SettingsPermissionActions } from '../../actions/settings/permissions/settings.permissions.action';
import { select, Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../../store';
import { ReplaySubject } from 'rxjs';
import { ShareRequestForm } from '../../models/api-models/Permission';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { forIn } from 'apps/web-giddh/src/app/lodash-optimized';

@Component({
    selector: 'setting-permission',
    templateUrl: './setting.permission.component.html',
    styleUrls: ['./setting.permission.component.scss']
})
export class SettingPermissionComponent implements OnInit, OnDestroy {

    @ViewChild('editUserModal', { static: false }) public editUserModal: ModalDirective;

    public sharedWith: object[] = [];
    public usersList: any;
    public selectedCompanyUniqueName: string;
    public selectedUser: ShareRequestForm;
    public currentUser: any;

    // modals related
    public showEditUserModal: boolean = false;
    public modalConfig = {
        animated: true,
        keyboard: false,
        backdrop: 'static',
        ignoreBackdropClick: true
    };
    public isUpdtCase: boolean = false;
    private loggedInUserEmail: string;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private _settingsPermissionActions: SettingsPermissionActions,
        private _permissionActions: PermissionActions,
        private _accountsAction: AccountsAction,
        private store: Store<AppState>,
        private _generalService: GeneralService
    ) {
        this.store.pipe(select(s => s.session.user), take(1)).subscribe(result => {
            if (result && result.user) {
                this._generalService.user = result.user;
                this.loggedInUserEmail = result.user.email;
            }
        });
    }

    public ngOnInit() {
        this.store.pipe(select(state => state.settings.usersWithCompanyPermissions), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let data = _.cloneDeep(response);
                let sortedArr = _.groupBy(this.prepareDataForUI(data), 'emailId');
                let arr = [];
                forIn(sortedArr, (value) => {
                    if (value[0].emailId === this.loggedInUserEmail) {
                        value[0].isLoggedInUser = true;
                    }
                    arr.push({ name: value[0].userName, rows: value });
                });
                this.usersList = _.sortBy(arr, ['name']);
            }
        });

    }

    public getInitialData() {
        this.store.dispatch(this._permissionActions.GetRoles());
        this.store.pipe(take(1)).subscribe(s => {
            this.selectedCompanyUniqueName = s.session.companyUniqueName;
            this.store.dispatch(this._settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName));
            if (s.session.user) {
                this.currentUser = s.session.user.user;
            }
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
            this.store.dispatch(this._accountsAction.unShareEntity(assignRoleEntryUniqueName, 'company', this.selectedCompanyUniqueName));
            this.waitAndReloadCompany();
        }
    }

    public showModalForEdit(user?: any) {
        this.selectedUser = user ? user : '';
        this.showEditUserModal = true;
        setTimeout(() => this.editUserModal?.show(), 700);
    }

    public closeEditUserModal() {
        this.editUserModal.hide();
        setTimeout(() => this.showEditUserModal = false, 700);
    }

    public waitAndReloadCompany() {
        setTimeout(() => {
            this.store.dispatch(this._settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName));
        }, 2000);
    }

    public ngOnDestroy() {
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
}
