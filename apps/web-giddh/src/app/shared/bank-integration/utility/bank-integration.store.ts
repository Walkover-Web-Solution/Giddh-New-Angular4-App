
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tap } from "rxjs/operators";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { ToasterService } from "../../../services/toaster.service";
import { SettingsIntegrationService } from "../../../services/settings.integration.service";

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

@Injectable()
export class BankIntegrationComponentStore extends ComponentStore<BankIntegrationState> implements OnDestroy {

    constructor(
        private toasterService: ToasterService,
        private settingsIntegrationService: SettingsIntegrationService
    ) {
        super(DEFAULT_BANK_INTEGRATION_STATE);
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
                    tap(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                this.patchState({
                                    institutionList: res.body,
                                    institutionsListInProgress: false
                                });
                            } else {
                                this.toasterService.showSnackBar("error", res.message);
                                this.patchState({
                                    institutionList: null,
                                    institutionsListInProgress: false
                                });
                            }
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
                    tap(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                this.patchState({
                                    requisitionList: res.body,
                                    requistionListInProgress: false
                                });
                            } else {
                                this.toasterService.showSnackBar("error", res.message);
                                this.patchState({
                                    requisitionList: null,
                                    requistionListInProgress: false
                                });
                            }
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
                    tap(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.patchState({
                                    createEndUserAgreementSuccess: true
                                });
                            } else {
                                this.toasterService.showSnackBar("error", res.message);
                                this.patchState({
                                    createEndUserAgreementSuccess: false
                                });
                            }
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
                    tap(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.patchState({
                                    deleteAccountSuccess: true
                                });
                            } else {
                                this.toasterService.showSnackBar("error", res.message);
                                this.patchState({
                                    deleteAccountSuccess: false
                                });
                            }
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
