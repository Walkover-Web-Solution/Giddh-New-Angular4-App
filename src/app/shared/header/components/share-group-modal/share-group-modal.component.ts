import { AccountsAction } from './../../../../services/actions/accounts.actions';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { GroupResponse, GroupSharedWithResponse, ShareGroupRequest } from '../../../../models/api-models/Group';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'share-group-modal',
  templateUrl: './share-group-modal.component.html'
})

export class ShareGroupModalComponent implements OnInit, OnDestroy {
  public email: string;
  public activeGroup$: Observable<GroupResponse>;
  public activeGroupSharedWith$: Observable<GroupSharedWithResponse[]>;
  @Output() public closeShareGroupModal: EventEmitter<any> = new EventEmitter();

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction, private accountActions: AccountsAction) {
    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup).takeUntil(this.destroyed$);
    this.activeGroupSharedWith$ = this.store.select(state => state.groupwithaccounts.activeGroupSharedWith).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    //
  }

  public async shareGroup() {
    let activeGrp = await this.activeGroup$.first().toPromise();

    // let grpObject = new ShareGroupRequest();
    // grpObject.role = 'view_only';
    // grpObject.user = this.email;
    // this.store.dispatch(this.groupWithAccountsAction.shareGroup(grpObject, activeGrp.uniqueName));
    // this.email = '';

    // let activeAccount = await this.activeAccount$.first().toPromise();
    let userRole = {
      emailId: this.email,
      entity: 'group',
      entityUniqueName: activeGrp.uniqueName,
    };

    this.store.dispatch(this.accountActions.shareEntity(userRole, 'view'));
    this.email = '';
  }

  public async unShareGroup(val) {
    let activeGrp = await this.activeGroup$.first().toPromise();

    this.store.dispatch(this.groupWithAccountsAction.unShareGroup(val, activeGrp.uniqueName));
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
