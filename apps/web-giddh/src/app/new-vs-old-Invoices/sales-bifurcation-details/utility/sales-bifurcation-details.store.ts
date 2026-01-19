import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, tap } from "rxjs";
import { BaseResponse, CommonPaginatedResponse } from "../../../models/api-models/BaseResponse";
import { ToasterService } from "../../../services/toaster.service";
import { LocaleService } from "../../../services/locale.service";
import { SalesBifurcationDetailsService } from "./sales-bifurcation-details.service";

/**
 * SalesBifurcationDetailsState interface definition
 * Defines the structure and contract for SalesBifurcationDetailsState objects
 */
export interface SalesBifurcationDetailsState {
    salesBifurcationDetailsList: any;
    salesBifurcationDetailsListInProgress: boolean
}

export const DEFAULT_STATE: SalesBifurcationDetailsState = {
    salesBifurcationDetailsList: null,
    salesBifurcationDetailsListInProgress: false
};

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * SalesBifurcationDetailsStore store
 * Manages salesbifurcationdetails state using NgRx ComponentStore
 */
export class SalesBifurcationDetailsStore extends ComponentStore<SalesBifurcationDetailsState> implements OnDestroy {
    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private toasterService: ToasterService,
        private localeService: LocaleService,
        private salesBifurcationDetailsService: SalesBifurcationDetailsService
    ) {
        /**
         * Handles super functionality
         */
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
    readonly getAllSalesBifurcationDetails = this.effect((data: Observable<{ params: any }>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap(({ params }) => {
                this.patchState({ salesBifurcationDetailsList: null, salesBifurcationDetailsListInProgress: true });
                return this.salesBifurcationDetailsService.salesBifurcationDetails(params).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({
                                    salesBifurcationDetailsList: res.body,
                                    salesBifurcationDetailsListInProgress: false,
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
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
     * @memberof SalesBifurcationDetailsStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}