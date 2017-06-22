import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-manage-groups-accounts',
  templateUrl: './manage-groups-accounts.component.html',
  styleUrls: ['./manage-groups-accounts.component.css']
})
export class ManageGroupsAccountsComponent implements OnInit {
  @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter(true);
  public grpSrch: string = '';
  public searchLoad: boolean = true;
  public showListGroupsNow: boolean = true;
  public showOnUpdate: boolean = false;
  public canUpdate: boolean = false;
  public canShare: boolean = false;
  public createNew: boolean = false;
  public mainGrp: any[] = [];
  public groupList$: Observable<GroupsWithAccountsResponse[]>;
  public breadCrumbList: any[] = [];
  public accountSharedUserList: any[] = [];
  public groupSharedUserList: any[] = [];
  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>) {
    // this.columns$ = this.store.select(state => {
    //   return state.groupwithaccounts.groupswithaccounts;
    // });
    let data = {
    name: 'Capital',
    synonyms: 'hahha',
    uniqueName: 'capital',
    accounts: [],
    active: {
      type: 'grp'
    },
    groups: [
        {
          synonyms: '',
            name: 'First Sub Group',
            description: 'No desc.',
            role: {
                name: 'Super Admin',
                uniqueName: 'super_admin',
                permissions: [
                    {
                        code: 'VW',
                        description: 'View'
                    }
                ]
            },
            uniqueName: 'Sub Group Unique Name',
            accounts: [],
            groups: [],
            isFixed: false,
            category: ''
        }
      ],
      category: 'assets'
    };
    // let a = new GroupsWithAccountsResponse('a', [], '', '', '', []);
    this.groupList$ = Observable.of([data]);
  }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {
  }

  public closePopupEvent() {
    this.closeEvent.emit(true);
  }

  public resetSearch() {
    //
  }

  public createNewGrpAccount(index) {
    //
  }

  public jumpToGroup() {
    //
  }

  public shareAccModal() {
    //
  }

  public shareGrpModal() {
    //
  }

  public getSelectedType() {
    //
  }
}
