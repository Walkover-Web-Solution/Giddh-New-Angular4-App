import { of as observableOf, ReplaySubject, Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { LogsRequest, AuditLogFilterForm, GetAuditLogsRequest } from '../../../models/api-models/Logs';
import { UserDetails } from '../../../models/api-models/loginModels';
import { CompanyResponse } from '../../../models/api-models/Company';
import { CompanyService } from '../../../services/companyService.service';
import { GroupService } from '../../../services/group.service';
import { AccountService } from '../../../services/account.service';
import { AppState } from '../../../store';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_UI, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { Store, select } from '@ngrx/store';
import { Component, OnDestroy, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import * as moment from 'moment/moment';
import { AuditLogsSidebarVM } from './Vm';
import * as _ from '../../../lodash-optimized';
import { AuditLogsActions } from '../../../actions/audit-logs/audit-logs.actions';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { GeneralService } from '../../../services/general.service';
import { LogsService } from '../../../services/logs.service';
import { IForceClear } from '../../../models/api-models/Sales';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';

@Component({
    selector: 'audit-logs-form',
    templateUrl: './audit-logs-form.component.html',
    styleUrls: ['audit-logs-form.component.scss']
})
export class AuditLogsFormComponent implements OnInit, OnDestroy {
    /** Audit log form object */
    public auditLogFormVM: AuditLogsSidebarVM;
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /* This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
    /* Moment object */
    public moment = moment;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* Active company details */
    public activeCompany: any;
    /** Audit log filter form data */
    public auditLogFilterForm: any[] = [];
    /** To clear entity sh-select options   */
    public forceClearEntity$: Observable<IForceClear> = observableOf({ status: false });
    /** To clear operations sh-select options   */
    public forceClearOperations$: Observable<IForceClear> = observableOf({ status: false });
    /** To clear account sh-select options   */
    public forceClearAccount$: Observable<IForceClear> = observableOf({ status: false });
    /** To clear group sh-select options   */
    public forceClearGroup$: Observable<IForceClear> = observableOf({ status: false });
    /** To clear user sh-select options   */
    public forceClearUser$: Observable<IForceClear> = observableOf({ status: false });
    /* Active company unique name */
    public activeCompanyUniqueName$: Observable<string>;
    /** To destroy observers */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** From date value of parent datepicker */
    @Input() public fromDate: string;
    /** To date value of parent datepicker */
    @Input() public toDate: string;
    /** Entity sh-selct refence */
    @ViewChild('selectEntity') public shSelectEntityReference: ShSelectComponent;



    constructor(private store: Store<AppState>,
        private accountService: AccountService,
        private companyService: CompanyService,
        private auditLogsActions: AuditLogsActions,
        private bsConfig: BsDatepickerConfig,
        private modalService: BsModalService,
        private auditLogsService: LogsService,
        private generalService: GeneralService) {

        this.bsConfig.dateInputFormat = GIDDH_DATE_FORMAT;
        this.bsConfig.rangeInputFormat = GIDDH_DATE_FORMAT;
        this.bsConfig.showWeekNumbers = false;

        this.auditLogFormVM = new AuditLogsSidebarVM();
        this.auditLogFormVM.getLogsInprocess$ = this.store.pipe(select(state => state.auditlog.getLogInProcess), takeUntil(this.destroyed$));
        this.auditLogFormVM.groupsList$ = this.store.pipe(select(state => state.general.groupswithaccounts), takeUntil(this.destroyed$));
        this.auditLogFormVM.user$ = this.store.pipe(select(state => { if (state.session.user) { return state.session.user.user; } }), take(1));
        this.accountService.getFlattenAccounts('', '').pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data.status === 'success') {
                let accounts: IOption[] = [];
                data.body.results.map(d => {
                    accounts.push({ label: d.name, value: d.uniqueName });
                });
                this.auditLogFormVM.accounts$ = observableOf(accounts);
            }
        });
        let loginUser: UserDetails = null;
        this.auditLogFormVM.user$.pipe(take(1)).subscribe((response) => loginUser = response);
        this.companyService.getComapnyUsers().pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data.status === 'success') {
                let users: IOption[] = [];
                data.body.map((item) => {
                    users.push({ label: item.userName, value: item.userUniqueName, additional: item });
                });
                this.auditLogFormVM.canManageCompany = true;
                this.auditLogFormVM.users$ = observableOf(users);
            } else {
                this.auditLogFormVM.canManageCompany = false;
            }
        });
    }

    /**
     * Component lifecycle hook
     *
     * @memberof AuditLogsFormComponent
     */
    public ngOnInit(): void {
        // To get audit log form filter
        this.getFormFilter();
        this.auditLogFormVM.groupsList$.subscribe(data => {
            if (data && data.length) {
                let accountList = this.flattenGroup(data, []);
                let groups: IOption[] = [];
                accountList.map((item: any) => {
                    groups.push({ label: item.name, value: item.uniqueName });
                });
                this.auditLogFormVM.groups$ = observableOf(groups);
            }
        });
        this.auditLogFormVM.reset();
    }

    /**
     * To filter flatten groups
     *
     * @param {any[]} rawList Row list to filter
     * @param {any[]} [parents=[]] Parent list
     * @returns
     * @memberof AuditLogsFormComponent
     */
    public flattenGroup(rawList: any[], parents: any[] = []): any {
        let listOfFlattenGroup;
        listOfFlattenGroup = _.map(rawList, (listItem) => {
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
        return _.flatten(listOfFlattenGroup);
    }

    /**
     *Component lifecycle hook
     *
     * @memberof AuditLogsFormComponent
     */
    public ngOnDestroy(): void {
        this.auditLogFormVM.reset();
        this.store.dispatch(this.auditLogsActions.ResetLogs());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * API call to get filtered audit logs
     *
     * @memberof AuditLogsFormComponent
     */
    public getLogFilters(): void {
        let getAuditLogsRequest: GetAuditLogsRequest = new GetAuditLogsRequest();
        getAuditLogsRequest = _.cloneDeep(this.prepareAuditLogFormRequest());
        this.store.dispatch(this.auditLogsActions.getAuditLogs(getAuditLogsRequest, 1));
    }

    /**
     * Generate  custom users filter
     *
     * @param {string} term term to filter with
     * @param {IOption} item term to filter for
     * @returns
     * @memberof AuditLogsFormComponent
     */
    public customUserFilter(term: string, item: IOption): any {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1 ||
            (item.additional && item.additional.userEmail && item.additional.userEmail.toLocaleLowerCase().indexOf(term) > -1));
    }

    /**
     * Generate custom filters
     *
     * @param {string} term term to filter with
     * @param {IOption} item term to filter for
     * @returns
     * @memberof AuditLogsFormComponent
     */
    public generalCustomFilter(term: string, item: IOption): any {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1);
    }

    /**
     * To reset audit log form
     *
     * @memberof AuditLogsFormComponent
     */
    public resetFilters(): void {
        this.auditLogFormVM.reset();
        this.resetAuditLogForm();
        this.store.dispatch(this.auditLogsActions.ResetLogs());
    }


    /**
     * To get audit log form filter
     *
     * @memberof AuditLogsFormComponent
     */
    public getFormFilter(): void {
        this.auditLogsService.getAuditLogFormFilters().subscribe((response) => {
            if (response && response.status === 'success') {
                if (response.body) {
                    this.auditLogFilterForm = response.body;
                    this.auditLogFormVM.filters = [];
                    this.auditLogFormVM.entities = [];
                    this.auditLogFilterForm.forEach(element => {
                        this.auditLogFormVM.entities.push(element.entity);
                    });
                }
                this.focusOnEntity();
            }
        });
    }

    /**
     * To prepare operation dropdown data according to selected entity type
     *
     * @param {any} selectEntity  Selected entity type
     * @memberof AuditLogsFormComponent
     */
    public prepareOperationFormData(selectEntity: any): void {
        if (selectEntity.filter) {
            this.getOperationsFilterData(selectEntity.filter);
        } else {
            this.auditLogFormVM.filters = [];
        }
    }


    /**
     * To get operations dropdown data according to select entity type
     *
     * @param {string} entityType Selected entity type
     * @memberof AuditLogsFormComponent
     */
    public getOperationsFilterData(entityType: string): any {
        this.auditLogFormVM.filters = [];
        // this.forceClearOperations$ = observableOf({ status: true });
        if (entityType) {
            let selectedEntityObject = this.auditLogFilterForm.filter(element => {
                if (element.entity.label.toLocaleLowerCase() === entityType.toLocaleLowerCase()) {
                    return element;
                }
            });
            if (selectedEntityObject && selectedEntityObject.length) {
                this.auditLogFormVM.filters = _.cloneDeep(selectedEntityObject[0].operations)
            }

        }
    }

    /**
     * To reset form values
     *
     * @memberof AuditLogsFormComponent
     */
    public resetAuditLogForm(): void {
        this.forceClearEntity$ = observableOf({ status: true });
        this.forceClearGroup$ = observableOf({ status: true });
        this.forceClearAccount$ = observableOf({ status: true });
        this.forceClearUser$ = observableOf({ status: true });
        this.forceClearOperations$ = observableOf({ status: true });
    }

    /**
     * To select entity type
     *
     * @param {IOption} event Selected item object
     * @memberof AuditLogsFormComponent
     */
    public selectedEntityType(event: IOption): void {
        if (event && event.value) {
            this.getOperationsFilterData(event.value);
        }
    }

    /**
     * To prepare get audit log request model
     *
     * @returns {GetAuditLogsRequest} Audit log request model
     * @memberof AuditLogsFormComponent
     */
    public prepareAuditLogFormRequest(): GetAuditLogsRequest {
        let getAuditLogsRequest: GetAuditLogsRequest = new GetAuditLogsRequest();
        getAuditLogsRequest.userUniqueNames = [];
        getAuditLogsRequest.accountUniqueNames = [];
        getAuditLogsRequest.groupUniqueNames = [];
        getAuditLogsRequest.entity = this.auditLogFormVM.selectedEntity;
        getAuditLogsRequest.operation = this.auditLogFormVM.selectedOperation;
        getAuditLogsRequest.fromDate = this.fromDate;
        getAuditLogsRequest.toDate = this.toDate;
        getAuditLogsRequest.userUniqueNames.push(this.auditLogFormVM.selectedUserUniqueName);
        getAuditLogsRequest.accountUniqueNames.push(this.auditLogFormVM.selectedAccountUniqueName);
        getAuditLogsRequest.groupUniqueNames.push(this.auditLogFormVM.selectedGroupUniqueName);
        return getAuditLogsRequest;
    }

    /**
     * To auto focus on entity dropdown
     *
     * @memberof AuditLogsFormComponent
     */
    public focusOnEntity(): void {
        if (this.shSelectEntityReference) {
            setTimeout(() => {
                if (this.shSelectEntityReference) {
                    this.shSelectEntityReference.show('');
                }
            }, 1000);
        }
    }
}
