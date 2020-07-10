import { of as observableOf, ReplaySubject, Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { LogsRequest, AuditLogFilterForm } from '../../../models/api-models/Logs';
import { UserDetails } from '../../../models/api-models/loginModels';
import { CompanyResponse } from '../../../models/api-models/Company';
import { CompanyService } from '../../../services/companyService.service';
import { GroupService } from '../../../services/group.service';
import { AccountService } from '../../../services/account.service';
import { AppState } from '../../../store';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_UI, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { Store, select } from '@ngrx/store';
import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
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

@Component({
    selector: 'audit-logs-form',
    templateUrl: './audit-logs-form.component.html',
    styles: [`
    .ps {
      overflow: visible !important
    }
  `]
})
export class AuditLogsFormComponent implements OnInit, OnDestroy {
    public auditLogFormVM: AuditLogsSidebarVM;
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public giddhDateFormatUI: string = GIDDH_DATE_FORMAT_UI;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /* This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any;
    /* Moment object */
    public moment = moment;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* Universal date observer */
    public universalDate$: Observable<any>;
    /* Active company details */
    public activeCompany: any;
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
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

    constructor(private store: Store<AppState>,
        private accountService: AccountService,
        private companyService: CompanyService,
        private auditLogsActions: AuditLogsActions,
        private bsConfig: BsDatepickerConfig,
        private modalService: BsModalService,
        private audotLogsService: LogsService,
        private generalService: GeneralService) {

        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));

        this.bsConfig.dateInputFormat = GIDDH_DATE_FORMAT;
        this.bsConfig.rangeInputFormat = GIDDH_DATE_FORMAT;
        this.bsConfig.showWeekNumbers = false;

        this.auditLogFormVM = new AuditLogsSidebarVM();
        this.auditLogFormVM.getLogsInprocess$ = this.store.pipe(select(state => state.auditlog.getLogInProcess), takeUntil(this.destroyed$));
        this.auditLogFormVM.groupsList$ = this.store.pipe(select(state => state.general.groupswithaccounts), takeUntil(this.destroyed$));
        this.auditLogFormVM.user$ = this.store.select(state => {
            if (state.session.user) {
                return state.session.user.user;
            }
        }).pipe(takeUntil(this.destroyed$));
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
        this.auditLogFormVM.user$.pipe(take(1)).subscribe((c) => loginUser = c);
        this.companyService.getComapnyUsers().pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data.status === 'success') {
                let users: IOption[] = [];
                data.body.map((d) => {
                    users.push({ label: d.userName, value: d.userUniqueName, additional: d });
                });
                this.auditLogFormVM.canManageCompany = true;
                this.auditLogFormVM.users$ = observableOf(users);
            } else {
                this.auditLogFormVM.canManageCompany = false;
            }
        });
    }

    public ngOnInit() {
        // To get audit log form filter
        this.getFormFilter();
        this.auditLogFormVM.groupsList$.subscribe(data => {
            if (data && data.length) {
                let accountList = this.flattenGroup(data, []);
                let groups: IOption[] = [];
                accountList.map((d: any) => {
                    groups.push({ label: d.name, value: d.uniqueName });
                });
                this.auditLogFormVM.groups$ = observableOf(groups);
            }
        });
        this.auditLogFormVM.reset();

        /** Universal date observer */
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: moment(dateObj[0]), endDate: moment(dateObj[1]) };
                this.selectedDateRangeUi = moment(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });
        /* This will get the date range picker configurations */
        this.store.pipe(select(state => state.company.dateRangePickerConfig), takeUntil(this.destroyed$)).subscribe(config => {
            if (config) {
                this.datePickerOptions = config;
            }
        });
    }

    public flattenGroup(rawList: any[], parents: any[] = []) {
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

    public ngOnDestroy() {
        this.auditLogFormVM.reset();
        this.store.dispatch(this.auditLogsActions.ResetLogs());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public selectDateOption(v) {
        this.auditLogFormVM.selectedDateOption = v.value || '';
    }

    public selectEntityOption(v) {
        this.auditLogFormVM.selectedEntity = v.value || '';
    }

    public selectOperationOption(v) {
        this.auditLogFormVM.selectedOperation = v.value || '';
    }

    public selectAccount(v) {
        this.auditLogFormVM.selectedAccountUnq = v.value || '';
    }

    public clearDate(model: string) {
        this.auditLogFormVM[model] = '';
    }

    public setToday(model: string) {
        this.auditLogFormVM[model] = new Date();
    }

    public selectGroup(v) {
        this.auditLogFormVM.selectedGroupUnq = v.value || '';
    }

    public selectUser(v) {
        this.auditLogFormVM.selectedUserUnq = v.value || '';
    }

    public getLogfilters() {
        let reqBody: LogsRequest = new LogsRequest();
        reqBody.operation = this.auditLogFormVM.selectedOperation === 'All' ? '' : this.auditLogFormVM.selectedOperation;
        reqBody.entity = this.auditLogFormVM.selectedEntity === 'All' ? '' : this.auditLogFormVM.selectedEntity;
        reqBody.userUniqueName = this.auditLogFormVM.selectedUserUnq;
        reqBody.accountUniqueName = this.auditLogFormVM.selectedAccountUnq;
        reqBody.groupUniqueName = this.auditLogFormVM.selectedGroupUnq;

        if (this.auditLogFormVM.selectedDateOption === '0') {
            reqBody.fromDate = null;
            reqBody.toDate = null;
            if (this.auditLogFormVM.logOrEntry === 'logDate') {
                reqBody.logDate = this.auditLogFormVM.selectedLogDate ? moment(this.auditLogFormVM.selectedLogDate).format(GIDDH_DATE_FORMAT) : '';
                reqBody.entryDate = null;
            } else if (this.auditLogFormVM.logOrEntry === 'entryDate') {
                reqBody.entryDate = this.auditLogFormVM.selectedLogDate ? moment(this.auditLogFormVM.selectedLogDate).format(GIDDH_DATE_FORMAT) : '';
                reqBody.logDate = null;
            }
        } else {
            reqBody.logDate = null;
            reqBody.entryDate = null;
            reqBody.fromDate = this.fromDate;
            reqBody.toDate = this.toDate;
        }
        this.store.dispatch(this.auditLogsActions.GetLogs(reqBody, 1));
    }

    public customUserFilter(term: string, item: IOption) {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1 ||
            (item.additional && item.additional.userEmail && item.additional.userEmail.toLocaleLowerCase().indexOf(term) > -1));
    }

    public genralCustomFilter(term: string, item: IOption) {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1);
    }

    public resetFilters() {
        this.auditLogFormVM.reset();
        this.resetAuditLogForm();
        this.store.dispatch(this.auditLogsActions.ResetLogs());
    }
    // end

    /**
     * To get audit log form filter
     *
     * @memberof AuditLogsFormComponent
     */
    public getFormFilter(): void {
        this.audotLogsService.getAuditLogFormFilters().subscribe((response) => {
            console.log(response);
            if (response && response.status === 'success') {
                if (response.body) {
                    this.auditLogFilterForm = response.body;
                    this.auditLogFormVM.filters = [];
                    this.auditLogFormVM.entities = [];
                    response.body.forEach(element => {
                        this.auditLogFormVM.entities.push({ label: element.entity, value: element.entity });
                    });
                }
            }

        })
    }

    /**
     * To prepare operation dropdown data according to selected entity type
     *
     * @param {any} selectEntity  Selected entity type
     * @memberof AuditLogsFormComponent
     */
    public prepareOperationFormData(selectEntity: any) {
        console.log(selectEntity);
        if (selectEntity.filter) {
            this.getOperationsFilterData(selectEntity.filter);
            // let selectedEntityObject = this.auditLogFilterForm.filter(element => element.entity === selectEntity.filter);
            // selectedEntityObject[0].operations.map(element => {
            //     element = { label: element, value: element };
            // });
            // this.auditLogFormVM.filters = selectedEntityObject[0].operations;
            // console.log(selectedEntityObject);
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
    public getOperationsFilterData(entityType: string) {
        this.auditLogFormVM.filters = [];
        if (entityType) {
            let selectedEntityObject = this.auditLogFilterForm.filter(element => element.entity === entityType);
            selectedEntityObject[0].operations.map(element => {
                let operatios: IOption = { label: element, value: element };
                this.auditLogFormVM.filters.push(operatios);
            });
        }
    }

    /**
     * To reset form values
     *
     * @memberof AuditLogsFormComponent
     */
    public resetAuditLogForm() {
        this.forceClearEntity$ = observableOf({ status: true });
        this.forceClearGroup$ = observableOf({ status: true });
        this.forceClearAccount$ = observableOf({ status: true });
        this.forceClearGroup$ = observableOf({ status: true });
        this.forceClearUser$ = observableOf({ status: true });
    }

    /**
     * To select entity type
     *
     * @param {IOption} event Selected item object
     * @memberof AuditLogsFormComponent
     */
    public selectedEntityType(event: IOption) {
        if (event && event.value) {
            this.getOperationsFilterData(event.value);
        }
    }


    /**
     *To show the datepicker
     *
     * @param {*} element
     * @memberof AuditLogsFormComponent
     */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: this.isMobileScreen })
        );
    }

    /**
     * This will hide the datepicker
     *
     * @memberof AuditLogsFormComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof AuditLogsFormComponent
     */
    public dateSelectedCallback(value: any): void {
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }


}
