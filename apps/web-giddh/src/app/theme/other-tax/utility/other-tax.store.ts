import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { AppState } from "../../../store";
import { ToasterService } from "../../../services/toaster.service";

/**
 * OtherTaxState interface definition
 * Defines the structure and contract for OtherTaxState objects
 */
export interface OtherTaxState {
}

const DEFAULT_STATE: OtherTaxState = {
};

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * OtherTaxComponentStore store
 * Manages othertaxcomponent state using NgRx ComponentStore
 */
export class OtherTaxComponentStore extends ComponentStore<OtherTaxState> {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>,
        private toast: ToasterService
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_STATE);
    }

    public companyTaxes$: Observable<any> = this.select(this.store.select(state => state.company.taxes), (response) => response);

    /**
     * Shows errortoast element
     */
    private showErrorToast(type: any, message: any): void {
        /**
         * Handles if functionality
         */
        if (type === 'error') {
            this.toast.showSnackBar("error", message);
        } else {
            this.toast.showSnackBar("success", message);

        }
    }
}
