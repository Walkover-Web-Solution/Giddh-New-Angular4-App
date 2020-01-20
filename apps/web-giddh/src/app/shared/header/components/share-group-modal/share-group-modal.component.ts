import { first, takeUntil } from 'rxjs/operators';
import { ShareRequestForm } from './../../../../models/api-models/Permission';

import { ToasterService } from './../../../../services/toaster.service';
import { PermissionActions } from '../../../../actions/permission/permission.action';
import { GetAllPermissionResponse } from './../../../../permissions/permission.utility';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { GroupResponse } from '../../../../models/api-models/Group';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { Observable, ReplaySubject } from 'rxjs';
import * as _ from 'apps/web-giddh/src/app/lodash-optimized';

@Component({
	selector: 'share-group-modal',
	templateUrl: './share-group-modal.component.html'
})

export class ShareGroupModalComponent implements OnInit, OnDestroy {
	public email: string;
	public selectedPermission: string;
	public activeGroup$: Observable<GroupResponse>;
	public activeGroupSharedWith$: Observable<ShareRequestForm[]>;
	public allPermissions$: Observable<GetAllPermissionResponse[]>;

	@Output() public closeShareGroupModal: EventEmitter<any> = new EventEmitter();

	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private _toasty: ToasterService, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction, private accountActions: AccountsAction, private _permissionActions: PermissionActions) {
		this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup).pipe(takeUntil(this.destroyed$));
		this.activeGroupSharedWith$ = this.store.select(state => state.groupwithaccounts.activeGroupSharedWith).pipe(takeUntil(this.destroyed$));
		this.allPermissions$ = this.store.select(state => state.permission.permissions).pipe(takeUntil(this.destroyed$));
	}

	public ngOnInit() {
		this.store.dispatch(this._permissionActions.GetAllPermissions());
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
			entityUniqueName: activeGrp.uniqueName,
		};
		let selectedPermission = _.clone(this.selectedPermission);
		this.store.dispatch(this.accountActions.shareEntity(userRole, selectedPermission.toLowerCase()));
		this.email = '';
		this.selectedPermission = '';
	}

	public async unShareGroup(entryUniqueName: string, groupUniqueName: string) {
		this.store.dispatch(this.accountActions.unShareEntity(entryUniqueName, 'group', groupUniqueName));
	}

	// public callbackFunction(activeGroup: any, email: string, currentPermission: string, newPermission: string) {
	//     let userRole = {
	//       emailId: email,
	//       entity: 'group',
	//       entityUniqueName: activeGroup.uniqueName,
	//       updateInBackground: true,
	//       newPermission
	//     };

	//     this.store.dispatch(this.accountActions.updateEntityPermission(userRole, currentPermission));
	// }

	public updatePermission(model: ShareRequestForm, event: any) {
		let data = _.cloneDeep(model);
		let newPermission = event.target.value;
		data.roleUniqueName = newPermission;
		this.store.dispatch(this.accountActions.updateEntityPermission(data, newPermission, 'group'));
	}

	// public checkIfUserAlreadyHavingPermission(email: string, currentPermission: string, permissionUniqueName: string, activeGroup: any, event: any) {
	//   this.activeGroupSharedWith$.take(1).subscribe((data) => {
	//     if (data) {
	//       let roleIndex = data.findIndex((p) => {
	//         return p.role.uniqueName === permissionUniqueName;
	//       });
	//       if (roleIndex > -1) {
	//         this._toasty.errorToast(`${email} already have ${permissionUniqueName} permission.`);
	//         this.store.dispatch(this.groupWithAccountsAction.sharedGroupWith(activeGroup.uniqueName));
	//       } else {
	//         this.callbackFunction(activeGroup, email, currentPermission, permissionUniqueName);
	//       }
	//     }
	//   });
	// }

	public closeModal() {
		this.email = '';
		this.closeShareGroupModal.emit();
	}

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
