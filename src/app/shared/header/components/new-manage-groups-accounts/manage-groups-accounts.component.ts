import { GroupsAccountSidebarComponent } from '../new-group-account-sidebar/groups-account-sidebar.component';
import {
  Component, EventEmitter, OnDestroy, OnInit, Output, ElementRef, ViewChild, AfterViewInit, AfterContentInit,
  ChangeDetectorRef, AfterViewChecked
} from '@angular/core';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'app-manage-groups-accounts',
  templateUrl: './manage-groups-accounts.component.html',
  styleUrls: ['./manage-groups-accounts.component.css']
})
export class ManageGroupsAccountsComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit, AfterViewChecked {
  @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter(true);
  @ViewChild('header') public header: ElementRef;
  public headerRect: any;
  public showForm: boolean = false;
  @ViewChild('myModel') public myModel: ElementRef;
  @ViewChild('groupsidebar') public groupsidebar: GroupsAccountSidebarComponent;
  public config: PerfectScrollbarConfigInterface = { suppressScrollX: false, suppressScrollY: true };
  @ViewChild('perfectdirective') public directiveScroll: PerfectScrollbarDirective;

  public myModelRect: any;
  public grpSearch: string;
  public searchLoad: Observable<boolean>;

  public groupList$: Observable<GroupsWithAccountsResponse[]>;

  public psConfig: PerfectScrollbarConfigInterface;
  public addNewAccountForm: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction, private cdRef: ChangeDetectorRef) {
    this.searchLoad = this.store.select(state => state.groupwithaccounts.isGroupWithAccountsLoading).takeUntil(this.destroyed$);
    this.groupList$ = this.store.select(state => state.groupwithaccounts.groupswithaccounts).takeUntil(this.destroyed$);
    this.psConfig = { maxScrollbarLength: 80 };
  }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {

  }

  public ngAfterViewInit() {
    //
  }
  public ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  public ngAfterContentInit() {
    //
  }
  public closePopupEvent() {
    this.grpSearch = '';
    this.closeEvent.emit(true);
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  public ScrollToRight() {
    this.directiveScroll.scrollToRight();
  }
  public ShowRightForm(e) {
    //
  }
}
