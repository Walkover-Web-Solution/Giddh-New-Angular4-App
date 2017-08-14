import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as moment from 'moment';
import { AccountFlat, BulkEmailRequest, SearchDataSet, SearchRequest } from '../../../models/api-models/Search';
import { AppState } from '../../../store/roots';
import { isNullOrUndefined } from 'util';
import { saveAs } from 'file-saver';
import * as _ from 'lodash';
import { ModalDirective } from 'ngx-bootstrap';
import { CompanyService } from '../../../services/companyService.service';
import { ToasterService } from '../../../services/toaster.service';
@Component({
  selector: 'search-grid',  // <home></home>
  templateUrl: './search-grid.component.html'
})
export class SearchGridComponent implements OnInit, OnDestroy {
  public moment = moment;
  public companyUniqueName: string;
  public searchResponse$: Observable<AccountFlat[]>;
  public searchResponseFiltered$: Observable<AccountFlat[]>;
  public searchLoader$: Observable<boolean>;
  public search$: Observable<boolean>;
  public messageBody = {
    header: {
      email: 'Send Email',
      sms: 'Send Sms',
      set: ''
    },
    btn: {
      email: 'Send Email',
      sms: 'Send Sms',
      set: '',
    },
    type: '',
    msg: '',
    subject: ''
  };
  public dataVariables = [
    {
      name: 'Opening Balance',
      value: '%s_OB',
    },
    {
      name: 'Closing Balance',
      value: '%s_CB',
    },
    {
      name: 'Credit Total',
      value: '%s_CT',
    },
    {
      name: 'Debit Total',
      value: '%s_DT',
    },
    {
      name: 'From Date',
      value: '%s_FD',
    },
    {
      name: 'To Date',
      value: '%s_TD',
    },
    {
      name: 'Magic Link',
      value: '%s_ML',
    },
    {
      name: 'Account Name',
      value: '%s_AN',
    },
  ];
  @ViewChild('mailModal') public mailModal: ModalDirective;
  public searchRequest$: Observable<SearchRequest>;

  public get sortType(): string {
    return this._sortType;
  }

  // sorting by sortype
  public set sortType(value: string) {
    this._sortType = value;
    this.sortReverse = this._sortReverse;
  }

  public get sortReverse(): boolean {
    return this._sortReverse;
  }

  // reversing sort
  public set sortReverse(value: boolean) {
    this._sortReverse = value;
    this.searchResponseFiltered$ = this.searchResponseFiltered$.map(p => _.cloneDeep(p).sort((a, b) => (value ? -1 : 1) * a[this._sortType].toString().localeCompare(b[this._sortType])));
  }

