import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';
import { AppState } from '../../../../store/roots';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { GroupResponse, MoveGroupRequest } from '../../../../models/api-models/Group';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';

@Component({
  selector: 'group-update',
  templateUrl: 'group-update.component.html'
})

export class GroupUpdateComponent implements OnInit, OnDestroy {

  public groupDetailForm: FormGroup;
  public moveGroupForm: FormGroup;
  public activeGroup$: Observable<GroupResponse>;
  public fetchingGrpUniqueName$: Observable<boolean>;
  public isGroupNameAvailable$: Observable<boolean>;
  public showEditGroup$: Observable<boolean>;
  public groupList$: Observable<GroupsWithAccountsResponse[]>;
  public accountList: any[];
  @ViewChild('deleteGroupModal') public deleteGroupModal: ModalDirective;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction) {
    this.groupList$ = this.store.select(state => state.groupwithaccounts.groupswithaccounts).takeUntil(this.destroyed$);
    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup).takeUntil(this.destroyed$);
    this.fetchingGrpUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingGrpUniqueName).takeUntil(this.destroyed$);
    this.isGroupNameAvailable$ = this.store.select(state => state.groupwithaccounts.isGroupNameAvailable).takeUntil(this.destroyed$);
    this.showEditGroup$ = this.store.select(state => state.groupwithaccounts.showEditGroup).takeUntil(this.destroyed$);
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

    this.activeGroup$.subscribe((a) => {
      if (a) {
        this.groupDetailForm.patchValue({name: a.name, uniqueName: a.uniqueName, description: a.description});
      }
    });

    this.groupList$.subscribe((a) => {
      if (a) {
        this.accountList = this.makeGroupListFlatwithLessDtl(this.flattenGroup(a, []));
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
    this.moveGroupForm.patchValue({moveto: event.item.uniqueName});
  }

  public async moveGroup() {
    let activeGrp = await this.activeGroup$.first().toPromise();

    let grpObject = new MoveGroupRequest();
    grpObject.parentGroupUniqueName = this.moveGroupForm.value.moveto;
    this.store.dispatch(this.groupWithAccountsAction.moveGroup(grpObject, activeGrp.uniqueName));
    this.moveGroupForm.reset();
  }

  public deleteGroup() {
    let activeGrpUniqueName = null;
    this.activeGroup$.take(1).subscribe(s => activeGrpUniqueName = s.uniqueName);
    this.store.dispatch(this.groupWithAccountsAction.deleteGroup(activeGrpUniqueName));
    this.hideDeleteGroupModal();
  }

  public async updateGroup() {
    let activeGroup = await this.activeGroup$.first().toPromise();
    this.store.dispatch(this.groupWithAccountsAction.updateGroup(this.groupDetailForm.value, activeGroup.uniqueName));
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
