import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { ToasterService } from "../../../services/toaster.service";
import { AppState } from "../../../store";
import { Store } from "@ngrx/store";
import { SettingsProfileService } from "../../../services/settings.profile.service";

export interface BuyPlanState {
    planListInProgress: boolean;
    planList: any
    createPlanSuccess: boolean;
    createPlanResponse: any;
    createPlanInProgress: boolean;
    updatePlanSuccess: boolean;
    updatePlanInProgress: boolean;
    applyPromoCodeSuccess: boolean;
    applyPromoCodeInProgress: boolean;
    promoCodeResponse: any;
    updateSubscriptionPaymentInProgress: boolean;
    updateSubscriptionPaymentIsSuccess: any;
}

export const DEFAULT_BUY_PLAN_STATE: BuyPlanState = {
    planListInProgress: true,
    planList: [],
    createPlanSuccess: false,
    createPlanResponse: null,
    createPlanInProgress: false,
    applyPromoCodeSuccess: false,
    applyPromoCodeInProgress: false,
    promoCodeResponse: null,
    updatePlanSuccess: false,
    updatePlanInProgress: false,
    updateSubscriptionPaymentInProgress: false,
    updateSubscriptionPaymentIsSuccess: null
};

@Injectable()
export class BuyPlanComponentStore extends ComponentStore<BuyPlanState> implements OnDestroy {

    constructor(private toasterService: ToasterService,
        private subscriptionService: SubscriptionsService,
        private settingsProfileService: SettingsProfileService,
        private store: Store<AppState>) {
        super(DEFAULT_BUY_PLAN_STATE);
    }

    public companyProfile$: Observable<any> = this.select(this.store.select(state => state.settings.profile), (response) => response);
    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    public onboardingForm$: Observable<any> = this.select(this.store.select(state => state.common.onboardingform), (response) => response);
    public commonCountries$: Observable<any> = this.select(this.store.select(state => state.common.countries), (response) => response);
    public generalState$: Observable<any> = this.select(this.store.select(state => state.general.states), (response) => response);

    /**
     * Get All Plans
     *
     * @memberof BuyPlanComponentStore
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
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    planList: [],
                                    planListInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');
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
     * Create Plan
     *
     * @memberof BuyPlanComponentStore
     */
    readonly createSubscription = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ createPlanInProgress: true });
                return this.subscriptionService.createSubscription(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar('success', 'Subscription created successfully');
                                return this.patchState({
                                    createPlanInProgress: false,
                                    createPlanResponse: res?.body ?? null,
                                    createPlanSuccess: true
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    createPlanResponse: null,
                                    createPlanInProgress: false,
                                    createPlanSuccess: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');

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
    * Update Plan
    *
    * @memberof BuyPlanComponentStore
    */
    readonly updateSubscription = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ updatePlanInProgress: true });
                return this.subscriptionService.updateSubscription(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar('success', 'Update Plan Successfully');
                                return this.patchState({
                                    updatePlanInProgress: false,
                                    updatePlanSuccess: true
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    updatePlanInProgress: false,
                                    updatePlanSuccess: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');

                            return this.patchState({
                                updatePlanInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });


    /**
    * Apply Promocode
    *
    * @memberof BuyPlanComponentStore
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
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');

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

    readonly updateSubscriptionPayment = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ updateSubscriptionPaymentInProgress: true });
                return this.settingsProfileService.PatchProfile(req.request).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar('success', 'Plan purchased successfully');
                                return this.patchState({
                                    updateSubscriptionPaymentInProgress: false,
                                    updateSubscriptionPaymentIsSuccess: res?.body ?? null
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    updateSubscriptionPaymentInProgress: false,
                                    updateSubscriptionPaymentIsSuccess: null
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');

                            return this.patchState({
                                updateSubscriptionPaymentInProgress: false,
                                updateSubscriptionPaymentIsSuccess: null
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
     * @memberof BuyPlanComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