  private _sortReverse: boolean;
  private _sortType: string;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private _companyServices: CompanyService, private _toaster: ToasterService) {
    this.searchResponse$ = this.store.select(p => p.search.value);
    // this.searchResponse$.subscribe(p => this.searchResponseFiltered$ = this.searchResponse$);
    this.searchResponseFiltered$ = this.searchResponse$.map(p => _.cloneDeep(p).sort((a, b) => a['name'].toString().localeCompare(b['name'])));
    this.searchLoader$ = this.store.select(p => p.search.searchLoader);
    this.search$ = this.store.select(p => p.search.search);
    this.searchRequest$ = this.store.select(p => p.search.searchRequest);
    this.store.select(p => p.session.companyUniqueName).take(1).subscribe(p => this.companyUniqueName = p);
  }

  public ngOnInit() {
    //
    this.sortType = 'name';
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  // Filter data of table By Filters
  public filterData(searchQuery: SearchDataSet[]) {
    searchQuery.forEach((query) => {
      this.searchResponseFiltered$ = this.searchResponse$.map((accounts) => {
        return accounts.filter((account) => {
          let amount;
          amount = +query.amount;
          switch (query.queryDiffer) {
            case 'Greater':
              if (amount === 0) {
                return account[query.queryType] > amount;
              } else {
                if (query.queryType === 'openingBalance') {
                  return account.openingBalance > amount && account.openBalType === query.balType;
                }
                if (query.queryType === 'closingBalance') {
                  return account.closingBalance > amount && account.closeBalType === query.balType;
                } else {
                  return account[query.queryType] > amount;
                }
              }
            case 'Less':
              if (amount === 0) {
                return account[query.queryType] < amount;
              } else {
                if (query.queryType === 'openingBalance') {
                  return account.openingBalance < amount && account.openBalType === query.balType;
                }
                if (query.queryType === 'closingBalance') {
                  return account.closingBalance < amount && account.closeBalType === query.balType;
                } else {
                  return account[query.queryType] < amount;
                }
              }
            case 'Equals':
              if (amount === 0) {
                return account[query.queryType] === amount;
              } else {
                if (query.queryType === 'openingBalance') {
                  return account.openingBalance === amount && account.openBalType === query.balType;
                }
                if (query.queryType === 'closingBalance') {
                  return account.closingBalance === amount && account.closeBalType === query.balType;
                } else {
                  return account[query.queryType] === amount;
                }
              }
            default:
          }
        });
      });
    });
  }

  // Reset Filters and show all
  public resetFilters(isFiltered) {
    if (!isFiltered) {
      this.searchResponseFiltered$ = this.searchResponse$;
    }
  }

  // CSV Headers
  public getCSVHeader = () => [
    'Name',
    'UniqueName',
    'Opening Bal.',
    'O/B Type',
    'DR Total',
    'CR Total',
    'Closing Bal.',
    'C/B Type',
    'Parent']

  // Rounding numbers
  public roundNum = (data, places) => {
    data = Number(data);
    data = data.toFixed(places);
    return data;
  }

  // Save CSV File with data from Table...
  public createCSV() {
    let blob;
    let csv;
    let header;
    let row;
    let title;
    header = this.getCSVHeader();
    title = '';
    header.forEach((head) => {
      return title += head + ',';
    });
    title = title.replace(/.$/, '');
    title += '\r\n';
    row = '';
    this.searchResponse$.take(1).subscribe(p => p.forEach((data) => {
      if (data.name.indexOf(',')) {
        data.name.replace(',', '');
      }
      row += data.name + ',' + data.uniqueName + ',' + this.roundNum(data.openingBalance, 2) + ',' + data.openBalType + ',' + this.roundNum(data.debitTotal, 2) + ',' + this.roundNum(data.creditTotal, 2) + ',' + this.roundNum(data.closingBalance, 2) + ',' + data.closeBalType + ',' + data.parent;
      return row += '\r\n';
    }));
    csv = title + row;
    blob = new Blob([csv], {
      type: 'application/octet-binary'
    });
    return saveAs(blob, 'demo' + '.csv');
  }

  // Add Selected Value to Message Body
  public addValueToMsg(val: any) {
    this.messageBody.msg += ` ${val.value} `;
  }

  // Open Modal for Email
  public openEmailDialog() {
    this.messageBody.msg = '';
    this.messageBody.type = 'Email';
    this.messageBody.btn.set = this.messageBody.btn.email;
    this.messageBody.header.set = this.messageBody.header.email;
    this.mailModal.show();
  }

  // Open Modal for SMS
  public openSmsDialog() {
    this.messageBody.msg = '';
    this.messageBody.type = 'sms';
    this.messageBody.btn.set = this.messageBody.btn.sms;
    this.messageBody.header.set = this.messageBody.header.sms;
    this.mailModal.show();
  }

  // Send Email/Sms for Accounts
  public send() {
    let accountsUnqList = [];
    this.searchResponseFiltered$.take(1).subscribe(p => {
      p.map(i => accountsUnqList.push(i.uniqueName));
    });
    accountsUnqList = _.uniq(accountsUnqList);
    // this.searchResponse$.forEach(p => accountsUnqList.push(_.reduce(p, (r, v, k) => v.uniqueName, '')));

    this.searchRequest$.take(1).subscribe(p => {
      if (isNullOrUndefined(p)) {
        return;
      }
      let request: BulkEmailRequest = {
        data: {
          message: this.messageBody.msg,
          accounts: accountsUnqList,
        },
        params: {
          from: p.fromDate,
          to: p.toDate
        }
      };
      if (this.messageBody.btn.set === 'Send Email') {
        return this._companyServices.sendEmail(request)
          .subscribe((r) => r.status === 'success' ? this._toaster.successToast(r.body) : this._toaster.errorToast(r.message));
      } else if (this.messageBody.btn.set === 'Send Sms') {
        return this._companyServices.sendSms(request)
          .subscribe((r) => r.status === 'success' ? this._toaster.successToast(r.body) : this._toaster.errorToast(r.message));
      }
    });
    this.mailModal.hide();
  }
}
