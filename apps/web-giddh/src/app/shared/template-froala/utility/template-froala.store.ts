import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, tap } from "rxjs";
import { ToasterService } from "apps/web-giddh/src/app/services/toaster.service";
import { BaseResponse } from "apps/web-giddh/src/app/models/api-models/BaseResponse";
import { InvoiceService } from "../../../services/invoice.service";
import { InventoryService } from "../../../services/inventory.service";

export interface CustomEmailState {
    emailContentSuggestions: any;
    emailConditionSuggestions: any;
    emailTemplates: any;
    updateCustomEmailIsSuccess: any;
    accountGroupList: any;
}

export const DEFAULT_CUSTOM_EMAIL_STATE: CustomEmailState = {
    emailContentSuggestions: null,
    emailConditionSuggestions: null,
    updateCustomEmailIsSuccess: null,
    emailTemplates: null,
    accountGroupList: null
};

@Injectable({
    providedIn: 'root'
})
export class CustomEmailComponentStore extends ComponentStore<CustomEmailState> implements OnDestroy {

    constructor(
        private toaster: ToasterService,
        private invoiceService: InvoiceService,
        private inventoryService: InventoryService
    ) {
        super(DEFAULT_CUSTOM_EMAIL_STATE);
    }

    /**
     * Get email condition suggestions
     *
     * @memberof CustomEmailComponentStore
     */
    readonly getEmailConditionSuggestion = this.effect((triggerModule: Observable<string>) => {
        return triggerModule.pipe(
            switchMap((triggerModule) => {
                this.patchState({ emailConditionSuggestions: null });
                return this.invoiceService.getEmailConditions(triggerModule).pipe(
                    tap(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    emailConditionSuggestions: res.body?.conditions ?? []
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

    /**
     * Update custom email template
     *
     * @memberof CustomEmailComponentStore
     */
    readonly updateCustomTemplate = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ updateCustomEmailIsSuccess: null });
                return this.invoiceService.updateCustomEmailTemplate(req).pipe(
                    tap(
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

    /**
     * Get email content suggestions
     *
     * @memberof CustomEmailComponentStore
     */
    readonly getEmailContentSuggestions = this.effect((data: Observable<string>) => {
        return data.pipe(
            switchMap((searchTerm) => {
                this.patchState({ emailContentSuggestions: null });
                return this.invoiceService.getEmailContentSuggestions(searchTerm).pipe(
                    tap(
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

    /**
     * Get email template
     *
     * @memberof CustomEmailComponentStore
     */
    readonly getAllEmailTemplate = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ emailTemplates: null });
                return this.invoiceService.getEmailTemplate(req).pipe(
                    tap(
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
     * Get email template
     *
     * @memberof CustomEmailComponentStore
     */
    readonly getFlattenAccountGroupList = this.effect((data: Observable<{request: any, model: string[]}>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ accountGroupList: [] });
                return this.inventoryService.getFlattenGroupWithAccountsList(req.request, req.model).pipe(
                    tap(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    accountGroupList: res?.body?.results ?? []
                                });
                            } else {
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    accountGroupList: []
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                accountGroupList: []
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
     * @memberof CustomEmailComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
