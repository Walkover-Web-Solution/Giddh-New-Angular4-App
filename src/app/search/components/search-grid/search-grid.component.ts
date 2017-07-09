import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as moment from 'moment';
import { AccountFlat, SearchDataSet } from '../../../models/api-models/Search';
import { AppState } from '../../../store/roots';
import { isUndefined } from 'util';
import { saveAs } from 'file-saver';
@Component({
  selector: 'search-grid',  // <home></home>
  templateUrl: './search-grid.component.html'
})
export class SearchGridComponent implements OnInit, OnDestroy {

  public showFromDatePicker: boolean;
  public showToDatePicker: boolean;
  public toDate: Date;
  public fromDate: Date;
  public moment = moment;
  public groupName: string;

  public searchResponse$: Observable<AccountFlat[]>;
  public searchLoader$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>) {
    this.searchResponse$ = this.store.select(p => p.search.value);
    this.searchLoader$ = this.store.select(p => p.search.searchLoader);
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    //
  }

  public filterData(searchQuery: SearchDataSet[]) {
    searchQuery.forEach((query) => {
      this.searchResponse$ = this.searchResponse$.take(1).filter((accounts) => {
        return !isUndefined(accounts.find((account) => {
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
        }));
      });
    });
  }

  public resetFilters(isFiltered) {
    if (!isFiltered) {
      this.searchResponse$ = this.store.select(p => p.search.value);
    }
  }

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

  public roundNum = (data, places) => {
    data = Number(data);
    data = data.toFixed(places);
    return data;
  }

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
}
