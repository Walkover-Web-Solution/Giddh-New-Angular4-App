import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, EventEmitter, Input, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SearchRequest } from '../models/api-models/Search';
import { ComapnyResponse } from '../models/api-models/Company';
import { TlPlActions } from '../services/actions/tl-pl.actions';
import * as _ from 'lodash';

@Component({
  selector: 'search',
  templateUrl: './tl-pl.component.html'
})
export class TlPlComponent implements OnInit, AfterViewInit {
  public request: {
    refresh: boolean;
    fromDate: any;
    toDate: any;
  };
  public selectedCompany: ComapnyResponse;
  public searchRequestEmitter = new EventEmitter<SearchRequest>();
  public _searchRequest: SearchRequest;

  @Input()
  public set searchRequest(search: SearchRequest) {
    this.searchRequestEmitter.emit(search);
    this._searchRequest = search;
  }

  public get searchRequest(): SearchRequest {
    return this._searchRequest;
  }

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef, public tlPlActions: TlPlActions) {
    this.store.select(p => p.company.companies && p.company.companies.find(q => q.uniqueName === p.session.companyUniqueName)).subscribe(p => {
      this.selectedCompany = p;
      if (p) {
        this.request = {
          refresh: false,
          fromDate: this.selectedCompany.activeFinancialYear.financialYearStarts,
          toDate: this.selectedCompany.activeFinancialYear.financialYearEnds
        };
        this.store.dispatch(this.tlPlActions.GetTrialBalance(_.cloneDeep(this.request)));
      }
    });
  }

  public ngOnInit() {
    console.log('hello TlPl module');
    // this.exampleData = [
    // ];
  }
  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
