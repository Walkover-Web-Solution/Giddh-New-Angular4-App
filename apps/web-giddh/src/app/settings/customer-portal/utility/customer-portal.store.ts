
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { ToasterService } from "../../../services/toaster.service";
import { SettingsIntegrationService } from "../../../services/settings.integration.service";
import { HttpMethod } from "../../../app.constant";

export interface CustomerPortalState {
    payuDetails: any;
    payuDetailsInProgress: boolean;
}

export const DEFAULT_CUSTOMER_PORTAL_STATE: CustomerPortalState = {
    payuDetails: null,
    payuDetailsInProgress: null
};

@Injectable()
export class CustomerPortalComponentStore extends ComponentStore<CustomerPortalState> implements OnDestroy {

    constructor(
        private toasterService: ToasterService,
        private settingsIntegrationService: SettingsIntegrationService
    ) {
        super(DEFAULT_CUSTOMER_PORTAL_STATE);
    }

    public payuDetailsInProgress$ = this.select((state) => state.payuDetailsInProgress);
    public payuDetails$ = this.select((state) => state.payuDetails);

    /**
     * Multi-purpose CRUD effect for PayU integration.
     * Supports GET, POST, and DELETE.
     * @memberof CustomerPortalComponentStore
     */
    readonly payuCrudOperation = this.effect((data$: Observable<{
        method: HttpMethod,
        payload?: any
    }>) => {
        return data$.pipe(
            switchMap(({ method, payload }) => {
                this.patchState({ payuDetailsInProgress: true });
                return this.settingsIntegrationService.payuCrudOperation(method, payload).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                if (method === HttpMethod.POST || method === HttpMethod.DELETE) {
                                    this.toasterService.showSnackBar('success', res?.body);
                                    // After POST or DELETE, fetch the latest PayU details
                                    this.payuCrudOperation({ method: HttpMethod.GET });
                                } else {
                                    this.patchState({
                                        payuDetails: res?.body ?? null,
                                        payuDetailsInProgress: false
                                    });
                                }
                            } else {
                                if (res?.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                this.patchState({
                                    payuDetails: null,
                                    payuDetailsInProgress: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', error);
                            this.patchState({
                                payuDetails: null,
                                payuDetailsInProgress: false
                            });
                        }
                    ),
                    catchError(() => {
                        this.patchState({
                            payuDetails: null,
                            payuDetailsInProgress: false
                        });
                        return EMPTY;
                    })
                );
            })
        );
    });

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof SettingIntegrationComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
