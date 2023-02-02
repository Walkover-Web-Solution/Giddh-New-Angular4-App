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
    public email: string;
    public selectedPermission: string;
    public activeAccount$: Observable<AccountResponseV2>;
    public activeAccountSharedWith$: Observable<ShareRequestForm[]>;
    public allPermissions$: Observable<GetAllPermissionResponse[]>;
    /** Email id validation regex pattern */
    public giddhEmailRegex = GIDDH_EMAIL_REGEX;
    @Output() public closeShareAccountModal: EventEmitter<any> = new EventEmitter();

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private accountActions: AccountsAction) {
        this.activeAccount$ = this.store.pipe(select(state => state.groupwithaccounts.activeAccount), takeUntil(this.destroyed$));
        this.activeAccountSharedWith$ = this.store.pipe(select(state => state.groupwithaccounts.activeAccountSharedWith), takeUntil(this.destroyed$));
        this.allPermissions$ = this.store.pipe(select(state => state.permission.permissions), takeUntil(this.destroyed$));
    }

    public ngOnInit() {

    }

    public getAccountSharedWith() {
        this.activeAccount$.subscribe((acc) => {
            if (acc) {
                this.store.dispatch(this.accountActions.sharedAccountWith(acc.uniqueName));
            }
        });
    }

    public async shareAccount() {
        let activeAccount = await this.activeAccount$.pipe(first()).toPromise();
        let userRole = {
            emailId: this.email,
            entity: 'account',
            entityUniqueName: activeAccount?.uniqueName,
        };
        let selectedPermission = clone(this.selectedPermission);
        this.store.dispatch(this.accountActions.shareEntity(userRole, selectedPermission.toLowerCase()));
        this.email = '';
        this.selectedPermission = '';
    }

    public async unShareAccount(entryUniqueName: string, accountUniqueName: string) {
        this.store.dispatch(this.accountActions.unShareEntity(entryUniqueName, 'account', accountUniqueName));
    }

    public updatePermission(model: ShareRequestForm, event: any) {
        let data = cloneDeep(model);
        let newPermission = event.target?.value;
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
