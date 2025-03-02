import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { ToasterService } from "../services/toaster.service";
import { catchError, EMPTY, Observable, switchMap } from "rxjs";
import { BaseResponse } from "../models/api-models/BaseResponse";
import { LedgerService } from "../services/ledger.service";

export interface LedgerState {
    ledgerBalance: any;
    signedUrlSuccess: any;
    uploadVoucherSuccess: boolean;
    importVoucherSuccess: any;
}

export const DEFAULT_LEDGER_STATE: LedgerState = {
    ledgerBalance: null,
    signedUrlSuccess: null,
    uploadVoucherSuccess: false,
    importVoucherSuccess: null
};

@Injectable()
export class LedgerComponentStore extends ComponentStore<LedgerState> implements OnDestroy {

    constructor(private toasterService: ToasterService,
        private ledgerService: LedgerService
    ) {
        super(DEFAULT_LEDGER_STATE);
    }
    public signedUrlSuccess$ = this.select((state) => state.signedUrlSuccess);
    public uploadVoucherSuccess$ = this.select((state) => state.uploadVoucherSuccess);
    public importVoucherSuccess$ = this.select((state) => state.importVoucherSuccess);

    /**
     * Get Ledger Balance
     *
     * @memberof LedgerComponentStore
     */
    readonly getLedgerBalance = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ ledgerBalance: null });
                return this.ledgerService.getLedgerBalance(req.trxRequest, req.payload).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    ledgerBalance: res.body
                                });
                            } else {
                                if (res?.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    ledgerBalance: null,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);

                            return this.patchState({
                                ledgerBalance: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Upload voucher
     *
     * @memberof LedgerComponentStore
     */
    readonly uploadVoucher= this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ uploadVoucherSuccess: false });
                return this.ledgerService.uploadVoucher(req.url, req.file).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res.statusText === "OK" ) {
                                return this.patchState({
                                    uploadVoucherSuccess: true
                                });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                return this.patchState({
                                    uploadVoucherSuccess: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                uploadVoucherSuccess: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Get Signed Url response
     *
     * @memberof LedgerComponentStore
     */
    readonly getSignedUrl= this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ signedUrlSuccess: null });
                return this.ledgerService.getSignedUrl(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    signedUrlSuccess: res.body
                                });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                return this.patchState({
                                    signedUrlSuccess: null
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                signedUrlSuccess: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     *  Import voucher
     *
     * @memberof LedgerComponentStore
     */
    readonly importVoucher = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ importVoucherSuccess: null });
                return this.ledgerService.importVoucher(req.requestObject, req.signedUrlResponse).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                console.log(res);
                                return this.patchState({
                                    importVoucherSuccess: res.body
                                });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                return this.patchState({
                                    importVoucherSuccess: null
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                importVoucherSuccess: null
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
     * @memberof ContactComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
