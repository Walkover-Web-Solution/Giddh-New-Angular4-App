import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { mockData } from './mock';
import * as _ from 'lodash';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

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

  public psConfig: PerfectScrollbarConfigInterface;
  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>) {
    // this.columns$ = this.store.select(state => {
    //   return state.groupwithaccounts.groupswithaccounts;
    // });
    let newMockData = mockData;
    newMockData = _.sortBy(mockData, 'category');
    this.groupList$ = this.store.select(state => state.groupwithaccounts.groupswithaccounts);
    this.psConfig = { maxScrollbarLength: 20 };
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
