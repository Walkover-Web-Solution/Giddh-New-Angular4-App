import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment/moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AuditLogsActions } from '../../../actions/audit-logs/audit-logs.actions';
import * as _ from '../../../lodash-optimized';
import { CompanyResponse } from '../../../models/api-models/Company';
import { UserDetails } from '../../../models/api-models/loginModels';
import { LogsRequest } from '../../../models/api-models/Logs';
import { IForceClear } from '../../../models/api-models/Sales';
import { AccountService } from '../../../services/account.service';
import { CompanyService } from '../../../services/companyService.service';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { AppState } from '../../../store';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { AuditLogsSidebarVM } from './Vm';

@Component({
    selector: 'audit-logs-sidebar',
    templateUrl: './audit-logs.sidebar.component.html',
    styleUrls: ['./audit-logs.sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditLogsSidebarComponent implements OnInit, OnDestroy {
    public vm: AuditLogsSidebarVM;
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public giddhDateFormatUI: string = GIDDH_DATE_FORMAT_UI;
    public auditForm: FormGroup;
    public forceClearConfiguration: IForceClear = { status: false };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private formBuilder: FormBuilder,
        private _accountService: AccountService,
        private _companyService: CompanyService,
        private _auditLogsActions: AuditLogsActions,
        private bsConfig: BsDatepickerConfig
        ) {
            this.bsConfig.dateInputFormat = GIDDH_DATE_FORMAT;
            this.bsConfig.rangeInputFormat = GIDDH_DATE_FORMAT;
            this.bsConfig.showWeekNumbers = false;

            this.vm = new AuditLogsSidebarVM();
            this.vm.getLogsInprocess$ = this.store.pipe(select(p => p.auditlog.getLogInProcess), takeUntil(this.destroyed$));
            this.vm.groupsList$ = this.store.pipe(select(p => p.general.groupswithaccounts), takeUntil(this.destroyed$));
            this.vm.selectedCompany = this.store.pipe(select(state =>  {
                if (!state.session.companies) {
                    return;
                }
                return state.session.companies.find(cmp => {
                    return cmp.uniqueName === state.session.companyUniqueName;
                });
            }), takeUntil(this.destroyed$));
            this.vm.user$ = this.store.pipe(select(state => {
                if (state.session.user) {
                    return state.session.user.user;
                }
            }), takeUntil(this.destroyed$));
            this._accountService.GetFlattenAccounts('', '').pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data.status === 'success') {
                    let accounts: IOption[] = [];
                    data.body.results.map(d => {
                        accounts.push({ label: d.name, value: d.uniqueName });
                    });
                    this.vm.accounts$ = observableOf(accounts);
                }
            });
            let selectedCompany: CompanyResponse = null;
            let loginUser: UserDetails = null;
            this.vm.selectedCompany.pipe(take(1)).subscribe((c) => selectedCompany = c);
            this.vm.user$.pipe(take(1)).subscribe((c) => loginUser = c);
            this._companyService.getComapnyUsers().pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data.status === 'success') {
                    let users: IOption[] = [];
                    data.body.map((d) => {
                        users.push({ label: d.userName, value: d.userUniqueName, additional: d });
                    });
                    this.vm.canManageCompany = true;
                    this.vm.users$ = observableOf(users);
                } else {
                    this.vm.canManageCompany = false;
                }
            });
    }

    public ngOnInit() {
        this.auditForm = this.formBuilder.group({
            fromDate: [this.vm.selectedFromDate, Validators.required],
            toDate: [this.vm.selectedToDate, Validators.required],
            operation: ['', Validators.required],
            entity: ['', Validators.required],
            user: ['']
        });
        this.vm.groupsList$.subscribe(data => {
            if (data && data.length) {
                let accountList = this.flattenGroup(data, []);
                let groups: IOption[] = [];
                accountList.map((d: any) => {
                    groups.push({ label: d.name, value: d.uniqueName });
                });
                this.vm.groups$ = observableOf(groups);
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
        reqBody.operation = this.auditForm.get('operation').value === 'All' ? '' : this.auditForm.get('operation').value;
        reqBody.entity = this.auditForm.get('entity').value === 'All' ? '' : this.auditForm.get('entity').value;
        reqBody.userUniqueName = this.auditForm.get('user').value;
        reqBody.fromDate = moment(this.auditForm.get('fromDate').value).format('DD-MM-YYYY');
        reqBody.toDate = moment(this.auditForm.get('toDate').value).format('DD-MM-YYYY');
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
        this.auditForm.reset();
        this.forceClearConfiguration = { status: true };
        this.store.dispatch(this._auditLogsActions.ResetLogs());
    }
}
