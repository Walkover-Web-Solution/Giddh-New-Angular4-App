
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { ToasterService } from "../../../services/toaster.service";
import { SettingsProfileService } from "../../../services/settings.profile.service";
import { AppState } from "../../../store";
import { Store } from "@ngrx/store";

export interface CompanyListState {
    companyListInProgress: boolean;
    companyList: any
    archiveCompanySuccess: any;
}

export const DEFAULT_COMPANY_LIST_STATE: CompanyListState = {
    companyListInProgress: false,
    companyList: null,
    archiveCompanySuccess: null
};

@Injectable()
export class CompanyListDialogComponentStore extends ComponentStore<CompanyListState> implements OnDestroy {

    constructor(
        private toasterService: ToasterService,
        private subscriptionService: SubscriptionsService,
        private settingsProfile: SettingsProfileService,
        private store: Store<AppState>
    ) {
        super(DEFAULT_COMPANY_LIST_STATE);
    }

    public isUpdateCompanySuccess$ = this.select(this.store.select(state => state.settings.updateProfileSuccess), (response) => response);

    /**
     * Get company list by subscription id
     *
     * @memberof CompanyListDialogComponentStore
     */
    readonly getCompanyListBySubscriptionId = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ companyListInProgress: true });
                return this.subscriptionService.getCompaniesListBySubscriptionID(req.model, req.subscriptionId, req?.params).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    companyList: res?.body ?? [],
                                    companyListInProgress: false,
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    companyList: [],
                                    companyListInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                companyList: [],
                                companyListInProgress: false
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
        readonly archiveCompany = this.effect((data: Observable<any>) => {
            return data.pipe(
                switchMap((req) => {
                    this.patchState({ archiveCompanySuccess: null });
                    return this.subscriptionService.setArchiveUnarchiveCompany(req).pipe(
                        tapResponse(
                            (res: BaseResponse<any, any>) => {
                                if (res?.status === 'success') {
                                    return this.patchState({
                                        archiveCompanySuccess: res?.body ?? []
                                    });
                                } else {
                                    if (res.message) {
                                        this.toasterService.showSnackBar('error', res.message);
                                    }
                                    return this.patchState({
                                        archiveCompanySuccess: null
                                    });
                                }
                            },
                            (error: any) => {
                                this.toasterService.showSnackBar("error", error);
                                return this.patchState({
                                    archiveCompanySuccess: null
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
