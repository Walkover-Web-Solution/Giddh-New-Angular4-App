
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, mergeMap } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "apps/web-giddh/src/app/store";
import { ToasterService } from "apps/web-giddh/src/app/services/toaster.service";
import { BaseResponse } from "apps/web-giddh/src/app/models/api-models/BaseResponse";
import { InvoiceService } from "../../../services/invoice.service";

export interface CustomEmailState {
    emailContentSuggestions: any;
    emailConditionSuggestions: any;
    emailTemplates: any;
    updateCustomEmailIsSuccess: any;
}

export const DEFAULT_CUSTOM_EMAIL_STATE: CustomEmailState = {
    emailContentSuggestions: null,
    emailConditionSuggestions: null,
    updateCustomEmailIsSuccess: null,
    emailTemplates:null
};

@Injectable()
export class CustomEmailComponentStore extends ComponentStore<CustomEmailState> implements OnDestroy {

    constructor(
        private toaster: ToasterService,
        private invoiceService: InvoiceService,
        private store: Store<AppState>
    ) {
        super(DEFAULT_CUSTOM_EMAIL_STATE);
    }

    public updateCustomEmailIsSuccess$ = this.select((state) => state.updateCustomEmailIsSuccess);

    readonly getEmailConditionSuggestion = this.effect((data: Observable<any>) => {
        return data.pipe(
            mergeMap(() => {
                return this.invoiceService.getEmailConditions().pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    emailConditionSuggestions: res.body ?? []
                                });
                            } else {
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    emailConditionSuggestions: []
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                emailConditionSuggestions: []
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly updateCustomTemplate = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ updateCustomEmailIsSuccess: null });
                return this.invoiceService.updateCustomEmailTemplate(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toaster.showSnackBar("success", res?.body);
                                return this.patchState({
                                    updateCustomEmailIsSuccess: res?.body ?? []
                                });
                            } else {
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    updateCustomEmailIsSuccess: []
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ updateCustomEmailIsSuccess: null });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getEmailContentSuggestions = this.effect((data: Observable<any>) => {
        return data.pipe(
            mergeMap(() => {
                return this.invoiceService.getEmailContent().pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    emailContentSuggestions: res.body ?? []
                                });
                            } else {
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    emailContentSuggestions: []
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                emailContentSuggestions: []
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getAllEmailTemplate = this.effect((data: Observable<any>) => {
        return data.pipe(
            mergeMap((req) => {
                return this.invoiceService.getEmailTemplate(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    emailTemplates: res.body ?? []
                                });
                            } else {
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    emailTemplates: []
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                emailTemplates: []
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
     * @memberof AdjustInventoryComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
