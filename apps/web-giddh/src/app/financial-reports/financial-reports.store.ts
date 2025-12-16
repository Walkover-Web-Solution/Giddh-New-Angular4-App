import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tap } from "rxjs/operators";
import { ToasterService } from "../services/toaster.service";
import { catchError, EMPTY, Observable, switchMap } from "rxjs";
import { BaseResponse } from "../models/api-models/BaseResponse";
import { TlPlService } from "../services/tl-pl.service";

export interface FinancialReportsState {
    tailedReportIsSuccess: boolean;
    reconcileDateRange: { mode: boolean, fromDate: string, toDate: string } | null;
}

export const DEFAULT_LEDGER_STATE: FinancialReportsState = {
    tailedReportIsSuccess: null,
    reconcileDateRange: null
};

@Injectable()
export class FinancialReportsComponentStore extends ComponentStore<FinancialReportsState> implements OnDestroy {

    constructor(
        private toasterService: ToasterService,
        private tlPlService: TlPlService
    ) {
        super(DEFAULT_LEDGER_STATE);
    }
    public tailedReportIsSuccess$ = this.select((state) => state.tailedReportIsSuccess);
    public reconcileDateRange$ = this.select((state) => state.reconcileDateRange);

    /**
     * Tailed report account group
     *
     * @param {Observable<any>} data
     * @returns {Observable<any>}
     * @memberof FinancialReportsComponentStore
     */
    readonly tailedReportAccountGroup = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ tailedReportIsSuccess: null });
                return this.tlPlService.tailedReportAccountGroup(req.request, req.payload).pipe(
                    tap(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    tailedReportIsSuccess: true
                                });
                            } else {
                                if (res?.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    tailedReportIsSuccess: null,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);

                            return this.patchState({
                                tailedReportIsSuccess: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Get reconcile option
     *
     * @memberof FinancialReportsComponentStore
     */
    readonly getReconcileDateRange = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ reconcileDateRange: undefined });
                return this.tlPlService.getReconcileDateRange(req.reportType, req.branchUniqueName).pipe(
                    tap(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    reconcileDateRange: res?.body
                                });
                            } else {
                                if (res?.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    reconcileDateRange: null,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);

                            return this.patchState({
                                reconcileDateRange: null
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
     * @memberof FinancialReportsComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
