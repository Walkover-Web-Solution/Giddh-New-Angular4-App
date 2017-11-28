import { AppState } from '../../../store/roots';
import * as _ from '../../../lodash-optimized';
import { Store } from '@ngrx/store';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as moment from 'moment/moment';
import { SearchRequest } from '../../../models/api-models/Search';
import { SearchActions } from '../../../actions/search.actions';
import { GroupService } from '../../../services/group.service';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { GroupsWithAccountsResponse } from '../../../models/api-models/GroupsWithAccounts';
import { Observable } from 'rxjs/Observable';

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
  public groupUniqueName: string;
  public dataSource = [];
  public groupsList$: Observable<GroupsWithAccountsResponse[]>;
  public typeaheadNoResults: boolean;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, public searchActions: SearchActions, private _groupService: GroupService) {
    this.groupsList$ = this.store.select(p => p.general.groupswithaccounts).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.fromDate = moment().subtract(1, 'month').toDate();
    //
    // Get source for Group Name Input selection
    this.groupsList$.subscribe(data => {
      if (data && data.length) {
        let accountList = this.flattenGroup(data, []);
        let groups = [];
        accountList.map((d: any) => {
          groups.push({name: d.name, id: d.uniqueName});
        });
        this.dataSource = groups;
      }
    });
  }

  public getClosingBalance(isRefresh: boolean, event: any) {
    if (this.typeaheadNoResults) {
      this.groupName = '';
      this.groupUniqueName = '';
    }

    let searchRequest: SearchRequest = {
      groupName: this.groupUniqueName,
      refresh: isRefresh,
      toDate: moment(this.toDate).format('DD-MM-YYYY'),
      fromDate: moment(this.fromDate).format('DD-MM-YYYY')
    };
    this.store.dispatch(this.searchActions.GetStocksReport(searchRequest));
    event.target.blur();
  }

  public changeTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public OnSelectGroup(g: TypeaheadMatch) {
    this.groupName = g.item.name;
    this.groupUniqueName = g.item.id;
  }

  public flattenGroup(rawList: any[], parents: any[] = []) {
    let listofUN;
    listofUN = _.map(rawList, (listItem) => {
      let newParents;
      let result;
      newParents = _.union([], parents);
      newParents.push({
        name: listItem.name,
        uniqueName: listItem.uniqueName
      });
      listItem = Object.assign({}, listItem, {parentGroups: []});
      listItem.parentGroups = newParents;
      if (listItem.groups.length > 0) {
        result = this.flattenGroup(listItem.groups, newParents);
        result.push(_.omit(listItem, 'groups'));
      } else {
        result = _.omit(listItem, 'groups');
      }
      return result;
    });
    return _.flatten(listofUN);
  }
}
