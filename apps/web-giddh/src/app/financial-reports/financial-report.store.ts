import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, of, mergeMap } from "rxjs";
import { AppState } from "../store";
import { Store } from "@ngrx/store";

export interface FinancialReportsState {

}

const DEFAULT_STATE: FinancialReportsState = {

};

@Injectable()
export class FinancialReportsComponentStore extends ComponentStore<FinancialReportsState> {

    constructor(
        private store: Store<AppState>
    ) {
        super(DEFAULT_STATE);
    }

    public universalDate$: Observable<any> = this.select(this.store.select(state => state.session.applicationDate), (response) => response);

}

