
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tap } from "rxjs/operators";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { ToasterService } from "../../../services/toaster.service";
import { SettingsIntegrationService } from "../../../services/settings.integration.service";

/**
 * SettingIntegrationState interface definition
 * Defines the structure and contract for SettingIntegrationState objects
 */
export interface SettingIntegrationState {
    institutionList: any;
    requisitionList: any;
    institutionsListInProgress: boolean;
    requistionListInProgress: boolean;
    createEndUserAgreementSuccess: any;
    deleteAccountSuccess: any;
    updateAccount: any;
    getAllBankAccountsList: any;
}

export const DEFAULT_SETTING_INTEGRATION_STATE: SettingIntegrationState = {
    institutionList: null,
    requisitionList: null,
    institutionsListInProgress: null,
    requistionListInProgress: null,
    createEndUserAgreementSuccess: null,
    deleteAccountSuccess: null,
    updateAccount: false,
    getAllBankAccountsList: null
};

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * SettingIntegrationComponentStore store
 * Manages settingintegrationcomponent state using NgRx ComponentStore
 */
export class SettingIntegrationComponentStore extends ComponentStore<SettingIntegrationState> implements OnDestroy {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private toasterService: ToasterService,
        private settingsIntegrationService: SettingsIntegrationService
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_SETTING_INTEGRATION_STATE);
    }

    public updateAccount$ = this.select((state) => state.updateAccount);
    public getAllBankAccountsList$ = this.select((state) => state.getAllBankAccountsList);
    /**
     * Get All Institutions
     *
     * @memberof SettingIntegrationComponentStore
     */
    readonly getAllInstitutions = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ institutionsListInProgress: true });
                return this.settingsIntegrationService.getAllInstitutions(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
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
                    /**
                     * Handles catchError functionality
                     */
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
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ requistionListInProgress: true });
                return this.settingsIntegrationService.getRequisition(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
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
                    /**
                     * Handles catchError functionality
                     */
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
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                return this.settingsIntegrationService.createEndUserAgreementByInstitutionId(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                return this.patchState({
                                    createEndUserAgreementSuccess: res?.body ?? [],
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
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
                    /**
                     * Handles catchError functionality
                     */
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
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ deleteAccountSuccess: false });
                return this.settingsIntegrationService.deleteEndUserAgreementDetails(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                return this.patchState({
                                    deleteAccountSuccess: true
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
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
                    /**
                     * Handles catchError functionality
                     */
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * This will link all the connected bank accounts
     *
     * @memberof SettingIntegrationComponentStore
     */
    readonly updateAccount = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ updateAccount: false });
                return this.settingsIntegrationService.updateAccount(req.accountForm, req.request).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success' && res?.body?.message) {
                                this.toasterService.clearAllToaster();
                                this.toasterService.showSnackBar('success', res?.body.message);
                                return this.patchState({
                                    updateAccount: true
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    updateAccount: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                updateAccount: false
                            });
                        }
                    ),
                    /**
                     * Handles catchError functionality
                     */
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * This will get all connected bank accounts
     *
     * @memberof SettingIntegrationComponentStore
     */
    readonly getAllBankAccounts = this.effect((data: Observable<void>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap(() => {
                this.patchState({ getAllBankAccountsList: null });
                return this.settingsIntegrationService.getAllBankAccounts().pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success' && res?.body) {
                                return this.patchState({
                                    getAllBankAccountsList: res
                                });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                return this.patchState({
                                    getAllBankAccountsList: null
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                getAllBankAccountsList: null
                            });
                        }
                    ),
                    /**
                     * Handles catchError functionality
                     */
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
