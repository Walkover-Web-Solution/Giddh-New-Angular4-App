
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { ToasterService } from "../../../services/toaster.service";
import { AppState } from "../../../store";
import { Store } from "@ngrx/store";

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

@Injectable()
export class ChangeBillingComponentStore extends ComponentStore<BillingState> implements OnDestroy {

    constructor(private toasterService: ToasterService,
        private subscriptionService: SubscriptionsService,
        private store: Store<AppState>) {
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
            switchMap((req) => {
                this.patchState({ getBillingDetailsInProgress: true });
                return this.subscriptionService.getBillingDetails(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    getBillingDetails: res?.body ?? [],
                                    getBillingDetailsInProgress: false,
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
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
            switchMap((req) => {
                this.patchState({ updateBillingDetailsInProgress: true });
                return this.subscriptionService.updateBillingDetails(req.request, req.id).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar('success', res?.body);
                                return this.patchState({
                                    updateBillingDetailsInProgress: false,
                                    updateBillingDetailsSuccess: true
                                });
                            } else {
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
