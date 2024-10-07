
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { ToasterService } from "../../../services/toaster.service";
import { SettingsIntegrationService } from "../../../services/settings.integraion.service";

export interface SettingIntegrationState {
    institutionList: any;
    requisitionList: any;
    institutionsListInProgress: boolean;
    requistionListInProgress: boolean;
    createEndUserAgreementSuccess: any;
    deleteAccountSuccess: any;
}

export const DEFAULT_SETTING_INTEGRATION_STATE: SettingIntegrationState = {
    institutionList: null,
    requisitionList: null,
    institutionsListInProgress: null,
    requistionListInProgress: null,
    createEndUserAgreementSuccess: null,
    deleteAccountSuccess: null
};

@Injectable()
export class SettingIntegrationComponentStore extends ComponentStore<SettingIntegrationState> implements OnDestroy {

    constructor(
        private toasterService: ToasterService,
        private settingsIntegrationService: SettingsIntegrationService
    ) {
        super(DEFAULT_SETTING_INTEGRATION_STATE);
    }

    /**
     * Get All Institutions
     *
     * @memberof SettingIntegrationComponentStore
     */
    readonly getAllInstitutions = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ institutionsListInProgress: true });
                return this.settingsIntegrationService.getAllInstitutions(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                return this.patchState({
                                    institutionList: res?.body ?? [],
                                    institutionsListInProgress: false
                                });
                            } else {
                                res.message && this.toasterService.showSnackBar("error", res.message);
                                return this.patchState({
                                    institutionList: [],
                                    institutionsListInProgress: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                institutionList: [],
                                institutionsListInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Get Requisition by ID
     *
     * @memberof SettingIntegrationComponentStore
     */
    readonly getRequisition = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ requistionListInProgress: true });
                return this.settingsIntegrationService.getRequisition(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                return this.patchState({
                                    requisitionList: res?.body ?? [],
                                    requistionListInProgress: false
                                });
                            } else {
                                res.message && this.toasterService.showSnackBar("error", res.message);
                                return this.patchState({
                                    requisitionList: [],
                                    requistionListInProgress: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                requisitionList: [],
                                requistionListInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
   * Create end user agreement by institutions id
   *
   * @memberof SettingIntegrationComponentStore
   */
    readonly createEndUserAgreementByInstitutionId = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                return this.settingsIntegrationService.createEndUserAgreementByInstitutionId(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    createEndUserAgreementSuccess: res?.body ?? [],
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    createEndUserAgreementSuccess: []
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                createEndUserAgreementSuccess: []
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Delete end user agreement details by agreement id
     *
     * @memberof SettingIntegrationComponentStore
     */
    readonly deleteEndUserAgreementByInstitutionId = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ deleteAccountSuccess: false });
                return this.settingsIntegrationService.deleteEndUserAgreementDetails(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                res.body && this.toasterService.showSnackBar('success', res.body);
                                return this.patchState({
                                    deleteAccountSuccess: true
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    deleteAccountSuccess: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                deleteAccountSuccess: false
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
     * @memberof SettingIntegrationComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
