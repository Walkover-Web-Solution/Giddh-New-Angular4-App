import { GroupService } from '../../../services/group.service';
import { Select2OptionData } from '../../../shared/theme/select2/select2.interface';
import { AccountService } from '../../../services/account.service';
import { AppState } from '../../../store/roots';

import { Store } from '@ngrx/store';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginActions } from '../services/actions/login.action';
import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as moment from 'moment';
import { SearchRequest } from '../../../models/api-models/Search';
import { SearchActions } from '../../../services/actions/search.actions';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuditLogsSidebarVM } from './Vm';
import * as _ from 'lodash';

@Component({
  selector: 'audit-logs-sidebar',
  templateUrl: './audit-logs.sidebar.component.html',
  styles: [`
  .ps{overflow:visible !important}
  `]
})
export class AuditLogsSidebarComponent implements OnInit, OnDestroy {
  public vm: AuditLogsSidebarVM;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>, private _fb: FormBuilder, private _accountService: AccountService, private _groupService: GroupService) {
  }

  public ngOnInit() {
    this.vm = new AuditLogsSidebarVM();
    this.vm.selectedFromDate = moment().toDate();
    this.vm.selectedToDate = moment().toDate();
    this.vm.selectedEntryDate = moment().toDate();
    this.vm.selectedLogDate = moment().toDate();
    this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accounts: Select2OptionData[] = [];
        data.body.results.map(d => {
          accounts.push({ text: d.name, id: d.uniqueName });
        });
        this.vm.accounts$ = Observable.of(accounts);
      }
    });
    this._groupService.GetGroupsWithAccounts('').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accountList = this.flattenGroup(data.body, []);
        let groups: Select2OptionData[] = [];
        accountList.map((d: any) => {
          groups.push({ text: d.name, id: d.uniqueName });
        });
        this.vm.groups$ = Observable.of(groups);
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

  public ngOnDestroy() {
    //
  }
  public selectDateOption(v) {
    this.vm.selectedDateOption = v.value || '';
  }
  public selectEntityOption(v) {
    this.vm.selectedEntity = v.value || '';
  }
  public selectOperationOption(v) {
    this.vm.selectedOperation = v.value || '';
  }
  public selectAccount(v) {
    this.vm.selectedAccountUnq = v.value || '';
  }

  public selectGroup(v) {
    this.vm.selectedGroupUnq = v.value || '';
  }
  public selectUser(v) {
    this.vm.selectedUserUnq = v.value || '';
  }
}
