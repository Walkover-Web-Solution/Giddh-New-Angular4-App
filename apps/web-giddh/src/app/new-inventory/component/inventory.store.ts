import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { AppState } from "../../store";
import { InventoryService } from "../../services/inventory.service";
import { catchError, EMPTY, Observable, of, switchMap } from "rxjs";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { ToasterService } from "../../services/toaster.service";
import { Router } from "@angular/router";
import { IDiscountList } from "../../models/api-models/SettingsDiscount";
import { SettingsDiscountService } from "../../services/settings.discount.service";
import { CommonService } from '../../services/common.service';
import { LedgerService } from "../../services/ledger.service";

export interface InventoryState {
    isLoading: boolean;
    discountsList: IDiscountList[];
    uploadAttachmentInProgress: boolean;
    uploadAttachmentIsSuccess: any;
    downloadAttachmentInProgress: boolean;
    downloadAttachmentIsSuccess: any;
}

const DEFAULT_STATE: InventoryState = {
    isLoading: false,
    discountsList: null,
    uploadAttachmentInProgress: false,
    uploadAttachmentIsSuccess: null,
    downloadAttachmentInProgress: false,
    downloadAttachmentIsSuccess: null
};

@Injectable()
export class InventoryComponentStore extends ComponentStore<any> {
    constructor(
        private store: Store<AppState>,
        private inventoryService: InventoryService,
        private settingsDiscountService: SettingsDiscountService,
        private toaster: ToasterService,
        public router: Router,
        private commonService: CommonService,
        private ledgerService: LedgerService
    ) {
        super(DEFAULT_STATE);
    }

    public isLoading$ = this.select((state) => state.isLoading);
    public discountsList$: Observable<any> = this.select((state) => state.discountsList);
    public uploadAttachmentIsSuccess$ = this.select((state) => state.uploadAttachmentIsSuccess);
    public uploadAttachmentInProgress$ = this.select((state) => state.uploadAttachmentInProgress);
    public downloadAttachmentIsSuccess$ = this.select((state) => state.downloadAttachmentIsSuccess);
    public downloadAttachmentInProgress$ = this.select((state) => state.downloadAttachmentInProgress);

    /**
     * This will use for Export Item Wise Report Data
     *
     * @memberof InventoryComponentStore
     */
    readonly exportStock = this.effect((data$: Observable<{ stockReportRequest: any, queryParams: any }>) => {
        return data$.pipe(
            switchMap((req) => {
                this.patchState({ isLoading: true });
                return this.inventoryService.getItemWiseReportExport(req.queryParams, req.stockReportRequest).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === "success" && typeof res?.body === "string") {
                                this.toaster.showSnackBar("success", res.body);
                                this.router.navigate(["/pages/downloads"]);
                                return this.patchState({
                                    isLoading: false
                                });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({
                                    isLoading: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                isLoading: false
                            });
                        }
                    ),
                )
            })
        );
    });
    /**
     * This will use for Export Variant Wise Report Data
     *
     * @memberof InventoryComponentStore
     */
    readonly exportVariant = this.effect((data$: Observable<{ stockReportRequest: any, queryParams: any }>) => {
        return data$.pipe(
            switchMap((req) => {
                this.patchState({ isLoading: true });
                return this.inventoryService.getVariantWiseReportExport(req.queryParams, req.stockReportRequest).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === "success" && typeof res?.body === "string") {
                                this.toaster.showSnackBar("success", res.body);
                                this.router.navigate(["/pages/downloads"]);
                                return this.patchState({
                                    isLoading: false
                                });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({
                                    isLoading: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                isLoading: false
                            });
                        }
                    ),
                )
            })
        );
    });

    /**
     * This will use for Export Group Wise Report Data
     *
     * @memberof InventoryComponentStore
     */
    readonly exportGroup = this.effect((data$: Observable<{ stockReportRequest: any, queryParams: any }>) => {
        return data$.pipe(
            switchMap((req) => {
                this.patchState({ isLoading: true });
                return this.inventoryService.getGroupWiseReportExport(req.queryParams, req.stockReportRequest).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === "success" && typeof res?.body === "string") {
                                this.toaster.showSnackBar("success", res.body);
                                this.router.navigate(["/pages/downloads"]);
                                return this.patchState({
                                    isLoading: false
                                });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({
                                    isLoading: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                isLoading: false
                            });
                        }
                    ),
                )
            })
        );
    });

    /**
     * This will use for Export Transaction Wise Report Data
     *
     * @memberof InventoryComponentStore
     */
    readonly exportTransaction = this.effect((data$: Observable<{ stockReportRequest: any, queryParams: any }>) => {
        return data$.pipe(
            switchMap((req) => {
                this.patchState({ isLoading: true });
                return this.inventoryService.getTransactionReportExport(req.queryParams, req.stockReportRequest).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === "success" && typeof res?.body === "string") {
                                this.toaster.showSnackBar("success", res.body);
                                this.router.navigate(["/pages/downloads"]);
                                return this.patchState({
                                    isLoading: false
                                });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({
                                    isLoading: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                isLoading: false
                            });
                        }
                    ),
                )
            })
        );
    });

    /**
     * Get All Discount List
     *
     * @memberof InventoryComponentStore
     */
    readonly getDiscountList = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                return this.settingsDiscountService.GetDiscounts().pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            const discounts = res?.body?.map(discount => {
                                discount['label'] = discount?.name;
                                discount['value'] = discount?.uniqueName;
                                return discount;
                            });
                            return this.patchState({
                                discountsList: discounts
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                discountsList: []
                            });
                        }
                    )
                );
            })
        );
    });

    /**
     * This will use for upload attachments
     *
     * @memberof InventoryComponentStore
     */
    readonly uploadAttachment = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ uploadAttachmentInProgress: true, uploadAttachmentIsSuccess: null });
                return this.commonService.uploadFile(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                return this.patchState({ uploadAttachmentInProgress: false, uploadAttachmentIsSuccess: res?.body });
                            } else {
                                this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ uploadAttachmentInProgress: false, uploadAttachmentIsSuccess: null });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                uploadAttachmentInProgress: false,
                                uploadAttachmentIsSuccess: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * This will use for download preview attachment
     *
     * @memberof InventoryComponentStore
     */
    readonly downloadPreviewAttachment = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ downloadAttachmentInProgress: true, downloadAttachmentIsSuccess: null });
                return this.ledgerService.DownloadAttachement(req?.uniqueName, req?.type).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                return this.patchState({ downloadAttachmentInProgress: false, downloadAttachmentIsSuccess: res?.body });
                            } else {
                                this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ downloadAttachmentInProgress: false, downloadAttachmentIsSuccess: null });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                downloadAttachmentInProgress: false,
                                downloadAttachmentIsSuccess: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Reset preview attachment state
     *
     * @memberof InventoryComponentStore
     */
    readonly resetDownloadPreviewAttachmentState = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({
                    downloadAttachmentIsSuccess: null
                });
                return of(null);
            })
        );
    });

    /**
     * Reset upload attachment state
     *
     * @memberof InventoryComponentStore
     */
    readonly resetUploadAttachmentState = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({
                    uploadAttachmentIsSuccess: null
                });
                return of(null);
            })
        );
    });
}
