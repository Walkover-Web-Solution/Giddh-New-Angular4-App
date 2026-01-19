import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore  } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, tap } from "rxjs";
import { ToasterService } from "../../../services/toaster.service";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { InvoiceService } from "../../../services/invoice.service";

/**
 * EwayBillListState interface definition
 * Defines the structure and contract for EwayBillListState objects
 */
export interface EwayBillListState {
    fromPlace: string | null;
}

export const INITIAL_EWAY_BILL_STATE: EwayBillListState = {
    fromPlace: null
};

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * EwayBillComponentStore store
 * Manages ewaybillcomponent state using NgRx ComponentStore
 */
export class EwayBillComponentStore extends ComponentStore<EwayBillListState> implements OnDestroy {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private readonly toasterService: ToasterService,
        private readonly invoiceService: InvoiceService
    ) {
        /**
         * Handles super functionality
         */
        super(INITIAL_EWAY_BILL_STATE);
    }

    /**
     * Get e-way bill from place by pincode
     *
     * @param data Observable with request data
     * @returns Observable with response data
     */
    readonly getEwayBillFromPlace = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((request) => {
                return this.invoiceService.getEwayBillFromPlace(request).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (response: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (response?.status === 'success') {
                                return this.patchState({
                                    fromPlace: response.body ?? ''
                                });
                            } else {
                                this.toasterService.showSnackBar('error', response.message);
                            }
                        },
                        (error) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');
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
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}

