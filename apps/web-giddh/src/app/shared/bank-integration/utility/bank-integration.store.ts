
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tapResponse } from "@ngrx/operators";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { ToasterService } from "../../../services/toaster.service";
import { SettingsIntegrationService } from "../../../services/settings.integration.service";

/**
 * BankIntegrationState interface definition
 * Defines the structure and contract for BankIntegrationState objects
 */
export interface BankIntegrationState {
    institutionList: any;
    requisitionList: any;
    institutionsListInProgress: boolean;
    requistionListInProgress: boolean;
    createEndUserAgreementSuccess: any;
    deleteAccountSuccess: any;
}

export const DEFAULT_BANK_INTEGRATION_STATE: BankIntegrationState = {
    institutionList: null,
    requisitionList: null,
    institutionsListInProgress: null,
    requistionListInProgress: null,
    createEndUserAgreementSuccess: null,
    deleteAccountSuccess: null
};

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * BankIntegrationComponentStore store
 * Manages bankintegrationcomponent state using NgRx ComponentStore
 */
export class BankIntegrationComponentStore extends ComponentStore<BankIntegrationState> implements OnDestroy {

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
        super(DEFAULT_BANK_INTEGRATION_STATE);
    }

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
                     * Handles tapResponse functionality
                     */
                    tapResponse(
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
                     * Handles tapResponse functionality
                     */
                    tapResponse(
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
                     * Handles tapResponse functionality
                     */
                    tapResponse(
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
                     * Handles tapResponse functionality
                     */
                    tapResponse(
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
     * Lifecycle hook for component destroy
     *
     * @memberof SettingIntegrationComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
