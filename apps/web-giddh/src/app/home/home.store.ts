import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { ToasterService } from "../services/toaster.service";
import { ContactService } from "../services/contact.service";

export interface HomeState {
    bankMessage: any;
    isBankRefreshing: boolean;
}

const DEFAULT_STATE: HomeState = {
    bankMessage: null,
    isBankRefreshing: false,
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
    readonly refreshBank = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ bankMessage: null, isBankRefreshing: true});
                return this.contactService.refreshBank().pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success" && res?.body) {
                                this.toaster.showSnackBar("success", res.body);
                                return this.patchState({ bankMessage: res.body, isBankRefreshing: false});
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ bankMessage: null, isBankRefreshing: false});
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ bankMessage: null, isBankRefreshing: false});
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });
}