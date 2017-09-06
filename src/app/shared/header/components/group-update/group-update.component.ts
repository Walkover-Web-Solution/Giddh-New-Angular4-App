import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';
import { AppState } from '../../../../store/roots';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { GroupResponse, GroupsTaxHierarchyResponse, MoveGroupRequest } from '../../../../models/api-models/Group';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { Select2Component } from '../../../theme/select2/select2.component';
import { AccountResponse } from '../../../../models/api-models/Account';
import { CompanyActions } from '../../../../services/actions/company.actions';
import { AccountsAction } from '../../../../services/actions/accounts.actions';
import { ApplyTaxRequest } from '../../../../models/api-models/ApplyTax';
import { Select2OptionData } from '../../../theme/select2/select2.interface';
import { uniqueNameValidator } from '../../../helpers/customValidationHelper';

@Component({
  selector: 'group-update',
  templateUrl: 'group-update.component.html'
})

export class GroupUpdateComponent implements OnInit, OnDestroy, AfterViewInit {

  public groupDetailForm: FormGroup;
  public moveGroupForm: FormGroup;
  public taxGroupForm: FormGroup;
  public activeGroup$: Observable<GroupResponse>;
  public activeGroupUniqueName$: Observable<string>;
  public fetchingGrpUniqueName$: Observable<boolean>;
  public isGroupNameAvailable$: Observable<boolean>;
  public isTaxableGroup$: Observable<boolean>;
  public showEditGroup$: Observable<boolean>;
  public groupList$: Observable<GroupsWithAccountsResponse[]>;
  public activeGroupSelected$: Observable<string[]>;
  public activeGroupTaxHierarchy$: Observable<GroupsTaxHierarchyResponse>;
  public companyTaxDropDown: Observable<Select2OptionData[]>;
  public isUpdateGroupInProcess$: Observable<boolean>;
  public isUpdateGroupSuccess$: Observable<boolean>;
  public taxPopOverTemplate: string = `
  <div class="popover-content">
  <label>Tax being inherited from:</label>
    <ul>
    <li>@inTax.name</li>
    </ul>
  </div>
  `;
  @ViewChild('applyTaxSelect2') public applyTaxSelect2: Select2Component;
  public options: Select2Options = {
    minimumResultsForSearch: 9001,
    multiple: true,
    width: '200px',
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
  public showEditTaxSection: boolean = false;
  public accountList: any[];
  @ViewChild('deleteGroupModal') public deleteGroupModal: ModalDirective;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction,
    private companyActions: CompanyActions, private accountsAction: AccountsAction) {
    this.groupList$ = this.store.select(state => state.groupwithaccounts.groupswithaccounts).takeUntil(this.destroyed$);
    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup).takeUntil(this.destroyed$);
    this.activeGroupUniqueName$ = this.store.select(state => state.groupwithaccounts.activeGroupUniqueName).takeUntil(this.destroyed$);
    this.fetchingGrpUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingGrpUniqueName).takeUntil(this.destroyed$);
    this.isGroupNameAvailable$ = this.store.select(state => state.groupwithaccounts.isGroupNameAvailable).takeUntil(this.destroyed$);
    this.showEditGroup$ = this.store.select(state => state.groupwithaccounts.showEditGroup).takeUntil(this.destroyed$);
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
    this.activeGroupTaxHierarchy$ = this.store.select(state => state.groupwithaccounts.activeGroupTaxHierarchy).takeUntil(this.destroyed$);
    this.isUpdateGroupInProcess$ = this.store.select(state => state.groupwithaccounts.isUpdateGroupInProcess).takeUntil(this.destroyed$);
    this.isUpdateGroupSuccess$ = this.store.select(state => state.groupwithaccounts.isUpdateGroupSuccess).takeUntil(this.destroyed$);
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
  }

  public ngOnInit() {
    this.groupDetailForm = this._fb.group({
      name: ['', Validators.required],
      uniqueName: ['', Validators.required],
      description: ['']
    });
    this.moveGroupForm = this._fb.group({
      moveto: ['', Validators.required]
    });
    this.taxGroupForm = this._fb.group({
      taxes: ['']
    });

    this.activeGroup$.subscribe((a) => {
      if (a) {
        this.groupDetailForm.patchValue({ name: a.name, uniqueName: a.uniqueName, description: a.description });
        if (a.fixed) {
          this.groupDetailForm.get('name').disable();
          this.groupDetailForm.get('uniqueName').disable();
          this.groupDetailForm.get('description').disable();
        } else {
          this.groupDetailForm.get('name').enable();
          this.groupDetailForm.get('uniqueName').enable();
          this.groupDetailForm.get('description').enable();
        }
      }
    });

    this.groupList$.subscribe((a) => {
      if (a) {
        this.accountList = this.makeGroupListFlatwithLessDtl(this.flattenGroup(a, []));
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
    this.activeGroupSelected$.subscribe(() => {
      if (this.applyTaxSelect2) {
        this.applyTaxSelect2.cd.detectChanges();
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

  public showDeleteGroupModal() {
    this.deleteGroupModal.show();
  }

  public hideDeleteGroupModal() {
    this.deleteGroupModal.hide();
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

  public moveToGroupSelected(event: any) {
    this.moveGroupForm.patchValue({ moveto: event.item.uniqueName });
  }

  public moveGroup() {
    let activeGroupUniqueName: string;
    this.activeGroupUniqueName$.take(1).subscribe(a => activeGroupUniqueName = a);

    let grpObject = new MoveGroupRequest();
    grpObject.parentGroupUniqueName = this.moveGroupForm.value.moveto;
    this.store.dispatch(this.groupWithAccountsAction.moveGroup(grpObject, activeGroupUniqueName));
    this.moveGroupForm.reset();
  }

  public deleteGroup() {
    let activeGroupUniqueName: string;
    this.activeGroupUniqueName$.take(1).subscribe(a => activeGroupUniqueName = a);
    this.store.dispatch(this.groupWithAccountsAction.deleteGroup(activeGroupUniqueName));
    this.hideDeleteGroupModal();
  }

  public updateGroup() {
    let activeGroupUniqueName: string;
    let uniqueName = this.groupDetailForm.get('uniqueName');
    uniqueName.patchValue(uniqueName.value.replace(/ /g, '').toLowerCase());

    this.activeGroupUniqueName$.take(1).subscribe(a => activeGroupUniqueName = a);
    this.store.dispatch(this.groupWithAccountsAction.updateGroup(this.groupDetailForm.value, activeGroupUniqueName));
  }

  public async taxHierarchy() {
    let activeAccount: AccountResponse = null;
    let activeGroupUniqueName: string = null;
    this.store.take(1).subscribe(s => {
      if (s.groupwithaccounts) {
        activeAccount = s.groupwithaccounts.activeAccount;
        activeGroupUniqueName = s.groupwithaccounts.activeGroupUniqueName;
      }
    });
    if (activeAccount) {
      //
      this.store.dispatch(this.companyActions.getTax());
      this.store.dispatch(this.accountsAction.getTaxHierarchy(activeAccount.uniqueName));
    } else {
      this.store.dispatch(this.companyActions.getTax());
      this.store.dispatch(this.groupWithAccountsAction.getTaxHierarchy(activeGroupUniqueName));
      this.showEditTaxSection = true;
    }

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
    if (this.applyTaxSelect2.value && Array.isArray(this.applyTaxSelect2.value)) {
      data.taxes.push(...(this.applyTaxSelect2.value as string[]));
    }
    data.uniqueName = activeGroup.uniqueName;
    this.store.dispatch(this.groupWithAccountsAction.applyGroupTax(data));
    this.showEditTaxSection = false;
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

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
