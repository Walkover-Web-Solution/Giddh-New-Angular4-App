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
    public activeGroupSharedWith$: Observable<ShareRequestForm[]>;
    public allPermissions$: Observable<GetAllPermissionResponse[]>;
    /** Email id validation regex pattern */
    public giddhEmailRegex = GIDDH_EMAIL_REGEX;

    @Output() public closeShareGroupModal: EventEmitter<any> = new EventEmitter();

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction, private accountActions: AccountsAction) {
        this.activeGroup$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroup), takeUntil(this.destroyed$));
        this.activeGroupSharedWith$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroupSharedWith), takeUntil(this.destroyed$));
        this.allPermissions$ = this.store.pipe(select(state => state.permission.permissions), takeUntil(this.destroyed$));
    }

    public ngOnInit() {

    }

    public getGroupSharedWith() {
        this.activeGroup$.subscribe((group) => {
            if (group) {
                this.store.dispatch(this.groupWithAccountsAction.sharedGroupWith(group.uniqueName));
            }
        });
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
        this.email = '';
        this.selectedPermission = '';
    }

    public async unShareGroup(entryUniqueName: string, groupUniqueName: string) {
        this.store.dispatch(this.accountActions.unShareEntity(entryUniqueName, 'group', groupUniqueName));
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
