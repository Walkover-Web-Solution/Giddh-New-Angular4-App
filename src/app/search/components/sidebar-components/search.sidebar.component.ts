import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { AppState } from '../../../store/roots';

import { Store } from '@ngrx/store';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginActions } from '../services/actions/login.action';
import { Observable } from 'rxjs/Rx';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';

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
  public searchForm: FormGroup;
  public searchLoader$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private _fb: FormBuilder) {
  }

  public ngOnInit() {
    //
    this.searchForm = this._fb.group({
      groupname: ['', [Validators.required]],
      fromdate: ['', [Validators.required]],
      todate: ['', [Validators.required]],
      isSelfParent: [true]
    });
  }

  public ngOnDestroy() {
    //
  }
}
