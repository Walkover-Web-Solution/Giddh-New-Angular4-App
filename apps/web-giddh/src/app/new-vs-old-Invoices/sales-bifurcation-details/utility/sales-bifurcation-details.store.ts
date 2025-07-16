import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse, CommonPaginatedResponse } from "../../../models/api-models/BaseResponse";
import { ToasterService } from "../../../services/toaster.service";
import { LocaleService } from "../../../services/locale.service";
import { SalesBifurcationDetailsService } from "./sales-bifurcation-details.service";
import { HttpMethod } from "../../../app.constant";

export interface SalesBifurcationDetailsState {
    salesBifurcationDetailsList: CommonPaginatedResponse<any>;
    salesBifurcationDetailsListInProgress: boolean
}

export const DEFAULT_STATE: SalesBifurcationDetailsState = {
    salesBifurcationDetailsList: null,
    salesBifurcationDetailsListInProgress: false
};

@Injectable()
export class SalesBifurcationDetailsStore extends ComponentStore<SalesBifurcationDetailsState> implements OnDestroy {
    constructor(
        private toasterService: ToasterService,
        private localeService: LocaleService,
        private salesBifurcationDetailsService: SalesBifurcationDetailsService
    ) {
        super(DEFAULT_STATE);
    }

    /** Sales Bifurcation Details List */
    public salesBifurcationDetailsList$: Observable<CommonPaginatedResponse<any>> = this.select((state) => state.salesBifurcationDetailsList);
    /** Sales Bifurcation Details List In Progress */
    public salesBifurcationDetailsListInProgress$: Observable<boolean> = this.select((state) => state.salesBifurcationDetailsListInProgress);

    /**
     * Get All Sales Bifurcation Details
     * 
     * @param {params: any} params – when true, maps `res.body.results` to an array of
     *   `{ label: item.name, value: item.uniqueName }` for dropdowns.
     * @memberof SalesBifurcationDetailsStore
     */
    readonly getAllSalesBifurcationDetails = this.effect((data: Observable<{params: any }>) => {
        return data.pipe(
            switchMap(({ params }) => {
                this.patchState({ salesBifurcationDetailsListInProgress: true });
                return this.salesBifurcationDetailsService.salesBifurcationDetails(HttpMethod.GET, null, null, params).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                let response = res?.body;
                                this.patchState({
                                    salesBifurcationDetailsList: response,
                                    salesBifurcationDetailsListInProgress: false,
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    salesBifurcationDetailsList: null,
                                    salesBifurcationDetailsListInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', this.localeService.translate("app_something_went_wrong"));
                            return this.patchState({
                                salesBifurcationDetailsList: null,
                                salesBifurcationDetailsListInProgress: false
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
     * @memberof SalesBifurcationDetailsStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}