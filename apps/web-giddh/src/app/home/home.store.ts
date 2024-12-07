import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { ToasterService } from "../services/toaster.service";
import { ContactService } from "../services/contact.service";

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
        private contactService: ContactService
    ) {
        super(DEFAULT_STATE);
    }

    /**
    *  Refresh bank accounts
    *
    *  @memberof HomeComponentStore
    */
    readonly refreshBank = this.effect((accountUniqueName: Observable<string>) => {
        return accountUniqueName.pipe(
            switchMap((req: any) => {
                this.patchState({ bankMessage: null, isBankRefreshing: true, isBankRefreshingError: false });
                return this.contactService.refreshBank(req).pipe(
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

