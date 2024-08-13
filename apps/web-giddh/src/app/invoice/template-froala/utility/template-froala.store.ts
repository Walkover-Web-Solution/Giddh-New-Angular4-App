
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, mergeMap } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "apps/web-giddh/src/app/store";
import { InventoryService } from "apps/web-giddh/src/app/services/inventory.service";
import { ToasterService } from "apps/web-giddh/src/app/services/toaster.service";
import { BaseResponse } from "apps/web-giddh/src/app/models/api-models/BaseResponse";
import { GroupService } from "apps/web-giddh/src/app/services/group.service";
import { InvoiceService } from "../../../services/invoice.service";

export interface CustomEmailState {
    emailContentSuggestions: any;
    emailConditionSuggestions: any;
    emailTemplates: any;
    createCustomEmailInProgress: boolean;
    createCustomEmailIsSuccess: any;
    updateCustomEmailInProgress: boolean;
    updateCustomEmailIsSuccess: any;
}

export const DEFAULT_CUSTOM_EMAIL_STATE: CustomEmailState = {
    emailContentSuggestions: null,
    emailConditionSuggestions: null,
    createCustomEmailInProgress: false,
    createCustomEmailIsSuccess: null,
    updateCustomEmailInProgress: false,
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

    public createCustomEmailInProgress$ = this.select((state) => state.createCustomEmailInProgress);
    public createCustomEmailIsSuccess$ = this.select((state) => state.createCustomEmailIsSuccess);
    public updateCustomEmailInProgress$ = this.select((state) => state.updateCustomEmailInProgress);
    public updateCustomEmailIsSuccess$ = this.select((state) => state.updateCustomEmailIsSuccess);


    readonly createCustomTemplate = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                return this.invoiceService.createCustomEmailTemplate(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    createCustomEmailInProgress:false,
                                    createCustomEmailIsSuccess: res?.body ?? []
                                });
                            } else {
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    createCustomEmailIsSuccess: [],
                                    createCustomEmailInProgress: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ createCustomEmailIsSuccess: [], createCustomEmailInProgress: false });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getEmailConditionSuggestion = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap(() => {
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
                return this.invoiceService.updateCustomEmailTemplate(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    updateCustomEmailInProgress: false,
                                    updateCustomEmailIsSuccess: res?.body ?? []
                                });
                            } else {
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    updateCustomEmailIsSuccess: [],
                                    updateCustomEmailInProgress: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ createCustomEmailIsSuccess: [], createCustomEmailInProgress: false });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getEmailContentSuggestions = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap(() => {
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
            switchMap(() => {
                return this.invoiceService.getEmailTemplate().pipe(
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
