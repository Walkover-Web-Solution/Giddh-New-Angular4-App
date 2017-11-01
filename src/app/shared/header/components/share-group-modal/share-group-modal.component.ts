import { ToasterService } from './../../../../services/toaster.service';
import { PermissionActions } from './../../../../services/actions/permission/permission.action';
import { GetAllPermissionResponse } from './../../../../permissions/permission.utility';
import { AccountsAction } from './../../../../services/actions/accounts.actions';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { GroupResponse, GroupSharedWithResponse, ShareGroupRequest } from '../../../../models/api-models/Group';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from 'lodash';

@Component({
  selector: 'share-group-modal',
  templateUrl: './share-group-modal.component.html'
})

export class ShareGroupModalComponent implements OnInit, OnDestroy {
  public email: string;
  public selectedPermission: string;
  public activeGroup$: Observable<GroupResponse>;
  public activeGroupSharedWith$: Observable<GroupSharedWithResponse[]>;
  public allPermissions$: Observable<GetAllPermissionResponse[]>;

  @Output() public closeShareGroupModal: EventEmitter<any> = new EventEmitter();

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _toasty: ToasterService, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction, private accountActions: AccountsAction,  private _permissionActions: PermissionActions) {
    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup).takeUntil(this.destroyed$);
    this.activeGroupSharedWith$ = this.store.select(state => state.groupwithaccounts.activeGroupSharedWith).takeUntil(this.destroyed$);
    this.allPermissions$ = this.store.select(state => state.permission.permissions).takeUntil(this.destroyed$);
}

  public ngOnInit() {
      this.store.dispatch(this._permissionActions.GetAllPermissions());
  }

  public async shareGroup() {
    let activeGrp = await this.activeGroup$.first().toPromise();
    let userRole = {
      emailId: this.email,
      entity: 'group',
      entityUniqueName: activeGrp.uniqueName,
    };
    let selectedPermission = _.clone(this.selectedPermission);
    this.store.dispatch(this.accountActions.shareEntity(userRole, selectedPermission.toLowerCase()));
    this.email = '';
    this.selectedPermission = '';
  }

  public async unShareGroup(email: string, givenPermission: string) {
    let activeGrp = await this.activeGroup$.first().toPromise();
    let userRole = {
      emailId: email,
      entity: 'group',
      entityUniqueName: activeGrp.uniqueName,
    };

    this.store.dispatch(this.accountActions.unShareEntity(userRole, givenPermission));
  }

  public callbackFunction(activeGroup: any, email: string, currentPermission: string, newPermission: string) {
      let userRole = {
        emailId: email,
        entity: 'group',
        entityUniqueName: activeGroup.uniqueName,
        updateInBackground: true,
        newPermission
      };

      this.store.dispatch(this.accountActions.updateEntityPermission(userRole, currentPermission));
  }

  public async updatePermission(email: string, currentPermission: string, event: any) {
    let activeAccount = await this.activeGroup$.first().toPromise();
    let newPermission = event.target.value;
    this.checkIfUserAlreadyHavingPermission(email, currentPermission, newPermission, activeAccount, event);
  }

  public checkIfUserAlreadyHavingPermission(email: string, currentPermission: string, permissionUniqueName: string, activeGroup: any, event: any) {
    this.activeGroupSharedWith$.take(1).subscribe((data) => {
      if (data) {
        let roleIndex = data.findIndex((p) => {
          return p.role.uniqueName === permissionUniqueName;
        });
        if (roleIndex > -1) {
          this._toasty.errorToast(`${email} already have ${permissionUniqueName} permission.`);
          this.store.dispatch(this.groupWithAccountsAction.sharedGroupWith(activeGroup.uniqueName));
        } else {
          this.callbackFunction(activeGroup, email, currentPermission, permissionUniqueName);
        }
      }
    });
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
