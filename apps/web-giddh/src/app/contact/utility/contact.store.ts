
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { ToasterService } from "../../services/toaster.service";
import { ContactService } from "../../services/contact.service";
import { Store } from "@ngrx/store";
import { AppState } from "../../store";

export interface ContactState {
    sendBulkEmailIsSuccess: boolean;
    getLastAccountsInProgress: boolean;
}

export const DEFAULT_CONTACT_STATE: ContactState = {
    sendBulkEmailIsSuccess: null,
    getLastAccountsInProgress: false
};

@Injectable()
export class ContactComponentStore extends ComponentStore<ContactState> implements OnDestroy {

    constructor(private toasterService: ToasterService,
        private contactService: ContactService,
        private store: Store<AppState>
    ) {
        super(DEFAULT_CONTACT_STATE);
    }

    public universalDate$: Observable<any> = this.select(this.store.select(state => state.session.applicationDate), (response) => response);
    public getLastAccountsInProgress$ = this.select((state) => state.getLastAccountsInProgress);

    /**
     * Send email template
     *
     * @memberof ContactComponentStore
     */
    readonly sendBulkEmailTemplate = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ sendBulkEmailIsSuccess: false });
                return this.contactService.sendBulkEmailTemplate(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                res?.body && this.toasterService.showSnackBar('success', res?.body);
                                return this.patchState({
                                    sendBulkEmailIsSuccess: true
                                });
                            } else {
                                if (res?.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    sendBulkEmailIsSuccess: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);

                            return this.patchState({
                                sendBulkEmailIsSuccess: false
                            });
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
     * @memberof ContactComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
