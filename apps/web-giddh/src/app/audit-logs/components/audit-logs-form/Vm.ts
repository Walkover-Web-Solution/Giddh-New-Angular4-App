import { UserDetails } from '../../../models/api-models/loginModels';
import * as dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { GroupsWithAccountsResponse } from '../../../models/api-models/GroupsWithAccounts';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';

export class AuditLogsSidebarVM {
    /** Audit log form's user list Observer */
    public user$: Observable<UserDetails>;
    /** Audit log form's account list Observer */
    public accounts$: Observable<IOption[]>;
    /** Audit log form's groups with accounts list Observer */
    public groupsList$: Observable<GroupsWithAccountsResponse[]>;
    /** Audit log form's groups list Observer */
    public groups$: Observable<IOption[]>;
    /** Audit log form's company shared users list Observer */
    public users$: Observable<IOption[]>;
    /** Date format library reference */
    public dayjs = dayjs;
    /** Audit log form's company operations list */
    public filters: IOption[] = [];
    /** Audit log form's company entity type list */
    public entities: IOption[] = [];
    /** Observer to get logs in progress */
    public getLogsInprocess$: Observable<boolean>;
    /** Date range options */
    public dateOptions: IOption[];
    /** Check for manage company  */
    public canManageCompany: boolean = false;
    /** Selected operation type */
    public selectedOperation: string = '';
    /** Selected entry type */
    public selectedEntity: string = '';
    /** Selected user unique name */
    public selectedUserUniqueName: string = '';
    /** Selected group unique name */
    public selectedGroupUniqueName: string = '';
    /** Selected from date */
    public selectedFromDate: Date;
    /** Selected to date */
    public selectedToDate: Date;
    /** Selected account unique name */
    public selectedAccountUniqueName: string = '';

    constructor(private localeData, private commonLocaleData) {
        this.dateOptions = [{ label: this.commonLocaleData?.app_date_range, value: '1' }, { label: this.localeData?.entry_log_date, value: '0' }];
    }

    /**
     * To reset selected filter for audit log
     *
     * @memberof AuditLogsSidebarVM
     */
    public reset(): void {
        this.canManageCompany = false;
        this.selectedOperation = '';
        this.selectedEntity = '';
        this.selectedUserUniqueName = '';
        this.selectedGroupUniqueName = '';
        this.selectedAccountUniqueName = '';
        this.selectedFromDate = dayjs().toDate();
        this.selectedToDate = dayjs().toDate();
    }
}
