import { first, takeUntil } from 'rxjs/operators';
import { ShareRequestForm } from './../../../../models/api-models/Permission';
import { GetAllPermissionResponse } from './../../../../permissions/permission.utility';
import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { Observable, ReplaySubject } from 'rxjs';
import { AccountResponseV2 } from '../../../../models/api-models/Account';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { GIDDH_EMAIL_REGEX } from '../../../helpers/defaultDateFormat';
import { clone, cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { RestrictedModules } from 'apps/web-giddh/src/app/app.constant';
import { SettingsProfileActions } from 'apps/web-giddh/src/app/actions/settings/profile/settings.profile.action';
import { GroupWithAccountsAction } from 'apps/web-giddh/src/app/actions/groupwithaccounts.actions';
import { Router } from '@angular/router';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-select/option.interface';

@Component({
    selector: 'share-account-modal',
    templateUrl: './share-account-modal.component.html',
    styleUrls: [`./share-account-modal.component.scss`]
})

export class ShareAccountModalComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Stores the active company information observable*/
    public activeCompany$: Observable<any>;
    /** Enum for restricted modules */
    public restrictedModules: any = RestrictedModules;
    /** True if user module is restricted */
    public isUserRestricted: boolean = false;
    public email: string;
    public selectedPermission: string;
    public activeAccount$: Observable<AccountResponseV2>;
    public activeAccountSharedWith$: Observable<ShareRequestForm[]>;
    public allPermissions$: Observable<GetAllPermissionResponse[]>;
    /** Email id validation regex pattern */
    public giddhEmailRegex = GIDDH_EMAIL_REGEX;
    @Output() public closeShareAccountModal: EventEmitter<any> = new EventEmitter();
    /** All permissions role options */
    public allPermissions: IOption[] = [];

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private accountActions: AccountsAction, private router: Router, private groupWithAccountsAction: GroupWithAccountsAction, private settingsProfileActions: SettingsProfileActions) {
        this.activeAccount$ = this.store.pipe(select(state => state.groupwithaccounts.activeAccount), takeUntil(this.destroyed$));
        this.activeAccountSharedWith$ = this.store.pipe(select(state => state.groupwithaccounts.activeAccountSharedWith), takeUntil(this.destroyed$));
        this.allPermissions$ = this.store.pipe(select(state => state.permission.permissions), takeUntil(this.destroyed$));
        this.activeCompany$ = this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany && Object.hasOwn(activeCompany.subscription?.planDetails?.restrictedModules, this.restrictedModules.Users) && activeCompany.moduleRestrictionStatus) {
                const module = activeCompany.moduleRestrictionStatus.find(
                    (module) => module?.moduleName === this.restrictedModules.Users
                );
                this.isUserRestricted = !module?.remainingUsers;
            }
        });

        this.allPermissions$.pipe(takeUntil(this.destroyed$)).subscribe((permissions) => {
            if (permissions?.length) {
                this.allPermissions = permissions.map((permission: GetAllPermissionResponse) => ({
                    label: permission.name,
                    value: permission.uniqueName
                }));
            }
        });
    }

    public getAccountSharedWith() {
        this.activeAccount$.subscribe((acc) => {
            if (acc) {
                this.store.dispatch(this.accountActions.sharedAccountWith(acc.uniqueName));
            }
        });
    }

    /**
     * Navigates to the page for buy plan.
     * @param subscriptionId
     * @memberof  ShareAccountModalComponent
     */
    public buyPlan(subscriptionId: string): void {
        if (subscriptionId) {
            this.closeModal();
            this.store.dispatch(this.groupWithAccountsAction.HideAddAndManageFromOutside());
            document.querySelector('body')?.classList?.remove('master-page');
            this.router.navigate(['pages', 'user-details', 'subscription', 'buy-plan', subscriptionId]);
        }
    }

    public async shareAccount() {
        let activeAccount = await this.activeAccount$.pipe(first()).toPromise();
        let userRole = {
            emailId: this.email,
            entity: 'account',
            entityUniqueName: activeAccount?.uniqueName,
        };
        let selectedPermission = clone(this.selectedPermission);
        this.store.dispatch(this.accountActions.shareEntity(userRole, selectedPermission?.toLowerCase()));
        setTimeout(() => {
            this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        }, 500);
        this.email = '';
        this.selectedPermission = '';
    }

    public async unShareAccount(entryUniqueName: string, accountUniqueName: string) {
        this.store.dispatch(this.accountActions.unShareEntity(entryUniqueName, 'account', accountUniqueName));
        setTimeout(() => {
            this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        }, 500);
    }

    public updatePermission(model: ShareRequestForm, event: any) {
        let data = cloneDeep(model);
        let newPermission = event.value;
        data.roleUniqueName = newPermission;
        this.store.dispatch(this.accountActions.updateEntityPermission(data, newPermission, 'account'));
    }

    public closeModal() {
        this.email = '';
        this.closeShareAccountModal.emit();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
