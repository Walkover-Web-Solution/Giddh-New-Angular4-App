
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { ToasterService } from "../../services/toaster.service";
import { SubscriptionsService } from "../../services/subscriptions.service";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";

export interface SubscriptionState {
    subscriptionListInProgress: boolean;
    subscriptionList: any
    cancelSubscriptionInProgress: boolean;
    cancelSubscription: any;
    transferSubscriptionInProgress: boolean;
    transferSubscriptionSuccess: boolean;
    buyPlanSuccess: any;
    verifyOwnershipInProgress: boolean;
    verifyOwnershipSuccess: any;
    subscribedCompaniesInProgress: boolean;
    subscribedCompanies: any;
    companiesListInProgress: boolean;
    companiesList: any;
    rejectReason: any;
}

export const DEFAULT_SUBSCRIPTION_STATE: SubscriptionState = {
    subscriptionListInProgress: null,
    subscriptionList: [],
    companiesListInProgress: null,
    companiesList: [],
    buyPlanSuccess: [],
    cancelSubscriptionInProgress: null,
    cancelSubscription: null,
    transferSubscriptionInProgress: null,
    transferSubscriptionSuccess: null,
    verifyOwnershipInProgress: null,
    verifyOwnershipSuccess: null,
    subscribedCompanies: null,
    subscribedCompaniesInProgress: null,
    rejectReason: null

};

@Injectable()
export class SubscriptionComponentStore extends ComponentStore<SubscriptionState> implements OnDestroy {

    constructor(private toasterService: ToasterService,
        private subscriptionService: SubscriptionsService,
        private store: Store<AppState>
    ) {
        super(DEFAULT_SUBSCRIPTION_STATE);
    }

    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    public isUpdateCompanySuccess$: Observable<any> = this.select(this.store.select(state => state.settings.updateProfileSuccess), (response) => response);
    public companyList$: Observable<any> = this.select((state) => state.companiesList);

    /**
     * Get All Subscriptions
     *
     * @memberof SubscriptionComponentStore
     */
    readonly getAllSubscriptions = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ subscriptionListInProgress: true });
                return this.subscriptionService.getAllSubscriptions(req?.pagination, req?.model).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    subscriptionList: res ?? [],
                                    subscriptionListInProgress: false,
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    subscriptionList: [],
                                    subscriptionListInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                subscriptionList: [],
                                subscriptionListInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
    * Cancel Subscription
    *
    * @memberof SubscriptionComponentStore
    */
    readonly cancelSubscription = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ cancelSubscriptionInProgress: true });
                return this.subscriptionService.cancelSubscriptionById(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar('success', res?.body);
                                return this.patchState({
                                    cancelSubscriptionInProgress: false,
                                    cancelSubscription: true,
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    cancelSubscriptionInProgress: false,
                                    cancelSubscription: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');

                            return this.patchState({
                                cancelSubscriptionInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });


    /**
     * Transfer Subscription
     *
     * @memberof SubscriptionComponentStore
     */
    readonly transferSubscription = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ transferSubscriptionInProgress: false });
                return this.subscriptionService.transferSubscription(req.model, req.params).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar('success', res?.body);
                                return this.patchState({
                                    transferSubscriptionInProgress: false,
                                    transferSubscriptionSuccess: true
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    transferSubscriptionSuccess: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');

                            return this.patchState({
                                transferSubscriptionSuccess: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
    *  Verify Ownership
    *
    * @memberof SubscriptionComponentStore
    */
    readonly verifyOwnership = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ verifyOwnershipInProgress: true, rejectReason: null });
                return this.subscriptionService.verifyOwnership(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar('success', 'Subscription ownership verified successfully.');
                                return this.patchState({
                                    verifyOwnershipSuccess: res?.body ?? null,
                                    rejectReason: req,
                                    verifyOwnershipInProgress: false,
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    verifyOwnershipSuccess: null,
                                    rejectReason: null,
                                    verifyOwnershipInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                verifyOwnershipSuccess: null,
                                verifyOwnershipInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
 * Get Subscribed Companies
 *
 * @memberof SubscriptionComponentStore
 */
    readonly getSubScribedCompanies = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ subscribedCompaniesInProgress: true });
                return this.subscriptionService.getSubScribedCompanies().pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    subscribedCompanies: res?.body ?? null,
                                    subscribedCompaniesInProgress: false,
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    subscribedCompanies: null,
                                    subscribedCompaniesInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                subscribedCompanies: null,
                                subscribedCompaniesInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
    *  Buy plan by Go cardless for UK companies
    *
    * @memberof SubscriptionComponentStore
    */
    readonly buyPlan = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                return this.subscriptionService.buyPlan(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    buyPlanSuccess: res?.body ?? null,
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    buyPlanSuccess: null
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');

                            return this.patchState({
                                buyPlanSuccess: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
    * Get All Companies by subscription id
    *
    * @memberof SubscriptionComponentStore
    */
    readonly getAllCompaniesBySubscriptionId = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ companiesListInProgress: true });
                return this.subscriptionService.getCompaniesBySubscriptionId(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                return this.patchState({
                                    companiesList: res?.body ?? [],
                                    companiesListInProgress: false
                                });
                            } else {
                                res.message && this.toasterService.showSnackBar("error", res.message);
                                return this.patchState({
                                    companiesList: [],
                                    companiesListInProgress: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                companiesList: [],
                                companiesListInProgress: false
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
     * @memberof SubscriptionComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
