
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY ,tap } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { ToasterService } from "../../../services/toaster.service";
import { AppState } from "../../../store";
import { Store } from "@ngrx/store";

/**
 * ViewSubscriptionState interface definition
 * Defines the structure and contract for ViewSubscriptionState objects
 */
export interface ViewSubscriptionState {
    viewSubscriptionInProgress: boolean;
    viewSubscription: any
}

export const DEFAULT_VIEW_SUBSCRIPTION_STATE: ViewSubscriptionState = {
    viewSubscriptionInProgress: null,
    viewSubscription: null
};

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * ViewSubscriptionComponentStore store
 * Manages viewsubscriptioncomponent state using NgRx ComponentStore
 */
export class ViewSubscriptionComponentStore extends ComponentStore<ViewSubscriptionState> implements OnDestroy {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private toasterService: ToasterService,
        private subscriptionService: SubscriptionsService,
        private store: Store<AppState>
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_VIEW_SUBSCRIPTION_STATE);
    }

    public isUpdateCompanySuccess$ = this.select(this.store.select(state => state.settings.updateProfileSuccess), (response) => response);

    /**
     * View Subscriptions
     *
     * @memberof ViewSubscriptionComponentStore
     */
    readonly viewSubscriptionsById = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ viewSubscriptionInProgress: true });
                return this.subscriptionService.viewSubscriptionById(req).pipe(
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
                                    viewSubscription: res?.body ?? null,
                                    viewSubscriptionInProgress: false,
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    viewSubscription: null,
                                    viewSubscriptionInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                viewSubscription: null,
                                viewSubscriptionInProgress: false
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
     * @memberof ViewSubscriptionComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
