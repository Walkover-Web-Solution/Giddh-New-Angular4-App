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
import { clone, cloneDeep } from '../../../../lodash-optimized';
import { Router } from '@angular/router';
import { SettingsProfileActions } from 'apps/web-giddh/src/app/actions/settings/profile/settings.profile.action';
import { IOption, RestrictedModules } from 'apps/web-giddh/src/app/app.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'share-group-modal',
    templateUrl: './share-group-modal.component.html',
    styleUrls: [`./share-group-modal.component.scss`],
    standalone: false
})

export class ShareGroupModalComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Selected permission */
    public selectedPermission: string = "";
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
    /** Observable to observe create new permission is successfull */
    public createPermissionSuccess$: Observable<boolean>;
    /** Form group for share group */
    public shareGroupForm: FormGroup;


    @Output() public closeShareGroupModal: EventEmitter<any> = new EventEmitter();

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private accountActions: AccountsAction,
        private router: Router,
        private settingsProfileActions: SettingsProfileActions,
        private formBuilder: FormBuilder
    ) {
        this.activeGroup$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroup), takeUntil(this.destroyed$));
        this.activeGroupSharedWith$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroupSharedWith), takeUntil(this.destroyed$));
        this.allPermissions$ = this.store.pipe(select(state => state.permission.permissions), takeUntil(this.destroyed$));
        this.activeCompany$ = this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$));
        this.createPermissionSuccess$ = this.store.pipe(select(permissionStore => permissionStore.permission.createPermissionSuccess), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.shareGroupForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern(this.giddhEmailRegex)]],
            permission: ['', [Validators.required]]
        });

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

        this.activeGroupSharedWith$.pipe(takeUntil(this.destroyed$)).subscribe((sharedWith) => {
            if (sharedWith) {
                this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
            }
        });

        this.createPermissionSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((permissionSuccess) => {
            if (permissionSuccess) {
                this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
                this.selectedPermission = "";
                this.shareGroupForm.reset();
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
            emailId: this.shareGroupForm.get('email')?.value,
            entity: 'group',
            entityUniqueName: activeGrp?.uniqueName,
        };
        let selectedPermission = clone(this.shareGroupForm.get('permission')?.value);
        this.store.dispatch(this.accountActions.shareEntity(userRole, selectedPermission?.toLowerCase()));
    }

    public async unShareGroup(entryUniqueName: string, groupUniqueName: string) {
        this.store.dispatch(this.accountActions.unShareEntity(entryUniqueName, 'group', groupUniqueName));
    }

    public updatePermission(model: ShareRequestForm, event: any) {
        let data = cloneDeep(model);
        let newPermission = event.value;
        data.roleUniqueName = newPermission;
        this.store.dispatch(this.accountActions.updateEntityPermission(data, newPermission, 'group'));
    }

    public closeModal() {
        this.shareGroupForm.reset();
        this.closeShareGroupModal.emit();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
