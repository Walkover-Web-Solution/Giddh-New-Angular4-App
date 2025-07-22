import { first, takeUntil } from 'rxjs/operators';
import { ShareRequestForm } from './../../../../models/api-models/Permission';
import { GetAllPermissionResponse } from './../../../../permissions/permission.utility';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { GroupResponse } from '../../../../models/api-models/Group';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { GIDDH_EMAIL_REGEX } from '../../../helpers/defaultDateFormat';
import { clone, cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { Router } from '@angular/router';
import { SettingsProfileActions } from 'apps/web-giddh/src/app/actions/settings/profile/settings.profile.action';
import { RestrictedModules } from 'apps/web-giddh/src/app/app.constant';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-select/option.interface';

@Component({
    selector: 'share-group-modal',
    templateUrl: './share-group-modal.component.html',
    styleUrls: [`./share-group-modal.component.scss`]
})

export class ShareGroupModalComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public email: string;
    public selectedPermission: string;
    public activeGroup$: Observable<GroupResponse>;
    /** Stores the active company information observable*/
    public activeCompany$: Observable<any>;
    public activeGroupSharedWith$: Observable<ShareRequestForm[]>;
    public allPermissions$: Observable<GetAllPermissionResponse[]>;
    /** Email id validation regex pattern */
    public giddhEmailRegex = GIDDH_EMAIL_REGEX;
    /** True if user module is restricted */
    public isUserRestricted: boolean = false;
    /** Active company details */
    public activeCompany: any;
    /** Enum for restricted modules */
    public restrictedModules: any = RestrictedModules;
    /** All permissions role options */
    public allPermissions: IOption[] = [];


    @Output() public closeShareGroupModal: EventEmitter<any> = new EventEmitter();

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction, private accountActions: AccountsAction, private router: Router, private settingsProfileActions: SettingsProfileActions) {
        this.activeGroup$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroup), takeUntil(this.destroyed$));
        this.activeGroupSharedWith$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroupSharedWith), takeUntil(this.destroyed$));
        this.allPermissions$ = this.store.pipe(select(state => state.permission.permissions), takeUntil(this.destroyed$));
        this.activeCompany$ = this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
                if (activeCompany.subscription?.planDetails?.restrictedModules && Object.hasOwn(activeCompany.subscription.planDetails.restrictedModules, this.restrictedModules.Users) && activeCompany.moduleRestrictionStatus) {
                    const module = activeCompany.moduleRestrictionStatus.find(
                        (module) => module?.moduleName === this.restrictedModules.Users
                    );
                    this.isUserRestricted = !module?.remainingUsers;
                }
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

    public getGroupSharedWith() {
        this.activeGroup$.subscribe((group) => {
            if (group) {
                this.store.dispatch(this.groupWithAccountsAction.sharedGroupWith(group.uniqueName));
            }
        });
    }

    /**
     * Navigates to the page for buy plan.
     * @param subscriptionId
     * @memberof  ShareGroupModalComponent
     */
    public buyPlan(subscriptionId: string): void {
        if (subscriptionId) {
            this.closeModal();
            this.store.dispatch(this.groupWithAccountsAction.HideAddAndManageFromOutside());
            document.querySelector('body')?.classList?.remove('master-page');
            this.router.navigate(['pages', 'user-details', 'subscription', 'buy-plan', subscriptionId]);
        }
    }

    public async shareGroup() {
        let activeGrp = await this.activeGroup$.pipe(first()).toPromise();
        let userRole = {
            emailId: this.email,
            entity: 'group',
            entityUniqueName: activeGrp?.uniqueName,
        };
        let selectedPermission = clone(this.selectedPermission);
        this.store.dispatch(this.accountActions.shareEntity(userRole, selectedPermission?.toLowerCase()));
        setTimeout(() => {
            this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        }, 500);
        this.email = '';
        this.selectedPermission = '';
    }

    public async unShareGroup(entryUniqueName: string, groupUniqueName: string) {
        this.store.dispatch(this.accountActions.unShareEntity(entryUniqueName, 'group', groupUniqueName));
        setTimeout(() => {
            this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        }, 500);
    }

    public updatePermission(model: ShareRequestForm, event: any) {
        let data = cloneDeep(model);
        let newPermission = event.value;
        data.roleUniqueName = newPermission;
        this.store.dispatch(this.accountActions.updateEntityPermission(data, newPermission, 'group'));
    }

    public closeModal() {
        this.email = '';
        this.closeShareGroupModal.emit();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
