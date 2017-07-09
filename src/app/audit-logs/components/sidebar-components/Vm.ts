import { Select2OptionData } from '../../../shared/theme/select2/select2.interface';

import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
export class AuditLogsSidebarVM {
  public showFromDatePicker: boolean = false;
  public showToDatePicker: boolean = false;
  public showLogDatePicker: boolean = false;
  public options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select Option',
    allowClear: true
  };
  public moment = moment;
  public filters: any[] = ['All', 'create', 'delete', 'share', 'unshare', 'move', 'merge', 'unmerge', 'delete-all', 'update', 'master-import', 'daybook-import', 'ledger-excel-import'];
  public entities: any[] = ['All', 'company', 'group', 'account', 'ledger', 'voucher', 'logs'];
  public selectedOperation: string = '';
  public selectedEntity: string = '';
  public selectedUserUnq: string = '';
  public selectedAccountUnq: string = '';
  public accounts$: Observable<Select2OptionData[]>;
  public groups$: Observable<Select2OptionData[]>;
  public selectedGroupUnq: string = '';
  public selectedFromDate: Date;
  public selectedToDate: Date;
  public selectedLogDate: Date;
  public selectedEntryDate: Date;
  public logOrEntry: string = '';
  public dateOptions: any[] = [{ text: 'Date Range', id: 1 }, { text: 'Entry/Log Date', id: 0 }];
  public selectedDateOption: string = '';
}
