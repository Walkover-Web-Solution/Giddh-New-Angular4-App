import { first, takeUntil } from 'rxjs/operators';
import { ShareRequestForm } from './../../../../models/api-models/Permission';
import { GetAllPermissionResponse } from './../../../../permissions/permission.utility';
import { PermissionActions } from '../../../../actions/permission/permission.action';
import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { Observable, ReplaySubject } from 'rxjs';
import { AccountResponseV2 } from '../../../../models/api-models/Account';
import { AccountsAction } from '../../../../actions/accounts.actions';
import * as _ from 'apps/web-giddh/src/app/lodash-optimized';
import { GIDDH_EMAIL_REGEX } from '../../../helpers/defaultDateFormat';

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

    constructor(private store: Store<AppState>, private accountActions: AccountsAction, private _permissionActions: PermissionActions) {
        this.activeAccount$ = this.store.pipe(select(state => state.groupwithaccounts.activeAccount), takeUntil(this.destroyed$));
        this.activeAccountSharedWith$ = this.store.pipe(select(state => state.groupwithaccounts.activeAccountSharedWith), takeUntil(this.destroyed$));
        this.allPermissions$ = this.store.pipe(select(state => state.permission.permissions), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.store.dispatch(this._permissionActions.GetAllPermissions());
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
            entityUniqueName: activeAccount.uniqueName,
        };
        let selectedPermission = _.clone(this.selectedPermission);
        this.store.dispatch(this.accountActions.shareEntity(userRole, selectedPermission.toLowerCase()));
        this.email = '';
        this.selectedPermission = '';
    }

    public async unShareAccount(entryUniqueName: string, accountUniqueName: string) {
        this.store.dispatch(this.accountActions.unShareEntity(entryUniqueName, 'account', accountUniqueName));
    }

    // public callbackFunction(activeAccount: any, email: string, currentPermission: string, newPermission: string) {
    //     let userRole = {
    //       emailId: email,
    //       entity: 'account',
    //       entityUniqueName: activeAccount.uniqueName,
    //       updateInBackground: true,
    //       newPermission
    //     };

    //     this.store.dispatch(this.accountActions.updateEntityPermission(userRole, currentPermission));
    // }

    public updatePermission(model: ShareRequestForm, event: any) {
        let data = _.cloneDeep(model);
        let newPermission = event.target.value;
        data.roleUniqueName = newPermission;
        this.store.dispatch(this.accountActions.updateEntityPermission(data, newPermission, 'account'));
    }

    // public checkIfUserAlreadyHavingPermission(email: string, currentPermission: string, permissionUniqueName: string, activeAccount: any, event: any) {
    //   this.activeAccountSharedWith$.take(1).subscribe((data) => {
    //     if (data) {
    //       let roleIndex = data.findIndex((p) => {
    //         return p.role.uniqueName === permissionUniqueName;
    //       });
    //       if (roleIndex > -1) {
    //         this._toasty.errorToast(`${email} already have ${permissionUniqueName} permission.`);
    //         this.store.dispatch(this.accountActions.sharedAccountWith(activeAccount.uniqueName));
    //       } else {
    //         this.callbackFunction(activeAccount, email, currentPermission, permissionUniqueName);
    //       }
    //     }
    //   });
    // }

    public closeModal() {
        this.email = '';
        this.closeShareAccountModal.emit();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
