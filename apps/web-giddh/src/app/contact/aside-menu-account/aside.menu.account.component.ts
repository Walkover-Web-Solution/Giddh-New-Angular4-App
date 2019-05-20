import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { AccountRequestV2, AccountResponseV2 } from '../../models/api-models/Account';
import { AccountsAction } from '../../actions/accounts.actions';
import { GroupService } from '../../services/group.service';
import { IOption } from '../../theme/ng-select/option.interface';
import { GroupResponse } from '../../models/api-models/Group';
import { ModalDirective } from 'ngx-bootstrap';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';

const GROUP = ['revenuefromoperations', 'otherincome', 'operatingcost', 'indirectexpenses'];

@Component({
  selector: 'aside-menu-account',
  styles: [`
    :host {
      position: fixed;
      left: auto;
      top: 0;
      right: 0;
      bottom: 0;
      width: 480px;
      z-index: 1045;
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
      width: 480px;
    }
  `],
  templateUrl: './aside.menu.account.component.html'
})
export class AsideMenuAccountInContactComponent implements OnInit, OnDestroy {

  @Input() public activeGroupUniqueName: string;
  @Input() public isUpdateAccount: boolean;
  @Input() public activeAccountDetails: any;

  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Output() public getUpdateList: EventEmitter<string> = new EventEmitter();
  @ViewChild('deleteAccountModal') public deleteAccountModal: ModalDirective;

  public flatAccountWGroupsList$: Observable<IOption[]>;
  public select2Options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select Group',
    allowClear: true
  };
  public isGstEnabledAcc: boolean = true;
  public isHsnSacEnabledAcc: boolean = false;
  public fetchingAccUniqueName$: Observable<boolean>;
  public isAccountNameAvailable$: Observable<boolean>;
  public createAccountInProcess$: Observable<boolean>;
// update acc
  public activeAccount$: Observable<AccountResponseV2>;
  public isDebtorCreditor: boolean = false;
  public activeGroup$: Observable<GroupResponse>;
  public groupsList: IOption[];
  private groupsListBackUp: IOption[];
  public showGroupLedgerExportButton$: Observable<boolean>;
  public virtualAccountEnable$: Observable<any>;
  public showVirtualAccount: boolean = false;
  public showBankDetail: boolean = false;
    public updateAccountInProcess$: Observable<boolean>;
  public updateAccountIsSuccess$: Observable<boolean>;
  public groupList$: Observable<GroupsWithAccountsResponse[]>;
  public accountDetails: any='';


