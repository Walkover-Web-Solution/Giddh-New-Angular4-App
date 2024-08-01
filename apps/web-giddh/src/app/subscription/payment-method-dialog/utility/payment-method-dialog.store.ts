
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { ToasterService } from "../../../services/toaster.service";
import { SettingsProfileService } from "../../../services/settings.profile.service";
import { AppState } from "../../../store";
import { Store } from "@ngrx/store";

export interface PaymentState {
    providerList: any
    saveProviderSuccess: any;
}

export const DEFAULT_PAYMENT_STATE: PaymentState = {
    providerList: null,
    saveProviderSuccess: null
};

@Injectable()
export class PaymentMethodDialogComponentStore extends ComponentStore<PaymentState> implements OnDestroy {

    constructor(
        private toasterService: ToasterService,
        private subscriptionService: SubscriptionsService,
        private settingsProfile: SettingsProfileService,
        private store: Store<AppState>
    ) {
        super(DEFAULT_PAYMENT_STATE);
    }


    /**
     * Get payment method list by subscription id
     *
     * @memberof CompanyListDialogComponentStore
     */
    readonly getPaymentMethodListBySubscriptionId = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                return this.subscriptionService.getPaymentProviderListBySubscriptionID(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                return this.patchState({
                                    providerList: res?.body ?? []
                                });
                            } else {
                                this.toasterService.showSnackBar("error", res.message);
                                return this.patchState({
                                    providerList: []
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                providerList: []
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
   * Company Archive/Unarchive
   *
   * @memberof CompanyListDialogComponentStore
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
     * Lifecycle hook for component destroy
     *
     * @memberof CompanyListDialogComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
