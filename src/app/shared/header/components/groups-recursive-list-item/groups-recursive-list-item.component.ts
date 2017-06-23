import { Component, OnInit, Input } from '@angular/core';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';

@Component({
  selector: 'groups-recursive-list-item',
  templateUrl: './groups-recursive-list-item.component.html',
})
export class GroupsRecursiveListItemComponent implements OnInit {

  @Input() public group: IGroupsWithAccounts;
  @Input() public padLeft: number = 30;

  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction) { }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {  }

  public onGroupClick(uniqueName: string) {
    this.store.dispatch(this.groupWithAccountsAction.SetActiveGroup(uniqueName));
  }
}
