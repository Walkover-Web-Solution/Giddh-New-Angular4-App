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
  public searchLoad: Observable<boolean>;
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
  constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction) {
    this.searchLoad = this.store.select(state => state.groupwithaccounts.isGroupWithAccountsLoading);
    this.groupList$ = this.store.select(state => state.groupwithaccounts.groupswithaccounts);
    this.psConfig = { maxScrollbarLength: 20 };
  }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {
    Observable.fromEvent(this.grpSrchEl.nativeElement, 'keyup')
    .map((e: any) => e.target.value)
    .debounceTime(700)
    .distinctUntilChanged()
    .subscribe((val) => {
      this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(val));
    });
  }

  public closePopupEvent() {
    this.grpSrchEl.nativeElement.value = '';
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
