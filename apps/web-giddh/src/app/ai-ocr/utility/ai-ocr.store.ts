import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { ToasterService } from "../../services/toaster.service";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { AiOcrService } from "../../services/ai-ocr.service";

export interface AiOcrState {
    ocrListInProgress: boolean;
    ocrList: any;
    ocrMainListInProgress: boolean;
    ocrMainList: any;
    ocrUploadInProgress: boolean;
    ocrUploadSuccess: any;
    ocrImportInProgress: boolean;
    ocrImportSuccess: any;
    ocrCompletedCount: any;
    ocrCompletedCountInProgress: boolean;
    ocrExtractDocuments: any;
    ocrExtractDocumentsInProgress: boolean;
}

export const DEFAULT_AI_OCR_VOUCHER_STATE: AiOcrState = {
    ocrListInProgress: null,
    ocrList: [],
    ocrMainListInProgress: null,
    ocrMainList: [],
    ocrUploadInProgress: null,
    ocrUploadSuccess: null,
    ocrImportInProgress: null,
    ocrImportSuccess: null,
    ocrCompletedCount: null,
    ocrCompletedCountInProgress: null,
    ocrExtractDocuments: null,
    ocrExtractDocumentsInProgress: null,
};

@Injectable()
export class AiOcrStore extends ComponentStore<AiOcrState> implements OnDestroy {
    constructor(
        private toasterService: ToasterService,
        private aiOcrService: AiOcrService,
        private store: Store<AppState>
    ) {
        super(DEFAULT_AI_OCR_VOUCHER_STATE);
    }

    /** Observable for the active company details. */
    public activeCompany$: Observable<any> = this.select(
        this.store.select((state) => state.session.activeCompany),
        (response) => response
    );
    /** Observable for the universal application date. */
    public universalDate$: Observable<any> = this.select(
        this.store.select((state) => state.session.applicationDate),
        (response) => response
    );
    /** Observable indicating the success state of OCR upload. */
    public ocrUploadSuccess$: Observable<any> = this.select((state) => state.ocrUploadSuccess);
    /** Observable indicating the progress state of OCR upload. */
    public ocrUploadInProgress$: Observable<any> = this.select((state) => state.ocrUploadInProgress);
    /** Observable indicating the success state of OCR import. */
    public ocrImportSuccess$: Observable<any> = this.select((state) => state.ocrImportSuccess);
    /** Observable for the list of OCR documents. */
    public ocrList$: Observable<any> = this.select((state) => state.ocrList);
    /** Observable for the completed count of OCR documents. */
    public ocrCompletedCount$: Observable<any> = this.select((state) => state.ocrCompletedCount);
    /** Observable indicating the progress state of completed count retrieval. */
    public ocrCompletedCountInProgress$: Observable<any> = this.select((state) => state.ocrCompletedCountInProgress);
    /** Observable for extracted OCR documents. */
    public ocrExtractDocuments$: Observable<any> = this.select((state) => state.ocrExtractDocuments);
    /** Observable indicating the progress state of document extraction. */
    public ocrExtractDocumentsInProgress$: Observable<any> = this.select(
        (state) => state.ocrExtractDocumentsInProgress
    );
    /** Observable for the main list of OCR documents. */
    public ocrMainList$: Observable<any> = this.select((state) => state.ocrMainList);
    /** Observable indicating the progress state of the main list retrieval. */
    public ocrMainListInProgress$: Observable<any> = this.select((state) => state.ocrMainListInProgress);
    /** Observable indicating the progress state of OCR import. */
    public ocrImportInProgress$: Observable<any> = this.select((state) => state.ocrImportInProgress);
    /** Observable for branch consolidation. */
    public branchConsolidated$: Observable<any> = this.select(
        this.store.select((state) => state.branchConsolidated),
        (response) => response
    );
    /** Observable for the list of OCR documents. */
    public branches$: Observable<any> = this.store.select((state) => state.settings.branches);

