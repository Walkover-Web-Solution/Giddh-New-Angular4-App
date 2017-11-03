import { LogsRequest } from '../../../models/api-models/Logs';
import { UserDetails } from '../../../models/api-models/loginModels';
import { CompanyResponse } from '../../../models/api-models/Company';
import { CompanyService } from '../../../services/companyService.service';
import { GroupService } from '../../../services/group.service';
import { AccountService } from '../../../services/account.service';
import { AppState } from '../../../store';

import { Store } from '@ngrx/store';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as moment from 'moment/moment';
import { FormBuilder } from '@angular/forms';
import { AuditLogsSidebarVM } from './Vm';
import * as _ from '../../../lodash-optimized';
import { AuditLogsActions } from '../../../services/actions/audit-logs/audit-logs.actions';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { IOption } from '../../../theme/ng-select/option.interface';

@Component({
  selector: 'audit-logs-sidebar',
  templateUrl: './audit-logs.sidebar.component.html',
  styles: [`
    .ps {
      overflow: visible !important
    }
  `]
})
export class AuditLogsSidebarComponent implements OnInit, OnDestroy {
  public vm: AuditLogsSidebarVM;
  public bsConfig: Partial<BsDatepickerConfig> = {showWeekNumbers: false, dateInputFormat: 'DD-MM-YYYY'};
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _fb: FormBuilder, private _accountService: AccountService,
              private _groupService: GroupService, private _companyService: CompanyService, private _auditLogsActions: AuditLogsActions) {
    this.vm = new AuditLogsSidebarVM();
    this.vm.getLogsInprocess$ = this.store.select(p => p.auditlog.getLogInProcess).takeUntil(this.destroyed$);
    this.vm.groupsList$ = this.store.select(p => p.general.groupswithaccounts).takeUntil(this.destroyed$);
    this.vm.selectedCompany = this.store.select(state => {
      if (!state.session.companies) {
        return;
      }
      return state.session.companies.find(cmp => {
        return cmp.uniqueName === state.session.companyUniqueName;
      });
    }).takeUntil(this.destroyed$);
    this.vm.user$ = this.store.select(state => {
      if (state.session.user) {
        return state.session.user.user;
      }
    }).takeUntil(this.destroyed$);
    this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accounts: IOption[] = [];
        data.body.results.map(d => {
          accounts.push({label: d.name, value: d.uniqueName});
        });
        this.vm.accounts$ = Observable.of(accounts);
      }
    });
    let selectedCompany: CompanyResponse = null;
    let loginUser: UserDetails = null;
    this.vm.selectedCompany.take(1).subscribe((c) => selectedCompany = c);
    this.vm.user$.take(1).subscribe((c) => loginUser = c);
    this._companyService.getComapnyUsers().takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let users: IOption[] = [];
        data.body.map((d) => {
          users.push({label: d.userName, value: d.userUniqueName});
        });
        this.vm.canManageCompany = true;
        this.vm.users$ = Observable.of(users);
      } else {
        this.vm.canManageCompany = false;
      }
    });
  }

  public ngOnInit() {
    this.vm.groupsList$.subscribe(data => {
      if (data.length) {
        let accountList = this.flattenGroup(data, []);
        let groups: IOption[] = [];
        accountList.map((d: any) => {
          groups.push({label: d.name, value: d.uniqueName});
        });
        this.vm.groups$ = Observable.of(groups);
      }
    });
    this.vm.reset();
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
    this.vm.reset();
    this.store.dispatch(this._auditLogsActions.ResetLogs());
    this.destroyed$.next(true);
    this.destroyed$.complete();
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

  public clearDate(model: string) {
    this.vm[model] = '';
  }

  public setToday(model: string) {
    this.vm[model] = new Date();
  }

  public selectGroup(v) {
    this.vm.selectedGroupUnq = v.value || '';
  }

  public selectUser(v) {
    this.vm.selectedUserUnq = v.value || '';
  }

  public getLogfilters() {
    let reqBody: LogsRequest = new LogsRequest();
    reqBody.fromDate = this.vm.selectedFromDate ? moment(this.vm.selectedFromDate).format('DD-MM-YYYY') : '';
    reqBody.toDate = this.vm.selectedToDate ? moment(this.vm.selectedToDate).format('DD-MM-YYYY') : '';
    reqBody.operation = this.vm.selectedOperation === 'All' ? '' : this.vm.selectedOperation;
    reqBody.entity = this.vm.selectedEntity === 'All' ? '' : this.vm.selectedEntity;
    reqBody.entryDate = this.vm.selectedLogDate ? moment(this.vm.selectedLogDate).format('DD-MM-YYYY') : '';
    reqBody.userUniqueName = this.vm.selectedUserUnq;
    reqBody.accountUniqueName = this.vm.selectedAccountUnq;
    reqBody.groupUniqueName = this.vm.selectedGroupUnq;

    if (this.vm.selectedDateOption === '0') {
      reqBody.fromDate = null;
      reqBody.toDate = null;
      if (this.vm.logOrEntry === 'logDate') {
        reqBody.logDate = this.vm.selectedLogDate ? moment(this.vm.selectedLogDate).format('DD-MM-YYYY') : '';
        reqBody.entryDate = null;
        reqBody.fromDate = null;
        reqBody.toDate = null;
      } else if (this.vm.logOrEntry === 'entryDate') {
        reqBody.entryDate = this.vm.selectedEntryDate ? moment(this.vm.selectedEntryDate).format('DD-MM-YYYY') : '';
        reqBody.logDate = null;
        reqBody.fromDate = null;
        reqBody.toDate = null;
      }
    } else {
      reqBody.logDate = null;
      reqBody.entryDate = null;
    }
    this.store.dispatch(this._auditLogsActions.GetLogs(reqBody, 1));
  }

  public resetFilters() {
    this.vm.reset();
    this.store.dispatch(this._auditLogsActions.ResetLogs());
  }
}
