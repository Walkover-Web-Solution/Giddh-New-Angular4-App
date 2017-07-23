import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { SearchRequest } from '../models/api-models/Search';
import { SearchActions } from '../services/actions/search.actions';

@Component({
  selector: 'search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, OnDestroy {
  public searchRequestEmitter = new EventEmitter<SearchRequest>();
  public _searchRequest: SearchRequest;

  @Input()
  public set searchRequest(search: SearchRequest) {
    this.searchRequestEmitter.emit(search);
    this._searchRequest = search;
    console.log(search);
  }

  public get searchRequest(): SearchRequest {
    return this._searchRequest;
  }

  constructor(private store: Store<AppState>, private _searchActions: SearchActions) {
  }

  public ngOnInit() {
    console.log('hello Search module');
    // this.exampleData = [
    // ];
  }

  public ngOnDestroy(): void {
    this.store.dispatch(this._searchActions.ResetSearchState());
  }
}