public breadcrumbUniquePath: string[] = [];








  // private below
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private groups = [
    {label: 'Sundry Debtors', value: 'sundrydebtors'},
    {label: 'Sundry Creditors', value: 'sundrycreditors'},
    {label: 'Discount', value: 'discount'},
  ];

  constructor(
    private store: Store<AppState>,
    private groupService: GroupService,
    private accountsAction: AccountsAction,
    private _groupWithAccountsAction: GroupWithAccountsAction,

  ) {
    // account-add component's property
    this.fetchingAccUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingAccUniqueName).pipe(takeUntil(this.destroyed$));
    this.isAccountNameAvailable$ = this.store.select(state => state.groupwithaccounts.isAccountNameAvailable).pipe(takeUntil(this.destroyed$));
    this.createAccountInProcess$ = this.store.select(state => state.groupwithaccounts.createAccountInProcess).pipe(takeUntil(this.destroyed$));

    this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount).pipe(takeUntil(this.destroyed$));
    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup).pipe(takeUntil(this.destroyed$));
    this.virtualAccountEnable$ = this.store.select(state => state.invoice.settings).pipe(takeUntil(this.destroyed$));
    this.updateAccountInProcess$ = this.store.select(state => state.groupwithaccounts.updateAccountInProcess).pipe(takeUntil(this.destroyed$));
    this.updateAccountIsSuccess$ = this.store.select(state => state.groupwithaccounts.updateAccountIsSuccess).pipe(takeUntil(this.destroyed$));
    this.groupList$ = this.store.select(state => state.general.groupswithaccounts).pipe(takeUntil(this.destroyed$));


  }

  public ngOnInit() {
    this.isGstEnabledAcc = this.activeGroupUniqueName !== 'discount';
    this.isHsnSacEnabledAcc = !this.isGstEnabledAcc;
    this.flatAccountWGroupsList$ = observableOf(this.groups);
    console.log('activeAccountDetails', this.activeAccountDetails, this.isUpdateAccount);
if(this.isUpdateAccount && this.activeAccountDetails) {
  this.accountDetails = this.activeAccountDetails;
    this.store.dispatch(this._groupWithAccountsAction.getGroupWithAccounts(this.activeAccountDetails.name));
    this.store.dispatch(this.accountsAction.getAccountDetails(this.activeAccountDetails.uniqueName));
}
      this.activeAccount$.subscribe(a => {
      if (a && a.parentGroups[0].uniqueName) {
        let col = a.parentGroups[0].uniqueName;
        this.isHsnSacEnabledAcc = col === 'revenuefromoperations' || col === 'otherincome' || col === 'operatingcost' || col === 'indirectexpenses';
        this.isGstEnabledAcc = !this.isHsnSacEnabledAcc;
      }
    });
        this.groupList$.subscribe((a) => {
      if (a) {
        // this.groupsList = this.makeGroupListFlatwithLessDtl(this.flattenGroup(a, []));
        let grpsList = this.makeGroupListFlatwithLessDtl(this.flattenGroup(a, []));
        let flattenGroupsList: IOption[] = [];

        grpsList.forEach(grp => {
          flattenGroupsList.push({label: grp.name, value: grp.uniqueName});
        });
        this.groupsList = flattenGroupsList;
        this.groupsListBackUp = flattenGroupsList;
      }
    });

      this.activeGroup$.subscribe((a) => {
      if (a) {
        this.groupsList = _.filter(this.groupsListBackUp, (l => l.value !== a.uniqueName));
        if (a.uniqueName === 'sundrycreditors' || a.uniqueName === 'sundrydebtors') {
          this.showGroupLedgerExportButton$ = observableOf(true);
          this.isDebtorCreditor = true;
        } else {
          this.showGroupLedgerExportButton$ = observableOf(false);
          this.isDebtorCreditor = false;
        }
        // this.taxGroupForm.get('taxes').reset();
        // let showAddForm: boolean = null;
        // this.showAddNewGroup$.take(1).subscribe((d) => showAddForm = d);
        // if (!showAddForm) {
        //   this.showGroupForm = true;
        //   this.ShowForm.emit(true);
        //   this.groupDetailForm.patchValue({name: a.name, uniqueName: a.uniqueName, description: a.description});
        //
        //   let taxes = a.applicableTaxes.map(acc => acc.uniqueName);
        //   this.taxGroupForm.get('taxes').setValue(taxes);
        //   this.store.dispatch(this.groupWithAccountsAction.showEditGroupForm());
        // }

        this.virtualAccountEnable$.subscribe(s => {
          if (s && s.companyCashFreeSettings && s.companyCashFreeSettings.autoCreateVirtualAccountsForDebtors && this.breadcrumbUniquePath[1] === 'sundrydebtors') {
            this.showVirtualAccount = true;
          } else {
            this.showVirtualAccount = false;
          }
        });

        if (this.breadcrumbUniquePath) {
          if (this.breadcrumbUniquePath[0]) {
            let col = this.breadcrumbUniquePath[0];
            this.isHsnSacEnabledAcc = col === 'revenuefromoperations' || col === 'otherincome' || col === 'operatingcost' || col === 'indirectexpenses';
            this.isGstEnabledAcc = !this.isHsnSacEnabledAcc;
          }
          if (this.breadcrumbUniquePath[1]) {
            let col = this.breadcrumbUniquePath[1];
            if (col === 'sundrycreditors') {
              this.showBankDetail = true;
            } else {
              this.showBankDetail = false;
            }
          }
        }
      }
    });
  }

  public addNewAcSubmit(accRequestObject: { activeGroupUniqueName: string, accountRequest: AccountRequestV2 }) {
    this.store.dispatch(this.accountsAction.createAccountV2(accRequestObject.activeGroupUniqueName, accRequestObject.accountRequest));
  }

  public closeAsidePane(event) {
    this.ngOnDestroy();
    this.closeAsideEvent.emit(event);
  }
   public showDeleteAccountModal() {
    this.deleteAccountModal.show();
  }

  public hideDeleteAccountModal() {
    this.deleteAccountModal.hide();
  }

  public deleteAccount() {
   // debugger;
    let activeAccUniqueName = null;
    this.activeAccount$.pipe(take(1)).subscribe(s => activeAccUniqueName = s.uniqueName);

    let activeGrpName = this.activeGroupUniqueName;

    this.store.dispatch(this.accountsAction.deleteAccount(activeAccUniqueName, activeGrpName));
    this.hideDeleteAccountModal();
   this.getUpdateList.emit(activeGrpName);

  }
 public updateAccount(accRequestObject: { value: { groupUniqueName: string, accountUniqueName: string }, accountRequest: AccountRequestV2 }) {
    this.store.dispatch(this.accountsAction.updateAccountV2(accRequestObject.value, accRequestObject.accountRequest));
    this.hideDeleteAccountModal();
   this.getUpdateList.emit(this.activeGroupUniqueName);
  }
   public makeGroupListFlatwithLessDtl(rawList: any) {
    let obj;
    obj = _.map(rawList, (item: any) => {
      obj = {};
      obj.name = item.name;
      obj.uniqueName = item.uniqueName;
      obj.synonyms = item.synonyms;
      obj.parentGroups = item.parentGroups;
      return obj;
    });
    return obj;
  }
    public flattenGroup(rawList: any[], parents: any[] = []) {
    let listofUN;
    listofUN = _.map(rawList, (listItem) => {
      let newParents;
      let result;
      newParents = _.union([], parents);
      newParents.push({
        name: listItem.name,
        uniqueName: listItem.uniqueName
      });
      listItem = Object.assign({}, listItem, {parentGroups: []});
      listItem.parentGroups = newParents;
      if (listItem.groups.length > 0) {
        result = this.flattenGroup(listItem.groups, newParents);
        result.push(_.omit(listItem, 'groups'));
      } else {
        result = _.omit(listItem, 'groups');
      }
      return result;
    });
    return _.flatten(listofUN);
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
