import { AccountsAction } from '../../../../services/actions/accounts.actions';
import { Select2Component } from '../../../theme/select2/select2.component';
import { TaxResponse } from '../../../../models/api-models/Company';
import { CompanyActions } from '../../../../services/actions/company.actions';
import { Observable } from 'rxjs/Observable';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';
import {
  GroupResponse,
  GroupSharedWithResponse,
  GroupsTaxHierarchyResponse
} from '../../../../models/api-models/Group';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { Select2OptionData } from '../../../theme/select2/select2.interface';
import { ApplyTaxRequest } from '../../../../models/api-models/ApplyTax';
import {
  AccountMergeRequest,
  AccountMoveRequest,
  AccountRequest, AccountRequestV2,
  AccountResponse,
  AccountSharedWithResponse,
  AccountsTaxHierarchyResponse,
  AccountUnMergeRequest,
  ShareAccountRequest,
  AccountResponseV2
} from '../../../../models/api-models/Account';
import { ModalDirective } from 'ngx-bootstrap';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { GroupAccountSidebarVM } from '../new-group-account-sidebar/VM';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist';
import { IAccountsInfo } from '../../../../models/interfaces/accountInfo.interface';
import { ToasterService } from '../../../../services/toaster.service';
import { AccountService } from '../../../../services/account.service';

@Component({
  selector: 'account-operations',
  templateUrl: './account-operations.component.html'
})
export class AccountOperationsComponent implements OnInit, AfterViewInit, OnDestroy {
  public showAddNewAccount$: Observable<boolean>;
  public showAddNewGroup$: Observable<boolean>;
  public showEditAccount$: Observable<boolean>;
  public showEditGroup$: Observable<boolean>;
  @Output() public ShowForm: EventEmitter<boolean> = new EventEmitter(false);
  @Input() public columnsRef: GroupAccountSidebarVM;
  @Input() public height: number;
  public activeAccount$: Observable<AccountResponseV2>;
  public isTaxableAccount$: Observable<boolean>;
  public activeAccountSharedWith$: Observable<AccountSharedWithResponse[]>;
  public shareAccountForm: FormGroup;
  public moveAccountForm: FormGroup;
  public activeGroupSelected$: Observable<string[]>;
  public config: PerfectScrollbarConfigInterface = { suppressScrollX: true, suppressScrollY: false };
  @ViewChild('applyTaxSelect2') public applyTaxSelect2: Select2Component;
  @ViewChild('shareGroupModal') public shareGroupModal: ModalDirective;
  @ViewChild('shareAccountModal') public shareAccountModal: ModalDirective;
  @ViewChild('deleteMergedAccountModal') public deleteMergedAccountModal: ModalDirective;
  @ViewChild('moveMergedAccountModal') public moveMergedAccountModal: ModalDirective;
  @ViewChild('accountSelect2') public accountSelect2: Select2Component;
  @ViewChild('accountForMoveSelect2') public accountForMoveSelect2: Select2Component;
  @ViewChild('deleteAccountModal') public deleteAccountModal: ModalDirective;
  @Input() public breadcrumbPath: string[] = [];
  public activeGroupTaxHierarchy$: Observable<GroupsTaxHierarchyResponse>;
  public activeAccountTaxHierarchy$: Observable<AccountsTaxHierarchyResponse>;
  public selectedaccountForMerge: any = [];
  public selectedAccountForDelete: string;
  public selectedAccountForMove: string;
  public setAccountForMove: string;
  public deleteMergedAccountModalBody: string;
  public moveMergedAccountModalBody: string;

