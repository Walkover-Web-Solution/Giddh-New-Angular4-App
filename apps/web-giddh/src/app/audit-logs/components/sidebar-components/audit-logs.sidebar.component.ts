import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment/moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import {map as lodashMap } from '../../../lodash-optimized';
import { AuditLogsActions } from '../../../actions/audit-logs/audit-logs.actions';
import { flatten, omit, union } from '../../../lodash-optimized';
import { LogsRequest } from '../../../models/api-models/Logs';
import { CompanyService } from '../../../services/companyService.service';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { AppState } from '../../../store';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { AuditLogsSidebarVM } from './Vm';

@Component({
    selector: 'audit-logs-sidebar',
    templateUrl: './audit-logs.sidebar.component.html',
    styleUrls: ['audit-logs.sidebar.component.scss']
})
export class AuditLogsSidebarComponent implements OnInit, OnDestroy {
    public vm: AuditLogsSidebarVM;
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public giddhDateFormatUI: string = GIDDH_DATE_FORMAT_UI;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private _companyService: CompanyService, private _auditLogsActions: AuditLogsActions, private bsConfig: BsDatepickerConfig) {
        this.bsConfig.dateInputFormat = GIDDH_DATE_FORMAT;
        this.bsConfig.rangeInputFormat = GIDDH_DATE_FORMAT;
        this.bsConfig.showWeekNumbers = false;

        this.vm = new AuditLogsSidebarVM();
        this.vm.getLogsInprocess$ = this.store.pipe(select(p => p.auditlog.getLogInProcess), takeUntil(this.destroyed$));
        this.vm.groupsList$ = this.store.pipe(select(p => p.general.groupswithaccounts), takeUntil(this.destroyed$));

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if(activeCompany) {
                this.vm.selectedCompany = observableOf(activeCompany);
            }
        });

        this.vm.user$ = this.store.pipe(select(state => {
            if (state.session.user) {
                return state.session.user.user;
            }
        }), takeUntil(this.destroyed$));

        /* previously we were getting data from api now we are getting data from general store */

        this.vm.accounts$ = this.store.pipe(select(state => state.general.flattenAccounts), takeUntil(this.destroyed$), map(accounts => {
            if(accounts && accounts.length) {
                return accounts.map(account => {
                    return {
                        label: account.name,
                        value: account.uniqueName
                    }
                })
            } else {
                return [];
            }
        }));

        this._companyService.getComapnyUsers().pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data.status === 'success') {
                let users: IOption[] = [];
                data.body.map((d) => {
                    users.push({label: d.userName, value: d.userUniqueName, additional: d});
                });
                this.vm.canManageCompany = true;
                this.vm.users$ = observableOf(users);
            } else {
                this.vm.canManageCompany = false;
            }
        });
    }

    public ngOnInit() {
        this.vm.groupsList$.subscribe(data => {
            if (data && data.length) {
                let accountList = this.flattenGroup(data, []);
                let groups: IOption[] = [];
                accountList.map((d: any) => {
                    groups.push({label: d.name, value: d.uniqueName});
                });
                this.vm.groups$ = observableOf(groups);
            }
        });
        this.vm.reset();
    }

    public flattenGroup(rawList: any[], parents: any[] = []) {
        let listofUN;
        listofUN = lodashMap(rawList, (listItem) => {
            let newParents;
            let result;
            newParents = union([], parents);
            newParents.push({
                name: listItem.name,
                uniqueName: listItem.uniqueName
            });
            listItem = Object.assign({}, listItem, {parentGroups: []});
            listItem.parentGroups = newParents;
            if (listItem.groups.length > 0) {
                result = this.flattenGroup(listItem.groups, newParents);
                result.push(omit(listItem, 'groups'));
            } else {
                result = omit(listItem, 'groups');
            }
            return result;
        });
        return flatten(listofUN);
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
        // reqBody.fromDate = this.vm.selectedFromDate ? moment(this.vm.selectedFromDate).format(GIDDH_DATE_FORMAT) : '';
        // reqBody.toDate = this.vm.selectedToDate ? moment(this.vm.selectedToDate).format(GIDDH_DATE_FORMAT) : '';
        reqBody.operation = this.vm.selectedOperation === 'All' ? '' : this.vm.selectedOperation;
        reqBody.entity = this.vm.selectedEntity === 'All' ? '' : this.vm.selectedEntity;
        // reqBody.entryDate = this.vm.selectedLogDate ? moment(this.vm.selectedLogDate).format(GIDDH_DATE_FORMAT) : '';
        reqBody.userUniqueName = this.vm.selectedUserUnq;
        reqBody.accountUniqueName = this.vm.selectedAccountUnq;
        reqBody.groupUniqueName = this.vm.selectedGroupUnq;

        if (this.vm.selectedDateOption === '0') {
            reqBody.fromDate = null;
            reqBody.toDate = null;
            if (this.vm.logOrEntry === 'logDate') {
                reqBody.logDate = this.vm.selectedLogDate ? moment(this.vm.selectedLogDate).format(GIDDH_DATE_FORMAT) : '';
                reqBody.entryDate = null;
            } else if (this.vm.logOrEntry === 'entryDate') {
                reqBody.entryDate = this.vm.selectedLogDate ? moment(this.vm.selectedLogDate).format(GIDDH_DATE_FORMAT) : '';
                reqBody.logDate = null;
            }
        } else {
            reqBody.logDate = null;
            reqBody.entryDate = null;
            reqBody.fromDate = this.vm.selectedFromDate ? moment(this.vm.selectedFromDate).format(GIDDH_DATE_FORMAT) : '';
            reqBody.toDate = this.vm.selectedToDate ? moment(this.vm.selectedToDate).format(GIDDH_DATE_FORMAT) : '';
        }
        this.store.dispatch(this._auditLogsActions.GetLogs(reqBody, 1));
    }

    public customUserFilter(term: string, item: IOption) {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1 ||
            (item.additional && item.additional.userEmail && item.additional.userEmail.toLocaleLowerCase().indexOf(term) > -1));
    }

    public genralCustomFilter(term: string, item: IOption) {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1);
    }

    public resetFilters() {
        this.vm.reset();
        this.store.dispatch(this._auditLogsActions.ResetLogs());
    }
}
