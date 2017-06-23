import { Component, OnInit, Input } from '@angular/core';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';

@Component({
  selector: 'groups-recursive-list',
  templateUrl: './groups-recursive-list.component.html',
})
export class GroupsRecursiveListComponent implements OnInit {

  @Input() public groupList: IGroupsWithAccounts[];
  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction) { }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {  }

  public onGroupClick(uniqueName: string) {
    this.store.dispatch(this.groupWithAccountsAction.SetActiveGroup(uniqueName));
  }
}
