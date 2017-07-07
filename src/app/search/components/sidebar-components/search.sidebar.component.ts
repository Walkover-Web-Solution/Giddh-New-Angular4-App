import { AppState } from '../../../store/roots';

import { Store } from '@ngrx/store';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginActions } from '../services/actions/login.action';
import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as moment from 'moment';
import { SearchRequest } from '../../../models/api-models/Search';
import { SearchActions } from '../../../services/actions/search.actions';

@Component({
  selector: 'search-sidebar',  // <home></home>
  templateUrl: './search.sidebar.component.html'
})
export class SearchSidebarComponent implements OnInit, OnDestroy {

  public showFromDatePicker: boolean;
  public showToDatePicker: boolean;
  public toDate: Date;
  public fromDate: Date;
  public moment = moment;
  public groupName: string;

  public searchLoader$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, public searchActions: SearchActions) {
  }

  public ngOnInit() {
    //

  }

  public getClosingBalance(isRefresh: boolean) {
    let searchRequest: SearchRequest = {
      groupName: this.groupName,
      refresh: isRefresh,
      toDate: moment(this.toDate).format('DD/MM/YYYY'),
      fromDate: moment(this.fromDate).format('DD/MM/YYYY')
    };
    this.store.dispatch(this.searchActions.GetStocksReport(searchRequest));
  }

  public ngOnDestroy() {
    //
  }
}
