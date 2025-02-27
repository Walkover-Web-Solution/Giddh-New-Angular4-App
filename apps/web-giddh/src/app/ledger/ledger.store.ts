import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { ToasterService } from "../services/toaster.service";
import { catchError, EMPTY, Observable, switchMap } from "rxjs";
import { BaseResponse } from "../models/api-models/BaseResponse";
import { LedgerService } from "../services/ledger.service";

export interface LedgerState {
    ledgerBalance: any;
    importStatementSuccess: any;
}

export const DEFAULT_LEDGER_STATE: LedgerState = {
    ledgerBalance: null,
    importStatementSuccess: null
};

@Injectable()
export class LedgerComponentStore extends ComponentStore<LedgerState> implements OnDestroy {

    constructor(private toasterService: ToasterService,
        private ledgerService: LedgerService
    ) {
        super(DEFAULT_LEDGER_STATE);
    }
    public importStatementSuccess$ = this.select((state) => state.importStatementSuccess);
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

    readonly getImportStatement= this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ importStatementSuccess: null });
                return this.ledgerService.getDownloadAttachement(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    importStatementSuccess: res.body
                                });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                return this.patchState({
                                    importStatementSuccess: null,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                importStatementSuccess: null
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
