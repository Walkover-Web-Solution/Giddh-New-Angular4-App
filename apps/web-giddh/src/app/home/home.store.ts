import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tap } from "rxjs/operators";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { ToasterService } from "../services/toaster.service";
import { ContactService } from "../services/contact.service";
import { AppState } from "../store";
import { Store } from "@ngrx/store";

/**
 * HomeState interface definition
 * Defines the structure and contract for HomeState objects
 */
export interface HomeState {
    bankMessage: any;
    isBankRefreshing: boolean;
    isBankRefreshingError: boolean;
}

const DEFAULT_STATE: HomeState = {
    bankMessage: null,
    isBankRefreshing: false,
    isBankRefreshingError: false
};

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * HomeComponentStore store
 * Manages homecomponent state using NgRx ComponentStore
 */
export class HomeComponentStore extends ComponentStore<HomeState> {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private toaster: ToasterService,
        private contactService: ContactService,
        private store: Store<AppState>
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_STATE);
    }

    public profile$: Observable<any> = this.select(this.store.select(profileObj => profileObj.settings.profile), (response) => response);

    /**
    *  Refresh go-cardless bank transactions
    *
    *  @memberof HomeComponentStore
    */
    readonly refreshGoCardlessBankTransactions = this.effect((accountUniqueName: Observable<string>) => {
        return accountUniqueName.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req: any) => {
                this.patchState({ bankMessage: null, isBankRefreshing: true, isBankRefreshingError: false });
                return this.contactService.refreshGoCardlessBankTransactions(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: any) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === "success" && res?.body) {
                                this.toaster.showSnackBar("success", res.body);
                                return this.patchState({ bankMessage: res.body, isBankRefreshing: false, isBankRefreshingError: false });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ bankMessage: null, isBankRefreshing: false, isBankRefreshingError: true });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ bankMessage: null, isBankRefreshing: false, isBankRefreshingError: null });
                        }
                    ),
                    /**
                     * Handles catchError functionality
                     */
                    catchError((err) => EMPTY)
                );
            })
        );
    });
}
