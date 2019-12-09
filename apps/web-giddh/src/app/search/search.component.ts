import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { SearchRequest } from '../models/api-models/Search';
import { SearchActions } from '../actions/search.actions';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';

@Component({
    selector: 'search',
    templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, OnDestroy {
    public searchRequestEmitter = new EventEmitter<SearchRequest>();

    public _searchRequest: SearchRequest;
    public pageChangeEvent: any;
    public filterEventQuery: any;

    constructor(private store: Store<AppState>, private _searchActions: SearchActions, private companyActions: CompanyActions) {
    }

    public get searchRequest(): SearchRequest {
        return this._searchRequest;
    }

    @Input()
    public set searchRequest(search: SearchRequest) {
        this.searchRequestEmitter.emit(search);
        this._searchRequest = search;
    }

    public ngOnInit() {
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'search';

        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    }

    public ngOnDestroy(): void {
        this.store.dispatch(this._searchActions.ResetSearchState());
    }

    public paginationChanged(ev) {
        this.pageChangeEvent = ev;
    }

    public FilterByAPIEvent(ev) {
        this.filterEventQuery = ev; // this key is an input in search-sidebar component
    }
}
