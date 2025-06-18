
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { ToasterService } from "../../services/toaster.service";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { OcrVoucherService } from "../../services/ocr-voucher.service";

export interface OcrVoucherState {
    ocrListInProgress: boolean;
    ocrList: any
}

export const DEFAULT_OCR_VOUCHER_STATE: OcrVoucherState = {
    ocrListInProgress: null,
    ocrList: []
};

@Injectable()
export class OcrVoucherStore extends ComponentStore<OcrVoucherState> implements OnDestroy {

    constructor(private toasterService: ToasterService,
        private ocrVoucherService: OcrVoucherService,
        private store: Store<AppState>
    ) {
        super(DEFAULT_OCR_VOUCHER_STATE);
    }

    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);

    /**
     * Get All Subscriptions
     *
     * @memberof SubscriptionComponentStore
     */
    readonly getAllOcrList = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ ocrListInProgress: true });
                return this.ocrVoucherService.getAllOcrDocuments(req?.pagination, req?.model).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    ocrList: res ?? [],
                                    ocrListInProgress: false,
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    ocrList: [],
                                    ocrListInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                ocrList: [],
                                ocrListInProgress: false
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
     * @memberof SubscriptionComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