  // tslint:disable-next-line:no-empty
  public showNewForm$: Observable<boolean>;
  public groupDetailForm: FormGroup;
  public taxGroupForm: FormGroup;
  public showGroupForm: boolean = false;
  public activeGroup$: Observable<GroupResponse>;
  public activeGroupUniqueName$: Observable<string>;
  public activeGroupInProgress$: Observable<boolean>;
  public isTaxableGroup$: Observable<boolean>;
  public activeGroupSharedWith$: Observable<GroupSharedWithResponse[]>;
  public groupList$: Observable<GroupsWithAccountsResponse[]>;
  public isRootLevelGroup: boolean = false;
  public companyTaxes$: Observable<TaxResponse[]>;
  public companyTaxDropDown: Observable<Select2OptionData[]>;
  public groupsList: any[];
  public showEditTaxSection: boolean = false;
  public accounts$: Observable<Select2OptionData[]>;
  public accountOptions: Select2Options = {
    multiple: true,
    width: '100%',
    placeholder: 'Select Accounts',
    allowClear: true
  };
  public accountOptions2: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select Accounts',
    allowClear: true
  };
  public showAddAccountForm$: Observable<boolean>;
  public fetchingGrpUniqueName$: Observable<boolean>;
  public isGroupNameAvailable$: Observable<boolean>;
  public fetchingAccUniqueName$: Observable<boolean>;
  public isAccountNameAvailable$: Observable<boolean>;
  public createAccountInProcess$: Observable<boolean>;
  public createAccountIsSuccess$: Observable<boolean>;
  public updateAccountInProcess$: Observable<boolean>;
  public updateAccountIsSuccess$: Observable<boolean>;
  public taxPopOverTemplate: string = `
  <div class="popover-content">
  <label>Tax being inherited from:</label>
    <ul>
    <li>@inTax.name</li>
    </ul>
  </div>
  `;
  public options: Select2Options = {
    minimumResultsForSearch: 9001,
    multiple: true,
    width: '100%',
    placeholder: 'Select Taxes',
    templateResult: (data) => {
      if (!data.id) {
        return data.text;
      }
      // let text = this._translate.instant(data.text);
      return $('<span>' + data.text + '</span>');
    },
    templateSelection: (data) => {

      if (!data.id) {
        return data.text;
      }
      // let text = this._translate.instant(data.text);
      return $('<span>' + data.text + '</span>');
    }
  };
  public moveAccountSuccess$: Observable<boolean>;
  public showDeleteMove: boolean = false;
  public isGstEnabledAcc: boolean = false;
  public isHsnSacEnabledAcc: boolean = false;
  public showTaxes: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction,
    private companyActions: CompanyActions, private accountsAction: AccountsAction, private _toaster: ToasterService,
    private accountService: AccountService) {
    this.showNewForm$ = this.store.select(state => state.groupwithaccounts.showAddNew);
    this.showAddNewAccount$ = this.store.select(state => state.groupwithaccounts.showAddNewAccount).takeUntil(this.destroyed$);
    this.showAddNewGroup$ = this.store.select(state => state.groupwithaccounts.showAddNewGroup).takeUntil(this.destroyed$);
    this.showEditAccount$ = this.store.select(state => state.groupwithaccounts.showEditAccount).takeUntil(this.destroyed$);
    this.showEditGroup$ = this.store.select(state => state.groupwithaccounts.showEditGroup).takeUntil(this.destroyed$);
    this.moveAccountSuccess$ = this.store.select(state => state.groupwithaccounts.moveAccountSuccess).takeUntil(this.destroyed$);

    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup).takeUntil(this.destroyed$);
    this.activeGroupUniqueName$ = this.store.select(state => state.groupwithaccounts.activeGroupUniqueName).takeUntil(this.destroyed$);
    this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount).takeUntil(this.destroyed$);
    this.activeGroupSelected$ = this.store.select(state => {
      if (state.groupwithaccounts.activeAccount) {
        if (state.groupwithaccounts.activeAccountTaxHierarchy) {
          return _.difference(state.groupwithaccounts.activeAccountTaxHierarchy.applicableTaxes.map(p => p.uniqueName), state.groupwithaccounts.activeAccountTaxHierarchy.inheritedTaxes.map(p => p.uniqueName));
        }
      } else {
        if (state.groupwithaccounts.activeGroupTaxHierarchy) {
          return _.difference(state.groupwithaccounts.activeGroupTaxHierarchy.applicableTaxes.map(p => p.uniqueName), state.groupwithaccounts.activeGroupTaxHierarchy.inheritedTaxes.map(p => p.uniqueName));
        }
      }

      return [];
    }).takeUntil(this.destroyed$);
    this.activeGroupInProgress$ = this.store.select(state => state.groupwithaccounts.activeGroupInProgress).takeUntil(this.destroyed$);
    this.activeGroupSharedWith$ = this.store.select(state => state.groupwithaccounts.activeGroupSharedWith).takeUntil(this.destroyed$);
    this.activeAccountSharedWith$ = this.store.select(state => state.groupwithaccounts.activeAccountSharedWith).takeUntil(this.destroyed$);
    this.groupList$ = this.store.select(state => state.groupwithaccounts.groupswithaccounts).takeUntil(this.destroyed$);
    this.activeGroupTaxHierarchy$ = this.store.select(state => state.groupwithaccounts.activeGroupTaxHierarchy).takeUntil(this.destroyed$);
    this.activeAccountTaxHierarchy$ = this.store.select(state => state.groupwithaccounts.activeAccountTaxHierarchy).takeUntil(this.destroyed$);
    this.companyTaxes$ = this.store.select(state => state.company.taxes).takeUntil(this.destroyed$);
    this.showAddAccountForm$ = this.store.select(state => state.groupwithaccounts.addAccountOpen).takeUntil(this.destroyed$);
    this.fetchingGrpUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingGrpUniqueName).takeUntil(this.destroyed$);
    this.isGroupNameAvailable$ = this.store.select(state => state.groupwithaccounts.isGroupNameAvailable).takeUntil(this.destroyed$);
    this.companyTaxDropDown = this.store.select(state => {
      let arr: Select2OptionData[] = [];
      if (state.company.taxes) {
        if (state.groupwithaccounts.activeAccount) {
          if (state.groupwithaccounts.activeAccountTaxHierarchy) {
            return _.differenceBy(state.company.taxes.map(p => {
              return { text: p.name, id: p.uniqueName };
            }), _.flattenDeep(state.groupwithaccounts.activeAccountTaxHierarchy.inheritedTaxes.map(p => p.applicableTaxes)).map((p: any) => {
              return { text: p.name, id: p.uniqueName };
            }), 'id');
          } else {
            return state.company.taxes.map(p => {
              return { text: p.name, id: p.uniqueName };
            });
          }

        } else {
          if (state.groupwithaccounts.activeGroup && state.company.taxes && state.groupwithaccounts.activeGroupTaxHierarchy) {
            return _.differenceBy(state.company.taxes.map(p => {
              return { text: p.name, id: p.uniqueName };
            }), _.flattenDeep(state.groupwithaccounts.activeGroupTaxHierarchy.inheritedTaxes.map(p => p.applicableTaxes)).map((p: any) => {
              return { text: p.name, id: p.uniqueName };
            }), 'id');
          } else {
            return state.company.taxes.map(p => {
              return { text: p.name, id: p.uniqueName };
            });
          }
        }
      }
      return arr;
    }).takeUntil(this.destroyed$);

    // account-add component's property
    this.fetchingAccUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingAccUniqueName).takeUntil(this.destroyed$);
    this.isAccountNameAvailable$ = this.store.select(state => state.groupwithaccounts.isAccountNameAvailable).takeUntil(this.destroyed$);
    this.createAccountInProcess$ = this.store.select(state => state.groupwithaccounts.createAccountInProcess).takeUntil(this.destroyed$);
    this.createAccountIsSuccess$ = this.store.select(state => state.groupwithaccounts.createAccountIsSuccess).takeUntil(this.destroyed$);
    this.updateAccountInProcess$ = this.store.select(state => state.groupwithaccounts.updateAccountInProcess).takeUntil(this.destroyed$);
    this.updateAccountIsSuccess$ = this.store.select(state => state.groupwithaccounts.updateAccountIsSuccess).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.groupDetailForm = this._fb.group({
      name: ['', Validators.required],
      uniqueName: ['', Validators.required],
      description: ['']
    });

    this.taxGroupForm = this._fb.group({
      taxes: ['']
    });

    this.moveAccountForm = this._fb.group({
      moveto: ['', Validators.required]
    });

    this.shareAccountForm = this._fb.group({
      userEmail: ['', [Validators.required, Validators.email]]
    });

    this.groupList$.subscribe((a) => {
      if (a) {
        this.groupsList = this.makeGroupListFlatwithLessDtl(this.flattenGroup(a, []));
      }
    });

    this.activeGroup$.subscribe((a) => {
      if (a) {
        let showAddForm: boolean = null;
        this.showAddNewGroup$.take(1).subscribe((d) => showAddForm = d);
        if (!showAddForm) {
          this.showGroupForm = true;
          this.ShowForm.emit(true);
          this.showEditTaxSection = false;
          this.groupDetailForm.patchValue({ name: a.name, uniqueName: a.uniqueName, description: a.description });
          this.store.dispatch(this.groupWithAccountsAction.showEditGroupForm());
        }
        if (this.columnsRef) {
          if (this.columnsRef.columns[1]) {
            let col = this.columnsRef.columns[1].uniqueName;
            this.isHsnSacEnabledAcc = col === 'revenuefromoperations' || col === 'otherincome' || col === 'operatingcost' || col === 'indirectexpenses';
            this.isGstEnabledAcc = !this.isHsnSacEnabledAcc;
          }
        }
      }
    });

    this.activeGroupUniqueName$.subscribe((a) => {
      if (a) {
        this.isRootLevelGroupFunc(a);
      }
    });

    this.activeAccount$.subscribe((a) => {
      if (a) {
        this.showEditTaxSection = false;
        if (a.parentGroups[0].uniqueName) {
          let col = a.parentGroups[0].uniqueName;
          this.isHsnSacEnabledAcc = col === 'revenuefromoperations' || col === 'otherincome' || col === 'operatingcost' || col === 'indirectexpenses';
          this.isGstEnabledAcc = !this.isHsnSacEnabledAcc;
        }
      }
    });

    this.showNewForm$.subscribe(s => {
      if (s) {
        // console.log(this.columnsRef);
      }
    });

    this.moveAccountSuccess$.subscribe(p => {
      if (p) {
        this.moveAccountForm.reset();
      }
    });
  }

  public ngAfterViewInit() {
    this.isTaxableGroup$ = this.store.select(state => {
      let result: boolean = false;
      if (state.groupwithaccounts.groupswithaccounts && state.groupwithaccounts.activeGroup) {
        if (state.groupwithaccounts.activeAccount) {
          return false;
        }
        result = this.getAccountFromGroup(state.groupwithaccounts.groupswithaccounts, state.groupwithaccounts.activeGroup.uniqueName, false);
      } else {
        result = false;
      }
      return result;
    });
    this.isTaxableAccount$ = this.store.select(state => {
      let result: boolean = false;
      if (state.groupwithaccounts.groupswithaccounts && state.groupwithaccounts.activeGroup && state.groupwithaccounts.activeAccount) {
        result = this.getAccountFromGroup(state.groupwithaccounts.groupswithaccounts, state.groupwithaccounts.activeGroup.uniqueName, false);
      } else {
        result = false;
      }
      return result;
    });
    this.activeGroupSelected$.subscribe(() => {
      if (this.applyTaxSelect2) {
        this.applyTaxSelect2.cd.detectChanges();
      }
    });
    this.activeAccountTaxHierarchy$.subscribe((a) => {
      let activeAccount: AccountResponseV2 = null;
      this.store.take(1).subscribe(s => {
        if (s.groupwithaccounts) {
          activeAccount = s.groupwithaccounts.activeAccount;
        }
      });
      if (activeAccount) {
        if (a) {
          this.showEditTaxSection = true;
        }
      }
    });

    this.activeGroupTaxHierarchy$.subscribe((a) => {
      let activeAccount: AccountResponseV2 = null;
      let activeGroup: GroupResponse = null;
      this.store.take(1).subscribe(s => {
        if (s.groupwithaccounts) {
          activeGroup = s.groupwithaccounts.activeGroup;
          activeAccount = s.groupwithaccounts.activeAccount;
        }
      });
      if (activeGroup && !activeAccount) {
        if (a) {
          this.showEditTaxSection = true;
        }
      }
    });
  }

  public loadAccountData() {
    if (this.accounts$) {
      this.accounts$.isEmpty().subscribe(bool => {
        if (!bool) {
          this.accountService.GetFlattenAccounts().subscribe(a => {
            let accounts: Select2OptionData[] = [];
            if (a.status === 'success') {
              a.body.results.map(acc => {
                accounts.push({ text: `${acc.name} (${acc.uniqueName})`, id: acc.uniqueName });
              });
            }
            this.accounts$ = Observable.of(accounts);
          });
        }
      });
    } else {
      this.accountService.GetFlattenAccounts().subscribe(a => {
        let accounts: Select2OptionData[] = [];
        if (a.status === 'success') {
          a.body.results.map(acc => {
            accounts.push({ text: `${acc.name} (${acc.uniqueName})`, id: acc.uniqueName });
          });
        }
        this.accounts$ = Observable.of(accounts);
      });
    }
  }

  public shareAccount() {
    let activeAcc;
    this.activeAccount$.take(1).subscribe(p => activeAcc = p);
    let accObject = new ShareAccountRequest();
    accObject.role = 'view_only';
    accObject.user = this.shareAccountForm.controls['userEmail'].value;
    let obj = { emailId: accObject.user, entity: 'account', entityUniqueName: activeAcc.uniqueName };
    this.store.dispatch(this.accountsAction.shareEntity(obj, 'VW'));
    this.shareAccountForm.reset();
  }

  public moveToAccountSelected(event: any) {
    this.moveAccountForm.patchValue({ moveto: event.item.uniqueName });
  }

  public moveAccount() {
    let activeAcc;
    this.activeAccount$.take(1).subscribe(p => activeAcc = p);

    let grpObject = new AccountMoveRequest();
    grpObject.uniqueName = this.moveAccountForm.controls['moveto'].value;
    this.store.dispatch(this.accountsAction.moveAccount(grpObject, activeAcc.uniqueName));
  }

  public unShareGroup(val) {
    let activeGrp;
    this.activeGroup$.take(1).subscribe(p => activeGrp = p);

    this.store.dispatch(this.groupWithAccountsAction.unShareGroup(val, activeGrp.uniqueName));
  }

  public unShareAccount(val) {
    let activeAcc;
    this.activeAccount$.take(1).subscribe(p => activeAcc = p);
    this.store.dispatch(this.accountsAction.unShareAccount(val, activeAcc.uniqueName));
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
      listItem = Object.assign({}, listItem, { parentGroups: [] });
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

  public isRootLevelGroupFunc(uniqueName: string) {
    this.groupList$.take(1).subscribe(list => {
      for (let grp of list) {
        if (grp.uniqueName === uniqueName) {
          this.isRootLevelGroup = true;
          return;
        } else {
          this.isRootLevelGroup = false;
        }
      }
    });
  }

  public flattenAccounts(groups: GroupsWithAccountsResponse[] = [], accounts: IAccountsInfo[]): IAccountsInfo[] {
    _.each(groups, grp => {
      accounts.push(...grp.accounts);
      if (grp.groups) {
        this.flattenAccounts(grp.groups, accounts);
      }
    });
    return accounts;
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

  public taxHierarchy() {
    let activeAccount: AccountResponseV2 = null;
    let activeGroup: GroupResponse = null;
    this.store.take(1).subscribe(s => {
      if (s.groupwithaccounts) {
        activeAccount = s.groupwithaccounts.activeAccount;
        activeGroup = s.groupwithaccounts.activeGroup;
      }
    });
    if (activeAccount) {
      //
      this.store.dispatch(this.companyActions.getTax());
      this.store.dispatch(this.accountsAction.getTaxHierarchy(activeAccount.uniqueName));
    } else {
      this.store.dispatch(this.companyActions.getTax());
      this.store.dispatch(this.groupWithAccountsAction.getTaxHierarchy(activeGroup.uniqueName));
      // this.showEditTaxSection = true;
    }

  }

  public getAccountFromGroup(groupList: IGroupsWithAccounts[], uniqueName: string, result: boolean): boolean {
    groupList.forEach(el => {
      if (el.accounts) {
        if (el.uniqueName === uniqueName && (el.category === 'income' || el.category === 'expenses')) {
          result = true;
          return;
        }
      }
      if (el.groups) {
        result = this.getAccountFromGroup(el.groups, uniqueName, result);
      }
    });
    return result;
  }

  public applyTax() {
    let activeAccount: AccountResponseV2 = null;
    let activeGroup: GroupResponse = null;
    this.store.take(1).subscribe(s => {
      if (s.groupwithaccounts) {
        activeAccount = s.groupwithaccounts.activeAccount;
        activeGroup = s.groupwithaccounts.activeGroup;
      }
    });
    if (activeAccount) {
      let data: ApplyTaxRequest = new ApplyTaxRequest();
      data.isAccount = true;
      data.taxes = [];
      this.activeAccountTaxHierarchy$.take(1).subscribe((t) => {
        if (t) {
          t.inheritedTaxes.forEach(tt => {
            tt.applicableTaxes.forEach(ttt => {
              data.taxes.push(ttt.uniqueName);
            });
          });
        }
      });
      let a = [];
      // console.log(data);
      if (this.applyTaxSelect2.value && Array.isArray(this.applyTaxSelect2.value)) {
        data.taxes.push(...(this.applyTaxSelect2.value as string[]));
      }
      data.uniqueName = activeAccount.uniqueName;
      this.store.dispatch(this.accountsAction.applyAccountTax(data));
    } else {
      // let data: ApplyTaxRequest = new ApplyTaxRequest();
      // data.isAccount = false;
      // data.taxes = [];
      // this.activeGroupTaxHierarchy$.take(1).subscribe((t) => {
      //   if (t) {
      //     t.inheritedTaxes.forEach(tt => {
      //       tt.applicableTaxes.forEach(ttt => {
      //         data.taxes.push(ttt.uniqueName);
      //       });
      //     });
      //   }
      // });
      // data.taxes.push(...(this.applyTaxSelect2.value as string[]));
      // data.uniqueName = activeGroup.uniqueName;
      // this.store.dispatch(this.groupWithAccountsAction.applyGroupTax(data));
    }

  }

  public showShareGroupModal() {
    this.shareGroupModal.show();
  }

  public hideShareGroupModal() {
    this.shareGroupModal.hide();
  }

  public showShareAccountModal() {
    this.shareAccountModal.show();
  }

  public hideShareAccountModal() {
    this.shareAccountModal.hide();
  }

  public showAddGroupForm() {
    this.store.dispatch(this.groupWithAccountsAction.showAddGroupForm());
    this.groupDetailForm.reset();
  }

  public showAddAccountForm() {
    this.store.dispatch(this.groupWithAccountsAction.showAddAccountForm());
  }

  public showDeleteMergedAccountModal(merge: string) {
    merge = merge.trim();
    this.deleteMergedAccountModalBody = `Are you sure you want to delete ${merge} Account ?`;
    this.selectedAccountForDelete = merge;
    this.deleteMergedAccountModal.show();
  }

  public hideDeleteMergedAccountModal() {
    this.deleteMergedAccountModal.hide();
  }

  public deleteMergedAccount() {
    let activeAccount: AccountResponseV2 = null;
    this.activeAccount$.take(1).subscribe(p => activeAccount = p);
    let obj = new AccountUnMergeRequest();
    obj.uniqueNames = [this.selectedAccountForDelete];
    this.store.dispatch(this.accountsAction.unmergeAccount(activeAccount.uniqueName, obj));
    this.showDeleteMove = false;
    this.hideDeleteMergedAccountModal();
  }

  public selectAccount(v: any) {
    if (v.value) {
      if (v.value instanceof Array) {
        let accounts = [];
        v.value.map(a => {
          accounts.push(a);
        });
        this.selectedaccountForMerge = accounts;
      }
    } else {
      this.selectedaccountForMerge = '';
    }
  }

  public setAccountForMoveFunc(v: string) {
    this.setAccountForMove = v;
    this.showDeleteMove = true;
  }

  public selectAccountForMove(v: any) {
    if (v.value) {
      this.selectedAccountForMove = v.value;
    } else {
      this.selectedAccountForMove = '';
    }
  }

  public mergeAccounts() {
    let activeAccount: AccountResponseV2 = null;
    this.activeAccount$.take(1).subscribe(p => activeAccount = p);
    let finalData: AccountMergeRequest[] = [];
    if (this.selectedaccountForMerge.length) {
      this.selectedaccountForMerge.map((acc) => {
        let obj = new AccountMergeRequest();
        obj.uniqueName = acc;
        finalData.push(obj);
      });
      this.store.dispatch(this.accountsAction.mergeAccount(activeAccount.uniqueName, finalData));
      this.selectedaccountForMerge = '';
      this.accountSelect2.setElementValue('');
      this.showDeleteMove = false;
    } else {
      this._toaster.errorToast('Please Select at least one account');
      return;
    }
  }

  public showMoveMergedAccountModal() {
    this.moveMergedAccountModalBody = `Are you sure you want to move ${this.setAccountForMove} Account to ${this.selectedAccountForMove} ?`;
    this.moveMergedAccountModal.show();
  }

  public hideMoveMergedAccountModal() {
    this.moveMergedAccountModal.hide();
  }

  public moveMergeAccountTo() {
    let activeAccount: AccountResponseV2 = null;
    this.activeAccount$.take(1).subscribe(p => activeAccount = p);
    let obj = new AccountUnMergeRequest();
    obj.uniqueNames = [this.setAccountForMove];
    obj.moveTo = this.selectedAccountForMove;
    this.store.dispatch(this.accountsAction.unmergeAccount(activeAccount.uniqueName, obj));
    this.showDeleteMove = false;
    this.hideDeleteMergedAccountModal();
    this.accountForMoveSelect2.setElementValue('');
    this.hideMoveMergedAccountModal();
  }

  public addNewAccount(accRequestObject: { activeGroupUniqueName: string, accountRequest: AccountRequestV2 }) {
    this.store.dispatch(this.accountsAction.createAccountV2(accRequestObject.activeGroupUniqueName, accRequestObject.accountRequest));
  }

  public updateAccount(accRequestObject: { value: { groupUniqueName: string, accountUniqueName: string }, accountRequest: AccountRequestV2 }) {
    this.store.dispatch(this.accountsAction.updateAccountV2(accRequestObject.value, accRequestObject.accountRequest));
  }

  public showDeleteAccountModal() {
    this.deleteAccountModal.show();
  }
  public hideDeleteAccountModal() {
    this.deleteAccountModal.hide();
  }
  public deleteAccount() {
    let activeAccUniqueName = null;
    this.activeAccount$.take(1).subscribe(s => activeAccUniqueName = s.uniqueName);
    this.store.dispatch(this.accountsAction.deleteAccount(activeAccUniqueName));
    this.hideDeleteAccountModal();
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
