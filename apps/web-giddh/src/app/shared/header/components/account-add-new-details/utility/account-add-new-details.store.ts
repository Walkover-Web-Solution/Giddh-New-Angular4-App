
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "apps/web-giddh/src/app/store";

/**
 * AddNewDetaileState interface definition
 * Defines the structure and contract for AddNewDetaileState objects
 */
export interface AddNewDetaileState {
}

const DEFAULT_STATE: AddNewDetaileState = {
};

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * AccountAddNewDetailsComponentStore store
 * Manages accountaddnewdetailscomponent state using NgRx ComponentStore
 */
export class AccountAddNewDetailsComponentStore extends ComponentStore<AddNewDetaileState> implements OnDestroy {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_STATE);
    }
    // getting branch list
    public branchList$: Observable<any> = this.select(this.store.select(state => state.settings.branches), (response) => response);


    /**
     * Lifecycle hook for component destroy
     *
     * @memberof AccountAddNewDetailsComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
