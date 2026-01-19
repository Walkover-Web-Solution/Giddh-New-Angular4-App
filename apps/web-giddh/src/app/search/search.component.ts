import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, EventEmitter, Input, OnDestroy } from '@angular/core';
import { SearchRequest } from '../models/api-models/Search';
import { SearchActions } from '../actions/search.actions';
import { remove } from '../lodash-optimized';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'search',
    templateUrl: './search.component.html',
    standalone: false
})
/**
 * SearchComponent component
 * Handles search functionality and user interactions
 */
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

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private store: Store<AppState>, private searchActions: SearchActions) {
        document.querySelector("body")?.classList?.add("search-filter");
    }

    public get searchRequest(): SearchRequest {
        return this._searchRequest;
    }

    @Input()
    public set searchRequest(search: SearchRequest) {
        this.searchRequestEmitter.emit(search);
        this._searchRequest = search;
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy(): void {
        document.querySelector("body")?.classList?.remove("search-filter");
        this.store.dispatch(this.searchActions.ResetSearchState());
    }

    /**
     * Handles paginationChanged functionality
     */
    public paginationChanged(ev) {
        this.pageChangeEvent = ev;
    }

    /**
     * Handles FilterByAPIEvent functionality
     */
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
