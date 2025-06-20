import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { ToasterService } from "../../../services/toaster.service";
import { catchError, EMPTY, Observable, switchMap } from "rxjs";
import { InvoiceService } from "../../../services/invoice.service";

export interface TriggerState {
    triggerList: any;
}

const DEFAULT_STATE: TriggerState = {
    triggerList: null
};

@Injectable()
export class TriggerComponentStore extends ComponentStore<TriggerState> {

    constructor(
        private toaster: ToasterService,
        private invoiceService: InvoiceService,
        // private store: Store<AppState>
    ) {
        super(DEFAULT_STATE);
    }

    public triggerList$ = this.select((state) => state.triggerList);
    // public profile$: Observable<any> = this.select(this.store.select(profileObj => profileObj.settings.profile), (response) => response);

    /**
    *  Get trigger list
    *
    *  @memberof TriggerComponentStore
    */
    readonly getTriggerList = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ triggerList: null });
                return this.invoiceService.getTriggerList().pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success" && res?.body) {
                                this.toaster.showSnackBar("success", res.body);
                                return this.patchState({ triggerList: res.body });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ triggerList: null });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ triggerList: null });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

     /**
     * Lifecycle hook for component destroy
     *
     * @memberof TriggerComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}