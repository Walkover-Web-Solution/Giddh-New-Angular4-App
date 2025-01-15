import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { ToasterService } from "../services/toaster.service";
import { ContactService } from "../services/contact.service";
import { AppState } from "../store";
import { Store } from "@ngrx/store";

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

@Injectable()
export class HomeComponentStore extends ComponentStore<HomeState> {

    constructor(
        private toaster: ToasterService,
        private contactService: ContactService,
        private store: Store<AppState>
    ) {
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
            switchMap((req: any) => {
                this.patchState({ bankMessage: null, isBankRefreshing: true, isBankRefreshingError: false });
                return this.contactService.refreshGoCardlessBankTransactions(req).pipe(
                    tapResponse(
                        (res: any) => {
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
                    catchError((err) => EMPTY)
                );
            })
        );
    });
}