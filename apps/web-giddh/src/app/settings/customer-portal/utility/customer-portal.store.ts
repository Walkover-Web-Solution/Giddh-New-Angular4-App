
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, tap } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { ToasterService } from "../../../services/toaster.service";
import { SettingsIntegrationService } from "../../../services/settings.integration.service";
import { HttpMethod } from "../../../app.constant";

/**
 * CustomerPortalState interface definition
 * Defines the structure and contract for CustomerPortalState objects
 */
export interface CustomerPortalState {
    payuDetails: any;
    payuDetailsInProgress: boolean;
}

export const DEFAULT_CUSTOMER_PORTAL_STATE: CustomerPortalState = {
    payuDetails: null,
    payuDetailsInProgress: null
};

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * CustomerPortalComponentStore store
 * Manages customerportalcomponent state using NgRx ComponentStore
 */
export class CustomerPortalComponentStore extends ComponentStore<CustomerPortalState> implements OnDestroy {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private toasterService: ToasterService,
        private settingsIntegrationService: SettingsIntegrationService
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_CUSTOMER_PORTAL_STATE);
    }

    public payuDetailsInProgress$ = this.select((state) => state.payuDetailsInProgress);
    public payuDetails$ = this.select((state) => state.payuDetails);

    /**
     * Multi-purpose CRUD effect for PayU integration.
     * Supports GET, POST, and DELETE.
     * @memberof CustomerPortalComponentStore
     */
    readonly payuCrudOperation = this.effect((data$: Observable<{
        method: HttpMethod,
        payload?: any
    }>) => {
        return data$.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap(({ method, payload }) => {
                this.patchState({ payuDetailsInProgress: true });
                return this.settingsIntegrationService.payuCrudOperation(method, payload).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                /**
                                 * Handles if functionality
                                 */
                                if (method === HttpMethod.POST || method === HttpMethod.DELETE) {
                                    this.toasterService.showSnackBar('success', res?.body);
                                    // After POST or DELETE, fetch the latest PayU details
                                    this.payuCrudOperation({ method: HttpMethod.GET });
                                } else {
                                    this.patchState({
                                        payuDetails: res?.body ?? null,
                                        payuDetailsInProgress: false
                                    });
                                }
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res?.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                this.patchState({
                                    payuDetails: null,
                                    payuDetailsInProgress: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', error);
                            this.patchState({
                                payuDetails: null,
                                payuDetailsInProgress: false
                            });
                        }
                    ),
                    /**
                     * Handles catchError functionality
                     */
                    catchError(() => {
                        this.patchState({
                            payuDetails: null,
                            payuDetailsInProgress: false
                        });
                        return EMPTY;
                    })
                );
            })
        );
    });

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof SettingIntegrationComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
