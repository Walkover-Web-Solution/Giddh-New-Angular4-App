import { UserDetails } from '../../../models/api-models/loginModels';
import { CompanyResponse } from '../../../models/api-models/Company';

import * as moment from 'moment/moment';
import { Observable } from 'rxjs';
import { GroupsWithAccountsResponse } from '../../../models/api-models/GroupsWithAccounts';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';

export class AuditLogsSidebarVM {
	public user$: Observable<UserDetails>;
	public accounts$: Observable<IOption[]>;
	public groupsList$: Observable<GroupsWithAccountsResponse[]>;
	public groups$: Observable<IOption[]>;
	public users$: Observable<IOption[]>;
	public moment = moment;
	public maxDate: Date = moment().toDate();
	public filters: IOption[] = [
		// { label: 'All', value: 'All' },
		// { label: 'create', value: 'create' },
		// { label: 'delete', value: 'delete' },
		// { label: 'share', value: 'share' },
		// { label: 'unshare', value: 'unshare' },
		// { label: 'move', value: 'move' },
		// { label: 'merge', value: 'merge' },
		// { label: 'unmerge', value: 'unmerge' },
		// { label: 'delete-all', value: 'delete-all' },
		// { label: 'update', value: 'update' },
		// { label: 'master-import', value: 'master-import' },
		// { label: 'daybook-import', value: 'daybook-import' },
		// { label: 'ledger-excel-import', value: 'ledger-excel-import' }
	];
	public entities: IOption[] = [
		// { label: 'All', value: 'All' },
		// { label: 'company', value: 'company' },
		// { label: 'group', value: 'group' },
		// { label: 'account', value: 'account' },
		// { label: 'ledger', value: 'ledger' },
		// { label: 'voucher', value: 'voucher' },
		// { label: 'logs', value: 'logs' },
		// { label: 'invoice', value: 'invoice' },
	];
	public getLogsInprocess$: Observable<boolean>;
	public dateOptions: IOption[] = [{ label: 'Date Range', value: '1' }, { label: 'Entry/Log Date', value: '0' }];
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

	public reset() {
		this.showLogDatePicker = false;
		this.canManageCompany = false;
		this.selectedOperation = '';
		this.selectedEntity = '';
		this.selectedUserUnq = '';
		this.selectedAccountUnq = '';
		this.selectedGroupUnq = '';
		this.selectedFromDate = moment().toDate();
		this.selectedToDate = moment().toDate();
		this.selectedLogDate = moment().toDate();
		this.selectedEntryDate = moment().toDate();
		this.logOrEntry = 'entryDate';
		this.selectedDateOption = '';

	}
}
