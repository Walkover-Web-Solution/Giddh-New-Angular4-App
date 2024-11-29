import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, of, mergeMap } from "rxjs";
import { ToasterService } from "../services/toaster.service";
import { Store } from "@ngrx/store";
import { AppState } from "../store";
import { ContactService } from "../services/contact.service";

export interface HomeState {
    bankMessage: any;
}

const DEFAULT_STATE: HomeState = {
    bankMessage: null
};

@Injectable()
export class HomeComponentStore extends ComponentStore<HomeState> {

    constructor(
        private toaster: ToasterService,
        private ContactService: ContactService,
        // private store: Store<AppState>
    ) {
        super(DEFAULT_STATE);
    }

    /**
    *   refresh bank accounts
    *
    * @memberof HomeComponentStore
    */
    readonly refreshBank = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ bankMessage: null });
                return this.ContactService.refreshBank().pipe(
                    tapResponse(
                        (res: any) => {
                            console.log("res", res);
                            if (res?.status === "success") {
                                res?.body && this.toaster.showSnackBar("success", res.body);
                                return this.patchState({ bankMessage: res.body });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ bankMessage: null });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ bankMessage: null });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });
}

