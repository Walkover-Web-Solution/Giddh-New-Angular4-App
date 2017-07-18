import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { SearchRequest } from '../models/api-models/Search';

@Component({
  selector: 'search',
  templateUrl: './tl-pl.component.html'
})
export class TlPlComponent implements OnInit {
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

  constructor(private store: Store<AppState>) {
  }

  public ngOnInit() {
    console.log('hello TlPl module');
    // this.exampleData = [
    // ];
  }
}
