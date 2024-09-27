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
    getTaxNumberInProgress: boolean;
    connectToHMRCUrl: any;
    getHMRCInProgress: boolean;
    obligationList: any;
    getObligationListInProgress: boolean;
}

const DEFAULT_STATE: VatReportState = {
    liabilityPaymentListInProgress: false,
    liabilityPaymentList: null,
    taxNumber: null,
    getTaxNumberInProgress: false,
    connectToHMRCUrl: null,
    getHMRCInProgress: false,
    obligationList: null,
    getObligationListInProgress: false
};

@Injectable()
export class VatReportComponentStore extends ComponentStore<VatReportState> {

    constructor(
        private toaster: ToasterService,
        private vatService: VatService,
        private gstReconcileService: GstReconcileService,
        private store: Store<AppState>
    ) {
        super(DEFAULT_STATE);
    }
    public liabilityPaymentListInProgress$ = this.select(state => state.liabilityPaymentListInProgress);
    public getObligationListInProgress$ = this.select(state => state.getObligationListInProgress);
    public getTaxNumberInProgress$ = this.select(state => state.getTaxNumberInProgress);
    public getHMRCInProgress$ = this.select(state => state.getHMRCInProgress);

    public currentCompanyBranches$: Observable<any> = this.select(this.store.select(state => state.settings.branches), (response) => response);
    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    public universalDate$: Observable<any> = this.select(this.store.select(state => state.session.applicationDate), (response) => response);

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
                this.patchState({ taxNumber: null, getTaxNumberInProgress: true });
                return this.gstReconcileService.getTaxDetails().pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success") {
                                return this.patchState({ taxNumber: res, getTaxNumberInProgress: false });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ taxNumber: null, getTaxNumberInProgress: false });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ taxNumber: null, getTaxNumberInProgress: false });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
    * This will call API to get HMRC get authorization url
    *
    * @memberof VatReportComponentStore
    */
    readonly getHMRCAuthorization = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ connectToHMRCUrl: null, getHMRCInProgress: true });
                return this.vatService.getHMRCAuthorization(req).pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success") {
                                return this.patchState({ connectToHMRCUrl: res, getHMRCInProgress: false });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ connectToHMRCUrl: null, getHMRCInProgress: false });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ connectToHMRCUrl: null, getHMRCInProgress: false });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * VAT Obligations API Call
     *
     * @memberof VatReportComponentStore
     */
    readonly getVatObligations = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ obligationList: null, getObligationListInProgress: true });
                return this.vatService.getVatObligations(req.companyUniqueName, req.payload).pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success") {
                                return this.patchState({ obligationList: res, getObligationListInProgress: false });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ obligationList: null, getObligationListInProgress: false });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ obligationList: null, getObligationListInProgress: false });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });
}

