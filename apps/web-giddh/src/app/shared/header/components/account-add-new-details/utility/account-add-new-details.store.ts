
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "apps/web-giddh/src/app/store";

export interface AddNewDetaileState {
}

const DEFAULT_STATE: AddNewDetaileState = {
};

@Injectable()
export class AccountAddNewDetailsComponentStore extends ComponentStore<AddNewDetaileState> implements OnDestroy {

    constructor(
        private store: Store<AppState>
    ) {
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
