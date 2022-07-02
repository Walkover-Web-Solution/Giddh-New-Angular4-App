import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, EventEmitter, Input, OnDestroy } from '@angular/core';
import { SearchRequest } from '../models/api-models/Search';
import { SearchActions } from '../actions/search.actions';

@Component({
    selector: 'search',
    templateUrl: './search.component.html'
})
export class SearchComponent implements OnDestroy {
    public searchRequestEmitter = new EventEmitter<SearchRequest>();
    public _searchRequest: SearchRequest;
    public pageChangeEvent: any;
    public filterEventQuery: any;
    /** Stores the current branch unique name */
    public currentBranchUniqueName: string;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(private store: Store<AppState>, private searchActions: SearchActions) {
    }

    public get searchRequest(): SearchRequest {
        return this._searchRequest;
    }

    @Input()
    public set searchRequest(search: SearchRequest) {
        this.searchRequestEmitter.emit(search);
        this._searchRequest = search;
    }

    public ngOnDestroy(): void {
        this.store.dispatch(this.searchActions.ResetSearchState());
    }

    public paginationChanged(ev) {
        this.pageChangeEvent = ev;
    }

    public FilterByAPIEvent(ev) {
        this.filterEventQuery = ev; // this key is an input in search-sidebar component
    }

    /**
     * Stores the current branch switched
     *
     * @param {string} value Unique name of current branch
     * @memberof SearchComponent
     */
    public handleCurrentBranchChange(value: string): void {
        this.currentBranchUniqueName = value;
    }

}
