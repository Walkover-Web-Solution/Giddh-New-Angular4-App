
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, tap } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { ToasterService } from "../../../services/toaster.service";
import { AppState } from "../../../store";
import { Store } from "@ngrx/store";

/**
 * BillingState interface definition
 * Defines the structure and contract for BillingState objects
 */
export interface BillingState {
    getBillingDetailsInProgress: boolean;
    getBillingDetails: any
    updateBillingDetailsSuccess: boolean;
    updateBillingDetailsInProgress: boolean;
}

export const DEFAULT_CHANGE_BILLING_STATE: BillingState = {
    getBillingDetailsInProgress: null,
    getBillingDetails: [],
    updateBillingDetailsSuccess: null,
    updateBillingDetailsInProgress: null,
};

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * ChangeBillingComponentStore store
 * Manages changebillingcomponent state using NgRx ComponentStore
 */
export class ChangeBillingComponentStore extends ComponentStore<BillingState> implements OnDestroy {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(private toasterService: ToasterService,
        private subscriptionService: SubscriptionsService,
        private store: Store<AppState>) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_CHANGE_BILLING_STATE);
    }

    public companyProfile$: Observable<any> = this.select(this.store.select(state => state.settings.profile), (response) => response);
    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    public onboardingForm$: Observable<any> = this.select(this.store.select(state => state.common.onboardingform), (response) => response);
    public commonCountries$: Observable<any> = this.select(this.store.select(state => state.common.countries), (response) => response);
    public generalState$: Observable<any> = this.select(this.store.select(state => state.general.states), (response) => response);

    /**
     * Get Billing Details
     *
     * @memberof ChangeBillingComponentStore
     */
    readonly getBillingDetails = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ getBillingDetailsInProgress: true });
                return this.subscriptionService.getBillingDetails(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                return this.patchState({
                                    getBillingDetails: res?.body ?? [],
                                    getBillingDetailsInProgress: false,
                                });
                            } else {
                                return this.patchState({
                                    getBillingDetails: [],
                                    getBillingDetailsInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                getBillingDetails: [],
                                getBillingDetailsInProgress: false
                            });
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
    * Update Billing Details
    *
    * @memberof ChangeBillingComponentStore
    */
    readonly updateBillingDetails = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ updateBillingDetailsInProgress: true });
                return this.subscriptionService.updateBillingDetails(req.request, req.id).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar('success', res?.body);
                                return this.patchState({
                                    updateBillingDetailsInProgress: false,
                                    updateBillingDetailsSuccess: true
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    updateBillingDetailsInProgress: false,
                                    updateBillingDetailsSuccess: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');

                            return this.patchState({
                                updateBillingDetailsInProgress: false
                            });
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
     * @memberof ChangeBillingComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
