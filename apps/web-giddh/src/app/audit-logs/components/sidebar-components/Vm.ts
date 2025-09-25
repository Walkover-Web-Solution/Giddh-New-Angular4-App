import { UserDetails } from '../../../models/api-models/loginModels';
import { CompanyResponse } from '../../../models/api-models/Company';
import * as dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { GroupsWithAccountsResponse } from '../../../models/api-models/GroupsWithAccounts';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';

export class AuditLogsSidebarVM {
    public user$: Observable<UserDetails>;
    public accounts$: Observable<IOption[]>;
    public groupsList$: Observable<GroupsWithAccountsResponse[]>;
    public groups$: Observable<IOption[]>;
    public users$: Observable<IOption[]>;
    public options: Select2Options = {};
    public dayjs = dayjs;
    public maxDate: Date = dayjs().toDate();
    public filters: IOption[];
    public entities: IOption[];
    public selectedCompany: Observable<CompanyResponse>;
    public getLogsInprocess$: Observable<boolean>;
    public dateOptions: IOption[];
    public showLogDatePicker: boolean = false;
    public canManageCompany: boolean = false;
    public selectedOperation: string = '';
    public selectedEntity: string = '';
    public selectedUserUnq: string = '';
    public selectedAccountUnq: string = '';
    public selectedGroupUnq: string = '';
    public selectedFromDate: Date;
    public selectedToDate: Date;
    public selectedLogDate: Date;
    public selectedEntryDate: Date;
    public logOrEntry: string = 'entryDate';
    public selectedDateOption: string = '0';

    constructor(private localeData, private commonLocaleData) {
        this.options = {
            multiple: false,
            width: '100%',
            placeholder: this.commonLocaleData?.app_select_option,
            allowClear: true
        };

        this.dateOptions = [{ label: this.commonLocaleData?.app_date_range, value: '1' }, { label: this.localeData?.entry_log_date, value: '0' }];

        this.filters = [
            { label: this.localeData?.filters.all, value: 'All' },
            { label: this.localeData?.filters.create, value: 'create' },
            { label: this.localeData?.filters.delete, value: 'delete' },
            { label: this.localeData?.filters.share, value: 'share' },
            { label: this.localeData?.filters.unshare, value: 'unshare' },
            { label: this.localeData?.filters.move, value: 'move' },
            { label: this.localeData?.filters.merge, value: 'merge' },
            { label: this.localeData?.filters.unmerge, value: 'unmerge' },
            { label: this.localeData?.filters.delete_all, value: 'delete-all' },
            { label: this.localeData?.filters.update, value: 'update' },
            { label: this.localeData?.filters.master_import, value: 'master-import' },
            { label: this.localeData?.filters.daybook_import, value: 'daybook-import' },
            { label: this.localeData?.filters.ledger_excel_import, value: 'ledger-excel-import' }
        ];

        this.entities = [
            { label: this.localeData?.entities.all, value: 'All' },
            { label: this.localeData?.entities.company, value: 'company' },
            { label: this.localeData?.entities.group, value: 'group' },
            { label: this.localeData?.entities.account, value: 'account' },
            { label: this.localeData?.entities.ledger, value: 'ledger' },
            { label: this.localeData?.entities.voucher, value: 'voucher' },
            { label: this.localeData?.entities.logs, value: 'logs' },
            { label: this.localeData?.entities.invoice, value: 'invoice' },
        ];
    }

    public reset() {
        this.showLogDatePicker = false;
        this.canManageCompany = false;
        this.selectedOperation = '';
        this.selectedEntity = '';
        this.selectedUserUnq = '';
        this.selectedAccountUnq = '';
        this.selectedGroupUnq = '';
        this.selectedFromDate = dayjs().toDate();
        this.selectedToDate = dayjs().toDate();
        this.selectedLogDate = dayjs().toDate();
        this.selectedEntryDate = dayjs().toDate();
        this.logOrEntry = 'entryDate';
        this.selectedDateOption = '';
    }
}
