import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { ToasterService } from "../services/toaster.service";
import { catchError, EMPTY, Observable, switchMap } from "rxjs";
import { BaseResponse } from "../models/api-models/BaseResponse";
import { TlPlService } from "../services/tl-pl.service";

export interface FinancialReportsState {
    tailedReportIsSuccess: boolean;
}

export const DEFAULT_LEDGER_STATE: FinancialReportsState = {
    tailedReportIsSuccess: null
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

    readonly tailedReportAccountGroup = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ tailedReportIsSuccess: null });
                return this.tlPlService.tailedReportAccountGroup(req.reportType, req.payload).pipe(
                    tapResponse(
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
     * Lifecycle hook for component destroy
     *
     * @memberof LedgerComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
