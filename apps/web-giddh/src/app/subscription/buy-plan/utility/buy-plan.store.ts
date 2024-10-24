import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { ToasterService } from "../../../services/toaster.service";
import { AppState } from "../../../store";
import { Store } from "@ngrx/store";
import { SettingsProfileService } from "../../../services/settings.profile.service";
import { LocaleService } from "../../../services/locale.service";

export interface BuyPlanState {
    planListInProgress: boolean;
    planList: any
    countryListInProgress: boolean;
    countryList: any
    createSubscriptionSuccess: boolean;
    createSubscriptionResponse: any;
    createSubscriptionInProgress: boolean;
    updatePlanSuccess: any;
    updatePlanInProgress: boolean;
    updateSubscriptionPaymentInProgress: boolean;
    updateSubscriptionPaymentIsSuccess: any;
    generateOrderBySubscriptionIdInProgress: boolean;
    subscriptionRazorpayOrderDetails: any;
    getChangePlanDetailsInProgress: boolean;
    changePlanDetails: any;
    activatePlanSuccess: boolean;
    calculateDataInProgress: boolean;
    paypalCaptureOrderIdSuccess: boolean;
    calculateData: any;
    razorpaySuccess: boolean;
}

export const DEFAULT_BUY_PLAN_STATE: BuyPlanState = {
    planListInProgress: true,
    planList: [],
    countryListInProgress: true,
    countryList: [],
    createSubscriptionSuccess: false,
    createSubscriptionResponse: null,
    createSubscriptionInProgress: false,
    updatePlanSuccess: null,
    updatePlanInProgress: false,
    updateSubscriptionPaymentInProgress: false,
    updateSubscriptionPaymentIsSuccess: null,
    generateOrderBySubscriptionIdInProgress: false,
    subscriptionRazorpayOrderDetails: null,
    getChangePlanDetailsInProgress: null,
    changePlanDetails: null,
    activatePlanSuccess: false,
    calculateDataInProgress: false,
    paypalCaptureOrderIdSuccess: null,
    calculateData: null,
    razorpaySuccess: false
};

@Injectable()
export class BuyPlanComponentStore extends ComponentStore<BuyPlanState> implements OnDestroy {

    constructor(private toasterService: ToasterService,
        private subscriptionService: SubscriptionsService,
        private settingsProfileService: SettingsProfileService,
        private store: Store<AppState>,
        private localeService: LocaleService) {
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
                this.patchState({ createSubscriptionInProgress: true });
                return this.subscriptionService.createSubscription(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    createSubscriptionInProgress: false,
                                    createSubscriptionResponse: res?.body ?? null,
                                    createSubscriptionSuccess: true
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    createSubscriptionResponse: null,
                                    createSubscriptionInProgress: false,
                                    createSubscriptionSuccess: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');

                            return this.patchState({
                                createSubscriptionInProgress: false
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
                                this.toasterService.showSnackBar('success', 'Plan update Successfully');
                                return this.patchState({
                                    updatePlanInProgress: false,
                                    updatePlanSuccess: res?.body ?? null,
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    updatePlanInProgress: false,
                                    updatePlanSuccess: null
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

    readonly updateNewLoginSubscriptionPayment = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ updateSubscriptionPaymentInProgress: true });
                return this.settingsProfileService.updateSubscriptionPayment(req.request).pipe(
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

    readonly generateOrderBySubscriptionId = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ generateOrderBySubscriptionIdInProgress: true });
                return this.subscriptionService.generateOrderBySubscriptionId(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    generateOrderBySubscriptionIdInProgress: false,
                                    subscriptionRazorpayOrderDetails: res?.body ?? null
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    generateOrderBySubscriptionIdInProgress: false,
                                    subscriptionRazorpayOrderDetails: null,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');

                            return this.patchState({
                                generateOrderBySubscriptionIdInProgress: false,
                                subscriptionRazorpayOrderDetails: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getChangePlanDetails = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ getChangePlanDetailsInProgress: true });
                return this.subscriptionService.getChangePlanDetails(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    getChangePlanDetailsInProgress: false,
                                    changePlanDetails: res?.body ?? null
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    getChangePlanDetailsInProgress: false,
                                    changePlanDetails: null,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');

                            return this.patchState({
                                getChangePlanDetailsInProgress: false,
                                changePlanDetails: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
    * Save Razorpay Token
    *
    * @memberof BuyPlanComponentStore
    */
    readonly saveRazorpayToken = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ razorpaySuccess: null });
                return this.subscriptionService.saveRazorpayToken(req.subscriptionId, req.paymentId).pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    razorpaySuccess: true
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    razorpaySuccess: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', this.localeService.translate("app_something_went_wrong"));
                            return this.patchState({
                                razorpaySuccess: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly changePlan = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ updateSubscriptionPaymentInProgress: true });
                return this.subscriptionService.updatePlan(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
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
                                    updateSubscriptionPaymentIsSuccess: null,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', this.localeService.translate("app_something_went_wrong"));

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
   * Get All Country List
   *
   * @memberof BuyPlanComponentStore
   */
    readonly getCountryList = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ countryListInProgress: true });
                return this.subscriptionService.getCountryList().pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    countryList: res?.body ?? [],
                                    countryListInProgress: false,
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    countryList: [],
                                    countryListInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', this.localeService.translate("app_something_went_wrong"));
                            return this.patchState({
                                countryList: [],
                                countryListInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Activate plan
     *
     * @memberof BuyPlanComponentStore
     */
    readonly activatePlan = this.effect((data: Observable<string>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ activatePlanSuccess: false });
                return this.subscriptionService.activatePlan(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    activatePlanSuccess: true
                                });
                            } else {
                                if (res.message) {
                                    res.message && this.toasterService.showSnackBar("error", res.message);
                                }
                                return this.patchState({
                                    activatePlanSuccess: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', this.localeService.translate("app_something_went_wrong"));

                            return this.patchState({
                                activatePlanSuccess: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Get plan calculation details
     *
     * @memberof BuyPlanComponentStore
     */
    readonly getCalculationData = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ calculateDataInProgress: true });
                return this.subscriptionService.getPlanAmountCalculation(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                return this.patchState({
                                    calculateData: res?.body ?? [],
                                    calculateDataInProgress: false
                                });
                            } else {
                                res.message && this.toasterService.showSnackBar("error", res.message);
                                return this.patchState({
                                    calculateData: [],
                                    calculateDataInProgress: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', this.localeService.translate("app_something_went_wrong"));
                            return this.patchState({
                                calculateData: [],
                                calculateDataInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
  * Get paypal capture order id
  *
  * @memberof BuyPlanComponentStore
  */
    readonly paypalCaptureOrderId = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ paypalCaptureOrderIdSuccess: false });
                return this.subscriptionService.paypalCaptureOrder(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                return this.patchState({
                                    paypalCaptureOrderIdSuccess: true
                                });
                            } else {
                                res.message && this.toasterService.showSnackBar("error", res.message);
                                return this.patchState({
                                    paypalCaptureOrderIdSuccess: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', this.localeService.translate("app_something_went_wrong"));
                            return this.patchState({
                                paypalCaptureOrderIdSuccess: false
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
