import { UserDetails } from '../../../models/api-models/loginModels';
import { CompanyResponse } from '../../../models/api-models/Company';

import * as moment from 'moment/moment';
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
    public moment = moment;
    /** Audit log form's company operations list */
    public filters: IOption[] = [];
    /** Audit log form's company entity type list */
    public entities: IOption[] = [];
    /** Observer to get logs in progress */
    public getLogsInprocess$: Observable<boolean>;
    /** Date range options */
    public dateOptions: IOption[] = [{ label: 'Date Range', value: '1' }, { label: 'Entry/Log Date', value: '0' }];
    /** Check for manage company  */
    public canManageCompany: boolean = false;
    /** Selected operation type */
    public selectedOperation: string = '';
    /** Selected entry type */
    public selectedEntity: string = '';
    /** Selected user unique name */
    public selectedUserUniqueName: string = '';
    /** Selected group unique name */
    public selectedGroupUnq: string = '';
    /** Selected from date */
    public selectedFromDate: Date;
    /** Selected to date */
    public selectedToDate: Date;

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
        this.selectedGroupUnq = '';
        this.selectedFromDate = moment().toDate();
        this.selectedToDate = moment().toDate();
    }
}