    /**
     * Effect to get all OCR documents.
     *
     * @memberof AiOcrStore
     */
    readonly getAllOcrList = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ ocrList: [], ocrListInProgress: true });
                return this.aiOcrService.getAllOcrDocuments(req?.pagination, req?.model, req?.ocrType).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === "success") {
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
                                ocrListInProgress: false,
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Effect to get all main page OCR data.
     *
     * @memberof AiOcrStore
     */
    readonly getAllMainPageOcrData = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ ocrMainList: [], ocrMainListInProgress: true });
                return this.aiOcrService.getAllOcrDocuments(req?.pagination, req?.model, req?.ocrType).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === "success") {
                                return this.patchState({
                                    ocrMainList: res?.body ?? [],
                                    ocrMainListInProgress: false,
                                });
                            } else {
                                this.toasterService.showSnackBar("error", res?.message);
                                return this.patchState({
                                    ocrMainList: [],
                                    ocrMainListInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                ocrMainList: [],
                                ocrMainListInProgress: false,
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Effect to upload OCR document.
     *
     * @memberof AiOcrStore
     */
    readonly uploadOcrDocument = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ ocrUploadInProgress: true, ocrUploadSuccess: null });
                return this.aiOcrService.uploadOcrDocument(req?.fileName).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === "success") {
                                return this.patchState({
                                    ocrUploadInProgress: false,
                                    ocrUploadSuccess: res.body,
                                });
                            } else {
                                this.toasterService.showSnackBar("error", res?.message);
                                return this.patchState({
                                    ocrUploadInProgress: false,
                                    ocrUploadSuccess: null,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                ocrUploadInProgress: false,
                                ocrUploadSuccess: null,
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Effect to import OCR document.
     *
     * @memberof AiOcrStore
     */
    readonly importOcrDocument = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ ocrImportInProgress: true, ocrImportSuccess: null });
                return this.aiOcrService.importOcrDocument(req?.signedUrlResponse, req?.ocrType).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === "success") {
                                this.toasterService.showSnackBar("success", res?.body?.message);
                                return this.patchState({
                                    ocrImportInProgress: false,
                                    ocrImportSuccess: res?.body,
                                });
                            } else {
                                this.toasterService.showSnackBar("error", res?.message);
                                return this.patchState({
                                    ocrImportInProgress: false,
                                    ocrImportSuccess: null,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                ocrImportInProgress: false,
                                ocrImportSuccess: null,
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Effect to get completed count of OCR documents.
     *
     * @memberof AiOcrStore
     */
    readonly getCompletedCount = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((ocrType) => {
                this.patchState({ ocrCompletedCount: null, ocrCompletedCountInProgress: true });
                return this.aiOcrService.getCompletedCount(ocrType).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === "success") {
                                return this.patchState({
                                    ocrCompletedCount: res?.body?.completedCount,
                                    ocrCompletedCountInProgress: false,
                                });
                            } else {
                                this.toasterService.showSnackBar("error", res?.message);
                                return this.patchState({
                                    ocrCompletedCountInProgress: false,
                                    ocrCompletedCount: null,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                ocrCompletedCountInProgress: false,
                                ocrCompletedCount: null,
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Effect to extract OCR documents.
     *
     * @memberof AiOcrStore
     */
    readonly getExtractDocuments = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ ocrExtractDocumentsInProgress: true, ocrExtractDocuments: undefined });
                return this.aiOcrService.getExtractDocuments(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === "success") {
                                return this.patchState({
                                    ocrExtractDocuments: res?.body,
                                    ocrExtractDocumentsInProgress: false,
                                });
                            } else {
                                this.toasterService.showSnackBar("error", res?.message);
                                return this.patchState({
                                    ocrExtractDocumentsInProgress: false,
                                    ocrExtractDocuments: null,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                ocrExtractDocumentsInProgress: false,
                                ocrExtractDocuments: null,
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Effect to reset OCR state.
     *
     * @memberof AiOcrStore
     */
    public reset(): void {
        this.setState(() => DEFAULT_AI_OCR_VOUCHER_STATE);
    }

    /**
     * Lifecycle hook for component destruction.
     *
     * @memberof AiOcrStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}