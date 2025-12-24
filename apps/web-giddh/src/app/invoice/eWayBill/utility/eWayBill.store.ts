import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore  } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, tap } from "rxjs";
import { ToasterService } from "../../../services/toaster.service";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { InvoiceService } from "../../../services/invoice.service";

export interface EwayBillListState {
    fromPlace: string | null;
}

export const INITIAL_EWAY_BILL_STATE: EwayBillListState = {
    fromPlace: null
};

@Injectable()
export class EwayBillComponentStore extends ComponentStore<EwayBillListState> implements OnDestroy {

    constructor(
        private readonly toasterService: ToasterService,
        private readonly invoiceService: InvoiceService
    ) {
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
            switchMap((request) => {
                return this.invoiceService.getEwayBillFromPlace(request).pipe(
                    tap(
                        (response: BaseResponse<any, any>) => {
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

