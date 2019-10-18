import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { IOption } from '../../../../../theme/ng-select/option.interface';
import { AppState } from '../../../../../store';
import { GroupService } from '../../../../../services/group.service';
import { AccountsAction } from '../../../../../actions/accounts.actions';
import { AccountRequestV2 } from '../../../../../models/api-models/Account';
import { IFlattenGroupsAccountsDetail } from '../../../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { GroupsWithAccountsResponse } from '../../../../../models/api-models/GroupsWithAccounts';

const GROUP = ['revenuefromoperations', 'otherincome', 'operatingcost', 'indirectexpenses'];

@Component({
  selector: 'ledger-aside-pane-account',
  styles: [`
    :host {
      position: fixed;
      left: auto;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      max-width:580px;
      z-index: 99999;
    }

    #close {
      display: none;
    }

    :host.in #close {
      display: block;
      position: fixed;
      left: -41px;
      top: 0;
      z-index: 5;
      border: 0;
      border-radius: 0;
    }

    :host .container-fluid {
      padding-left: 0;
      padding-right: 0;
    }

    :host .aside-pane {
      width: 100%;
    max-width:580px;
    }

    .aside-pane {
      width: 100%;
    }

    .flexy-child {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .flexy-child-1 {
      flex-grow: 1;
    }

    .vmiddle {
      position: absolute;
      top: 50%;
      bottom: 0;
      left: 0;
      display: table;
      width: 100%;
      right: 0;
      transform: translateY(-50%);
      text-align: center;
      margin: 0 auto;
    }
  `],
  templateUrl: './ledger-aside.pane.account.component.html'
})
export class LedgerAsidePaneAccountComponent implements OnInit, OnDestroy {

  @Input() public activeGroupUniqueName: string;
  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  public select2Options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select Group',
    allowClear: true
  };
  public isGstEnabledAcc: boolean = false;
  public isHsnSacEnabledAcc: boolean = false;
  public fetchingAccUniqueName$: Observable<boolean>;
  public isAccountNameAvailable$: Observable<boolean>;
  public createAccountInProcess$: Observable<boolean>;
  public flattenGroupsArray: IOption[] = [];
  public groupsArrayStream$: Observable<GroupsWithAccountsResponse[]>;

  // private below
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private groupService: GroupService,
    private accountsAction: AccountsAction,
    private _groupService: GroupService
  ) {
    this.groupsArrayStream$ = this.store.select(p => p.general.groupswithaccounts).pipe(takeUntil(this.destroyed$));
    // account-add component's property
    this.fetchingAccUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingAccUniqueName).pipe(takeUntil(this.destroyed$));
    this.isAccountNameAvailable$ = this.store.select(state => state.groupwithaccounts.isAccountNameAvailable).pipe(takeUntil(this.destroyed$));
    this.createAccountInProcess$ = this.store.select(state => state.groupwithaccounts.createAccountInProcess).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this._groupService.GetFlattenGroupsAccounts('', 1, 5000, 'true').subscribe(result => {
      if (result.status === 'success') {
        // this.groupsArrayStream$ = Observable.of(result.body.results);
        let groupsListArray: IOption[] = [];
        result.body.results = this.removeFixedGroupsFromArr(result.body.results);
        result.body.results.forEach(a => {
          groupsListArray.push({ label: a.groupName, value: a.groupUniqueName });
        });
        this.flattenGroupsArray = groupsListArray;
      }
    });
  }

  public addNewAcSubmit(accRequestObject: { activeGroupUniqueName: string, accountRequest: AccountRequestV2 }) {
    this.store.dispatch(this.accountsAction.createAccountV2(accRequestObject.activeGroupUniqueName, accRequestObject.accountRequest));
  }

  public closeAsidePane(event) {
    this.closeAsideEvent.emit(event);
  }

  public checkSelectedGroup(options: IOption) {
    this.groupsArrayStream$.subscribe(data => {
      if (data.length) {
        let accountCategory = this.flattenGroup(data, options.value, null);
        this.isGstEnabledAcc = accountCategory === 'assets' || accountCategory === 'liabilities';
        this.isHsnSacEnabledAcc = !this.isGstEnabledAcc;
      }
    });
  }

  public removeFixedGroupsFromArr(data: IFlattenGroupsAccountsDetail[]) {
    const fixedArr = ['currentassets', 'fixedassets', 'noncurrentassets', 'indirectexpenses', 'operatingcost',
      'otherincome', 'revenuefromoperations', 'shareholdersfunds', 'currentliabilities', 'noncurrentliabilities'];
    return data.filter(da => {
      return !(fixedArr.indexOf(da.groupUniqueName) > -1);
    });
  }

  public flattenGroup(rawList: GroupsWithAccountsResponse[], groupUniqueName: string, category: any) {
    for (let raw of rawList) {
      if (raw.uniqueName === groupUniqueName) {
        return raw.category;
      }

      if (raw.groups) {
        let AccountOfCategory = this.flattenGroup(raw.groups, groupUniqueName, raw);
        if (AccountOfCategory) {
          return AccountOfCategory;
        }
      }
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
