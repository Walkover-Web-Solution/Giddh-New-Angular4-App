import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tap } from "rxjs/operators";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { ToasterService } from "apps/web-giddh/src/app/services/toaster.service";
import { BaseResponse } from "apps/web-giddh/src/app/models/api-models/BaseResponse";
import { InvoiceService } from "../../../services/invoice.service";
import { InventoryService } from "../../../services/inventory.service";

/**
 * CustomEmailState interface definition
 * Defines the structure and contract for CustomEmailState objects
 */
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

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * CustomEmailComponentStore store
 * Manages customemailcomponent state using NgRx ComponentStore
 */
export class CustomEmailComponentStore extends ComponentStore<CustomEmailState> implements OnDestroy {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private toaster: ToasterService,
        private invoiceService: InvoiceService,
        private inventoryService: InventoryService
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_CUSTOM_EMAIL_STATE);
    }

    /**
     * Get email condition suggestions
     *
     * @memberof CustomEmailComponentStore
     */
    readonly getEmailConditionSuggestion = this.effect((triggerModule: Observable<string>) => {
        return triggerModule.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((triggerModule) => {
                this.patchState({ emailConditionSuggestions: null });
                return this.invoiceService.getEmailConditions(triggerModule).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({
                                    emailConditionSuggestions: res.body?.conditions ?? []
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                this.patchState({
                                    emailConditionSuggestions: []
                                });
                            }
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

    /**
     * Update custom email template
     *
     * @memberof CustomEmailComponentStore
     */
    readonly updateCustomTemplate = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ updateCustomEmailIsSuccess: null });
                return this.invoiceService.updateCustomEmailTemplate(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.toaster.showSnackBar("success", res?.body);
                                this.patchState({
                                    updateCustomEmailIsSuccess: true
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                this.patchState({
                                    updateCustomEmailIsSuccess: false
                                });
                            }
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

    /**
     * Get email content suggestions
     *
     * @memberof CustomEmailComponentStore
     */
    readonly getEmailContentSuggestions = this.effect((data: Observable<string>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((searchTerm) => {
                this.patchState({ emailContentSuggestions: null });
                return this.invoiceService.getEmailContentSuggestions(searchTerm).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({
                                    emailContentSuggestions: res.body ?? []
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                this.patchState({
                                    emailContentSuggestions: []
                                });
                            }
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

    /**
     * Get email template
     *
     * @memberof CustomEmailComponentStore
     */
    readonly getAllEmailTemplate = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ emailTemplates: null });
                return this.invoiceService.getEmailTemplate(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({
                                    emailTemplates: res.body ?? []
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                this.patchState({
                                    emailTemplates: []
                                });
                            }
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

    /**
     * Get email template
     *
     * @memberof CustomEmailComponentStore
     */
    readonly getFlattenAccountGroupList = this.effect((data: Observable<{request: any, model: string[]}>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ accountGroupList: [] });
                return this.inventoryService.getFlattenGroupWithAccountsList(req.request, req.model).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({
                                    accountGroupList: res.body?.results ?? []
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                this.patchState({
                                    accountGroupList: []
                                });
                            }
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

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof CustomEmailComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
