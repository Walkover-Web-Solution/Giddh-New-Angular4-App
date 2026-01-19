import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tap } from "rxjs/operators";
import { ToasterService } from "../../../services/toaster.service";
import { catchError, EMPTY, Observable, switchMap } from "rxjs";
import { InvoiceService } from "../../../services/invoice.service";
import { CampaignIntegrationService } from "../../../services/campaign.integration.service";

/**
 * TriggerState interface definition
 * Defines the structure and contract for TriggerState objects
 */
export interface TriggerState {
    triggerList: any;
    triggerAdvanceList: any;
    isLoading: boolean;
    createUpdateTriggerIsSuccess: boolean;
    triggerDetails: any;
    isTriggerDetailsLoading: boolean;
}

const DEFAULT_STATE: TriggerState = {
    triggerList: null,
    triggerAdvanceList: null,
    isLoading: false,
    createUpdateTriggerIsSuccess: false,
    triggerDetails: null,
    isTriggerDetailsLoading: false
};

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * TriggerComponentStore store
 * Manages triggercomponent state using NgRx ComponentStore
 */
export class TriggerComponentStore extends ComponentStore<TriggerState> {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private toaster: ToasterService,
        private invoiceService: InvoiceService,
        private campaignIntegrationService: CampaignIntegrationService
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_STATE);
    }

    public triggerList$ = this.select((state) => state.triggerList);
    public triggerAdvanceList$ = this.select((state) => state.triggerAdvanceList);
    public isLoading$ = this.select((state) => state.isLoading);
    public createUpdateTriggerIsSuccess$ = this.select((state) => state.createUpdateTriggerIsSuccess);
    public triggerDetails$ = this.select((state) => state.triggerDetails);
    public isTriggerDetailsLoading$ = this.select((state) => state.isTriggerDetailsLoading);

    /**
     * Create trigger
     *
     * @memberof TriggerComponentStore
     */
    readonly createTrigger = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((model) => {
                this.patchState({ createUpdateTriggerIsSuccess: false });
                return this.invoiceService.createTrigger(model).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: any) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === "success") {
                                res?.body && this.toaster.showSnackBar("success", res.body);
                                this.patchState({ createUpdateTriggerIsSuccess: true });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                this.patchState({ createUpdateTriggerIsSuccess: false });
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
     * Update trigger
     *
     * @memberof TriggerComponentStore
     */
    readonly updateTrigger = this.effect((data: Observable<{model: any, uniqueName: string}>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ createUpdateTriggerIsSuccess: false });
                return this.invoiceService.updateTrigger(req.model, req.uniqueName).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: any) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === "success") {
                                res?.body && this.toaster.showSnackBar("success", res.body);
                                this.patchState({ createUpdateTriggerIsSuccess: true });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                this.patchState({ createUpdateTriggerIsSuccess: false });
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
    *  Get trigger list
    *
    *  @memberof TriggerComponentStore
    */
    readonly getTriggerList = this.effect((data: Observable<{page: number, count: number}>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((request) => {
                this.patchState({ triggerList: null, isLoading: true });
                return this.invoiceService.getTriggerList(request).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: any) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === "success" && res?.body) {
                                this.patchState({ triggerList: res.body, isLoading: false });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                this.patchState({ triggerList: null, isLoading: false });
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
    *  Get trigger advance list
    *
    *  @memberof TriggerComponentStore
    */
    readonly getTriggerAdvanceList = this.effect((data: Observable<{page: number, count: number}>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((request) => {
                this.patchState({ triggerAdvanceList: null, isLoading: true });
                return this.campaignIntegrationService.getTriggersList(request).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: any) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === "success" && res?.body) {
                                this.patchState({ triggerAdvanceList: res.body, isLoading: false });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                this.patchState({ triggerAdvanceList: null, isLoading: false });
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
     * Get Trigger Details
     *
     * @param {string} uniqueName
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InvoiceService
     */
    readonly getTriggerDetails = this.effect((data: Observable<string>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((uniqueName) => {
                this.patchState({ triggerDetails: null, isTriggerDetailsLoading: true });
                return this.invoiceService.getTriggerDetails(uniqueName).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: any) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === "success" && res?.body) {
                                this.patchState({ triggerDetails: res.body, isTriggerDetailsLoading: false });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                this.patchState({ triggerDetails: null, isTriggerDetailsLoading: false });
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
     * Delete trigger
     *
     * @memberof TriggerComponentStore
     */
    readonly deleteTrigger = this.effect((data: Observable<string>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((uniqueName) => {
                return this.invoiceService.deleteTrigger(uniqueName).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: any) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === "success" && res?.body) {
                                this.getTriggerList({page: 1, count: this.get().triggerList?.count});
                                this.toaster.showSnackBar("success", res.body);
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
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
     * @memberof TriggerComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
