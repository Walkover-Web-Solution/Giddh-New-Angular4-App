import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, of, mergeMap } from "rxjs";
import { ToasterService } from "../../services/toaster.service";
import { VatService } from "../../services/vat.service";
import { GstReconcileService } from "../../services/gst-reconcile.service";

export interface VatReportState {
    isLoading: boolean;
    liabilityPaymentList: any;
    taxNumber: any;
}

const DEFAULT_STATE: VatReportState = {
    isLoading: false,
    liabilityPaymentList: null,
    taxNumber: null,
};

@Injectable()
export class VatReportComponentStore extends ComponentStore<VatReportState> {

    constructor(
        private toaster: ToasterService,
        private vatService: VatService,
        private gstReconcileService: GstReconcileService
    ) {
        super(DEFAULT_STATE);
    }

    public isLoading$ = this.select((state) => state.isLoading);

    /**
     *   save list of Payment Liability
     *
     * @memberof VatReportComponentStore
     */
    readonly getLiabilityPaymentList = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ liabilityPaymentList: null, isLoading: true });
                return this.vatService.getPaymentLiabilityList(req.payload, req.searchForm, req.isPaymentMode).pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success") {
                                return this.patchState({ liabilityPaymentList: res, isLoading: false });
                            } else {
                                if (res?.message) {
                                    this.toaster.showSnackBar("error", res.message);
                                }
                                return this.patchState({ liabilityPaymentList: null, isLoading: false });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ liabilityPaymentList: null, isLoading: false });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     *   get Tax Number
     *
     * @memberof VatReportComponentStore
     */
    readonly getTaxNumber = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ taxNumber: null, isLoading: true });
                return this.gstReconcileService.getTaxDetails().pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success") {
                                return this.patchState({ taxNumber: res, isLoading: false });
                            } else {
                                if (res?.message) {
                                    this.toaster.showSnackBar("error", res.message);
                                }
                                return this.patchState({ taxNumber: null, isLoading: false });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ taxNumber: null, isLoading: false });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });
}

