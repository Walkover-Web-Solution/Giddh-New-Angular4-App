import { GroupListItemResponse } from './../../../../models/api-models/GroupListItem';
import { Observable } from 'rxjs/Observable';
import { GroupsWithAccountsResponse } from './../../../../models/api-models/GroupsWithAccounts';
import { GroupWithAccountsAction } from './../../../../services/actions/groupwithaccounts.actions';
import { GroupResponse, GroupCreateRequest, ShareGroupRequest, GroupSharedWithResponse, MoveGroupRequest } from './../../../../models/api-models/Group';
import { IGroup } from './../../../../models/interfaces/group.interface';
import { IAccountsInfo } from './../../../../models/interfaces/accountInfo.interface';
import { IGroupsWithAccounts } from './../../../../models/interfaces/groupsWithAccounts.interface';
import { AppState } from './../../../../store/roots';
import { Store } from '@ngrx/store';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import * as _ from 'lodash';

@Component({
  selector: 'account-operations',
  templateUrl: './account-operations.component.html',
})
export class AccountOperationsComponent implements OnInit {
  // tslint:disable-next-line:no-empty
  public subGroupForm: FormGroup;
  public groupDetailForm: FormGroup;
  public moveGroupForm: FormGroup;
  public shareGroupForm: FormGroup;
  public showGroupForm: boolean = false;
  public activeGroup$: Observable<GroupResponse>;
  // public groupList$: Observable<GroupsWithAccountsResponse[]>;
  public activeGroupInProgress$: Observable<boolean>;
  public isRootLevlGroup$: Observable<boolean>;
  public activeGroupSharedWith$: Observable<GroupSharedWithResponse[]>;
  public groupList$: Observable<GroupsWithAccountsResponse[]>;
  public accountList: any[];

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction) {

    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup);
    this.activeGroupInProgress$ = this.store.select(state => state.groupwithaccounts.activeGroupInProgress);
    this.activeGroupSharedWith$ = this.store.select(state => state.groupwithaccounts.activeGroupSharedWith);
    this.groupList$ = this.store.select(state => state.groupwithaccounts.groupswithaccounts);
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

    this.groupList$.subscribe((a) => {
      if (a) {
        this.accountList = this.makeGroupListFlatwithLessDtl(this.flattenGroup(a, []));
      }
    });

    this.activeGroup$.subscribe((a) => {
      if (a) {
        this.showGroupForm = true;
        this.groupDetailForm.patchValue({name: a.name, uniqueName: a.uniqueName, description: a.description});
      } else {
        this.showGroupForm = false;
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
}
