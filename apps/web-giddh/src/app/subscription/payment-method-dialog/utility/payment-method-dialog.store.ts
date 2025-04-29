
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { ToasterService } from "../../../services/toaster.service";

export interface PaymentState {
    providerList: any
    saveProviderSuccess: any;
    deletePaymentSuccess: any;
    providerListInProgress: boolean;
    setDetaultPaymentMethodIsSuccess: boolean;
}

export const DEFAULT_PAYMENT_STATE: PaymentState = {
    providerList: null,
    saveProviderSuccess: null,
    deletePaymentSuccess: null,
    providerListInProgress: null,
    setDetaultPaymentMethodIsSuccess: null
};

@Injectable()
export class PaymentMethodDialogComponentStore extends ComponentStore<PaymentState> implements OnDestroy {

    constructor(
        private toasterService: ToasterService,
        private subscriptionService: SubscriptionsService
    ) {
        super(DEFAULT_PAYMENT_STATE);
    }

    /**
     * Get payment method list by subscription id
     *
     * @memberof PaymentMethodDialogComponentStore
     */
    readonly getPaymentMethodListBySubscriptionId = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ providerListInProgress: true });
                return this.subscriptionService.getPaymentProviderListBySubscriptionID(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                return this.patchState({
                                    providerList: res?.body ?? [],
                                    providerListInProgress: false
                                });
                            } else {
                                res.message && this.toasterService.showSnackBar("error", res.message);
                                return this.patchState({
                                    providerList: [],
                                    providerListInProgress: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                providerList: [],
                                providerListInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
   * Save payment method
   *
   * @memberof PaymentMethodDialogComponentStore
   */
    readonly savePaymentMethod = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                return this.subscriptionService.savePaymentProviderBySubscriptionID(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    saveProviderSuccess: res?.body ?? [],
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    saveProviderSuccess: []
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                saveProviderSuccess: []
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Delete payment method
     *
     * @memberof PaymentMethodDialogComponentStore
     */
    readonly deletePaymentMethod = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ deletePaymentSuccess: false });
                return this.subscriptionService.deletePaymentMethod(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                res.body && this.toasterService.showSnackBar('success', res.body);
                                return this.patchState({
                                    deletePaymentSuccess: true
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    deletePaymentSuccess: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                deletePaymentSuccess: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Set default payment method
     *
     * @memberof PaymentMethodDialogComponentStore
     */
    readonly setDefaultPaymentMethod = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ setDetaultPaymentMethodIsSuccess: false });
                return this.subscriptionService.setDetaultPaymentMethod(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                res.body && this.toasterService.showSnackBar('success', res.body);
                                return this.patchState({
                                    setDetaultPaymentMethodIsSuccess: true
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    setDetaultPaymentMethodIsSuccess: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                setDetaultPaymentMethodIsSuccess: false
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
     * @memberof PaymentMethodDialogComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
