
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { ToasterService } from "../../../services/toaster.service";
import { CommonService } from "../../../services/common.service";
import { AppState } from "../../../store";
import { Store } from "@ngrx/store";
import { SettingsProfileService } from "../../../services/settings.profile.service";

export interface CompanyListState {
    companyListInProgress: boolean;
    companyList: any
    archiveCompanySuccess: boolean;
}

export const DEFAULT_PLAN_STATE: CompanyListState = {
    companyListInProgress: false,
    companyList: null,
    archiveCompanySuccess: null
};

@Injectable()
export class CompanyListComponentStore extends ComponentStore<CompanyListState> implements OnDestroy {

    constructor(private toasterService: ToasterService,
        private subscriptionService: SubscriptionsService,
        private store: Store<AppState>,
        private settingsProfile: SettingsProfileService,
        private commonService: CommonService) {
        super(DEFAULT_PLAN_STATE);
    }

    /**
     * Get All Plans
     *
     * @memberof PlanComponentStore
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
                                    this.toasterService.showSnackBar('success', res.message);
                                }
                                return this.patchState({
                                    companyList: [],
                                    companyListInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Error');
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
* Create Discount
*
* @memberof DiscountComponentStore
*/
    readonly archhiveCompany = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                return this.settingsProfile.PatchProfile('', req.companyUniqueName, req.status).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar('success', 'Company' + res?.body?.archiveStatus + 'successfully');
                                return this.patchState({
                                    archiveCompanySuccess: true
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    archiveCompanySuccess: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Error');
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
     * @memberof PlanComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
