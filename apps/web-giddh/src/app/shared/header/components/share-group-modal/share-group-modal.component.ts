import { first, takeUntil } from 'rxjs/operators';
import { ShareRequestForm } from './../../../../models/api-models/Permission';
import { GetAllPermissionResponse } from './../../../../permissions/permission.utility';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { Component, EventEmitter, OnDestroy, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import { GroupResponse } from '../../../../models/api-models/Group';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { GIDDH_EMAIL_REGEX } from '../../../helpers/defaultDateFormat';
import { clone, cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { Router } from '@angular/router';
import { SettingsProfileActions } from 'apps/web-giddh/src/app/actions/settings/profile/settings.profile.action';
import { GstSettingComponentStore } from 'apps/web-giddh/src/app/gst/gst-setting/utility/gst-setting.store';

@Component({
    selector: 'share-group-modal',
    templateUrl: './share-group-modal.component.html',
    styleUrls: [`./share-group-modal.component.scss`],
    providers: [GstSettingComponentStore]
})

export class ShareGroupModalComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public email: string;
    public selectedPermission: string;
    public activeGroup$: Observable<GroupResponse>;
    public activeGroupSharedWith$: Observable<ShareRequestForm[]>;
    public allPermissions$: Observable<GetAllPermissionResponse[]>;
    /** Email id validation regex pattern */
    public giddhEmailRegex = GIDDH_EMAIL_REGEX;
    public remainingUsers: number = 0;
    public activeCompany: any;
    

    @Output() public closeShareGroupModal: EventEmitter<any> = new EventEmitter();

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction, private accountActions: AccountsAction, private router: Router, private settingsProfileActions: SettingsProfileActions, private componentStore: GstSettingComponentStore) {
        this.activeGroup$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroup), takeUntil(this.destroyed$));
        this.activeGroupSharedWith$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroupSharedWith), takeUntil(this.destroyed$));
        this.allPermissions$ = this.store.pipe(select(state => state.permission.permissions), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
                if (activeCompany?.moduleRestrictionStatus) {
                    activeCompany.moduleRestrictionStatus.filter((module) => {
                        if (module?.moduleName === 'Users') {
                            this.remainingUsers = module?.remainingUsers;
                        }
                    });
                }
                console.log("ok", activeCompany);
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
     * Navigates to the page for creating a new company.
     * @param subscriptionId 
     */
    public createCompanyInSubscription(subscriptionId: string): void {
        this.router.navigate(['/pages/new-company/', subscriptionId]);
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
        setTimeout(()=>{
            this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        },500);
        this.email = '';
        this.selectedPermission = '';
    }

    public async unShareGroup(entryUniqueName: string, groupUniqueName: string) {
        this.store.dispatch(this.accountActions.unShareEntity(entryUniqueName, 'group', groupUniqueName));
        setTimeout(()=>{
            this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        },500);
    }

    public updatePermission(model: ShareRequestForm, event: any) {
        let data = cloneDeep(model);
        let newPermission = event.target?.value;
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
