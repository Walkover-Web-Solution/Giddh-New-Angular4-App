import { UserDetails } from '../../../models/api-models/loginModels';
import { ComapnyResponse } from '../../../models/api-models/Company';
import { Select2OptionData } from '../../../shared/theme/select2/select2.interface';

import * as moment from 'moment/moment';
import { Observable } from 'rxjs/Observable';
export class AuditLogsSidebarVM {
  public user$: Observable<UserDetails>;
  public accounts$: Observable<Select2OptionData[]>;
  public groups$: Observable<Select2OptionData[]>;
  public users$: Observable<Select2OptionData[]>;
  public options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select Option',
    allowClear: true
  };
  public moment = moment;
  public maxDate: Date = moment().toDate();
  public filters: any[] = [
    { text: 'All', id: 'All' },
    { text: 'create', id: 'create' },
    { text: 'delete', id: 'delete' },
    { text: 'share', id: 'share' },
    { text: 'unshare', id: 'unshare' },
    { text: 'move', id: 'move' },
    { text: 'merge', id: 'merge' },
    { text: 'unmerge', id: 'unmerge' },
    { text: 'delete-all', id: 'delete-all' },
    { text: 'update', id: 'update' },
    { text: 'master-import', id: 'master-import' },
    { text: 'daybook-import', id: 'daybook-import' },
    { text: 'ledger-excel-import', id: 'ledger-excel-import' }
  ];
  public entities: any[] = [
    { text: 'All', id: 'All' },
    { text: 'company', id: 'company' },
    { text: 'group', id: 'group' },
    { text: 'account', id: 'account' },
    { text: 'ledger', id: 'ledger' },
    { text: 'voucher', id: 'voucher' },
    { text: 'logs', id: 'logs' }];
  public selectedCompany: Observable<ComapnyResponse>;
  public getLogsInprocess$: Observable<boolean>;
  public dateOptions: any[] = [{ text: 'Date Range', id: 1 }, { text: 'Entry/Log Date', id: 0 }];
  public showFromDatePicker: boolean = false;
  public showToDatePicker: boolean = false;
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
    this.showFromDatePicker = false;
    this.showToDatePicker = false;
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
