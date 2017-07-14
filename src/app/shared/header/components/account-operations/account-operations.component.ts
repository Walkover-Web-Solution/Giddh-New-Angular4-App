import { AccountsAction } from '../../../../services/actions/accounts.actions';
import { Select2Component } from '../../../theme/select2/select2.component';
import { TaxResponse } from '../../../../models/api-models/Company';
import { CompanyActions } from '../../../../services/actions/company.actions';
import { Observable } from 'rxjs/Observable';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';
import {
  GroupCreateRequest,
  GroupResponse,
  GroupSharedWithResponse,
  GroupsTaxHierarchyResponse,
  MoveGroupRequest,
  ShareGroupRequest
} from '../../../../models/api-models/Group';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { Select2OptionData } from '../../../theme/select2/select2.interface';
import { ApplyTaxRequest } from '../../../../models/api-models/ApplyTax';
import {
  AccountMoveRequest,
  AccountResponse,
  AccountSharedWithResponse,
  AccountsTaxHierarchyResponse,
  ShareAccountRequest
} from '../../../../models/api-models/Account';
import { ModalDirective } from 'ngx-bootstrap';
import { uniqueNameValidator } from '../../../helpers/customValidationHelper';
import { ReplaySubject } from 'rxjs/ReplaySubject';

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
  public activeAccount$: Observable<AccountResponse>;
  public isTaxableAccount$: Observable<boolean>;
  public activeAccountSharedWith$: Observable<AccountSharedWithResponse[]>;
  public shareAccountForm: FormGroup;
  public moveAccountForm: FormGroup;
  public activeGroupSelected$: Observable<string[]>;
  @ViewChild('applyTaxSelect2') public applyTaxSelect2: Select2Component;
  @ViewChild('shareGroupModal') public shareGroupModal: ModalDirective;

  public activeGroupTaxHierarchy$: Observable<GroupsTaxHierarchyResponse>;
  public activeAccountTaxHierarchy$: Observable<AccountsTaxHierarchyResponse>;
  // tslint:disable-next-line:no-empty
  public showNewForm$: Observable<boolean>;
  public subGroupForm: FormGroup;
  public groupDetailForm: FormGroup;
  public moveGroupForm: FormGroup;
  public shareGroupForm: FormGroup;
  public taxGroupForm: FormGroup;
  public showGroupForm: boolean = false;
  public activeGroup$: Observable<GroupResponse>;
  public activeGroupInProgress$: Observable<boolean>;
  public isTaxableGroup$: Observable<boolean>;
  public activeGroupSharedWith$: Observable<GroupSharedWithResponse[]>;
  public groupList$: Observable<GroupsWithAccountsResponse[]>;
  public isRootLevelGroup: boolean = false;
  public companyTaxes$: Observable<TaxResponse[]>;
  public companyTaxDropDown: Observable<Select2OptionData[]>;
  public accountList: any[];
  public showEditTaxSection: boolean = false;

  public showAddAccountForm$: Observable<boolean>;
  public fetchingGrpUniqueName$: Observable<boolean>;
  public isGroupNameAvailable$: Observable<boolean>;

  public taxPopOverTemplate: string = `
  <div class="popover-content">
  <label>Tax being inherited from:</label>
    <ul>
    <li>@inTax.name</li>
    </ul>
  </div>
  `;
  public selectedTax: string[];
  public options: Select2Options = {
    minimumResultsForSearch: 9001,
    multiple: true,
    width: '100%',
    placeholder: 'Choose a project',
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
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction,
              private companyActions: CompanyActions, private accountsAction: AccountsAction) {
    this.showNewForm$ = this.store.select(state => state.groupwithaccounts.showAddNew).takeUntil(this.destroyed$);
    this.showAddNewAccount$ = this.store.select(state => state.groupwithaccounts.showAddNewAccount).takeUntil(this.destroyed$);
    this.showAddNewGroup$ = this.store.select(state => state.groupwithaccounts.showAddNewGroup).takeUntil(this.destroyed$);
    this.showEditAccount$ = this.store.select(state => state.groupwithaccounts.showEditAccount).takeUntil(this.destroyed$);
    this.showEditGroup$ = this.store.select(state => state.groupwithaccounts.showEditGroup).takeUntil(this.destroyed$);

    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup).takeUntil(this.destroyed$);
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
    this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount).takeUntil(this.destroyed$);
    this.fetchingGrpUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingGrpUniqueName).takeUntil(this.destroyed$);
    this.isGroupNameAvailable$ = this.store.select(state => state.groupwithaccounts.isGroupNameAvailable).takeUntil(this.destroyed$);
    this.companyTaxDropDown = this.store.select(state => {
      let arr: Select2OptionData[] = [];
      if (state.company.taxes) {
        if (state.groupwithaccounts.activeAccount) {
          if (state.groupwithaccounts.activeAccountTaxHierarchy) {
            return _.differenceBy(state.company.taxes.map(p => {
              return {text: p.name, id: p.uniqueName};
            }), _.flattenDeep(state.groupwithaccounts.activeAccountTaxHierarchy.inheritedTaxes.map(p => p.applicableTaxes)).map((p: any) => {
              return {text: p.name, id: p.uniqueName};
            }), 'id');
          } else {
            return state.company.taxes.map(p => {
              return {text: p.name, id: p.uniqueName};
            });
          }

        } else {
          if (state.groupwithaccounts.activeGroup && state.company.taxes && state.groupwithaccounts.activeGroupTaxHierarchy) {
            return _.differenceBy(state.company.taxes.map(p => {
              return {text: p.name, id: p.uniqueName};
            }), _.flattenDeep(state.groupwithaccounts.activeGroupTaxHierarchy.inheritedTaxes.map(p => p.applicableTaxes)).map((p: any) => {
              return {text: p.name, id: p.uniqueName};
            }), 'id');
          } else {
            return state.company.taxes.map(p => {
              return {text: p.name, id: p.uniqueName};
            });
          }
        }
      }
      return arr;
    }).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.groupDetailForm = this._fb.group({
      name: ['', Validators.required],
      uniqueName: ['', Validators.required],
      description: ['']
    });

    this.subGroupForm = this._fb.group({
      name: ['', Validators.required],
      uniqueName: ['', [Validators.required], uniqueNameValidator],
      desc: ['']
    });

    this.moveGroupForm = this._fb.group({
      moveto: ['', Validators.required]
    });

    this.shareGroupForm = this._fb.group({
      userEmail: ['', [Validators.required, Validators.email]]
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
        this.accountList = this.makeGroupListFlatwithLessDtl(this.flattenGroup(a, []));
      }
    });

    this.activeGroup$.subscribe((a) => {
      if (a) {
        this.isRootLevelGroupFunc(a.uniqueName);
        let showAddForm: boolean = null;
        this.showAddNewGroup$.take(1).subscribe((d) => showAddForm = d);
        if (!showAddForm) {
          this.showGroupForm = true;
          this.ShowForm.emit(true);
          this.showEditTaxSection = false;
          this.groupDetailForm.patchValue({name: a.name, uniqueName: a.uniqueName, description: a.description});
          this.store.dispatch(this.groupWithAccountsAction.showEditGroupForm());
        }
      }
    });

    this.activeAccount$.subscribe((a) => {
      if (a) {
        this.showEditTaxSection = false;
      }
    });

    this.fetchingGrpUniqueName$.subscribe(f => {
      if (f) {
        this.subGroupForm.controls['uniqueName'].disable();
      } else {
        this.subGroupForm.controls['uniqueName'].enable();
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
      let activeAccount: AccountResponse = null;
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
      let activeAccount: AccountResponse = null;
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

  public generateUniqueName() {
    let val: string = this.subGroupForm.controls['name'].value;
    val = val.replace(/[^a-zA-Z0-9]/g, '').toLocaleLowerCase();
    this.store.dispatch(this.groupWithAccountsAction.getGroupUniqueName(val));

    this.isGroupNameAvailable$.subscribe(a => {
      if (a !== null && a !== undefined) {
        if (a) {
          this.subGroupForm.patchValue({uniqueName: val});
        } else {
          let num = 1;
          this.subGroupForm.patchValue({uniqueName: val + num});
        }
      }
    });
  }

  public async addNewGroup() {
    let activeGrp = await this.activeGroup$.first().toPromise();
    let grpObject = new GroupCreateRequest();
    grpObject.parentGroupUniqueName = activeGrp.uniqueName;
    grpObject.description = this.subGroupForm.controls['desc'].value;
    grpObject.name = this.subGroupForm.controls['name'].value;
    grpObject.uniqueName = this.subGroupForm.controls['uniqueName'].value;

    this.store.dispatch(this.groupWithAccountsAction.createGroup(grpObject));
    this.subGroupForm.reset();
  }

  public async updateGroup() {
    let activeGroup = await this.activeGroup$.first().toPromise();
    this.store.dispatch(this.groupWithAccountsAction.updateGroup(this.groupDetailForm.value, activeGroup.uniqueName));
  }

  public async shareGroup() {
    let activeGrp = await this.activeGroup$.first().toPromise();

    let grpObject = new ShareGroupRequest();
    grpObject.role = 'view_only';
    grpObject.user = this.shareGroupForm.controls['userEmail'].value;
    this.store.dispatch(this.groupWithAccountsAction.shareGroup(grpObject, activeGrp.uniqueName));
    this.shareGroupForm.reset();
  }

  public async shareAccount() {
    let activeAcc = await this.activeAccount$.first().toPromise();
    let accObject = new ShareAccountRequest();
    accObject.role = 'view_only';
    accObject.user = this.shareAccountForm.controls['userEmail'].value;
    this.store.dispatch(this.accountsAction.shareAccount(accObject, activeAcc.uniqueName));
    this.shareAccountForm.reset();
  }

  public moveToGroupSelected(event: any) {
    this.moveGroupForm.patchValue({moveto: event.item.uniqueName});
  }

  public moveToAccountSelected(event: any) {
    this.moveAccountForm.patchValue({moveto: event.item.uniqueName});
  }

  public async moveGroup() {
    let activeGrp = await this.activeGroup$.first().toPromise();

    let grpObject = new MoveGroupRequest();
    grpObject.parentGroupUniqueName = this.moveGroupForm.controls['moveto'].value;
    this.store.dispatch(this.groupWithAccountsAction.moveGroup(grpObject, activeGrp.uniqueName));
    this.moveGroupForm.reset();
  }

  public async moveAccount() {
    let activeAcc = await this.activeAccount$.first().toPromise();

    let grpObject = new AccountMoveRequest();
    grpObject.uniqueName = this.moveAccountForm.controls['moveto'].value;
    this.store.dispatch(this.accountsAction.moveAccount(grpObject, activeAcc.uniqueName));
    this.moveAccountForm.reset();
  }

  public async unShareGroup(val) {
    let activeGrp = await this.activeGroup$.first().toPromise();

    this.store.dispatch(this.groupWithAccountsAction.unShareGroup(val, activeGrp.uniqueName));
  }

  public async unShareAccount(val) {
    let activeAcc = await this.activeAccount$.first().toPromise();
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

  public async taxHierarchy() {
    let activeAccount: AccountResponse = null;
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
    let activeAccount: AccountResponse = null;
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
      data.taxes.push(...(this.applyTaxSelect2.value as string[]));
      data.uniqueName = activeAccount.uniqueName;
      this.store.dispatch(this.accountsAction.applyAccountTax(data));
    } else {
      let data: ApplyTaxRequest = new ApplyTaxRequest();
      data.isAccount = false;
      data.taxes = [];
      this.activeGroupTaxHierarchy$.take(1).subscribe((t) => {
        if (t) {
          t.inheritedTaxes.forEach(tt => {
            tt.applicableTaxes.forEach(ttt => {
              data.taxes.push(ttt.uniqueName);
            });
          });
        }
      });
      data.taxes.push(...(this.applyTaxSelect2.value as string[]));
      data.uniqueName = activeGroup.uniqueName;
      this.store.dispatch(this.groupWithAccountsAction.applyGroupTax(data));
    }

  }

  public showShareGroupModal() {
    this.shareGroupModal.show();
  }

  public hideShareGroupModal() {
    this.shareGroupModal.hide();
  }

  public showAddGroupForm() {
    this.store.dispatch(this.groupWithAccountsAction.showAddGroupForm());
    this.groupDetailForm.reset();
  }

  public showAddAccountForm() {
    this.store.dispatch(this.groupWithAccountsAction.showAddAccountForm());
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
