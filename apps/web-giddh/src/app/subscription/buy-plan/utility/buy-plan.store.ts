
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { ToasterService } from "../../../services/toaster.service";
import { CommonService } from "../../../services/common.service";
import { AppState } from "../../../store";
import { Store } from "@ngrx/store";

export interface BuyPlanState {
    planListInProgress: boolean;
    planList: any
    createPlanSuccess: boolean;
    createPlanInProgress: boolean;
    applyPromoCodeSuccess: boolean;
    applyPromoCodeInProgress: boolean;
    promoCodeResponse: any
}

export const DEFAULT_PLAN_STATE: BuyPlanState = {
    planListInProgress: null,
    planList: [],
    createPlanSuccess: false,
    createPlanInProgress: false,
    applyPromoCodeSuccess: false,
    applyPromoCodeInProgress: false,
    promoCodeResponse: null
};

@Injectable()
export class BuyPlanComponentStore extends ComponentStore<BuyPlanState> implements OnDestroy {

    constructor(private toasterService: ToasterService,
        private subscriptionService: SubscriptionsService,
        private store: Store<AppState>,
        private commonService: CommonService) {
        super(DEFAULT_PLAN_STATE);
    }

    public companyProfile$: Observable<any> = this.select(this.store.select(state => state.settings.profile), (response) => response);
    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    public onboardingForm$: Observable<any> = this.select(this.store.select(state => state.common.onboardingform), (response) => response);
    public commonCountries$: Observable<any> = this.select(this.store.select(state => state.common.countries), (response) => response);
    public generalState$: Observable<any> = this.select(this.store.select(state => state.general.states), (response) => response);

    /**
     * Get All Plans
     *
     * @memberof PlanComponentStore
     */
    readonly getAllPlans = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ planListInProgress: true });
                return this.subscriptionService.getAllPlans(req.params).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    planList: res?.body ?? [],
                                    planListInProgress: false,
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('success', res.message);
                                }
                                return this.patchState({
                                    planList: [],
                                    planListInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Error');
                            return this.patchState({
                                planList: [],
                                planListInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
 * Create Discount
 *
 * @memberof DiscountComponentStore
 */
    readonly createPlan = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ createPlanInProgress: true });
                return this.subscriptionService.createPlan(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar('success', 'Create Subscription Successfully');
                                return this.patchState({
                                    createPlanInProgress: false,
                                    createPlanSuccess: true
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    createPlanInProgress: false,
                                    createPlanSuccess: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Error');

                            return this.patchState({
                                createPlanInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });


    /**
* Create Discount
*
* @memberof DiscountComponentStore
*/
    readonly applyPromocode = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ applyPromoCodeInProgress: true });
                return this.subscriptionService.applyPromoCode(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar('success', 'Apply Promo Code Successfully');
                                return this.patchState({
                                    applyPromoCodeInProgress: false,
                                    promoCodeResponse: res?.body ?? null,
                                    applyPromoCodeSuccess: true
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    applyPromoCodeInProgress: false,
                                    applyPromoCodeSuccess: false,
                                    promoCodeResponse: null,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Error');

                            return this.patchState({
                                applyPromoCodeInProgress: false
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
