import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, of, mergeMap } from "rxjs";
import { ToasterService } from "../../services/toaster.service";
import { VatService } from "../../services/vat.service";
import { GstReconcileService } from "../../services/gst-reconcile.service";
import { Store } from "@ngrx/store";
import { AppState } from "../../store";

export interface VatReportState {
    liabilityPaymentListInProgress: boolean;
    liabilityPaymentList: any;
    taxNumber: any;
}

const DEFAULT_STATE: VatReportState = {
    liabilityPaymentListInProgress: false,
    liabilityPaymentList: null,
    taxNumber: null
};

@Injectable()
export class VatReportComponentStore extends ComponentStore<VatReportState> {

    constructor(
        private toaster: ToasterService,
        private vatService: VatService,
        private gstReconcileService: GstReconcileService,
        private store: Store<AppState>,
    ) {
        super(DEFAULT_STATE);
    }

    public currentCompanyBranches$: Observable<any> = this.select(this.store.select(state => state.settings.branches), (response) => response);

    /**
    *   Save list of Payment Liability
    *
    * @memberof VatReportComponentStore
    */
    readonly getLiabilityPaymentList = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ liabilityPaymentList: null, liabilityPaymentListInProgress: true });
                return this.vatService.getPaymentLiabilityList(req.payload, req.searchForm, req.isPaymentMode).pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success") {
                                return this.patchState({ liabilityPaymentList: res, liabilityPaymentListInProgress: false });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ liabilityPaymentList: null, liabilityPaymentListInProgress: false });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ liabilityPaymentList: null, liabilityPaymentListInProgress: false });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
    *   Get Tax Number
    *
    * @memberof VatReportComponentStore
    */
    readonly getTaxNumber = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ taxNumber: null, liabilityPaymentListInProgress: true });
                return this.gstReconcileService.getTaxDetails().pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success") {
                                return this.patchState({ taxNumber: res, liabilityPaymentListInProgress: false });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ taxNumber: null, liabilityPaymentListInProgress: false });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ taxNumber: null, liabilityPaymentListInProgress: false });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });
}

