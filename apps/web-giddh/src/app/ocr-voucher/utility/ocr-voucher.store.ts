
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
    ocrUploadInProgress: boolean;
    ocrUploadSuccess: any;
    ocrImportInProgress: boolean;
    ocrImportSuccess: any;
    ocrCompletedCount: any;
    ocrCompletedCountInProgress: boolean;
}

export const DEFAULT_OCR_VOUCHER_STATE: OcrVoucherState = {
    ocrListInProgress: null,
    ocrList: [],
    ocrUploadInProgress: null,
    ocrUploadSuccess: null,
    ocrImportInProgress: null,
    ocrImportSuccess: null,
    ocrCompletedCount: null,
    ocrCompletedCountInProgress: null
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
    public universalDate$: Observable<any> = this.select(this.store.select(state =>  state.session.applicationDate), (response) => response);
    public ocrUploadSuccess$: Observable<any> = this.select((state) => state.ocrUploadSuccess);
    public ocrImportSuccess$: Observable<any> = this.select((state) => state.ocrImportSuccess);
    public ocrList$: Observable<any> = this.select((state) => state.ocrList);
    public ocrCompletedCount$: Observable<any> = this.select((state) => state.ocrCompletedCount);
    public ocrCompletedCountInProgress$: Observable<any> = this.select((state) => state.ocrCompletedCountInProgress);

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
                                    ocrList: res?.body ?? [],
                                    ocrListInProgress: false,
                                });
                            } else {
                                this.toasterService.showSnackBar("error", res?.message);
                                return this.patchState({
                                    ocrList: [],
                                    ocrListInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
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

    readonly uploadOcrDocument = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ ocrUploadInProgress: true, ocrUploadSuccess: null });
                return this.ocrVoucherService.uploadOcrDocument(req?.fileName).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            console.log(res);
                            if (res?.status === 'success') {
                                return this.patchState({
                                    ocrUploadInProgress: false,
                                    ocrUploadSuccess: res.body
                                });
                            } else {
                                this.toasterService.showSnackBar("error", res?.message);
                                return this.patchState({
                                    ocrUploadInProgress: false,
                                    ocrUploadSuccess: null
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                ocrUploadInProgress: false,
                                ocrUploadSuccess: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly importOcrDocument = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ ocrImportInProgress: true, ocrImportSuccess: null });
                return this.ocrVoucherService.importOcrDocument(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar("success", res?.body?.message);
                                return this.patchState({
                                    ocrImportInProgress: false
                                });
                            } else {
                                this.toasterService.showSnackBar("error", res?.message);
                                return this.patchState({
                                    ocrImportInProgress: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                ocrImportInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getCompletedCount = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ ocrCompletedCountInProgress: true });
                return this.ocrVoucherService.getCompletedCount().pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    ocrCompletedCount: res?.body,
                                    ocrCompletedCountInProgress: false
                                });
                            } else {
                                this.toasterService.showSnackBar("error", res?.message);
                                return this.patchState({
                                    ocrCompletedCountInProgress: false,
                                    ocrCompletedCount: null
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                ocrCompletedCountInProgress: false,
                                ocrCompletedCount: null
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
