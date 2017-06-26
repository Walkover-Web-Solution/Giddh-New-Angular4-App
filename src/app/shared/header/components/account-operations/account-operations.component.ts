import { TaxResponse } from './../../../../models/api-models/Company';
import { CompanyActions } from './../../../../services/actions/company.actions';
import { GroupListItemResponse } from './../../../../models/api-models/GroupListItem';
import { Observable } from 'rxjs/Observable';
import { GroupsWithAccountsResponse } from './../../../../models/api-models/GroupsWithAccounts';
import { GroupWithAccountsAction } from './../../../../services/actions/groupwithaccounts.actions';
import { GroupResponse, GroupCreateRequest, ShareGroupRequest, GroupSharedWithResponse, MoveGroupRequest, GroupsTaxHierarchyResponse } from './../../../../models/api-models/Group';
import { IGroup } from './../../../../models/interfaces/group.interface';
import { IAccountsInfo } from './../../../../models/interfaces/accountInfo.interface';
import { IGroupsWithAccounts } from './../../../../models/interfaces/groupsWithAccounts.interface';
import { AppState } from './../../../../store/roots';
import { Store } from '@ngrx/store';
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import * as _ from 'lodash';
import { IOption, SelectModule, SelectComponent } from 'ng-select';

@Component({
  selector: 'account-operations',
  templateUrl: './account-operations.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountOperationsComponent implements OnInit, AfterViewInit {
  @ViewChild('select') public select: SelectComponent;
  public activeGroupTaxHierarchy$: Observable<GroupsTaxHierarchyResponse>;
  // tslint:disable-next-line:no-empty
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
  public companyTaxes$: Observable<TaxResponse[]>;
  public companyTaxDropDown: Observable<IOption[]>;
  public accountList: any[];
  public showEditTaxSection: boolean = false;

  public taxPopOverTemplate: string = `
  <div class="popover-content">
  <label>Tax being inherited from:</label>
    <ul>
    <li>@inTax.name</li>
    </ul>
  </div>
  `;
  public selectedTax: string[];

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction,
    private companyActions: CompanyActions) {

    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup);
    this.activeGroupInProgress$ = this.store.select(state => state.groupwithaccounts.activeGroupInProgress);
    this.activeGroupSharedWith$ = this.store.select(state => state.groupwithaccounts.activeGroupSharedWith);
    this.groupList$ = this.store.select(state => state.groupwithaccounts.groupswithaccounts);
    this.activeGroupTaxHierarchy$ = this.store.select(state => state.groupwithaccounts.activeGroupTaxHierarchy);
    this.companyTaxes$ = this.store.select(state => state.company.taxes);

    this.companyTaxDropDown = this.store.select(state => {
      let arr: IOption[] = [];
      if (state.groupwithaccounts.activeGroup && state.company.taxes && state.groupwithaccounts.activeGroupTaxHierarchy) {
        state.company.taxes.map((t) => {
          if (state.groupwithaccounts.activeGroupTaxHierarchy.inheritedTaxes.length) {
            state.groupwithaccounts.activeGroupTaxHierarchy.inheritedTaxes.map(it => {
              it.applicableTaxes.map(ita => {
                if (ita.uniqueName !== t.uniqueName) {
                  arr.push({ label: t.name, value: t.uniqueName });
                }
              });
            });
          } else {
            arr.push({ label: t.name, value: t.uniqueName });
          }
        });
      }
      return arr;
    });
  }

  public ngOnInit() {
    this.groupDetailForm = this._fb.group({
      name: ['', Validators.required],
      uniqueName: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.subGroupForm = this._fb.group({
      name: ['', Validators.required],
      uniqueName: ['', Validators.required],
      desc: ['', Validators.required]
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

    this.groupList$.subscribe((a) => {
      if (a) {
        this.accountList = this.makeGroupListFlatwithLessDtl(this.flattenGroup(a, []));
      }
    });

    this.activeGroup$.subscribe((a) => {
      if (a) {
        this.showGroupForm = true;
        this.showEditTaxSection = false;
        this.groupDetailForm.patchValue({name: a.name, uniqueName: a.uniqueName, description: a.description});
      } else {
        this.showGroupForm = false;
      }
    });

    this.companyTaxDropDown.subscribe((c) => {
      let a: GroupResponse;
      this.activeGroup$.take(1).subscribe(ac => {
        a = ac;
      });
      if (a) {
        let selectedTax = _.map(a.applicableTaxes, (at) => {
          return at.uniqueName;
        });
        this.selectedTax = selectedTax;
      }
    });
  }

  public ngAfterViewInit() {
    this.isTaxableGroup$ = this.store.select(state => {
      let result: boolean = false;
      if (state.groupwithaccounts.groupswithaccounts && state.groupwithaccounts.activeGroup) {
        result = this.getAccountFromGroup(state.groupwithaccounts.groupswithaccounts, state.groupwithaccounts.activeGroup.uniqueName, false);
      } else {
        result = false;
      }
      return result;
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

  public async shareGroup() {
    let activeGrp = await this.activeGroup$.first().toPromise();

    let grpObject = new ShareGroupRequest();
    grpObject.role = 'view_only';
    grpObject.user = this.shareGroupForm.controls['userEmail'].value;
    this.store.dispatch(this.groupWithAccountsAction.shareGroup(grpObject, activeGrp.uniqueName));
  }
  public moveToGroupSelected(event: any) {
    this.moveGroupForm.patchValue({moveto: event.item.uniqueName});
  }
  public async moveGroup() {
    let activeGrp = await this.activeGroup$.first().toPromise();

    let grpObject = new MoveGroupRequest();
    grpObject.parentGroupUniqueName = this.moveGroupForm.controls['moveto'].value;
    this.store.dispatch(this.groupWithAccountsAction.moveGroup(grpObject, activeGrp.uniqueName));
    this.moveGroupForm.reset();
  }

  public async unShareGroup(val) {
    let activeGrp = await this.activeGroup$.first().toPromise();

    this.store.dispatch(this.groupWithAccountsAction.unShareGroup(val, activeGrp.uniqueName));
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

  public makeGroupListFlatwithLessDtl(rawList: any)  {
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
    let activeGrp = await this.activeGroup$.first().toPromise();
    this.store.dispatch(this.companyActions.getTax());
    this.store.dispatch(this.groupWithAccountsAction.getTaxHierarchy(activeGrp.uniqueName));
    this.showEditTaxSection = true;
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
}
