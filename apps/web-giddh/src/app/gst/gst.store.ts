import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, tap } from "rxjs";
import { PurchaseInvoiceService } from "../services/purchase-invoice.service";
import { ToasterService } from "../services/toaster.service";
import { TaxServiceType } from "./constants/gst.constant";

/**
 * GstState interface definition
 * Defines the structure and contract for GstState objects
 */
export interface GstState {
    fileGstr3BSuccess: boolean | null;
}

const DEFAULT_STATE: GstState = {
    fileGstr3BSuccess: null
};

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * GstComponentStore store
 * Manages gstcomponent state using NgRx ComponentStore
 */
export class GstComponentStore extends ComponentStore<GstState> {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private purchaseInvoiceService: PurchaseInvoiceService,
        private toaster : ToasterService
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_STATE);
    }

    public fileGstr3BSuccess$ = this.select((state) => state.fileGstr3BSuccess);

    /**
     * File GSTR3B
     *
     * @memberof GstComponentStore
     */
    readonly fileGstr3B = this.effect((data: Observable<{ period: any, gstNumber: string, via: TaxServiceType, monthYear: string, currentDateTime: string }>) => {
        this.patchState({ fileGstr3BSuccess: false });
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                return this.purchaseInvoiceService.FileGstr3B(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: any) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.toaster.showSnackBar("success", res?.body);
                                this.patchState({
                                    fileGstr3BSuccess: true
                                });
                            } else {
                                this.toaster.showSnackBar("error", res?.message);
                                this.patchState({
                                    fileGstr3BSuccess: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            this.patchState({
                                fileGstr3BSuccess: false
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
     * @memberof BuyPlanComponentStore
     */
       public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
