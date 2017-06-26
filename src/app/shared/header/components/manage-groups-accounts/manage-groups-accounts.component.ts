import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';

@Component({
  selector: 'app-manage-groups-accounts',
  templateUrl: './manage-groups-accounts.component.html',
  styleUrls: ['./manage-groups-accounts.component.css']
})
export class ManageGroupsAccountsComponent implements OnInit {
  @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter(true);
  @ViewChild('grpSrchEl') public grpSrchEl: ElementRef;
  public grpSrch: string;
  public searchLoad: Observable<boolean>;

  public groupList$: Observable<GroupsWithAccountsResponse[]>;

  public psConfig: PerfectScrollbarConfigInterface;
  public addNewAccountForm: boolean = false;
  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction) {
    this.searchLoad = this.store.select(state => state.groupwithaccounts.isGroupWithAccountsLoading);
    this.groupList$ = this.store.select(state => state.groupwithaccounts.groupswithaccounts);
    this.psConfig = { maxScrollbarLength: 20 };
  }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {

  }

  public closePopupEvent() {
    this.grpSrchEl.nativeElement.value = '';
    this.closeEvent.emit(true);
  }
}
