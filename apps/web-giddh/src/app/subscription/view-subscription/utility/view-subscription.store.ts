
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { ToasterService } from "../../../services/toaster.service";
import { CommonService } from "../../../services/common.service";
import { AppState } from "../../../store";
import { Store } from "@ngrx/store";

export interface ViewSubscriptionState {
    viewSubscriptionInProgress: boolean;
    viewSubscription: any
}

export const DEFAULT_PLAN_STATE: ViewSubscriptionState = {
    viewSubscriptionInProgress: null,
    viewSubscription: null
};

@Injectable()
export class ViewSubscriptionComponentStore extends ComponentStore<ViewSubscriptionState> implements OnDestroy {

    constructor(private toasterService: ToasterService,
        private subscriptionService: SubscriptionsService,
        private store: Store<AppState>,
        private commonService: CommonService) {
        super(DEFAULT_PLAN_STATE);
    }

    /**
     * Get All Plans
     *
     * @memberof PlanComponentStore
     */
    readonly viewSubscriptions = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ viewSubscriptionInProgress: true });
                return this.subscriptionService.viewSubscriptionById(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    viewSubscription: res?.body ?? null,
                                    viewSubscriptionInProgress: false,
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('success', res.message);
                                }
                                return this.patchState({
                                    viewSubscription: null,
                                    viewSubscriptionInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Error');
                            return this.patchState({
                                viewSubscription: null,
                                viewSubscriptionInProgress: false
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
     * @memberof PlanComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
